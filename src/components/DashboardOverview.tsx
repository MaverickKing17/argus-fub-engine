import React from 'react';
import { DashboardKPIs, IntegrationHealth, Lead, Tenant } from '../types.js';
import { Users, MessageSquare, CheckCircle2, ShieldAlert, ArrowUpRight, Zap, Clock, Sparkles, Building2 } from 'lucide-react';

interface DashboardOverviewProps {
  kpis: DashboardKPIs;
  health: IntegrationHealth;
  leads: Lead[];
  tenant: Tenant;
  onNavigateTab: (tab: string, leadId?: string) => void;
  onSimulateWebhook: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  kpis,
  health,
  leads,
  tenant,
  onNavigateTab,
  onSimulateWebhook
}) => {
  const recentLeads = leads.slice(0, 5);

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="bg-[#141414] p-5 rounded-xl border border-[#262626] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-bold text-[#C5A059] uppercase tracking-widest mb-1 font-mono">
            <Zap className="h-3.5 w-3.5 text-[#C5A059]" />
            <span>Speed-to-Lead Automation Engine</span>
          </div>
          <h2 className="text-xl font-bold text-[#F5F5F7]">
            {tenant.team_name} Performance Dashboard
          </h2>
          <p className="text-[#A1A1AA] text-xs mt-1 max-w-2xl">
            Qualifying GTA inbound prospects via Gemini 3.6 Flash SMS. Auto-enforcing TRESA & RECO representation compliance and syncing notes to Follow Up Boss.
          </p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            id="overview-test-lead-btn"
            onClick={onSimulateWebhook}
            className="flex-1 md:flex-none bg-[#C5A059] hover:bg-[#B38E46] text-black text-xs font-bold px-4 py-2 rounded-md transition-colors shadow-sm flex items-center justify-center space-x-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>Fire Inbound FUB Webhook</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-[#141414] border border-[#262626] p-4 rounded-xl shadow-sm">
          <div className="text-[#A1A1AA] text-[10px] uppercase font-bold mb-1 tracking-wider">Leads Processed (24h)</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#F5F5F7]">{kpis.totalLeads}</span>
            <span className="text-[#10B981] text-xs font-medium flex items-center font-mono">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> +100%
            </span>
          </div>
          <p className="text-[11px] text-[#A1A1AA] mt-2">Instant 30s response guarantee</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-[#141414] border border-[#262626] p-4 rounded-xl shadow-sm">
          <div className="text-[#A1A1AA] text-[10px] uppercase font-bold mb-1 tracking-wider">Active SMS Threads</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#F5F5F7]">{kpis.activeSMSThreads}</span>
            <span className="text-[#C5A059] text-xs font-mono">{kpis.avgSpeedToLeadSeconds}s avg speed</span>
          </div>
          <p className="text-[11px] text-[#A1A1AA] mt-2">Normal load • Multi-turn active</p>
        </div>

        {/* KPI 3 */}
        <div className="bg-[#141414] border border-[#262626] p-4 rounded-xl shadow-sm">
          <div className="text-[#A1A1AA] text-[10px] uppercase font-bold mb-1 tracking-wider">Qualified Appointments</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#10B981]">{kpis.qualifiedAppointments}</span>
            <span className="px-2 py-0.5 bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold border border-[#10B981]/20 rounded uppercase">Ready</span>
          </div>
          <p className="text-[11px] text-[#A1A1AA] mt-2">High Intent • Synced to FUB</p>
        </div>

        {/* KPI 4 */}
        <div className="bg-[#141414] border border-[#262626] p-4 rounded-xl shadow-sm">
          <div className="text-[#A1A1AA] text-[10px] uppercase font-bold mb-1 tracking-wider">Conversion Rate</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#F5F5F7]">{kpis.conversionRate}%</span>
            <span className="text-[#C5A059] text-xs font-semibold">{kpis.disqualifiedLeads} Disqualified</span>
          </div>
          <p className="text-[11px] text-[#A1A1AA] mt-2">TRESA & RECO Compliance Safeguarded</p>
        </div>
      </div>

      {/* Main Grid: Recent Activity Stream + Integration Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Leads Stream */}
        <div className="lg:col-span-2 bg-[#141414] rounded-xl border border-[#262626] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#262626]">
            <div>
              <h3 className="text-sm font-semibold text-[#F5F5F7] uppercase tracking-wider">Live Inbound Qualification Stream</h3>
              <p className="text-[11px] text-[#A1A1AA]">Real-time status of GTA prospects in system</p>
            </div>
            <button
              id="view-all-leads-btn"
              onClick={() => onNavigateTab('leads')}
              className="text-xs font-bold text-[#C5A059] hover:text-[#B38E46] flex items-center space-x-1 transition-colors"
            >
              <span>View All Pipeline</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentLeads.map((lead) => {
              const isQualified = lead.qualification_stage === 'Qualified';
              const isDisqualified = lead.qualification_stage === 'Unrepresented_Disqualified';

              return (
                <div
                  key={lead.id}
                  onClick={() => onNavigateTab('conversations', lead.id)}
                  className="p-3 bg-[#0A0A0A]/40 hover:bg-[#0A0A0A] rounded-lg border border-[#262626] cursor-pointer transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isQualified
                        ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                        : isDisqualified
                        ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                        : 'bg-[#262626] text-[#F5F5F7] border border-[#262626]'
                    }`}>
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-xs text-[#F5F5F7] group-hover:text-[#C5A059] transition-colors">{lead.name}</h4>
                        <span className="text-[10px] text-[#A1A1AA] font-mono">{lead.phone}</span>
                      </div>
                      <p className="text-[11px] text-[#A1A1AA] truncate max-w-sm mt-0.5">
                        {lead.search_criteria || 'Inbound property inquiry'}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] bg-[#0A0A0A] px-2 py-0.5 rounded text-[#F5F5F7] font-mono border border-[#262626]">
                          {lead.budget}
                        </span>
                        <span className="text-[10px] bg-[#0A0A0A] px-2 py-0.5 rounded text-[#F5F5F7] font-mono border border-[#262626]">
                          Timeline: {lead.timeline}
                        </span>
                        {lead.pre_approved && (
                          <span className="text-[9px] bg-[#10B981]/15 text-[#10B981] px-1.5 py-0.5 rounded border border-[#10B981]/30 font-semibold">
                            Pre-Approved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-[#262626] pt-2 sm:pt-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold border uppercase tracking-wider ${
                      isQualified
                        ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30'
                        : isDisqualified
                        ? 'bg-rose-950/60 text-rose-400 border-rose-800/60'
                        : 'bg-[#262626] text-[#F5F5F7] border border-[#262626]'
                    }`}>
                      {lead.qualification_stage.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-[#A1A1AA] mt-1 font-mono">
                      {new Date(lead.last_contact_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Integration Health Panel */}
        <div className="bg-[#141414] rounded-xl border border-[#262626] p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#262626]">
              <h3 className="text-sm font-semibold text-[#F5F5F7] uppercase tracking-wider">System Connections</h3>
              <span className="px-2 py-0.5 bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold border border-[#10B981]/20 rounded uppercase tracking-wider flex items-center space-x-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                <span>Operational</span>
              </span>
            </div>
            <p className="text-[11px] text-[#A1A1AA] mb-4">
              Latency & webhook sync status for {tenant.team_name}.
            </p>

            <div className="space-y-3">
              {/* FUB */}
              <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#262626] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center font-bold text-[10px] border border-[#C5A059]/30">
                    FUB
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-[#F5F5F7]">Follow Up Boss API</h4>
                    <span className="text-[10px] text-[#A1A1AA]">Auto-tagging & Note sync</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#10B981]">{health.fub.latencyMs}ms</span>
                </div>
              </div>

              {/* Twilio */}
              <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#262626] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded bg-rose-950/60 text-rose-400 flex items-center justify-center font-bold text-[10px] border border-rose-800/60">
                    SMS
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-[#F5F5F7]">Twilio Gateway</h4>
                    <span className="text-[10px] text-[#A1A1AA]">{tenant.twilio_phone_number}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#10B981]">{health.twilio.latencyMs}ms</span>
                </div>
              </div>

              {/* Gemini */}
              <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#262626] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center font-bold text-[10px] border border-[#C5A059]/30">
                    AI
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-[#F5F5F7]">Gemini 3.6 Flash</h4>
                    <span className="text-[10px] text-[#A1A1AA]">ISA Compliance Engine</span>
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
            className="w-full bg-[#262626] hover:bg-[#333333] text-[#F5F5F7] text-xs font-medium py-2 rounded-md border border-[#262626] transition-colors flex items-center justify-center space-x-1"
          >
            <span>Team & API Settings</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

};
