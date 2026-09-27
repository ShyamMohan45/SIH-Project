import React from 'react';
import { X, Users, Calculator, ShieldCheck, AlertCircle, FileText } from 'lucide-react';

export default function FamilyTreeModal({ parcel, onClose }) {
  if (!parcel) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-[#0b2545] text-white p-5 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">
              LAMSAPP Owner & Ancestry Hierarchy
            </span>
            <h3 className="text-xl font-bold font-serif">
              Parcel {parcel.id} — Family Tree & Valuation Ledger
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Survey No: {parcel.surveyNo} • Village {parcel.village}, District {parcel.district}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Family Tree Ancestry Map */}
          <div>
            <div className="flex items-center space-x-2 text-[#0b2545] font-bold mb-3 text-sm">
              <Users className="w-4 h-4 text-amber-600" />
              <span>Ancestral Family Tree & Heir Share Breakdown</span>
            </div>

            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200">
              {/* Parent Ancestor Node */}
              <div className="flex flex-col items-center">
                <div className="bg-[#0b2545] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm border border-slate-700 text-center">
                  <div>Late Bachubhai Patel (Ancestor / Original Owner)</div>
                  <div className="text-[10px] text-amber-300 font-normal">Original Khata No: 402 • Total Land: 2.4 ha</div>
                </div>
                <div className="w-0.5 h-6 bg-slate-400"></div>
              </div>

              {/* Children / Legal Heirs Level */}
              <div className="grid grid-cols-2 gap-4 relative">
                {/* Heir 1 (Suresh Patel) */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-xs text-slate-900">Suresh Bachubhai Patel</div>
                      <div className="text-[10px] text-slate-500">Elder Son • Share: 50% (1.2 ha)</div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded">
                      Verified Heir
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-600 flex justify-between">
                    <span>Aadhaar: XXXX-8910</span>
                    <span className="font-bold text-emerald-700">KYC Approved</span>
                  </div>
                </div>

                {/* Heir 2 (Bhavesh Patel - Disputed) */}
                <div className="bg-red-50/70 p-3.5 rounded-lg border border-red-300 shadow-sm relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-xs text-red-950">Bhavesh Bachubhai Patel</div>
                      <div className="text-[10px] text-red-700 font-semibold">Younger Son • Share: 50% (1.2 ha)</div>
                    </div>
                    <span className="bg-red-200 text-red-900 text-[9px] font-bold px-2 py-0.5 rounded">
                      Objection Filed
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-red-200 text-[10px] text-red-800">
                    <span className="font-bold">Litigation Case:</span> Claims full ancestral rights under Will #74.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Land Valuation & Compensation Breakdown */}
          <div>
            <div className="flex items-center space-x-2 text-[#0b2545] font-bold mb-3 text-sm">
              <Calculator className="w-4 h-4 text-blue-700" />
              <span>RFCTLARR Statutory Land Valuation Engine</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="text-slate-500 text-[10px]">Basic Circle Rate</div>
                  <div className="font-extrabold text-slate-900 text-sm">₹ 4,00,000 / ha</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="text-slate-500 text-[10px]">Rural Multiplier</div>
                  <div className="font-extrabold text-blue-800 text-sm">2.0 x Factor</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="text-slate-500 text-[10px]">Solatium Allowance</div>
                  <div className="font-extrabold text-emerald-700 text-sm">100% Equal Grant</div>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-300">
                  <div className="text-amber-900 text-[10px] font-bold">Total Assessed Award</div>
                  <div className="font-extrabold text-amber-900 text-sm">{parcel.compensationAssessed}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-between items-center text-xs">
          <div className="flex items-center space-x-1 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital Land Ledger Certified • DoLR Compliance</span>
          </div>
          <button
            onClick={onClose}
            className="bg-[#0b2545] hover:bg-slate-900 text-white font-bold px-5 py-2 rounded-lg transition-colors"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
}
