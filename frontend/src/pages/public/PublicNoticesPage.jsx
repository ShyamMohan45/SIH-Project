import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Calendar, MapPin, Download, Filter, Search, ShieldCheck } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function PublicNoticesPage() {
  const [notices, setNotices] = useState([]);
  const [selectedState, setSelectedState] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotices() {
      try {
        let url = `${API_BASE}/public/notices?`;
        if (selectedState !== 'All') url += `state=${encodeURIComponent(selectedState)}&`;
        const res = await axios.get(url);
        setNotices(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotices();
  }, [selectedState]);

  const filteredNotices = notices.filter(n => {
    if (selectedType === 'All') return true;
    return n.notice_type === selectedType;
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Official Gazette & Public Hearing Notices</h2>
          <p className="text-xs text-slate-500">
            Mandatory notifications under Section 11, Section 15, and Section 23 of RFCTLARR Act 2013
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-amber-900 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>Statutory Disclosures Bulletin</span>
        </div>
      </div>

      {/* Filter Options */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">State:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none"
          >
            <option value="All">All States</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
          <span className="text-xs text-slate-500 font-medium">Notice Category:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="ACQUISITION_NOTICE">Section 11 Preliminary Notification</option>
            <option value="PUBLIC_HEARING">SIA Public Hearing</option>
            <option value="AWARD_NOTICE">Award Declaration</option>
            <option value="RR_NOTICE">R&R Entitlement Matrix</option>
          </select>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((n) => (
          <div key={n.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center space-x-2 text-xs">
                <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-amber-100 text-amber-900 border border-amber-200">
                  {n.notice_type.replace('_', ' ')}
                </span>
                <span className="text-slate-400 flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{n.issue_date}</span>
                </span>
                <span className="text-slate-400 flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{n.district}, {n.state}</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {n.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {n.summary}
              </p>
            </div>

            <div className="shrink-0 flex items-center space-x-2">
              <button 
                onClick={() => alert(`Downloading official gazette file: ${n.file_path || 'Gazette Notification PDF'}`)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-semibold border border-slate-200 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Gazette PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
