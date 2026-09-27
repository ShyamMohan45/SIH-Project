import React, { useState, useEffect } from 'react';
import {
  Home, Map, ClipboardList, Clock, User, ShieldCheck, CheckCircle2,
  AlertTriangle, Play, MapPin, Wifi, WifiOff, RefreshCw, Smartphone,
  Monitor, FileText, ChevronRight, Compass, Bell, Check, LogOut, Layers
} from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../../services/api';
import ActiveInspectionFlow from './ActiveInspectionFlow';
import InspectionReportModal from './InspectionReportModal';

// Custom Map Marker Icons
const officerIcon = new L.DivIcon({
  className: 'custom-officer-icon',
  html: `<div style="background-color:#0284c7;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px #0284c7;"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

export default function FieldOfficerMobileApp({ onExitToAdmin }) {
  const [activeTab, setActiveTab] = useState('home'); // home, map, tasks, history, profile
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [syncStatus, setSyncStatus] = useState('SYNCED'); // SYNCED, PENDING, SYNCING

  // Tasks & Inspection State
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    assigned_today: 8,
    pending: 5,
    completed: 3,
    high_priority: 2
  });
  const [activeInspectionTask, setActiveInspectionTask] = useState(null);
  const [selectedReportInspection, setSelectedReportInspection] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Filter in Tasks Tab
  const [taskFilter, setTaskFilter] = useState('ALL');

  useEffect(() => {
    loadFieldData();
  }, []);

  const loadFieldData = async () => {
    try {
      const res = await api.getFieldTasks('field.surveyor@nlams.gov.in');
      if (res?.tasks && res.tasks.length > 0) {
        setTasks(res.tasks);
      } else {
        // Fallback default tasks
        setTasks([
          {
            id: 'TASK-FO-1042',
            task_code: 'FO-1042',
            project_id: 'NH-GJ-2026-001',
            parcel_id: 'P-1042',
            khasra_number: '1042',
            village: 'Limbdi',
            district: 'Rajkot',
            area_ha: 2.45,
            priority: 'HIGH',
            reason: 'Compensation pending, previous verification incomplete, AI risk 78%',
            status: 'PENDING',
            assigned_date: '2026-03-12',
            due_date: '2026-03-15'
          },
          {
            id: 'TASK-FO-1038',
            task_code: 'FO-1038',
            project_id: 'NH-GJ-2026-001',
            parcel_id: 'P-1038',
            khasra_number: '1038',
            village: 'Ralol',
            district: 'Rajkot',
            area_ha: 3.10,
            priority: 'MEDIUM',
            reason: 'Routine joint cadastral survey & marker check',
            status: 'PENDING',
            assigned_date: '2026-03-12',
            due_date: '2026-03-16'
          },
          {
            id: 'TASK-FO-1045',
            task_code: 'FO-1045',
            project_id: 'NH-GJ-2026-001',
            parcel_id: 'P-1045',
            khasra_number: '1045',
            village: 'Bamanbore',
            district: 'Rajkot',
            area_ha: 4.20,
            priority: 'HIGH',
            reason: 'Tree and well valuation re-measurement',
            status: 'PENDING',
            assigned_date: '2026-03-12',
            due_date: '2026-03-14'
          },
          {
            id: 'TASK-FO-1040',
            task_code: 'FO-1040',
            project_id: 'NH-GJ-2026-001',
            parcel_id: 'P-1040',
            khasra_number: '1040',
            village: 'Ralol',
            district: 'Rajkot',
            area_ha: 2.10,
            priority: 'MEDIUM',
            reason: 'Boundary verification',
            status: 'COMPLETED',
            assigned_date: '2026-03-08',
            due_date: '2026-03-10',
            completed_date: '2026-03-09'
          }
        ]);
      }

      if (res?.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.warn('Field data fallback:', err);
    }
  };

  const handleStartInspection = (task) => {
    setActiveInspectionTask(task);
  };

  const handleInspectionCompleted = () => {
    setActiveInspectionTask(null);
    loadFieldData();
    setActiveTab('history');
  };

  const handleViewReport = (item) => {
    setSelectedReportInspection({
      inspection_code: item.task_code ? `${item.task_code}-2026-001` : 'FO-1040-2026-001',
      khasra_expected: item.khasra_number || '1040',
      village: item.village || 'Ralol',
      district: item.district || 'Rajkot',
      officer_name: 'Ramesh Patel',
      officer_id: 'field.surveyor@nlams.gov.in',
      submitted_at: item.completed_date || '2026-03-09 11:45 IST',
      latitude: 22.3785,
      longitude: 71.3082,
      gps_accuracy: 6.2,
      distance_from_parcel_m: 8.4,
      status: 'Approved',
      land_use: 'Agricultural',
      crop_type: 'Wheat / Cotton',
      occupancy_status: 'Owner Present',
      occupant_name: 'Jayeshbhai Patel',
      encroachment_status: 'No',
      checklist_data: {
        boundary_visible: 'Yes',
        survey_marker: 'Yes',
        land_area_consistent: 'Yes',
        access_road: 'Yes',
        owner_present: 'Yes',
        cultivation_observed: 'Yes',
        notice_received: 'Yes',
        compensation_discussed: 'Yes'
      },
      remarks: 'Boundary and survey stone markers verified in presence of Talati. Active cultivation. No encroachment.'
    });
    setIsReportModalOpen(true);
  };

  const handleSyncNow = () => {
    setSyncStatus('SYNCING');
    setTimeout(() => {
      setSyncStatus('SYNCED');
      loadFieldData();
    }, 1200);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (taskFilter === 'ALL') return true;
    if (taskFilter === 'HIGH_PRIORITY') return t.priority === 'HIGH' || t.priority === 'CRITICAL';
    if (taskFilter === 'PENDING') return t.status === 'PENDING';
    if (taskFilter === 'COMPLETED') return t.status === 'COMPLETED';
    return true;
  });

  // Mobile App Outer Container
  return (
    <div className="min-h-screen bg-[#071322] text-slate-100 flex flex-col items-center justify-start p-2 sm:p-4 select-none font-sans">
      {/* Top Utility Bar */}
      <div className="w-full max-w-md mb-2 flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-300">N-LAMS Mobile Field Unit</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg transition-colors"
            title="Toggle Smartphone Mockup Frame"
          >
            {isPhoneFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span className="text-[11px] font-semibold">{isPhoneFrame ? 'Full Width' : 'Phone Frame'}</span>
          </button>

          {onExitToAdmin && (
            <button
              onClick={onExitToAdmin}
              className="flex items-center gap-1 bg-blue-900/60 hover:bg-blue-800 text-blue-200 px-2.5 py-1 rounded-lg transition-colors font-bold"
            >
              <span>Exit to Web</span>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Smartphone Shell */}
      <div className={`w-full bg-slate-900 overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${
        isPhoneFrame
          ? 'max-w-sm rounded-[2.5rem] border-[6px] border-slate-700 h-[760px]'
          : 'max-w-xl rounded-2xl border border-slate-800 min-h-[720px]'
      }`}>
        {/* Device Status Notch */}
        {isPhoneFrame && (
          <div className="bg-slate-950 px-6 py-2 flex items-center justify-between text-[11px] text-slate-400 font-medium shrink-0 border-b border-slate-800/60">
            <span className="font-bold text-white">9:41 AM</span>
            <div className="w-20 h-4 bg-black rounded-full mx-auto" />
            <div className="flex items-center gap-1.5">
              {isOfflineMode ? <WifiOff className="w-3 h-3 text-amber-400" /> : <Wifi className="w-3 h-3 text-emerald-400" />}
              <span className="text-[10px] font-mono text-emerald-400">5G</span>
            </div>
          </div>
        )}

        {/* Mobile Header Banner */}
        <div className="bg-gradient-to-r from-[#0b2545] to-[#134074] px-4 py-3 border-b border-slate-700 flex items-center justify-between shrink-0 shadow">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-amber-50 rounded-lg border border-amber-300 flex items-center justify-center p-1 shadow-inner">
              <ShieldCheck className="w-5 h-5 text-[#0b2545]" />
            </div>
            <div>
              <div className="text-xs font-black text-white leading-tight font-serif">N-LAMS FIELD APP</div>
              <div className="text-[9px] font-bold text-blue-200">Govt. Cadastral Inspection</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold flex items-center gap-1 ${
              isOfflineMode
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOfflineMode ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <span>{isOfflineMode ? 'OFFLINE' : 'ONLINE'}</span>
            </div>
          </div>
        </div>

        {/* ACTIVE INSPECTION WIZARD VIEW */}
        {activeInspectionTask ? (
          <div className="flex-grow overflow-y-auto">
            <ActiveInspectionFlow
              task={activeInspectionTask}
              onCancel={() => setActiveInspectionTask(null)}
              onComplete={handleInspectionCompleted}
            />
          </div>
        ) : (
          /* MAIN TABS CONTAINER */
          <div className="flex-grow overflow-y-auto relative flex flex-col justify-between">
            <div className="p-4 space-y-4">
              {/* TAB 1: HOME */}
              {activeTab === 'home' && (
                <div className="space-y-4 animate-in fade-in">
                  {/* Welcome Card */}
                  <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 p-4 rounded-2xl border border-blue-800/40 shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">Field Cadastral Unit</span>
                        <h2 className="text-base font-bold text-white mt-0.5">Welcome, Officer Ramesh</h2>
                      </div>
                      <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded font-mono font-bold border border-blue-800">
                        FO-007
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                      Division: <strong className="text-white">Rajkot & Surendranagar</strong> • NHAI Corridor Joint Inspection
                    </p>
                  </div>

                  {/* 4 Inspection Stats Cards */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">Assigned Today</span>
                      <div className="text-2xl font-black text-white mt-0.5 font-mono">{stats.assigned_today}</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-semibold text-amber-400 uppercase">Pending</span>
                      <div className="text-2xl font-black text-amber-300 mt-0.5 font-mono">{stats.pending}</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-semibold text-emerald-400 uppercase">Completed</span>
                      <div className="text-2xl font-black text-emerald-300 mt-0.5 font-mono">{stats.completed}</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-semibold text-red-400 uppercase">High Priority</span>
                      <div className="text-2xl font-black text-red-400 mt-0.5 font-mono">{stats.high_priority}</div>
                    </div>
                  </div>

                  {/* Priority Task Highlight Card */}
                  <div className="bg-gradient-to-b from-amber-950/40 to-slate-950 p-4 rounded-2xl border-2 border-amber-500/60 shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-mono">
                        HIGH PRIORITY INSPECTION
                      </span>
                      <span className="text-[10px] text-amber-400 font-bold">Due: 15 Mar 2026</span>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400 font-mono">INSPECTION #FO-1042</div>
                      <h3 className="text-base font-bold text-white font-serif mt-0.5">
                        Khasra No. 1042 (2.45 Ha)
                      </h3>
                      <div className="text-xs text-slate-300 mt-1">
                        Village: <strong className="text-white">Limbdi</strong> • Project: <strong className="text-white">NH-GJ-2026-001</strong>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-900/90 rounded-xl border border-amber-500/30 text-[11px] text-amber-200 space-y-1">
                      <strong className="block text-amber-300">Statutory Urgency:</strong>
                      <p className="text-[10px] text-slate-300 leading-relaxed">
                        Compensation pending • Previous verification incomplete • AI risk reached 78% (Section 15 review required).
                      </p>
                    </div>

                    <button
                      onClick={() => handleStartInspection({
                        id: 'TASK-FO-1042',
                        task_code: 'FO-1042',
                        project_id: 'NH-GJ-2026-001',
                        project_name: 'Ahmedabad–Rajkot Green Highway Expansion',
                        parcel_id: 'P-1042',
                        khasra_number: '1042',
                        village: 'Limbdi',
                        area_ha: 2.45,
                        priority: 'HIGH',
                        reason: 'Compensation pending, AI risk 78%'
                      })}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>START INSPECTION</span>
                    </button>
                  </div>

                  {/* Quick Action Map Banner */}
                  <div
                    onClick={() => setActiveTab('map')}
                    className="p-3.5 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-800">
                        <Map className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">Cadastral Field Map View</div>
                        <span className="text-[10px] text-slate-400">View 52 parcels & boundary pillars</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              )}

              {/* TAB 2: MAP */}
              {activeTab === 'map' && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-blue-400" /> Cadastral Map Navigator
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      GPS Accuracy: ± 8m
                    </span>
                  </div>

                  {/* Interactive Leaflet Map */}
                  <div className="h-80 w-full rounded-2xl overflow-hidden border border-slate-700 relative shadow-inner">
                    <MapContainer
                      center={[22.3792, 71.3094]}
                      zoom={15}
                      style={{ height: '100%', width: '100%' }}
                      zoomControl={false}
                    >
                      <TileLayer
                        attribution="&copy; OpenStreetMap"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      {/* Officer Location Marker */}
                      <Marker position={[22.3792, 71.3094]} icon={officerIcon}>
                        <Popup>
                          <div className="text-xs font-sans">
                            <strong className="text-blue-700 block">Current Officer Location</strong>
                            <span>Lat: 22.3792° N, Lng: 71.3094° E</span>
                          </div>
                        </Popup>
                      </Marker>

                      {/* Highlighted Khasra 1042 Polygon */}
                      <Polygon
                        positions={[
                          [22.3785, 71.3085],
                          [22.3800, 71.3088],
                          [22.3802, 71.3105],
                          [22.3788, 71.3102]
                        ]}
                        pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.45, weight: 3 }}
                      >
                        <Popup>
                          <div className="text-xs font-sans p-1 space-y-1">
                            <strong className="text-red-700 block text-sm">Khasra #1042 (P-1042)</strong>
                            <div>Area: 2.45 Ha • Limbdi</div>
                            <div className="text-amber-700 font-bold">Status: Pending Inspection</div>
                          </div>
                        </Popup>
                      </Polygon>

                      {/* Nearby Parcel 1038 (Acquired Green) */}
                      <Polygon
                        positions={[
                          [22.3802, 71.3065],
                          [22.3815, 71.3070],
                          [22.3812, 71.3086],
                          [22.3800, 71.3085]
                        ]}
                        pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.35, weight: 2 }}
                      />

                      {/* Nearby Parcel 1039 (Acquired Green) */}
                      <Polygon
                        positions={[
                          [22.3770, 71.3082],
                          [22.3784, 71.3084],
                          [22.3787, 71.3100],
                          [22.3772, 71.3098]
                        ]}
                        pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.35, weight: 2 }}
                      />
                    </MapContainer>
                  </div>

                  {/* Parcel Quick Inspect Action Card */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <span>Khasra 1042 (2.45 Ha)</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Limbdi Sector 3 • 12m from officer</span>
                    </div>

                    <button
                      onClick={() => handleStartInspection({
                        id: 'TASK-FO-1042',
                        task_code: 'FO-1042',
                        project_id: 'NH-GJ-2026-001',
                        project_name: 'Ahmedabad–Rajkot Green Highway Expansion',
                        parcel_id: 'P-1042',
                        khasra_number: '1042',
                        village: 'Limbdi',
                        area_ha: 2.45,
                        priority: 'HIGH',
                        reason: 'Compensation pending, AI risk 78%'
                      })}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow"
                    >
                      Inspect Now
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: TASKS / MY ASSIGNMENTS */}
              {activeTab === 'tasks' && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Assigned Inspections ({filteredTasks.length})</span>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-semibold">
                    {[
                      { id: 'ALL', label: 'All (8)' },
                      { id: 'HIGH_PRIORITY', label: 'High Priority (2)' },
                      { id: 'PENDING', label: 'Pending (5)' },
                      { id: 'COMPLETED', label: 'Done (3)' },
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setTaskFilter(f.id)}
                        className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                          taskFilter === f.id
                            ? 'bg-blue-600 text-white font-bold shadow'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-2.5">
                    {filteredTasks.map(item => (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
                          item.priority === 'CRITICAL' ? 'bg-red-950/20 border-red-700/50' :
                          item.priority === 'HIGH' ? 'bg-amber-950/20 border-amber-600/50' :
                          item.status === 'COMPLETED' ? 'bg-slate-950/50 border-slate-800 opacity-70' :
                          'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-white">{item.task_code}</span>
                              <span className={`text-[9px] font-black uppercase px-2 py-0.2 rounded-full ${
                                item.priority === 'CRITICAL' ? 'bg-red-500 text-white' :
                                item.priority === 'HIGH' ? 'bg-amber-500 text-slate-950' :
                                'bg-slate-800 text-slate-300'
                              }`}>
                                {item.priority}
                              </span>
                            </div>
                            <h4 className="font-bold text-white text-sm mt-1">Khasra #{item.khasra_number}</h4>
                            <span className="text-[11px] text-slate-400">{item.village} • {item.area_ha} Ha</span>
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            item.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            'bg-blue-950 text-blue-300 border border-blue-800'
                          }`}>
                            {item.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300 italic">{item.reason}</p>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                          <span className="text-slate-500">Due: {item.due_date}</span>
                          {item.status === 'COMPLETED' ? (
                            <button
                              onClick={() => handleViewReport(item)}
                              className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" /> View Dossier
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartInspection(item)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow"
                            >
                              Start Inspection
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: HISTORY */}
              {activeTab === 'history' && (
                <div className="space-y-3 animate-in fade-in text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Completed Inspections</span>
                    <span className="text-[10px] text-slate-400">Permanent Cadastral Record</span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { code: 'FO-1040-2026-001', khasra: '1040', village: 'Ralol', date: '09 Mar 2026', status: 'Approved', photos: 4 },
                      { code: 'FO-1041-2026-001', khasra: '1041', village: 'Ralol', date: '10 Mar 2026', status: 'Approved', photos: 3 },
                      { code: 'FO-1037-2026-001', khasra: '1037', village: 'Ralol', date: '08 Mar 2026', status: 'Approved', photos: 5 }
                    ].map(item => (
                      <div key={item.code} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="font-mono text-blue-400 font-bold text-[11px] block">{item.code}</span>
                          <h4 className="font-bold text-white text-sm mt-0.5">Khasra #{item.khasra} ({item.village})</h4>
                          <span className="text-[10px] text-slate-500">Verified with GPS • {item.photos} Photos • {item.date}</span>
                        </div>

                        <button
                          onClick={() => handleViewReport(item)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg border border-slate-700 flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Report</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: PROFILE & OFFLINE SYNC */}
              {activeTab === 'profile' && (
                <div className="space-y-4 animate-in fade-in text-xs">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center mx-auto border-2 border-slate-700 shadow-lg">
                      RP
                    </div>
                    <h3 className="text-base font-bold text-white">Ramesh Patel</h3>
                    <span className="text-[11px] text-slate-400 block">Cadastral Field Surveyor • ID: FO-007</span>
                    <span className="text-[10px] font-mono bg-slate-900 text-blue-300 px-2 py-0.5 rounded border border-slate-800 inline-block">
                      field.surveyor@nlams.gov.in
                    </span>
                  </div>

                  {/* Offline Mode & Sync Controls */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">Offline Inspection Storage</span>
                        <span className="text-[10px] text-slate-400">Stores dossiers in browser LocalStorage</span>
                      </div>
                      <button
                        onClick={() => setIsOfflineMode(!isOfflineMode)}
                        className={`px-3 py-1 rounded-full font-bold text-[10px] transition-colors ${
                          isOfflineMode ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {isOfflineMode ? 'ON' : 'OFF'}
                      </button>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Database Synchronization:</span>
                      <span className="font-bold text-emerald-400 font-mono text-[11px]">{syncStatus}</span>
                    </div>

                    <button
                      onClick={handleSyncNow}
                      disabled={syncStatus === 'SYNCING'}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'SYNCING' ? 'animate-spin' : ''}`} />
                      <span>{syncStatus === 'SYNCING' ? 'Syncing to DoLR Servers...' : 'SYNC DATA NOW'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <div className="bg-slate-950 border-t border-slate-800 px-2 py-2 flex items-center justify-around shrink-0">
              {[
                { id: 'home', label: 'Home', icon: Home },
                { id: 'map', label: 'Map', icon: Map },
                { id: 'tasks', label: 'Tasks', icon: ClipboardList, badge: stats.pending },
                { id: 'history', label: 'History', icon: Clock },
                { id: 'profile', label: 'Profile', icon: User },
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all relative ${
                      isActive ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span className="text-[10px] mt-0.5">{item.label}</span>
                    {item.badge && (
                      <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Printable Report Modal */}
      {isReportModalOpen && selectedReportInspection && (
        <InspectionReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          inspection={selectedReportInspection}
          project={{ name: 'Ahmedabad–Rajkot Green Highway Expansion', id: 'NH-GJ-2026-001' }}
          photos={[
            { category: 'Marker', file_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80', timestamp: '09 Mar 2026 10:30 IST' },
            { category: 'Boundary', file_url: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&q=80', timestamp: '09 Mar 2026 10:45 IST' }
          ]}
          issues={[]}
        />
      )}
    </div>
  );
}
