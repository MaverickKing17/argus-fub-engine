import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { dbStore } from './src/db/dbStore.js';
import { processInboundSMSWithGemini } from './src/services/geminiIsa.js';
import { sendSMSViaTwilio } from './src/services/twilioService.js';
import { syncToFollowUpBoss } from './src/services/fubService.js';
import fs from 'fs';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS headers
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

  // -------------------------------------------------------------
  // WEBHOOK 1: FUB personCreated Webhook
  // POST /api/v1/webhooks/fub
  // -------------------------------------------------------------
  app.post('/api/v1/webhooks/fub', async (req: Request, res: Response) => {
    try {
      console.log('Received FUB Webhook payload:', JSON.stringify(req.body));
      const payload = req.body || {};
      
      // FUB Webhook payload structure: { event: 'personCreated', data: { id: 1234, name: '...', phone: '...', email: '...' }, tenantId?: '...' }
      const tenantId = payload.tenantId || req.query.tenantId || 'tenant_yorkville_01';
      const tenant = dbStore.getTenantById(String(tenantId)) || dbStore.getTenants()[0];

      const fubData = payload.data || payload.person || payload;
      const fubPersonId = String(fubData.id || `fub_${Date.now()}`);
      const name = fubData.name || `${fubData.firstName || 'Inbound'} ${fubData.lastName || 'Prospect'}`.trim();
      const phone = fubData.phone || fubData.phones?.[0]?.value || '+1416555' + Math.floor(1000 + Math.random() * 9000);
      const email = fubData.email || fubData.emails?.[0]?.value || 'lead@toronto-realestate.ca';

      // Check if lead already exists
      let lead = dbStore.getLeadByFubId(fubPersonId, tenant.id);
      if (!lead) {
        lead = dbStore.createLead({
          tenant_id: tenant.id,
          fub_person_id: fubPersonId,
          name,
          phone,
          email,
          qualification_stage: 'New',
          timeline: 'Unknown',
          budget: 'Unknown',
          pre_approved: false,
          representation_status: 'Needs_Verification',
          notes: 'Created via Follow Up Boss personCreated Webhook',
          tags: ['FUB_Webhook_Inbound', 'SpeedToLead_Initiated']
        });
      }

      // Automated initial outreach SMS via Twilio within 30 seconds
      const initialOutreachBody = `Hi ${lead.name}! Thanks for reaching out to ${tenant.team_name}. Are you currently looking to buy or sell a property in the Toronto area in the next 30-90 days?`;
      
      const twilioRes = await sendSMSViaTwilio(tenant, lead.phone, initialOutreachBody);

      // Log outbound message
      const msg = dbStore.addMessage({
        lead_id: lead.id,
        direction: 'outbound',
        body: initialOutreachBody,
        status: twilioRes.success ? 'delivered' : 'failed',
        ai_reasoning: 'Automated speed-to-lead initial outreach triggered on FUB personCreated webhook.'
      });

      // Sync back to FUB
      await syncToFollowUpBoss(
        tenant,
        lead,
        `Speed-to-lead SMS sent automatically within 15 seconds: "${initialOutreachBody}"`,
        ['SpeedToLead_SMS_Sent', 'ISA_Active'],
        'Engaged'
      );

      res.status(200).json({
        success: true,
        message: 'FUB Webhook processed successfully',
        leadId: lead.id,
        outreachMessageId: msg.id,
        twilioStatus: twilioRes.status
      });
    } catch (err: any) {
      console.error('Error handling FUB Webhook:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // -------------------------------------------------------------
  // WEBHOOK 2: Twilio Inbound SMS Webhook
  // POST /api/v1/webhooks/twilio
  // -------------------------------------------------------------
  app.post('/api/v1/webhooks/twilio', async (req: Request, res: Response) => {
    try {
      console.log('Received Twilio Inbound SMS Webhook:', req.body);
      const fromPhone = req.body.From || req.body.from || req.body.phone;
      const inboundBody = req.body.Body || req.body.body || req.body.text || '';
      const tenantId = req.query.tenantId || req.body.tenantId;

      if (!fromPhone || !inboundBody) {
        res.status(400).send('<Response><Message>Invalid SMS payload</Message></Response>');
        return;
      }

      // Find tenant & lead
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

      // Append inbound message
      dbStore.addMessage({
        lead_id: lead.id,
        direction: 'inbound',
        body: inboundBody,
        status: 'received'
      });

      // Fetch full chat history
      const history = dbStore.getMessages(lead.id);

      // Execute Gemini API ISA completion
      const geminiResult = await processInboundSMSWithGemini(tenant, lead, history, inboundBody);

      // Send Gemini reply back via Twilio SMS
      const twilioRes = await sendSMSViaTwilio(tenant, lead.phone, geminiResult.replyMessage);

      // Append outbound message to DB
      const outboundMsg = dbStore.addMessage({
        lead_id: lead.id,
        direction: 'outbound',
        body: geminiResult.replyMessage,
        status: twilioRes.success ? 'delivered' : 'failed',
        ai_reasoning: geminiResult.aiReasoning
      });

      // Update lead state
      const updatedLead = dbStore.updateLead(lead.id, {
        qualification_stage: geminiResult.qualificationStage,
        timeline: geminiResult.timelineExtracted || lead.timeline,
        budget: geminiResult.budgetExtracted || lead.budget,
        pre_approved: geminiResult.preApprovedExtracted ?? lead.pre_approved,
        representation_status: geminiResult.representationStatus || lead.representation_status,
        search_criteria: geminiResult.searchCriteriaExtracted || lead.search_criteria,
        tags: Array.from(new Set([...(lead.tags || []), ...(geminiResult.fubTagsToAdd || [])]))
      });

      // Sync status, tags, and notes to Follow Up Boss
      await syncToFollowUpBoss(
        tenant,
        updatedLead,
        `Gemini ISA Reply: "${geminiResult.replyMessage}"\nReasoning: ${geminiResult.aiReasoning}`,
        geminiResult.fubTagsToAdd || [],
        geminiResult.qualificationStage
      );

      // Respond with Twilio TwiML or JSON
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
      console.error('Error processing Twilio SMS Webhook:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // -------------------------------------------------------------
  // SAAS ADMIN REST API ENDPOINTS
  // -------------------------------------------------------------
  
  // Tenants
  app.get('/api/v1/tenants', (req: Request, res: Response) => {
    res.json({ tenants: dbStore.getTenants() });
  });

  app.post('/api/v1/tenants', (req: Request, res: Response) => {
    const newTenant = dbStore.createTenant(req.body);
    res.status(201).json({ tenant: newTenant });
  });

  app.get('/api/v1/tenants/:id/settings', (req: Request, res: Response) => {
    const tenant = dbStore.getTenantById(req.params.id);
    if (!tenant) {
      res.status(404).json({ error: 'Tenant not found' });
      return;
    }
    res.json({ tenant });
  });

  app.put('/api/v1/tenants/:id/settings', (req: Request, res: Response) => {
    try {
      const updated = dbStore.updateTenant(req.params.id, req.body);
      res.json({ tenant: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Dashboard KPIs
  app.get('/api/v1/dashboard/kpis', (req: Request, res: Response) => {
    const tenantId = req.query.tenantId as string;
    const kpis = dbStore.getKPIs(tenantId);
    res.json({ kpis });
  });

  // Leads
  app.get('/api/v1/leads', (req: Request, res: Response) => {
    const tenantId = req.query.tenantId as string;
    const leads = dbStore.getLeads(tenantId);
    res.json({ leads });
  });

  app.get('/api/v1/leads/:id/messages', (req: Request, res: Response) => {
    const messages = dbStore.getMessages(req.params.id);
    res.json({ messages });
  });

  // Live Simulator: Interactive SMS test endpoint for UI
  app.post('/api/v1/leads/:id/simulate-inbound', async (req: Request, res: Response) => {
    try {
      const leadId = req.params.id;
      const inboundBody = req.body.body || req.body.message || '';
      const lead = dbStore.getLeadById(leadId);
      if (!lead) {
        res.status(404).json({ error: 'Lead not found' });
        return;
      }
      const tenant = dbStore.getTenantById(lead.tenant_id) || dbStore.getTenants()[0];

      // Add inbound message
      dbStore.addMessage({
        lead_id: lead.id,
        direction: 'inbound',
        body: inboundBody,
        status: 'received'
      });

      const history = dbStore.getMessages(lead.id);

      // Execute Gemini ISA
      const geminiResult = await processInboundSMSWithGemini(tenant, lead, history, inboundBody);

      // Send SMS
      const twilioRes = await sendSMSViaTwilio(tenant, lead.phone, geminiResult.replyMessage);

      // Add outbound message
      const outboundMsg = dbStore.addMessage({
        lead_id: lead.id,
        direction: 'outbound',
        body: geminiResult.replyMessage,
        status: twilioRes.success ? 'delivered' : 'failed',
        ai_reasoning: geminiResult.aiReasoning
      });

      // Update lead
      const updatedLead = dbStore.updateLead(lead.id, {
        qualification_stage: geminiResult.qualificationStage,
        timeline: geminiResult.timelineExtracted || lead.timeline,
        budget: geminiResult.budgetExtracted || lead.budget,
        pre_approved: geminiResult.preApprovedExtracted ?? lead.pre_approved,
        representation_status: geminiResult.representationStatus || lead.representation_status,
        search_criteria: geminiResult.searchCriteriaExtracted || lead.search_criteria,
        tags: Array.from(new Set([...(lead.tags || []), ...(geminiResult.fubTagsToAdd || [])]))
      });

      // Sync FUB
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
      console.error('Error in SMS simulation:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Webhook Test Trigger from UI
  app.post('/api/v1/simulate-fub-webhook', async (req: Request, res: Response) => {
    try {
      const tenantId = req.body.tenantId || 'tenant_yorkville_01';
      const tenant = dbStore.getTenantById(tenantId) || dbStore.getTenants()[0];

      const sampleNames = ['Chloe Montgomery', 'Jonathan Blake', 'Liam O\'Connor', 'Aria Tremblay', 'Noah Sterling'];
      const sampleLocations = ['Yorkville Penthouse', 'King West Loft', 'Rosedale Luxury Estate', 'Forest Hill Manor', 'Midtown Toronto Condo'];
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

      // Call internal handler
      const internalRes = await fetch(`http://localhost:${PORT}/api/v1/webhooks/fub`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fakeFubPayload)
      });
      const data = await internalRes.json();

      res.json({ success: true, simulatedPayload: fakeFubPayload, result: data });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Notifications API
  app.get('/api/v1/notifications', (req: Request, res: Response) => {
    const tenantId = req.query.tenantId as string;
    const notifications = dbStore.getNotifications(tenantId);
    res.json({ notifications });
  });

  app.put('/api/v1/notifications/:id/read', (req: Request, res: Response) => {
    dbStore.markNotificationRead(req.params.id);
    res.json({ success: true });
  });

  app.put('/api/v1/notifications/read-all', (req: Request, res: Response) => {
    const tenantId = req.query.tenantId as string;
    dbStore.markAllNotificationsRead(tenantId);
    res.json({ success: true });
  });

  // Integration Health Endpoint
  app.get('/api/v1/health/integrations', (req: Request, res: Response) => {
    res.json({ health: dbStore.getIntegrationHealth() });
  });

  // DB Schema Migration Export Endpoint
  app.get('/api/v1/db/schema', (req: Request, res: Response) => {
    try {
      const schemaPath = path.join(process.cwd(), 'src', 'db', 'schema.sql');
      const sqlContent = fs.readFileSync(schemaPath, 'utf-8');
      res.type('text/plain').send(sqlContent);
    } catch (err: any) {
      res.status(500).send('-- Schema file not found');
    }
  });

  // -------------------------------------------------------------
  // VITE DEVELOPMENT / PRODUCTION SERVING
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ARGUS AI Sales Closer server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
