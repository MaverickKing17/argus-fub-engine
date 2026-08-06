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
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-950/50 border border-cyan-400/30">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  ARGUS <span className="text-cyan-400 font-extrabold">AI</span> Sales Closer
                </span>
                <span className="bg-cyan-950 text-cyan-400 text-xs px-2 py-0.5 rounded-full font-mono border border-cyan-800/60 flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>FUB + Twilio</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">GTA Real Estate Speed-to-Lead ISA Engine</p>
            </div>
          </div>

          {/* Tenant Switcher & Actions */}
          <div className="flex items-center space-x-3">
            {/* Tenant Selector */}
            <div className="relative flex items-center bg-slate-800/90 rounded-lg p-1 border border-slate-700">
              <Building2 className="h-4 w-4 text-slate-400 ml-2 mr-1.5" />
              <select
                id="tenant-switcher-select"
                value={currentTenant?.id}
                onChange={(e) => {
                  const selected = tenants.find((t) => t.id === e.target.value);
                  if (selected) onSelectTenant(selected);
                }}
                className="bg-transparent text-xs sm:text-sm text-slate-200 font-medium focus:outline-none pr-3 cursor-pointer"
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-slate-100">
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
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-all disabled:opacity-50"
              title="Simulate inbound FUB lead creation & instant 30s SMS outreach"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Test Inbound Lead</span>
              <span className="md:hidden">Test Lead</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex space-x-1 sm:space-x-4 border-t border-slate-800/80 overflow-x-auto py-1 scrollbar-none">
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
                className={`flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 border border-slate-700/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
