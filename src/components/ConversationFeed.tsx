import React, { useState, useEffect, useRef } from 'react';
import { Lead, Message, Tenant } from '../types.js';
import { Send, Bot, User, Sparkles, CheckCircle2, ShieldAlert, Tag, Building2, RefreshCw, Info } from 'lucide-react';

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
    <div className="bg-[#141414] rounded-xl border border-[#262626] shadow-sm h-[calc(100vh-11rem)] min-h-[580px] flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar: Lead Selector */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[#262626] flex flex-col bg-[#0A0A0A]/40 shrink-0">
        <div className="p-4 border-b border-[#262626] flex items-center justify-between bg-[#141414]">
          <div>
            <h3 className="font-semibold text-[#F5F5F7] text-xs uppercase tracking-wider">Active Threads</h3>
            <p className="text-[11px] text-[#A1A1AA]">{tenant.team_name}</p>
          </div>
          <span className="bg-[#0A0A0A] text-[#F5F5F7] text-[10px] px-2 py-0.5 rounded font-mono border border-[#262626]">
            {leads.length} Leads
          </span>
        </div>

        {/* Lead List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#262626]/50 scrollbar-thin">
          {leads.map((lead) => {
            const isSelected = lead.id === currentLead?.id;
            const isQ = lead.qualification_stage === 'Qualified';
            const isDis = lead.qualification_stage === 'Unrepresented_Disqualified';

            return (
              <button
                key={lead.id}
                id={`lead-item-${lead.id}`}
                onClick={() => onSelectLead(lead.id)}
                className={`w-full p-3.5 text-left transition-colors flex items-start space-x-3 ${
                  isSelected ? 'bg-[#262626]/60 border-l-2 border-[#C5A059]' : 'hover:bg-[#262626]/30'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  isQ
                    ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                    : isDis
                    ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                    : 'bg-[#262626] text-[#F5F5F7] border border-[#262626]'
                }`}>
                  {lead.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-xs font-semibold text-[#F5F5F7] truncate">{lead.name}</h4>
                    <span className="text-[10px] text-[#A1A1AA] font-mono">
                      {new Date(lead.last_contact_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A1A1AA] truncate">{lead.phone}</p>
                  <div className="flex items-center space-x-1.5 mt-2">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border uppercase tracking-wider ${
                      isQ
                        ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30'
                        : isDis
                        ? 'bg-rose-950/60 text-rose-300 border-rose-800/50'
                        : 'bg-[#C5A059]/15 text-[#C5A059] border-[#C5A059]/30'
                    }`}>
                      {lead.qualification_stage.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-[#A1A1AA] truncate font-mono">{lead.budget}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Transcript & Interactive Simulator */}
      {currentLead ? (
        <div className="flex-1 flex flex-col bg-[#141414] h-full overflow-hidden">
          {/* Header Bar */}
          <div className="p-4 border-b border-[#262626] bg-[#0A0A0A]/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#262626] border border-[#262626] flex items-center justify-center font-bold text-[#F5F5F7]">
                {currentLead.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-semibold text-[#F5F5F7]">{currentLead.name}</h3>
                  <span className="text-xs text-[#A1A1AA] font-mono">{currentLead.phone}</span>
                </div>
                <div className="text-[10px] text-[#10B981] flex items-center gap-1 mt-0.5 font-mono">
                  ● <span className="text-[#A1A1AA] uppercase font-mono">Gemini 3.6 ISA Actively Monitoring</span>
                </div>
              </div>
            </div>

            {/* Extracted Parameters Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-[#0A0A0A] px-2.5 py-1 rounded text-xs border border-[#262626]">
                <span className="text-[#A1A1AA]">Timeline:</span> <strong className="text-[#C5A059]">{currentLead.timeline}</strong>
              </div>
              <div className="bg-[#0A0A0A] px-2.5 py-1 rounded text-xs border border-[#262626]">
                <span className="text-[#A1A1AA]">Budget:</span> <strong className="text-[#C5A059]">{currentLead.budget}</strong>
              </div>
              <div className="bg-[#0A0A0A] px-2.5 py-1 rounded text-xs border border-[#262626]">
                <span className="text-[#A1A1AA]">TRESA BRA:</span>{' '}
                <strong className={currentLead.representation_status === 'Represented_By_Other' ? 'text-rose-400' : 'text-[#10B981]'}>
                  {currentLead.representation_status.replace('_', ' ')}
                </strong>
              </div>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin flex flex-col">
            <div className="bg-[#0A0A0A] p-2.5 rounded-lg border border-[#262626] text-center text-xs text-[#A1A1AA] max-w-lg mx-auto">
              🤖 <strong>Automated Speed-to-Lead SMS Feed</strong> — Responding in &lt; 30s with Ontario TRESA & RECO compliance.
            </div>

            {messages.map((msg) => {
              const isOutbound = msg.direction === 'outbound';
              return (
                <div key={msg.id} className={`flex flex-col ${isOutbound ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-[#A1A1AA] font-mono">
                    {isOutbound ? (
                      <>
                        <span className="text-[#C5A059] font-bold">Gemini ISA</span>
                        <span>•</span>
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[#F5F5F7] font-bold">{currentLead.name}</span>
                        <span>•</span>
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </>
                    )}
                  </div>

                  <div
                    className={`max-w-xl p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isOutbound
                        ? 'bg-[#C5A059] text-black font-medium rounded-tr-none'
                        : 'bg-[#262626] text-[#F5F5F7] rounded-tl-none'
                    }`}
                  >
                    {msg.body}
                  </div>

                  {/* AI Rationale / Reasoning Callout */}
                  {isOutbound && msg.ai_reasoning && (
                    <div className="mt-1.5 max-w-xl bg-[#0A0A0A] p-2.5 rounded-lg border border-[#262626] text-[11px] text-[#F5F5F7] flex items-start space-x-2">
                      <Sparkles className="h-3.5 w-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#C5A059] uppercase tracking-widest text-[9px]">ISA Qualification Logic:</span>
                        <p className="text-[#A1A1AA] mt-0.5 italic">{msg.ai_reasoning}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {isLoadingMessage && (
              <div className="flex flex-col items-end space-y-1">
                <div className="bg-[#262626] p-3 rounded-2xl text-xs text-[#F5F5F7] flex items-center space-x-2 animate-pulse border border-[#262626]">
                  <Sparkles className="h-4 w-4 text-[#C5A059] animate-spin" />
                  <span>Thinking (Gemini 3.6 Flash)... [Intent: Qualification - Representation Check]</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive SMS Tester Input Box */}
          <div className="p-3 border-t border-[#262626] bg-[#0A0A0A] shrink-0">
            <form onSubmit={handleSend} className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#A1A1AA] px-1">
                <span className="flex items-center space-x-1.5">
                  <User className="h-3.5 w-3.5 text-[#A1A1AA]" />
                  <span>Simulate Inbound Reply as <strong>{currentLead.name}</strong></span>
                </span>
                <span className="text-[10px] text-[#C5A059] font-mono">Follow Up Boss Synced</span>
              </div>

              {/* Sample Preset Quick Prompt Chips */}
              <div className="flex flex-wrap items-center gap-1.5 py-0.5">
                <span className="text-[9px] text-[#A1A1AA] uppercase font-bold mr-1">Quick Prompts:</span>
                {[
                  "Looking for 3 beds in Yorkville around $2.5M, pre-approved with TD",
                  "I already signed a representation agreement with another realtor last month",
                  "Unrepresented, looking to buy in 60 days near Forest Hill"
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText(preset)}
                    className="text-[10px] bg-[#262626] hover:bg-[#333333] text-[#F5F5F7] hover:text-[#C5A059] px-2 py-0.5 rounded border border-[#262626] transition-colors"
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
                  placeholder={`Type an SMS message to test Gemini ISA...`}
                  disabled={isLoadingMessage}
                  className="flex-1 bg-[#141414] border border-[#262626] focus:border-[#C5A059] rounded-md px-3.5 py-2 text-xs text-[#F5F5F7] placeholder-[#A1A1AA] focus:outline-none transition-colors"
                />
                <button
                  id="send-sms-simulation-btn"
                  type="submit"
                  disabled={!inputText.trim() || isLoadingMessage}
                  className="bg-[#C5A059] hover:bg-[#B38E46] text-black font-bold px-4 py-2 rounded-md text-xs shadow-sm flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Send SMS</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-[#A1A1AA] text-xs">
          Select a lead from the sidebar to view conversation thread.
        </div>
      )}
    </div>
  );

};
