import React, { useState } from 'react';
import {
  ShieldCheck, Search, Filter, Download, Clock, User, FileText, CheckCircle2,
  Copy, Hash, Lock, Check
} from 'lucide-react';

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);

  const logs = [
    {
      id: 'AUD-9921',
      timestamp: '2026-03-11 16:42:15 IST',
      user: 'collector.rajkot@nic.in',
      role: 'DISTRICT_COLLECTOR',
      action: 'TRIGGER_INTERVENTION',
      entity: 'Project NH-GJ-2026-001',
      details: 'Scheduled Fast-Track Lok Adalat Bench for Parcel 1042 title settlement',
      ip: '10.14.82.11',
      hash: '9f83a81b2c4d5e6f7a8b9c0d1e2f3a4b',
      status: 'VERIFIED'
    },
    {
      id: 'AUD-9920',
      timestamp: '2026-03-11 14:18:02 IST',
      user: 'state.nodal@gujarat.gov.in',
      role: 'STATE_NODAL',
      action: 'APPROVE_AWARD',
      entity: 'Khasra P-1038 / Ralol',
      details: 'Approved Section 23 Award calculation of ₹3.64 Cr (100% solatium verified)',
      ip: '10.22.44.89',
      hash: '4c2189eed5a6b7c8d9e0f1a2b3c4d5e6',
      status: 'VERIFIED'
    },
    {
      id: 'AUD-9919',
      timestamp: '2026-03-11 11:05:40 IST',
      user: 'field.surveyor@nlams.gov.in',
      role: 'FIELD_SURVEYOR',
      action: 'UPLOAD_GEOJSON',
      entity: 'Village Bamanbore Cadastral Survey',
      details: 'Uploaded 52 geo-referenced cadastral boundary polygons via mobile app (GPS Accuracy: 4.2m)',
      ip: '172.16.8.4',
      hash: '3d55b004e5f60718293a4b5c6d7e8f90',
      status: 'VERIFIED'
    },
    {
      id: 'AUD-9918',
      timestamp: '2026-03-10 17:30:19 IST',
      user: 'central.admin@mord.gov.in',
      role: 'CENTRAL_ADMIN',
      action: 'PFMS_SYNC',
      entity: 'National PFMS Gateway',
      details: 'Reconciled 18,420 direct benefit transfer records across 4 states',
      ip: '10.0.1.55',
      hash: '8a1293aa1b2c3d4e5f60718293a4b5c6',
      status: 'VERIFIED'
    },
    {
      id: 'AUD-9917',
      timestamp: '2026-03-10 09:12:33 IST',
      user: 'system.ai@nlams.gov.in',
      role: 'SYSTEM_AI',
      action: 'EARLY_WARNING_DISPATCH',
      entity: 'Project MH-RAIL-2026-014',
      details: 'Triggered Critical Alert: Section 19 declaration approaching 12-month statutory expiry',
      ip: '127.0.0.1',
      hash: '7e44cf21a1b2c3d4e5f60718293a4b5c',
      status: 'VERIFIED'
    },
    {
      id: 'AUD-9916',
      timestamp: '2026-03-09 15:20:11 IST',
      user: 'cala.surendranagar@gujarat.gov.in',
      role: 'DISTRICT_COLLECTOR',
      action: 'REVIEW_FIELD_INSPECTION',
      entity: 'Khasra 1042 / Limbdi',
      details: 'Reviewed and Approved field ground truthing dossier with 12m boundary discrepancy recorded',
      ip: '10.14.82.14',
      hash: '2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e',
      status: 'VERIFIED'
    }
  ];

  const filtered = logs.filter(l => {
    const matchSearch =
      l.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === 'ALL' || l.role === filterRole;
    return matchSearch && matchRole;
  });

  const exportCsv = () => {
    const headers = ['Log ID,Timestamp,User,Role,Action,Entity,Details,IP,Hash,Status'];
    const rows = filtered.map(l =>
      `"${l.id}","${l.timestamp}","${l.user}","${l.role}","${l.action}","${l.entity}","${l.details}","${l.ip}","${l.hash}","${l.status}"`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nlams_audit_trail_${Date.now()}.csv`;
    a.click();
  };

  const copyHash = (hash, id) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                Tamper-Evident Governance Trail
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Immutable Cryptographic Ledger
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#0b2545] font-serif">
              National Land Acquisition Audit & Compliance Logs
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Immutable log entries recording every administrative award, GIS boundary update, PFMS DBT disbursal, and AI intervention.
            </p>
          </div>

          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 bg-[#0b2545] hover:bg-[#1e3a8a] text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Trail (CSV)</span>
          </button>
        </div>

        {/* 4 Summary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Total Sealed Events</div>
            <div className="text-xl font-black text-[#0b2545] mt-0.5">18,420 Logs</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Zero Tamper Exceptions</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Award Actions Sealed</div>
            <div className="text-xl font-black text-blue-900 mt-0.5">1,240 Awards</div>
            <div className="text-[10px] text-blue-700 font-semibold mt-0.5">100% Solatium Audited</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Field Inspections Logged</div>
            <div className="text-xl font-black text-purple-900 mt-0.5">3,892 Inspections</div>
            <div className="text-[10px] text-purple-700 font-semibold mt-0.5">Geotagged & EXIF Validated</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Integrity Ledger Health</div>
            <div className="text-xl font-black text-emerald-900 mt-0.5">100.0%</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Cryptographic Chain Intact</div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-grow max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by User, Action, Entity, or Event Description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Roles</option>
            <option value="CENTRAL_ADMIN">Central Admin</option>
            <option value="STATE_NODAL">State Nodal</option>
            <option value="DISTRICT_COLLECTOR">District Collector / CALA</option>
            <option value="FIELD_SURVEYOR">Field Surveyor</option>
            <option value="SYSTEM_AI">System AI</option>
          </select>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Event ID & Time</th>
                <th className="py-3 px-4">Officer & Role</th>
                <th className="py-3 px-4">Action & Entity</th>
                <th className="py-3 px-4">Operational Details</th>
                <th className="py-3 px-4">IP & Cryptographic Hash</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono text-blue-700 font-bold">{log.id}</span>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {log.timestamp}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 leading-tight">{log.user}</div>
                    <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded mt-0.5">
                      {log.role}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{log.action}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{log.entity}</div>
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <p className="text-slate-700 line-clamp-2 leading-relaxed">
                      {log.details}
                    </p>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-[10px] text-slate-500 font-mono">IP: {log.ip}</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <code className="font-mono text-[9px] text-slate-600 bg-slate-100 px-1 py-0.2 rounded border border-slate-200">
                        {log.hash.substring(0, 8)}...{log.hash.substring(24)}
                      </code>
                      <button
                        onClick={() => copyHash(log.hash, log.id)}
                        className="text-slate-400 hover:text-blue-600 p-0.5"
                        title="Copy Hash"
                      >
                        {copiedId === log.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
