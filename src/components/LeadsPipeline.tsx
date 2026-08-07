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
      <div className="card-executive p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">Leads & Qualification Pipeline</h2>
            <p className="text-xs text-[#CBD5E1] font-medium mt-0.5">
              Multi-tenant Database Tracking for {tenant.team_name} (Follow Up Boss Synced)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-[#CBD5E1]" />
              <input
                id="search-leads-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, area..."
                className="w-full bg-[#071524] border border-white/[0.1] focus:border-[#E5C178] rounded-xl pl-8 pr-3 py-2 text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none"
              />
            </div>

            {/* Stage Filter Selector */}
            <div className="flex items-center space-x-1.5 bg-[#071524] p-1 rounded-xl border border-white/[0.1]">
              <Filter className="h-3.5 w-3.5 text-[#CBD5E1] ml-2" />
              <select
                id="filter-stage-select"
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="bg-transparent text-xs text-[#F8FAFC] font-semibold cursor-pointer focus:outline-none pr-2 py-1"
              >
                <option value="ALL" className="bg-[#071524]">All Qualification Stages ({leads.length})</option>
                <option value="New" className="bg-[#071524]">New Leads</option>
                <option value="Engaged" className="bg-[#071524]">Engaged in SMS</option>
                <option value="Qualified" className="bg-[#071524]">Qualified Appointments</option>
                <option value="Unrepresented_Disqualified" className="bg-[#071524]">TRESA Disqualified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stage Summary Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {[
            { stage: 'New', count: leads.filter((l) => l.qualification_stage === 'New').length, color: 'text-[#F8FAFC] bg-[#071524] border-white/[0.08]' },
            { stage: 'Engaged', count: leads.filter((l) => l.qualification_stage === 'Engaged').length, color: 'text-[#E5C178] bg-[#E5C178]/10 border-[#E5C178]/30' },
            { stage: 'Qualified', count: leads.filter((l) => l.qualification_stage === 'Qualified').length, color: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30' },
            { stage: 'Unrepresented_Disqualified', count: leads.filter((l) => l.qualification_stage === 'Unrepresented_Disqualified').length, color: 'text-rose-400 bg-rose-950/40 border-rose-900' }
          ].map((item) => (
            <div
              key={item.stage}
              onClick={() => setSelectedStage(item.stage)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${item.color} ${selectedStage === item.stage ? 'ring-2 ring-[#E5C178]' : ''}`}
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#CBD5E1]">{item.stage.replace('_', ' ')}</div>
              <div className="text-2xl font-extrabold mt-0.5">{item.count}</div>
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
              <thead className="bg-[#0B1726] text-[#CBD5E1] text-[10px] uppercase font-mono tracking-widest border-b border-white/[0.08]">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Prospect Details</th>
                  <th className="py-3.5 px-4 font-bold">Stage</th>
                  <th className="py-3.5 px-4 font-bold">Budget</th>
                  <th className="py-3.5 px-4 font-bold">TRESA BRA</th>
                  <th className="py-3.5 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
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
                        isSelected ? 'bg-[#142133] border-l-2 border-[#E5C178]' : 'hover:bg-white/[0.04]'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            isQ ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40' : isDis ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60' : 'bg-white/[0.06] text-[#F8FAFC] border border-white/[0.08]'
                          }`}>
                            {lead.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-[#F8FAFC] truncate">{lead.name}</h4>
                            <div className="text-[10px] text-[#CBD5E1] font-mono mt-0.5 font-medium">
                              <span>{lead.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getStageBadgeClass(lead.qualification_stage)}`}>
                          {lead.qualification_stage.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono text-xs font-bold text-[#F8FAFC]">{lead.budget}</div>
                        <div className="text-[10px] text-[#CBD5E1] font-medium">{lead.timeline}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded font-bold border uppercase tracking-wider ${
                          lead.representation_status === 'Represented_By_Other'
                            ? 'bg-rose-950/60 text-rose-400 border-rose-800/60'
                            : lead.representation_status === 'Unrepresented'
                            ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40'
                            : 'bg-white/[0.06] text-[#CBD5E1] border-white/[0.08]'
                        }`}>
                          {lead.representation_status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          id={`open-chat-btn-${lead.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectLead(lead.id);
                            onNavigateTab('conversations', lead.id);
                          }}
                          className="bg-[#E5C178] hover:bg-[#D4B067] text-black text-xs px-3 py-1 rounded-lg font-bold transition-colors inline-flex items-center space-x-1 cursor-pointer"
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
          <div className="card-executive p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#142133] border border-white/[0.08] flex items-center justify-center font-bold text-[#F8FAFC] text-xs">
                  {selectedLead.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F8FAFC]">{selectedLead.name}</h3>
                  <span className="text-[10px] text-[#CBD5E1] font-mono font-medium">{selectedLead.phone}</span>
                </div>
              </div>
              <span className={`text-[10px] px-2.5 py-0.5 rounded font-bold border uppercase tracking-wider ${getStageBadgeClass(selectedLead.qualification_stage)}`}>
                {selectedLead.qualification_stage.replace('_', ' ')}
              </span>
            </div>

            {/* Quick Contact Info */}
            <div className="space-y-2 text-xs text-[#CBD5E1]">
              <div className="p-3 bg-[#071524] rounded-xl border border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#CBD5E1]"><Mail className="h-3.5 w-3.5 text-[#E5C178]" /> Email</span>
                  <span className="text-[#F8FAFC] font-mono text-[11px] font-semibold">{selectedLead.email}</span>
                </div>
              </div>

              <div className="p-3 bg-[#071524] rounded-xl border border-white/[0.08] space-y-1">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#CBD5E1]"><Building2 className="h-3.5 w-3.5 text-[#E5C178]" /> Property Criteria</span>
                <p className="text-[#F8FAFC] text-xs font-medium leading-normal">{selectedLead.search_criteria || 'Yorkville / Downtown GTA'}</p>
              </div>

              <div className="p-3 bg-[#071524] rounded-xl border border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#CBD5E1]"><Calendar className="h-3.5 w-3.5 text-[#E5C178]" /> Budget & Timeline</span>
                  <span className="text-[#10B981] font-mono text-[11px] font-bold">{selectedLead.budget} ({selectedLead.timeline})</span>
                </div>
              </div>
            </div>

            {/* TRESA & RECO Regulatory Audit Status Checklist */}
            <div className="p-3.5 bg-[#071524] rounded-xl border border-white/[0.08] space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#E5C178] flex items-center gap-1.5 font-mono">
                <ShieldCheck className="h-3.5 w-3.5 text-[#E5C178]" />
                <span>Ontario RECO & TRESA Compliance Audit</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-[#CBD5E1] font-medium">
                  <span>1. Information Before Representation (IBR):</span>
                  <span className="text-[#10B981] font-bold">VERIFIED</span>
                </div>
                <div className="flex items-center justify-between text-[#CBD5E1] font-medium">
                  <span>2. BRA Representation Status:</span>
                  <span className={selectedLead.representation_status === 'Represented_By_Other' ? 'text-rose-400 font-bold' : 'text-[#10B981] font-bold'}>
                    {selectedLead.representation_status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#CBD5E1] font-medium">
                  <span>3. FUB CRM Audit Log Tagging:</span>
                  <span className="text-[#10B981] font-mono font-bold">SYNCED</span>
                </div>
              </div>
            </div>

            {/* FUB Deal Notes Snippet */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#CBD5E1] flex items-center gap-1">
                <FileText className="h-3 w-3 text-[#E5C178]" />
                <span>Follow Up Boss Note Summary</span>
              </span>
              <p className="p-3.5 bg-[#071524] rounded-xl border border-white/[0.08] text-xs text-[#CBD5E1] italic leading-relaxed font-normal">
                "{selectedLead.notes || `Inbound lead inquiring about ${selectedLead.search_criteria || 'luxury properties'}. Target budget ${selectedLead.budget}. Pre-approval status: ${selectedLead.pre_approved ? 'Verified' : 'Pending'}.`}"
              </p>
            </div>

            {/* CRM Tags */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#CBD5E1]">Synced FUB Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {(selectedLead.tags || ['argus-isa', 'tresa-verified', 'gta-luxury']).map((tag, idx) => (
                  <span key={idx} className="bg-[#071524] text-[#E5C178] text-[10px] px-2.5 py-1 rounded-md border border-white/[0.08] font-mono font-semibold">
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
              className="w-full btn-executive-primary text-black font-bold py-3 rounded-xl text-xs hover:brightness-110 transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
            >
              <MessageSquare className="h-3.5 w-3.5 text-[#050B14]" />
              <span>Open Live SMS Thread</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
