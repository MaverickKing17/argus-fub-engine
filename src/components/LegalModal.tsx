import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock, AlertTriangle, Copyright, Smartphone, CheckCircle, Scale } from 'lucide-react';

export type LegalTab = 'terms' | 'privacy' | 'disclaimer' | 'dmca' | 'casl';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: LegalTab;
  onClose: () => void;
  teamName: string;
}

export function LegalModal({ isOpen, initialTab = 'terms', onClose, teamName }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  if (!isOpen) return null;

  const tabs = [
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'privacy', label: 'Privacy Policy (PIPEDA)', icon: Lock },
    { id: 'disclaimer', label: 'RECO & AI Disclaimer', icon: ShieldCheck },
    { id: 'dmca', label: 'DMCA & IP Policy', icon: Copyright },
    { id: 'casl', label: 'CASL & SMS Compliance', icon: Smartphone },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#0F131D] border border-[#283042] rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#283042] bg-[#07090E] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#151A24] border border-[#E5C178]/30">
              <Scale className="h-5 w-5 text-[#E5C178]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#F8FAFC] tracking-tight">
                ARGUS AI Legal & Regulatory Governance Center
              </h2>
              <p className="text-xs text-[#CBD5E1] font-medium mt-0.5">
                Enterprise Standards for {teamName} • Ontario TRESA v2, RECO & Canadian Compliance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#CBD5E1] hover:text-white hover:bg-[#1C2333] transition-colors cursor-pointer"
            aria-label="Close legal modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex items-center border-b border-[#283042] bg-[#0B0E17] px-4 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as LegalTab)}
                className={`flex items-center space-x-2 py-3 px-3.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-[#E5C178] text-[#E5C178] bg-[#E5C178]/5'
                    : 'border-transparent text-[#CBD5E1] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#E5C178]' : 'text-[#CBD5E1]'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Document Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#E2E8F0] leading-relaxed font-sans bg-[#0F131D]">
          {/* TAB 1: TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="space-y-5">
              <div className="p-4 bg-[#151A24] rounded-xl border border-[#283042] flex items-start space-x-3">
                <FileText className="h-5 w-5 text-[#E5C178] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Software-as-a-Service Terms of Service</h3>
                  <p className="text-[11px] text-[#CBD5E1] mt-0.5">Effective Date: August 6, 2026 • Applies to all registered real estate brokerages, agents, and team administrators.</p>
                </div>
              </div>

              <div className="space-y-4">
                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-[#F8FAFC]">1. Acceptance & Licensing Scope</h4>
                  <p className="text-[#CBD5E1]">
                    By accessing or utilizing the ARGUS AI Autonomous Lead Engine ("Platform"), operated by ARGUS AI Technologies Inc., you ("Licensee" or "Brokerage") agree to be bound by these Terms. ARGUS AI grants a non-exclusive, non-transferable, revocable license to use our autonomous Inside Sales Agent (ISA) algorithms strictly for qualifying real estate inquiries in connection with your Follow Up Boss (FUB) CRM instance.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-[#F8FAFC]">2. Automated Messaging & ISA Operations</h4>
                  <p className="text-[#CBD5E1]">
                    ARGUS AI provides automated 30-second Speed-to-Lead SMS outreach. The Licensee remains solely responsible for setting appropriate lead routing rules, human agent handoffs, and monitoring active conversation logs. ARGUS AI does not act as a licensed real estate salesperson or broker; it functions purely as an automated communication & data processing technology layer.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-[#F8FAFC]">3. Subscription, API Limits & Billing</h4>
                  <p className="text-[#CBD5E1]">
                    Service fees are billed monthly or annually per brokerage tenant. Twilio SMS carrier charges, Follow Up Boss API webhooks, and AI token usages are included or billed according to your tier. ARGUS AI reserves the right to rate-limit or suspend access in the event of unauthorized API scraping or non-payment.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-[#F8FAFC]">4. Limitation of Liability & Indemnification</h4>
                  <p className="text-[#CBD5E1]">
                    To the maximum extent permitted under Canadian law, ARGUS AI Technologies Inc. shall not be liable for lost real estate commissions, failed transaction closings, or consumer disputes arising from human agent failure to follow up on qualified AI leads. Licensee agrees to indemnify ARGUS AI against third-party claims resulting from Licensee's breach of TRESA or RECO rules.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* TAB 2: PRIVACY POLICY (PIPEDA) */}
          {activeTab === 'privacy' && (
            <div className="space-y-5">
              <div className="p-4 bg-[#151A24] rounded-xl border border-[#283042] flex items-start space-x-3">
                <Lock className="h-5 w-5 text-[#10B981] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Canadian Privacy & Data Protection Policy (PIPEDA Compliant)</h3>
                  <p className="text-[11px] text-[#CBD5E1] mt-0.5">Compliant with the Personal Information Protection and Electronic Documents Act (PIPEDA) & Ontario Freedom of Information standards.</p>
                </div>
              </div>

              <div className="space-y-4">
                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-[#F8FAFC]">1. Collection of Prospect Personal Data</h4>
                  <p className="text-[#CBD5E1]">
                    We collect prospect phone numbers, full names, property budget parameters, search criteria, and SMS interaction histories submitted via webforms or Follow Up Boss CRM webhooks. Data is strictly processed to qualify buyer and seller leads on behalf of {teamName}.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-[#F8FAFC]">2. Data Encryption & Storage Standards</h4>
                  <p className="text-[#CBD5E1]">
                    All lead payloads are encrypted in transit using TLS 1.3 and at rest using AES-256 bit encryption within our secure Canadian Cloud infrastructure. SMS messages routed through Twilio and Follow Up Boss are masked according to strict privacy guidelines. We never sell, rent, or trade prospect data to third-party ad networks or external brokerages.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-[#F8FAFC]">3. Data Retention & Access Rights</h4>
                  <p className="text-[#CBD5E1]">
                    Prospects may request access to, correction of, or deletion of their personal information at any time by contacting our Privacy Officer at <span className="text-[#E5C178] font-mono">privacy@argusai.com</span>. Tenant data is retained for the duration of the active subscription plus 90 days for audit trail verification required under RECO guidelines.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* TAB 3: RECO & AI DISCLAIMER */}
          {activeTab === 'disclaimer' && (
            <div className="space-y-5">
              <div className="p-4 bg-[#151A24] rounded-xl border border-[#283042] flex items-start space-x-3">
                <ShieldCheck className="h-5 w-5 text-[#E5C178] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Ontario RECO & TRESA v2 Regulatory Disclaimer</h3>
                  <p className="text-[11px] text-[#CBD5E1] mt-0.5">Mandatory disclosure under the Trust in Real Estate Services Act (TRESA v2) and Real Estate Council of Ontario (RECO).</p>
                </div>
              </div>

              <div className="space-y-4">
                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-[#F8FAFC]">1. Non-Licensed AI Assistant Notice</h4>
                  <p className="text-[#CBD5E1]">
                    ARGUS AI is an automated artificial intelligence communications software tool. ARGUS AI IS NOT A RECO-REGISTERED REAL ESTATE BROKERAGE OR SALESPERSON AND DOES NOT PROVIDE TRADING IN REAL ESTATE SERVICES. All binding representation agreements, property valuations, and purchase negotiations must be conducted directly by a licensed real estate professional associated with {teamName}.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-[#F8FAFC]">2. TRESA v2 Representation Safeguards</h4>
                  <p className="text-[#CBD5E1]">
                    Under Ontario TRESA v2 rules, the ARGUS AI ISA is programmed to automatically issue the required Information Before Representation (IBR) notice and inquire whether an inbound prospect is currently party to an active Buyer Representation Agreement (BRA) with another brokerage. If a prospect discloses active representation, the AI immediately halts qualification outreach to prevent intentional interference with contractual relations.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-[#F8FAFC]">3. Valuation & AI Accuracy Disclaimer</h4>
                  <p className="text-[#CBD5E1]">
                    Estimates or price ranges referenced during automated conversational intake are preliminary intake markers based on prospect input and do not constitute formal comparative market analyses (CMA) or appraisal opinions. Licensed agents must verify all property parameters before executing agreements.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* TAB 4: DMCA & IP POLICY */}
          {activeTab === 'dmca' && (
            <div className="space-y-5">
              <div className="p-4 bg-[#151A24] rounded-xl border border-[#283042] flex items-start space-x-3">
                <Copyright className="h-5 w-5 text-[#E5C178] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">DMCA, Canadian Copyright Act & Intellectual Property Notice</h3>
                  <p className="text-[11px] text-[#CBD5E1] mt-0.5">Protection of proprietary machine learning prompts, interface graphics, and brand trademarks.</p>
                </div>
              </div>

              <div className="space-y-4">
                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-[#F8FAFC]">1. Proprietary Software & ISA Prompts</h4>
                  <p className="text-[#CBD5E1]">
                    All software architecture, custom Gemini ISA system prompts, UI components, styling frameworks, trade dress, logos (including ARGUS AI brand marks), and documentation are the exclusive intellectual property of ARGUS AI Technologies Inc. Reverse engineering, decompiling, or re-selling prompt chains is strictly prohibited under Canadian and international copyright law.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-[#F8FAFC]">2. Digital Millennium Copyright Act (DMCA) Takedowns</h4>
                  <p className="text-[#CBD5E1]">
                    If you believe that any content hosted on or processed through our Platform infringes your copyright, please send a written Notice of Infringement to our designated Copyright Agent:
                  </p>
                  <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#283042] font-mono text-[11px] space-y-1 text-[#CBD5E1]">
                    <div>ARGUS AI Copyright Agent</div>
                    <div>Attn: Legal & Compliance Dept.</div>
                    <div>100 King Street West, Suite 5600, Toronto, ON M5X 1C9</div>
                    <div>Email: <span className="text-[#E5C178]">copyright@argusai.com</span></div>
                  </div>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-[#F8FAFC]">3. Counter-Notification Procedure</h4>
                  <p className="text-[#CBD5E1]">
                    If a copyright notice is received regarding content submitted by a tenant, the affected tenant will have 10 business days to file a statutory counter-notice detailing lawful permission or fair dealing defense under Canadian copyright law.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* TAB 5: CASL & SMS OPT-IN / TCPA */}
          {activeTab === 'casl' && (
            <div className="space-y-5">
              <div className="p-4 bg-[#151A24] rounded-xl border border-[#283042] flex items-start space-x-3">
                <Smartphone className="h-5 w-5 text-[#10B981] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Canada’s Anti-Spam Legislation (CASL) & Telemarketing Compliance</h3>
                  <p className="text-[11px] text-[#CBD5E1] mt-0.5">Strict enforcement of commercial electronic messages (CEM) regulations and automated opt-out protocols.</p>
                </div>
              </div>

              <div className="space-y-4">
                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-[#F8FAFC]">1. Express & Implied Consent Requirements</h4>
                  <p className="text-[#CBD5E1]">
                    ARGUS AI only initiates automated SMS messaging to leads that have submitted an inbound inquiry (implied consent under CASL for 2 years) or explicitly checked an SMS consent box (express consent). All outbound messages identify the brokerage tenant ({teamName}) and include contact information.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-[#F8FAFC]">2. Immediate Automated Opt-Out ('STOP' Processing)</h4>
                  <p className="text-[#CBD5E1]">
                    In compliance with CASL and CRTC regulations, if a recipient replies with "STOP", "UNSUBSCRIBE", or "QUIT", our Twilio gateway immediately revokes messaging permissions, flags the contact record in Follow Up Boss CRM, and ceases all future outreach. No further automated SMS will be transmitted.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-[#F8FAFC]">3. Messaging Curfew & Frequency Controls</h4>
                  <p className="text-[#CBD5E1]">
                    Outbound automated SMS messages are restricted to standard local operating hours (8:00 AM to 9:00 PM EST) to comply with Canadian telemarketing curfews. Messaging frequency is dynamically throttled to maximum 3-turn qualification sequences before requiring human agent intervention.
                  </p>
                </section>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#283042] bg-[#07090E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-[#CBD5E1]">
            <CheckCircle className="h-4 w-4 text-[#10B981]" />
            <span>Document Status: <strong className="text-white font-bold">Verified Current for {new Date().getFullYear()}</strong></span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto btn-executive-primary px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
