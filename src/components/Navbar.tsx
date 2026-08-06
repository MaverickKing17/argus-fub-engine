import React, { useState } from 'react';
import { Tenant, NotificationItem } from '../types.js';
import { ShieldCheck, Bot, Sparkles, Zap, Building2, Plus, CheckCircle2, BookOpen, X, ExternalLink, HelpCircle, FileText } from 'lucide-react';
import { NotificationBell } from './NotificationBell.js';

interface NavbarProps {
  tenants: Tenant[];
  currentTenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSimulateWebhook: () => void;
  isSimulating: boolean;
  notifications?: NotificationItem[];
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllNotificationsRead?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  tenants,
  currentTenant,
  onSelectTenant,
  activeTab,
  setActiveTab,
  onSimulateWebhook,
  isSimulating,
  notifications = [],
  onMarkNotificationRead = () => {},
  onMarkAllNotificationsRead = () => {}
}) => {
  const [showDocsModal, setShowDocsModal] = useState(false);

  return (
    <>
      <header className="bg-[#0A0A0A] border-b border-[#262626] text-[#F8FAFC] sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-3 md:py-0 md:h-20 gap-3 md:gap-4">
            {/* Brand Logo & Executive Suite Name */}
            <div className="flex items-center space-x-3.5 shrink-0">
              <div className="w-9 h-9 rounded-lg border border-[#C5A059]/40 bg-[#141414] shadow-md flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src="https://i.imgur.com/1Ww7pS4.png"
                  alt="ARGUS AI Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold tracking-wider text-lg sm:text-xl text-[#F8FAFC]">
                    ARGUS <span className="text-[#C5A059] font-extrabold">AI</span>
                  </span>

                  {/* Live Status Badge */}
                  <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center space-x-1 tracking-wider uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>LIVE</span>
                  </span>

                  {/* Executive Compliance Badge (Replaces Technical LLM Badge) */}
                  <span className="bg-amber-950/40 text-[#C5A059] border border-[#C5A059]/30 text-[10px] px-2.5 py-0.5 rounded-full font-medium font-mono hidden sm:inline-flex items-center space-x-1 uppercase tracking-wider">
                    <CheckCircle2 className="h-3 w-3 text-[#C5A059]" />
                    <span>TRESA V2 COMPLIANT</span>
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] tracking-wide hidden sm:block mt-0.5 font-sans">
                  Autonomous Luxury Lead Engine | GTA Brokerage Suite
                </p>
              </div>
            </div>

            {/* Top-Right Controls & Tenant Selector */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
              {/* Real-time High-Priority Alert Bell */}
              <NotificationBell
                notifications={notifications}
                onMarkRead={onMarkNotificationRead}
                onMarkAllRead={onMarkAllNotificationsRead}
              />

              {/* Brokerage Tenant Selector Box */}
              <div className="relative flex items-center bg-[#141414] rounded-lg px-2.5 sm:px-3 py-1.5 border border-[#262626] hover:border-[#C5A059]/50 transition-all shadow-sm max-w-[200px] sm:max-w-none">
                <div className="relative flex items-center shrink-0 mr-2">
                  <Building2 className="h-4 w-4 text-[#C5A059]" />
                  <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-[#10B981] ring-2 ring-[#141414]" title="Follow Up Boss Account Connected"></span>
                </div>
                <select
                  id="tenant-switcher-select"
                  value={currentTenant?.id}
                  onChange={(e) => {
                    const selected = tenants.find((t) => t.id === e.target.value);
                    if (selected) onSelectTenant(selected);
                  }}
                  className="bg-transparent text-xs sm:text-sm text-[#F8FAFC] font-medium focus:outline-none pr-1 cursor-pointer truncate"
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id} className="bg-[#141414] text-[#F8FAFC]">
                      {t.team_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dedicated Docs & Support Link */}
              <button
                id="open-docs-support-btn"
                onClick={() => setShowDocsModal(true)}
                className="text-[#94A3B8] hover:text-[#C5A059] text-xs font-medium transition-colors flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#262626] bg-[#141414] hover:border-[#C5A059]/40 cursor-pointer shrink-0"
                title="ARGUS AI Brokerage Executive Guide & Support Documentation"
              >
                <BookOpen className="h-3.5 w-3.5 text-[#C5A059]" />
                <span className="hidden sm:inline">Docs & Support</span>
              </button>

              {/* Executive Metallic Champagne Gold Action Button */}
              <button
                id="simulate-inbound-lead-btn"
                onClick={onSimulateWebhook}
                disabled={isSimulating}
                className="btn-executive-primary px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all flex items-center space-x-2 text-xs sm:text-sm cursor-pointer disabled:opacity-50 shrink-0"
                title="Simulate inbound FUB lead creation & instant 30s SMS outreach"
              >
                <Plus className={`h-4 w-4 text-[#07090E] stroke-[2.5] ${isSimulating ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">+ Simulate Inbound Lead</span>
                <span className="md:hidden">+ Trigger Lead</span>
              </button>
            </div>
          </div>

          {/* Minimal Luxury Underline Navigation Tab Bar */}
          <div className="flex space-x-6 sm:space-x-8 border-t border-[#262626]/80 overflow-x-auto pt-2 scrollbar-none">
            {[
              { id: 'overview', label: 'Overview KPIs', icon: Zap },
              { id: 'conversations', label: 'Live SMS Threads', icon: Bot },
              { id: 'leads', label: 'Leads Pipeline', icon: ShieldCheck },
              { id: 'settings', label: 'Team Configuration', icon: Building2 }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative pb-3 px-1 text-xs sm:text-sm font-medium flex items-center space-x-2 transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-[#F8FAFC] font-semibold'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#C5A059]' : 'text-[#94A3B8]'}`} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A059] rounded-full shadow-[0_0_8px_rgba(197,160,89,0.6)]"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Dedicated Executive Docs & Support Modal */}
      {showDocsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#262626] pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg border border-[#C5A059]/40 bg-[#0A0A0A] shadow-md flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src="https://i.imgur.com/5Ep4YzA.png"
                    alt="ARGUS AI Logo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain p-0.5"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#F8FAFC] flex items-center space-x-2">
                    <span>ARGUS AI Executive Suite Guide</span>
                    <span className="bg-[#C5A059]/15 text-[#C5A059] text-[10px] font-mono px-2 py-0.5 rounded border border-[#C5A059]/30">v2.5</span>
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Documentation, Ontario TRESA v2 Compliance Protocol & Support Channels
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDocsModal(false)}
                className="text-[#94A3B8] hover:text-[#F8FAFC] p-1 rounded-lg hover:bg-[#262626] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body / Documentation Sections */}
            <div className="space-y-4 text-xs text-[#94A3B8] leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-3.5 bg-[#0A0A0A] rounded-xl border border-[#262626] space-y-2">
                <div className="flex items-center space-x-2 text-[#C5A059] font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" />
                  <span>1. Ontario TRESA & RECO Compliance Protocols</span>
                </div>
                <p>
                  ARGUS AI guarantees compliance under Ontario's Trust in Real Estate Services Act (TRESA v2). Prior to recommending specific luxury GTA listings or offering agency representation, the autonomous ISA explicitly verifies whether the buyer has executed a Buyer Representation Agreement (BRA) with another brokerage.
                </p>
              </div>

              <div className="p-3.5 bg-[#0A0A0A] rounded-xl border border-[#262626] space-y-2">
                <div className="flex items-center space-x-2 text-[#10B981] font-bold text-xs uppercase tracking-wider">
                  <Zap className="h-4 w-4" />
                  <span>2. Sub-30s Speed-to-Lead & Follow Up Boss (FUB) Webhooks</span>
                </div>
                <p>
                  Inbound leads received via Follow Up Boss webhooks trigger immediate automated two-way SMS qualification via Twilio. Extracted parameters (Budget, Timeline, Pre-Approval status, and Neighborhood preferences) are synchronized in real time to FUB contact notes and stages.
                </p>
              </div>

              <div className="p-3.5 bg-[#0A0A0A] rounded-xl border border-[#262626] space-y-2">
                <div className="flex items-center space-x-2 text-[#F8FAFC] font-bold text-xs uppercase tracking-wider">
                  <Building2 className="h-4 w-4 text-[#C5A059]" />
                  <span>3. Multi-Tenant Brokerage Configuration</span>
                </div>
                <p>
                  Each luxury brokerage team operates in an isolated environment with encrypted Twilio SIDs, custom RECO disclaimers, neighborhood budget thresholds, and custom notification webhooks.
                </p>
              </div>

              <div className="p-3.5 bg-[#0A0A0A] rounded-xl border border-[#262626] space-y-2">
                <div className="flex items-center space-x-2 text-[#F8FAFC] font-bold text-xs uppercase tracking-wider">
                  <HelpCircle className="h-4 w-4 text-[#C5A059]" />
                  <span>4. Concierge Technical Support & Escalations</span>
                </div>
                <p>
                  For integration support, webhook secret rotators, or custom ISA persona tuning for your GTA brokerage, contact our concierge desk at <span className="text-[#C5A059] font-mono">support@argusai.com</span> or reach your dedicated account representative.
                </p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="border-t border-[#262626] pt-4 flex items-center justify-between">
              <span className="text-[11px] text-[#94A3B8] font-mono">ARGUS AI Executive Suite • Version 2.5</span>
              <button
                onClick={() => setShowDocsModal(false)}
                className="bg-gradient-to-r from-[#C5A059] to-[#B38E46] text-zinc-950 font-bold px-4 py-2 rounded-lg text-xs hover:brightness-110 transition-all cursor-pointer"
              >
                Close Executive Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


