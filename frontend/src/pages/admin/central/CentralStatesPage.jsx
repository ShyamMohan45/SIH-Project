import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Globe, Building2, MapPin, Search, ChevronRight, ArrowLeft } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function CentralStatesPage() {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [stateDetail, setStateDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('nlams_token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    async function loadStates() {
      try {
        const res = await axios.get(`${API_BASE}/admin/central/states`, { headers });
        setStates(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStates();
  }, []);

  const handleSelectState = async (stName) => {
    setSelectedState(stName);
    setStateDetail(null);
    try {
      const res = await axios.get(`${API_BASE}/admin/central/states/${encodeURIComponent(stName)}`, { headers });
      setStateDetail(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-slate-400">Loading All-India states data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white">All-India States & UTs Acquisition Matrix</h2>
          <p className="text-xs text-slate-400">National Central Administrator review and state performance drilldown</p>
        </div>
        {selectedState && (
          <button
            onClick={() => { setSelectedState(null); setStateDetail(null); }}
            className="inline-flex items-center space-x-1.5 text-xs text-indigo-400 font-bold hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to All States List</span>
          </button>
        )}
      </div>

      {!selectedState ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {states.map((st) => (
            <div
              key={st.state}
              onClick={() => handleSelectState(st.state)}
              className="bg-slate-800/80 hover:bg-slate-800 p-5 rounded-2xl border border-slate-700 hover:border-indigo-500 cursor-pointer transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition">
                  {st.state}
                </h3>
                <span className="px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 font-mono text-xs">
                  {st.projects_count} Projects
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Land Acquired:</span>
                  <span className="text-emerald-400 font-bold">{st.land_acquired_ha} / {st.land_required_ha} ha</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-1.5 rounded-full" 
                    style={{ width: `${Math.min(st.progress_pct, 100)}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
                <span>Districts: {st.districts_count}</span>
                <span className="text-indigo-400 font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Inspect</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {stateDetail ? (
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 pb-4">
                <div>
                  <h3 className="text-2xl font-black text-white">{stateDetail.state} State Operations</h3>
                  <p className="text-xs text-slate-400">{stateDetail.state_officer}</p>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-3 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700 font-semibold">
                    {stateDetail.number_of_districts} Districts Involved
                  </span>
                  <span className="px-3 py-1 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-700 font-semibold">
                    {stateDetail.acquisition_progress_pct}% Completed
                  </span>
                </div>
              </div>

              {/* Projects in this state */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white">Projects in {stateDetail.state}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stateDetail.projects.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono text-slate-400">{p.project_code}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-900/60 text-indigo-300">
                          {p.current_stage}
                        </span>
                      </div>
                      <h5 className="font-bold text-sm text-white">{p.name}</h5>
                      <p className="text-xs text-slate-400">District: {p.district}</p>
                      <div className="pt-2 flex justify-between items-center text-xs">
                        <span className="text-slate-500">Progress: <strong>{p.progress_pct}%</strong></span>
                        <span className="text-amber-400 font-bold">Risk: {p.risk_level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">Loading state detail...</div>
          )}
        </div>
      )}
    </div>
  );
}
