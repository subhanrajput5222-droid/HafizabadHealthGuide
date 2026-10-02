import React, { useState } from 'react';
import { Hospital, Language } from '../types';
import { getT } from '../translations';
import {
  GitCompare,
  Plus,
  X,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Building2,
  PhoneCall,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface ComparePageProps {
  lang: Language;
  hospitals: Hospital[];
  compareList: Hospital[];
  onToggleCompare: (hospital: Hospital) => void;
  onClearCompare: () => void;
  onSelectHospital: (hospital: Hospital) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({
  lang,
  hospitals,
  compareList,
  onToggleCompare,
  onClearCompare,
  onSelectHospital,
}) => {
  const t = getT(lang);
  const [selectedToAdd, setSelectedToAdd] = useState<string>('');

  // Default selection if compare list is empty
  const activeList =
    compareList.length > 0
      ? compareList
      : [hospitals[0], hospitals[2] || hospitals[1]].filter(Boolean);

  const handleAdd = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hospId = e.target.value;
    if (!hospId) return;
    const found = hospitals.find((h) => h.id === hospId);
    if (found && !activeList.some((h) => h.id === found.id)) {
      onToggleCompare(found);
    }
    setSelectedToAdd('');
  };

  const serviceRows: Array<{ label: string; key: keyof Hospital['services'] }> = [
    { label: '24/7 Emergency Department', key: 'emergency' },
    { label: 'Clinical Pathology Laboratory', key: 'laboratory' },
    { label: 'Digital X-Ray', key: 'xRay' },
    { label: 'Ultrasound Imaging', key: 'ultrasound' },
    { label: 'CT Scan (Computed Tomography)', key: 'ctScan' },
    { label: 'MRI (Magnetic Resonance Imaging)', key: 'mri' },
    { label: 'Blood Bank / Transfusion Center', key: 'bloodBank' },
    { label: 'Ambulance Service', key: 'ambulance' },
    { label: 'Intensive Care Unit (ICU/CCU)', key: 'icu' },
    { label: 'Neonatal Nursery (NICU)', key: 'nicu' },
    { label: 'Hemodialysis Unit', key: 'dialysis' },
    { label: 'Operation Theaters', key: 'operationTheater' },
    { label: 'In-House Pharmacy', key: 'pharmacy' },
  ];

  const renderCellStatus = (val: boolean | null | undefined) => {
    if (val === true) {
      return (
        <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-xs">Yes</span>
        </div>
      );
    }
    if (val === false) {
      return (
        <div className="flex items-center justify-center gap-1 text-slate-400 font-semibold">
          <XCircle className="w-5 h-5 text-slate-400" />
          <span className="text-xs">No</span>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center gap-1 text-amber-600 font-medium">
        <HelpCircle className="w-5 h-5 text-amber-600" />
        <span className="text-xs">Unknown</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#034694] mb-1">
            <GitCompare className="w-4 h-4" />
            <span>Factual Facility Comparison</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Compare Hospitals in Hafizabad District
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl">
            Side-by-side comparison of verified clinical capabilities and diagnostic equipment. Strictly objective data without arbitrary rankings.
          </p>
        </div>

        {/* Add Hospital selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedToAdd}
            onChange={handleAdd}
            className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs focus:outline-hidden"
          >
            <option value="">+ Add Hospital to Compare</option>
            {hospitals
              .filter((h) => !activeList.some((c) => c.id === h.id))
              .map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.area})
                </option>
              ))}
          </select>

          {activeList.length > 0 && (
            <button
              onClick={onClearCompare}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 p-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 sm:p-5 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/4 min-w-[200px]">
                  Feature / Capability
                </th>
                {activeList.map((hosp) => (
                  <th
                    key={hosp.id}
                    className="p-4 sm:p-5 text-center border-l border-slate-200 min-w-[220px] w-1/3"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="text-left">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            hosp.type === 'Government'
                              ? 'text-emerald-700'
                              : 'text-blue-700'
                          }`}
                        >
                          {hosp.type} Hospital
                        </span>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                          {hosp.name}
                        </h3>
                        <span className="text-[11px] text-slate-500">{hosp.area}</span>
                      </div>
                      {activeList.length > 1 && (
                        <button
                          onClick={() => onToggleCompare(hosp)}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-3">
                      <button
                        onClick={() => onSelectHospital(hosp)}
                        className="px-2.5 py-1 bg-blue-50 text-[#034694] hover:bg-blue-100 rounded-lg text-xs font-bold"
                      >
                        View Full Page
                      </button>
                      <a
                        href={`tel:${hosp.phone}`}
                        className="px-2.5 py-1 bg-[#034694] text-white hover:bg-blue-800 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3" />
                        Call
                      </a>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {/* Emergency Status */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/30">
                  Emergency Readiness
                </td>
                {activeList.map((h) => (
                  <td key={h.id} className="p-4 text-center border-l border-slate-100">
                    <span
                      className={`font-bold ${
                        h.emergency24_7 ? 'text-red-600' : 'text-slate-600'
                      }`}
                    >
                      {h.emergency24_7 ? '24 Hours / 7 Days Active' : h.openingHours}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Service Rows */}
              {serviceRows.map((row) => (
                <tr key={row.key} className="hover:bg-slate-50/50">
                  <td className="p-4 font-medium text-slate-700 bg-slate-50/30">
                    {row.label}
                  </td>
                  {activeList.map((h) => (
                    <td key={h.id} className="p-4 text-center border-l border-slate-100">
                      {renderCellStatus(h.services[row.key])}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Key Departments */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/30">
                  Clinical Departments Count
                </td>
                {activeList.map((h) => (
                  <td key={h.id} className="p-4 text-center border-l border-slate-100">
                    <span className="font-bold text-slate-900">
                      {(h.departments || []).length} Units Listed
                    </span>
                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {(h.departments || []).slice(0, 3).join(', ')}...
                    </div>
                  </td>
                ))}
              </tr>

              {/* Verified Source */}
              <tr className="hover:bg-slate-50/50 bg-slate-50/20">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/30">
                  Data Verification Source
                </td>
                {activeList.map((h) => (
                  <td key={h.id} className="p-4 text-center border-l border-slate-100 text-[11px] text-slate-500">
                    {h.verificationSource}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparison Principles Note */}
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-[#034694] shrink-0 mt-0.5" />
        <div>
          <strong>Strictly Factual Comparison:</strong> Hafizabad Health Guide does not assign arbitrary awards, stars, or numerical rank tiers. All comparisons are strictly binary and factual based on verified on-ground medical equipment and administrative registrations.
        </div>
      </div>
    </div>
  );
};
