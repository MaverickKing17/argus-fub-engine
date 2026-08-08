import React from 'react';
import { QualificationStage } from '../types.js';

export function formatQualificationStage(stage: QualificationStage | string): string {
  if (stage === 'Unrepresented_Disqualified' || stage === 'UNREPRESENTED DISQUALIFIED') {
    return 'SRP / Disqualified (Self-Represented Party)';
  }
  return stage.replace(/_/g, ' ');
}

export function ChannelBadge({ channel }: { channel?: string }) {
  if (!channel) return null;

  let colorClasses = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
  if (channel === 'Google PPC') {
    colorClasses = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  } else if (channel === 'Luxury Web Widget') {
    colorClasses = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  } else if (channel === 'Direct SMS') {
    colorClasses = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
  } else if (channel === 'Meta Ad') {
    colorClasses = 'bg-sky-500/20 text-sky-300 border-sky-500/40';
  }

  return (
    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${colorClasses}`}>
      {channel}
    </span>
  );
}
