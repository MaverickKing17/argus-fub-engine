export type QualificationStage = 
  | 'New'
  | 'Engaged'
  | 'Qualified'
  | 'Unrepresented_Disqualified';

export type MessageDirection = 'inbound' | 'outbound';

export type RepresentationStatus = 
  | 'Represented_By_Other' 
  | 'Unrepresented' 
  | 'Needs_Verification';

export interface ISASettings {
  targetNeighborhoods: string[];
  minBudget: number;
  maxBudget: number;
  caslOptInNotice: string;
  recoDisclaimer: string;
  customPromptOverride?: string;
  autoTagQualified: string[];
}

export interface Tenant {
  id: string;
  team_name: string;
  fub_api_key: string;
  twilio_sid: string;
  twilio_auth_token: string;
  twilio_phone_number: string;
  created_at: string;
  isa_settings: ISASettings;
}

export interface Lead {
  id: string;
  tenant_id: string;
  fub_person_id: string;
  name: string;
  phone: string;
  email: string;
  qualification_stage: QualificationStage;
  timeline: string;
  budget: string;
  pre_approved: boolean;
  representation_status: RepresentationStatus;
  search_criteria?: string;
  notes?: string;
  tags?: string[];
  last_contact_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  lead_id: string;
  direction: MessageDirection;
  body: string;
  created_at: string;
  ai_reasoning?: string;
  status?: 'sent' | 'delivered' | 'received' | 'failed';
}

export interface NotificationItem {
  id: string;
  tenant_id: string;
  lead_id?: string;
  event_type: 'LEAD_QUALIFIED' | 'URGENT_INTENT' | 'HUMAN_HANDOFF';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface DashboardKPIs {
  totalLeads: number;
  activeSMSThreads: number;
  qualifiedAppointments: number;
  disqualifiedLeads: number;
  conversionRate: number; // e.g. 24.5%
  avgSpeedToLeadSeconds: number;
}

export interface IntegrationHealth {
  fub: { status: 'healthy' | 'degraded' | 'disconnected'; latencyMs: number; lastSync: string };
  twilio: { status: 'healthy' | 'degraded' | 'disconnected'; latencyMs: number; lastMessageAt: string };
  gemini: { status: 'healthy' | 'degraded' | 'disconnected'; latencyMs: number; model: string };
}

export interface GeminiQualificationResult {
  replyMessage: string;
  qualificationStage: QualificationStage;
  timelineExtracted?: string;
  budgetExtracted?: string;
  preApprovedExtracted?: boolean;
  representationStatus?: RepresentationStatus;
  searchCriteriaExtracted?: string;
  internalNotes?: string;
  fubTagsToAdd?: string[];
  aiReasoning?: string;
}
