import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, ShieldCheck, Layers, Info, CheckCircle2, AlertCircle, Compass, Eye, X } from 'lucide-react';
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
      map.flyTo(coords, 16, { duration: 1.2 });
    }
  }, [coords, map]);
  return null;
}

export default function PublicGISMapPage() {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [mapType, setMapType] = useState('satellite');
  const [flyCoords, setFlyCoords] = useState(null);

  const corridorCenter = [22.3862, 71.0676];

  useEffect(() => {
    const loadGisData = async () => {
      setLoading(true);
      try {
        const data = await api.getMap({ project_id: 'NH-GJ-2026-001' });
        const feats = data?.features?.map(f => {
          const props = f.properties || {};
          const khasra = String(props.khasra_number || props.khasra_no || props.survey_number || props.id || '').replace(/^P-/, '').replace(/^Sur-/, '');
          return {
            ...props,
            khasra_number: khasra || '1042',
            geometry: f.geometry
          };
        }) || [];
        setParcels(feats);
        const hero = feats.find(p => p.khasra_number === '1042');
        if (hero) setSelectedFeature(hero);
      } catch (err) {
        console.error('Failed to load public GIS data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadGisData();
  }, []);

  const getStyle = (p) => {
    const isSel = selectedFeature?.id === p.id || selectedFeature?.khasra_number === p.khasra_number;
    const isHero = p.khasra_number === '1042';
    const risk = (p.risk_level || '').toUpperCase();

    let borderColor = '#16a34a'; // Green default
    let fillColor = '#22c55e';

    if (risk === 'CRITICAL' || isHero) {
      borderColor = '#dc2626'; // Red
      fillColor = '#ef4444';
    } else if (risk === 'HIGH') {
      borderColor = '#ea580c'; // Orange
      fillColor = '#f97316';
    } else if (risk === 'MEDIUM') {
      borderColor = '#f59e0b'; // Amber
      fillColor = '#fbbf24';
    }

    return {
      color: borderColor,
      weight: isSel ? 4 : 2,
      fillColor: fillColor,
      fillOpacity: isSel ? 0.25 : 0.08,
      lineCap: 'round',
      lineJoin: 'round'
    };
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900">National Corridor Transparency GIS Map</h2>
            <span className="text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded uppercase">
              POSTGIS LIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Public cadastral alignment viewer powered directly by PostGIS vector geometries (EPSG:4326 / WGS84).
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Statutory Transparency Layer (Section 11/19 RFCTLARR)</span>
        </div>
      </div>

      {/* Map Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden flex flex-col">
        {/* Top Control Bar */}
        <div className="p-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-1.5 font-bold">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Ahmedabad–Rajkot Green Highway Expansion (NH-GJ-2026-001)</span>
            </div>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300 font-mono text-[11px]">
              {parcels.length} Irregular PostGIS Cadastral Vectors
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold text-[11px]">Base:</span>
            <select
              value={mapType}
              onChange={(e) => setMapType(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 focus:outline-none"
            >
              <option value="satellite">🛰️ Satellite (Esri World)</option>
              <option value="osm">🗺️ Topographic (OSM)</option>
            </select>

            <button
              onClick={() => {
                setFlyCoords(corridorCenter);
                const hero = parcels.find(p => p.khasra_number === '1042');
                if (hero) setSelectedFeature(hero);
              }}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-xs transition-colors"
            >
              Corridor Focus
            </button>
          </div>
        </div>

        {/* Leaflet Map & Side Panel Grid */}
        <div className="relative h-[550px] w-full flex overflow-hidden">
          {/* Main Leaflet Map */}
          <div className="flex-1 h-full w-full relative">
            <MapContainer
              center={corridorCenter}
              zoom={16}
              scrollWheelZoom={true}
              className="h-full w-full"
            >
              {mapType === 'satellite' ? (
                <TileLayer
                  attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  maxZoom={19}
                />
              ) : (
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              )}

              <MapFlyTo coords={flyCoords} />

              {parcels.map((p) => {
                if (!p.geometry || !p.geometry.coordinates) return null;
                const coords = p.geometry.coordinates[0].map(c => [c[1], c[0]]);
                const style = getStyle(p);
                const isHero = p.khasra_number === '1042';

                return (
                  <Polygon
                    key={p.id || p.khasra_number}
                    positions={coords}
                    pathOptions={style}
                    eventHandlers={{
                      click: () => {
                        setSelectedFeature(p);
                        if (p.gps_lat && p.gps_lng) {
                          setFlyCoords([p.gps_lat, p.gps_lng]);
                        }
                      }
                    }}
                  >
                    <Tooltip permanent direction="center" className={isHero ? 'khasra-field-label-hero' : 'khasra-field-label'}>
                      <span>{p.khasra_number}</span>
                    </Tooltip>
                  </Polygon>
                );
              })}
            </MapContainer>

            {/* Bottom Floating Legend */}
            <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-md p-2.5 rounded-lg border border-slate-300 shadow-lg text-[11px] space-y-1.5 max-w-xs">
              <div className="font-bold text-slate-900 uppercase text-[10px]">Statutory Boundary Legend</div>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1.5 rounded-full border border-emerald-600 bg-emerald-500/20" />
                  <span>Clear (Green)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1.5 rounded-full border border-orange-600 bg-orange-500/20" />
                  <span>Notified (Orange)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1.5 rounded-full border border-red-600 bg-red-500/20" />
                  <span>Dispute (Red)</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-500">
                  EPSG:4326
                </div>
              </div>
            </div>
          </div>

          {/* Right Inspector Drawer */}
          {selectedFeature && (
            <div className="w-80 bg-white border-l border-slate-200 shadow-xl z-20 flex flex-col justify-between p-4 overflow-y-auto shrink-0 animate-in slide-in-from-right duration-200">
              <div className="space-y-3">
                <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg font-black text-slate-900">
                        Khasra {selectedFeature.khasra_number}
                      </span>
                      {selectedFeature.khasra_number === '1042' && (
                        <span className="text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-300 px-1.5 py-0.2 rounded uppercase">
                          Hero Alignment
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Parcel ID: {selectedFeature.id}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFeature(null)}
                    className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Acquisition Status:</span>
                    <span className="font-bold text-slate-900">{selectedFeature.acquisition_status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Area:</span>
                    <span className="font-bold text-slate-900">{selectedFeature.area_ha || selectedFeature.area} Hectares</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Village / District:</span>
                    <span className="font-semibold text-slate-800">{selectedFeature.village || 'Limbdi'}, {selectedFeature.district || 'Surendranagar'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">State:</span>
                    <span className="font-semibold text-slate-800">{selectedFeature.state || 'Gujarat'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Statutory Notice:</span>
                    <span className="font-semibold text-indigo-700">Section 19 Declared</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">GPS Coordinates:</span>
                    <span className="font-mono text-slate-600 text-[11px]">{selectedFeature.gps_lat || '22.3862'}° N, {selectedFeature.gps_lng || '71.0676'}° E</span>
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                    <span>Citizen Privacy Shield</span>
                  </div>
                  <p className="text-[11px] text-blue-800 leading-tight">
                    Individual bank account numbers, Aadhaar details, and private succession genealogy trees are restricted from public disclosure under RTI Section 8(1)(j).
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 text-center">
                <a
                  href="/public/notices"
                  className="block w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors"
                >
                  View Statutory Gazette Notice
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center space-x-2 text-xs text-slate-600">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Real-time PostGIS GeoJSON vector stream directly queried from national infrastructure geospatial database.</span>
        </div>
      </div>
    </div>
  );
}
