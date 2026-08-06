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
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm h-[calc(100vh-11rem)] min-h-[580px] flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar: Lead Selector */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col bg-zinc-950/40 shrink-0">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div>
            <h3 className="font-semibold text-zinc-100 text-xs uppercase tracking-wider">Active Threads</h3>
            <p className="text-[11px] text-zinc-400">{tenant.team_name}</p>
          </div>
          <span className="bg-zinc-800 text-zinc-300 text-[10px] px-2 py-0.5 rounded font-mono border border-zinc-700">
            {leads.length} Leads
          </span>
        </div>

        {/* Lead List */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/50 scrollbar-thin">
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
                  isSelected ? 'bg-zinc-800/40 border-l-2 border-blue-500' : 'hover:bg-zinc-800/20'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  isQ
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : isDis
                    ? 'bg-rose-950 text-rose-400 border border-rose-800'
                    : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                }`}>
                  {lead.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-xs font-semibold text-zinc-100 truncate">{lead.name}</h4>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {new Date(lead.last_contact_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate">{lead.phone}</p>
                  <div className="flex items-center space-x-1.5 mt-2">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border uppercase tracking-wider ${
                      isQ
                        ? 'bg-emerald-900/40 text-emerald-300 border-emerald-800/50'
                        : isDis
                        ? 'bg-rose-900/40 text-rose-300 border-rose-800/50'
                        : 'bg-blue-900/40 text-blue-300 border-blue-800/50'
                    }`}>
                      {lead.qualification_stage.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-zinc-500 truncate font-mono">{lead.budget}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Transcript & Interactive Simulator */}
      {currentLead ? (
        <div className="flex-1 flex flex-col bg-zinc-900 h-full overflow-hidden">
          {/* Header Bar */}
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-200">
                {currentLead.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-semibold text-zinc-100">{currentLead.name}</h3>
                  <span className="text-xs text-zinc-400 font-mono">{currentLead.phone}</span>
                </div>
                <div className="text-[10px] text-emerald-500 flex items-center gap-1 mt-0.5">
                  ● <span className="text-zinc-400 uppercase font-mono">Gemini 3.6 ISA Actively Monitoring</span>
                </div>
              </div>
            </div>

            {/* Extracted Parameters Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-zinc-800 px-2.5 py-1 rounded text-xs border border-zinc-700">
                <span className="text-zinc-400">Timeline:</span> <strong className="text-blue-400">{currentLead.timeline}</strong>
              </div>
              <div className="bg-zinc-800 px-2.5 py-1 rounded text-xs border border-zinc-700">
                <span className="text-zinc-400">Budget:</span> <strong className="text-blue-400">{currentLead.budget}</strong>
              </div>
              <div className="bg-zinc-800 px-2.5 py-1 rounded text-xs border border-zinc-700">
                <span className="text-zinc-400">RECO BRA:</span>{' '}
                <strong className={currentLead.representation_status === 'Represented_By_Other' ? 'text-rose-400' : 'text-emerald-400'}>
                  {currentLead.representation_status.replace('_', ' ')}
                </strong>
              </div>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin flex flex-col">
            <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800 text-center text-xs text-zinc-400 max-w-lg mx-auto">
              🤖 <strong>Automated Speed-to-Lead SMS Feed</strong> — Responding in &lt; 30s with Ontario RECO compliance.
            </div>

            {messages.map((msg) => {
              const isOutbound = msg.direction === 'outbound';
              return (
                <div key={msg.id} className={`flex flex-col ${isOutbound ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-zinc-500 font-mono">
                    {isOutbound ? (
                      <>
                        <span className="text-blue-400 font-bold">Gemini ISA</span>
                        <span>•</span>
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-zinc-300 font-bold">{currentLead.name}</span>
                        <span>•</span>
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </>
                    )}
                  </div>

                  <div
                    className={`max-w-xl p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isOutbound
                        ? 'bg-blue-600 text-zinc-100 rounded-tr-none'
                        : 'bg-zinc-800 text-zinc-100 rounded-tl-none'
                    }`}
                  >
                    {msg.body}
                  </div>

                  {/* AI Rationale / Reasoning Callout */}
                  {isOutbound && msg.ai_reasoning && (
                    <div className="mt-1.5 max-w-xl bg-zinc-950/80 p-2.5 rounded-lg border border-zinc-800 text-[11px] text-zinc-300 flex items-start space-x-2">
                      <Sparkles className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-blue-400 uppercase tracking-widest text-[9px]">ISA Qualification Logic:</span>
                        <p className="text-zinc-400 mt-0.5 italic">{msg.ai_reasoning}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {isLoadingMessage && (
              <div className="flex flex-col items-end space-y-1">
                <div className="bg-zinc-800 p-3 rounded-2xl text-xs text-zinc-300 flex items-center space-x-2 animate-pulse border border-zinc-700">
                  <Sparkles className="h-4 w-4 text-blue-400 animate-spin" />
                  <span>Thinking (Gemini 3.6 Flash)... [Intent: Qualification - Representation Check]</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive SMS Tester Input Box */}
          <div className="p-3 border-t border-zinc-800 bg-zinc-950/80 shrink-0">
            <form onSubmit={handleSend} className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                <span className="flex items-center space-x-1.5">
                  <User className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Simulate Inbound Reply as <strong>{currentLead.name}</strong></span>
                </span>
                <span className="text-[10px] text-blue-400 font-mono">Follow Up Boss Synced</span>
              </div>

              {/* Sample Preset Quick Prompt Chips */}
              <div className="flex flex-wrap items-center gap-1.5 py-0.5">
                <span className="text-[9px] text-zinc-500 uppercase font-bold mr-1">Quick Prompts:</span>
                {[
                  "Looking for 3 beds in Yorkville around $2.5M, pre-approved with TD",
                  "I already signed a representation agreement with another realtor last month",
                  "Unrepresented, looking to buy in 60 days near Forest Hill"
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText(preset)}
                    className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-2 py-0.5 rounded border border-zinc-700 transition-colors"
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
                  className="flex-1 bg-zinc-900 border border-zinc-700 focus:border-blue-500 rounded-md px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
                />
                <button
                  id="send-sms-simulation-btn"
                  type="submit"
                  disabled={!inputText.trim() || isLoadingMessage}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-md text-xs shadow-sm flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Send SMS</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-zinc-500 text-xs">
          Select a lead from the sidebar to view conversation thread.
        </div>
      )}
    </div>
  );
};
