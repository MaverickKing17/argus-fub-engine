import React, { useState } from 'react';
import { NotificationItem } from '../types.js';
import { Bell, Check, CheckCheck, AlertTriangle, ShieldAlert, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface NotificationBellProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onSelectLead?: (leadId: string) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onSelectLead
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Audio context fallback
    }
  };

  const getEventBadge = (type: NotificationItem['event_type']) => {
    switch (type) {
      case 'LEAD_QUALIFIED':
        return (
          <span className="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> QUALIFIED
          </span>
        );
      case 'URGENT_INTENT':
        return (
          <span className="bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> URGENT
          </span>
        );
      case 'HUMAN_HANDOFF':
        return (
          <span className="bg-rose-950/60 text-rose-400 border border-rose-800/60 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
            <ShieldAlert className="h-3 w-3" /> HANDOFF
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <button
        id="notification-bell-btn"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0 && soundEnabled) {
            playChime();
          }
        }}
        className="relative bg-[#141414] border border-[#262626] hover:border-[#C5A059]/50 text-[#F5F5F7] p-2 rounded-md transition-colors"
        title="Speed-to-lead real-time notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#C5A059] text-black font-bold text-[10px] h-4 w-4 rounded-full flex items-center justify-center border border-[#0A0A0A] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#141414] border border-[#262626] rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="p-3 bg-[#0A0A0A] border-b border-[#262626] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-[#C5A059]" />
              <span className="text-xs font-bold text-[#F5F5F7]">Alert Feed</span>
              {unreadCount > 0 && (
                <span className="bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-mono px-1.5 py-0.2 rounded border border-[#C5A059]/20">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-[#A1A1AA] hover:text-[#F5F5F7] transition-colors"
                title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
              >
                {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-[#C5A059]" /> : <VolumeX className="h-3.5 w-3.5 text-[#A1A1AA]" />}
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={() => {
                    onMarkAllRead();
                  }}
                  className="text-[11px] text-[#A1A1AA] hover:text-[#C5A059] transition-colors flex items-center space-x-1"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>Mark Read</span>
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#262626]/60">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#A1A1AA]">
                No active notifications right now.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onMarkRead(item.id);
                    if (item.lead_id && onSelectLead) {
                      onSelectLead(item.lead_id);
                    }
                  }}
                  className={`p-3 hover:bg-[#0A0A0A]/60 cursor-pointer transition-colors ${
                    !item.is_read ? 'bg-[#0A0A0A]/40' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-[#F5F5F7] line-clamp-1">{item.title}</span>
                    <div className="shrink-0">{getEventBadge(item.event_type)}</div>
                  </div>
                  <p className="text-[11px] text-[#A1A1AA] leading-snug line-clamp-2">{item.message}</p>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#A1A1AA] font-mono">
                    <span>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {!item.is_read && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]"></span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
