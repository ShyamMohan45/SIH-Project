import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, X, FolderCheck, Grid, ClipboardCheck, AlertTriangle, 
  ArrowRight, ExternalLink, ShieldCheck, MapPin
} from 'lucide-react';
import { api } from '../../services/api';

export default function GlobalSearchModal({ 
  isOpen, 
  onClose, 
  onNavigateToProject, 
  onNavigateToParcel,
  onNavigateToInspection
}) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ projects: [], parcels: [], inspections: [], issues: [] });
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ projects: [], parcels: [], inspections: [], issues: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ projects: [], parcels: [], inspections: [], issues: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await api.globalSearch(query);
      setResults(res.results || { projects: [], parcels: [], inspections: [], issues: [] });
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const totalResults = 
    results.projects.length + 
    results.parcels.length + 
    results.inspections.length + 
    results.issues.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col font-sans">
        {/* Search Header Bar */}
        <div className="p-3.5 border-b border-slate-200 flex items-center gap-3 bg-slate-50/70">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Project ID, Khasra 1042, Village Limbdi, Inspection Code..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 text-sm font-semibold focus:outline-none placeholder:text-slate-400"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 hover:bg-slate-200 rounded-md text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
            ESC
          </kbd>
        </div>

        {/* Search Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {loading && (
            <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2 font-medium">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Searching N-LAMS national repository...</span>
            </div>
          )}

          {!loading && query && totalResults === 0 && (
            <div className="py-10 text-center text-xs text-slate-500 font-medium">
              No matching projects, parcels, or inspections found for <span className="font-bold text-slate-800">"{query}"</span>
            </div>
          )}

          {!query && (
            <div className="py-6 px-4 text-xs text-slate-500 space-y-3">
              <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Quick Demonstrations:</div>
              <div className="flex flex-wrap gap-2">
                {['1042', 'Ahmedabad', 'FO-1042', 'Limbdi', 'Owner dispute', 'P-1038'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-md text-xs font-semibold text-slate-700 transition-colors border border-slate-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 1. Projects Section */}
          {results.projects.length > 0 && (
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <FolderCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Projects ({results.projects.length})</span>
              </div>
              <div className="space-y-1">
                {results.projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onNavigateToProject(p.id);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                        <span>{p.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">({p.id})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {p.state} • {p.district}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Open Project <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. Parcels Section */}
          {results.parcels.length > 0 && (
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cadastral Parcels ({results.parcels.length})</span>
              </div>
              <div className="space-y-1">
                {results.parcels.map((pcl) => (
                  <button
                    key={pcl.id}
                    onClick={() => {
                      onNavigateToParcel(pcl);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                        <span>Khasra {pcl.khasra_number}</span>
                        <span className="text-[10px] font-mono text-slate-400">({pcl.id})</span>
                        {pcl.khasra_number === '1042' && (
                          <span className="text-[9px] bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.2 rounded">
                            EXEMPLAR PARCEL
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Village: {pcl.village} • District: {pcl.district}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Inspect Parcel <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Field Inspections Section */}
          {results.inspections.length > 0 && (
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <ClipboardCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Field Inspections ({results.inspections.length})</span>
              </div>
              <div className="space-y-1">
                {results.inspections.map((insp) => (
                  <button
                    key={insp.id}
                    onClick={() => {
                      onNavigateToInspection(insp.id);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                        <span>{insp.code}</span>
                        <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                          {insp.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Parcel: {insp.parcel_id} • Officer: {insp.officer}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-800 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Review Dossier <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center px-4">
          <span>Search across 10 corridors, 52 parcels, and field inspection dossiers</span>
          <span className="font-mono text-[10px] text-slate-400">Ctrl+K</span>
        </div>
      </div>
    </div>
  );
}
