import React, { useState, useEffect, useRef } from 'react';
import { Hospital, Pharmacy, Laboratory, BloodBank, Language } from '../types';
import {
  MapPin,
  Search,
  Filter,
  Navigation,
  PhoneCall,
  ExternalLink,
  ShieldCheck,
  Building2,
  Pill,
  Droplet,
  FlaskConical,
  Activity,
} from 'lucide-react';
import L from 'leaflet';

interface MapPageProps {
  lang: Language;
  hospitals: Hospital[];
  pharmacies: Pharmacy[];
  laboratories: Laboratory[];
  bloodBanks: BloodBank[];
  onSelectHospital: (h: Hospital) => void;
}

export const MapPage: React.FC<MapPageProps> = ({
  lang,
  hospitals,
  pharmacies,
  laboratories,
  bloodBanks,
  onSelectHospital,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeCategory, setActiveCategory] = useState<
    'all' | 'hospitals' | 'emergency' | 'pharmacies' | 'labs' | 'blood'
  >('all');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Default center: Hafizabad City Center
  const defaultCenter: [number, number] = [32.0678, 73.6872];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create map
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 13,
      zoomControl: true,
    });

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Hafizabad Health Guide',
      maxZoom: 19,
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const markersGroup = markersLayerRef.current;
    markersGroup.clearLayers();

    const items: Array<{
      id: string;
      name: string;
      category: string;
      area: string;
      address: string;
      phone: string;
      coords: { lat: number; lng: number };
      color: string;
      data: any;
    }> = [];

    // Hospitals
    if (activeCategory === 'all' || activeCategory === 'hospitals' || activeCategory === 'emergency') {
      hospitals.forEach((h) => {
        if (activeCategory === 'emergency' && !h.emergency24_7 && !h.services.emergency) return;
        items.push({
          id: h.id,
          name: h.name,
          category: h.type + ' Hospital',
          area: h.area,
          address: h.address,
          phone: h.phone,
          coords: h.coordinates,
          color: h.emergency24_7 ? '#dc2626' : '#034694',
          data: h,
        });
      });
    }

    // Pharmacies
    if (activeCategory === 'all' || activeCategory === 'pharmacies') {
      pharmacies.forEach((p) => {
        items.push({
          id: p.id,
          name: p.name,
          category: 'Pharmacy',
          area: p.area,
          address: p.address,
          phone: p.phone,
          coords: p.coordinates,
          color: '#4f46e5',
          data: p,
        });
      });
    }

    // Labs
    if (activeCategory === 'all' || activeCategory === 'labs') {
      laboratories.forEach((l) => {
        items.push({
          id: l.id,
          name: l.name,
          category: 'Diagnostic Laboratory',
          area: l.area,
          address: l.address,
          phone: l.phone,
          coords: l.coordinates,
          color: '#0d9488',
          data: l,
        });
      });
    }

    // Blood Banks
    if (activeCategory === 'all' || activeCategory === 'blood') {
      bloodBanks.forEach((b) => {
        items.push({
          id: b.id,
          name: b.facilityName,
          category: 'Blood Bank',
          area: b.area,
          address: b.address,
          phone: b.phone,
          coords: b.coordinates,
          color: '#e11d48',
          data: b,
        });
      });
    }

    // Filter by area and search query
    const filtered = items.filter((item) => {
      if (selectedArea !== 'All' && item.area !== selectedArea) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!item.name.toLowerCase().includes(q) && !item.address.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });

    // Add markers to map
    filtered.forEach((item) => {
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="background-color: ${item.color}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      const marker = L.marker([item.coords.lat, item.coords.lng], { icon: customIcon });

      const popupHtml = `
        <div style="font-family: inherit; font-size: 13px; max-width: 220px; line-height: 1.4;">
          <div style="font-size: 10px; font-weight: bold; color: ${item.color}; text-transform: uppercase;">
            ${item.category}
          </div>
          <div style="font-weight: 800; font-size: 14px; color: #0f172a; margin: 2px 0;">
            ${item.name}
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 8px;">
            ${item.address}
          </div>
          <div style="display: flex; gap: 6px;">
            <a href="tel:${item.phone}" style="background-color: #034694; color: white; padding: 4px 10px; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: bold;">
              Call: ${item.phone}
            </a>
            <a href="https://maps.google.com/?q=${item.coords.lat},${item.coords.lng}" target="_blank" style="background-color: #e2e8f0; color: #0f172a; padding: 4px 8px; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: bold;">
              Directions
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        setSelectedItem(item);
      });
      markersGroup.addLayer(marker);
    });

    // Zoom to area if specific
    if (selectedArea === 'Pindi Bhattian') {
      mapInstanceRef.current.setView([31.8985, 73.2764], 14);
    } else if (selectedArea === 'Jalalpur Bhattian') {
      mapInstanceRef.current.setView([32.0833, 73.3833], 14);
    } else if (selectedArea === 'Sukheke Mandi') {
      mapInstanceRef.current.setView([31.865, 73.508], 14);
    } else {
      mapInstanceRef.current.setView(defaultCenter, 13);
    }
  }, [activeCategory, selectedArea, search, hospitals, pharmacies, laboratories, bloodBanks]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#034694]" />
            <span>Interactive Healthcare Map of Hafizabad</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            OpenStreetMap verified locations of hospitals, 24/7 emergency rooms, pharmacies, and blood banks.
          </p>
        </div>

        {/* Area Zoom Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Tehsil Zoom:</span>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs focus:outline-hidden"
          >
            <option value="All">Hafizabad District View</option>
            <option value="Hafizabad City">Hafizabad City (Center)</option>
            <option value="Pindi Bhattian">Pindi Bhattian Tehsil</option>
            <option value="Jalalpur Bhattian">Jalalpur Bhattian</option>
            <option value="Sukheke Mandi">Sukheke Mandi</option>
          </select>
        </div>
      </div>

      {/* Map Filter Controls Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Facilities
          </button>
          <button
            onClick={() => setActiveCategory('hospitals')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeCategory === 'hospitals'
                ? 'bg-[#034694] text-white shadow-2xs'
                : 'bg-blue-50 text-[#034694] hover:bg-blue-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Hospitals</span>
          </button>
          <button
            onClick={() => setActiveCategory('emergency')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeCategory === 'emergency'
                ? 'bg-red-600 text-white shadow-2xs'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>24/7 Emergency</span>
          </button>
          <button
            onClick={() => setActiveCategory('pharmacies')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeCategory === 'pharmacies'
                ? 'bg-indigo-700 text-white shadow-2xs'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Pharmacies</span>
          </button>
          <button
            onClick={() => setActiveCategory('labs')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeCategory === 'labs'
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Labs</span>
          </button>
          <button
            onClick={() => setActiveCategory('blood')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeCategory === 'blood'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
            <span>Blood Banks</span>
          </button>
        </div>

        {/* Quick Filter Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search facility name on map..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
          />
        </div>
      </div>

      {/* Map Container Viewport */}
      <div className="relative w-full h-[65vh] min-h-[420px] rounded-3xl overflow-hidden border border-slate-300 shadow-md">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Quick Legend */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-lg text-[11px] font-semibold text-slate-700 flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#034694]" />
            <span>Hospitals</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600" />
            <span>24/7 Emergency</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-600" />
            <span>Pharmacies</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-teal-600" />
            <span>Labs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-600" />
            <span>Blood Banks</span>
          </div>
        </div>
      </div>

      {/* Selected Facility Drawer below map */}
      {selectedItem && (
        <div className="mt-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-bottom-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
              <span>{selectedItem.category}</span>
              <span>·</span>
              <span>{selectedItem.area}</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">{selectedItem.name}</h3>
            <p className="text-xs text-slate-600">📍 {selectedItem.address}</p>
          </div>

          <div className="flex items-center gap-2">
            {selectedItem.data && 'departments' in selectedItem.data && (
              <button
                onClick={() => onSelectHospital(selectedItem.data)}
                className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#034694] font-bold text-xs rounded-xl"
              >
                View Full Details
              </button>
            )}
            <a
              href={`https://maps.google.com/?q=${selectedItem.coords.lat},${selectedItem.coords.lng}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Get Directions</span>
            </a>
            <a
              href={`tel:${selectedItem.phone}`}
              className="px-4 py-2 bg-[#034694] hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call ({selectedItem.phone})</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
