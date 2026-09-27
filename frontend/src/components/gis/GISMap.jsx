import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, LayersControl, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, AlertTriangle, CheckCircle, Clock, Shield, Search, Filter, RefreshCw, Compass } from 'lucide-react';
import { api } from '../../services/api';

// Fix Leaflet marker icon asset issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapFlyTo({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 16, { duration: 1.0 });
    }
  }, [coords, map]);
  return null;
}

export default function GISMap({ onSelectParcel }) {
  const center = [22.3862, 71.0676];
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [flyCoords, setFlyCoords] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = { project_id: 'NH-GJ-2026-001' };
        if (filterStatus !== 'ALL') {
          queryParams.acquisition_status = filterStatus;
        }
        const data = await api.getMap(queryParams);
        if (!data || !data.features) {
          throw new Error('GIS service unavailable');
        }
        const feats = data.features.map(f => {
          const props = f.properties || {};
          const khasra = String(props.khasra_number || props.khasra_no || props.survey_number || props.id || '').replace(/^P-/, '').replace(/^Sur-/, '');
          return {
            ...props,
            id: f.id || props.id || props.parcel_id,
            khasra_number: khasra || '1042',
            khasra_no: khasra || '1042',
            survey_number: props.survey_number || khasra,
            geometry: f.geometry
          };
        });
        setParcels(feats);
        const hero = feats.find(p => p.khasra_number === '1042');
        if (hero) setSelectedParcel(hero);
        else if (feats.length > 0) setSelectedParcel(feats[0]);
      } catch (err) {
        console.error('Failed to load GIS data in GISMap:', err);
        setError('GIS service unavailable');
        setParcels([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [filterStatus]);

  const getStyle = (p) => {
    const isSelected = selectedParcel && (
      String(selectedParcel.id) === String(p.id) ||
      String(selectedParcel.khasra_number) === String(p.khasra_number)
    );
    if (isSelected) {
      return {
        color: '#2563eb', // Blue border when selected
        weight: 4,
        fillColor: '#3b82f6',
        fillOpacity: 0.2
      };
    }
    const risk = (p.risk_level || '').toUpperCase();
    let borderColor = '#16a34a'; // Green: Low
    let fillColor = '#22c55e';
    if (risk === 'CRITICAL' || p.khasra_number === '1042') {
      borderColor = '#dc2626'; // Red: Critical
      fillColor = '#ef4444';
    } else if (risk === 'HIGH') {
      borderColor = '#ea580c'; // Orange: High
      fillColor = '#f97316';
    } else if (risk === 'MEDIUM') {
      borderColor = '#f59e0b'; // Amber: Medium
      fillColor = '#fbbf24';
    }
    return {
      color: borderColor,
      weight: 2,
      fillColor: fillColor,
      fillOpacity: 0.08
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 my-6">
      {/* Header Controls */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-700" />
            <h2 className="text-xl font-bold text-[#0b2545]">
              GIS Cadastral Spatial Map — <span className="text-blue-700">Project NH-GJ-2026-001</span>
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase font-mono">
              POSTGIS LIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time PostGIS GeoJSON vector stream directly queried from database. Click any polygon to inspect plot details.
          </p>
        </div>

        {/* Filters & Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="font-semibold text-slate-700">Status Filter:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Parcels ({parcels.length})</option>
              <option value="ACQUIRED">🟢 Acquired Land</option>
              <option value="UNDER PROCESS">🟡 Under Process</option>
              <option value="DISPUTED">🔴 Disputed / Critical</option>
            </select>
          </div>

          <a
            href="/operational-gis"
            className="flex items-center space-x-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 px-3 py-1.5 rounded-lg font-bold transition-colors"
          >
            <span>Full GIS Studio</span>
            <Compass className="w-3.5 h-3.5 text-blue-700" />
          </a>
        </div>
      </div>

      {loading && (
        <div className="h-[480px] rounded-xl flex items-center justify-center bg-slate-50 border border-slate-200">
          <div className="flex items-center space-x-2 text-slate-600 text-sm font-bold">
            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
            <span>Loading PostGIS GeoJSON Vectors...</span>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="h-[480px] rounded-xl flex items-center justify-center bg-rose-50 border border-rose-200">
          <div className="text-center space-y-1">
            <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto" />
            <div className="text-rose-900 font-bold">{error}</div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Leaflet GIS Canvas */}
          <div className="lg:col-span-2 h-[480px] rounded-xl overflow-hidden shadow-inner border border-slate-300 relative">
            <MapContainer center={center} zoom={16} scrollWheelZoom={false} className="w-full h-full">
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Satellite Imagery">
                  <TileLayer
                    attribution="Tiles &copy; Esri"
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="OpenStreetMap Standard">
                  <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </LayersControl.BaseLayer>
              </LayersControl>

              <MapFlyTo coords={flyCoords} />

              {parcels.map((parcel) => {
                if (!parcel.geometry || !parcel.geometry.coordinates || !parcel.geometry.coordinates[0]) return null;
                const coords = parcel.geometry.coordinates[0].map(c => [c[1], c[0]]);
                const style = getStyle(parcel);
                const isHero = parcel.khasra_number === '1042';

                return (
                  <Polygon
                    key={parcel.id}
                    positions={coords}
                    pathOptions={style}
                    eventHandlers={{
                      click: () => {
                        setSelectedParcel(parcel);
                        if (onSelectParcel) onSelectParcel(parcel);
                        if (parcel.gps_lat && parcel.gps_lng) {
                          setFlyCoords([parcel.gps_lat, parcel.gps_lng]);
                        }
                      }
                    }}
                  >
                    <Tooltip permanent direction="center" className={isHero ? 'khasra-field-label-hero' : 'khasra-field-label'}>
                      <span>{parcel.survey_number || parcel.khasra_number}</span>
                    </Tooltip>
                  </Polygon>
                );
              })}
            </MapContainer>
          </div>

          {/* Right 1 Col: Selected Parcel Dossier */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
            {selectedParcel ? (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 font-mono">PARCEL DOSSIER</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase ${
                      selectedParcel.risk_level === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                      selectedParcel.risk_level === 'HIGH' ? 'text-orange-800 bg-orange-100 border-orange-300' : 'text-emerald-800 bg-emerald-100 border-emerald-300'
                    }`}>
                      {selectedParcel.risk_level} RISK
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-1">
                    Khasra {selectedParcel.survey_number || selectedParcel.khasra_number}
                  </h3>
                  <p className="text-xs text-slate-600">{selectedParcel.village}, {selectedParcel.district}</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Total Area:</span>
                    <span className="font-bold text-slate-900">{selectedParcel.area_ha || selectedParcel.area} Hectares</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Primary Owner:</span>
                    <span className="font-semibold text-slate-800">{selectedParcel.primary_owner || 'Suresh Patel & Co.'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Acquisition Status:</span>
                    <span className="font-bold text-slate-900">{selectedParcel.acquisition_status}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Compensation:</span>
                    <span className="font-semibold text-slate-800">{selectedParcel.compensation_status}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Legal Status:</span>
                    <span className={`font-semibold ${selectedParcel.legal_status === 'Disputed' ? 'text-rose-700 font-bold' : 'text-slate-800'}`}>
                      {selectedParcel.legal_status || 'Clear'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Field Truthing:</span>
                    <span className="font-semibold text-slate-800">{selectedParcel.field_verification_status}</span>
                  </div>
                </div>

                <div className="pt-3">
                  <a
                    href="/operational-gis"
                    className="block w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center rounded-lg transition-colors"
                  >
                    Open in Full Operational GIS Studio
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Click any cadastral parcel polygon on the map to inspect.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
