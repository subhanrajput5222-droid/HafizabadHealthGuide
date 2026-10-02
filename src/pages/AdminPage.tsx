import React, { useState } from 'react';
import {
  Hospital,
  Doctor,
  Pharmacy,
  Laboratory,
  BloodBank,
  BloodGroup,
  BloodAvailabilityStatus,
  FacilityClaim,
  FacilityReport,
  UserReview,
  AuditLog,
  EmergencyHelpline,
  Language,
} from '../types';
import { StorageService } from '../services/storageService';
import {
  Lock,
  Unlock,
  Building2,
  User,
  Pill,
  FlaskConical,
  Droplet,
  HeartHandshake,
  FileText,
  Star,
  History,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Check,
  ShieldCheck,
  ShieldAlert,
  Search,
} from 'lucide-react';

interface AdminPageProps {
  lang: Language;
  hospitals: Hospital[];
  doctors: Doctor[];
  pharmacies: Pharmacy[];
  laboratories: Laboratory[];
  bloodBanks: BloodBank[];
  onRefreshData: () => void;
  isAdminLoggedIn?: boolean;
  onLogoutAdmin?: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  lang,
  hospitals,
  doctors,
  pharmacies,
  laboratories,
  bloodBanks,
  onRefreshData,
  isAdminLoggedIn,
  onLogoutAdmin,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return isAdminLoggedIn ?? (localStorage.getItem('hhg_admin_logged_in') === 'true');
  });

  React.useEffect(() => {
    if (isAdminLoggedIn !== undefined) {
      setIsAuthenticated(isAdminLoggedIn);
    }
  }, [isAdminLoggedIn]);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'hospitals' | 'helplines' | 'blood' | 'doctors' | 'pharmacies' | 'labs' | 'claims' | 'reports' | 'reviews' | 'audit'
  >('hospitals');

  // Helplines list
  const helplines = StorageService.getEmergencyHelplines();

  // Blood availability editor state
  const [selectedBloodBankId, setSelectedBloodBankId] = useState<string>(
    bloodBanks[0]?.id || ''
  );
  const [bloodStaffName, setBloodStaffName] = useState('Dr. Transfusion Officer');

  // Edit/Add Modal states
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [isAddingHospital, setIsAddingHospital] = useState(false);

  // Claims, Reports, Reviews, Audit from storage
  const claims = StorageService.getClaims();
  const reports = StorageService.getReports();
  const reviews = StorageService.getReviews();
  const auditLogs = StorageService.getAuditLogs();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin passcode
    if (passcode.trim() === 'hafizabad2026' || passcode.trim() === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('hhg_admin_logged_in', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid passcode. Use "hafizabad2026" or "admin".');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('hhg_admin_logged_in');
    sessionStorage.removeItem('hhg_admin_logged_in');
    if (onLogoutAdmin) {
      onLogoutAdmin();
    }
  };

  // Hospital CRUD
  const handleDeleteHospital = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      StorageService.deleteHospital(id, 'Admin');
      onRefreshData();
    }
  };

  const handleToggleHospitalVerification = (h: Hospital) => {
    const updated = { ...h, isVerified: !h.isVerified };
    StorageService.saveHospital(updated, 'Admin');
    onRefreshData();
  };

  // Blood update
  const handleUpdateBlood = (group: BloodGroup, status: BloodAvailabilityStatus) => {
    if (!selectedBloodBankId) return;
    StorageService.updateBloodGroupStatus(
      selectedBloodBankId,
      group,
      status,
      bloodStaffName || 'Blood Bank Staff'
    );
    onRefreshData();
  };

  // Helplines management
  const handleToggleHelpline = (id: string) => {
    StorageService.toggleHelplineActive(id, 'Admin');
    onRefreshData();
  };

  // Claims
  const handleApproveClaim = (id: string) => {
    StorageService.updateClaimStatus(id, 'approved', 'Approved by District Administrator', 'Admin');
    onRefreshData();
  };

  const handleRejectClaim = (id: string) => {
    StorageService.updateClaimStatus(id, 'rejected', 'Documents could not be verified with DHA register', 'Admin');
    onRefreshData();
  };

  // Reports
  const handleResolveReport = (id: string) => {
    StorageService.updateReportStatus(id, 'resolved', 'Verified on-ground and resolved');
    onRefreshData();
  };

  // Reviews
  const handleApproveReview = (id: string) => {
    StorageService.updateReviewStatus(id, 'approved');
    onRefreshData();
  };

  const handleRejectReview = (id: string) => {
    StorageService.updateReviewStatus(id, 'rejected');
    onRefreshData();
  };

  // Reset database
  const handleResetToSeeds = () => {
    if (window.confirm('Reset all directories back to original verified initial seeds?')) {
      StorageService.resetToSeeds();
      onRefreshData();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl text-center">
          <div className="w-14 h-14 bg-slate-100 text-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-1">Admin Dashboard Login</h2>
          <p className="text-xs text-slate-500 mb-6">
            Authorized administrator access for Hafizabad Health Guide.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium">
                {authError}
              </div>
            )}
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode (e.g. hafizabad2026)"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#034694]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#034694] hover:bg-blue-800 text-white font-bold text-sm rounded-xl transition-colors shadow-md"
            >
              Sign In to Management Console
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-400">
              Demo Test Passcode: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-slate-700">hafizabad2026</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const selectedBank = bloodBanks.find((b) => b.id === selectedBloodBankId) || bloodBanks[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-0.5 rounded-full text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure District Administration Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Hafizabad Health Directory Control Center
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Maintain verified public facilities, audit blood inventory, moderate reviews, and approve claims.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetToSeeds}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700"
            title="Reset to original verified seeds"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Initial Data</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Admin Tab Nav */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('hospitals')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-colors ${
            activeTab === 'hospitals'
              ? 'bg-[#034694] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Hospitals ({hospitals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('helplines')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-colors ${
            activeTab === 'helplines'
              ? 'bg-red-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Emergency Helplines ({helplines.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('blood')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-colors ${
            activeTab === 'blood'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Droplet className="w-4 h-4" />
          <span>Blood Availability Manager</span>
        </button>

        <button
          onClick={() => setActiveTab('doctors')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-colors ${
            activeTab === 'doctors'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Doctors ({doctors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pharmacies')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-colors ${
            activeTab === 'pharmacies'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Pharmacies ({pharmacies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('labs')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-colors ${
            activeTab === 'labs'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Labs ({laboratories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-colors ${
            activeTab === 'claims'
              ? 'bg-amber-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Claims ({claims.filter((c) => c.status === 'pending').length} pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-colors ${
            activeTab === 'reports'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>User Reports ({reports.filter((r) => r.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-colors ${
            activeTab === 'reviews'
              ? 'bg-blue-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Reviews ({reviews.filter((r) => r.status === 'pending').length} pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-colors ${
            activeTab === 'audit'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: HOSPITALS MANAGEMENT */}
      {activeTab === 'hospitals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Hospital Directory Entries</h2>
            <button
              onClick={() => {
                const newH: Hospital = {
                  id: 'hospital-' + Date.now(),
                  slug: 'hospital-' + Date.now(),
                  name: 'New Hospital Hafizabad',
                  nameUrdu: 'نیا ہسپتال',
                  type: 'Private',
                  area: 'Hafizabad City',
                  address: 'Alipur Road, Hafizabad',
                  addressUrdu: 'علی پور روڈ، حافظ آباد',
                  phone: '0547-XXXXXX',
                  openingHours: '24 Hours',
                  emergency24_7: true,
                  emergencyAvailability: '24/7 Emergency Care',
                  isVerified: true,
                  lastUpdated: new Date().toISOString().split('T')[0],
                  verificationSource: 'DHA Hafizabad Inspection Record',
                  description: 'Comprehensive medical facility.',
                  coordinates: { lat: 32.07, lng: 73.68 },
                  services: {
                    emergency: true,
                    laboratory: true,
                    xRay: true,
                    ultrasound: true,
                    ctScan: false,
                    mri: false,
                    bloodBank: false,
                    ambulance: true,
                    icu: false,
                    nicu: false,
                    dialysis: false,
                    pharmacy: true,
                    operationTheater: true,
                  },
                  departments: ['General Medicine', 'Surgery', 'Obstetrics & Gynae'],
                };
                StorageService.saveHospital(newH, 'Admin');
                onRefreshData();
              }}
              className="px-4 py-2 bg-[#034694] hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Hospital</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <tr>
                    <th className="p-3.5">Hospital Name</th>
                    <th className="p-3.5">Type & Area</th>
                    <th className="p-3.5">Phone & Emergency</th>
                    <th className="p-3.5">Verification</th>
                    <th className="p-3.5">Last Updated</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {hospitals.map((h) => (
                    <tr key={h.id} className="hover:bg-slate-50">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{h.name}</div>
                        <div className="text-[11px] text-slate-500">{h.address}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800">{h.type}</span>
                        <div className="text-[11px] text-slate-500">{h.area}</div>
                      </td>
                      <td className="p-3.5 font-mono">
                        <div>{h.phone}</div>
                        <div className="text-red-600 text-[11px]">
                          {h.emergencyPhone || '1122'}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleToggleHospitalVerification(h)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                            h.isVerified
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {h.isVerified ? '✓ Verified' : 'Mark Verified'}
                        </button>
                      </td>
                      <td className="p-3.5 text-slate-500 text-xs">{h.lastUpdated}</td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleDeleteHospital(h.id, h.name)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete hospital"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: EMERGENCY HELPLINES MANAGEMENT */}
      {activeTab === 'helplines' && (
        <div className="space-y-6">
          {/* Critical Policy Banner */}
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-600 text-white rounded-xl shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-red-900 mb-1">
                  Critical Emergency Numbers Verification Protocol
                </h2>
                <p className="text-xs sm:text-sm text-red-800 leading-relaxed">
                  <strong>Important:</strong> Emergency numbers are life-critical information. Normal citizens and anonymous users are strictly barred from modifying emergency numbers. Only verified administrators can update them. Each number must specify its official government source and last verified date. If any emergency hotline becomes outdated or decommissioned, disable it immediately so citizens are not misdirected during an acute crisis.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                District Emergency Helplines Directory
              </h3>
              <p className="text-xs text-slate-500">
                Official emergency numbers published on /emergency-helplines
              </p>
            </div>

            <button
              onClick={() => {
                const newNum = prompt('Enter Emergency Number (e.g. 1122, 15, 0547-XXXXXX):');
                if (!newNum) return;
                const newName = prompt('Enter Service Name (e.g. Civil Defence Hafizabad):');
                if (!newName) return;
                const newSource = prompt('Enter Official Government Verification Source:');
                if (!newSource) return;

                const newHelpline: EmergencyHelpline = {
                  id: 'helpline-' + Date.now(),
                  name: newName,
                  nameUrdu: newName,
                  number: newNum,
                  telUri: `tel:${newNum.replace(/-/g, '')}`,
                  icon: 'shield',
                  purpose: ['District emergency assistance'],
                  purposeUrdu: ['ضلعی ہنگامی امداد'],
                  description: `${newName} emergency contact for Hafizabad District.`,
                  isVerified: true,
                  officialSource: newSource,
                  lastVerifiedDate: new Date().toISOString().split('T')[0],
                  isActive: true,
                  priority: helplines.length + 1,
                };
                StorageService.saveEmergencyHelpline(newHelpline, 'Admin');
                onRefreshData();
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Verified Emergency Number</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <tr>
                    <th className="p-3.5">Emergency Number</th>
                    <th className="p-3.5">Service Name & Scope</th>
                    <th className="p-3.5">Official Source</th>
                    <th className="p-3.5">Last Verified</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Emergency Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {helplines.map((h) => (
                    <tr key={h.id} className={`hover:bg-slate-50 ${!h.isActive ? 'bg-slate-50/60 opacity-60' : ''}`}>
                      <td className="p-3.5">
                        <span className="font-mono text-xl sm:text-2xl font-black text-red-600">
                          {h.number}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono">{h.telUri}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 text-sm sm:text-base">
                          {h.name}
                        </div>
                        <div className="text-xs text-slate-500 font-urdu">{h.nameUrdu}</div>
                        <div className="text-[11px] text-slate-600 mt-1 line-clamp-1">
                          {(h.purpose || []).join(' · ')}
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-600 text-xs">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700">
                          {h.officialSource}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500 text-xs whitespace-nowrap">
                        {h.lastVerifiedDate}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            h.isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              h.isActive ? 'bg-emerald-600' : 'bg-red-600'
                            }`}
                          />
                          {h.isActive ? 'Active 24/7' : 'Disabled'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleToggleHelpline(h.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            h.isActive
                              ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {h.isActive ? 'Disable Number' : 'Enable Active'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BLOOD AVAILABILITY REAL-TIME MANAGER */}
      {activeTab === 'blood' && (
        <div className="space-y-6">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
            <h2 className="text-lg font-black text-rose-900 mb-1">
              Authorized Real-Time Blood Stock Updater
            </h2>
            <p className="text-xs sm:text-sm text-rose-800 leading-relaxed mb-4">
              Per strict clinical verification rules: Only authorized hospital transfusion officers or verified admins may set blood availability. Changes automatically record your role, date, and exact timestamp.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select Blood Transfusion Center / Bank:
                </label>
                <select
                  value={selectedBloodBankId}
                  onChange={(e) => setSelectedBloodBankId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-rose-300 rounded-xl text-sm font-bold text-slate-800"
                >
                  {bloodBanks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.facilityName} ({b.area})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Authorized Designation / Name:
                </label>
                <input
                  type="text"
                  value={bloodStaffName}
                  onChange={(e) => setBloodStaffName(e.target.value)}
                  placeholder="e.g. Dr. Transfusion Officer / Lab Incharge"
                  className="w-full px-3 py-2 bg-white border border-rose-300 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          {selectedBank && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-lg text-slate-900">
                  {selectedBank.facilityName} — Current Status Grid
                </h3>
                <span className="text-xs text-slate-500">
                  Last Updated: {selectedBank.lastUpdated}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map(
                  (bg) => {
                    const info = selectedBank.inventory[bg];
                    const currentStatus = info ? info.status : 'Unknown';

                    return (
                      <div
                        key={bg}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl font-black text-slate-900">{bg}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              currentStatus === 'Available'
                                ? 'bg-emerald-100 text-emerald-800'
                                : currentStatus === 'Not Available'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {currentStatus}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500 mb-3">
                          Updated: {info?.lastUpdated || 'None'}
                        </div>

                        <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-200">
                          <button
                            onClick={() => handleUpdateBlood(bg, 'Available')}
                            className={`py-1 rounded-md text-[10px] font-bold ${
                              currentStatus === 'Available'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white border text-slate-700 hover:bg-emerald-50'
                            }`}
                          >
                            Available
                          </button>
                          <button
                            onClick={() => handleUpdateBlood(bg, 'Not Available')}
                            className={`py-1 rounded-md text-[10px] font-bold ${
                              currentStatus === 'Not Available'
                                ? 'bg-rose-600 text-white'
                                : 'bg-white border text-slate-700 hover:bg-rose-50'
                            }`}
                          >
                            Out of Stock
                          </button>
                          <button
                            onClick={() => handleUpdateBlood(bg, 'Unknown')}
                            className={`py-1 rounded-md text-[10px] font-bold ${
                              currentStatus === 'Unknown'
                                ? 'bg-amber-600 text-white'
                                : 'bg-white border text-slate-700 hover:bg-amber-50'
                            }`}
                          >
                            Unknown
                          </button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DOCTORS */}
      {activeTab === 'doctors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Registered Doctors Roster</h2>
            <button
              onClick={() => {
                const newDoc: Doctor = {
                  id: 'doc-' + Date.now(),
                  slug: 'doc-' + Date.now(),
                  name: 'Dr. New Specialist',
                  nameUrdu: 'ڈاکٹر نیا اسپیشلسٹ',
                  specialty: 'General Physician',
                  specialtyUrdu: 'جنرل فزیشن',
                  hospitalOrClinic: 'DHQ Hospital Hafizabad',
                  area: 'Hafizabad City',
                  address: 'DHQ Hospital Complex, Gujranwala Road, Hafizabad',
                  qualification: 'MBBS, FCPS',
                  availableDays: 'Monday to Friday',
                  timings: '4:00 PM - 8:00 PM',
                  appointmentPhone: '0547-521088',
                  services: ['General consultation', 'OPD follow-up'],
                  areasOfSpecialization: ['Internal Medicine'],
                  isVerified: true,
                  lastUpdated: new Date().toISOString().split('T')[0],
                  verificationSource: 'PMC Active Registration',
                };
                StorageService.saveDoctor(newDoc, 'Admin');
                onRefreshData();
              }}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Doctor</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <tr>
                    <th className="p-3.5">Doctor Name</th>
                    <th className="p-3.5">Specialty</th>
                    <th className="p-3.5">Hospital / Chamber</th>
                    <th className="p-3.5">Days & Timings</th>
                    <th className="p-3.5">Phone</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {doctors.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">{d.name}</td>
                      <td className="p-3.5 text-emerald-700 font-semibold">{d.specialty}</td>
                      <td className="p-3.5 text-slate-600">{d.hospitalOrClinic}</td>
                      <td className="p-3.5 text-slate-500">{d.availableDays} ({d.timings})</td>
                      <td className="p-3.5 font-mono">{d.appointmentPhone}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${d.name}?`)) {
                              StorageService.deleteDoctor(d.id, 'Admin');
                              onRefreshData();
                            }
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PHARMACIES */}
      {activeTab === 'pharmacies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Pharmacies & Medical Stores</h2>
            <button
              onClick={() => {
                const newP: Pharmacy = {
                  id: 'pharm-' + Date.now(),
                  name: 'New Medical Store',
                  nameUrdu: 'نیا میڈیکل اسٹور',
                  area: 'Hafizabad City',
                  address: 'Main Bazaar, Hafizabad',
                  phone: '0547-XXXXXX',
                  openingHours: '8:00 AM - 11:00 PM',
                  is24_7: false,
                  homeDelivery: false,
                  isVerified: true,
                  lastUpdated: new Date().toISOString().split('T')[0],
                  verificationSource: 'DHA District Inspection Register',
                  coordinates: { lat: 32.07, lng: 73.68 },
                };
                StorageService.savePharmacy(newP, 'Admin');
                onRefreshData();
              }}
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Pharmacy</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <tr>
                    <th className="p-3.5">Store Name</th>
                    <th className="p-3.5">Area & Address</th>
                    <th className="p-3.5">24/7 Status</th>
                    <th className="p-3.5">Phone</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pharmacies.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">{p.name}</td>
                      <td className="p-3.5 text-slate-600">{p.address} ({p.area})</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${p.is24_7 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                          {p.is24_7 ? '24 Hours' : p.openingHours}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono">{p.phone}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${p.name}?`)) {
                              StorageService.deletePharmacy(p.id, 'Admin');
                              onRefreshData();
                            }
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: LABS */}
      {activeTab === 'labs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Diagnostic Laboratories</h2>
            <button
              onClick={() => {
                const newL: Laboratory = {
                  id: 'lab-' + Date.now(),
                  name: 'New Diagnostic Center',
                  nameUrdu: 'نیا ڈائیگنوسٹک سینٹر',
                  area: 'Hafizabad City',
                  address: 'Alipur Road, Hafizabad',
                  phone: '0547-XXXXXX',
                  openingHours: '8:00 AM - 10:00 PM',
                  homeSampling: true,
                  isVerified: true,
                  lastUpdated: new Date().toISOString().split('T')[0],
                  verificationSource: 'Health Authority Inspection',
                  coordinates: { lat: 32.07, lng: 73.68 },
                  services: {
                    bloodTests: true,
                    xRay: true,
                    ultrasound: true,
                    ctScan: false,
                    mri: false,
                    ecg: true,
                    pathology: true,
                    covidDengueTests: true,
                  },
                };
                StorageService.saveLaboratory(newL, 'Admin');
                onRefreshData();
              }}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Laboratory</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <tr>
                    <th className="p-3.5">Lab Name</th>
                    <th className="p-3.5">Address & Area</th>
                    <th className="p-3.5">Hours</th>
                    <th className="p-3.5">Phone</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {laboratories.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">{l.name}</td>
                      <td className="p-3.5 text-slate-600">{l.address}</td>
                      <td className="p-3.5 text-slate-500">{l.openingHours}</td>
                      <td className="p-3.5 font-mono">{l.phone}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${l.name}?`)) {
                              StorageService.deleteLaboratory(l.id, 'Admin');
                              onRefreshData();
                            }
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: FACILITY CLAIMS APPROVAL */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            Facility Claim Verification Applications
          </h2>
          <p className="text-xs text-slate-500">
            Hospitals, pharmacies, and clinics requesting authorized administrative edit rights.
          </p>

          {claims.length > 0 ? (
            <div className="space-y-4">
              {claims.map((claim) => (
                <div
                  key={claim.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-slate-900 text-base">
                        {claim.facilityName}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {claim.facilityType}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          claim.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : claim.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {claim.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div>
                        <strong>Claimant:</strong> {claim.claimantName} ({claim.claimantRole})
                      </div>
                      <div>
                        <strong>Contact:</strong> {claim.officialPhone} · {claim.officialEmail || 'No email'}
                      </div>
                      <div>
                        <strong>Licence / Registration Proof:</strong> {claim.verificationProof}
                      </div>
                      {claim.requestedChanges && (
                        <div>
                          <strong>Requested Updates:</strong> {claim.requestedChanges}
                        </div>
                      )}
                    </div>
                  </div>

                  {claim.status === 'pending' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleRejectClaim(claim.id)}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold"
                      >
                        Reject Claim
                      </button>
                      <button
                        onClick={() => handleApproveClaim(claim.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
                      >
                        Approve & Verify
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-white rounded-2xl border text-center text-xs text-slate-500">
              No facility claims submitted yet.
            </div>
          )}
        </div>
      )}

      {/* TAB 7: USER REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            Citizen Inaccuracy Reports
          </h2>
          <p className="text-xs text-slate-500">
            Reports submitted by citizens regarding wrong phone numbers, closed facilities, or inaccurate timings.
          </p>

          {reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 text-base">{rep.facilityName}</span>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                        {rep.reportType.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          rep.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rep.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mb-1">{rep.details}</p>
                    <div className="text-[11px] text-slate-400">
                      Reported by: {rep.reportedBy || 'Anonymous citizen'} ({rep.contactPhone || 'No phone'}) · {rep.submittedAt.split('T')[0]}
                    </div>
                  </div>

                  {rep.status === 'pending' && (
                    <button
                      onClick={() => handleResolveReport(rep.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shrink-0"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-white rounded-2xl border text-center text-xs text-slate-500">
              No incorrect information reports submitted.
            </div>
          )}
        </div>
      )}

      {/* TAB 8: USER REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            Community Review Moderation Queue
          </h2>
          <p className="text-xs text-slate-500">
            Strict anti-spam policy: Review each submission for authentic experience before publishing publicly.
          </p>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900">{rev.reviewerName}</span>
                    <span className="text-xs text-slate-500">for {rev.facilityName}</span>
                    <div className="flex text-amber-400 text-xs">
                      {'★'.repeat(rev.rating)}
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        rev.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rev.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rev.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mb-1">{rev.reviewText}</p>
                  <span className="text-[11px] text-slate-400">
                    Visit Date: {rev.visitDate} · Submitted: {rev.submittedAt}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {rev.status !== 'approved' && (
                    <button
                      onClick={() => handleApproveReview(rev.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                    >
                      Approve Review
                    </button>
                  )}
                  {rev.status !== 'rejected' && (
                    <button
                      onClick={() => handleRejectReview(rev.id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold"
                    >
                      Reject / Spam
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            System Modification Audit Trail
          </h2>
          <p className="text-xs text-slate-500">
            Every update to hospital information, blood availability, and claims is stored with author and timestamp.
          </p>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <tr>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Updated By</th>
                    <th className="p-3.5">Entity</th>
                    <th className="p-3.5">Action</th>
                    <th className="p-3.5">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3.5 text-slate-500 whitespace-nowrap">
                        {log.timestamp.replace('T', ' ').substring(0, 19)}
                      </td>
                      <td className="p-3.5 font-bold text-slate-800">{log.updatedBy}</td>
                      <td className="p-3.5 text-[#034694]">
                        {log.entityType}: {log.entityName}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600 truncate max-w-xs">
                        {log.newData || log.previousData || '-'}
                      </td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400 font-sans">
                        No audit events recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
