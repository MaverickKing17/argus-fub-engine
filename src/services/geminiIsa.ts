import { GoogleGenAI, Type } from '@google/genai';
import { Lead, Message, GeminiQualificationResult, Tenant } from '../types.js';

// Initialize Gemini SDK lazily
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key.trim().length > 0) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    }
  }
  return aiClient;
}

const BASE_SYSTEM_PROMPT = `You are an Inside Sales Agent (ISA) representing luxury real estate teams in the Greater Toronto Area (GTA). Your objective is to qualify inbound buyer/seller leads via SMS.
Qualification Parameters:
1. Timeline (e.g., immediate, 30-90 days, 6+ months).
2. Financial Readiness (Pre-approved, cash, or needs broker).
3. Search Criteria (Neighborhoods, property type, budget).
4. TRESA & RECO Representation Check: Per Ontario TRESA guidelines, ask if they are under a signed buyer representation agreement (BRA) with another real estate brokerage.
Guardrails:
- CASL Guidelines: Ensure user opted in.
- Legal & TRESA/RECO Rules: If the prospect confirms active representation under TRESA with another agent, politely terminate the sales pitch and set qualification_stage to 'Unrepresented_Disqualified'.
- Ambiguous BRA Response: If the prospect's answer regarding BRA representation is ambiguous, uncertain, or unparseable (e.g., "I signed something at an open house but I don't know what it was", "maybe", "not sure"), set qualificationStage to 'Escalated_Human_Review' and representationStatus to 'Needs_Verification'.
- Suspended Auto-Advancement: Do NOT auto-advance a lead in 'Escalated_Human_Review' stage to Qualified or Disqualified. Keep it in 'Escalated_Human_Review' until resolved by a human agent.
- Zero Hallucination: Do NOT fabricate property details or legal terms.

SMS Messaging Format Guidelines:
- Keep text replies friendly, professional, and concise (under 240 characters).
- Maintain a warm, conversational GTA luxury real estate tone (referencing GTA areas like Yorkville, King West, Rosedale, Leslieville, Mississauga, North York, Markham when appropriate).
- Always ask ONE clear follow-up question unless qualification is complete or disqualified due to TRESA BRA rules.`;

export async function processInboundSMSWithGemini(
  tenant: Tenant,
  lead: Lead,
  history: Message[],
  inboundBody: string
): Promise<GeminiQualificationResult> {
  const ai = getGeminiClient();

  const formattedHistory = history.map((m) => `${m.direction.toUpperCase()}: ${m.body}`).join('\n');
  const fullPrompt = `
Tenant Team: ${tenant.team_name}
Target Neighborhoods: ${tenant.isa_settings.targetNeighborhoods.join(', ')}
Min Budget: $${tenant.isa_settings.minBudget.toLocaleString()} CAD
RECO Mandatory Check Wording: "${tenant.isa_settings.recoDisclaimer}"

LEAD PROFILE:
- Name: ${lead.name}
- Phone: ${lead.phone}
- Current Stage: ${lead.qualification_stage}
- Previous Timeline: ${lead.timeline}
- Previous Budget: ${lead.budget}
- Pre-approved: ${lead.pre_approved}
- RECO Status: ${lead.representation_status}

CONVERSATION HISTORY (SMS):
${formattedHistory || '(No previous messages)'}
INBOUND NEW SMS: "${inboundBody}"

Task:
Analyze the new message in context of the conversation. Determine if the prospect is revealing timeline, budget, pre-approval status, or RECO representation status (whether they signed a Buyer Representation Agreement with another realtor).
Return JSON matching schema.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: fullPrompt,
        config: {
          systemInstruction: BASE_SYSTEM_PROMPT,
          temperature: 0.2,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              replyMessage: {
                type: Type.STRING,
                description: 'The SMS text response to send back to the prospect.'
              },
              qualificationStage: {
                type: Type.STRING,
                description: 'New | Engaged | Qualified | Escalated_Human_Review | Unrepresented_Disqualified'
              },
              timelineExtracted: {
                type: Type.STRING,
                description: 'Extracted timeline e.g. Immediate, 30-90 Days, 6+ Months'
              },
              budgetExtracted: {
                type: Type.STRING,
                description: 'Extracted budget e.g. $1.5M-$2M'
              },
              preApprovedExtracted: {
                type: Type.BOOLEAN,
                description: 'True if prospect confirmed pre-approval or cash purchase.'
              },
              representationStatus: {
                type: Type.STRING,
                description: 'Represented_By_Other | Unrepresented | Needs_Verification'
              },
              searchCriteriaExtracted: {
                type: Type.STRING,
                description: 'Extracted neighborhood or property details'
              },
              internalNotes: {
                type: Type.STRING,
                description: 'Brief summary note for Follow Up Boss sync.'
              },
              fubTagsToAdd: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Tags to attach in Follow Up Boss.'
              },
              aiReasoning: {
                type: Type.STRING,
                description: 'Internal rationale behind ISA decision & RECO check.'
              }
            },
            required: ['replyMessage', 'qualificationStage', 'representationStatus', 'aiReasoning']
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text) as GeminiQualificationResult;
        return parsed;
      }
    } catch (error) {
      console.warn('Gemini API call failed, falling back to heuristic ISA engine:', error);
    }
  }

  // Smart Heuristic Fallback Engine if Gemini Key is missing or network times out
  return fallbackIsaEngine(tenant, lead, history, inboundBody);
}

function fallbackIsaEngine(
  tenant: Tenant,
  lead: Lead,
  history: Message[],
  inboundBody: string
): GeminiQualificationResult {
  const lower = inboundBody.toLowerCase();

  // Check for Ambiguous BRA response (Needs Human Escalation)
  const isAmbiguousRep = lower.includes('not sure') || 
                        lower.includes('signed something') || 
                        lower.includes('open house') || 
                        lower.includes('guest sheet') || 
                        lower.includes('maybe') || 
                        lower.includes('dont know') || 
                        lower.includes("don't know");

  if (isAmbiguousRep || lead.qualification_stage === 'Escalated_Human_Review') {
    return {
      replyMessage: `Thank you for letting us know ${lead.name}. To ensure full alignment with TRESA rules, I am connecting you with our senior licensed agent to verify your representation status before we proceed.`,
      qualificationStage: 'Escalated_Human_Review',
      representationStatus: 'Needs_Verification',
      internalNotes: 'Prospect provided an ambiguous response regarding BRA representation status. Escalated to human agent review.',
      fubTagsToAdd: ['Needs_Human_Review', 'BRA_Ambiguous'],
      aiReasoning: 'BRA Representation Status: Ambiguous — routed to human agent for confirmation before qualification stage is finalized.'
    };
  }

  // Check for RECO Disqualification (Representation by another agent)
  const isRepresented = lower.includes('signed a bra') || 
                        lower.includes('other agent') || 
                        lower.includes('realtor cousin') || 
                        lower.includes('working with an agent') ||
                        lower.includes('under contract') ||
                        lower.includes('bra signed');

  if (isRepresented) {
    return {
      replyMessage: `Thank you for letting us know ${lead.name}. Per Ontario TRESA compliance regulations, since you are under a signed representation agreement with another brokerage, we cannot provide representation or advice. Wish you all the best!`,
      qualificationStage: 'Unrepresented_Disqualified',
      representationStatus: 'Represented_By_Other',
      internalNotes: 'Prospect confirmed active signed representation contract with another realtor. Sales pitch terminated per TRESA & RECO rules.',
      fubTagsToAdd: ['TRESA_Disqualified', 'Signed_Other_Brokerage'],
      aiReasoning: 'Prospect confirmed active representation agreement with another agent. TRESA compliance guardrail triggered.'
    };
  }

  // Check for Unrepresented status confirmation
  const isUnrepresented = lower.includes('no agent') || lower.includes('unrepresented') || lower.includes('not working with') || lower.includes('no bra');

  // Check for financial readiness / pre-approval
  const isPreApproved = lower.includes('pre-approved') || lower.includes('approved') || lower.includes('td bank') || lower.includes('rbc') || lower.includes('cash');

  // Extract budget hints
  let budget = lead.budget;
  if (lower.includes('$') || lower.includes('k') || lower.includes('million') || lower.includes('m')) {
    budget = inboundBody.match(/\$?\d+(?:\.\d+)?\s*(?:k|m|million|thousand)?/i)?.[0] || lead.budget;
  }

  // Determine stage
  let stage = lead.qualification_stage === 'New' ? 'Engaged' : lead.qualification_stage;
  let repStatus = isUnrepresented ? 'Unrepresented' : lead.representation_status;

  if (isUnrepresented && (isPreApproved || budget !== 'Unknown')) {
    stage = 'Qualified';
  }

  let reply = '';
  if (stage === 'Qualified') {
    reply = `Excellent! Thanks ${lead.name}. I've noted your criteria and pre-approval details. A senior agent from ${tenant.team_name} will connect with you shortly with curated GTA properties!`;
  } else if (repStatus === 'Needs_Verification') {
    reply = `Thanks for the details! To confirm RECO guidelines: Are you currently working under a signed buyer agreement with another realtor in Ontario?`;
  } else {
    reply = `Got it! What is your ideal timeframe to move into a property in ${tenant.isa_settings.targetNeighborhoods[0] || 'Toronto'}?`;
  }

  return {
    replyMessage: reply,
    qualificationStage: stage as any,
    budgetExtracted: budget,
    preApprovedExtracted: isPreApproved || lead.pre_approved,
    representationStatus: repStatus as any,
    internalNotes: `Processed via ISA engine. Rep status: ${repStatus}. Pre-approved: ${isPreApproved}.`,
    fubTagsToAdd: ['ISA_SMS_Engaged', stage === 'Qualified' ? 'ISA_Qualified' : 'SpeedToLead_Active'],
    aiReasoning: `Local heuristic analyzer processed inbound text: "${inboundBody}". Stage set to ${stage}.`
  };
}
