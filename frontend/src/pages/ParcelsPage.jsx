import React, { useState, useEffect } from 'react';
import { 
  Grid, Search, Filter, AlertTriangle, CheckCircle2, 
  MapPin, Eye, ExternalLink, ShieldCheck, Download, ChevronRight, X
} from 'lucide-react';
import { api } from '../services/api';

export default function ParcelsPage({ onSelectProject, onOpenGis }) {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKhasra, setSearchKhasra] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedParcel, setSelectedParcel] = useState(null);

  useEffect(() => {
    const fetchParcels = async () => {
      setLoading(true);
      try {
        const data = await api.getParcels('ALL', searchKhasra);
        setParcels(data);
        // Auto select 1042
        const k1042 = data.find(p => p.khasra_number === '1042') || data[0];
        setSelectedParcel(k1042);
      } catch (err) {
        console.error('Error fetching parcels:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchParcels();
  }, [searchKhasra]);

  const filteredParcels = parcels.filter(p => {
    if (riskFilter !== 'ALL' && p.risk_level !== riskFilter) return false;
    if (statusFilter !== 'ALL' && p.acquisition_status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. HEADER BANNER */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded">
              Cadastral Registry
            </span>
            <span className="text-xs text-slate-500 font-medium">• Geo-referenced Land Parcels</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-serif tracking-tight">
            National Cadastral Parcel Registry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            52 mapped cadastral parcels with ownership, compensation, legal stays, and ground verification status
          </p>
        </div>

        <button
          onClick={onOpenGis}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>View on GIS Studio</span>
        </button>
      </div>

      {/* 2. FILTER & SEARCH BAR */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Khasra Number (e.g. 1042), Village, Parcel ID..."
            value={searchKhasra}
            onChange={(e) => setSearchKhasra(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-bold">Risk:</span>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-bold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="Under Process">Under Process</option>
            <option value="Acquired">Acquired</option>
            <option value="Disputed">Disputed</option>
          </select>
        </div>
      </div>

      {/* 3. PARCEL LIST + DETAIL DRAWER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table list: 8 cols */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-3">Parcel ID</th>
                  <th className="py-2.5 px-3">Khasra #</th>
                  <th className="py-2.5 px-3">Village</th>
                  <th className="py-2.5 px-3">Area (Ha)</th>
                  <th className="py-2.5 px-3">Owners</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Ground Checked</th>
                  <th className="py-2.5 px-3">Risk Level</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredParcels.map((p) => {
                  const is1042 = p.khasra_number === '1042';
                  const isSelected = selectedParcel?.id === p.id;
                  return (
                    <tr 
                      key={p.id}
                      onClick={() => setSelectedParcel(p)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/70 border-l-4 border-blue-600' : (is1042 ? 'bg-rose-50/40 hover:bg-rose-50/70' : 'hover:bg-slate-50')
                      }`}
                    >
                      <td className="py-3 px-3 font-mono text-slate-900">{p.id}</td>
                      <td className="py-3 px-3 font-extrabold text-slate-900">
                        {p.khasra_number}
                        {is1042 && <span className="ml-1 text-[8px] bg-rose-200 text-rose-900 px-1 rounded font-black">EXEMPLAR</span>}
                      </td>
                      <td className="py-3 px-3 text-slate-600">{p.village}</td>
                      <td className="py-3 px-3 font-mono">{p.area_ha}</td>
                      <td className="py-3 px-3">{p.owner_name} ({p.owner_count})</td>
                      <td className="py-3 px-3">{p.acquisition_status}</td>
                      <td className="py-3 px-3">
                        {p.field_verified ? (
                          <span className="text-emerald-700 font-bold">✓ Verified</span>
                        ) : (
                          <span className="text-slate-400">Pending</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          p.risk_level === 'Critical' || p.risk_level === 'High' ? 'bg-rose-100 text-rose-900' : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {p.risk_level}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedParcel(p);
                          }}
                          className="px-2 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded text-[10px] font-bold transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Parcel Dossier: 4 cols */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          {!selectedParcel ? (
            <div className="p-8 text-center text-xs text-slate-400">Select a parcel from the table to view cadastral dossier.</div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <div className="text-base font-black text-slate-900 font-serif flex items-center gap-1.5">
                    <span>Khasra {selectedParcel.khasra_number}</span>
                    {selectedParcel.khasra_number === '1042' && (
                      <span className="text-[9px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-black">EXEMPLAR</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">ID: {selectedParcel.id}</div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  selectedParcel.risk_level === 'Critical' || selectedParcel.risk_level === 'High' ? 'bg-rose-100 text-rose-900' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {selectedParcel.risk_level} Risk
                </span>
              </div>

              <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                <div className="flex justify-between">
                  <span>Village / Taluka:</span>
                  <span className="font-bold text-slate-900">{selectedParcel.village} • {selectedParcel.taluka}</span>
                </div>
                <div className="flex justify-between">
                  <span>District / State:</span>
                  <span className="font-bold text-slate-900">{selectedParcel.district} • {selectedParcel.state}</span>
                </div>
                <div className="flex justify-between">
                  <span>Registered Area:</span>
                  <span className="font-bold text-slate-900">{selectedParcel.area_ha} Ha</span>
                </div>
                <div className="flex justify-between">
                  <span>Registered Owners:</span>
                  <span className="font-bold text-slate-900">{selectedParcel.owner_name} ({selectedParcel.owner_count})</span>
                </div>
                <div className="flex justify-between">
                  <span>Land Classification:</span>
                  <span className="font-bold text-slate-900">{selectedParcel.land_type}</span>
                </div>
              </div>

              {/* Ground Inspection Bridge */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Ground Inspection Verification</h4>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span>Field Verified:</span>
                    <span className="font-bold text-emerald-700">
                      {selectedParcel.field_verified ? '✓ Completed on Ground' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Surveyor Name:</span>
                    <span className="font-bold text-slate-900">{selectedParcel.field_officer || 'Amit B. Parmar'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GPS Coordinates:</span>
                    <span className="font-mono text-slate-800">22.3862° N, 71.0676° E</span>
                  </div>
                </div>
              </div>

              {/* Legal Dispute Status */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Legal Litigation</h4>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 space-y-1">
                  <div className="font-bold">Status: {selectedParcel.legal_status}</div>
                  <div className="text-[11px] text-amber-800">Case No: {selectedParcel.legal_case_no || 'None'}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <button
                  onClick={() => onSelectProject(selectedParcel.project_id || 'NH-GJ-2026-001')}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  Inspect Corridor Dossier
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
