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
        return 'bg-blue-950 text-blue-400 border-blue-800';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Filter Controls */}
      <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-100">Leads & Qualification Pipeline</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Multi-tenant Database Tracking for {tenant.team_name} (Follow Up Boss Synced)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-zinc-500" />
              <input
                id="search-leads-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, area..."
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-blue-500 rounded-md pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none"
              />
            </div>

            {/* Stage Filter Selector */}
            <div className="flex items-center space-x-1.5 bg-zinc-800 p-1 rounded-md border border-zinc-700">
              <Filter className="h-3.5 w-3.5 text-zinc-400 ml-2" />
              <select
                id="filter-stage-select"
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="bg-transparent text-xs text-zinc-200 font-medium cursor-pointer focus:outline-none pr-2 py-0.5"
              >
                <option value="ALL" className="bg-zinc-900">All Qualification Stages ({leads.length})</option>
                <option value="New" className="bg-zinc-900">New Leads</option>
                <option value="Engaged" className="bg-zinc-900">Engaged in SMS</option>
                <option value="Qualified" className="bg-zinc-900">Qualified Appointments</option>
                <option value="Unrepresented_Disqualified" className="bg-zinc-900">RECO Disqualified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stage Summary Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {[
            { stage: 'New', count: leads.filter((l) => l.qualification_stage === 'New').length, color: 'text-zinc-300 bg-zinc-950 border-zinc-800' },
            { stage: 'Engaged', count: leads.filter((l) => l.qualification_stage === 'Engaged').length, color: 'text-blue-400 bg-blue-950/40 border-blue-900' },
            { stage: 'Qualified', count: leads.filter((l) => l.qualification_stage === 'Qualified').length, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-900' },
            { stage: 'Unrepresented_Disqualified', count: leads.filter((l) => l.qualification_stage === 'Unrepresented_Disqualified').length, color: 'text-rose-400 bg-rose-950/40 border-rose-900' }
          ].map((item) => (
            <div
              key={item.stage}
              onClick={() => setSelectedStage(item.stage)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${item.color} ${selectedStage === item.stage ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">{item.stage.replace('_', ' ')}</div>
              <div className="text-xl font-bold mt-0.5 font-mono">{item.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-zinc-200 text-xs sm:text-sm">
            <thead className="bg-zinc-950 text-zinc-400 text-[10px] uppercase font-mono tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Prospect Details</th>
                <th className="py-3 px-4 font-semibold">Qualification Stage</th>
                <th className="py-3 px-4 font-semibold">Budget & Timeline</th>
                <th className="py-3 px-4 font-semibold">Pre-Approved</th>
                <th className="py-3 px-4 font-semibold">RECO BRA Status</th>
                <th className="py-3 px-4 font-semibold">Follow Up Boss Sync</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredLeads.map((lead) => {
                const isQ = lead.qualification_stage === 'Qualified';
                const isDis = lead.qualification_stage === 'Unrepresented_Disqualified';

                return (
                  <tr key={lead.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isQ ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : isDis ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}>
                          {lead.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs text-zinc-100">{lead.name}</h4>
                          <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                            <span>{lead.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getStageBadgeClass(lead.qualification_stage)}`}>
                        {lead.qualification_stage.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono text-xs font-semibold text-zinc-200">{lead.budget}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Timeline: {lead.timeline}</div>
                    </td>

                    <td className="py-3 px-4">
                      {lead.pre_approved ? (
                        <span className="bg-emerald-950/80 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-800/60 flex items-center space-x-1 w-fit">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Pre-Approved</span>
                        </span>
                      ) : (
                        <span className="text-zinc-500 text-[10px] font-mono">Needs Broker</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold border uppercase tracking-wider ${
                        lead.representation_status === 'Represented_By_Other'
                          ? 'bg-rose-950 text-rose-400 border-rose-800'
                          : lead.representation_status === 'Unrepresented'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}>
                        {lead.representation_status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(lead.tags || []).slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="bg-zinc-950 text-blue-300 text-[9px] px-1.5 py-0.5 rounded border border-zinc-800 font-mono">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        id={`open-chat-btn-${lead.id}`}
                        onClick={() => {
                          onSelectLead(lead.id);
                          onNavigateTab('conversations', lead.id);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md font-bold transition-colors flex items-center space-x-1 ml-auto"
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
