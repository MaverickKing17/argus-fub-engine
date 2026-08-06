import React, { useState } from 'react';
import { IntegrationHealth, Tenant } from '../types.js';
import { ShieldCheck, Zap, Server, Code, Copy, Check, ExternalLink, RefreshCw, Radio } from 'lucide-react';

interface IntegrationsPanelProps {
  health: IntegrationHealth;
  tenant: Tenant;
  onRefreshHealth: () => void;
  onSimulateWebhook: () => void;
}

export const IntegrationsPanel: React.FC<IntegrationsPanelProps> = ({
  health,
  tenant,
  onRefreshHealth,
  onSimulateWebhook
}) => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const fubWebhookUrl = `${window.location.origin}/api/v1/webhooks/fub?tenantId=${tenant.id}`;
  const twilioWebhookUrl = `${window.location.origin}/api/v1/webhooks/twilio?tenantId=${tenant.id}`;

  const handleCopy = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedEndpoint(key);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-100">Integration Health & Webhook Listeners</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time API endpoints for Follow Up Boss, Twilio SMS, and Google Gemini 3.6 Flash.
          </p>
        </div>
        <button
          id="refresh-health-btn"
          onClick={onRefreshHealth}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-4 py-2 rounded-md border border-zinc-700 transition-colors flex items-center space-x-2"
        >
          <RefreshCw className="h-3.5 w-3.5 text-blue-400" />
          <span>Ping API Connections</span>
        </button>
      </div>

      {/* Integration Status Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* FUB Card */}
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-800">
                FUB
              </div>
              <div>
                <h3 className="font-bold text-zinc-100 text-xs">Follow Up Boss API</h3>
                <p className="text-[10px] text-zinc-400">REST API v1</p>
              </div>
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-500/20 uppercase tracking-wider flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Healthy</span>
            </span>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-800 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Target Tenant:</span>
              <span className="text-zinc-200 font-semibold">{tenant.team_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">API Key Configured:</span>
              <span className="text-emerald-400 font-mono font-bold">
                {tenant.fub_api_key ? '✓ Present' : 'Default Global'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Sync Actions:</span>
              <span className="text-zinc-300">Tags, Notes, Stage</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Latency:</span>
              <span className="text-blue-400 font-mono font-bold">{health.fub.latencyMs}ms</span>
            </div>
          </div>
        </div>

        {/* Twilio Card */}
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-rose-950 text-rose-400 flex items-center justify-center font-bold text-xs border border-rose-800">
                SMS
              </div>
              <div>
                <h3 className="font-bold text-zinc-100 text-xs">Twilio SMS Gateway</h3>
                <p className="text-[10px] text-zinc-400">Inbound & Outbound SMS</p>
              </div>
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-500/20 uppercase tracking-wider flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Listening</span>
            </span>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-800 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Phone Number:</span>
              <span className="text-zinc-200 font-mono font-semibold">{tenant.twilio_phone_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Account SID:</span>
              <span className="text-zinc-300 font-mono">{tenant.twilio_sid.slice(0, 10)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Speed SLA:</span>
              <span className="text-emerald-400 font-bold">&lt; 30s Guaranteed</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Latency:</span>
              <span className="text-blue-400 font-mono font-bold">{health.twilio.latencyMs}ms</span>
            </div>
          </div>
        </div>

        {/* Gemini API Card */}
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 text-blue-400 flex items-center justify-center font-bold text-xs border border-zinc-700">
                AI
              </div>
              <div>
                <h3 className="font-bold text-zinc-100 text-xs">Gemini 3.6 Flash</h3>
                <p className="text-[10px] text-zinc-400">@google/genai SDK</p>
              </div>
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-500/20 uppercase tracking-wider flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Active</span>
            </span>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-800 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">System Instruction:</span>
              <span className="text-zinc-200 font-semibold">RECO & CASL ISA Guardrails</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Structured Schema:</span>
              <span className="text-emerald-400 font-mono font-bold">Enabled (JSON)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Model Name:</span>
              <span className="text-zinc-300 font-mono">gemini-3.6-flash</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Latency:</span>
              <span className="text-blue-400 font-mono font-bold">{health.gemini.latencyMs}ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Webhook Endpoint URLs & Instructions */}
      <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-sm space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">Configured Webhook Endpoints</h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Configure these HTTP POST webhooks inside your Follow Up Boss and Twilio Admin accounts.
          </p>
        </div>

        {/* Webhook 1: FUB */}
        <div className="bg-zinc-950/60 p-4 rounded-lg border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              1. Follow Up Boss Webhook URL (personCreated)
            </span>
            <button
              id="copy-fub-webhook-btn"
              onClick={() => handleCopy(fubWebhookUrl, 'fub')}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1 rounded-md border border-zinc-700 flex items-center space-x-1 transition-colors"
            >
              {copiedEndpoint === 'fub' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedEndpoint === 'fub' ? 'Copied!' : 'Copy Endpoint'}</span>
            </button>
          </div>
          <div className="bg-zinc-900 p-2.5 rounded border border-zinc-800 font-mono text-xs text-blue-300 break-all select-all">
            POST {fubWebhookUrl}
          </div>
          <p className="text-[11px] text-zinc-400">
            FUB payload triggers immediate speed-to-lead SMS qualification within 30 seconds.
          </p>
        </div>

        {/* Webhook 2: Twilio */}
        <div className="bg-zinc-950/60 p-4 rounded-lg border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              2. Twilio Inbound SMS Webhook URL
            </span>
            <button
              id="copy-twilio-webhook-btn"
              onClick={() => handleCopy(twilioWebhookUrl, 'twilio')}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1 rounded-md border border-zinc-700 flex items-center space-x-1 transition-colors"
            >
              {copiedEndpoint === 'twilio' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedEndpoint === 'twilio' ? 'Copied!' : 'Copy Endpoint'}</span>
            </button>
          </div>
          <div className="bg-zinc-900 p-2.5 rounded border border-zinc-800 font-mono text-xs text-blue-300 break-all select-all">
            POST {twilioWebhookUrl}
          </div>
          <p className="text-[11px] text-zinc-400">
            Set this as your Twilio Phone Number incoming SMS webhook handler in Twilio Console.
          </p>
        </div>
      </div>
    </div>
  );
};
