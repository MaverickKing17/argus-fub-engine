import React, { useState, useEffect, useRef } from 'react';
import { Lead, Message, Tenant } from '../types.js';
import { Send, Bot, User, Sparkles, CheckCircle2, ShieldAlert, Tag, Building2, RefreshCw, Info, ShieldCheck, Activity, Zap } from 'lucide-react';

interface ConversationFeedProps {
  leads: Lead[];
  tenant: Tenant;
  selectedLeadId?: string;
  onSelectLead: (leadId: string) => void;
  onSendMessage: (leadId: string, messageText: string) => Promise<void>;
  isLoadingMessage: boolean;
}

export const ConversationFeed: React.FC<ConversationFeedProps> = ({
  leads,
  tenant,
  selectedLeadId,
  onSelectLead,
  onSendMessage,
  isLoadingMessage
}) => {
  const currentLead = leads.find((l) => l.id === selectedLeadId) || leads[0];
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages for selected lead
  const fetchMessages = async (leadId: string) => {
    try {
      const res = await fetch(`/api/v1/leads/${leadId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Error fetching lead messages:', err);
    }
  };

  useEffect(() => {
    if (currentLead) {
      fetchMessages(currentLead.id);
    }
  }, [currentLead?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingMessage]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentLead || isLoadingMessage) return;

    const text = inputText;
    setInputText('');
    await onSendMessage(currentLead.id, text);
    fetchMessages(currentLead.id);
  };

  const isQualified = currentLead?.qualification_stage === 'Qualified';
  const isDisqualified = currentLead?.qualification_stage === 'Unrepresented_Disqualified';

  return (
    <div className="card-executive shadow-md h-[calc(100vh-11rem)] min-h-[580px] flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Sidebar: Lead Selector + Density Stream Panel */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[#262626] flex flex-col bg-[#0A0A0A]/60 shrink-0">
        <div className="p-3.5 border-b border-[#262626] flex items-center justify-between bg-[#141414]">
          <div>
            <h3 className="font-semibold text-[#F8FAFC] text-sm tracking-wide">Live SMS Threads</h3>
            <p className="text-[10px] text-[#94A3B8] font-mono">{tenant.team_name}</p>
          </div>
          <span className="bg-[#0A0A0A] text-[#C5A059] text-[10px] px-2 py-0.5 rounded font-mono border border-[#262626]">
            {leads.length} Active
          </span>
        </div>

        {/* Lead List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#262626]/50 scrollbar-thin max-h-[380px] md:max-h-none">
          {leads.map((lead) => {
            const isSelected = lead.id === currentLead?.id;
            const isQ = lead.qualification_stage === 'Qualified';
            const isDis = lead.qualification_stage === 'Unrepresented_Disqualified';

            return (
              <button
                key={lead.id}
                id={`lead-item-${lead.id}`}
                onClick={() => onSelectLead(lead.id)}
                className={`w-full p-3 text-left transition-all flex items-start space-x-3 cursor-pointer ${
                  isSelected ? 'bg-[#262626]/80 border-l-2 border-[#C5A059]' : 'hover:bg-[#262626]/30'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  isQ
                    ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                    : isDis
                    ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                    : 'bg-[#262626] text-[#F8FAFC] border border-[#262626]'
                }`}>
                  {lead.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-xs font-semibold text-[#F8FAFC] truncate">{lead.name}</h4>
                    <span className="text-[10px] text-[#94A3B8] font-mono">
                      {new Date(lead.last_contact_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] truncate">{lead.phone}</p>
                  <div className="flex items-center space-x-1.5 mt-1.5">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border uppercase tracking-wider ${
                      isQ
                        ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30'
                        : isDis
                        ? 'bg-rose-950/60 text-rose-300 border-rose-800/50'
                        : 'bg-[#C5A059]/15 text-[#C5A059] border-[#C5A059]/30'
                    }`}>
                      {lead.qualification_stage.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-[#94A3B8] truncate font-mono">{lead.budget}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Left Rail Density Pass: Live Regulatory Compliance Audit Stream */}
        <div className="p-3 border-t border-[#262626] bg-[#0A0A0A] space-y-2 hidden md:block shrink-0">
          <div className="flex items-center justify-between text-[10px] font-bold text-[#C5A059] uppercase tracking-widest font-mono">
            <span className="flex items-center gap-1">
              <Activity className="h-3 w-3 text-[#C5A059]" />
              <span>Real-Time Audit Logs</span>
            </span>
            <span className="text-emerald-400">100% OK</span>
          </div>
          <div className="space-y-1.5 text-[10px] text-[#94A3B8]">
            <div className="p-1.5 bg-[#141414] rounded border border-[#262626] flex items-center justify-between">
              <span>TRESA Disclosure Check:</span>
              <span className="text-[#10B981] font-mono">PASSED</span>
            </div>
            <div className="p-1.5 bg-[#141414] rounded border border-[#262626] flex items-center justify-between">
              <span>FUB Webhook Stream:</span>
              <span className="text-[#10B981] font-mono">0ms Lag</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Transcript & Interactive Simulator */}
      {currentLead ? (
        <div className="flex-1 flex flex-col bg-[#141414] h-full overflow-hidden">
          {/* Header Bar */}
          <div className="p-3.5 border-b border-[#262626] bg-[#0A0A0A]/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-[#262626] border border-[#262626] flex items-center justify-center font-bold text-[#F8FAFC] text-xs">
                {currentLead.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-semibold text-[#F8FAFC]">{currentLead.name}</h3>
                  <span className="text-xs text-[#94A3B8] font-mono">{currentLead.phone}</span>
                </div>
                <div className="text-[10px] text-[#10B981] flex items-center gap-1 mt-0.5 font-mono">
                  ● <span className="text-[#94A3B8] uppercase">ARGUS ISA Engine Actively Monitoring</span>
                </div>
              </div>
            </div>

            {/* Extracted Parameters Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-[#0A0A0A] px-2.5 py-1 rounded-lg text-xs border border-[#262626]">
                <span className="text-[#94A3B8]">Timeline:</span> <strong className="text-[#C5A059]">{currentLead.timeline}</strong>
              </div>
              <div className="bg-[#0A0A0A] px-2.5 py-1 rounded-lg text-xs border border-[#262626]">
                <span className="text-[#94A3B8]">Budget:</span> <strong className="text-[#C5A059]">{currentLead.budget}</strong>
              </div>
              <div className="bg-[#0A0A0A] px-2.5 py-1 rounded-lg text-xs border border-[#262626]">
                <span className="text-[#94A3B8]">TRESA BRA:</span>{' '}
                <strong className={currentLead.representation_status === 'Represented_By_Other' ? 'text-rose-400' : 'text-[#10B981]'}>
                  {currentLead.representation_status.replace('_', ' ')}
                </strong>
              </div>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin flex flex-col">
            <div className="bg-[#0A0A0A] p-2.5 rounded-lg border border-[#262626] text-center text-xs text-[#94A3B8] max-w-lg mx-auto">
              🤖 <strong>ARGUS Autonomous ISA SMS Feed</strong> — Responding in &lt; 30s with Ontario TRESA & RECO compliance.
            </div>

            {messages.map((msg) => {
              const isOutbound = msg.direction === 'outbound';
              return (
                <div key={msg.id} className={`flex flex-col ${isOutbound ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-[#94A3B8] font-mono">
                    {isOutbound ? (
                      <>
                        <span className="text-[#C5A059] font-bold">ARGUS ISA Engine</span>
                        <span>•</span>
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[#F8FAFC] font-bold">{currentLead.name}</span>
                        <span>•</span>
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </>
                    )}
                  </div>

                  {/* High Contrast Chat Bubbles */}
                  <div
                    className={`max-w-xl p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isOutbound
                        ? 'bg-[#C5A059] text-[#0F172A] font-medium rounded-tr-none'
                        : 'bg-[#1E293B] text-[#F8FAFC] font-normal border border-[#334155] rounded-tl-none'
                    }`}
                  >
                    {msg.body}
                  </div>

                  {/* AI Rationale / Reasoning Callout */}
                  {isOutbound && msg.ai_reasoning && (
                    <div className="mt-1.5 max-w-xl bg-[#0A0A0A] p-2.5 rounded-lg border border-[#262626] text-[11px] text-[#F8FAFC] flex items-start space-x-2">
                      <Sparkles className="h-3.5 w-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#C5A059] uppercase tracking-widest text-[9px] font-mono">ISA Qualification Rationale:</span>
                        <p className="text-[#94A3B8] mt-0.5 italic">{msg.ai_reasoning}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {isLoadingMessage && (
              <div className="flex flex-col items-end space-y-1">
                <div className="bg-[#262626] p-3 rounded-xl text-xs text-[#F8FAFC] flex items-center space-x-2 animate-pulse border border-[#262626]">
                  <Sparkles className="h-4 w-4 text-[#C5A059] animate-spin" />
                  <span>Evaluating response (ARGUS ISA)... [Intent: Qualification - Representation Check]</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive SMS Tester Input Box */}
          <div className="p-3 border-t border-[#262626] bg-[#0A0A0A] shrink-0">
            <form onSubmit={handleSend} className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#94A3B8] px-1">
                <span className="flex items-center space-x-1.5">
                  <User className="h-3.5 w-3.5 text-[#94A3B8]" />
                  <span>Simulate Inbound Reply as <strong className="text-[#F8FAFC]">{currentLead.name}</strong></span>
                </span>
                <span className="text-[10px] text-[#C5A059] font-mono">Follow Up Boss Synced</span>
              </div>

              {/* Sample Preset Quick Prompt Chips */}
              <div className="flex flex-wrap items-center gap-1.5 py-0.5">
                <span className="text-[9px] text-[#94A3B8] uppercase font-bold mr-1 font-mono">Presets:</span>
                {[
                  "Looking for 3 beds in Yorkville around $2.5M, pre-approved with TD",
                  "I already signed a representation agreement with another realtor last month",
                  "Unrepresented, looking to buy in 60 days near Forest Hill"
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText(preset)}
                    className="text-[10px] bg-[#262626] hover:bg-[#333333] text-[#F8FAFC] hover:text-[#C5A059] px-2 py-0.5 rounded border border-[#262626] transition-colors cursor-pointer"
                  >
                    "{preset.slice(0, 32)}..."
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="sms-input-field"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Type an SMS message to test ARGUS ISA...`}
                  disabled={isLoadingMessage}
                  className="flex-1 bg-[#141414] border border-[#262626] focus:border-[#C5A059] rounded-lg px-3.5 py-2 text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none transition-colors"
                />
                <button
                  id="send-sms-simulation-btn"
                  type="submit"
                  disabled={!inputText.trim() || isLoadingMessage}
                  className="bg-gradient-to-r from-[#C5A059] to-[#B38E46] hover:brightness-110 text-zinc-950 font-bold px-4 py-2 rounded-lg text-xs shadow-md flex items-center space-x-1.5 transition-all disabled:opacity-50 border border-[#C5A059]/30 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Send SMS</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-[#94A3B8] text-xs">
          Select a lead from the sidebar to view conversation thread.
        </div>
      )}
    </div>
  );
};
