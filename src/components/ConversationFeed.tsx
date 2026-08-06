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
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl h-[calc(100vh-12rem)] min-h-[580px] flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar: Lead Selector */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col bg-slate-950/60 shrink-0">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-100 text-sm">Active Prospects</h3>
            <p className="text-[11px] text-slate-400">{tenant.team_name}</p>
          </div>
          <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full font-mono border border-slate-700">
            {leads.length} Leads
          </span>
        </div>

        {/* Lead List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 scrollbar-thin">
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
                  isSelected ? 'bg-slate-800/90 border-l-4 border-cyan-400' : 'hover:bg-slate-900/80'
                }`}
              >
                <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  isQ
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : isDis
                    ? 'bg-rose-950 text-rose-400 border border-rose-800'
                    : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                }`}>
                  {lead.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-200 truncate">{lead.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(lead.last_contact_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{lead.phone}</p>
                  <div className="flex items-center space-x-1.5 mt-1.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${
                      isQ
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                        : isDis
                        ? 'bg-rose-950/80 text-rose-400 border-rose-800/60'
                        : 'bg-cyan-950/80 text-cyan-400 border-cyan-800/60'
                    }`}>
                      {lead.qualification_stage.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate">{lead.budget}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Transcript & Interactive Simulator */}
      {currentLead ? (
        <div className="flex-1 flex flex-col bg-slate-900 h-full overflow-hidden">
          {/* Header Bar */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-100">{currentLead.name}</h3>
                <span className="text-xs text-slate-400 font-mono">({currentLead.phone})</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  isQualified
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : isDisqualified
                    ? 'bg-rose-950 text-rose-400 border-rose-800'
                    : 'bg-cyan-950 text-cyan-400 border-cyan-800'
                }`}>
                  {currentLead.qualification_stage.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                FUB ID: <span className="font-mono text-slate-300">{currentLead.fub_person_id}</span> | Email: {currentLead.email}
              </p>
            </div>

            {/* Extracted Parameters Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">
                <span className="text-slate-400">Timeline:</span> <strong className="text-slate-200">{currentLead.timeline}</strong>
              </div>
              <div className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">
                <span className="text-slate-400">Budget:</span> <strong className="text-slate-200">{currentLead.budget}</strong>
              </div>
              <div className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">
                <span className="text-slate-400">RECO BRA:</span>{' '}
                <strong className={currentLead.representation_status === 'Represented_By_Other' ? 'text-rose-400' : 'text-emerald-400'}>
                  {currentLead.representation_status.replace('_', ' ')}
                </strong>
              </div>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 text-center text-xs text-slate-400 max-w-lg mx-auto">
              🤖 <strong>Speed-to-Lead SMS Qualification Channel</strong> — Gemini 3.6 ISA responds in real-time on behalf of {tenant.team_name}.
            </div>

            {messages.map((msg) => {
              const isOutbound = msg.direction === 'outbound';
              return (
                <div key={msg.id} className={`flex flex-col ${isOutbound ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center space-x-1.5 mb-1 text-[11px] text-slate-500">
                    {isOutbound ? (
                      <>
                        <span className="text-cyan-400 font-medium">Gemini ISA (Twilio Outbound)</span>
                        <span>•</span>
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-slate-300 font-medium">{currentLead.name} (Inbound SMS)</span>
                        <span>•</span>
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </>
                    )}
                  </div>

                  <div
                    className={`max-w-xl p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                      isOutbound
                        ? 'bg-gradient-to-r from-cyan-900 to-indigo-900 text-slate-100 rounded-tr-none border border-cyan-800/60'
                        : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/80'
                    }`}
                  >
                    {msg.body}
                  </div>

                  {/* AI Rationale / Reasoning Callout */}
                  {isOutbound && msg.ai_reasoning && (
                    <div className="mt-1.5 max-w-xl bg-slate-950/80 p-2.5 rounded-lg border border-cyan-900/60 text-[11px] text-cyan-300 flex items-start space-x-2">
                      <Sparkles className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-cyan-200 uppercase tracking-wider text-[10px]">Gemini ISA Rationale:</span>
                        <p className="text-slate-400 mt-0.5">{msg.ai_reasoning}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {isLoadingMessage && (
              <div className="flex flex-col items-end space-y-1">
                <div className="bg-slate-800 p-3.5 rounded-2xl text-xs text-slate-400 flex items-center space-x-2 animate-pulse border border-slate-700">
                  <Sparkles className="h-4 w-4 text-cyan-400 animate-spin" />
                  <span>Gemini ISA analyzing conversation & generating RECO compliant reply...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive SMS Tester Input Box */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 shrink-0">
            <form onSubmit={handleSend} className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span className="flex items-center space-x-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>Simulate Incoming SMS reply as <strong>{currentLead.name}</strong></span>
                </span>
                <span className="text-[11px] text-cyan-400 font-mono">Instant Gemini Qualification</span>
              </div>

              {/* Sample Preset Quick Prompt Chips */}
              <div className="flex flex-wrap items-center gap-1.5 py-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold mr-1">Quick Test Prompts:</span>
                {[
                  "Looking for 3 beds in Yorkville around $2.5M, pre-approved with TD",
                  "I already signed a representation agreement with another realtor last month",
                  "Unrepresented, looking to buy in 60 days near Forest Hill"
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText(preset)}
                    className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 px-2.5 py-1 rounded-full border border-slate-700 transition-colors"
                  >
                    "{preset.slice(0, 35)}..."
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
                  className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
                />
                <button
                  id="send-sms-simulation-btn"
                  type="submit"
                  disabled={!inputText.trim() || isLoadingMessage}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-cyan-950 flex items-center space-x-1.5 transition-all disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Send SMS</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-slate-500 text-sm">
          Select a lead from the sidebar to view conversation thread.
        </div>
      )}
    </div>
  );
};
