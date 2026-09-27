import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Download, CheckCircle2, ShieldCheck, BarChart3, Calendar } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function PublicReportsPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await axios.get(`${API_BASE}/public/reports`);
        setReports(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    loadReports();
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Transparency Reports & Disclosures</h2>
          <p className="text-xs text-slate-500">
            Open government data releases under the National Land Governance Framework
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Open Data Compliance</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reports.map((r, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">{r.report_id}</span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{r.published_date}</span>
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 leading-snug">{r.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{r.summary}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Official Release
              </span>
              <button
                onClick={() => alert(`Downloading official transparency disclosure: ${r.title}`)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
              >
                <Download className="w-3 h-3 text-amber-400" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
