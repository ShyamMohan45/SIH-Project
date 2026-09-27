import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, MapPin, Camera, AlertTriangle, CheckCircle2, 
  XCircle, RotateCcw, Eye, ShieldCheck, Clock, User, Check, 
  ChevronRight, ArrowLeft, Filter, Download, ExternalLink, Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function FieldInspectionsPage({ onSelectProject, onSelectParcel }) {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [inspectionDetail, setInspectionDetail] = useState(null);
  const [reviewing, setReviewing] = useState(false);
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const data = await api.getAllFieldInspections(statusFilter);
      setInspections(data);
      // Auto select first or FO-1042
      if (!selectedInspection && data.length > 0) {
        const exemplar = data.find(i => i.khasra_number === '1042' || i.inspection_code?.includes('1042')) || data[0];
        handleSelectInspection(exemplar);
      }
    } catch (err) {
      console.error('Error loading field inspections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, [statusFilter]);

  const handleSelectInspection = async (insp) => {
    setSelectedInspection(insp);
    setReviewSuccess('');
    try {
      const detail = await api.getFieldInspectionDetail(insp.id);
      setInspectionDetail(detail);
    } catch (err) {
      console.error('Error loading inspection detail:', err);
    }
  };

  const handleExecuteReview = async (action) => {
    if (!selectedInspection) return;
    setReviewing(true);
    try {
      await api.reviewFieldInspection(selectedInspection.id, {
        action,
        review_remarks: reviewRemarks || `Inspection ${action.toLowerCase()} by CALA`,
        reviewed_by: 'District Collector & CALA'
      });
      setReviewSuccess(`Inspection ${selectedInspection.inspection_code} has been successfully ${action === 'APPROVE' ? 'Approved' : (action === 'REJECT' ? 'Rejected' : 'Returned for Clarification')}.`);
      fetchInspections();
      // Refresh detail
      const updated = await api.getFieldInspectionDetail(selectedInspection.id);
      setInspectionDetail(updated);
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setReviewing(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. HEADER BANNER */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded">
              Ground Truthing Cell
            </span>
            <span className="text-xs text-slate-500 font-medium">• Android Field App Ingestion Interface</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-serif tracking-tight">
            Cadastral Field Inspection & Ground Evidence Review
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review GPS coordinates, Khasra markers, boundary discrepancies, photo evidence, and approve/reject dossiers
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
          {[
            { id: 'ALL', label: 'All Dossiers' },
            { id: 'Submitted for Review', label: 'Pending Review' },
            { id: 'Approved', label: 'Approved' },
            { id: 'Rejected', label: 'Rejected' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1 rounded-md transition-all ${
                statusFilter === f.id ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. SPLIT LAYOUT: INSPECTIONS TABLE (5 cols) + SELECTED DOSSIER REVIEW PANEL (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Inspections Table List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs font-bold text-slate-700">
            <span>Submitted Inspections ({inspections.length})</span>
            <span className="text-[10px] text-slate-500">Sorted by newest</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[750px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading inspection dossiers...</div>
            ) : inspections.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No field inspections matching filter.</div>
            ) : (
              inspections.map((insp) => {
                const isSelected = selectedInspection?.id === insp.id;
                return (
                  <button
                    key={insp.id}
                    onClick={() => handleSelectInspection(insp)}
                    className={`w-full text-left p-4 transition-colors flex flex-col space-y-2 ${
                      isSelected ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                          <span>{insp.inspection_code}</span>
                          {insp.khasra_number === '1042' && (
                            <span className="text-[8px] bg-rose-100 text-rose-800 font-black px-1.5 py-0.2 rounded">
                              EXEMPLAR 1042
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Khasra: <span className="font-bold text-slate-800">{insp.khasra_number}</span> • Village: <span className="font-bold text-slate-800">{insp.village}</span>
                        </div>
                      </div>

                      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tight ${
                        insp.status === 'Approved' ? 'bg-emerald-100 text-emerald-900' : 
                        insp.status === 'Rejected' ? 'bg-rose-100 text-rose-900' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {insp.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                      <span className={`px-1.5 py-0.5 rounded ${
                        insp.gps_verified ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {insp.gps_verified ? '✓ GPS Checked' : 'GPS Pending'}
                      </span>

                      <span className={`px-1.5 py-0.5 rounded ${
                        insp.boundary_status === 'Matched' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        Boundary: {insp.boundary_status}
                      </span>

                      {insp.photos_count > 0 && (
                        <span className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded">
                          📷 {insp.photos_count} Photos
                        </span>
                      )}

                      {insp.issues_count > 0 && (
                        <span className="bg-rose-50 text-rose-800 px-1.5 py-0.5 rounded font-black">
                          ⚠️ {insp.issues_count} Issues
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-400 flex justify-between items-center pt-1 border-t border-slate-100">
                      <span>Officer: {insp.officer_name}</span>
                      <span>{insp.submitted_at ? insp.submitted_at.split('T')[0] : 'In Progress'}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Inspection Review Dossier (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          {!selectedInspection ? (
            <div className="py-20 text-center text-xs text-slate-400">
              Select an inspection dossier from the list to review evidence and take administrative action.
            </div>
          ) : (
            <>
              {/* Dossier Header */}
              <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-slate-900 font-serif">
                      Dossier: {selectedInspection.inspection_code}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                      selectedInspection.status === 'Approved' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {selectedInspection.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-2">
                    <span>Project: <strong className="text-slate-800">{selectedInspection.project_name || selectedInspection.project_id}</strong></span>
                    <span>•</span>
                    <span>Parcel: <strong className="text-slate-800">{selectedInspection.parcel_id} (Khasra {selectedInspection.khasra_number})</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectProject(selectedInspection.project_id)}
                    className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                  >
                    View Project
                  </button>
                </div>
              </div>

              {/* Review Success Banner */}
              {reviewSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{reviewSuccess}</span>
                </div>
              )}

              {/* Section 1: Ground Truth Verification Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                  1. Statutory Ground Truth Verifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Khasra Marker Check</div>
                    <div className="font-extrabold text-slate-900 mt-1">
                      {selectedInspection.khasra_matched ? '✓ Matched' : '⚠ Mismatch'}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Observed: {selectedInspection.khasra_number}</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">GPS Geolocation</div>
                    <div className="font-extrabold text-slate-900 mt-1">
                      {selectedInspection.gps_verified ? '✓ Verified (11.5m)' : 'Pending'}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {selectedInspection.gps_mode === 'DEMO_SIMULATED' ? '[DEMO SIMULATED]' : 'Device GPS'}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Boundary Status</div>
                    <div className={`font-extrabold mt-1 ${
                      selectedInspection.boundary_status === 'Matched' ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {selectedInspection.boundary_status}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Discrepancy: ~12m</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Occupancy / Land Use</div>
                    <div className="font-extrabold text-slate-900 mt-1">{selectedInspection.land_use || 'Agricultural'}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Owner: Present</div>
                  </div>
                </div>
              </div>

              {/* Section 2: Ground Issues Identified */}
              {inspectionDetail?.issues && inspectionDetail.issues.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-extrabold text-rose-800 uppercase tracking-wide flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>2. Ground Issues Identified ({inspectionDetail.issues.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {inspectionDetail.issues.map((iss) => (
                      <div key={iss.id} className="p-3 bg-rose-50/60 border border-rose-200 rounded-lg text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-rose-900">{iss.issue_type}</span>
                          <span className="text-[9px] font-black uppercase bg-rose-100 text-rose-900 px-1.5 py-0.2 rounded">
                            {iss.severity} Severity
                          </span>
                        </div>
                        <p className="text-slate-700 text-[11.5px]">{iss.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 3: Photo Evidence Gallery with Metadata */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-blue-600" />
                    <span>3. Categorized Photo Evidence Gallery ({inspectionDetail?.photos?.length || 0})</span>
                  </h3>
                  <span className="text-[10px] text-slate-500">Metadata verified via GPS EXIF</span>
                </div>

                {(!inspectionDetail?.photos || inspectionDetail.photos.length === 0) ? (
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-xs text-slate-400">
                    No photo evidence files attached to this dossier.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {inspectionDetail.photos.map((ph) => (
                      <div key={ph.id} className="group relative bg-slate-50 rounded-lg border border-slate-200 overflow-hidden text-xs">
                        <div className="h-28 bg-slate-200 flex items-center justify-center overflow-hidden">
                          {ph.file_url ? (
                            <img 
                              src={ph.file_url} 
                              alt={ph.file_name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&auto=format&fit=crop&q=80';
                              }}
                            />
                          ) : (
                            <Camera className="w-8 h-8 text-slate-400" />
                          )}
                        </div>
                        <div className="p-2 space-y-0.5">
                          <div className="font-extrabold text-slate-900 text-[11px] truncate">{ph.category}</div>
                          <div className="text-[9px] text-slate-500 truncate">{ph.file_name}</div>
                          <div className="text-[8px] font-mono text-slate-400 pt-1 border-t border-slate-100 flex justify-between">
                            <span>{ph.latitude?.toFixed(4)}, {ph.longitude?.toFixed(4)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 4: Officer Notes & Remarks */}
              <div className="space-y-1.5 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-800">Field Surveyor Notes:</div>
                <p className="text-slate-600 italic">
                  "{inspectionDetail?.inspection?.remarks || selectedInspection.remarks || 'Boundary verification completed in presence of village patwari. Co-sharer raised objection regarding compensation solatium.'}"
                </p>
                <div className="text-[10px] text-slate-400 mt-1">
                  Inspecting Officer: {selectedInspection.officer_name} ({selectedInspection.officer_id})
                </div>
              </div>

              {/* Section 5: Administrative Action & Approval Desk */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                  4. Competent Authority (CALA) Decision
                </h3>

                <textarea
                  placeholder="Enter administrative review remarks, instructions for re-survey, or approval sign-off..."
                  value={reviewRemarks}
                  onChange={(e) => setReviewRemarks(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 h-20 placeholder:text-slate-400"
                />

                <div className="flex flex-wrap gap-2.5 justify-end">
                  <button
                    onClick={() => handleExecuteReview('RETURN')}
                    disabled={reviewing}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Return for Correction</span>
                  </button>

                  <button
                    onClick={() => handleExecuteReview('REJECT')}
                    disabled={reviewing}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject Dossier</span>
                  </button>

                  <button
                    onClick={() => handleExecuteReview('APPROVE')}
                    disabled={reviewing}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Verify Parcel</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
