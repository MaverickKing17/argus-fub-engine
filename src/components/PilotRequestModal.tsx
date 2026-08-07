import React, { useState } from 'react';
import { X, Send, Sparkles, Building2, CheckCircle2, ShieldCheck, Users } from 'lucide-react';

interface PilotRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName?: string;
}

export function PilotRequestModal({ isOpen, onClose, teamName }: PilotRequestModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    brokerageName: teamName || '',
    teamSize: '6-20',
    currentCrm: 'Follow Up Boss',
    leadVolume: '50-200',
    email: '',
    phone: '',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/v1/pilot-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting pilot request:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#0B1726] border border-white/[0.12] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] bg-[#071524] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#142133] border border-white/[0.1] text-[#E5C178]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Request a Pilot Partnership
              </h2>
              <p className="text-xs text-[#CBD5E1] font-medium mt-0.5">
                Design Partner Program for Toronto & GTA Luxury Brokerages
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-[#CBD5E1] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">Pilot Application Received</h3>
                <p className="text-xs text-[#CBD5E1] leading-relaxed max-w-sm mx-auto font-medium">
                  Thank you for your interest in partnering with ARGUS AI. Our founder will be in touch within 24 hours to discuss pilot availability for your team.
                </p>
              </div>
              <div className="pt-4">
                <button
                  onClick={handleResetAndClose}
                  className="btn-executive-primary px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="p-3.5 bg-[#071524] rounded-xl border border-white/[0.08] flex items-start space-x-2.5 text-[#CBD5E1]">
                <Users className="h-4 w-4 text-[#E5C178] shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed font-medium">
                  We are working directly with a select cohort of founding brokerages to refine our autonomous speed-to-lead ISA workflows.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#CBD5E1] mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full bg-[#071524] border border-white/[0.1] focus:border-[#E5C178] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#CBD5E1] mb-1">
                    Brokerage / Team Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brokerageName}
                    onChange={(e) => setFormData({ ...formData, brokerageName: e.target.value })}
                    placeholder="e.g. Yorkville Luxury Group"
                    className="w-full bg-[#071524] border border-white/[0.1] focus:border-[#E5C178] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#CBD5E1] mb-1">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="s.jenkins@brokerage.ca"
                    className="w-full bg-[#071524] border border-white/[0.1] focus:border-[#E5C178] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#CBD5E1] mb-1">
                    Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (416) 555-0199"
                    className="w-full bg-[#071524] border border-white/[0.1] focus:border-[#E5C178] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#CBD5E1] mb-1">
                    Team Size
                  </label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    className="w-full bg-[#071524] border border-white/[0.1] focus:border-[#E5C178] rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="1-5" className="bg-[#071524]">1-5 agents</option>
                    <option value="6-20" className="bg-[#071524]">6-20 agents</option>
                    <option value="21-50" className="bg-[#071524]">21-50 agents</option>
                    <option value="50+" className="bg-[#071524]">50+ agents</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#CBD5E1] mb-1">
                    Current CRM
                  </label>
                  <select
                    value={formData.currentCrm}
                    onChange={(e) => setFormData({ ...formData, currentCrm: e.target.value })}
                    className="w-full bg-[#071524] border border-white/[0.1] focus:border-[#E5C178] rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="Follow Up Boss" className="bg-[#071524]">Follow Up Boss</option>
                    <option value="kvCORE" className="bg-[#071524]">kvCORE</option>
                    <option value="Salesforce" className="bg-[#071524]">Salesforce</option>
                    <option value="Lofty" className="bg-[#071524]">Lofty / Chime</option>
                    <option value="Other" className="bg-[#071524]">Other CRM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#CBD5E1] mb-1">
                    Monthly Leads
                  </label>
                  <select
                    value={formData.leadVolume}
                    onChange={(e) => setFormData({ ...formData, leadVolume: e.target.value })}
                    className="w-full bg-[#071524] border border-white/[0.1] focus:border-[#E5C178] rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="<50" className="bg-[#071524]">Under 50</option>
                    <option value="50-200" className="bg-[#071524]">50 - 200</option>
                    <option value="200-500" className="bg-[#071524]">200 - 500</option>
                    <option value="500+" className="bg-[#071524]">500+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#CBD5E1] mb-1">
                  Primary Lead Channels or Specific Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Realtor.ca PPC, Instagram ad leads, Yorkville listing inquiries..."
                  className="w-full bg-[#071524] border border-white/[0.1] focus:border-[#E5C178] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#CBD5E1] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-executive-primary px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 shadow-md"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Submit Pilot Request</span>
                      <Send className="h-3.5 w-3.5 text-[#050B14]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
