import React, { useState } from 'react';
import { Logo } from './Logo';
import { Language } from '../types';
import {
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface AdminGatekeeperModalProps {
  isOpen: boolean;
  onLoginSuccess: (username: string) => void;
  onContinueAsGuest: () => void;
  lang: Language;
}

export const AdminGatekeeperModal: React.FC<AdminGatekeeperModalProps> = ({
  isOpen,
  onLoginSuccess,
  onContinueAsGuest,
  lang,
}) => {
  const [username, setUsername] = useState('admin');
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim();

    // Accepted passcodes: 'admin', 'hafizabad2026', 'hhg2026', '123456'
    if (
      cleanPass === 'admin' ||
      cleanPass === 'hafizabad2026' ||
      cleanPass === 'hhg2026' ||
      cleanPass === '123456'
    ) {
      if (rememberMe) {
        localStorage.setItem('hhg_admin_logged_in', 'true');
      } else {
        sessionStorage.setItem('hhg_admin_logged_in', 'true');
      }
      localStorage.setItem('hhg_admin_username', username.trim() || 'admin');
      setError('');
      onLoginSuccess(username.trim() || 'admin');
    } else {
      setError(
        lang === 'ur'
          ? 'پاس کوڈ درست نہیں ہے۔ ازراہِ کرم "admin" یا "hafizabad2026" درج کریں۔'
          : 'Invalid passcode. Please use default passcode "admin" or "hafizabad2026".'
      );
    }
  };

  const handleQuickFill = (code: string) => {
    setPasscode(code);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-md w-full overflow-hidden flex flex-col relative">
        {/* Top Header Background */}
        <div className="bg-gradient-to-br from-[#034694] via-[#055bb5] to-[#059669] p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 transform -translate-x-4 translate-y-4 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />

          {/* Logo */}
          <div className="flex justify-center mb-3">
            <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-xs border border-white/20 shadow-inner">
              <Logo className="h-10 text-white" />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {lang === 'ur' ? 'ایڈمن لاگ ان مطلوب ہے' : 'Admin Login Required'}
          </h2>
          <p className="text-xs text-blue-100 mt-1 max-w-xs mx-auto font-medium">
            {lang === 'ur'
              ? 'حافظ آباد ہیلتھ گائیڈ پورٹل میں داخل ہونے کے لیے ایڈمنسٹریٹر تصدیق درکار ہے'
              : 'Sign in to access the Hafizabad Health Guide directory and admin controls.'}
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-[11px] font-semibold text-white/95 border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>District Public Health Portal</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-in shake">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Username Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {lang === 'ur' ? 'ایڈمن یوزر نیم' : 'Administrator Username'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#034694] focus:border-transparent transition-all"
                placeholder="admin"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                {lang === 'ur' ? 'پاس کوڈ / پاس ورڈ' : 'Admin Passcode / Password'}
              </label>
              <span className="text-[11px] text-slate-400">Default: admin</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError('');
                }}
                required
                autoFocus
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#034694] focus:border-transparent transition-all"
                placeholder="Enter passcode (e.g. admin)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick-Fill Helper Pills */}
          <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-100/80 text-[11px] text-slate-600 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-[#034694]" />
              <span>Quick Test Passcode:</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="bg-white hover:bg-blue-100 text-[#034694] font-bold px-2 py-0.5 rounded-md border border-blue-200 shadow-2xs transition-colors cursor-pointer"
              >
                admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('hafizabad2026')}
                className="bg-white hover:bg-blue-100 text-[#034694] font-bold px-2 py-0.5 rounded-md border border-blue-200 shadow-2xs transition-colors cursor-pointer"
              >
                hafizabad2026
              </button>
            </div>
          </div>

          {/* Remember Session */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-[#034694] focus:ring-[#034694] w-4 h-4"
              />
              <span>{lang === 'ur' ? 'سیشن یاد رکھیں' : 'Remember login on this browser'}</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#034694] hover:bg-[#023370] text-white py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <Lock className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>{lang === 'ur' ? 'ایڈمن لاگ ان کریں' : 'Log In as Administrator'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Guest / Public Visitor Bypass */}
          <div className="pt-2 text-center border-t border-slate-100">
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold hover:underline cursor-pointer inline-flex items-center gap-1.5 py-1"
            >
              <span>{lang === 'ur' ? 'بطور پبلک وزیٹر جاری رکھیں (Preview as Public Visitor)' : 'Continue as Public Visitor (Read-only Preview)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
