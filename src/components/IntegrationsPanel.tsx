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
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="card-pop p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F8FAFC]">Integration Health & Webhook Listeners</h2>
          <p className="text-xs sm:text-sm text-[#CBD5E1] mt-1 font-medium">
            Real-time API endpoints for Follow Up Boss, Twilio SMS, and Google Gemini 3.6 Flash.
          </p>
        </div>
        <button
          id="refresh-health-btn"
          onClick={onRefreshHealth}
          className="bg-[#142133] hover:bg-[#1C2C42] text-[#F8FAFC] text-xs font-bold px-4 py-2.5 rounded-xl border border-white/[0.1] transition-all flex items-center space-x-2 cursor-pointer shadow-sm"
        >
          <RefreshCw className="h-3.5 w-3.5 text-[#38BDF8]" />
          <span>Ping API Connections</span>
        </button>
      </div>

      {/* Integration Status Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* FUB Card */}
        <div className="card-executive p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#38BDF8]/15 text-[#38BDF8] flex items-center justify-center font-bold text-xs border border-[#38BDF8]/30">
                FUB
              </div>
              <div>
                <h3 className="font-bold text-[#F8FAFC] text-xs">Follow Up Boss API</h3>
                <p className="text-[10px] text-[#CBD5E1] font-mono">REST API v1</p>
              </div>
            </div>
            <span className="bg-[#10B981]/15 text-[#10B981] text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-[#10B981]/30 uppercase tracking-wider flex items-center space-x-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              <span>Healthy</span>
            </span>
          </div>

          <div className="space-y-2 pt-3 border-t border-white/[0.08] text-xs">
            <div className="flex justify-between">
              <span className="text-[#CBD5E1]">Target Tenant:</span>
              <span className="text-[#F8FAFC] font-semibold">{tenant.team_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#CBD5E1]">API Key Configured:</span>
              <span className="text-[#10B981] font-mono font-bold">
                {tenant.fub_api_key ? '✓ Present' : 'Default Global'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#CBD5E1]">Sync Actions:</span>
              <span className="text-[#F8FAFC]">Tags, Notes, Stage</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#CBD5E1]">Latency:</span>
              <span className="text-[#38BDF8] font-mono font-bold">{health.fub.latencyMs}ms</span>
            </div>
          </div>
        </div>

        {/* Twilio Card */}
        <div className="card-executive p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center font-bold text-xs border border-rose-500/30">
                SMS
              </div>
              <div>
                <h3 className="font-bold text-[#F8FAFC] text-xs">Twilio SMS Gateway</h3>
                <p className="text-[10px] text-[#CBD5E1] font-mono">Inbound & Outbound SMS</p>
              </div>
            </div>
            <span className="bg-[#10B981]/15 text-[#10B981] text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-[#10B981]/30 uppercase tracking-wider flex items-center space-x-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              <span>Listening</span>
            </span>
          </div>

          <div className="space-y-2 pt-3 border-t border-white/[0.08] text-xs">
            <div className="flex justify-between">
              <span className="text-[#CBD5E1]">Phone Number:</span>
              <span className="text-[#F8FAFC] font-mono font-semibold">{tenant.twilio_phone_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#CBD5E1]">Account SID:</span>
              <span className="text-[#F8FAFC] font-mono">{tenant.twilio_sid.slice(0, 10)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#CBD5E1]">Speed SLA:</span>
              <span className="text-[#10B981] font-bold">&lt; 30s Guaranteed</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#CBD5E1]">Latency:</span>
              <span className="text-[#38BDF8] font-mono font-bold">{health.twilio.latencyMs}ms</span>
            </div>
          </div>
        </div>

        {/* Gemini API Card */}
        <div className="card-executive p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#E5C178]/15 text-[#E5C178] flex items-center justify-center font-bold text-xs border border-[#E5C178]/30">
                AI
              </div>
              <div>
                <h3 className="font-bold text-[#F8FAFC] text-xs">Gemini 3.6 Flash</h3>
                <p className="text-[10px] text-[#CBD5E1] font-mono">@google/genai SDK</p>
              </div>
            </div>
            <span className="bg-[#10B981]/15 text-[#10B981] text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-[#10B981]/30 uppercase tracking-wider flex items-center space-x-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              <span>Active</span>
            </span>
          </div>

          <div className="space-y-2 pt-3 border-t border-white/[0.08] text-xs">
            <div className="flex justify-between">
              <span className="text-[#CBD5E1]">System Instruction:</span>
              <span className="text-[#F8FAFC] font-semibold">RECO & CASL ISA Guardrails</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#CBD5E1]">Structured Schema:</span>
              <span className="text-[#10B981] font-mono font-bold">Enabled (JSON)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#CBD5E1]">Model Name:</span>
              <span className="text-[#F8FAFC] font-mono">gemini-3.6-flash</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#CBD5E1]">Latency:</span>
              <span className="text-[#38BDF8] font-mono font-bold">{health.gemini.latencyMs}ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Webhook Endpoint URLs & Instructions */}
      <div className="card-executive p-6 space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-[#F8FAFC] uppercase tracking-wider">Configured Webhook Endpoints</h3>
          <p className="text-[11px] text-[#CBD5E1] mt-0.5">
            Configure these HTTP POST webhooks inside your Follow Up Boss and Twilio Admin accounts.
          </p>
        </div>

        {/* Webhook 1: FUB */}
        <div className="bg-[#071524] p-4 rounded-xl border border-white/[0.08] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider">
              1. Follow Up Boss Webhook URL (personCreated)
            </span>
            <button
              id="copy-fub-webhook-btn"
              onClick={() => handleCopy(fubWebhookUrl, 'fub')}
              className="text-xs bg-[#142133] hover:bg-[#1C2C42] text-[#F8FAFC] px-3 py-1.5 rounded-lg border border-white/[0.1] flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              {copiedEndpoint === 'fub' ? <Check className="h-3.5 w-3.5 text-[#10B981]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedEndpoint === 'fub' ? 'Copied!' : 'Copy Endpoint'}</span>
            </button>
          </div>
          <div className="bg-[#0B1726] p-3 rounded-lg border border-white/[0.08] font-mono text-xs text-[#38BDF8] break-all select-all">
            POST {fubWebhookUrl}
          </div>
          <p className="text-[11px] text-[#CBD5E1]">
            FUB payload triggers immediate speed-to-lead SMS qualification within 30 seconds.
          </p>
        </div>

        {/* Webhook 2: Twilio */}
        <div className="bg-[#071524] p-4 rounded-xl border border-white/[0.08] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              2. Twilio Inbound SMS Webhook URL
            </span>
            <button
              id="copy-twilio-webhook-btn"
              onClick={() => handleCopy(twilioWebhookUrl, 'twilio')}
              className="text-xs bg-[#142133] hover:bg-[#1C2C42] text-[#F8FAFC] px-3 py-1.5 rounded-lg border border-white/[0.1] flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              {copiedEndpoint === 'twilio' ? <Check className="h-3.5 w-3.5 text-[#10B981]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedEndpoint === 'twilio' ? 'Copied!' : 'Copy Endpoint'}</span>
            </button>
          </div>
          <div className="bg-[#0B1726] p-3 rounded-lg border border-white/[0.08] font-mono text-xs text-[#38BDF8] break-all select-all">
            POST {twilioWebhookUrl}
          </div>
          <p className="text-[11px] text-[#CBD5E1]">
            Set this as your Twilio Phone Number incoming SMS webhook handler in Twilio Console.
          </p>
        </div>
      </div>
    </div>
  );
};
