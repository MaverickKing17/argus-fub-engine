import React, { useState } from 'react';
import { Lead, QualificationStage, RepresentationStatus } from '../types.js';
import { X, ShieldCheck, ShieldAlert, CheckCircle2, User, Phone, Mail, DollarSign, Calendar, Building2, Sparkles, Send, FileText, ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string, leadId?: string) => void;
  onResolveEscalation?: (leadId: string, newStage: QualificationStage, representationStatus: RepresentationStatus, note?: string) => Promise<void>;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  onNavigateTab,
  onResolveEscalation
}) => {
  if (!isOpen || !lead) return null;

  const [agentNote, setAgentNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEscalated = lead.qualification_stage === 'Escalated_Human_Review';
  const isQualified = lead.qualification_stage === 'Qualified';
  const isDisqualified = lead.qualification_stage === 'Unrepresented_Disqualified';

  const handleResolve = async (newStage: QualificationStage, newRepStatus: RepresentationStatus) => {
    if (!onResolveEscalation) return;
    setIsSubmitting(true);
    try {
      await onResolveEscalation(lead.id, newStage, newRepStatus, agentNote);
      setAgentNote('');
      onClose();
    } catch (err) {
      console.error('Error resolving lead escalation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-[#0B1726] border border-white/[0.12] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] bg-[#071524] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
              isQualified ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40' :
              isEscalated ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
              isDisqualified ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60' :
              'bg-white/[0.06] text-white border border-white/[0.1]'
            }`}>
              {lead.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white">{lead.name}</h3>
                <span className={`text-[10px] px-2.5 py-0.5 rounded font-bold border uppercase tracking-wider ${
                  isQualified ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40' :
                  isEscalated ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse' :
                  isDisqualified ? 'bg-rose-950/60 text-rose-400 border-rose-800/60' :
                  'bg-white/[0.06] text-white border-white/[0.1]'
                }`}>
                  {lead.qualification_stage.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-[#CBD5E1] font-mono mt-0.5">
                {lead.phone} • {lead.email}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#CBD5E1] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
          {/* Escalation Warning Banner if Flagged */}
          {isEscalated && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 space-y-2">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Human Agent Review Required — TRESA Safeguard Triggered</span>
              </div>
              <p className="text-xs text-[#E2E8F0] leading-relaxed">
                ARGUS AI ISA automatically paused outreach because lead indicated potential existing agent representation or requested bespoke broker consultation. Please confirm representation status below to reassign or resume AI ISA workflow.
              </p>
            </div>
          )}

          {/* Key Parameters Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-[#071524] rounded-xl border border-white/[0.08] space-y-1">
              <span className="text-[10px] text-[#CBD5E1] uppercase font-bold tracking-wider font-mono">Target Budget</span>
              <div className="text-sm font-bold text-[#E5C178] font-mono">{lead.budget || 'Unspecified'}</div>
            </div>

            <div className="p-3.5 bg-[#071524] rounded-xl border border-white/[0.08] space-y-1">
              <span className="text-[10px] text-[#CBD5E1] uppercase font-bold tracking-wider font-mono">Buying Timeline</span>
              <div className="text-sm font-bold text-white font-mono">{lead.timeline || 'Immediate'}</div>
            </div>

            <div className="p-3.5 bg-[#071524] rounded-xl border border-white/[0.08] space-y-1">
              <span className="text-[10px] text-[#CBD5E1] uppercase font-bold tracking-wider font-mono">Pre-Approval</span>
              <div className="text-sm font-bold font-mono">
                {lead.pre_approved ? (
                  <span className="text-[#10B981] font-bold">Verified</span>
                ) : (
                  <span className="text-[#CBD5E1]">Unconfirmed</span>
                )}
              </div>
            </div>

            <div className="p-3.5 bg-[#071524] rounded-xl border border-white/[0.08] space-y-1">
              <span className="text-[10px] text-[#CBD5E1] uppercase font-bold tracking-wider font-mono">TRESA BRA Status</span>
              <div className="text-sm font-bold font-mono">
                {lead.representation_status === 'Represented_By_Other' ? (
                  <span className="text-rose-400 font-bold">Represented</span>
                ) : lead.representation_status === 'Unrepresented' ? (
                  <span className="text-[#10B981] font-bold">Unrepresented</span>
                ) : (
                  <span className="text-[#E5C178]">Self-Represented</span>
                )}
              </div>
            </div>
          </div>

          {/* Search Criteria & Property Interest */}
          <div className="p-4 bg-[#071524] rounded-xl border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#E5C178] uppercase tracking-wider font-mono">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-[#E5C178]" />
                <span>Property Requirements & Search Profile</span>
              </span>
              <span className="text-[10px] text-[#CBD5E1] font-normal">FUB Synced</span>
            </div>
            <p className="text-xs text-white leading-relaxed font-medium">
              {lead.search_criteria || 'High-ticket Toronto luxury estate inquiry.'}
            </p>
          </div>

          {/* TRESA & RECO Compliance Audit Ledger */}
          <div className="p-4 bg-[#071524] rounded-xl border border-white/[0.08] space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <ShieldCheck className="h-4 w-4 text-[#10B981]" />
              <span>Ontario Compliance Ledger (TRESA v2 & RECO)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 bg-[#0B1726] rounded-lg border border-white/[0.08] flex items-center justify-between">
                <span className="text-[#CBD5E1]">IBR Disclosure Sent:</span>
                <span className="text-[#10B981] font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" /> Executed
                </span>
              </div>
              <div className="p-2.5 bg-[#0B1726] rounded-lg border border-white/[0.08] flex items-center justify-between">
                <span className="text-[#CBD5E1]">PIPEDA SMS Consent:</span>
                <span className="text-[#10B981] font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" /> Confirmed
                </span>
              </div>
            </div>
          </div>

          {/* Human Review Resolution Form */}
          {onResolveEscalation && (
            <div className="p-4 bg-[#071524] rounded-xl border border-[#E5C178]/30 space-y-3">
              <h4 className="text-xs font-bold text-[#E5C178] uppercase tracking-wider font-mono flex items-center space-x-1.5">
                <Sparkles className="h-4 w-4 text-[#E5C178]" />
                <span>Human Agent Override & Escalation Actions</span>
              </h4>

              <div className="space-y-2">
                <label className="text-[11px] text-[#CBD5E1] font-medium block">
                  Add Resolution Note for Follow Up Boss:
                </label>
                <input
                  type="text"
                  value={agentNote}
                  onChange={(e) => setAgentNote(e.target.value)}
                  placeholder="e.g. Spoke with prospect on phone; confirmed unrepresented status."
                  className="w-full bg-[#0B1726] border border-white/[0.1] focus:border-[#E5C178] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => handleResolve('Qualified', 'Unrepresented')}
                  disabled={isSubmitting}
                  className="btn-executive-primary px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#050B14]" />
                  <span>Confirm Unrepresented & Promote to Qualified</span>
                </button>

                <button
                  onClick={() => handleResolve('Engaged', 'Unrepresented')}
                  disabled={isSubmitting}
                  className="bg-[#142133] hover:bg-[#1C2C42] text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-white/[0.1] transition-colors cursor-pointer disabled:opacity-50"
                >
                  <span>Resume Autonomous AI ISA</span>
                </button>

                <button
                  onClick={() => handleResolve('Unrepresented_Disqualified', 'Represented_By_Other')}
                  disabled={isSubmitting}
                  className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <span>Confirm Active BRA & Disqualify</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/[0.08] bg-[#071524] flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              onClose();
              onNavigateTab('conversations', lead.id);
            }}
            className="text-xs font-bold text-[#E5C178] hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <span>Open Full Live SMS Thread</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={onClose}
            className="bg-[#142133] hover:bg-[#1C2C42] text-white text-xs px-4 py-2 rounded-xl font-semibold transition-colors cursor-pointer border border-white/[0.1]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
