import React from 'react';
import { Tenant } from '../types.js';
import { ShieldCheck, Bot, Sparkles, Database, Code, RefreshCw, Zap, Building2, ExternalLink } from 'lucide-react';

interface NavbarProps {
  tenants: Tenant[];
  currentTenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSimulateWebhook: () => void;
  isSimulating: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  tenants,
  currentTenant,
  onSelectTenant,
  activeTab,
  setActiveTab,
  onSimulateWebhook,
  isSimulating
}) => {
  return (
    <header className="bg-zinc-950 border-b border-zinc-800 text-zinc-50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-sm shrink-0">
              A
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold tracking-tight text-lg text-zinc-100">
                  ARGUS <span className="text-blue-500 font-extrabold">AI</span>
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 rounded uppercase tracking-wider flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>LIVE</span>
                </span>
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20 rounded uppercase tracking-wider hidden sm:inline-block">
                  GEMINI-3.6-FLASH
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                High Density GTA Real Estate Speed-to-Lead Engine
              </p>
            </div>
          </div>

          {/* Tenant Switcher & Actions */}
          <div className="flex items-center space-x-3">
            {/* Tenant Selector */}
            <div className="relative flex items-center bg-zinc-900 rounded-md p-1 border border-zinc-800">
              <Building2 className="h-4 w-4 text-zinc-400 ml-2 mr-1.5" />
              <select
                id="tenant-switcher-select"
                value={currentTenant?.id}
                onChange={(e) => {
                  const selected = tenants.find((t) => t.id === e.target.value);
                  if (selected) onSelectTenant(selected);
                }}
                className="bg-transparent text-xs text-zinc-200 font-medium focus:outline-none pr-3 cursor-pointer"
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.id} className="bg-zinc-900 text-zinc-100">
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs font-bold transition-colors shadow-sm flex items-center space-x-1.5 disabled:opacity-50"
              title="Simulate inbound FUB lead creation & instant 30s SMS outreach"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Test Inbound Lead</span>
              <span className="md:hidden">Test Lead</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex space-x-1 sm:space-x-2 border-t border-zinc-800/80 overflow-x-auto py-1.5 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview KPIs', icon: Zap },
            { id: 'conversations', label: 'Live SMS Threads', icon: Bot },
            { id: 'leads', label: 'Leads Pipeline', icon: ShieldCheck },
            { id: 'integrations', label: 'Webhooks & Health', icon: ExternalLink },
            { id: 'settings', label: 'ISA Settings', icon: Code },
            { id: 'schema', label: 'SQL Migrations', icon: Database }
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
                    ? 'bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-blue-400' : 'text-zinc-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
