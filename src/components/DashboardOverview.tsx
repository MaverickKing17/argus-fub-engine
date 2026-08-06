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
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <Zap className="h-3.5 w-3.5" />
            <span>Speed-to-Lead Automation Active</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
            {tenant.team_name}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Qualifying GTA inbound buyers via Gemini 3.6 Flash SMS. Enforcing RECO representation compliance and auto-syncing notes & tags to Follow Up Boss.
          </p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            id="overview-test-lead-btn"
            onClick={onSimulateWebhook}
            className="flex-1 md:flex-none bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-950 flex items-center justify-center space-x-2 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>Fire Inbound FUB Webhook</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Leads Processed</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-2 font-mono">{kpis.totalLeads}</h3>
            </div>
            <div className="p-2.5 bg-blue-950/60 rounded-xl text-blue-400 border border-blue-800/50">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-1 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="h-3.5 w-3.5" /> +100%
            </span>
            <span>Speed-to-lead response</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active SMS Threads</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-2 font-mono">{kpis.activeSMSThreads}</h3>
            </div>
            <div className="p-2.5 bg-cyan-950/60 rounded-xl text-cyan-400 border border-cyan-800/50">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-1.5 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span>Avg Response: <strong className="text-slate-200">{kpis.avgSpeedToLeadSeconds}s</strong></span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Qualified Appointments</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-2 font-mono">{kpis.qualifiedAppointments}</h3>
            </div>
            <div className="p-2.5 bg-emerald-950/60 rounded-xl text-emerald-400 border border-emerald-800/50">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-1 text-xs text-slate-400">
            <span className="text-emerald-400 font-medium">Ready for Senior Agents</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Conversion Rate %</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-2 font-mono">{kpis.conversionRate}%</h3>
            </div>
            <div className="p-2.5 bg-purple-950/60 rounded-xl text-purple-400 border border-purple-800/50">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-1 text-xs text-slate-400">
            <span className="text-slate-300 font-semibold">{kpis.disqualifiedLeads} RECO Filtered</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Activity + Integration Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads Feed */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Live Inbound Qualification Stream</h3>
              <p className="text-xs text-slate-400">Real-time status of GTA real estate prospects</p>
            </div>
            <button
              id="view-all-leads-btn"
              onClick={() => onNavigateTab('leads')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <span>View All Pipeline</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentLeads.map((lead) => {
              const isQualified = lead.qualification_stage === 'Qualified';
              const isDisqualified = lead.qualification_stage === 'Unrepresented_Disqualified';

              return (
                <div
                  key={lead.id}
                  onClick={() => onNavigateTab('conversations', lead.id)}
                  className="p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/60 cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      isQualified
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                        : isDisqualified
                        ? 'bg-rose-950 text-rose-400 border border-rose-800/80'
                        : 'bg-cyan-950 text-cyan-400 border border-cyan-800/80'
                    }`}>
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">{lead.name}</h4>
                        <span className="text-xs text-slate-500 font-mono">{lead.phone}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {lead.search_criteria || 'Inbound property inquiry'}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[11px] bg-slate-900 px-2 py-0.5 rounded text-slate-300 font-mono border border-slate-700">
                          {lead.budget}
                        </span>
                        <span className="text-[11px] bg-slate-900 px-2 py-0.5 rounded text-slate-300 font-mono border border-slate-700">
                          Timeline: {lead.timeline}
                        </span>
                        {lead.pre_approved && (
                          <span className="text-[10px] bg-emerald-950/80 text-emerald-400 px-1.5 py-0.5 rounded font-semibold border border-emerald-800/50">
                            Pre-Approved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-slate-700/40 pt-2 sm:pt-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                      isQualified
                        ? 'bg-emerald-950/90 text-emerald-400 border-emerald-800'
                        : isDisqualified
                        ? 'bg-rose-950/90 text-rose-400 border-rose-800'
                        : 'bg-cyan-950/90 text-cyan-400 border-cyan-800'
                    }`}>
                      {lead.qualification_stage.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      {new Date(lead.last_contact_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Integration Health Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-100">Integration Health</h3>
              <span className="flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>All Systems Live</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Real-time API connectivity status across core SaaS infrastructure.
            </p>

            {/* Health List */}
            <div className="space-y-4">
              {/* FUB */}
              <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/70 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center font-bold text-xs">
                    FUB
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">Follow Up Boss API</h4>
                    <span className="text-[11px] text-slate-400">Sync: Tags, Notes, Stage</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">{health.fub.latencyMs}ms</span>
                  <p className="text-[10px] text-slate-500">Connected</p>
                </div>
              </div>

              {/* Twilio */}
              <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/70 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-rose-950 text-rose-400 flex items-center justify-center font-bold text-xs">
                    SMS
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">Twilio SMS Webhooks</h4>
                    <span className="text-[11px] text-slate-400">Num: {tenant.twilio_phone_number}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">{health.twilio.latencyMs}ms</span>
                  <p className="text-[10px] text-slate-500">Listening</p>
                </div>
              </div>

              {/* Gemini */}
              <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/70 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-xs">
                    AI
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">Gemini 3.6 Flash Engine</h4>
                    <span className="text-[11px] text-slate-400">ISA Structured Outputs</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">{health.gemini.latencyMs}ms</span>
                  <p className="text-[10px] text-slate-500">Active</p>
                </div>
              </div>
            </div>
          </div>

          <button
            id="view-integrations-tab-btn"
            onClick={() => onNavigateTab('integrations')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>Manage API Keys & Webhooks</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
