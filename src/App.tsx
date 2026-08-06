/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Tenant, Lead, DashboardKPIs, IntegrationHealth } from './types.js';
import { Navbar } from './components/Navbar.js';
import { DashboardOverview } from './components/DashboardOverview.js';
import { ConversationFeed } from './components/ConversationFeed.js';
import { LeadsPipeline } from './components/LeadsPipeline.js';
import { IntegrationsPanel } from './components/IntegrationsPanel.js';
import { SettingsPanel } from './components/SettingsPanel.js';
import { SchemaViewer } from './components/SchemaViewer.js';

export default function App() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | undefined>();
  const [kpis, setKpis] = useState<DashboardKPIs>({
    totalLeads: 0,
    activeSMSThreads: 0,
    qualifiedAppointments: 0,
    disqualifiedLeads: 0,
    conversionRate: 0,
    avgSpeedToLeadSeconds: 18
  });
  const [health, setHealth] = useState<IntegrationHealth>({
    fub: { status: 'healthy', latencyMs: 142, lastSync: new Date().toISOString() },
    twilio: { status: 'healthy', latencyMs: 98, lastMessageAt: new Date().toISOString() },
    gemini: { status: 'healthy', latencyMs: 380, model: 'gemini-3.6-flash' }
  });
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false);

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

  if (!currentTenant) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto"></div>
          <p className="text-xs font-mono text-slate-400">Loading ARGUS AI Sales Closer Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        tenants={tenants}
        currentTenant={currentTenant}
        onSelectTenant={handleSelectTenant}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSimulateWebhook={handleSimulateWebhook}
        isSimulating={isSimulatingWebhook}
      />

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

        {activeTab === 'integrations' && (
          <IntegrationsPanel
            health={health}
            tenant={currentTenant}
            onRefreshHealth={fetchData}
            onSimulateWebhook={handleSimulateWebhook}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPanel tenant={currentTenant} onUpdateTenant={handleUpdateTenant} />
        )}

        {activeTab === 'schema' && <SchemaViewer />}
      </main>
    </div>
  );
}
