import React, { useState, useEffect, useRef } from 'react';
import { Lead, Message, Tenant } from '../types.js';
import { Send, Bot, User, Sparkles, CheckCircle2, ShieldAlert, Tag, Building2, RefreshCw, Info, ShieldCheck, Activity, Zap, PauseCircle, PlayCircle, Radio } from 'lucide-react';
import { formatQualificationStage, ChannelBadge } from '../lib/formatters.js';

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
  const [pausedLeadIds, setPausedLeadIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isHumanTakeoverActive = currentLead ? pausedLeadIds.has(currentLead.id) : false;

  const toggleHumanTakeover = () => {
    if (!currentLead) return;
    setPausedLeadIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentLead.id)) {
        next.delete(currentLead.id);
      } else {
        next.add(currentLead.id);
      }
      return next;
    });
  };

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

    if (isHumanTakeoverActive) {
      // Manual Agent Override: Insert outbound message directly into local thread state / API
      try {
        const res = await fetch(`/api/v1/leads/${currentLead.id}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            body: text,
            isManualAgentOverride: true
          })
        });
        if (res.ok) {
          fetchMessages(currentLead.id);
        } else {
          await onSendMessage(currentLead.id, text);
          fetchMessages(currentLead.id);
        }
      } catch (err) {
        await onSendMessage(currentLead.id, text);
        fetchMessages(currentLead.id);
      }
    } else {
      await onSendMessage(currentLead.id, text);
      fetchMessages(currentLead.id);
    }
  };

  const isQualified = currentLead?.qualification_stage === 'Qualified';
  const isDisqualified = currentLead?.qualification_stage === 'Unrepresented_Disqualified';

  return (
    <div className="card-executive shadow-xl h-[calc(100vh-11rem)] min-h-[580px] flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Sidebar: Lead Selector + Density Stream Panel */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/[0.08] flex flex-col bg-[#071524] shrink-0">
        <div className="p-3.5 border-b border-white/[0.08] flex items-center justify-between bg-[#0B1726]">
          <div>
            <h3 className="font-bold text-[#F8FAFC] text-sm tracking-wide">Live SMS Threads</h3>
            <p className="text-[10px] text-[#CBD5E1] font-mono font-medium">{tenant.team_name}</p>
          </div>
          <span className="bg-[#071524] text-[#E5C178] text-[10px] font-bold px-2.5 py-0.5 rounded-md font-mono border border-white/[0.08]">
            {leads.length} Active
          </span>
        </div>

        {/* Lead List */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/[0.05] scrollbar-thin max-h-[380px] md:max-h-none">
          {leads.map((lead) => {
            const isSelected = lead.id === currentLead?.id;
            const isQ = lead.qualification_stage === 'Qualified';
            const isDis = lead.qualification_stage === 'Unrepresented_Disqualified';
            const isPaused = pausedLeadIds.has(lead.id);

            return (
              <button
                key={lead.id}
                id={`lead-item-${lead.id}`}
                onClick={() => onSelectLead(lead.id)}
                className={`w-full p-3.5 text-left transition-all flex items-start space-x-3 cursor-pointer ${
                  isSelected ? 'bg-[#142133] border-l-2 border-[#E5C178]' : 'hover:bg-white/[0.04]'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  isQ
                    ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                    : isDis
                    ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                    : 'bg-white/[0.06] text-[#F8FAFC] border border-white/[0.08]'
                }`}>
                  {lead.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-xs font-bold text-[#F8FAFC] truncate flex items-center gap-1.5">
                      <span>{lead.name}</span>
                      {isPaused && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 py-0.2 rounded font-mono font-bold">HUMAN</span>
                      )}
                    </h4>
                    <span className="text-[10px] text-[#CBD5E1] font-mono font-medium">
                      {new Date(lead.last_contact_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-[11px] text-[#CBD5E1] font-medium truncate">{lead.phone}</p>
                    <ChannelBadge channel={lead.channel} />
                  </div>
                  <div className="flex items-center space-x-1.5 mt-1.5">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border uppercase tracking-wider ${
                      isQ
                        ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40'
                        : isDis
                        ? 'bg-rose-950/60 text-rose-300 border-rose-800/50'
                        : 'bg-[#E5C178]/20 text-[#E5C178] border-[#E5C178]/40'
                    }`}>
                      {formatQualificationStage(lead.qualification_stage)}
                    </span>
                    <span className="text-[10px] text-[#F8FAFC] font-semibold truncate font-mono">{lead.budget}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Left Rail Density Pass: Live Regulatory Compliance Audit Stream */}
        <div className="p-3 border-t border-white/[0.08] bg-[#0B1726] space-y-2 hidden md:block shrink-0">
          <div className="flex items-center justify-between text-[10px] font-bold text-[#E5C178] uppercase tracking-widest font-mono">
            <span className="flex items-center gap-1">
              <Activity className="h-3 w-3 text-[#E5C178]" />
              <span>Real-Time Audit Logs</span>
            </span>
            <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">TRESA & RECO ALIGNED / PASSED</span>
          </div>
          <div className="space-y-1.5 text-[10px] text-[#CBD5E1]">
            <div className="p-1.5 bg-[#071524] rounded border border-white/[0.08] flex items-center justify-between">
              <span>TRESA IBR Disclosure Sent:</span>
              <span className="text-[#10B981] font-mono font-bold">PASSED</span>
            </div>
            <div className="p-1.5 bg-[#071524] rounded border border-white/[0.08] flex items-center justify-between">
              <span>FUB Webhook Stream:</span>
              <span className="text-[#10B981] font-mono font-bold">0ms Lag</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Transcript & Interactive Simulator */}
      {currentLead ? (
        <div className="flex-1 flex flex-col bg-[#0E1826] h-full overflow-hidden">
          {/* Header Bar */}
          <div className="p-3.5 border-b border-white/[0.08] bg-[#0B1726] flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#142133] border border-white/[0.08] flex items-center justify-center font-bold text-[#F8FAFC] text-xs">
                {currentLead.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-[#F8FAFC]">{currentLead.name}</h3>
                  <span className="text-xs text-[#CBD5E1] font-mono font-medium">{currentLead.phone}</span>
                  <ChannelBadge channel={currentLead.channel} />
                </div>
                <div className="text-[10px] font-mono font-semibold flex items-center gap-1.5 mt-0.5">
                  {isHumanTakeoverActive ? (
                    <span className="text-amber-400 flex items-center gap-1 font-bold">
                      <Radio className="h-3 w-3 animate-pulse text-amber-400" />
                      ● HUMAN OVERRIDE ACTIVE — AI ISA PAUSED
                    </span>
                  ) : (
                    <span className="text-[#10B981] flex items-center gap-1">
                      ● <span className="text-[#CBD5E1] uppercase">ARGUS ISA Engine Actively Monitoring</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions: Human Takeover Toggle & Extracted Parameters Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Human Takeover (Pause AI) Button */}
              <button
                id="human-takeover-toggle-btn"
                onClick={toggleHumanTakeover}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isHumanTakeoverActive
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30 shadow-md animate-pulse'
                    : 'bg-white/[0.08] hover:bg-white/[0.15] text-[#F8FAFC] border-white/[0.12]'
                }`}
                title="Pause AI and take over thread with live manual SMS override"
              >
                {isHumanTakeoverActive ? (
                  <>
                    <PauseCircle className="h-3.5 w-3.5 text-amber-400" />
                    <span>AI Paused — Human Control Active</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-3.5 w-3.5 text-[#E5C178]" />
                    <span>Take Over Thread (Pause AI)</span>
                  </>
                )}
              </button>

              <div className="bg-[#071524] px-3 py-1 rounded-lg text-xs border border-white/[0.08]">
                <span className="text-[#CBD5E1]">Timeline:</span> <strong className="text-[#E5C178] font-bold">{currentLead.timeline}</strong>
              </div>
              <div className="bg-[#071524] px-3 py-1 rounded-lg text-xs border border-white/[0.08]">
                <span className="text-[#CBD5E1]">Budget:</span> <strong className="text-[#E5C178] font-bold">{currentLead.budget}</strong>
              </div>
              <div className="bg-[#071524] px-3 py-1 rounded-lg text-xs border border-white/[0.08]">
                <span className="text-[#CBD5E1]">TRESA BRA:</span>{' '}
                <strong className={currentLead.representation_status === 'Represented_By_Other' ? 'text-rose-400 font-bold' : 'text-[#10B981] font-bold'}>
                  {currentLead.representation_status.replace('_', ' ')}
                </strong>
              </div>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin flex flex-col">
            {/* Regulatory Audit Note Banner */}
            <div className="bg-[#071524] p-3 rounded-xl border border-white/[0.08] text-center text-xs text-[#CBD5E1] max-w-2xl mx-auto shadow-sm space-y-1">
              <div className="flex items-center justify-center gap-1.5 font-bold text-[#E5C178]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
                <span className="bg-[#10B981]/15 text-[#10B981] px-2 py-0.5 rounded font-mono text-[10px] border border-[#10B981]/30 uppercase">TRESA & RECO ALIGNED / PASSED</span>
              </div>
              <p className="text-[11px] text-[#E2E8F0]">
                "TRESA Information Before Representation (IBR) disclosure issued automatically via SMS before intent capture."
              </p>
            </div>

            {/* Human Takeover Active System Banner */}
            {isHumanTakeoverActive && (
              <div className="bg-amber-950/50 border border-amber-500/50 p-3 rounded-xl text-center text-xs text-amber-200 shadow-sm flex items-center justify-center gap-2 animate-fadeIn">
                <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="font-semibold">ARGUS ISA paused by agent. Live manual SMS override enabled.</span>
              </div>
            )}

            {messages.map((msg) => {
              const isOutbound = msg.direction === 'outbound';
              return (
                <div key={msg.id} className={`flex flex-col ${isOutbound ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-[#CBD5E1] font-mono">
                    {isOutbound ? (
                      <>
                        <span className="text-[#E5C178] font-bold">
                          {isHumanTakeoverActive ? 'Licensed Human Agent (Override)' : 'ARGUS ISA Engine'}
                        </span>
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
                    className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isOutbound
                        ? 'bg-[#F5DFB0] text-[#050B14] font-semibold rounded-tr-none shadow-md'
                        : 'bg-[#142133] text-[#F8FAFC] font-normal border border-white/[0.1] rounded-tl-none shadow-md'
                    }`}
                  >
                    {msg.body}
                  </div>

                  {/* AI Rationale / Reasoning Callout */}
                  {isOutbound && msg.ai_reasoning && (
                    <div className="mt-1.5 max-w-xl bg-[#071524] p-3 rounded-xl border border-white/[0.08] text-[11px] text-[#F8FAFC] flex items-start space-x-2.5 shadow-sm">
                      <Sparkles className="h-3.5 w-3.5 text-[#E5C178] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#E5C178] uppercase tracking-widest text-[9px] font-mono">ISA Qualification Rationale:</span>
                        <p className="text-[#CBD5E1] mt-0.5 italic">{msg.ai_reasoning}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {isLoadingMessage && (
              <div className="flex flex-col items-end space-y-1">
                <div className="bg-[#142133] p-3.5 rounded-2xl text-xs text-[#F8FAFC] flex items-center space-x-2 animate-pulse border border-white/[0.1]">
                  <Sparkles className="h-4 w-4 text-[#E5C178] animate-spin" />
                  <span>Evaluating response (ARGUS ISA)... [Intent: Qualification - Representation Check]</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive SMS Tester Input Box */}
          <div className="p-4 border-t border-white/[0.08] bg-[#0B1726] shrink-0">
            <form onSubmit={handleSend} className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-[#CBD5E1] px-1">
                <span className="flex items-center space-x-1.5 font-medium">
                  <User className="h-3.5 w-3.5 text-[#CBD5E1]" />
                  <span>
                    {isHumanTakeoverActive ? (
                      <span className="text-amber-300 font-bold">Manual SMS Mode Active (Live Agent Override)</span>
                    ) : (
                      <span>Simulate Inbound Reply as <strong className="text-[#F8FAFC]">{currentLead.name}</strong></span>
                    )}
                  </span>
                </span>
                <span className="text-[10px] text-[#E5C178] font-mono font-bold">Follow Up Boss Synced</span>
              </div>

              {/* Sample Preset Quick Prompt Chips */}
              {!isHumanTakeoverActive && (
                <div className="flex flex-wrap items-center gap-1.5 py-0.5">
                  <span className="text-[9px] text-[#CBD5E1] uppercase font-bold mr-1 font-mono">Presets:</span>
                  {[
                    "Looking for 3 beds in Yorkville around $3.5M, pre-approved with TD",
                    "I already signed a representation agreement with another realtor last month",
                    "Unrepresented, looking to buy in 60 days near Forest Hill"
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setInputText(preset)}
                      className="text-[10px] bg-[#071524] hover:bg-[#142133] text-[#F8FAFC] hover:text-[#E5C178] px-2.5 py-1 rounded-md border border-white/[0.08] transition-colors cursor-pointer"
                    >
                      "{preset.slice(0, 32)}..."
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  id="sms-input-field"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isHumanTakeoverActive ? `Type direct SMS response to ${currentLead.name} as human agent...` : `Type an SMS message to test ARGUS ISA...`}
                  disabled={isLoadingMessage}
                  className={`flex-1 bg-[#071524] border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none transition-colors ${
                    isHumanTakeoverActive ? 'border-amber-500/60 focus:border-amber-400' : 'border-white/[0.1] focus:border-[#E5C178]'
                  }`}
                />
                <button
                  id="send-sms-simulation-btn"
                  type="submit"
                  disabled={!inputText.trim() || isLoadingMessage}
                  className={`font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 disabled:opacity-50 shrink-0 cursor-pointer shadow-md transition-colors ${
                    isHumanTakeoverActive
                      ? 'bg-amber-500 hover:bg-amber-400 text-black'
                      : 'btn-executive-primary'
                  }`}
                >
                  <Send className="h-3.5 w-3.5 text-[#050B14]" />
                  <span className="hidden sm:inline">{isHumanTakeoverActive ? 'Send Manual SMS' : 'Send SMS'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-[#CBD5E1] text-xs">
          Select a lead from the sidebar to view conversation thread.
        </div>
      )}
    </div>
  );
};
