import os

base = r"C:\Users\shyam\.gemini\antigravity\scratch\n-lams-national-platform\field-app\src\pages"

# 1. FieldMapPage.jsx
with open(os.path.join(base, "FieldMapPage.jsx"), "w", encoding="utf-8") as f:
    f.write("""import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Compass, Layers, AlertCircle, CheckCircle2, ChevronUp } from 'lucide-react';
import { api } from '../services/api';
import { DEMO_COORDS } from '../services/geoUtils';

// Leaflet default icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Officer Location Icon (Blue pulsating marker)
const officerIcon = new L.DivIcon({
  className: 'officer-marker',
  html: `<div style="position:relative; width:24px; height:24px;">
    <div style="position:absolute; width:24px; height:24px; background:rgba(29, 78, 216, 0.4); border-radius:50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
    <div style="position:absolute; top:4px; left:4px; width:16px; height:16px; background:#1d4ed8; border:3px solid #ffffff; border-radius:50%; box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 16);
    }
  }, [center, zoom, map]);
  return null;
}

export default function FieldMapPage({ onStartInspection }) {
  const [parcels, setParcels] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [filter, setFilter] = useState('ALL'); // ALL, ASSIGNED, HIGH_RISK, COMPLETED
  const [mapCenter, setMapCenter] = useState([22.3863, 71.0643]);
  const [mapZoom, setMapZoom] = useState(16);
  const [officerPos, setOfficerPos] = useState([DEMO_COORDS.officerGps.lat, DEMO_COORDS.officerGps.lng]);

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const data = await api.getFieldMap();
        setParcels(data.features || []);
        // Auto-select Khasra 1042 if available
        const p1042 = data.features?.find(f => f.properties?.khasra_number === '1042');
        if (p1042) {
          setSelectedParcel(p1042.properties);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchMap();
  }, []);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setOfficerPos([lat, lng]);
          setMapCenter([lat, lng]);
          setMapZoom(17);
        },
        () => {
          // Fallback to simulated location
          setMapCenter([DEMO_COORDS.officerGps.lat, DEMO_COORDS.officerGps.lng]);
          setMapZoom(17);
        }
      );
    }
  };

  const handleCenterKhasra1042 = () => {
    setMapCenter([DEMO_COORDS.khasra1042.lat, DEMO_COORDS.khasra1042.lng]);
    setMapZoom(17);
    const p1042 = parcels.find(f => f.properties?.khasra_number === '1042');
    if (p1042) setSelectedParcel(p1042.properties);
  };

  const filteredParcels = parcels.filter(f => {
    const props = f.properties || {};
    if (filter === 'ASSIGNED') return props.is_assigned;
    if (filter === 'HIGH_RISK') return props.risk_level === 'High' || props.risk_level === 'Critical';
    if (filter === 'COMPLETED') return props.field_verified;
    return true;
  });

  return (
    <div className="relative h-[calc(100vh-120px)] w-full flex flex-col bg-slate-100 overflow-hidden">
      {/* Top Filter Bar Overlay */}
      <div className="absolute top-2 left-2 right-2 z-20 flex items-center justify-between pointer-events-auto">
        <div className="bg-white/90 backdrop-blur-sm p-1 rounded-xl shadow-md border border-slate-200 flex gap-1 text-[11px]">
          {['ALL', 'ASSIGNED', 'HIGH_RISK', 'COMPLETED'].map((ft) => (
            <button
              key={ft}
              onClick={() => setFilter(ft)}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                filter === ft ? 'bg-gov-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {ft === 'HIGH_RISK' ? 'High Risk' : ft.charAt(0) + ft.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Quick Demo Button */}
        <button
          onClick={handleCenterKhasra1042}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] px-2.5 py-1.5 rounded-xl shadow-md border border-amber-600 active:scale-95"
        >
          Khasra 1042
        </button>
      </div>

      {/* Interactive Leaflet Map Canvas */}
      <div className="flex-1 w-full relative z-10">
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ width: '100%', height: '100%' }}>
          <MapController center={mapCenter} zoom={mapZoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render Cadastral Parcels */}
          {filteredParcels.map((feature) => {
            const props = feature.properties;
            const is1042 = props.khasra_number === '1042';
            const isSelected = selectedParcel?.parcel_id === props.parcel_id;

            let color = '#3b82f6';
            let fillColor = '#93c5fd';
            if (is1042) {
              color = '#f59e0b';
              fillColor = '#fbbf24';
            } else if (props.risk_level === 'Critical' || props.acquisition_status === 'Disputed') {
              color = '#dc2626';
              fillColor = '#f87171';
            } else if (props.field_verified) {
              color = '#16a34a';
              fillColor = '#86efac';
            }

            const coordinates = feature.geometry?.coordinates?.[0]?.map(c => [c[1], c[0]]) || [];

            return (
              <Polygon
                key={props.parcel_id || Math.random()}
                positions={coordinates}
                pathOptions={{
                  color: isSelected ? '#1d4ed8' : color,
                  fillColor: fillColor,
                  fillOpacity: isSelected ? 0.6 : 0.35,
                  weight: isSelected ? 4 : (is1042 ? 3 : 1.5),
                  dashArray: is1042 ? '4 2' : null
                }}
                eventHandlers={{
                  click: () => {
                    setSelectedParcel(props);
                  }
                }}
              >
                <Popup>
                  <div className="text-xs space-y-1">
                    <strong className="block font-black text-slate-900">Khasra No. {props.khasra_number}</strong>
                    <div>Village: {props.village}</div>
                    <div>Area: {props.area_ha} ha</div>
                    <div>Status: {props.acquisition_status}</div>
                    <div>Risk: {props.risk_level} ({props.ai_risk_score}%)</div>
                  </div>
                </Popup>
              </Polygon>
            );
          })}

          {/* Field Officer Marker */}
          <Marker position={officerPos} icon={officerIcon}>
            <Popup>
              <div className="text-xs">
                <strong>Officer Location (FO-007)</strong>
                <p className="text-[10px] text-slate-500">Live GPS Verified (±8m)</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Map Floating Tools */}
        <div className="absolute right-3 bottom-36 z-20 flex flex-col gap-2 pointer-events-auto">
          <button
            onClick={handleLocateMe}
            className="w-10 h-10 bg-white hover:bg-slate-50 text-slate-800 rounded-xl shadow-lg border border-slate-200 flex items-center justify-center active:scale-95"
            title="Locate My Position"
          >
            <Navigation className="w-5 h-5 text-gov-700" />
          </button>
        </div>
      </div>

      {/* Bottom Selected Parcel Sheet */}
      {selectedParcel && (
        <div className="bg-white border-t border-slate-300 p-4 z-20 shadow-2xl rounded-t-2xl animate-in slide-in-from-bottom-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-gov-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Khasra {selectedParcel.khasra_number}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedParcel.risk_level === 'Critical' || selectedParcel.risk_level === 'High'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Risk: {selectedParcel.risk_level} ({selectedParcel.ai_risk_score}%)
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mt-1">
                {selectedParcel.village}, {selectedParcel.district}
              </h3>
              <p className="text-xs text-slate-500">
                Area: <strong>{selectedParcel.area_ha} ha</strong> • Owner: {selectedParcel.owner_name}
              </p>
            </div>

            <button
              onClick={() => onStartInspection(`TASK-FO-${selectedParcel.khasra_number}`)}
              className="px-4 py-2.5 bg-gov-800 hover:bg-gov-700 text-white font-bold text-xs rounded-xl shadow active:scale-95 flex items-center gap-1.5"
            >
              <span>Verify Parcel</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
""")

# 2. HistoryPage.jsx
with open(os.path.join(base, "HistoryPage.jsx"), "w", encoding="utf-8") as f:
    f.write("""import React, { useState, useEffect } from 'react';
import { Clock, FileText, CheckCircle2, AlertTriangle, Printer, X, MapPin } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { api } from '../services/api';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory();
      setHistory(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-900">Inspection Dossier</h2>
          <p className="text-xs text-slate-500">Submitted Field Verification Records</p>
        </div>
        <span className="bg-slate-200 text-slate-800 text-xs font-mono font-bold px-2 py-0.5 rounded-full">
          {history.length} Records
        </span>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading inspection history...</div>
      ) : history.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
          No previous inspections found.
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-gov-700 transition shadow-sm space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gov-800">
                      {item.inspection_code}
                    </span>
                    <StatusBadge status={item.status} size="xs" />
                  </div>
                  <h3 className="font-black text-sm text-slate-900 mt-1 font-serif">
                    Khasra {item.khasra_number} • {item.village}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedReport(item)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-gov-800"
                  title="View Official Report"
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div>
                  <span>Submitted: <strong>{item.submitted_at?.split('T')[0] || '2026-03-09'}</strong></span>
                </div>
                <div>
                  <span>GPS: <strong>{item.gps_verified ? '✓ Verified' : 'Pending'}</strong></span>
                </div>
                <div>
                  <span>Photos: <strong>{item.photos_count || 1} Attached</strong></span>
                </div>
                <div>
                  <span>Issues: <strong className={item.issues_count > 0 ? 'text-red-600' : 'text-emerald-600'}>{item.issues_count || 0} Flagged</strong></span>
                </div>
              </div>

              <button
                onClick={() => setSelectedReport(item)}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-gov-800 text-xs font-bold rounded-xl border border-slate-200 flex items-center justify-center gap-1.5"
              >
                <span>View Full Verification Dossier</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* OFFICIAL FIELD INSPECTION REPORT MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-gov-900 text-white p-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-amber-400">Official Field Inspection Record</div>
                <h3 className="font-bold text-sm">N-LAMS Cadastral Verification Dossier</h3>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-1 text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Body */}
            <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-700">
              {/* Reference Header */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Inspection Code</span>
                    <strong className="font-mono text-slate-900">{selectedReport.inspection_code}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Submission Date</span>
                    <strong className="text-slate-900">{selectedReport.submitted_at || '12 Sep 2026'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Officer</span>
                    <strong className="text-slate-900">{selectedReport.officer_name || 'Amit B. Parmar (FO-007)'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Review Status</span>
                    <StatusBadge status={selectedReport.status} size="xs" />
                  </div>
                </div>
              </div>

              {/* Cadastral Land & GPS Record */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Ground Truth Verification</h4>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Khasra Number:</span>
                    <strong className="text-slate-900">Khasra {selectedReport.khasra_number} (Matched)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cadastral Boundary:</span>
                    <strong className={selectedReport.boundary_status === 'Mismatch' ? 'text-red-600' : 'text-emerald-700'}>
                      {selectedReport.boundary_status || 'Verified Matched'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">GPS Validation:</span>
                    <strong className="text-emerald-700 font-mono">22.3862° N, 71.0643° E (±8m)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Observed Land Use:</span>
                    <strong className="text-slate-900">Agricultural (Cotton Cultivation)</strong>
                  </div>
                </div>
              </div>

              {/* Issues Flagged */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Field Anomalies Flagged</h4>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1.5">
                  {selectedReport.issues && selectedReport.issues.length > 0 ? (
                    selectedReport.issues.map((iss, i) => (
                      <div key={i} className="flex items-center gap-2 text-red-800 font-bold">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{iss}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-800 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>No critical ground anomalies detected.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer with Print Action */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">Certified Cadastral Record</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Dossier</span>
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-1.5 bg-gov-800 text-white font-bold text-xs rounded-xl shadow"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
""")

# 3. NotificationsPage.jsx
with open(os.path.join(base, "NotificationsPage.jsx"), "w", encoding="utf-8") as f:
    f.write("""import React from 'react';
import { Bell, AlertTriangle, CheckCircle, Clock, Calendar } from 'lucide-react';

export default function NotificationsPage() {
  const notifications = [
    {
      id: 'N-1',
      title: 'High Priority Inspection Assigned',
      desc: 'District Collectorate assigned Khasra 1042 (Limbdi) for Section 15 objection verification.',
      time: '15 mins ago',
      type: 'urgent'
    },
    {
      id: 'N-2',
      title: 'Inspection Deadline Approaching',
      desc: 'Task FO-1045 (Bamanbore) is due in 48 hours for tree valuation re-measurement.',
      time: '2 hours ago',
      type: 'warning'
    },
    {
      id: 'N-3',
      title: 'Field Inspection Approved',
      desc: 'Inspection dossier FO-1040-2026-001 has been reviewed and cleared by State Admin.',
      time: 'Yesterday',
      type: 'success'
    }
  ];

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-900">Notification Center</h2>
          <p className="text-xs text-slate-500">SLA Alerts & Central Directives</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-3.5 rounded-2xl border transition shadow-sm bg-white ${
              n.type === 'urgent'
                ? 'border-red-300 bg-red-50/20'
                : n.type === 'warning'
                ? 'border-amber-300 bg-amber-50/20'
                : 'border-slate-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl shrink-0 ${
                n.type === 'urgent' ? 'bg-red-100 text-red-700' : n.type === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {n.type === 'urgent' ? <AlertTriangle className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-slate-900">{n.title}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
""")

# 4. ProfilePage.jsx
with open(os.path.join(base, "ProfilePage.jsx"), "w", encoding="utf-8") as f:
    f.write("""import React, { useState } from 'react';
import { User, Shield, Phone, Mail, MapPin, RefreshCw, Globe, LogOut, Check } from 'lucide-react';
import { offlineStorage } from '../services/offlineStorage';

export default function ProfilePage({ officer, onLogout, onSyncNow }) {
  const [lang, setLang] = useState('en');
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState(null);

  const handleSync = async () => {
    setSyncing(true);
    if (onSyncNow) {
      await onSyncNow();
      setSyncMsg('All local drafts synced with N-LAMS Central Server!');
      setTimeout(() => setSyncMsg(null), 4000);
    }
    setSyncing(false);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Officer ID Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-gov-800 text-sky-300 mx-auto flex items-center justify-center text-xl font-bold border-4 border-slate-100 shadow">
          FO
        </div>
        <h2 className="text-base font-black text-slate-900 mt-2">{officer?.name || 'Amit B. Parmar'}</h2>
        <span className="text-xs font-mono font-bold bg-blue-50 text-gov-800 px-2.5 py-0.5 rounded-full border border-blue-200 mt-1 inline-block">
          {officer?.officer_id || 'FO-007'}
        </span>
        <p className="text-xs text-slate-500 mt-1">
          Cadastral Survey & Ground Verification Wing
        </p>

        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-left text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>District: <strong>Surendranagar</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-slate-400" />
            <span>State: <strong>Gujarat</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-slate-400" />
            <span className="truncate">field.surveyor@nlams.gov.in</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-slate-400" />
            <span>+91 98250 44102</span>
          </div>
        </div>
      </div>

      {/* Sync Management */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5">
        <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Sync & Offline Data</h3>
        <p className="text-xs text-slate-500">
          Manage local draft caches when working in rural areas with low network bandwidth.
        </p>

        {syncMsg && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{syncMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-600">Pending Drafts: <strong>{offlineStorage.getPendingCount()}</strong></span>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-4 py-2 bg-gov-800 hover:bg-gov-700 text-white font-bold text-xs rounded-xl shadow active:scale-95 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* Language Selection */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5">
        <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-slate-500" />
          <span>Language Support</span>
        </h3>
        <div className="grid grid-cols-3 gap-2 text-xs font-bold">
          <button
            onClick={() => setLang('en')}
            className={`py-2 rounded-xl border transition ${
              lang === 'en' ? 'bg-gov-800 text-white border-gov-800' : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`py-2 rounded-xl border transition ${
              lang === 'hi' ? 'bg-gov-800 text-white border-gov-800' : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            हिन्दी (Hindi)
          </button>
          <button
            onClick={() => setLang('gu')}
            className={`py-2 rounded-xl border transition ${
              lang === 'gu' ? 'bg-gov-800 text-white border-gov-800' : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            ગુજરાતી (Gujarati)
          </button>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-2xl border border-red-200 transition shadow-sm flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        <span>LOGOUT FROM FIELD DEVICE</span>
      </button>
    </div>
  );
}
""")

print("SUCCESS: FieldMapPage.jsx, HistoryPage.jsx, NotificationsPage.jsx, and ProfilePage.jsx created!")
