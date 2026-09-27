import React from 'react';

export default function StatusBadge({ status, size = 'sm' }) {
  const s = (status || '').toUpperCase();
  let color = 'bg-slate-100 text-slate-700 border-slate-300';
  let dot = 'bg-slate-400';

  if (s.includes('VERIFIED') || s.includes('COMPLETED') || s.includes('MATCHED') || s.includes('APPROVED')) {
    color = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    dot = 'bg-emerald-500';
  } else if (s.includes('PROGRESS') || s.includes('UNDER PROCESS') || s.includes('PENDING')) {
    color = 'bg-amber-50 text-amber-800 border-amber-300';
    dot = 'bg-amber-500';
  } else if (s.includes('CRITICAL') || s.includes('HIGH') || s.includes('DISPUTED') || s.includes('MISMATCH') || s.includes('OVERDUE')) {
    color = 'bg-red-50 text-red-800 border-red-300';
    dot = 'bg-red-500';
  } else if (s.includes('LOW')) {
    color = 'bg-blue-50 text-blue-800 border-blue-300';
    dot = 'bg-blue-500';
  }

  const px = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : size === 'lg' ? 'px-3 py-1 text-sm font-bold' : 'px-2.5 py-0.5 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${color} ${px}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      <span>{status}</span>
    </span>
  );
}
