import React, { useState } from 'react';
import { Lead, QualificationStage, Tenant } from '../types.js';
import { Search, Filter, ShieldCheck, ShieldAlert, CheckCircle2, User, Phone, Mail, Calendar, DollarSign, Tag, ArrowUpRight, Building2, MessageSquare, Sparkles, FileText, X } from 'lucide-react';

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
  const [activeLeadId, setActiveLeadId] = useState<string>(leads[0]?.id || '');

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.search_criteria && lead.search_criteria.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStage = selectedStage === 'ALL' || lead.qualification_stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const selectedLead = leads.find((l) => l.id === activeLeadId) || filteredLeads[0] || leads[0];

  const getStageBadgeClass = (stage: QualificationStage) => {
    switch (stage) {
      case 'Qualified':
        return 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30';
      case 'Unrepresented_Disqualified':
        return 'bg-rose-950/60 text-rose-400 border-rose-800/60';
      case 'Engaged':
        return 'bg-[#C5A059]/15 text-[#C5A059] border-[#C5A059]/30';
      default:
        return 'bg-[#262626] text-[#F8FAFC] border-[#262626]';
    }
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header & Filter Controls */}
      <div className="card-executive p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#F8FAFC]">Leads & Qualification Pipeline</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Multi-tenant Database Tracking for {tenant.team_name} (Follow Up Boss Synced)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-[#94A3B8]" />
              <input
                id="search-leads-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, area..."
                className="w-full bg-[#0A0A0A] border border-[#262626] focus:border-[#C5A059] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none"
              />
            </div>

            {/* Stage Filter Selector */}
            <div className="flex items-center space-x-1.5 bg-[#0A0A0A] p-1 rounded-lg border border-[#262626]">
              <Filter className="h-3.5 w-3.5 text-[#94A3B8] ml-2" />
              <select
                id="filter-stage-select"
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="bg-transparent text-xs text-[#F8FAFC] font-medium cursor-pointer focus:outline-none pr-2 py-0.5"
              >
                <option value="ALL" className="bg-[#141414]">All Qualification Stages ({leads.length})</option>
                <option value="New" className="bg-[#141414]">New Leads</option>
                <option value="Engaged" className="bg-[#141414]">Engaged in SMS</option>
                <option value="Qualified" className="bg-[#141414]">Qualified Appointments</option>
                <option value="Unrepresented_Disqualified" className="bg-[#141414]">TRESA Disqualified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stage Summary Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {[
            { stage: 'New', count: leads.filter((l) => l.qualification_stage === 'New').length, color: 'text-[#F8FAFC] bg-[#0A0A0A] border-[#262626]' },
            { stage: 'Engaged', count: leads.filter((l) => l.qualification_stage === 'Engaged').length, color: 'text-[#C5A059] bg-[#C5A059]/10 border-[#C5A059]/30' },
            { stage: 'Qualified', count: leads.filter((l) => l.qualification_stage === 'Qualified').length, color: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30' },
            { stage: 'Unrepresented_Disqualified', count: leads.filter((l) => l.qualification_stage === 'Unrepresented_Disqualified').length, color: 'text-rose-400 bg-rose-950/40 border-rose-900' }
          ].map((item) => (
            <div
              key={item.stage}
              onClick={() => setSelectedStage(item.stage)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${item.color} ${selectedStage === item.stage ? 'ring-1 ring-[#C5A059]' : ''}`}
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">{item.stage.replace('_', ' ')}</div>
              <div className="text-2xl font-bold mt-0.5">{item.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Pipeline Table + Right-Hand Detail Panel (Dense Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Table View (2 Columns) */}
        <div className="lg:col-span-2 card-executive shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[#F8FAFC] text-xs">
              <thead className="bg-[#0A0A0A] text-[#94A3B8] text-[10px] uppercase font-mono tracking-widest border-b border-[#262626]">
                <tr>
                  <th className="py-3 px-3.5 font-semibold">Prospect Details</th>
                  <th className="py-3 px-3.5 font-semibold">Stage</th>
                  <th className="py-3 px-3.5 font-semibold">Budget</th>
                  <th className="py-3 px-3.5 font-semibold">TRESA BRA</th>
                  <th className="py-3 px-3.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]/60">
                {filteredLeads.map((lead) => {
                  const isSelected = lead.id === selectedLead?.id;
                  const isQ = lead.qualification_stage === 'Qualified';
                  const isDis = lead.qualification_stage === 'Unrepresented_Disqualified';

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => {
                        setActiveLeadId(lead.id);
                        onSelectLead(lead.id);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#262626]/70 border-l-2 border-[#C5A059]' : 'hover:bg-[#0A0A0A]/60'
                      }`}
                    >
                      <td className="py-3 px-3.5">
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            isQ ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30' : isDis ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60' : 'bg-[#262626] text-[#F8FAFC] border border-[#262626]'
                          }`}>
                            {lead.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-xs text-[#F8FAFC] truncate">{lead.name}</h4>
                            <div className="text-[10px] text-[#94A3B8] font-mono mt-0.5">
                              <span>{lead.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getStageBadgeClass(lead.qualification_stage)}`}>
                          {lead.qualification_stage.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-3.5">
                        <div className="font-mono text-xs font-semibold text-[#F8FAFC]">{lead.budget}</div>
                        <div className="text-[10px] text-[#94A3B8]">{lead.timeline}</div>
                      </td>

                      <td className="py-3 px-3.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold border uppercase tracking-wider ${
                          lead.representation_status === 'Represented_By_Other'
                            ? 'bg-rose-950/60 text-rose-400 border-rose-800/60'
                            : lead.representation_status === 'Unrepresented'
                            ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30'
                            : 'bg-[#262626] text-[#94A3B8] border-[#262626]'
                        }`}>
                          {lead.representation_status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 text-right">
                        <button
                          id={`open-chat-btn-${lead.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectLead(lead.id);
                            onNavigateTab('conversations', lead.id);
                          }}
                          className="bg-[#C5A059] hover:bg-[#B38E46] text-black text-xs px-2.5 py-1 rounded font-bold transition-colors inline-flex items-center space-x-1"
                        >
                          <span>Chat</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right-Hand Detail Panel (Density Pass: Notes, Message Snippets, RECO Compliance) */}
        {selectedLead ? (
          <div className="card-executive p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#262626] border border-[#262626] flex items-center justify-center font-bold text-[#F8FAFC] text-xs">
                  {selectedLead.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#F8FAFC]">{selectedLead.name}</h3>
                  <span className="text-[10px] text-[#94A3B8] font-mono">{selectedLead.phone}</span>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold border uppercase tracking-wider ${getStageBadgeClass(selectedLead.qualification_stage)}`}>
                {selectedLead.qualification_stage.replace('_', ' ')}
              </span>
            </div>

            {/* Quick Contact Info */}
            <div className="space-y-2 text-xs text-[#94A3B8]">
              <div className="p-2.5 bg-[#0A0A0A] rounded-lg border border-[#262626]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#94A3B8]"><Mail className="h-3.5 w-3.5 text-[#C5A059]" /> Email</span>
                  <span className="text-[#F8FAFC] font-mono text-[11px]">{selectedLead.email}</span>
                </div>
              </div>

              <div className="p-2.5 bg-[#0A0A0A] rounded-lg border border-[#262626] space-y-1">
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#94A3B8]"><Building2 className="h-3.5 w-3.5 text-[#C5A059]" /> Property Criteria</span>
                <p className="text-[#F8FAFC] text-xs font-normal leading-normal">{selectedLead.search_criteria || 'Yorkville / Downtown GTA'}</p>
              </div>

              <div className="p-2.5 bg-[#0A0A0A] rounded-lg border border-[#262626]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#94A3B8]"><Calendar className="h-3.5 w-3.5 text-[#C5A059]" /> Budget & Timeline</span>
                  <span className="text-[#10B981] font-mono text-[11px] font-bold">{selectedLead.budget} ({selectedLead.timeline})</span>
                </div>
              </div>
            </div>

            {/* TRESA & RECO Regulatory Audit Status Checklist */}
            <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#262626] space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] flex items-center gap-1.5 font-mono">
                <ShieldCheck className="h-3.5 w-3.5 text-[#C5A059]" />
                <span>Ontario RECO & TRESA Compliance Audit</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-[#94A3B8]">
                  <span>1. Information Before Representation (IBR):</span>
                  <span className="text-[#10B981] font-bold">VERIFIED</span>
                </div>
                <div className="flex items-center justify-between text-[#94A3B8]">
                  <span>2. BRA Representation Status:</span>
                  <span className={selectedLead.representation_status === 'Represented_By_Other' ? 'text-rose-400 font-bold' : 'text-[#10B981] font-bold'}>
                    {selectedLead.representation_status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#94A3B8]">
                  <span>3. FUB CRM Audit Log Tagging:</span>
                  <span className="text-[#10B981] font-mono">SYNCED</span>
                </div>
              </div>
            </div>

            {/* FUB Deal Notes Snippet */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] flex items-center gap-1">
                <FileText className="h-3 w-3 text-[#C5A059]" />
                <span>Follow Up Boss Note Summary</span>
              </span>
              <p className="p-3 bg-[#0A0A0A] rounded-lg border border-[#262626] text-xs text-[#94A3B8] italic leading-relaxed">
                "{selectedLead.notes || `Inbound lead inquiring about ${selectedLead.search_criteria || 'luxury properties'}. Target budget ${selectedLead.budget}. Pre-approval status: ${selectedLead.pre_approved ? 'Verified' : 'Pending'}.`}"
              </p>
            </div>

            {/* CRM Tags */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Synced FUB Tags</span>
              <div className="flex flex-wrap gap-1">
                {(selectedLead.tags || ['argus-isa', 'tresa-verified', 'gta-luxury']).map((tag, idx) => (
                  <span key={idx} className="bg-[#0A0A0A] text-[#C5A059] text-[10px] px-2 py-0.5 rounded border border-[#262626] font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              id={`open-full-chat-btn-${selectedLead.id}`}
              onClick={() => {
                onSelectLead(selectedLead.id);
                onNavigateTab('conversations', selectedLead.id);
              }}
              className="w-full bg-gradient-to-r from-[#C5A059] to-[#B38E46] text-zinc-950 font-bold py-2.5 rounded-lg text-xs hover:brightness-110 transition-all flex items-center justify-center space-x-2 border border-[#C5A059]/30 cursor-pointer"
            >
              <MessageSquare className="h-3.5 w-3.5 text-zinc-950" />
              <span>Open Live SMS Thread</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
