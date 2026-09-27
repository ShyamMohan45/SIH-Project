import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, Calendar, User, Activity } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function CentralAuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAudit() {
      try {
        const token = localStorage.getItem('nlams_token');
        const res = await axios.get(`${API_BASE}/admin/central/audit`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAudit();
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white">National Cryptographic Audit Trail</h2>
          <p className="text-xs text-slate-400">Immutable ledger of administrative actions, statutory approvals, and field inspections</p>
        </div>
        <span className="text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-800">
          Tamper-Evident Ledger Active
        </span>
      </div>

      <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-semibold border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Officer ID / Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-slate-500">
                    No recent audit logs recorded.
                  </td>
                </tr>
              ) : (
                logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-750 transition">
                    <td className="py-3 px-4 font-mono text-slate-400">{l.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-white">
                      {l.user} <span className="text-[10px] text-indigo-400 font-mono">({l.role})</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-900/60 text-indigo-300">
                        {l.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">{l.entity}: {l.entity_id}</td>
                    <td className="py-3 px-4 text-slate-400">{l.new_value || l.details || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
