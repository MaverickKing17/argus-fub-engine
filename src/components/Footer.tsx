import React, { useState } from 'react';
import { Building2, ShieldCheck, Zap, Lock, ExternalLink, CheckCircle2, Globe, FileText, Copyright, Smartphone, Scale } from 'lucide-react';
import { LegalModal, LegalTab } from './LegalModal.js';

interface FooterProps {
  teamName: string;
  onOpenLegal?: (tab: LegalTab) => void;
}

export function Footer({ teamName, onOpenLegal }: FooterProps) {
  const [localModalTab, setLocalModalTab] = useState<LegalTab | null>(null);

  const handleLegalClick = (tab: LegalTab) => {
    if (onOpenLegal) {
      onOpenLegal(tab);
    } else {
      setLocalModalTab(tab);
    }
  };

  return (
    <footer className="mt-16 border-t border-[#283042] bg-[#07090E] text-[#94A3B8] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Strategic Scope */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg border border-[#E5C178]/40 bg-[#151A24] overflow-hidden flex items-center justify-center shrink-0">
                <img
                  src="https://i.imgur.com/1Ww7pS4.png"
                  alt="ARGUS AI Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-bold text-white tracking-wide text-sm font-sans">ARGUS AI</span>
                <span className="ml-1.5 text-[10px] font-bold text-[#E5C178] bg-[#E5C178]/10 px-1.5 py-0.5 rounded border border-[#E5C178]/25 font-mono">
                  LUXURY GTA
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-[#CBD5E1] font-medium max-w-md">
              Autonomous speed-to-lead ISA engine tailored specifically for high-ticket Toronto & GTA luxury real estate brokerages. Integrated with Follow Up Boss & designed to align with TRESA / RECO disclosure guidelines.
            </p>

            <div className="p-3 bg-[#111522] border border-[#283042] rounded-xl text-[11px] text-[#CBD5E1] leading-relaxed font-medium">
              <span className="text-[#E5C178] font-bold block mb-0.5">Early-Stage Platform Notice</span>
              Workflows are designed to align with TRESA/RECO disclosure guidelines but do not substitute for formal legal or brokerage compliance review.
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-[#E5C178] font-mono">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
              <span>Active Tenant: <strong className="text-white font-bold">{teamName}</strong></span>
            </div>
          </div>

          {/* Col 2: Legal & Governance Center */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center space-x-1.5">
              <Scale className="h-3.5 w-3.5 text-[#E5C178]" />
              <span>Legal Governance</span>
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => handleLegalClick('terms')}
                  className="flex items-center space-x-1.5 text-[#CBD5E1] hover:text-[#E5C178] transition-colors cursor-pointer text-left"
                >
                  <FileText className="h-3 w-3 text-[#E5C178] shrink-0" />
                  <span>Terms & Conditions</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLegalClick('privacy')}
                  className="flex items-center space-x-1.5 text-[#CBD5E1] hover:text-[#E5C178] transition-colors cursor-pointer text-left"
                >
                  <Lock className="h-3 w-3 text-[#10B981] shrink-0" />
                  <span>Privacy Policy (PIPEDA)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLegalClick('disclaimer')}
                  className="flex items-center space-x-1.5 text-[#CBD5E1] hover:text-[#E5C178] transition-colors cursor-pointer text-left"
                >
                  <ShieldCheck className="h-3 w-3 text-[#E5C178] shrink-0" />
                  <span>RECO & TRESA Disclaimer</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLegalClick('dmca')}
                  className="flex items-center space-x-1.5 text-[#CBD5E1] hover:text-[#E5C178] transition-colors cursor-pointer text-left"
                >
                  <Copyright className="h-3 w-3 text-[#E5C178] shrink-0" />
                  <span>DMCA & Copyright Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLegalClick('casl')}
                  className="flex items-center space-x-1.5 text-[#CBD5E1] hover:text-[#E5C178] transition-colors cursor-pointer text-left"
                >
                  <Smartphone className="h-3 w-3 text-[#10B981] shrink-0" />
                  <span>CASL & SMS Opt-In</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Regulatory Alignment (TRESA & RECO) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center space-x-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
              <span>Ontario Compliance Alignment</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#111522] border border-[#283042] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-[11px]">TRESA Alignment</span>
                  <span className="text-[10px] text-[#10B981] font-mono font-bold">ALIGNED</span>
                </div>
                <p className="text-[11px] text-[#CBD5E1] leading-normal font-normal">
                  Information Before Representation (IBR) disclosures issued automatically via SMS before intent capture.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#111522] border border-[#283042] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-[11px]">RECO BRA Safeguards</span>
                  <span className="text-[10px] text-[#10B981] font-mono font-bold">ALIGNED</span>
                </div>
                <p className="text-[11px] text-[#CBD5E1] leading-normal font-normal">
                  Immediate halt or escalation on leads represented under active Buyer Representation Agreements.
                </p>
              </div>
            </div>
          </div>

          {/* Col 4: Platform Infrastructure & System Status */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center space-x-1.5">
              <Zap className="h-3.5 w-3.5 text-[#E5C178]" />
              <span>Enterprise Gateway</span>
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded bg-[#111522] border border-[#283042]">
                <span className="text-[#CBD5E1] text-[11px] font-medium">Follow Up Boss API</span>
                <span className="text-[#10B981] text-[11px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span> 142ms
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-[#111522] border border-[#283042]">
                <span className="text-[#CBD5E1] text-[11px] font-medium">Twilio SMS Gateway</span>
                <span className="text-[#10B981] text-[11px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span> 98ms
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-[#111522] border border-[#283042]">
                <span className="text-[#CBD5E1] text-[11px] font-medium">Gemini 3.6 Luxury ISA</span>
                <span className="text-[#10B981] text-[11px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span> 380ms
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#283042] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#CBD5E1]">
          <div className="flex flex-wrap items-center gap-2">
            <span>© {new Date().getFullYear()} ARGUS AI Technologies Inc. All rights reserved.</span>
            <span>•</span>
            <span className="text-[#E5C178] font-semibold">Toronto Luxury Real Estate Suite</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              onClick={() => handleLegalClick('terms')}
              className="flex items-center gap-1.5 text-[11px] text-[#CBD5E1] hover:text-white transition-colors cursor-pointer font-medium"
            >
              <FileText className="h-3 w-3 text-[#E5C178]" /> Terms
            </button>
            <button
              onClick={() => handleLegalClick('privacy')}
              className="flex items-center gap-1.5 text-[11px] text-[#CBD5E1] hover:text-white transition-colors cursor-pointer font-medium"
            >
              <Lock className="h-3 w-3 text-[#10B981]" /> Privacy (PIPEDA)
            </button>
            <button
              onClick={() => handleLegalClick('disclaimer')}
              className="flex items-center gap-1.5 text-[11px] text-[#CBD5E1] hover:text-white transition-colors cursor-pointer font-medium"
            >
              <Globe className="h-3 w-3 text-[#E5C178]" /> RECO & TRESA
            </button>
            <button
              onClick={() => handleLegalClick('dmca')}
              className="flex items-center gap-1.5 text-[11px] text-[#CBD5E1] hover:text-white transition-colors cursor-pointer font-medium"
            >
              <Copyright className="h-3 w-3 text-[#E5C178]" /> DMCA Policy
            </button>
            <button
              onClick={() => handleLegalClick('casl')}
              className="flex items-center gap-1.5 text-[11px] text-[#CBD5E1] hover:text-white transition-colors cursor-pointer font-medium"
            >
              <Smartphone className="h-3 w-3 text-[#10B981]" /> CASL / SMS
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Legal Modal if opened locally */}
      {localModalTab && (
        <LegalModal
          isOpen={Boolean(localModalTab)}
          initialTab={localModalTab}
          onClose={() => setLocalModalTab(null)}
          teamName={teamName}
        />
      )}
    </footer>
  );
}

