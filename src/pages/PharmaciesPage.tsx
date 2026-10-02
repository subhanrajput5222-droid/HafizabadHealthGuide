import React, { useState, useMemo } from 'react';
import { Pharmacy, Language } from '../types';
import { getT } from '../translations';
import {
  Search,
  Pill,
  PhoneCall,
  MapPin,
  Clock,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';

interface PharmaciesPageProps {
  lang: Language;
  pharmacies: Pharmacy[];
  onOpenReport: (name: string, id: string) => void;
  onOpenClaim: (name: string, id: string) => void;
}

export const PharmaciesPage: React.FC<PharmaciesPageProps> = ({
  lang,
  pharmacies,
  onOpenReport,
  onOpenClaim,
}) => {
  const t = getT(lang);
  const [search, setSearch] = useState('');
  const [only24, setOnly24] = useState(false);
  const [onlyDelivery, setOnlyDelivery] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string>('All');

  const areas = ['Hafizabad City', 'Pindi Bhattian', 'Jalalpur Bhattian', 'Sukheke Mandi'];

  const filteredPharmacies = useMemo(() => {
    return pharmacies.filter((p) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q) || p.nameUrdu.includes(q);
        const matchAddr = p.address.toLowerCase().includes(q);
        if (!matchName && !matchAddr) return false;
      }
      if (only24 && !p.is24_7) return false;
      if (onlyDelivery && !p.homeDelivery) return false;
      if (selectedArea !== 'All' && p.area !== selectedArea) return false;
      return true;
    });
  }, [pharmacies, search, only24, onlyDelivery, selectedArea]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 mb-1">
          <Pill className="w-4 h-4 text-indigo-600" />
          <span>Drug Control Authority Licensed Stores</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Pharmacies & Medical Stores in Hafizabad
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl">
          Locate licensed retail pharmacies, round-the-clock 24/7 medical stores, and prescription home-delivery providers across Hafizabad District.
        </p>
      </div>

      {/* Control & Search */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find Pharmacy in Hafizabad (e.g. Servaid, Fazal Din, Al-Shifa)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#034694] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Areas ({pharmacies.length})</option>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Filter Checkboxes */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100">
            <input
              type="checkbox"
              checked={only24}
              onChange={(e) => setOnly24(e.target.checked)}
              className="rounded-sm text-[#034694]"
            />
            <span className="font-bold text-slate-800">24/7 Night Open Only</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100">
            <input
              type="checkbox"
              checked={onlyDelivery}
              onChange={(e) => setOnlyDelivery(e.target.checked)}
              className="rounded-sm text-[#034694]"
            />
            <span className="font-bold text-slate-800">Home Delivery Available</span>
          </label>

          {(only24 || onlyDelivery || search || selectedArea !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setOnly24(false);
                setOnlyDelivery(false);
                setSelectedArea('All');
              }}
              className="text-slate-500 hover:text-slate-800 underline text-xs ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filteredPharmacies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPharmacies.map((pharm) => (
            <div
              key={pharm.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-500 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block mb-0.5">
                      {pharm.area}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      {pharm.name}
                    </h2>
                    <p className="text-xs font-urdu text-slate-500">{pharm.nameUrdu}</p>
                  </div>

                  {pharm.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md shrink-0">
                      Information not verified
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 mb-3 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{pharm.address}</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Timings:
                    </span>
                    <span className={`font-bold ${pharm.is24_7 ? 'text-red-700' : 'text-slate-800'}`}>
                      {pharm.is24_7 ? '24 Hours / 7 Days' : pharm.openingHours}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-slate-500" />
                      Home Delivery:
                    </span>
                    <span className={pharm.homeDelivery ? 'font-bold text-emerald-700' : 'text-slate-400'}>
                      {pharm.homeDelivery ? '✓ Available' : '✗ In-store only'}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between mb-3 border-t border-slate-100 pt-2">
                  <span className="truncate max-w-[200px]">{pharm.verificationSource}</span>
                  <span>{pharm.lastUpdated}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={`https://maps.google.com/?q=${pharm.coordinates.lat},${pharm.coordinates.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 text-xs font-semibold flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Map</span>
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenClaim(pharm.name, pharm.id)}
                    className="text-[11px] text-slate-400 hover:text-slate-600 px-1.5 py-1"
                  >
                    Claim
                  </button>
                  <a
                    href={`tel:${pharm.phone}`}
                    className="px-3.5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Store</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-base mb-1">
            No Pharmacies Found
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Try adjusting your search query or clear filters.
          </p>
        </div>
      )}
    </div>
  );
};
