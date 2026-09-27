import React, { useState, useEffect } from 'react';
import { 
  FolderCheck, Plus, Search, Filter, Download, ArrowRight, 
  Building2, MapPin, AlertTriangle, ShieldCheck, CheckCircle2, ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

export default function ProjectsPage({ onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New project form state
  const [newProject, setNewProject] = useState({
    name: '',
    project_type: 'Highway',
    state: 'Gujarat',
    district: '',
    land_required: '',
    affected_families: ''
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await api.getProjects(stateFilter, searchTerm);
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [stateFilter, searchTerm]);

  const handleAddProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createProject({
        name: newProject.name,
        project_type: newProject.project_type,
        state: newProject.state,
        district: newProject.district,
        land_required: parseFloat(newProject.land_required) || 500,
        affected_families: parseInt(newProject.affected_families) || 200
      });
      setIsAddModalOpen(false);
      setNewProject({ name: '', project_type: 'Highway', state: 'Gujarat', district: '', land_required: '', affected_families: '' });
      fetchProjects();
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const handleExportCSV = () => {
    if (projects.length === 0) return;
    const headers = ['Project ID', 'Project Name', 'Type', 'State', 'District', 'Land Required (Ha)', 'Land Acquired (Ha)', 'Progress %', 'Affected Families', 'Current Stage', 'Delay Days', 'Risk Level'];
    const rows = filteredProjects.map(p => [
      p.id,
      `"${p.name}"`,
      p.project_type,
      p.state,
      `"${p.district}"`,
      p.land_required,
      p.land_acquired,
      p.acquisition_pct,
      p.affected_families,
      p.current_stage,
      p.predicted_delay_days,
      p.risk_level
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NLAMS_Projects_Registry_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProjects = projects.filter(p => {
    if (typeFilter !== 'ALL' && p.project_type !== typeFilter) return false;
    if (riskFilter !== 'ALL' && p.risk_level !== riskFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. HEADER BANNER */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded">
              National Infrastructure Portfolio
            </span>
            <span className="text-xs text-slate-500 font-medium">• PS16 Corridor Monitoring</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-serif tracking-tight">
            National Land Acquisition Projects Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            10 multi-modal corridors under statutory acquisition across Highway, Freight, Renewable, and Port sectors
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold border border-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard Project</span>
          </button>
        </div>
      </div>

      {/* 2. FILTER & SEARCH BAR */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search input */}
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Project Name, Corridor Code (e.g. NH-GJ-2026-001)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>

        {/* State filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-bold">State:</span>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All States (10)</option>
            <option value="Gujarat">Gujarat (4)</option>
            <option value="Maharashtra">Maharashtra (2)</option>
            <option value="Uttar Pradesh">Uttar Pradesh (2)</option>
            <option value="Haryana">Haryana (2)</option>
          </select>
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-bold">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Sectors</option>
            <option value="Highway">Green Highways</option>
            <option value="Railway">Dedicated Freight</option>
            <option value="Port">Industrial & Port</option>
            <option value="Solar">Renewable Energy</option>
          </select>
        </div>

        {/* Risk filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-bold">Risk:</span>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* 3. PROJECTS MASTER DATA TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                <th className="py-3 px-3.5">Corridor Code</th>
                <th className="py-3 px-3.5">Project Name</th>
                <th className="py-3 px-3.5">Sector</th>
                <th className="py-3 px-3.5">State / District</th>
                <th className="py-3 px-3.5">Land Req. (Ha)</th>
                <th className="py-3 px-3.5">Acquired (Ha)</th>
                <th className="py-3 px-3.5">Progress %</th>
                <th className="py-3 px-3.5">Current Stage</th>
                <th className="py-3 px-3.5">Predicted Delay</th>
                <th className="py-3 px-3.5">AI Risk Level</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-xs text-slate-400">
                    Loading projects directory from central database...
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-xs text-slate-400">
                    No infrastructure corridors found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => {
                  const isExemplar = p.id === 'NH-GJ-2026-001';
                  return (
                    <tr key={p.id} className={`transition-colors ${isExemplar ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-slate-50'}`}>
                      <td className="py-3 px-3.5 font-mono text-[11px] font-bold text-slate-900">
                        {p.id}
                        {isExemplar && (
                          <span className="block text-[8px] font-black text-blue-700 uppercase">DEMO EXEMPLAR</span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 font-extrabold text-slate-900">
                        <button
                          onClick={() => onSelectProject(p.id)}
                          className="hover:text-blue-700 text-left"
                        >
                          {p.name}
                        </button>
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                          {p.project_type}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-slate-600">
                        {p.state} • <span className="font-semibold text-slate-800">{p.district}</span>
                      </td>
                      <td className="py-3 px-3.5 font-mono text-slate-900 font-bold">{p.land_required.toLocaleString()}</td>
                      <td className="py-3 px-3.5 font-mono text-emerald-800 font-bold">{p.land_acquired.toLocaleString()}</td>
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-emerald-600 h-1.5" style={{ width: `${p.acquisition_pct}%` }}></div>
                          </div>
                          <span className="font-extrabold text-[11px]">{p.acquisition_pct}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-semibold text-[10px]">
                          {p.current_stage}
                        </span>
                      </td>
                      <td className="py-3 px-3.5">
                        <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                          p.predicted_delay_days > 40 ? 'text-rose-700 bg-rose-50 border border-rose-200' :
                          p.predicted_delay_days > 20 ? 'text-amber-700 bg-amber-50' : 'text-slate-600'
                        }`}>
                          +{p.predicted_delay_days}d
                        </span>
                      </td>
                      <td className="py-3 px-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          p.risk_level === 'CRITICAL' ? 'bg-rose-100 text-rose-900 border border-rose-300' :
                          p.risk_level === 'HIGH' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                          'bg-emerald-100 text-emerald-900'
                        }`}>
                          {p.risk_level} ({p.risk_score}%)
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <button
                          onClick={() => onSelectProject(p.id)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold shadow-2xs transition-colors flex items-center gap-1 ml-auto"
                        >
                          <span>Open Dossier</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. ADD PROJECT ONBOARDING MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 text-xs font-sans">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 font-serif">Onboard New Acquisition Corridor</h3>
                <p className="text-[11px] text-slate-500">Initiate Section 4 Social Impact Assessment Proposal</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProjectSubmit} className="space-y-3.5">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Corridor Project Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Vadodara–Mumbai Expressway Package 4"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Infrastructure Sector</label>
                  <select
                    value={newProject.project_type}
                    onChange={(e) => setNewProject({ ...newProject, project_type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none"
                  >
                    <option value="Highway">National Highway</option>
                    <option value="Railway">Dedicated Freight Corridor</option>
                    <option value="Port">Industrial & Port</option>
                    <option value="Solar">Renewable Energy Park</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">State Jurisdiction</label>
                  <select
                    value={newProject.state}
                    onChange={(e) => setNewProject({ ...newProject, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none"
                  >
                    <option value="Gujarat">Gujarat</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Haryana">Haryana</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">District(s) *</label>
                  <input
                    type="text"
                    placeholder="e.g. Surat, Bharuch"
                    value={newProject.district}
                    onChange={(e) => setNewProject({ ...newProject, district: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Land Required (Hectares) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 1450"
                    value={newProject.land_required}
                    onChange={(e) => setNewProject({ ...newProject, land_required: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Estimated Project Affected Families (PAFs)</label>
                <input
                  type="number"
                  placeholder="e.g. 1850"
                  value={newProject.affected_families}
                  onChange={(e) => setNewProject({ ...newProject, affected_families: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs transition-colors"
                >
                  Save & Register Corridor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
