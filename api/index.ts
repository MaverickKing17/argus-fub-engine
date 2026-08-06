import { dbStore } from '../src/db/dbStore.js';
import { processInboundSMSWithGemini } from '../src/services/geminiIsa.js';
import { sendSMSViaTwilio } from '../src/services/twilioService.js';
import { syncToFollowUpBoss } from '../src/services/fubService.js';

export default async function handler(req: any, res: any) {
  const host = req.headers?.host || 'localhost';
  const url = new URL(req.url || '/', `http://${host}`);
  const pathname = url.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (pathname === '/api/v1/tenants' && req.method === 'GET') {
      return res.status(200).json({ tenants: dbStore.getTenants() });
    }

    if (pathname === '/api/v1/dashboard/kpis') {
      const tenantId = url.searchParams.get('tenantId') || undefined;
      return res.status(200).json({ kpis: dbStore.getKPIs(tenantId) });
    }

    if (pathname === '/api/v1/leads' && req.method === 'GET') {
      const tenantId = url.searchParams.get('tenantId') || undefined;
      return res.status(200).json({ leads: dbStore.getLeads(tenantId) });
    }

    if (pathname.includes('/api/v1/leads/') && pathname.endsWith('/messages')) {
      const parts = pathname.split('/');
      const leadId = parts[parts.indexOf('leads') + 1];
      return res.status(200).json({ messages: dbStore.getMessages(leadId) });
    }

    if (pathname === '/api/v1/health/integrations') {
      return res.status(200).json({ health: dbStore.getIntegrationHealth() });
    }

    if (pathname === '/api/v1/notifications') {
      const tenantId = url.searchParams.get('tenantId') || undefined;
      return res.status(200).json({ notifications: dbStore.getNotifications(tenantId) });
    }

    if (pathname.includes('/api/v1/leads/') && pathname.endsWith('/simulate-inbound') && req.method === 'POST') {
      const parts = pathname.split('/');
      const leadId = parts[parts.indexOf('leads') + 1];
      const inboundBody = req.body?.body || req.body?.message || '';
      const lead = dbStore.getLeadById(leadId);
      if (!lead) return res.status(404).json({ error: 'Lead not found' });
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

      await syncToFollowUpBoss(
        tenant,
        updatedLead,
        `Gemini ISA reply: ${geminiResult.replyMessage}`,
        geminiResult.fubTagsToAdd || [],
        geminiResult.qualificationStage
      );

      return res.status(200).json({
        success: true,
        lead: updatedLead,
        outboundMessage: outboundMsg,
        geminiResult
      });
    }

    if (pathname === '/api/v1/simulate-fub-webhook' && req.method === 'POST') {
      const tenantId = req.body?.tenantId || 'tenant_yorkville_01';
      const tenant = dbStore.getTenantById(tenantId) || dbStore.getTenants()[0];
      const sampleNames = ['Victoria Tremblay', 'Jonathan Blake', 'Harrison Forde', 'Camilla Sterling', 'Julien St-Pierre'];
      const sampleLocations = ['Yorkville Penthouse', 'Bridle Path Estate', 'Rosedale Heritage', 'Forest Hill Manor'];
      const name = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const loc = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
      const randomPhone = `+1416555${Math.floor(1000 + Math.random() * 9000)}`;

      const lead = dbStore.createLead({
        tenant_id: tenant.id,
        fub_person_id: `fub_sim_${Date.now()}`,
        name,
        phone: randomPhone,
        email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@gta-buyer.ca`,
        qualification_stage: 'New',
        timeline: '30-60 Days',
        budget: '$3.5M - $4.5M',
        pre_approved: true,
        representation_status: 'Needs_Verification',
        search_criteria: `${loc} inquiry`,
        notes: 'Simulated inbound lead',
        tags: ['FUB_Webhook_Inbound', 'SpeedToLead_Initiated']
      });

      const initialOutreachBody = `Hi ${lead.name}! Thanks for reaching out to ${tenant.team_name}. Are you currently looking to buy or sell a property in the Toronto area in the next 30-90 days?`;
      await sendSMSViaTwilio(tenant, lead.phone, initialOutreachBody);
      const msg = dbStore.addMessage({
        lead_id: lead.id,
        direction: 'outbound',
        body: initialOutreachBody,
        status: 'delivered',
        ai_reasoning: 'Automated speed-to-lead initial outreach.'
      });

      return res.status(200).json({ success: true, result: { leadId: lead.id, messageId: msg.id } });
    }

    return res.status(404).json({ error: 'API route not found' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
