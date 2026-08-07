import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { dbStore } from '../src/db/dbStore';
import { processInboundSMSWithGemini } from '../src/services/geminiIsa';
import { sendSMSViaTwilio } from '../src/services/twilioService';
import { syncToFollowUpBoss } from '../src/services/fubService';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Helper function to process FUB personCreated webhook
async function processFubWebhookPayload(payload: any) {
  const tenantId = payload.tenantId || 'tenant_yorkville_01';
  const tenant = dbStore.getTenantById(String(tenantId)) || dbStore.getTenants()[0];

  const fubData = payload.data || payload.person || payload;
  const fubPersonId = String(fubData.id || `fub_${Date.now()}`);
  const name = fubData.name || `${fubData.firstName || 'Inbound'} ${fubData.lastName || 'Prospect'}`.trim();
  const phone = fubData.phone || fubData.phones?.[0]?.value || '+1416555' + Math.floor(1000 + Math.random() * 9000);
  const email = fubData.email || fubData.emails?.[0]?.value || 'lead@toronto-realestate.ca';

  let lead = dbStore.getLeadByFubId(fubPersonId, tenant.id);
  if (!lead) {
    lead = dbStore.createLead({
      tenant_id: tenant.id,
      fub_person_id: fubPersonId,
      name,
      phone,
      email,
      qualification_stage: 'New',
      timeline: 'Immediate',
      budget: '$2.5M - $4.0M',
      pre_approved: true,
      representation_status: 'Needs_Verification',
      search_criteria: `Inquiry via ${fubData.source || 'Realtor.ca Luxury Listing'}`,
      notes: 'Created via Follow Up Boss personCreated Webhook',
      tags: ['FUB_Webhook_Inbound', 'SpeedToLead_Initiated']
    });
  }

  const initialOutreachBody = `Hi ${lead.name}! Thanks for reaching out to ${tenant.team_name}. Are you currently looking to buy or sell a property in the Toronto area in the next 30-90 days?`;
  const twilioRes = await sendSMSViaTwilio(tenant, lead.phone, initialOutreachBody);

  const msg = dbStore.addMessage({
    lead_id: lead.id,
    direction: 'outbound',
    body: initialOutreachBody,
    status: twilioRes.success ? 'delivered' : 'failed',
    ai_reasoning: 'Automated speed-to-lead initial outreach triggered on FUB personCreated webhook.'
  });

  dbStore.addNotification({
    tenant_id: tenant.id,
    lead_id: lead.id,
    event_type: 'WEBHOOK_RECEIVED',
    title: 'Inbound FUB Lead Ingested',
    message: `New prospect ${lead.name} (${lead.phone}) created via Follow Up Boss Webhook. Speed-to-Lead SMS dispatched.`
  });

  await syncToFollowUpBoss(
    tenant,
    lead,
    `Speed-to-lead SMS sent automatically within 15 seconds: "${initialOutreachBody}"`,
    ['SpeedToLead_SMS_Sent', 'ISA_Active'],
    'Engaged'
  );

  return {
    success: true,
    message: 'FUB Webhook processed successfully',
    leadId: lead.id,
    outreachMessageId: msg.id,
    twilioStatus: twilioRes.status
  };
}

// Create an express router for API endpoints
const router = express.Router();

// Webhook 1: FUB
router.post('/v1/webhooks/fub', async (req: Request, res: Response) => {
  try {
    const result = await processFubWebhookPayload(req.body || {});
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Webhook 2: Twilio SMS
router.post('/v1/webhooks/twilio', async (req: Request, res: Response) => {
  try {
    const fromPhone = req.body.From || req.body.from || req.body.phone;
    const inboundBody = req.body.Body || req.body.body || req.body.text || '';
    const tenantId = req.query.tenantId || req.body.tenantId;

    if (!fromPhone || !inboundBody) {
      res.status(400).send('<Response><Message>Invalid SMS payload</Message></Response>');
      return;
    }

    let tenant = tenantId ? dbStore.getTenantById(String(tenantId)) : undefined;
    let lead = dbStore.getLeadByPhone(fromPhone, tenant?.id);

    if (!lead) {
      tenant = tenant || dbStore.getTenants()[0];
      lead = dbStore.createLead({
        tenant_id: tenant.id,
        fub_person_id: `fub_auto_${Date.now()}`,
        name: `Prospect (${fromPhone.slice(-4)})`,
        phone: fromPhone,
        email: 'unregistered@sms-inbound.ca',
        qualification_stage: 'New',
        timeline: 'Unknown',
        budget: 'Unknown',
        pre_approved: false,
        representation_status: 'Needs_Verification',
        notes: 'Lead created directly from incoming SMS webhook.'
      });
    } else if (!tenant) {
      tenant = dbStore.getTenantById(lead.tenant_id) || dbStore.getTenants()[0];
    }

    dbStore.addMessage({
      lead_id: lead.id,
      direction: 'inbound',
      body: inboundBody,
      status: 'received'
    });

    const history = dbStore.getMessages(lead.id);
    const geminiResult = await processInboundSMSWithGemini(tenant, lead, history, inboundBody);
    const twilioRes = await sendSMSViaTwilio(tenant, lead.phone, geminiResult.replyMessage);

    const outboundMsg = dbStore.addMessage({
      lead_id: lead.id,
      direction: 'outbound',
      body: geminiResult.replyMessage,
      status: twilioRes.success ? 'delivered' : 'failed',
      ai_reasoning: geminiResult.aiReasoning
    });

    const updatedLead = dbStore.updateLead(lead.id, {
      qualification_stage: geminiResult.qualificationStage,
      timeline: geminiResult.timelineExtracted || lead.timeline,
      budget: geminiResult.budgetExtracted || lead.budget,
      pre_approved: geminiResult.preApprovedExtracted ?? lead.pre_approved,
      representation_status: geminiResult.representationStatus || lead.representation_status,
      search_criteria: geminiResult.searchCriteriaExtracted || lead.search_criteria,
      tags: Array.from(new Set([...(lead.tags || []), ...(geminiResult.fubTagsToAdd || [])]))
    });

    await syncToFollowUpBoss(
      tenant,
      updatedLead,
      `Gemini ISA Reply: "${geminiResult.replyMessage}"\nReasoning: ${geminiResult.aiReasoning}`,
      geminiResult.fubTagsToAdd || [],
      geminiResult.qualificationStage
    );

    if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
      res.type('text/xml').send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${geminiResult.replyMessage}</Message></Response>`);
    } else {
      res.status(200).json({
        success: true,
        lead: updatedLead,
        reply: geminiResult.replyMessage,
        outboundMessageId: outboundMsg.id,
        geminiResult
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Tenants
router.get('/v1/tenants', (req: Request, res: Response) => {
  res.json({ tenants: dbStore.getTenants() });
});

router.post('/v1/tenants', (req: Request, res: Response) => {
  const newTenant = dbStore.createTenant(req.body);
  res.status(201).json({ tenant: newTenant });
});

router.get('/v1/tenants/:id/settings', (req: Request, res: Response) => {
  const tenant = dbStore.getTenantById(req.params.id);
  if (!tenant) {
    res.status(404).json({ error: 'Tenant not found' });
    return;
  }
  res.json({ tenant });
});

router.put('/v1/tenants/:id/settings', (req: Request, res: Response) => {
  try {
    const updated = dbStore.updateTenant(req.params.id, req.body);
    res.json({ tenant: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// KPIs
router.get('/v1/dashboard/kpis', (req: Request, res: Response) => {
  const tenantId = req.query.tenantId as string;
  res.json({ kpis: dbStore.getKPIs(tenantId) });
});

// Leads
router.get('/v1/leads', (req: Request, res: Response) => {
  const tenantId = req.query.tenantId as string;
  res.json({ leads: dbStore.getLeads(tenantId) });
});

router.get('/v1/leads/:id/messages', (req: Request, res: Response) => {
  res.json({ messages: dbStore.getMessages(req.params.id) });
});

router.post('/v1/leads/:id/simulate-inbound', async (req: Request, res: Response) => {
  try {
    const leadId = req.params.id;
    const inboundBody = req.body.body || req.body.message || '';
    const lead = dbStore.getLeadById(leadId);
    if (!lead) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }
    const tenant = dbStore.getTenantById(lead.tenant_id) || dbStore.getTenants()[0];

    dbStore.addMessage({
      lead_id: lead.id,
      direction: 'inbound',
      body: inboundBody,
      status: 'received'
    });

    const history = dbStore.getMessages(lead.id);
    const geminiResult = await processInboundSMSWithGemini(tenant, lead, history, inboundBody);
    const twilioRes = await sendSMSViaTwilio(tenant, lead.phone, geminiResult.replyMessage);

    const outboundMsg = dbStore.addMessage({
      lead_id: lead.id,
      direction: 'outbound',
      body: geminiResult.replyMessage,
      status: twilioRes.success ? 'delivered' : 'failed',
      ai_reasoning: geminiResult.aiReasoning
    });

    const updatedLead = dbStore.updateLead(lead.id, {
      qualification_stage: geminiResult.qualificationStage,
      timeline: geminiResult.timelineExtracted || lead.timeline,
      budget: geminiResult.budgetExtracted || lead.budget,
      pre_approved: geminiResult.preApprovedExtracted ?? lead.pre_approved,
      representation_status: geminiResult.representationStatus || lead.representation_status,
      search_criteria: geminiResult.searchCriteriaExtracted || lead.search_criteria,
      tags: Array.from(new Set([...(lead.tags || []), ...(geminiResult.fubTagsToAdd || [])]))
    });

    const fubRes = await syncToFollowUpBoss(
      tenant,
      updatedLead,
      `Gemini ISA reply: ${geminiResult.replyMessage}`,
      geminiResult.fubTagsToAdd || [],
      geminiResult.qualificationStage
    );

    res.json({
      success: true,
      lead: updatedLead,
      outboundMessage: outboundMsg,
      geminiResult,
      fubSync: fubRes
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/v1/simulate-fub-webhook', async (req: Request, res: Response) => {
  try {
    const tenantId = req.body.tenantId || 'tenant_yorkville_01';
    const tenant = dbStore.getTenantById(tenantId) || dbStore.getTenants()[0];
    const sampleNames = ['Victoria Tremblay', 'Jonathan Blake', 'Harrison Forde', 'Camilla Sterling', 'Julien St-Pierre'];
    const sampleLocations = ['Yorkville Penthouse', 'Bridle Path Estate', 'Rosedale Heritage', 'Forest Hill Manor'];
    const name = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const loc = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
    const randomPhone = `+1416555${Math.floor(1000 + Math.random() * 9000)}`;

    const fakeFubPayload = {
      event: 'personCreated',
      tenantId: tenant.id,
      data: {
        id: `fub_sim_${Date.now()}`,
        name,
        phone: randomPhone,
        email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@gta-buyer.ca`,
        stage: 'New Lead',
        source: `Realtor.ca Listing - ${loc}`
      }
    };

    const data = await processFubWebhookPayload(fakeFubPayload);
    res.json({ success: true, simulatedPayload: fakeFubPayload, result: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/v1/pilot-request', async (req: Request, res: Response) => {
  try {
    const { fullName, brokerageName, teamSize, currentCrm, leadVolume, email, phone, notes } = req.body;
    const resendApiKey = process.env.RESEND_API_KEY;
    let emailStatus = 'simulated';

    if (resendApiKey && resendApiKey.startsWith('re_')) {
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: 'ARGUS AI Pilot Desk <onboarding@resend.dev>',
            to: [email, 'kingnarmer702@gmail.com'],
            subject: `ARGUS AI Pilot Partnership Request - ${brokerageName}`,
            html: `
              <h2>ARGUS AI Luxury Brokerage Pilot Application</h2>
              <p><strong>Full Name:</strong> ${fullName}</p>
              <p><strong>Brokerage:</strong> ${brokerageName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Team Size:</strong> ${teamSize}</p>
              <p><strong>Current CRM:</strong> ${currentCrm}</p>
              <p><strong>Monthly Lead Volume:</strong> ${leadVolume}</p>
              <p><strong>Notes:</strong> ${notes || 'None'}</p>
            `
          })
        });
        if (resendResponse.ok) {
          emailStatus = 'sent_via_resend';
        }
      } catch (resendErr) {
        console.warn('Resend email dispatch error:', resendErr);
      }
    }

    res.json({
      success: true,
      message: 'Pilot request received successfully',
      emailStatus
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/v1/leads/:id/resolve-escalation', (req: Request, res: Response) => {
  try {
    const { newStage, representationStatus, note } = req.body;
    const updated = dbStore.resolveEscalatedLead(req.params.id, newStage, representationStatus, note);
    if (!updated) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }
    res.json({ success: true, lead: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/v1/notifications', (req: Request, res: Response) => {
  const tenantId = req.query.tenantId as string;
  res.json({ notifications: dbStore.getNotifications(tenantId) });
});

router.put('/v1/notifications/:id/read', (req: Request, res: Response) => {
  dbStore.markNotificationRead(req.params.id);
  res.json({ success: true });
});

router.put('/v1/notifications/read-all', (req: Request, res: Response) => {
  const tenantId = req.query.tenantId as string;
  dbStore.markAllNotificationsRead(tenantId);
  res.json({ success: true });
});

router.get('/v1/health/integrations', (req: Request, res: Response) => {
  res.json({ health: dbStore.getIntegrationHealth() });
});

router.get('/v1/db/schema', (req: Request, res: Response) => {
  try {
    const schemaPath = path.join(process.cwd(), 'src', 'db', 'schema.sql');
    const sqlContent = fs.readFileSync(schemaPath, 'utf-8');
    res.type('text/plain').send(sqlContent);
  } catch (err: any) {
    res.status(500).send('-- Schema file not found');
  }
});

// Mount router under both `/api` and `/` so requests like `/api/v1/...` and `/v1/...` work identically
app.use('/api', router);
app.use('/', router);

export default app;
