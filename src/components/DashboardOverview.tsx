import React, { useState } from 'react';
import { DashboardKPIs, IntegrationHealth, Lead, Tenant, QualificationStage, RepresentationStatus } from '../types.js';
import { Users, MessageSquare, CheckCircle2, ShieldAlert, ArrowUpRight, Zap, Clock, Sparkles, Building2, TrendingUp, AlertTriangle, Eye, Filter } from 'lucide-react';
import { LeadDetailModal } from './LeadDetailModal.js';
import { formatQualificationStage, ChannelBadge } from '../lib/formatters.js';

interface DashboardOverviewProps {
  kpis: DashboardKPIs;
  health: IntegrationHealth;
  leads: Lead[];
  tenant: Tenant;
  onNavigateTab: (tab: string, leadId?: string) => void;
  onSimulateWebhook: () => void;
  onResolveEscalation?: (leadId: string, newStage: QualificationStage, representationStatus: RepresentationStatus, note?: string) => Promise<void>;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  kpis,
  health,
  leads,
  tenant,
  onNavigateTab,
  onSimulateWebhook,
  onResolveEscalation
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [inspectLead, setInspectLead] = useState<Lead | null>(null);

  const filteredLeads = leads.filter((l) => {
    if (selectedFilter === 'ALL') return true;
    return l.qualification_stage === selectedFilter;
  });

  const recentLeads = filteredLeads.slice(0, 6);
  const escalatedCount = leads.filter((l) => l.qualification_stage === 'Escalated_Human_Review').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Banner Card */}
      <div className="card-pop p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-[10px] font-bold text-[#E5C178] uppercase tracking-widest mb-1.5 font-mono">
            <Zap className="h-3.5 w-3.5 text-[#E5C178]" />
            <span>Autonomous Speed-to-Lead Automation Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">
            {tenant.team_name} Performance Dashboard
          </h2>
          <p className="text-[#CBD5E1] text-xs sm:text-sm font-medium mt-1.5 max-w-2xl leading-relaxed">
            Qualifying GTA inbound prospects via ARGUS Autonomous ISA SMS. Auto-enforcing TRESA & RECO representation compliance and syncing notes to Follow Up Boss.
          </p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto shrink-0 relative z-10">
          <button
            id="overview-test-lead-btn"
            onClick={onSimulateWebhook}
            className="w-full md:w-auto btn-executive-primary text-xs sm:text-sm px-5 py-3 rounded-xl flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
          >
            <Sparkles className="h-4 w-4 text-[#050B14]" />
            <span>Fire Inbound FUB Webhook</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Ribbon with Micro-Sparklines & Executive Pop Effect */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Leads Processed */}
        <div className="card-pop p-5 sm:p-6 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[#CBD5E1] text-[10px] uppercase font-bold tracking-widest font-sans">
              Leads Processed (24h)
            </span>
            <span className="text-[#10B981] text-[10px] font-semibold flex items-center font-mono bg-[#10B981]/15 px-2 py-0.5 rounded-md border border-[#10B981]/30">
              <ArrowUpRight className="h-3 w-3 mr-0.5" /> +100%
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight font-sans">
              {kpis.totalLeads}
            </span>
            {/* Inline Micro-Sparkline SVG 1 */}
            <div className="w-24 h-8 shrink-0">
              <svg className="w-full h-full" viewBox="0 0 100 30" fill="none">
                <path
                  d="M0 25 Q 20 22, 40 18 T 70 10 T 100 4"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M0 25 Q 20 22, 40 18 T 70 10 T 100 4 L 100 30 L 0 30 Z"
                  fill="url(#sparkline-grad-1)"
                  opacity="0.25"
                />
                <defs>
                  <linearGradient id="sparkline-grad-1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <p className="text-[11px] text-[#CBD5E1] font-medium font-sans">Instant 30s response SLA active</p>
        </div>

        {/* KPI 2: Active SMS Threads */}
        <div className="card-pop p-5 sm:p-6 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[#CBD5E1] text-[10px] uppercase font-bold tracking-widest font-sans">
              Active SMS Threads
            </span>
            <span className="text-[#E5C178] text-[10px] font-mono bg-[#E5C178]/15 px-2 py-0.5 rounded-md border border-[#E5C178]/30 font-bold">
              {kpis.avgSpeedToLeadSeconds}s avg speed
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight font-sans">
              {kpis.activeSMSThreads}
            </span>
            {/* Inline Micro-Sparkline SVG 2 */}
            <div className="w-24 h-8 shrink-0">
              <svg className="w-full h-full" viewBox="0 0 100 30" fill="none">
                <path
                  d="M0 20 Q 25 28, 50 15 T 75 18 T 100 8"
                  stroke="#E5C178"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M0 20 Q 25 28, 50 15 T 75 18 T 100 8 L 100 30 L 0 30 Z"
                  fill="url(#sparkline-grad-2)"
                  opacity="0.25"
                />
                <defs>
                  <linearGradient id="sparkline-grad-2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E5C178" />
                    <stop offset="100%" stopColor="#E5C178" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <p className="text-[11px] text-[#CBD5E1] font-medium font-sans">Normal load • Multi-turn active</p>
        </div>

        {/* KPI 3: Consultations Booked (Synced to Calendar) */}
        <div className="card-pop p-5 sm:p-6 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[#CBD5E1] text-[10px] uppercase font-bold tracking-widest font-sans">
              Consultations Booked (Synced to Calendar)
            </span>
            <span className="px-2 py-0.5 bg-[#10B981]/20 text-[#10B981] text-[10px] font-bold border border-[#10B981]/40 rounded-md uppercase font-mono">
              Synced
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#10B981] tracking-tight font-sans">
              {kpis.qualifiedAppointments}
            </span>
            {/* Inline Micro-Sparkline SVG 3 */}
            <div className="w-24 h-8 shrink-0">
              <svg className="w-full h-full" viewBox="0 0 100 30" fill="none">
                <path
                  d="M0 28 Q 30 20, 60 12 T 85 8 T 100 2"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M0 28 Q 30 20, 60 12 T 85 8 T 100 2 L 100 30 L 0 30 Z"
                  fill="url(#sparkline-grad-3)"
                  opacity="0.25"
                />
                <defs>
                  <linearGradient id="sparkline-grad-3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <p className="text-[11px] text-[#CBD5E1] font-medium font-sans">High-intent buyers routed to showing calendar.</p>
        </div>

        {/* KPI 4: Conversion Rate */}
        <div className="card-pop p-5 sm:p-6 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[#CBD5E1] text-[10px] uppercase font-bold tracking-widest font-sans">
              Conversion Rate
            </span>
            <span className="text-[#E5C178] text-[10px] font-bold font-mono">
              {kpis.disqualifiedLeads} Disqualified
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight font-sans">
              {kpis.conversionRate}%
            </span>
            {/* Inline Micro-Sparkline SVG 4 */}
            <div className="w-24 h-8 shrink-0">
              <svg className="w-full h-full" viewBox="0 0 100 30" fill="none">
                <path
                  d="M0 15 Q 35 18, 65 10 T 100 5"
                  stroke="#E5C178"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M0 15 Q 35 18, 65 10 T 100 5 L 100 30 L 0 30 Z"
                  fill="url(#sparkline-grad-4)"
                  opacity="0.25"
                />
                <defs>
                  <linearGradient id="sparkline-grad-4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E5C178" />
                    <stop offset="100%" stopColor="#E5C178" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <p className="text-[11px] text-[#CBD5E1] font-medium font-sans">TRESA & RECO ALIGNED / PASSED</p>
        </div>
      </div>

      {/* Main Grid: Recent Activity Stream + Integration Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads Stream */}
        <div className="lg:col-span-2 card-executive p-6 sm:p-7 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC] tracking-wide">
                    Live Inbound Qualification Stream
                  </h3>
                  {escalatedCount > 0 && (
                    <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1 animate-pulse">
                      <AlertTriangle className="h-3 w-3" />
                      {escalatedCount} Escalated
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#CBD5E1] font-medium mt-0.5">Real-time status of GTA prospects in system</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  id="view-all-leads-btn"
                  onClick={() => onNavigateTab('leads')}
                  className="text-xs font-bold text-[#E5C178] hover:text-[#F3DAA0] flex items-center space-x-1 transition-colors cursor-pointer shrink-0"
                >
                  <span>View Full Pipeline</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {[
                { id: 'ALL', label: 'All Leads', count: leads.length },
                { id: 'Qualified', label: 'Qualified', count: leads.filter(l => l.qualification_stage === 'Qualified').length },
                { id: 'Engaged', label: 'Engaged', count: leads.filter(l => l.qualification_stage === 'Engaged').length },
                { id: 'New', label: 'New', count: leads.filter(l => l.qualification_stage === 'New').length },
                { id: 'Escalated_Human_Review', label: 'Escalated Review', count: escalatedCount }
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSelectedFilter(pill.id)}
                  className={`text-[11px] px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    selectedFilter === pill.id
                      ? 'bg-[#E5C178] text-black font-bold shadow-sm'
                      : 'bg-[#0E1826] text-[#CBD5E1] hover:text-white border border-white/[0.08]'
                  }`}
                >
                  <span>{pill.label}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${selectedFilter === pill.id ? 'bg-black/20 text-black font-bold' : 'bg-black/30 text-[#CBD5E1]'}`}>
                    {pill.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Stream List */}
            <div className="space-y-3">
              {recentLeads.length === 0 ? (
                <div className="p-8 text-center bg-[#0E1826] rounded-xl border border-white/[0.08] text-xs text-[#CBD5E1]">
                  No leads found in this stage filter.
                </div>
              ) : (
                recentLeads.map((lead) => {
                  const isQualified = lead.qualification_stage === 'Qualified';
                  const isEscalated = lead.qualification_stage === 'Escalated_Human_Review';
                  const isDisqualified = lead.qualification_stage === 'Unrepresented_Disqualified';

                  return (
                    <div
                      key={lead.id}
                      className="p-4 bg-[#0E1826]/80 hover:bg-[#0E1826] rounded-xl border border-white/[0.08] hover:border-[#E5C178]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group shadow-sm"
                    >
                      <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isQualified
                            ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                            : isEscalated
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : isDisqualified
                            ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                            : 'bg-white/[0.06] text-[#F8FAFC] border border-white/[0.08]'
                        }`}>
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-xs sm:text-sm text-[#F8FAFC] group-hover:text-[#E5C178] transition-colors truncate">{lead.name}</h4>
                            <span className="text-[10px] text-[#CBD5E1] font-mono font-medium">{lead.phone}</span>
                            <ChannelBadge channel={lead.channel} />
                          </div>
                          <p className="text-xs text-[#CBD5E1] font-medium truncate mt-0.5">
                            {lead.search_criteria || 'Inbound property inquiry'}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <span className="text-[10px] bg-[#071524] px-2.5 py-0.5 rounded text-[#F8FAFC] font-mono border border-white/[0.08] font-semibold">
                              {lead.budget}
                            </span>
                            <span className="text-[10px] bg-[#071524] px-2.5 py-0.5 rounded text-[#CBD5E1] font-mono border border-white/[0.08]">
                              Timeline: <span className="text-white font-semibold">{lead.timeline}</span>
                            </span>
                            {lead.pre_approved && (
                              <span className="text-[9px] bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 rounded border border-[#10B981]/40 font-bold uppercase tracking-wide">
                                Pre-Approved
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-white/[0.08] pt-2 sm:pt-0 gap-2">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-md font-bold border uppercase tracking-wider ${
                          isQualified
                            ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40'
                            : isEscalated
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse'
                            : isDisqualified
                            ? 'bg-rose-950/60 text-rose-400 border-rose-800/60'
                            : 'bg-white/[0.06] text-[#F8FAFC] border border-white/[0.08]'
                        }`}>
                          {formatQualificationStage(lead.qualification_stage)}
                        </span>

                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => setInspectLead(lead)}
                            className="bg-white/[0.08] hover:bg-white/[0.15] text-[#F8FAFC] text-[10px] px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer flex items-center space-x-1"
                            title="Inspect TRESA & Lead Profile"
                          >
                            <Eye className="h-3 w-3 text-[#E5C178]" />
                            <span>Inspect</span>
                          </button>

                          <button
                            onClick={() => onNavigateTab('conversations', lead.id)}
                            className="bg-[#E5C178] hover:bg-[#D4B067] text-black text-[10px] px-2.5 py-1 rounded font-bold transition-colors cursor-pointer flex items-center space-x-1"
                            title="Open SMS Thread"
                          >
                            <MessageSquare className="h-3 w-3" />
                            <span>SMS</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Integration Health Panel */}
        <div className="card-executive p-6 sm:p-7 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-[#F8FAFC] tracking-wide">System Connections</h3>
              <span className="px-2.5 py-0.5 bg-[#10B981]/20 text-[#10B981] text-[10px] font-bold border border-[#10B981]/40 rounded-full uppercase tracking-wider flex items-center space-x-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                <span>Operational</span>
              </span>
            </div>
            <p className="text-xs text-[#CBD5E1] mb-4 font-medium">
              Latency & webhook sync status for {tenant.team_name}.
            </p>

            <div className="space-y-3">
              {/* FUB */}
              <div className="p-3.5 bg-[#0E1826] rounded-xl border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#E5C178]/20 text-[#E5C178] flex items-center justify-center font-bold text-[10px] border border-[#E5C178]/40">
                    FUB
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#F8FAFC]">Follow Up Boss API</h4>
                    <span className="text-[10px] text-[#CBD5E1]">Auto-tagging & Note sync</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#10B981]">{health.fub.latencyMs}ms</span>
                </div>
              </div>

              {/* Twilio */}
              <div className="p-3.5 bg-[#0E1826] rounded-xl border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-950/60 text-rose-400 flex items-center justify-center font-bold text-[10px] border border-rose-800/60">
                    SMS
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#F8FAFC]">Twilio Gateway</h4>
                    <span className="text-[10px] text-[#CBD5E1] font-mono">{tenant.twilio_phone_number}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#10B981]">{health.twilio.latencyMs}ms</span>
                </div>
              </div>

              {/* ARGUS AI Engine */}
              <div className="p-3.5 bg-[#0E1826] rounded-xl border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#E5C178]/20 text-[#E5C178] flex items-center justify-center font-bold text-[10px] border border-[#E5C178]/40">
                    AI
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#F8FAFC]">ARGUS AI Engine</h4>
                    <span className="text-[10px] text-[#CBD5E1]">TRESA Compliance & Speed Engine</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#10B981]">{health.gemini.latencyMs}ms</span>
                </div>
              </div>
            </div>
          </div>

          <button
            id="view-integrations-tab-btn"
            onClick={() => onNavigateTab('settings')}
            className="w-full bg-white/[0.08] hover:bg-white/[0.15] text-[#F8FAFC] text-xs font-semibold py-3 rounded-xl border border-white/[0.1] transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <span>Team & API Settings</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Lead Detail / Inspection Modal */}
      <LeadDetailModal
        lead={inspectLead}
        isOpen={!!inspectLead}
        onClose={() => setInspectLead(null)}
        onNavigateTab={onNavigateTab}
        onResolveEscalation={onResolveEscalation}
      />
    </div>
  );
};
