import React, { useState } from 'react';
import { BloodBank, BloodGroup, Language, DistrictArea } from '../types';
import { getT } from '../translations';
import {
  Droplet,
  PhoneCall,
  MapPin,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Heart,
  Info,
  Calendar,
} from 'lucide-react';

interface BloodPageProps {
  lang: Language;
  bloodBanks: BloodBank[];
  onOpenReport: (name: string, id: string) => void;
}

export const BloodPage: React.FC<BloodPageProps> = ({
  lang,
  bloodBanks,
  onOpenReport,
}) => {
  const t = getT(lang);
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'All'>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All');

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const areas = ['Hafizabad City', 'Pindi Bhattian', 'Jalalpur Bhattian', 'Sukheke Mandi'];

  // Filter blood banks by area
  const filteredBanks = bloodBanks.filter((bank) => {
    if (selectedArea !== 'All' && bank.area !== selectedArea) return false;
    return true;
  });

  const getStatusBadge = (status: 'Available' | 'Not Available' | 'Unknown') => {
    if (status === 'Available') {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Available
        </span>
      );
    }
    if (status === 'Not Available') {
      return (
        <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 font-bold text-xs px-2.5 py-1 rounded-full">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          Not Available
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-medium text-xs px-2.5 py-1 rounded-full">
        <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
        Unknown
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title & Emergency Disclaimer */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 mb-1">
          <Droplet className="w-4 h-4 text-rose-600" />
          <span>Hafizabad District Blood Transfusion Network</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Blood Banks & Blood Availability in Hafizabad
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl">
          {t.bloodSubtitle}
        </p>
      </div>

      {/* Strict Mandatory Warning Banner */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 mb-8 flex items-start gap-3.5 shadow-xs">
        <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-amber-900 font-bold text-sm sm:text-base">
            Important Blood Verification Notice
          </h2>
          <p className="text-amber-800 text-xs sm:text-sm mt-0.5 leading-relaxed">
            <strong>“{t.bloodWarning}”</strong> Blood availability status is only shown as "Available" when confirmed by authorized hospital staff. Blood component units change minute-by-minute with emergency surgeries.
          </p>
        </div>
      </div>

      {/* Filter Selector Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs mb-8 space-y-4">
        {/* Blood Group Buttons */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Blood Group
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
            <button
              onClick={() => setSelectedGroup('All')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                selectedGroup === 'All'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Groups
            </button>
            {bloodGroups.map((bg) => (
              <button
                key={bg}
                onClick={() => setSelectedGroup(bg)}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${
                  selectedGroup === bg
                    ? 'bg-rose-600 text-white shadow-xs scale-105'
                    : 'bg-rose-50/70 text-rose-900 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <Droplet className="w-3.5 h-3.5 fill-current" />
                <span>{bg}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Area Filter */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Filter by Area:</span>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="All">All District Areas</option>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-500">
            Showing <span className="font-bold text-slate-800">{filteredBanks.length}</span> verified transfusion facility centers
          </div>
        </div>
      </div>

      {/* Facilities & Blood Inventory Grid */}
      <div className="space-y-6">
        {filteredBanks.map((bank) => {
          return (
            <div
              key={bank.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-6 sm:p-8"
            >
              {/* Facility Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold mb-1">
                    <span className="text-rose-700 font-bold">{bank.facilityType}</span>
                    <span>·</span>
                    <span className="text-slate-500">{bank.area}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {bank.facilityName}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{bank.address}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`https://maps.google.com/?q=${bank.coordinates.lat},${bank.coordinates.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Get Directions</span>
                  </a>
                  <a
                    href={`tel:${bank.phone}`}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Blood Bank ({bank.phone})</span>
                  </a>
                </div>
              </div>

              {/* Factual Notes & Verification Source */}
              <div className="my-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <strong>Official Policy:</strong> {bank.notes}
                </div>
                <div className="text-slate-500 shrink-0">
                  Authority: {bank.verificationSource}
                </div>
              </div>

              {/* Blood Inventory Status Grid */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Blood Group Availability (Updated by Facility)
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
                  {bloodGroups
                    .filter((bg) => selectedGroup === 'All' || selectedGroup === bg)
                    .map((bg) => {
                      const item = bank.inventory[bg];
                      const status = item ? item.status : 'Unknown';

                      return (
                        <div
                          key={bg}
                          className={`p-3 rounded-2xl border text-center transition-all flex flex-col justify-between ${
                            status === 'Available'
                              ? 'bg-emerald-50/60 border-emerald-300'
                              : status === 'Not Available'
                              ? 'bg-rose-50/40 border-rose-200'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div>
                            <div className="text-lg font-black text-slate-900 mb-1">
                              {bg}
                            </div>
                            <div className="mb-2">{getStatusBadge(status)}</div>
                          </div>

                          <div className="text-[10px] text-slate-400 border-t border-slate-200/60 pt-1.5 mt-1">
                            <div>{item?.lastUpdated || 'Recent'}</div>
                            <div className="truncate text-slate-500">{item?.updatedBy || 'Staff'}</div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-6 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Last Inventory Sync: {bank.lastUpdated}</span>
                </div>
                <button
                  onClick={() => onOpenReport(bank.facilityName, bank.id)}
                  className="text-amber-700 hover:underline font-semibold"
                >
                  Report incorrect blood info
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Voluntary Blood Donor Registry Card */}
      <div className="mt-12 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Heart className="w-4 h-4 fill-rose-400" />
            <span>Voluntary Blood Donation — Hafizabad</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black mb-2">
            Want to register as a voluntary blood donor in Hafizabad?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The Pakistan Red Crescent Society and DHQ Hospital maintain an emergency on-call volunteer list for rare negative groups (A-, B-, AB-, O-). When an accident or thalassemia child urgently needs blood, registered donors are called.
          </p>
        </div>
        <a
          href="tel:0547522900"
          className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shrink-0 transition-colors shadow-lg"
        >
          Contact Red Crescent Hafizabad (0547-522900)
        </a>
      </div>
    </div>
  );
};
