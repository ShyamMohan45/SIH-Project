import os

base = r"C:\Users\shyam\.gemini\antigravity\scratch\n-lams-national-platform\field-app\src\components"
os.makedirs(os.path.join(base, "common"), exist_ok=True)
os.makedirs(os.path.join(base, "layout"), exist_ok=True)

# 1. StatusBadge.jsx
with open(os.path.join(base, "common", "StatusBadge.jsx"), "w", encoding="utf-8") as f:
    f.write("""import React from 'react';

export default function StatusBadge({ status, size = 'sm' }) {
  const s = (status || '').toUpperCase();
  let color = 'bg-slate-100 text-slate-700 border-slate-300';
  let dot = 'bg-slate-400';

  if (s.includes('VERIFIED') || s.includes('COMPLETED') || s.includes('MATCHED') || s.includes('APPROVED')) {
    color = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    dot = 'bg-emerald-500';
  } else if (s.includes('PROGRESS') || s.includes('UNDER PROCESS') || s.includes('PENDING')) {
    color = 'bg-amber-50 text-amber-800 border-amber-300';
    dot = 'bg-amber-500';
  } else if (s.includes('CRITICAL') || s.includes('HIGH') || s.includes('DISPUTED') || s.includes('MISMATCH') || s.includes('OVERDUE')) {
    color = 'bg-red-50 text-red-800 border-red-300';
    dot = 'bg-red-500';
  } else if (s.includes('LOW')) {
    color = 'bg-blue-50 text-blue-800 border-blue-300';
    dot = 'bg-blue-500';
  }

  const px = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : size === 'lg' ? 'px-3 py-1 text-sm font-bold' : 'px-2.5 py-0.5 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${color} ${px}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      <span>{status}</span>
    </span>
  );
}
""")

# 2. CameraCaptureModal.jsx
with open(os.path.join(base, "common", "CameraCaptureModal.jsx"), "w", encoding="utf-8") as f:
    f.write("""import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, MapPin, AlertCircle } from 'lucide-react';

export default function CameraCaptureModal({
  isOpen,
  onClose,
  onCapture,
  category = 'Survey Marker',
  categories = [
    'Survey/Khasra Marker',
    'Boundary',
    'Land/Crop',
    'Structure',
    'Encroachment',
    'Compensation Evidence',
    'Other'
  ],
  gps = { lat: 22.3863, lng: 71.0643, accuracy: 8 }
}) {
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimulatePhoto = (mockType) => {
    // Demo photos for field demonstration
    let demoUrl = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80';
    let demoName = 'Cadastral_Survey_Stone_1042.jpg';
    
    if (mockType === 'boundary') {
      demoUrl = 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=600&auto=format&fit=crop&q=80';
      demoName = 'Boundary_Ridge_South_Mismatch.jpg';
    } else if (mockType === 'structure') {
      demoUrl = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80';
      demoName = 'Temporary_Farm_Shed_1042.jpg';
    } else if (mockType === 'encroachment') {
      demoUrl = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80';
      demoName = 'Encroachment_Fencing_Notice.jpg';
    }

    setPreview(demoUrl);
    setFileName(demoName);
  };

  const handleSave = () => {
    if (!preview) return;
    const now = new Date();
    const photoData = {
      id: `PH-${Date.now().toString().slice(-6)}`,
      category: selectedCategory,
      file_name: fileName || `Photo_${selectedCategory.replace(/\\s+/g, '_')}_${Date.now().toString().slice(-4)}.jpg`,
      file_url: preview,
      latitude: gps?.lat || 22.386221,
      longitude: gps?.lng || 71.064316,
      accuracy: gps?.accuracy || 8,
      timestamp: `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString()}`,
      uploaded_by: 'FO-007'
    };
    onCapture(photoData);
    setPreview(null);
    setFileName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gov-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gov-700 flex items-center justify-center text-sky-300">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Capture Photo Evidence</h3>
              <p className="text-[11px] text-sky-200">Geo-tagged with live GPS metadata</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-gov-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Evidence Category</label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCategory(c)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                    selectedCategory === c
                      ? 'bg-gov-800 text-white border-gov-800 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Preview / Capture Area */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-3 bg-slate-50 text-center min-h-[220px] flex flex-col items-center justify-center relative overflow-hidden">
            {preview ? (
              <div className="w-full relative group">
                <img src={preview} alt="Evidence preview" className="w-full h-52 object-cover rounded-lg border border-slate-200 shadow-sm" />
                
                {/* Geotag Stamp Overlay */}
                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/85 text-white p-2 rounded-lg text-[10px] font-mono text-left space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-emerald-400">
                    <span>GPS GEO-STAMPED</span>
                    <span>Acc: ±{gps?.accuracy || 8}m</span>
                  </div>
                  <div className="truncate text-slate-300">
                    LAT: {gps?.lat?.toFixed(6) || '22.386221'} | LNG: {gps?.lng?.toFixed(6) || '71.064316'}
                  </div>
                  <div className="text-[9px] text-slate-400 flex justify-between">
                    <span>CAT: {selectedCategory}</span>
                    <span>OFFICER: FO-007</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3 py-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-gov-700 mx-auto flex items-center justify-center border border-blue-100">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">Tap to Capture or Upload Photo</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Physical survey stones, markers, crop condition</p>
                </div>

                {/* Mobile Camera & File Triggers */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={cameraInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center gap-1.5 bg-gov-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Open Camera</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 bg-white text-slate-700 border border-slate-300 font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm active:scale-95"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload File</span>
                  </button>
                </div>

                {/* Demonstration Quick presets */}
                <div className="pt-2 border-t border-slate-200 text-left">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    SIH Demo Presets (Instant Evidence):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSimulatePhoto('marker')}
                      className="text-[11px] bg-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-slate-300 font-medium"
                    >
                      📷 Survey Marker 1042
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSimulatePhoto('boundary')}
                      className="text-[11px] bg-amber-100 text-amber-800 px-2 py-1 rounded hover:bg-amber-200 font-medium"
                    >
                      📷 Boundary Mismatch
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSimulatePhoto('structure')}
                      className="text-[11px] bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 font-medium"
                    >
                      📷 Farm Shed
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* GPS Info Pill */}
          <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>GPS Available (±{gps?.accuracy || 8}m)</span>
            </div>
            <span className="font-mono text-[11px] text-slate-500">
              {gps?.lat ? `${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)}` : 'Demo GPS Active'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!preview}
            onClick={handleSave}
            className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow flex items-center gap-1.5 ${
              preview ? 'bg-gov-800 hover:bg-gov-700 active:scale-95' : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Confirm & Attach Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
""")

# 3. FieldLayout.jsx
with open(os.path.join(base, "layout", "FieldLayout.jsx"), "w", encoding="utf-8") as f:
    f.write("""import React, { useState, useEffect } from 'react';
import {
  Home,
  ClipboardList,
  Map as MapIcon,
  Clock,
  User,
  Wifi,
  WifiOff,
  RefreshCw,
  Bell,
  ShieldCheck
} from 'lucide-react';
import { offlineStorage } from '../../services/offlineStorage';

export default function FieldLayout({
  activeTab = 'home',
  onTabChange,
  children,
  officer = { name: 'Amit B. Parmar', officer_id: 'FO-007' },
  onSyncNow
}) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(offlineStorage.getPendingCount());
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const interval = setInterval(() => {
      setPendingCount(offlineStorage.getPendingCount());
    }, 2000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleManualSync = async () => {
    if (onSyncNow) {
      setIsSyncing(true);
      await onSyncNow();
      setIsSyncing(false);
      setPendingCount(offlineStorage.getPendingCount());
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between select-none max-w-md mx-auto border-x border-slate-200 shadow-xl relative">
      {/* 1. TOP OFFICIAL GOVERNMENT HEADER */}
      <header className="bg-gov-900 text-white sticky top-0 z-40 shadow-md">
        {/* Government Strip */}
        <div className="bg-slate-950 px-3.5 py-1 text-[10px] text-slate-300 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="font-semibold tracking-wider uppercase">Govt of India • MoRD • DoLR</span>
          </div>
          <div className="flex items-center gap-2 font-mono">
            <span>SIH-26016</span>
          </div>
        </div>

        {/* App Title & Officer Badge Bar */}
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gov-800 border border-gov-700 flex items-center justify-center text-sky-300 shadow">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-sm tracking-tight text-white">N-LAMS Field</h1>
                <span className="text-[9px] font-mono bg-sky-950 text-sky-300 border border-sky-800 px-1.5 py-0.2 rounded font-bold">
                  2.4 PWA
                </span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium">Ground Verification Inspection</p>
            </div>
          </div>

          {/* Sync & Connectivity Indicator */}
          <div className="flex items-center gap-1.5">
            {isOnline ? (
              <span className="flex items-center gap-1 bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span>Online</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-amber-950/80 text-amber-300 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span>Offline</span>
              </span>
            )}

            {/* Sync Pill */}
            {pendingCount > 0 ? (
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync ({pendingCount})</span>
              </button>
            ) : (
              <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                ✓ Synced
              </span>
            )}
          </div>
        </div>
      </header>

      {/* 2. SCROLLABLE MAIN VIEWPORT */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* 3. MOBILE BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 z-40 shadow-lg px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'home' ? 'text-gov-800 font-bold bg-blue-50' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        <button
          onClick={() => onTabChange('tasks')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all relative ${
            activeTab === 'tasks' ? 'text-gov-800 font-bold bg-blue-50' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Tasks</span>
          <span className="absolute -top-0.5 right-1 w-4 h-4 bg-gov-700 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
            5
          </span>
        </button>

        <button
          onClick={() => onTabChange('map')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'map' ? 'text-gov-800 font-bold bg-blue-50' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <MapIcon className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Map</span>
        </button>

        <button
          onClick={() => onTabChange('history')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'history' ? 'text-gov-800 font-bold bg-blue-50' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">History</span>
        </button>

        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'profile' ? 'text-gov-800 font-bold bg-blue-50' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>
      </nav>
    </div>
  );
}
""")

print("SUCCESS: StatusBadge.jsx, CameraCaptureModal.jsx, and FieldLayout.jsx created!")
