import React from 'react';
import { Logo } from './Logo';
import { Language } from '../types';
import { getT } from '../translations';
import {
  PhoneCall,
  ShieldAlert,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
  FileText,
  MapPin,
} from 'lucide-react';

interface FooterProps {
  lang: Language;
  onNavigate: (tab: string) => void;
  onOpenClaim: () => void;
  onOpenReport: () => void;
  onOpenLegal: (type: 'privacy' | 'terms' | 'disclaimer') => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onNavigate,
  onOpenClaim,
  onOpenReport,
  onOpenLegal,
}) => {
  const t = getT(lang);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Prominent Mandatory Medical Disclaimer Banner */}
        <div className="mb-12 bg-slate-800/80 border border-amber-500/30 rounded-2xl p-5 md:p-6 backdrop-blur-xs shadow-md">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-amber-300 font-bold text-base mb-1">
                  {lang === 'ur' ? 'اہم طبی انتباہ اور دستبرداری' : 'Official Public Health Disclaimer'}
                </h4>
                <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-4xl">
                  {t.disclaimerText}
                </p>
              </div>
            </div>
            <a
              href="tel:1122"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shrink-0 transition-colors shadow-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Rescue 1122</span>
            </a>
          </div>
        </div>

        {/* 4-Column Directory Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand Info */}
          <div>
            <div className="mb-4">
              <Logo variant="horizontal" size={42} showTagline={true} />
            </div>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-4">
              {lang === 'ur'
                ? 'حافظ آباد، پنڈی بھٹیاں اور جلال پور بھٹیاں کے شہریوں کے لیے تصدیق شدہ طبی رہنمائی کا قابلِ اعتماد پلیٹ فارم۔'
                : 'A reliable, verified healthcare information initiative for Hafizabad District, Punjab, Pakistan. Serving Hafizabad City, Pindi Bhattian, Jalalpur Bhattian and surrounding tehsils.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-lg w-fit">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Public Verification & Transparency</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              Quick Directory Links
            </h3>
            <ul className="space-y-2.5 text-xs md:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('hospitals')}
                  className="hover:text-white transition-colors"
                >
                  Hospitals (DHQ & Private)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('doctors')}
                  className="hover:text-white transition-colors"
                >
                  Doctors & Specialists Roster
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('find-doctor')}
                  className="hover:text-white transition-colors text-indigo-300 font-medium"
                >
                  Find Doctor & Service Matcher
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('eyecare')}
                  className="hover:text-white transition-colors text-teal-300 font-medium"
                >
                  Eye & Eyesight Care Section
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blood')}
                  className="hover:text-white transition-colors text-rose-300 font-semibold"
                >
                  Blood Banks & Inventory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pharmacies')}
                  className="hover:text-white transition-colors"
                >
                  Pharmacies & 24/7 Medical Stores
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('labs')}
                  className="hover:text-white transition-colors"
                >
                  Laboratories & Diagnostics (X-Ray/CT)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('emergency-helplines')}
                  className="hover:text-white transition-colors text-red-400 font-bold flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  <span>Emergency Helplines</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('map')}
                  className="hover:text-white transition-colors"
                >
                  Interactive District Health Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('compare')}
                  className="hover:text-white transition-colors"
                >
                  Hospital Service Comparison
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Areas & Facility Verification */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              District Tehsils & Areas
            </h3>
            <div className="space-y-2 text-xs md:text-sm text-slate-400 mb-6">
              <div className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">Hafizabad City</span> (DHQ, Trauma Center, Alipur Rd)
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">Pindi Bhattian</span> (THQ, Hospital Rd, M-2)
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">Jalalpur Bhattian</span> (Main Bazaar & Clinics)
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">Sukheke Mandi</span> & District Rural Health Centers
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={onOpenClaim}
                className="w-full text-left text-xs bg-slate-800 hover:bg-slate-700 text-blue-300 px-3 py-2 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Are you a Hospital or Clinic? Claim Listing</span>
                <HeartHandshake className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onOpenReport}
                className="w-full text-left text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-2 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Found an error? Report Incorrect Info</span>
                <FileText className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Col 4: Emergency Hotlines */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-red-500 pl-2">
              District Emergency Numbers
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="bg-red-950/40 border border-red-800/40 p-2.5 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-red-300 font-bold">Rescue 1122 (Ambulance)</div>
                  <div className="text-slate-400 text-[11px]">Free emergency response</div>
                </div>
                <a href="tel:1122" className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-md font-bold">
                  1122
                </a>
              </div>

              <div className="bg-slate-800/80 p-2.5 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">DHQ Hospital Casualty</div>
                  <div className="text-slate-400 text-[11px]">Emergency Desk Hafizabad</div>
                </div>
                <a href="tel:0547521088" className="text-blue-400 font-mono font-bold hover:underline">
                  0547-521088
                </a>
              </div>

              <div className="bg-slate-800/80 p-2.5 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">THQ Pindi Bhattian</div>
                  <div className="text-slate-400 text-[11px]">Emergency Unit</div>
                </div>
                <a href="tel:0547531122" className="text-blue-400 font-mono font-bold hover:underline">
                  0547-531122
                </a>
              </div>

              <div className="bg-slate-800/80 p-2.5 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">Edhi Ambulance</div>
                  <div className="text-slate-400 text-[11px]">Inter-city Transfers</div>
                </div>
                <a href="tel:115" className="text-amber-400 font-mono font-bold hover:underline">
                  115
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Hafizabad Health Guide (HHG). All verified factual data compiled for public service.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-slate-300 transition-colors"
            >
              Terms & Conditions
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenLegal('disclaimer')}
              className="hover:text-slate-300 transition-colors"
            >
              Medical Disclaimer
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
