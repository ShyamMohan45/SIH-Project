import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, MapPin, AlertCircle, RotateCcw } from 'lucide-react';
import { nativeService } from '../../services/nativeService';

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
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  if (!isOpen) return null;

  const handleNativeCamera = async () => {
    setIsCapturing(true);
    try {
      const res = await nativeService.capturePhoto();
      if (res && res.dataUrl) {
        setPreview(res.dataUrl);
        const name = `Photo_${selectedCategory.replace(/\s+/g, '_')}_${Date.now().toString().slice(-4)}.${res.format || 'jpg'}`;
        setFileName(name);
      }
    } catch (err) {
      console.warn('Native camera capture fallback:', err);
      // Fallback to HTML camera input
      cameraInputRef.current?.click();
    } finally {
      setIsCapturing(false);
    }
  };

  const handleRetake = () => {
    setPreview(null);
    setFileName('');
    handleNativeCamera();
  };

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
      file_name: fileName || `Photo_${selectedCategory.replace(/\s+/g, '_')}_${Date.now().toString().slice(-4)}.jpg`,
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
                    onClick={handleNativeCamera}
                    disabled={isCapturing}
                    className="flex items-center gap-1.5 bg-gov-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{isCapturing ? 'Opening Camera...' : 'Capture Photo'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 bg-white text-slate-700 border border-slate-300 font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-sm active:scale-95"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Gallery</span>
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
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {preview && (
              <button
                type="button"
                onClick={handleRetake}
                className="px-3.5 py-2 text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 hover:bg-amber-200 rounded-xl flex items-center gap-1.5 active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RETAKE</span>
              </button>
            )}
            <button
              type="button"
              disabled={!preview}
              onClick={handleSave}
              className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow flex items-center gap-1.5 ${
                preview ? 'bg-gov-800 hover:bg-gov-700 active:scale-95' : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>USE PHOTO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
