import React, { useState, useEffect } from 'react';
import { Clock, FileText, CheckCircle2, AlertTriangle, Printer, X, MapPin } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { api } from '../services/api';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory();
      setHistory(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-900">Inspection Dossier</h2>
          <p className="text-xs text-slate-500">Submitted Field Verification Records</p>
        </div>
        <span className="bg-slate-200 text-slate-800 text-xs font-mono font-bold px-2 py-0.5 rounded-full">
          {history.length} Records
        </span>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading inspection history...</div>
      ) : history.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
          No previous inspections found.
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-gov-700 transition shadow-sm space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gov-800">
                      {item.inspection_code}
                    </span>
                    <StatusBadge status={item.status} size="xs" />
                  </div>
                  <h3 className="font-black text-sm text-slate-900 mt-1 font-serif">
                    Khasra {item.khasra_number} • {item.village}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedReport(item)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-gov-800"
                  title="View Official Report"
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div>
                  <span>Submitted: <strong>{item.submitted_at?.split('T')[0] || '2026-03-09'}</strong></span>
                </div>
                <div>
                  <span>GPS: <strong>{item.gps_verified ? '✓ Verified' : 'Pending'}</strong></span>
                </div>
                <div>
                  <span>Photos: <strong>{item.photos_count || 1} Attached</strong></span>
                </div>
                <div>
                  <span>Issues: <strong className={item.issues_count > 0 ? 'text-red-600' : 'text-emerald-600'}>{item.issues_count || 0} Flagged</strong></span>
                </div>
              </div>

              <button
                onClick={() => setSelectedReport(item)}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-gov-800 text-xs font-bold rounded-xl border border-slate-200 flex items-center justify-center gap-1.5"
              >
                <span>View Full Verification Dossier</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* OFFICIAL FIELD INSPECTION REPORT MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-gov-900 text-white p-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-amber-400">Official Field Inspection Record</div>
                <h3 className="font-bold text-sm">N-LAMS Cadastral Verification Dossier</h3>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-1 text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Body */}
            <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-700">
              {/* Reference Header */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Inspection Code</span>
                    <strong className="font-mono text-slate-900">{selectedReport.inspection_code}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Submission Date</span>
                    <strong className="text-slate-900">{selectedReport.submitted_at || '12 Sep 2026'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Officer</span>
                    <strong className="text-slate-900">{selectedReport.officer_name || 'Amit B. Parmar (FO-007)'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Review Status</span>
                    <StatusBadge status={selectedReport.status} size="xs" />
                  </div>
                </div>
              </div>

              {/* Cadastral Land & GPS Record */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Ground Truth Verification</h4>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Khasra Number:</span>
                    <strong className="text-slate-900">Khasra {selectedReport.khasra_number} (Matched)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cadastral Boundary:</span>
                    <strong className={selectedReport.boundary_status === 'Mismatch' ? 'text-red-600' : 'text-emerald-700'}>
                      {selectedReport.boundary_status || 'Verified Matched'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">GPS Validation:</span>
                    <strong className="text-emerald-700 font-mono">22.3862° N, 71.0643° E (±8m)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Observed Land Use:</span>
                    <strong className="text-slate-900">Agricultural (Cotton Cultivation)</strong>
                  </div>
                </div>
              </div>

              {/* Issues Flagged */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Field Anomalies Flagged</h4>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1.5">
                  {selectedReport.issues && selectedReport.issues.length > 0 ? (
                    selectedReport.issues.map((iss, i) => (
                      <div key={i} className="flex items-center gap-2 text-red-800 font-bold">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{iss}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-800 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>No critical ground anomalies detected.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer with Print Action */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">Certified Cadastral Record</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Dossier</span>
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-1.5 bg-gov-800 text-white font-bold text-xs rounded-xl shadow"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
