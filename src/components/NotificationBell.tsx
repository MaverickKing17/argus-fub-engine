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
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> QUALIFIED
          </span>
        );
      case 'URGENT_INTENT':
        return (
          <span className="bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> URGENT
          </span>
        );
      case 'HUMAN_HANDOFF':
        return (
          <span className="bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
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
        className="relative bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 p-2 rounded-md transition-colors"
        title="Speed-to-lead real-time notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-bold text-[10px] h-4 w-4 rounded-full flex items-center justify-center border border-zinc-950 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="p-3 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-bold text-zinc-100">Alert Feed</span>
              {unreadCount > 0 && (
                <span className="bg-blue-500/10 text-blue-400 text-[10px] font-mono px-1.5 py-0.2 rounded border border-blue-500/20">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-zinc-400 hover:text-zinc-200 transition-colors"
                title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
              >
                {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-blue-400" /> : <VolumeX className="h-3.5 w-3.5 text-zinc-500" />}
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAllReadClick => {
                    onMarkAllRead();
                  }}
                  className="text-[11px] text-zinc-400 hover:text-blue-400 transition-colors flex items-center space-x-1"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>Mark Read</span>
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-zinc-800/60">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500">
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
                  className={`p-3 hover:bg-zinc-800/50 cursor-pointer transition-colors ${
                    !item.is_read ? 'bg-zinc-800/30' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-zinc-100 line-clamp-1">{item.title}</span>
                    <div className="shrink-0">{getEventBadge(item.event_type)}</div>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug line-clamp-2">{item.message}</p>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                    <span>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {!item.is_read && (
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
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
