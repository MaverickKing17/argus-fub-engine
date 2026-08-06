import React, { useState } from 'react';
import { Lead, QualificationStage, Tenant } from '../types.js';
import { Search, Filter, ShieldCheck, ShieldAlert, CheckCircle2, User, Phone, Mail, Calendar, DollarSign, Tag, ArrowUpRight, Building2 } from 'lucide-react';

interface LeadsPipelineProps {
  leads: Lead[];
  tenant: Tenant;
  onSelectLead: (leadId: string) => void;
  onNavigateTab: (tab: string, leadId?: string) => void;
}

export const LeadsPipeline: React.FC<LeadsPipelineProps> = ({
  leads,
  tenant,
  onSelectLead,
  onNavigateTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.search_criteria && lead.search_criteria.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStage = selectedStage === 'ALL' || lead.qualification_stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const getStageBadgeClass = (stage: QualificationStage) => {
    switch (stage) {
      case 'Qualified':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'Unrepresented_Disqualified':
        return 'bg-rose-950 text-rose-400 border-rose-800';
      case 'Engaged':
        return 'bg-cyan-950 text-cyan-400 border-cyan-800';
      default:
        return 'bg-blue-950 text-blue-400 border-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Leads & Qualification Pipeline</h2>
            <p className="text-xs text-slate-400 mt-1">
              Multi-tenant Database Tracking for {tenant.team_name} (Follow Up Boss Synced)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                id="search-leads-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, area..."
                className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Stage Filter Selector */}
            <div className="flex items-center space-x-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <Filter className="h-3.5 w-3.5 text-slate-400 ml-2" />
              <select
                id="filter-stage-select"
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="bg-transparent text-xs text-slate-200 font-medium cursor-pointer focus:outline-none pr-2 py-1"
              >
                <option value="ALL" className="bg-slate-900">All Qualification Stages ({leads.length})</option>
                <option value="New" className="bg-slate-900">New Leads</option>
                <option value="Engaged" className="bg-slate-900">Engaged in SMS</option>
                <option value="Qualified" className="bg-slate-900">Qualified Appointments</option>
                <option value="Unrepresented_Disqualified" className="bg-slate-900">RECO Disqualified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stage Summary Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[
            { stage: 'New', count: leads.filter((l) => l.qualification_stage === 'New').length, color: 'text-blue-400 bg-blue-950/40 border-blue-900' },
            { stage: 'Engaged', count: leads.filter((l) => l.qualification_stage === 'Engaged').length, color: 'text-cyan-400 bg-cyan-950/40 border-cyan-900' },
            { stage: 'Qualified', count: leads.filter((l) => l.qualification_stage === 'Qualified').length, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-900' },
            { stage: 'Unrepresented_Disqualified', count: leads.filter((l) => l.qualification_stage === 'Unrepresented_Disqualified').length, color: 'text-rose-400 bg-rose-950/40 border-rose-900' }
          ].map((item) => (
            <div
              key={item.stage}
              onClick={() => setSelectedStage(item.stage)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${item.color} ${selectedStage === item.stage ? 'ring-2 ring-cyan-400' : ''}`}
            >
              <div className="text-[11px] font-semibold uppercase tracking-wider opacity-80">{item.stage.replace('_', ' ')}</div>
              <div className="text-xl font-extrabold mt-0.5 font-mono">{item.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-200 text-xs sm:text-sm">
            <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Prospect Details</th>
                <th className="py-3.5 px-4 font-semibold">Qualification Stage</th>
                <th className="py-3.5 px-4 font-semibold">Budget & Timeline</th>
                <th className="py-3.5 px-4 font-semibold">Pre-Approved</th>
                <th className="py-3.5 px-4 font-semibold">RECO BRA Status</th>
                <th className="py-3.5 px-4 font-semibold">Follow Up Boss Sync</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLeads.map((lead) => {
                const isQ = lead.qualification_stage === 'Qualified';
                const isDis = lead.qualification_stage === 'Unrepresented_Disqualified';

                return (
                  <tr key={lead.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isQ ? 'bg-emerald-950 text-emerald-400' : isDis ? 'bg-rose-950 text-rose-400' : 'bg-cyan-950 text-cyan-400'
                        }`}>
                          {lead.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-100">{lead.name}</h4>
                          <div className="text-xs text-slate-400 font-mono flex items-center space-x-2 mt-0.5">
                            <span>{lead.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStageBadgeClass(lead.qualification_stage)}`}>
                        {lead.qualification_stage.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono font-medium text-slate-200">{lead.budget}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Timeline: {lead.timeline}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {lead.pre_approved ? (
                        <span className="bg-emerald-950/90 text-emerald-400 text-xs px-2 py-0.5 rounded font-semibold border border-emerald-800 flex items-center space-x-1 w-fit">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Pre-Approved</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs font-mono">Needs Broker</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium border ${
                        lead.representation_status === 'Represented_By_Other'
                          ? 'bg-rose-950 text-rose-400 border-rose-800'
                          : lead.representation_status === 'Unrepresented'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {lead.representation_status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(lead.tags || []).slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="bg-slate-800 text-cyan-300 text-[10px] px-2 py-0.5 rounded border border-slate-700 font-mono">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        id={`open-chat-btn-${lead.id}`}
                        onClick={() => {
                          onSelectLead(lead.id);
                          onNavigateTab('conversations', lead.id);
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs px-3 py-1.5 rounded-lg border border-slate-700 font-semibold transition-colors flex items-center space-x-1 ml-auto"
                      >
                        <span>Open Chat</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
