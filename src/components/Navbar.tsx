import React from 'react';
import { Tenant, NotificationItem } from '../types.js';
import { ShieldCheck, Bot, Sparkles, Database, Code, RefreshCw, Zap, Building2, ExternalLink } from 'lucide-react';
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
    <header className="bg-[#0A0A0A] border-b border-[#262626] text-[#F5F5F7] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#C5A059] rounded-lg flex items-center justify-center font-bold text-lg text-black shadow-sm shrink-0">
              A
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold tracking-tight text-lg text-[#F5F5F7]">
                  ARGUS <span className="text-[#C5A059] font-extrabold">AI</span>
                </span>
                <span className="px-2 py-0.5 bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold border border-[#10B981]/20 rounded uppercase tracking-wider flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                  <span>LIVE</span>
                </span>
                <span className="px-2 py-0.5 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold border border-[#C5A059]/30 rounded uppercase tracking-wider hidden sm:inline-block font-mono">
                  GEMINI-3.6-FLASH
                </span>
              </div>
              <p className="text-[11px] text-[#A1A1AA] hidden sm:block">
                High Density GTA Real Estate Speed-to-Lead Engine
              </p>
            </div>
          </div>

          {/* Tenant Switcher, Notifications & Actions */}
          <div className="flex items-center space-x-3">
            {/* Real-time Notification Bell */}
            <NotificationBell
              notifications={notifications}
              onMarkRead={onMarkNotificationRead}
              onMarkAllRead={onMarkAllNotificationsRead}
            />

            {/* Tenant Selector */}
            <div className="relative flex items-center bg-[#141414] rounded-md p-1 border border-[#262626]">
              <Building2 className="h-4 w-4 text-[#A1A1AA] ml-2 mr-1.5" />
              <select
                id="tenant-switcher-select"
                value={currentTenant?.id}
                onChange={(e) => {
                  const selected = tenants.find((t) => t.id === e.target.value);
                  if (selected) onSelectTenant(selected);
                }}
                className="bg-transparent text-xs text-[#F5F5F7] font-medium focus:outline-none pr-3 cursor-pointer"
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#141414] text-[#F5F5F7]">
                    {t.team_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Trigger Test Webhook Button */}
            <button
              id="simulate-inbound-lead-btn"
              onClick={onSimulateWebhook}
              disabled={isSimulating}
              className="bg-[#C5A059] hover:bg-[#B38E46] text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs font-bold transition-colors shadow-sm flex items-center space-x-1.5 disabled:opacity-50"
              title="Simulate inbound FUB lead creation & instant 30s SMS outreach"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Test Inbound Lead</span>
              <span className="md:hidden">Test Lead</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex space-x-1 sm:space-x-2 border-t border-[#262626] overflow-x-auto py-1.5 scrollbar-none">
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
                className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#141414] text-[#F5F5F7] border border-[#C5A059]/40 shadow-sm'
                    : 'text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-[#141414]/60'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#C5A059]' : 'text-[#A1A1AA]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

