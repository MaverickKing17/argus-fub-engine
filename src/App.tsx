/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Tenant, Lead, DashboardKPIs, IntegrationHealth, NotificationItem } from './types.js';
import { dbStore } from './db/dbStore.js';
import { Navbar } from './components/Navbar.js';
import { DashboardOverview } from './components/DashboardOverview.js';
import { ConversationFeed } from './components/ConversationFeed.js';
import { LeadsPipeline } from './components/LeadsPipeline.js';
import { SettingsPanel } from './components/SettingsPanel.js';
import { Footer } from './components/Footer.js';

export default function App() {
  const [tenants, setTenants] = useState<Tenant[]>(() => dbStore.getTenants());
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(() => dbStore.getTenants()[0] || null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [leads, setLeads] = useState<Lead[]>(() => dbStore.getLeads(dbStore.getTenants()[0]?.id));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => dbStore.getNotifications(dbStore.getTenants()[0]?.id));
  const [selectedLeadId, setSelectedLeadId] = useState<string | undefined>(() => dbStore.getLeads(dbStore.getTenants()[0]?.id)?.[0]?.id);
  const [kpis, setKpis] = useState<DashboardKPIs>(() => dbStore.getKPIs(dbStore.getTenants()[0]?.id));
  const [health, setHealth] = useState<IntegrationHealth>(() => dbStore.getIntegrationHealth());
  const [showDemoBanner, setShowDemoBanner] = useState(true);
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false);

  const handleResetDemoState = () => {
    // Reset dbStore and re-fetch data
    window.location.reload();
  };

  const handleResolveEscalation = async (leadId: string, newStage: any, representationStatus: any, note?: string) => {
    try {
      const res = await fetch(`/api/v1/leads/${leadId}/resolve-escalation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStage, representationStatus, note })
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error resolving lead escalation:', err);
    }
  };

  // Fetch initial SaaS data
  const fetchData = async () => {
    try {
      // Tenants
      const tenantsRes = await fetch('/api/v1/tenants');
      if (tenantsRes.ok) {
        const data = await tenantsRes.json();
        setTenants(data.tenants || []);
        if (data.tenants?.length > 0 && !currentTenant) {
          setCurrentTenant(data.tenants[0]);
        }
      }

      const tenantId = currentTenant?.id;

      // Leads
      const leadsRes = await fetch(`/api/v1/leads${tenantId ? `?tenantId=${tenantId}` : ''}`);
      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setLeads(data.leads || []);
        if (data.leads?.length > 0 && !selectedLeadId) {
          setSelectedLeadId(data.leads[0].id);
        }
      }

      // KPIs
      const kpisRes = await fetch(`/api/v1/dashboard/kpis${tenantId ? `?tenantId=${tenantId}` : ''}`);
      if (kpisRes.ok) {
        const data = await kpisRes.json();
        if (data.kpis) setKpis(data.kpis);
      }

      // Health
      const healthRes = await fetch('/api/v1/health/integrations');
      if (healthRes.ok) {
        const data = await healthRes.json();
        if (data.health) setHealth(data.health);
      }

      // Notifications
      const notifsRes = await fetch(`/api/v1/notifications${tenantId ? `?tenantId=${tenantId}` : ''}`);
      if (notifsRes.ok) {
        const data = await notifsRes.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentTenant?.id]);

  const handleSelectTenant = (tenant: Tenant) => {
    setCurrentTenant(tenant);
  };

  const handleNavigateTab = (tab: string, leadId?: string) => {
    setActiveTab(tab);
    if (leadId) {
      setSelectedLeadId(leadId);
    }
  };

  // Interactive SMS sending / simulation trigger
  const handleSendMessage = async (leadId: string, messageText: string) => {
    setIsLoadingMessage(true);
    try {
      const res = await fetch(`/api/v1/leads/${leadId}/simulate-inbound`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: messageText })
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsLoadingMessage(false);
    }
  };

  // Simulate incoming FUB personCreated webhook
  const handleSimulateWebhook = async () => {
    setIsSimulatingWebhook(true);
    try {
      const res = await fetch('/api/v1/simulate-fub-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId: currentTenant?.id || 'tenant_yorkville_01' })
      });
      if (res.ok) {
        const data = await res.json();
        await fetchData();
        if (data.result?.leadId) {
          setSelectedLeadId(data.result.leadId);
        }
      }
    } catch (err) {
      console.error('Error simulating FUB webhook:', err);
    } finally {
      setIsSimulatingWebhook(false);
    }
  };

  // Update tenant settings
  const handleUpdateTenant = async (updatedTenant: Tenant) => {
    const res = await fetch(`/api/v1/tenants/${updatedTenant.id}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTenant)
    });
    if (res.ok) {
      const data = await res.json();
      setCurrentTenant(data.tenant);
      setTenants((prev) => prev.map((t) => (t.id === data.tenant.id ? data.tenant : t)));
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    try {
      await fetch(`/api/v1/notifications/${id}/read`, { method: 'PUT' });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      const tenantId = currentTenant?.id;
      await fetch(`/api/v1/notifications/read-all${tenantId ? `?tenantId=${tenantId}` : ''}`, { method: 'PUT' });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  if (!currentTenant) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F7] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 rounded-full border-2 border-[#C5A059] border-t-transparent animate-spin mx-auto"></div>
          <p className="text-xs font-mono text-[#A1A1AA]">Loading ARGUS AI Sales Closer Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F7] font-sans selection:bg-[#C5A059] selection:text-black">
      {/* Persistent Dismissible Demo Environment Banner */}
      {showDemoBanner && (
        <div className="bg-[#1C180E] border-b border-[#E5C178]/30 px-4 py-2 text-xs font-sans text-[#CBD5E1] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="bg-[#E5C178]/20 text-[#E5C178] border border-[#E5C178]/40 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider">
              DEMO ENVIRONMENT
            </span>
            <span className="font-medium">
              Connected to Follow Up Boss Sandbox (<strong className="text-white font-semibold">{currentTenant.team_name}</strong>). All messages and leads are simulated for evaluation.
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleResetDemoState}
              className="text-[#E5C178] hover:text-white text-[11px] font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              Reset Demo State
            </button>
            <button
              onClick={() => setShowDemoBanner(false)}
              className="text-[#CBD5E1] hover:text-white text-xs p-0.5 rounded cursor-pointer"
              aria-label="Dismiss banner"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        tenants={tenants}
        currentTenant={currentTenant}
        onSelectTenant={handleSelectTenant}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSimulateWebhook={handleSimulateWebhook}
        isSimulating={isSimulatingWebhook}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
      />

      {/* Persistent Thin Compliance-Status Audit Strip */}
      <div className="bg-[#141414] border-b border-[#262626] py-1.5 px-4 sm:px-6 lg:px-8 text-[11px] font-sans flex flex-wrap items-center justify-between gap-2 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#C5A059]/80 via-[#C5A059]/30 to-transparent"></div>
        <div className="flex items-center space-x-2 text-[#94A3B8]">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span className="font-semibold text-[#F8FAFC] tracking-wider uppercase text-[10px] font-mono">
            TRESA & RECO AUDIT STREAM:
          </span>
          <span className="text-[#94A3B8] hidden sm:inline">•</span>
          <span className="text-emerald-400 font-medium hidden sm:inline">TRESA DISCLOSURE CHECK COMPLETE</span>
          <span className="text-[#94A3B8] hidden md:inline">•</span>
          <span className="text-[#94A3B8] hidden md:inline">0 Unrepresented Disqualifications Flagged</span>
        </div>
        <div className="flex items-center space-x-3 text-[10px] text-[#C5A059] font-mono">
          <span className="bg-[#C5A059]/10 border border-[#C5A059]/30 px-2 py-0.5 rounded text-[10px]">
            Follow Up Boss Sync: ACTIVE
          </span>
          <span className="hidden lg:inline text-[#94A3B8]">
            Tenant: <strong className="text-[#F8FAFC]">{currentTenant.team_name}</strong>
          </span>
        </div>
      </div>

      {/* Main App Content Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <DashboardOverview
            kpis={kpis}
            health={health}
            leads={leads}
            tenant={currentTenant}
            onNavigateTab={handleNavigateTab}
            onSimulateWebhook={handleSimulateWebhook}
            onResolveEscalation={handleResolveEscalation}
          />
        )}

        {activeTab === 'conversations' && (
          <ConversationFeed
            leads={leads}
            tenant={currentTenant}
            selectedLeadId={selectedLeadId}
            onSelectLead={(id) => setSelectedLeadId(id)}
            onSendMessage={handleSendMessage}
            isLoadingMessage={isLoadingMessage}
          />
        )}

        {activeTab === 'leads' && (
          <LeadsPipeline
            leads={leads}
            tenant={currentTenant}
            onSelectLead={(id) => setSelectedLeadId(id)}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPanel tenant={currentTenant} onUpdateTenant={handleUpdateTenant} />
        )}
      </main>

      <Footer teamName={currentTenant.team_name} />
    </div>
  );
}
