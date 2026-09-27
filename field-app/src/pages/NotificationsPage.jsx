import React from 'react';
import { Bell, AlertTriangle, CheckCircle, Clock, Calendar } from 'lucide-react';

export default function NotificationsPage() {
  const notifications = [
    {
      id: 'N-1',
      title: 'High Priority Inspection Assigned',
      desc: 'District Collectorate assigned Khasra 1042 (Limbdi) for Section 15 objection verification.',
      time: '15 mins ago',
      type: 'urgent'
    },
    {
      id: 'N-2',
      title: 'Inspection Deadline Approaching',
      desc: 'Task FO-1045 (Bamanbore) is due in 48 hours for tree valuation re-measurement.',
      time: '2 hours ago',
      type: 'warning'
    },
    {
      id: 'N-3',
      title: 'Field Inspection Approved',
      desc: 'Inspection dossier FO-1040-2026-001 has been reviewed and cleared by State Admin.',
      time: 'Yesterday',
      type: 'success'
    }
  ];

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-900">Notification Center</h2>
          <p className="text-xs text-slate-500">SLA Alerts & Central Directives</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-3.5 rounded-2xl border transition shadow-sm bg-white ${
              n.type === 'urgent'
                ? 'border-red-300 bg-red-50/20'
                : n.type === 'warning'
                ? 'border-amber-300 bg-amber-50/20'
                : 'border-slate-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl shrink-0 ${
                n.type === 'urgent' ? 'bg-red-100 text-red-700' : n.type === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {n.type === 'urgent' ? <AlertTriangle className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-slate-900">{n.title}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
