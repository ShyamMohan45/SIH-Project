import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Building2, MapPin, Calendar, FileText, CheckCircle2, 
  ArrowLeft, ShieldCheck, AlertCircle, Clock, ExternalLink 
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function PublicProjectDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDetail() {
      try {
        const res = await axios.get(`${API_BASE}/public/projects/${id}`);
        setData(res.data);
      } catch (err) {
        setError('Project details not available or not designated for public disclosure.');
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-xs text-slate-500">Loading statutory disclosure...</div>;
  if (error || !data) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm text-rose-600">{error || 'Not found'}</p>
        <Link to="/public/projects" className="text-xs text-indigo-600 font-bold underline">
          &larr; Return to Disclosed Projects Directory
        </Link>
      </div>
    );
  }

  const p = data.project || data;
  const milestones = data.milestones || [];
  const notices = data.public_notices || [];
  const parcels = data.parcels || [];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/public/projects" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Disclosed Projects</span>
      </Link>

      {/* Project Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs">
              {p.project_type}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono text-xs">
              {p.project_code}
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            Status: {p.status}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{p.name}</h1>

        <div className="flex flex-wrap gap-4 text-xs text-slate-600">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>State: <strong>{p.state}</strong></span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>Districts: <strong>{p.district}</strong></span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Target Completion: <strong>{p.target_date || '2027-03-31'}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div>
            <span className="text-[11px] text-slate-500 font-semibold uppercase">Total Land Required</span>
            <p className="text-xl font-black text-slate-900">{p.land_required_ha} ha</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold uppercase">Total Land Acquired</span>
            <p className="text-xl font-black text-emerald-700">{p.land_acquired_ha} ha</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold uppercase">Current Stage</span>
            <p className="text-xl font-black text-indigo-700">{p.current_stage}</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold uppercase">Overall Progress</span>
            <p className="text-xl font-black text-slate-900">{p.progress_pct}%</p>
          </div>
        </div>
      </div>

      {/* Statutory Milestones Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">RFCTLARR Statutory Workflow Milestones</h3>
        <p className="text-xs text-slate-500">Legal progression through statutory clearance gates</p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {milestones.map((m, idx) => (
            <div key={idx} className={`p-3 rounded-xl border text-xs ${
              m.status === 'COMPLETED' ? 'bg-emerald-50 border-emerald-200' :
              m.status === 'IN_PROGRESS' ? 'bg-amber-50 border-amber-300' :
              'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[10px] uppercase">{m.status}</span>
                {m.status === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              <p className="font-bold text-slate-900">{m.stage}</p>
              <p className="text-[10px] text-slate-500 mt-1">Planned: {m.planned_date || 'N/A'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Publicly Disclosed Cadastral Parcels Table (Redacted PII) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">Disclosed Cadastral Parcels Schedule</h3>
            <p className="text-xs text-slate-500">
              Survey / Khasra numbers published in the official gazette. Personal landowner names and banking details are redacted pursuant to statutory privacy provisions.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 self-start sm:self-auto">
            PII Redacted
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Survey / Khasra No.</th>
                <th className="py-2.5 px-3">Village</th>
                <th className="py-2.5 px-3">Taluka</th>
                <th className="py-2.5 px-3">Area (ha)</th>
                <th className="py-2.5 px-3">Land Classification</th>
                <th className="py-2.5 px-3">Acquisition Stage</th>
                <th className="py-2.5 px-3">Possession</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {parcels.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-4 text-center text-slate-400 text-xs">
                    Parcels schedule undergoing digital revenue gazette verification.
                  </td>
                </tr>
              ) : (
                parcels.map(parc => (
                  <tr key={parc.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{parc.khasra_number}</td>
                    <td className="py-2.5 px-3">{parc.village}</td>
                    <td className="py-2.5 px-3">{parc.taluka || 'Limbdi'}</td>
                    <td className="py-2.5 px-3">{parc.area}</td>
                    <td className="py-2.5 px-3">{parc.land_type || 'Agricultural'}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold text-[10px]">
                        {parc.compensation_status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                        {parc.possession_status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Public Gazette Notices for this Project */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Official Gazette Notifications</h3>
        <p className="text-xs text-slate-500">Statutory publications related to this corridor</p>

        <div className="space-y-3">
          {notices.length === 0 ? (
            <p className="text-xs text-slate-400">No public gazette notices issued yet for this corridor.</p>
          ) : (
            notices.map(n => (
              <div key={n.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 uppercase">
                      {n.notice_type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-500">Issue Date: {n.issue_date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  <p className="text-xs text-slate-600">{n.summary}</p>
                </div>
                <a
                  href={`/api/public/notices/${n.id}/download`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 shrink-0"
                >
                  <span>Download Notice (PDF)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
