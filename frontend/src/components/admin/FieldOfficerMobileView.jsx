import React, { useState } from 'react';
import { 
  Smartphone, MapPin, Camera, CheckCircle2, AlertTriangle, ShieldCheck, 
  Upload, Database, RefreshCw, ArrowRight
} from 'lucide-react';

export default function FieldOfficerMobileView() {
  const [gpsActive, setGpsActive] = useState(true);
  const [selectedParcel, setSelectedParcel] = useState('P-1042');
  const [surveyPhotoUploaded, setSurveyPhotoUploaded] = useState(true);
  const [remarks, setRemarks] = useState('Residential structure verified on boundary. Landowner present during verification.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitSurvey = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 500);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 to-indigo-950 p-6 rounded-2xl border border-blue-800 shadow-xl flex flex-wrap justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider">
              Level 4 — Field Survey Mobile App
            </span>
            <span className="text-xs text-blue-200 font-semibold">• Jurisdiction: Rajkot District (Kuvadva Village)</span>
          </div>
          <h2 className="text-2xl font-black text-white font-serif tracking-tight">
            Field Officer Mobile Data Collection & Verification Cell
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Offline Geo-fencing • GPS Boundary Capture • Photo Evidence Upload • DILRMP Verification
          </p>
        </div>

        <div className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>GPS ACTIVE (23.0225° N, 72.5714° E)</span>
        </div>
      </div>

      {/* Main Container: Mobile Interface Phone Frame Mockup + Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left 5 Cols: Phone Frame Interface */}
        <div className="md:col-span-5 flex justify-center">
          <div className="w-[320px] bg-slate-950 rounded-[40px] border-4 border-slate-700 p-4 shadow-2xl space-y-3 relative">
            {/* Phone Speaker Notch */}
            <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-2"></div>

            <div className="bg-blue-900/80 p-3 rounded-xl border border-blue-700 flex justify-between items-center text-xs">
              <div>
                <div className="text-[9px] text-blue-300 font-black uppercase">Field Mobile App</div>
                <div className="font-extrabold text-white text-xs">Plot # P-1042 / RJ-1042/B</div>
              </div>
              <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded">GPS LOCKED</span>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmitSurvey} className="space-y-2.5 text-[11px] text-slate-300">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Village Code:</span>
                    <span className="font-bold text-white">Kuvadva (239102)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Verified Area:</span>
                    <span className="font-bold text-emerald-400">2.4 Hectares</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Registered Owner:</span>
                    <span className="font-bold text-white">Suresh & Bhavesh Patel</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">Field Audit Checklist</div>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> GPS Coordinates Logged
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 2 Site Photos Uploaded
                  </div>
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" /> Legal Dispute Flagged (High Court)
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold text-[10px] mb-1">Field Remarks</label>
                  <textarea
                    rows={2}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-[11px] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-bold text-xs transition-colors shadow flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? 'Syncing with N-LAMS Database...' : 'SUBMIT FIELD VERIFICATION'}
                </button>
              </form>
            ) : (
              <div className="bg-emerald-950/80 border border-emerald-800 p-4 rounded-xl text-center space-y-2 my-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-xs">Field Audit Synchronized!</h4>
                <p className="text-[10px] text-emerald-200">
                  Data & geo-tagged photos uploaded to N-LAMS Central Repository.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-[10px] font-bold mt-2"
                >
                  Verify Next Parcel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right 7 Cols: Mobile Survey Capabilities Explanation */}
        <div className="md:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
          <h3 className="text-lg font-bold text-white font-serif">
            Mobile Field Officer Technical Capabilities
          </h3>

          <div className="space-y-3">
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold text-xs">GPS Geo-fencing & Coordinate Locking</strong>
                <span className="text-slate-300">Captures exact latitude and longitude bounds (WGS84) directly at the parcel site to prevent fraudulent land claims.</span>
              </div>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
              <Camera className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold text-xs">Offline Media Upload with Watermarking</strong>
                <span className="text-slate-300">Allows field survey officers to record site images and asset condition photos offline; auto-syncs when 4G/5G connection is established.</span>
              </div>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
              <Database className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold text-xs">DILRMP API RoR Instant Lookup</strong>
                <span className="text-slate-300">Auto-fetches registered Khata details and owner names from state land record databases (Bhoomi / AnyRoR) in real time.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
