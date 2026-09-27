import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Search, ChevronRight, ArrowLeft } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function StateDistrictsPage() {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [districtDetail, setDistrictDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const userStr = localStorage.getItem('nlams_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const stateName = user?.state || 'Gujarat';

  const token = localStorage.getItem('nlams_token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    async function loadDistricts() {
      try {
        const res = await axios.get(`${API_BASE}/admin/state/districts?state_name=${encodeURIComponent(stateName)}`, { headers });
        setDistricts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDistricts();
  }, [stateName]);

  const handleSelectDistrict = async (dName) => {
    setSelectedDistrict(dName);
    setDistrictDetail(null);
    try {
      const res = await axios.get(`${API_BASE}/admin/state/districts/${encodeURIComponent(dName)}?state_name=${encodeURIComponent(stateName)}`, { headers });
      setDistrictDetail(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-slate-400">Loading {stateName} districts...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white">{stateName} State Districts Directory</h2>
          <p className="text-xs text-slate-400">District land acquisition records and revenue divisions</p>
        </div>
        {selectedDistrict && (
          <button
            onClick={() => { setSelectedDistrict(null); setDistrictDetail(null); }}
            className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 font-bold hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to All Districts</span>
          </button>
        )}
      </div>

      {!selectedDistrict ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {districts.map((d) => (
            <div
              key={d.district}
              onClick={() => handleSelectDistrict(d.district)}
              className="bg-slate-800/80 hover:bg-slate-800 p-5 rounded-2xl border border-slate-700 hover:border-emerald-500 cursor-pointer transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                  {d.district}
                </h3>
                <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-mono text-xs">
                  {d.projects_count} Project{d.projects_count > 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Progress:</span>
                  <span className="text-emerald-400 font-bold">{d.land_acquired_ha} / {d.land_required_ha} ha</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-1.5 rounded-full" 
                    style={{ width: `${Math.min(d.progress_pct, 100)}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
                <span>Legal Cases: {d.legal_cases}</span>
                <span className="text-emerald-400 font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Inspect</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {districtDetail ? (
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 pb-4">
                <div>
                  <h3 className="text-2xl font-black text-white">{districtDetail.district} District</h3>
                  <p className="text-xs text-slate-400">Jurisdiction: {districtDetail.state} State Revenue Division</p>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-3 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700 font-semibold">
                    {districtDetail.parcels_count} Cadastral Parcels
                  </span>
                  <span className="px-3 py-1 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-700 font-semibold">
                    {districtDetail.progress_pct}% Acquired
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white">Active Corridors in {districtDetail.district}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {districtDetail.projects.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono text-slate-400">{p.project_code}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/60 text-emerald-300">
                          {p.current_stage}
                        </span>
                      </div>
                      <h5 className="font-bold text-sm text-white">{p.name}</h5>
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
            <div className="p-8 text-center text-xs text-slate-400">Loading district detail...</div>
          )}
        </div>
      )}
    </div>
  );
}
