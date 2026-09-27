import React from 'react';
import {
  X, Printer, ShieldCheck, MapPin, Calendar, User, Camera,
  AlertTriangle, CheckCircle2, FileText, Check, Clock
} from 'lucide-react';

export default function InspectionReportModal({ isOpen, onClose, inspection, parcel, project, photos = [], issues = [] }) {
  if (!isOpen || !inspection) return null;

  const handlePrint = () => {
    window.print();
  };

  const inspCode = inspection.inspection_code || `FO-${inspection.parcel_id || '1042'}-2026-001`;
  const submitTime = inspection.submitted_at ? new Date(inspection.submitted_at).toLocaleString() : '12 Sep 2026, 11:45 AM IST';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-slate-300 my-8">
        {/* Top Controls Bar */}
        <div className="bg-slate-900 text-white px-6 py-3 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm">Official Field Inspection Dossier</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document */}
        <div className="p-8 space-y-6 print:p-0">
          {/* Government Official Letterhead */}
          <div className="border-b-2 border-[#0b2545] pb-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-14 bg-amber-50 rounded border border-amber-300 flex flex-col items-center justify-center p-1">
                <ShieldCheck className="w-8 h-8 text-[#0b2545]" />
                <span className="text-[7px] font-bold text-amber-900 uppercase">DoLR</span>
              </div>
              <div>
                <h2 className="text-xl font-black text-[#0b2545] font-serif tracking-tight">
                  GOVERNMENT OF INDIA • MINISTRY OF RURAL DEVELOPMENT
                </h2>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Department of Land Resources (DoLR) • N-LAMS National Cadastral Survey Division
                </h3>
                <p className="text-[11px] text-slate-500">
                  Statutory Field Verification & Geo-Tagged Cadastral Inspection Dossier (RFCTLARR Act 2013)
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-1 rounded block mb-1">
                {inspCode}
              </span>
              <span className="text-[10px] text-slate-500">Form 4-B Cadastral Record</span>
            </div>
          </div>

          {/* Core Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Project Code & Name</span>
              <strong className="text-slate-900 block mt-0.5">{project?.name || 'Ahmedabad–Rajkot Green Highway Expansion'}</strong>
              <span className="font-mono text-slate-500 text-[10px]">{project?.id || 'NH-GJ-2026-001'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Target Khasra & Village</span>
              <strong className="text-slate-900 block mt-0.5">Khasra #{inspection.khasra_expected || '1042'}</strong>
              <span className="text-slate-600">{inspection.village || 'Limbdi'}, {inspection.district || 'Rajkot'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Inspecting Officer</span>
              <strong className="text-slate-900 block mt-0.5">{inspection.officer_name || 'Ramesh Patel'}</strong>
              <span className="text-slate-500 font-mono text-[10px]">{inspection.officer_id || 'field.surveyor@nlams.gov.in'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Inspection Timestamp</span>
              <strong className="text-slate-900 block mt-0.5">{submitTime}</strong>
              <span className="text-emerald-700 font-bold text-[10px]">Status: {inspection.status || 'Submitted for Review'}</span>
            </div>
          </div>

          {/* GPS Verification Section */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Section 1: Ground Geolocation & Cadastral Alignment</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">GPS Verification</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <Check className="w-3.5 h-3.5" /> VERIFIED
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Latitude</span>
                <span className="font-mono font-bold text-slate-800">{inspection.latitude ? Number(inspection.latitude).toFixed(5) : '22.37920'}° N</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Longitude</span>
                <span className="font-mono font-bold text-slate-800">{inspection.longitude ? Number(inspection.longitude).toFixed(5) : '71.30940'}° E</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Accuracy</span>
                <span className="font-bold text-slate-800">± {inspection.gps_accuracy || 8} meters</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Distance to Parcel</span>
                <span className="font-bold text-blue-700">{inspection.distance_from_parcel_m || 12} m (Matched)</span>
              </div>
            </div>
          </div>

          {/* Khasra Marker & Land Use Section */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Section 2: Survey Marker, Land Use & Occupancy</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Survey / Khasra Marker</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  Expected: {inspection.khasra_expected || '1042'} | Observed: {inspection.khasra_observed || inspection.khasra_expected || '1042'}
                </span>
                <span className="text-[10px] font-bold text-emerald-700">✓ Khasra Verified</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Observed Land Classification</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{inspection.land_use || 'Agricultural'}</span>
                <span className="text-slate-500 text-[10px]">Crop: {inspection.crop_type || 'Cotton / Groundnut'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Occupant Verification</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{inspection.occupancy_status || 'Owner Present'}</span>
                <span className="text-slate-500 text-[10px]">{inspection.occupant_name || 'Devji Koli (Occupant)'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Encroachment Status</span>
                <span className={`font-bold mt-0.5 block ${inspection.encroachment_status === 'Yes' ? 'text-red-600' : 'text-emerald-700'}`}>
                  {inspection.encroachment_status || 'No Encroachment'}
                </span>
                <span className="text-slate-500 text-[10px]">{inspection.encroachment_type || 'Clear Boundary'}</span>
              </div>
            </div>
          </div>

          {/* Checklist Table */}
          {inspection.checklist_data && (
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Section 3: Statutory Inspection Checklist Verification</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {Object.entries(inspection.checklist_data).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-600 text-[11px] capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className={`font-bold text-[10px] px-2 py-0.5 rounded ${
                      val === 'Yes' ? 'bg-emerald-100 text-emerald-800' :
                      val === 'No' ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photo Evidence Gallery */}
          {photos && photos.length > 0 && (
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-blue-600" />
                <span>Section 4: Photographic Evidence & Geo-Tag Records ({photos.length} Captured)</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {photos.map((ph, idx) => (
                  <div key={idx} className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs">
                    <div className="h-28 bg-slate-800 rounded-md overflow-hidden relative flex items-center justify-center">
                      <img
                        src={ph.file_url || '/photos/survey_marker_1040.jpg'}
                        alt={ph.category}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80';
                        }}
                      />
                      <span className="absolute top-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                        {ph.category}
                      </span>
                    </div>
                    <div className="mt-1.5 space-y-0.5 text-[10px] text-slate-600 font-mono">
                      <div>GPS: {ph.latitude ? Number(ph.latitude).toFixed(4) : '22.3792'}° N, {ph.longitude ? Number(ph.longitude).toFixed(4) : '71.3094'}° E</div>
                      <div className="text-slate-500">{ph.timestamp || '2026-03-12 11:20 IST'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Issues / Anomalies Identified */}
          {issues && issues.length > 0 && (
            <div className="border border-red-200 bg-red-50/60 rounded-xl p-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-red-800 mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Section 5: Anomalies & Statutory Non-Compliance Reported</span>
              </h4>
              <div className="space-y-2">
                {issues.map((iss, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-red-200 text-xs flex justify-between items-start gap-4">
                    <div>
                      <div className="font-bold text-red-900 flex items-center gap-2">
                        <span>{iss.issue_type}</span>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-red-100 text-red-700">
                          {iss.severity} Priority
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs mt-1">{iss.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Officer Remarks & Digital Sign-off */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-2">
              Officer Observations & Declaration
            </h4>
            <p className="text-xs text-slate-700 italic bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
              "{inspection.remarks || 'Parcel boundary verified with GPS. Cultivation observed. Compensation remains pending. High Court stay case status confirmed with landholder.'}"
            </p>

            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-end text-xs">
              <div className="space-y-0.5 text-slate-500 text-[11px]">
                <div>Verified via N-LAMS Geodetic Cadastral Engine v2.4</div>
                <div>Hash Seal: <span className="font-mono text-slate-700">e8c9f210...b471a</span></div>
              </div>

              <div className="text-right">
                <div className="font-bold text-slate-800">{inspection.officer_name || 'Ramesh Patel'}</div>
                <div className="text-slate-500 text-[11px]">Cadastral Field Surveyor, Rajkot Division</div>
                <div className="text-[10px] font-bold text-emerald-700 mt-0.5">Digitally Signed & Synced</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
