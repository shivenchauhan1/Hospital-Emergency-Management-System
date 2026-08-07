import React, { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// 10 Dedicated Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import EmergencyPage from './pages/EmergencyPage';
import DoctorsPage from './pages/DoctorsPage';
import AmbulancePage from './pages/AmbulancePage';
import BedsPage from './pages/BedsPage';
import BloodBankPage from './pages/BloodBankPage';
import ReportsPage from './pages/ReportsPage';
import ContactPage from './pages/ContactPage';

// Datasets
import { 
  INITIAL_PATIENTS, 
  INITIAL_DOCTORS, 
  INITIAL_EMERGENCY_CASES, 
  INITIAL_AMBULANCES, 
  INITIAL_BEDS, 
  INITIAL_BLOOD_BANK 
} from './data/hospitalStore';

export default function App() {
  const [activePage, setActivePage] = useState('home');

  // Shared State
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [emergencyCases, setEmergencyCases] = useState(INITIAL_EMERGENCY_CASES);
  const [ambulances, setAmbulances] = useState(INITIAL_AMBULANCES);
  const [beds, setBeds] = useState(INITIAL_BEDS);
  const [bloodBank, setBloodBank] = useState(INITIAL_BLOOD_BANK);

  // Scroll to top when switching pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  // Patient Handlers
  const handleAddPatient = (newPatient) => {
    setPatients((prev) => [newPatient, ...prev]);
  };

  const handleEditPatient = (updatedPatient) => {
    setPatients((prev) => prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)));
  };

  const handleDeletePatient = (id) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  // Emergency Case Handlers
  const handleUpdateEmergencyCase = (id, updates) => {
    setEmergencyCases((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  // Ambulance Handlers
  const handleUpdateAmbulanceStatus = (id, status, location) => {
    setAmbulances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, location: location || a.location, ETA: status === 'On Duty' ? '12 mins' : 'Immediate' } : a))
    );
  };

  // Bed Handlers
  const handleToggleBedStatus = (bedId, status, patientAssigned) => {
    setBeds((prev) =>
      prev.map((b) => (b.id === bedId ? { ...b, status, patientAssigned: patientAssigned || 'None' } : b))
    );
  };

  // Blood Bank Request Handler
  const handleRequestBlood = (group, unitsNeeded) => {
    setBloodBank((prev) =>
      prev.map((item) =>
        item.group === group
          ? {
              ...item,
              units: Math.max(0, item.units - unitsNeeded),
              status: item.units - unitsNeeded < item.minRequired ? 'Low Stock' : 'Adequate'
            }
          : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-[#0F766E] selection:text-white">
      {/* Navigation Header */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Page Body */}
      <main className="flex-1 px-3 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
        {activePage === 'home' && <HomePage setActivePage={setActivePage} />}

        {activePage === 'dashboard' && (
          <DashboardPage
            patients={patients}
            emergencyCases={emergencyCases}
            doctors={doctors}
            ambulances={ambulances}
            beds={beds}
            bloodBank={bloodBank}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'patients' && (
          <PatientsPage
            patients={patients}
            onAddPatient={handleAddPatient}
            onEditPatient={handleEditPatient}
            onDeletePatient={handleDeletePatient}
          />
        )}

        {activePage === 'emergency' && (
          <EmergencyPage
            emergencyCases={emergencyCases}
            doctors={doctors}
            onUpdateEmergencyCase={handleUpdateEmergencyCase}
          />
        )}

        {activePage === 'doctors' && <DoctorsPage doctors={doctors} />}

        {activePage === 'ambulance' && (
          <AmbulancePage
            ambulances={ambulances}
            onUpdateAmbulanceStatus={handleUpdateAmbulanceStatus}
          />
        )}

        {activePage === 'beds' && (
          <BedsPage beds={beds} onToggleBedStatus={handleToggleBedStatus} />
        )}

        {activePage === 'bloodbank' && (
          <BloodBankPage bloodBank={bloodBank} onRequestBlood={handleRequestBlood} />
        )}

        {activePage === 'reports' && <ReportsPage />}

        {activePage === 'contact' && <ContactPage />}
      </main>

      {/* Footer */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}
