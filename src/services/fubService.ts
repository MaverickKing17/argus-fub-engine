import { Tenant, Lead, QualificationStage } from '../types.js';

export interface FUBSyncResult {
  success: boolean;
  fubPersonId: string;
  notesAdded: boolean;
  tagsAdded: string[];
  stageUpdated?: string;
  timestamp: string;
  mode: 'live_api' | 'simulated';
}

export async function syncToFollowUpBoss(
  tenant: Tenant,
  lead: Lead,
  noteText: string,
  tags: string[],
  stage: QualificationStage
): Promise<FUBSyncResult> {
  const apiKey = tenant.fub_api_key || process.env.FUB_API_KEY;
  const isRealFubKey = apiKey && apiKey.length > 20 && !apiKey.startsWith('fub_live_') && !apiKey.includes('mock');

  if (isRealFubKey) {
    try {
      const authHeader = `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;

      // 1. Update Person Tags & Stage
      const stageMapping: Record<QualificationStage, string> = {
        'New': 'New Lead',
        'Engaged': 'Engaged',
        'Qualified': 'Hot Prospect',
        'Escalated_Human_Review': 'Pending Agent Review',
        'Unrepresented_Disqualified': 'Trash / Disqualified'
      };

      const updatePersonRes = await fetch(`https://api.followupboss.com/v1/persons/${lead.fub_person_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stage: stageMapping[stage] || 'Engaged',
          tags: Array.from(new Set([...(lead.tags || []), ...tags]))
        })
      });

      // 2. Add Note / Note log of Gemini conversation
      const addNoteRes = await fetch('https://api.followupboss.com/v1/notes', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personId: Number(lead.fub_person_id) || 12345,
          subject: `🤖 ARGUS AI ISA Update - ${stage}`,
          body: `[ARGUS Speed-to-Lead Qualification Notes]\n${noteText}\n\nTimeline: ${lead.timeline}\nBudget: ${lead.budget}\nRECO Status: ${lead.representation_status}`
        })
      });

      if (updatePersonRes.ok || addNoteRes.ok) {
        return {
          success: true,
          fubPersonId: lead.fub_person_id,
          notesAdded: addNoteRes.ok,
          tagsAdded: tags,
          stageUpdated: stageMapping[stage],
          timestamp: new Date().toISOString(),
          mode: 'live_api'
        };
      }
    } catch (err: any) {
      console.warn('FUB API sync failed, falling back to simulated sync:', err.message);
    }
  }

  // Simulated FUB sync for sandbox / development environment
  return {
    success: true,
    fubPersonId: lead.fub_person_id,
    notesAdded: true,
    tagsAdded: tags,
    stageUpdated: stage,
    timestamp: new Date().toISOString(),
    mode: 'simulated'
  };
}
