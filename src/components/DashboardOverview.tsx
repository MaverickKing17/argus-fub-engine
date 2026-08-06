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
      <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">
            <Zap className="h-3.5 w-3.5 text-blue-500" />
            <span>Speed-to-Lead Automation Engine</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100">
            {tenant.team_name} Performance Dashboard
          </h2>
          <p className="text-zinc-400 text-xs mt-1 max-w-2xl">
            Qualifying GTA inbound prospects via Gemini 3.6 Flash SMS. Auto-enforcing TRESA & RECO representation compliance and syncing notes to Follow Up Boss.
          </p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            id="overview-test-lead-btn"
            onClick={onSimulateWebhook}
            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-md transition-colors shadow-sm flex items-center justify-center space-x-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>Fire Inbound FUB Webhook</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-sm">
          <div className="text-zinc-500 text-[10px] uppercase font-bold mb-1 tracking-wider">Leads Processed (24h)</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-zinc-100">{kpis.totalLeads}</span>
            <span className="text-emerald-500 text-xs font-medium flex items-center">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> +100%
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">Instant 30s response guarantee</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-sm">
          <div className="text-zinc-500 text-[10px] uppercase font-bold mb-1 tracking-wider">Active SMS Threads</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-zinc-100">{kpis.activeSMSThreads}</span>
            <span className="text-zinc-400 text-xs font-mono">{kpis.avgSpeedToLeadSeconds}s avg speed</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">Normal load • Multi-turn active</p>
        </div>

        {/* KPI 3 */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-sm">
          <div className="text-zinc-500 text-[10px] uppercase font-bold mb-1 tracking-wider">Qualified Appointments</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-400">{kpis.qualifiedAppointments}</span>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 rounded uppercase">Ready</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">High Intent • Synced to FUB</p>
        </div>

        {/* KPI 4 */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-sm">
          <div className="text-zinc-500 text-[10px] uppercase font-bold mb-1 tracking-wider">Conversion Rate</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-zinc-100">{kpis.conversionRate}%</span>
            <span className="text-blue-400 text-xs font-semibold">{kpis.disqualifiedLeads} Disqualified</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">TRESA & RECO Compliance Safeguarded</p>
        </div>
      </div>

      {/* Main Grid: Recent Activity Stream + Integration Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Leads Stream */}
        <div className="lg:col-span-2 bg-zinc-900 rounded-xl border border-zinc-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">Live Inbound Qualification Stream</h3>
              <p className="text-[11px] text-zinc-400">Real-time status of GTA prospects in system</p>
            </div>
            <button
              id="view-all-leads-btn"
              onClick={() => onNavigateTab('leads')}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center space-x-1 transition-colors"
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
                  className="p-3 bg-zinc-800/30 hover:bg-zinc-800/60 rounded-lg border border-zinc-800/80 cursor-pointer transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isQualified
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : isDisqualified
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    }`}>
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-xs text-zinc-100 group-hover:text-blue-400 transition-colors">{lead.name}</h4>
                        <span className="text-[10px] text-zinc-500 font-mono">{lead.phone}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate max-w-sm mt-0.5">
                        {lead.search_criteria || 'Inbound property inquiry'}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] bg-zinc-950 px-2 py-0.5 rounded text-zinc-300 font-mono border border-zinc-800">
                          {lead.budget}
                        </span>
                        <span className="text-[10px] bg-zinc-950 px-2 py-0.5 rounded text-zinc-300 font-mono border border-zinc-800">
                          Timeline: {lead.timeline}
                        </span>
                        {lead.pre_approved && (
                          <span className="text-[9px] bg-emerald-900/40 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800/50">
                            Pre-Approved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-zinc-800 pt-2 sm:pt-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold border uppercase tracking-wider ${
                      isQualified
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : isDisqualified
                        ? 'bg-rose-950 text-rose-400 border-rose-800'
                        : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    }`}>
                      {lead.qualification_stage.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-1 font-mono">
                      {new Date(lead.last_contact_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Integration Health Panel */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">System Connections</h3>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 rounded uppercase tracking-wider flex items-center space-x-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Operational</span>
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-4">
              Latency & webhook sync status for {tenant.team_name}.
            </p>

            <div className="space-y-3">
              {/* FUB */}
              <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded bg-blue-950 text-blue-400 flex items-center justify-center font-bold text-[10px] border border-blue-800">
                    FUB
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-zinc-200">Follow Up Boss API</h4>
                    <span className="text-[10px] text-zinc-500">Auto-tagging & Note sync</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">{health.fub.latencyMs}ms</span>
                </div>
              </div>

              {/* Twilio */}
              <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded bg-rose-950 text-rose-400 flex items-center justify-center font-bold text-[10px] border border-rose-800">
                    SMS
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-zinc-200">Twilio Gateway</h4>
                    <span className="text-[10px] text-zinc-500">{tenant.twilio_phone_number}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">{health.twilio.latencyMs}ms</span>
                </div>
              </div>

              {/* Gemini */}
              <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded bg-zinc-800 text-blue-400 flex items-center justify-center font-bold text-[10px] border border-zinc-700">
                    AI
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-zinc-200">Gemini 3.6 Flash</h4>
                    <span className="text-[10px] text-zinc-500">ISA Compliance Engine</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">{health.gemini.latencyMs}ms</span>
                </div>
              </div>
            </div>
          </div>

          <button
            id="view-integrations-tab-btn"
            onClick={() => onNavigateTab('settings')}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium py-2 rounded-md border border-zinc-700 transition-colors flex items-center justify-center space-x-1"
          >
            <span>Team & API Settings</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
