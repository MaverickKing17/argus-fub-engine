import React from 'react';
import { Tenant, NotificationItem } from '../types.js';
import { ShieldCheck, Bot, Sparkles, Zap, Building2, Plus, CheckCircle2 } from 'lucide-react';
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
  return (
    <header className="bg-[#0A0A0A] border-b border-[#262626] text-[#F8FAFC] sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Executive Suite Name */}
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-lg border border-[#C5A059]/40 bg-[#141414] text-[#C5A059] font-serif font-bold text-xl shadow-md flex items-center justify-center shrink-0">
              A
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
          <div className="flex items-center space-x-3">
            {/* Real-time High-Priority Alert Bell */}
            <NotificationBell
              notifications={notifications}
              onMarkRead={onMarkNotificationRead}
              onMarkAllRead={onMarkAllNotificationsRead}
            />

            {/* Brokerage Tenant Selector Box */}
            <div className="relative flex items-center bg-[#141414] rounded-lg px-3 py-1.5 border border-[#262626] hover:border-[#C5A059]/50 transition-all shadow-sm">
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
                className="bg-transparent text-xs sm:text-sm text-[#F8FAFC] font-medium focus:outline-none pr-2 cursor-pointer"
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#141414] text-[#F8FAFC]">
                    {t.team_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Executive Warm Bronze Gradient Action Button */}
            <button
              id="simulate-inbound-lead-btn"
              onClick={onSimulateWebhook}
              disabled={isSimulating}
              className="bg-gradient-to-r from-[#C5A059] to-[#B38E46] text-zinc-950 font-semibold px-4 py-2 rounded-lg hover:brightness-110 shadow-lg shadow-amber-900/20 transition-all flex items-center space-x-2 text-xs sm:text-sm cursor-pointer disabled:opacity-50 border border-[#C5A059]/30"
              title="Simulate inbound FUB lead creation & instant 30s SMS outreach"
            >
              <Plus className={`h-4 w-4 text-zinc-950 stroke-[2.5] ${isSimulating ? 'animate-spin' : ''}`} />
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
  );
};


