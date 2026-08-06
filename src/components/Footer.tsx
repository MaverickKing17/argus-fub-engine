import React from 'react';
import { Building2, ShieldCheck, Zap, Lock, ExternalLink, CheckCircle2, Globe } from 'lucide-react';

interface FooterProps {
  teamName: string;
}

export function Footer({ teamName }: FooterProps) {
  return (
    <footer className="mt-16 border-t border-[#283042] bg-[#07090E] text-[#94A3B8] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Strategic Scope */}
          <div className="space-y-4">
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

            <p className="text-xs leading-relaxed text-[#CBD5E1] font-medium">
              Autonomous speed-to-lead ISA engine tailored specifically for high-ticket Toronto & GTA luxury real estate brokerages. Fully integrated with Follow Up Boss & TRESA v2 RECO compliance standards.
            </p>

            <div className="flex items-center space-x-2 text-[11px] text-[#E5C178] font-mono">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
              <span>Active Tenant: <strong className="text-white font-bold">{teamName}</strong></span>
            </div>
          </div>

          {/* Col 2: Toronto Luxury Enclaves */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center space-x-1.5">
              <Building2 className="h-3.5 w-3.5 text-[#E5C178]" />
              <span>GTA Luxury Enclaves</span>
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li className="flex items-center justify-between text-[#CBD5E1] hover:text-white transition-colors cursor-default">
                <span>Yorkville & Cumberland</span>
                <span className="text-[10px] font-mono font-bold text-[#E5C178]">$2.5M - $15M+</span>
              </li>
              <li className="flex items-center justify-between text-[#CBD5E1] hover:text-white transition-colors cursor-default">
                <span>The Bridle Path & Post Rd</span>
                <span className="text-[10px] font-mono font-bold text-[#E5C178]">$5.0M - $30M+</span>
              </li>
              <li className="flex items-center justify-between text-[#CBD5E1] hover:text-white transition-colors cursor-default">
                <span>Rosedale & Moore Park</span>
                <span className="text-[10px] font-mono font-bold text-[#E5C178]">$3.0M - $12M+</span>
              </li>
              <li className="flex items-center justify-between text-[#CBD5E1] hover:text-white transition-colors cursor-default">
                <span>Forest Hill & Park Lane</span>
                <span className="text-[10px] font-mono font-bold text-[#E5C178]">$3.5M - $18M+</span>
              </li>
              <li className="flex items-center justify-between text-[#CBD5E1] hover:text-white transition-colors cursor-default">
                <span>Lawrence Park & The Annex</span>
                <span className="text-[10px] font-mono font-bold text-[#E5C178]">$2.2M - $8M+</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Regulatory Compliance (TRESA v2 & RECO) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center space-x-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
              <span>Ontario Compliance Engine</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#111522] border border-[#283042] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-[11px]">TRESA v2 Standard</span>
                  <span className="text-[10px] text-[#10B981] font-mono font-bold">ENFORCED</span>
                </div>
                <p className="text-[11px] text-[#CBD5E1] leading-normal font-normal">
                  Mandatory Information Before Representation (IBR) disclosures executed automatically via SMS before intent capture.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#111522] border border-[#283042] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-[11px]">RECO BRA Audit Trail</span>
                  <span className="text-[10px] text-[#10B981] font-mono font-bold">ACTIVE</span>
                </div>
                <p className="text-[11px] text-[#CBD5E1] leading-normal font-normal">
                  Immediate halt on leads represented under active Buyer Representation Agreements with competing GTA brokerages.
                </p>
              </div>
            </div>
          </div>

          {/* Col 4: Platform Infrastructure & System Status */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center space-x-1.5">
              <Zap className="h-3.5 w-3.5 text-[#E5C178]" />
              <span>Enterprise Infrastructure</span>
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
          <div className="flex items-center space-x-2">
            <span>© {new Date().getFullYear()} ARGUS AI Technologies Inc. All rights reserved.</span>
            <span>•</span>
            <span className="text-[#E5C178] font-semibold">Toronto Luxury Real Estate Suite</span>
          </div>

          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-[11px] text-[#CBD5E1] hover:text-white transition-colors cursor-pointer font-medium">
              <Lock className="h-3 w-3 text-[#10B981]" /> Enterprise Vault Sec
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-[#CBD5E1] hover:text-white transition-colors cursor-pointer font-medium">
              <Globe className="h-3 w-3 text-[#E5C178]" /> RECO & TRESA Policy
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-[#CBD5E1] hover:text-white transition-colors cursor-pointer font-medium">
              <ExternalLink className="h-3 w-3 text-[#E5C178]" /> FUB Integration Docs
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
