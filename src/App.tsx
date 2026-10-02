import React, { useState, useEffect } from 'react';
import {
  Hospital,
  Doctor,
  Pharmacy,
  Laboratory,
  BloodBank,
  UserReview,
  EmergencyHelpline,
  Language,
} from './types';
import { StorageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { HospitalsPage } from './pages/HospitalsPage';
import { HospitalDetailPage } from './pages/HospitalDetailPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { FindDoctorPage } from './pages/FindDoctorPage';
import { PharmaciesPage } from './pages/PharmaciesPage';
import { LabsPage } from './pages/LabsPage';
import { BloodPage } from './pages/BloodPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { EmergencyHelplinesPage } from './pages/EmergencyHelplinesPage';
import { MapPage } from './pages/MapPage';
import { ComparePage } from './pages/ComparePage';
import { AdminPage } from './pages/AdminPage';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { ClaimModal } from './components/ClaimModal';
import { ReportModal } from './components/ReportModal';
import { ReviewModal } from './components/ReviewModal';
import { LegalModal } from './components/LegalModal';
import { AdminGatekeeperModal } from './components/AdminGatekeeperModal';
import { safeStorage } from './utils/safeStorage';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    return (safeStorage.getItem('hhg_lang') as Language) || 'en';
  });

  const getInitialTab = (): string => {
    try {
      const redirect = safeStorage.getSessionItem('spa_redirect');
      if (redirect) {
        safeStorage.removeSessionItem('spa_redirect');
        const rLower = redirect.toLowerCase();
        if (rLower.includes('find-doctor') || rLower.includes('doctor')) return 'find-doctor';
        if (rLower.includes('emergency-helplines') || rLower.includes('helpline')) return 'emergency-helplines';
        if (rLower.includes('eyecare') || rLower.includes('eye')) return 'eyecare';
        if (rLower.includes('hospitals')) return 'hospitals';
        if (rLower.includes('pharmacies')) return 'pharmacies';
        if (rLower.includes('labs')) return 'labs';
        if (rLower.includes('blood')) return 'blood';
        if (rLower.includes('emergency')) return 'emergency';
        if (rLower.includes('map')) return 'map';
        if (rLower.includes('compare')) return 'compare';
        if (rLower.includes('admin')) return 'admin';
      }

      const p = window.location.pathname.toLowerCase().replace(/^\//, '');
      const h = window.location.hash.toLowerCase().replace(/^#\/?/, '');
      const route = p || h;
      if (route.includes('find-doctor') || route.includes('doctor') || route.includes('service')) {
        return 'find-doctor';
      }
      if (route.includes('emergency-helplines') || route.includes('helpline')) {
        return 'emergency-helplines';
      }
      if (route.includes('eyecare') || route.includes('eye-care') || route.includes('eye')) {
        return 'eyecare';
      }
      if (route.includes('hospitals')) return 'hospitals';
      if (route.includes('pharmacies')) return 'pharmacies';
      if (route.includes('labs')) return 'labs';
      if (route.includes('blood')) return 'blood';
      if (route.includes('emergency')) return 'emergency';
      if (route.includes('map')) return 'map';
      if (route.includes('compare')) return 'compare';
      if (route.includes('admin')) return 'admin';
    } catch {
      // fallback
    }
    return 'home';
  };

  const [currentTab, setCurrentTab] = useState<string>(getInitialTab);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [initialAreaFilter, setInitialAreaFilter] = useState<string>('All');
  const [compareList, setCompareList] = useState<Hospital[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Admin Login Gatekeeper: Asks for admin login when website opens
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return safeStorage.getItem('hhg_admin_logged_in') === 'true';
  });

  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(() => {
    return safeStorage.getItem('hhg_admin_logged_in') !== 'true';
  });

  const handleAdminLoginSuccess = (_username: string) => {
    setIsAdminLoggedIn(true);
    setShowAdminLoginModal(false);
  };

  const handleContinueAsGuest = () => {
    setShowAdminLoginModal(false);
  };

  const handleLogoutAdmin = () => {
    safeStorage.removeItem('hhg_admin_logged_in');
    safeStorage.removeSessionItem('hhg_admin_logged_in');
    setIsAdminLoggedIn(false);
    setShowAdminLoginModal(true);
  };

  const handleOpenAdminLogin = () => {
    setShowAdminLoginModal(true);
  };

  // Modals state
  const [claimModal, setClaimModal] = useState<{
    isOpen: boolean;
    facilityName: string;
    facilityId: string;
    facilityType?: 'hospital' | 'pharmacy' | 'laboratory' | 'blood_bank' | 'doctor';
  }>({
    isOpen: false,
    facilityName: '',
    facilityId: '',
    facilityType: 'hospital',
  });

  const [reportModal, setReportModal] = useState<{
    isOpen: boolean;
    facilityName: string;
    facilityId: string;
  }>({
    isOpen: false,
    facilityName: '',
    facilityId: '',
  });

  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    facilityName: string;
    facilityId: string;
  }>({
    isOpen: false,
    facilityName: '',
    facilityId: '',
  });

  const [legalModal, setLegalModal] = useState<{
    isOpen: boolean;
    type: 'privacy' | 'terms' | 'disclaimer';
  }>({
    isOpen: false,
    type: 'disclaimer',
  });

  // Dynamic datasets from storage
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [helplines, setHelplines] = useState<EmergencyHelpline[]>([]);
  const [reviews, setReviews] = useState<UserReview[]>([]);

  const refreshData = () => {
    setHospitals(StorageService.getHospitals());
    setDoctors(StorageService.getDoctors());
    setPharmacies(StorageService.getPharmacies());
    setLaboratories(StorageService.getLaboratories());
    setBloodBanks(StorageService.getBloodBanks());
    setHelplines(StorageService.getEmergencyHelplines());
    setReviews(StorageService.getReviews());
  };

  useEffect(() => {
    refreshData();
    const handlePopState = () => {
      setSelectedHospital(null);
      setCurrentTab(getInitialTab());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Sync Language, Direction, and Page SEO Title
  useEffect(() => {
    localStorage.setItem('hhg_lang', lang);
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (currentTab === 'emergency-helplines') {
      document.title = 'Hafizabad Emergency Helplines & Contact Numbers | Hafizabad Health Guide';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Find important emergency contact numbers for Hafizabad including Rescue 1122, Police 15, Fire Brigade 16, ambulance services and district emergency contacts.'
        );
      }
    } else if (currentTab === 'find-doctor' || currentTab === 'eyecare' || currentTab === 'doctors') {
      document.title = 'Find a Doctor & Healthcare Service in Hafizabad | Hafizabad Health Guide';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Find verified doctors, specialists, clinics, eye care, and healthcare services near you in Hafizabad District.'
        );
      }
    } else {
      document.title = 'Hafizabad Health Guide | Hafizabad Ki Sehat, Ek Jagah';
    }
  }, [currentTab]);

  // Compare Toggle Helper
  const handleToggleCompare = (hospital: Hospital) => {
    setCompareList((prev) => {
      const exists = prev.some((h) => h.id === hospital.id);
      if (exists) {
        return prev.filter((h) => h.id !== hospital.id);
      }
      if (prev.length >= 4) {
        alert('You can compare up to 4 hospitals at a time.');
        return prev;
      }
      return [...prev, hospital];
    });
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  const handleSelectHospital = (h: Hospital) => {
    setSelectedHospital(h);
    setCurrentTab('hospital-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTab = (tab: string, filter?: string) => {
    if (filter) {
      setInitialAreaFilter(filter);
    } else {
      setInitialAreaFilter('All');
    }
    setSelectedHospital(null);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const url = tab === 'home' ? '/' : `/${tab}`;
      window.history.pushState({ tab }, '', url);
    } catch {
      // ignore
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-900 ${lang === 'ur' ? 'font-urdu' : ''}`}>
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          handleNavigateTab(tab);
        }}
        lang={lang}
        setLang={setLang}
        onOpenSearch={() => setIsSearchOpen(true)}
        compareCount={compareList.length}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={handleOpenAdminLogin}
        onLogoutAdmin={handleLogoutAdmin}
      />

      {/* Main Viewport Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            lang={lang}
            hospitals={hospitals}
            doctors={doctors}
            pharmacies={pharmacies}
            laboratories={laboratories}
            bloodBanks={bloodBanks}
            onNavigateTab={handleNavigateTab}
            onSelectHospital={handleSelectHospital}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}

        {currentTab === 'hospitals' && (
          <HospitalsPage
            lang={lang}
            hospitals={hospitals}
            onSelectHospital={handleSelectHospital}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            initialAreaFilter={initialAreaFilter}
          />
        )}

        {currentTab === 'hospital-detail' && selectedHospital && (
          <HospitalDetailPage
            hospital={selectedHospital}
            doctors={doctors}
            reviews={reviews}
            lang={lang}
            onBack={() => setCurrentTab('hospitals')}
            onOpenReport={(name, id) =>
              setReportModal({ isOpen: true, facilityName: name, facilityId: id })
            }
            onOpenClaim={(name, id) =>
              setClaimModal({ isOpen: true, facilityName: name, facilityId: id, facilityType: 'hospital' })
            }
            onOpenReview={(name, id) =>
              setReviewModal({ isOpen: true, facilityName: name, facilityId: id })
            }
          />
        )}

        {(currentTab === 'find-doctor' || currentTab === 'eyecare' || currentTab === 'doctors') && (
          <FindDoctorPage
            lang={lang}
            doctors={doctors}
            hospitals={hospitals}
            laboratories={laboratories}
            onSelectHospital={handleSelectHospital}
            onOpenReport={(name, id) =>
              setReportModal({ isOpen: true, facilityName: name, facilityId: id })
            }
            initialMode={
              currentTab === 'eyecare'
                ? 'eyecare'
                : currentTab === 'doctors'
                ? 'all-doctors'
                : 'concerns'
            }
          />
        )}

        {currentTab === 'pharmacies' && (
          <PharmaciesPage
            lang={lang}
            pharmacies={pharmacies}
            onOpenReport={(name, id) =>
              setReportModal({ isOpen: true, facilityName: name, facilityId: id })
            }
            onOpenClaim={(name, id) =>
              setClaimModal({ isOpen: true, facilityName: name, facilityId: id, facilityType: 'pharmacy' })
            }
          />
        )}

        {currentTab === 'labs' && (
          <LabsPage
            lang={lang}
            laboratories={laboratories}
            onOpenReport={(name, id) =>
              setReportModal({ isOpen: true, facilityName: name, facilityId: id })
            }
            onOpenClaim={(name, id) =>
              setClaimModal({ isOpen: true, facilityName: name, facilityId: id, facilityType: 'laboratory' })
            }
          />
        )}

        {currentTab === 'blood' && (
          <BloodPage
            lang={lang}
            bloodBanks={bloodBanks}
            onOpenReport={(name, id) =>
              setReportModal({ isOpen: true, facilityName: name, facilityId: id })
            }
          />
        )}

        {currentTab === 'emergency-helplines' && (
          <EmergencyHelplinesPage
            lang={lang}
            helplines={helplines}
          />
        )}

        {currentTab === 'emergency' && (
          <EmergencyPage
            lang={lang}
            hospitals={hospitals}
            bloodBanks={bloodBanks}
            onSelectHospital={handleSelectHospital}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {currentTab === 'map' && (
          <MapPage
            lang={lang}
            hospitals={hospitals}
            pharmacies={pharmacies}
            laboratories={laboratories}
            bloodBanks={bloodBanks}
            onSelectHospital={handleSelectHospital}
          />
        )}

        {currentTab === 'compare' && (
          <ComparePage
            lang={lang}
            hospitals={hospitals}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            onClearCompare={handleClearCompare}
            onSelectHospital={handleSelectHospital}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPage
            lang={lang}
            hospitals={hospitals}
            doctors={doctors}
            pharmacies={pharmacies}
            laboratories={laboratories}
            bloodBanks={bloodBanks}
            onRefreshData={refreshData}
            isAdminLoggedIn={isAdminLoggedIn}
            onLogoutAdmin={handleLogoutAdmin}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        lang={lang}
        onNavigate={handleNavigateTab}
        onOpenClaim={() =>
          setClaimModal({
            isOpen: true,
            facilityName: '',
            facilityId: '',
            facilityType: 'hospital',
          })
        }
        onOpenReport={() =>
          setReportModal({
            isOpen: true,
            facilityName: 'General Hafizabad Directory Listing',
            facilityId: 'general',
          })
        }
        onOpenLegal={(type) => setLegalModal({ isOpen: true, type })}
      />

      {/* Admin Gatekeeper Login Modal */}
      <AdminGatekeeperModal
        isOpen={showAdminLoginModal}
        onLoginSuccess={handleAdminLoginSuccess}
        onContinueAsGuest={handleContinueAsGuest}
        lang={lang}
      />

      {/* Modals */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        lang={lang}
        hospitals={hospitals}
        doctors={doctors}
        pharmacies={pharmacies}
        laboratories={laboratories}
        bloodBanks={bloodBanks}
        onSelectHospital={handleSelectHospital}
        onNavigateTab={handleNavigateTab}
      />

      <ClaimModal
        isOpen={claimModal.isOpen}
        onClose={() => setClaimModal({ ...claimModal, isOpen: false })}
        defaultFacilityName={claimModal.facilityName}
        defaultFacilityId={claimModal.facilityId}
        defaultFacilityType={claimModal.facilityType}
        lang={lang}
      />

      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={() => setReportModal({ ...reportModal, isOpen: false })}
        facilityName={reportModal.facilityName}
        facilityId={reportModal.facilityId}
        lang={lang}
      />

      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ ...reviewModal, isOpen: false })}
        facilityName={reviewModal.facilityName}
        facilityId={reviewModal.facilityId}
        lang={lang}
      />

      <LegalModal
        isOpen={legalModal.isOpen}
        onClose={() => setLegalModal({ ...legalModal, isOpen: false })}
        type={legalModal.type}
      />
    </div>
  );
}
