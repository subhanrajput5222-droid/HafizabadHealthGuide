import React, { useState } from 'react';
import { Logo } from './Logo';
import { Language } from '../types';
import { getT } from '../translations';
import {
  Search,
  PhoneCall,
  Menu,
  X,
  ShieldAlert,
  GitCompare,
  MapPin,
  Lock,
  Globe2,
  Stethoscope,
  Eye,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  setLang: (l: Language) => void;
  onOpenSearch: () => void;
  compareCount: number;
  isAdminLoggedIn?: boolean;
  onOpenAdminLogin?: () => void;
  onLogoutAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  onOpenSearch,
  compareCount,
  isAdminLoggedIn = false,
  onOpenAdminLogin,
  onLogoutAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = getT(lang);

  const navItems = [
    { id: 'home', label: t.navHome },
    { id: 'hospitals', label: t.navHospitals },
    { id: 'find-doctor', label: lang === 'ur' ? 'ڈاکٹر و سروس تلاش کریں' : 'Find Doctor & Services', highlight: true },
    { id: 'pharmacies', label: t.navPharmacies },
    { id: 'labs', label: t.navLabs },
    { id: 'blood', label: t.navBlood },
    { id: 'emergency-helplines', label: t.navEmergencyHelplines || 'Emergency Helplines', emergency: true },
    { id: 'map', label: t.navMap },
    { id: 'compare', label: t.navCompare, count: compareCount },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Emergency & Doctor Strip for instant awareness */}
      <div className="bg-red-700 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>Hafizabad Emergency Services 24/7:</span>
            <span className="hidden sm:inline font-bold">Rescue 1122 | Police 15 | Control: 0547-920111</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleNavClick('find-doctor')}
              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-0.5 rounded-full font-bold text-xs transition-colors shadow-2xs"
            >
              <Stethoscope className="w-3 h-3" />
              <span>{lang === 'ur' ? 'ڈاکٹر سروس' : 'Find Doctor'}</span>
            </button>
            <button
              onClick={() => handleNavClick('emergency-helplines')}
              className="inline-flex items-center gap-1 bg-white text-red-700 px-2.5 py-0.5 rounded-full font-bold text-xs hover:bg-red-50 transition-colors"
            >
              <ShieldAlert className="w-3 h-3 text-red-600" />
              <span className="hidden xs:inline">Emergency</span> Helplines
            </button>
            <a
              href="tel:1122"
              className="inline-flex items-center gap-1 bg-red-800 text-white px-2.5 py-0.5 rounded-full font-bold text-xs hover:bg-red-900 transition-colors"
            >
              <PhoneCall className="w-3 h-3" />
              1122
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left focus:outline-hidden cursor-pointer"
          >
            <Logo variant="horizontal" size={44} showTagline={true} />
          </button>

          {/* Desktop Nav Links (Visible on lg screens 1024px+) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = currentTab === item.id || (item.id === 'find-doctor' && (currentTab === 'find-doctor' || currentTab === 'eyecare' || currentTab === 'doctors'));
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'text-[#034694] bg-blue-50 font-bold'
                      : item.emergency
                      ? 'text-red-700 hover:bg-red-50 font-bold'
                      : item.highlight
                      ? 'text-emerald-700 hover:bg-emerald-50 font-bold'
                      : 'text-slate-700 hover:text-[#034694] hover:bg-slate-100'
                  }`}
                >
                  {item.emergency && <ShieldAlert className="w-4 h-4 text-red-600" />}
                  {item.highlight && <Stethoscope className="w-4 h-4 text-emerald-600" />}
                  {item.label}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="bg-[#034694] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {item.count}
                    </span>
                  )}
                  {active && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#034694] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Tools: Find Doctor Button, Emergency Button, Search, Language Switcher, Admin Button, Mobile Toggle */}
          <div className="flex items-center gap-2">
            {/* Prominent Header Find Doctor Button */}
            <button
              onClick={() => handleNavClick('find-doctor')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs hover:shadow-md cursor-pointer ${
                currentTab === 'find-doctor' || currentTab === 'eyecare' || currentTab === 'doctors'
                  ? 'bg-[#034694] text-white ring-2 ring-blue-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              title="Find a Doctor & Healthcare Service in Hafizabad"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>{lang === 'ur' ? 'ڈاکٹر سروس' : 'Find Doctor'}</span>
            </button>

            {/* Permanent Red/Orange Emergency Button */}
            <button
              onClick={() => handleNavClick('emergency-helplines')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-black text-xs transition-all shadow-xs hover:shadow-md cursor-pointer ${
                currentTab === 'emergency-helplines'
                  ? 'bg-red-800 text-white ring-2 ring-red-400'
                  : 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white animate-pulse hover:animate-none'
              }`}
              title="Hafizabad Emergency Helplines (Rescue 1122, Police 15, Fire 16, Edhi 115)"
            >
              <ShieldAlert className="w-4 h-4 text-white" />
              <span>Emergency</span>
            </button>

            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:border-[#034694] hover:text-[#034694] bg-slate-50 transition-colors text-sm"
              title="Search directory"
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline text-xs font-medium">Search</span>
              <kbd className="hidden lg:inline text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded-sm text-slate-500 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-colors ${
                  lang === 'en'
                    ? 'bg-white text-[#034694] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('ur')}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-colors ${
                  lang === 'ur'
                    ? 'bg-white text-[#059669] shadow-xs font-urdu'
                    : 'text-slate-600 hover:text-slate-900 font-urdu'
                }`}
              >
                اردو
              </button>
            </div>

            {/* Admin Dashboard Entry / Status */}
            {isAdminLoggedIn ? (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'admin'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  }`}
                  title="Admin Portal Active"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'ur' ? 'ایڈمن موڈ' : 'Admin'}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </button>
                {onLogoutAdmin && (
                  <button
                    onClick={onLogoutAdmin}
                    className="p-1.5 rounded-lg border border-slate-200 hover:border-red-300 text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs transition-colors cursor-pointer"
                    title={lang === 'ur' ? 'ایڈمن لاگ آؤٹ' : 'Admin Logout'}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAdminLogin ? onOpenAdminLogin : () => handleNavClick('admin')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-[#034694] text-slate-700 hover:text-[#034694] bg-white text-xs font-bold transition-colors hidden sm:flex items-center gap-1.5 cursor-pointer"
                title="Admin Login"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{lang === 'ur' ? 'ایڈمن لاگ ان' : 'Admin Login'}</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-150">
          {/* Prominent Mobile Featured Banner: Find Doctor & Services */}
          <button
            onClick={() => handleNavClick('find-doctor')}
            className="w-full mb-3 bg-gradient-to-r from-[#034694] via-[#0284c7] to-[#059669] text-white p-3 rounded-2xl shadow-sm flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/20 rounded-xl">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-black">{lang === 'ur' ? 'ڈاکٹر و ہیلتھ سروس تلاش کریں' : 'Find Doctor & Healthcare Services'}</div>
                <div className="text-[11px] text-blue-100">{lang === 'ur' ? 'علامات اور امراضِ چشم کے لیے' : 'Match health concerns or eye care'}</div>
              </div>
            </div>
            <span className="text-xs bg-white text-[#034694] font-black px-2.5 py-1 rounded-lg shrink-0 shadow-2xs">
              {lang === 'ur' ? 'کھولیں' : 'Open'}
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2.5 rounded-lg text-sm font-semibold text-left flex items-center justify-between cursor-pointer ${
                  currentTab === item.id
                    ? 'bg-[#034694] text-white'
                    : item.emergency
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : item.highlight
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  {item.emergency && <ShieldAlert className="w-4 h-4 text-red-600" />}
                  {item.label}
                </span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="bg-slate-900 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('admin')}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 py-2 px-3 bg-emerald-50 border border-emerald-200 rounded-lg cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'ur' ? 'ایڈمن پینل' : 'Admin Panel'}</span>
                </button>
                {onLogoutAdmin && (
                  <button
                    onClick={() => {
                      onLogoutAdmin();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-red-600 py-2 px-2.5 bg-red-50 border border-red-200 rounded-lg cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{lang === 'ur' ? 'لاگ آؤٹ' : 'Logout'}</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenAdminLogin) onOpenAdminLogin();
                  else handleNavClick('admin');
                }}
                className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 py-2 px-3 bg-slate-100 rounded-lg cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{lang === 'ur' ? 'ایڈمن لاگ ان' : 'Admin Login'}</span>
              </button>
            )}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Hafizabad Portal</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
