import React, { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Portal Views
import PatientPortal from './components/patient/PatientPortal';
import StaffPortal from './components/staff/StaffPortal';

// 10 Standard Hospital Pages
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
  // Global Portal Mode Switcher ('patient' vs 'staff')
  const [portalMode, setPortalMode] = useState('patient');
  const [activePage, setActivePage] = useState('home');

  // Shared State (Connected Database Mongoose / Socket.IO Simulation)
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [emergencyCases, setEmergencyCases] = useState(INITIAL_EMERGENCY_CASES);
  const [ambulances, setAmbulances] = useState(INITIAL_AMBULANCES);
  const [beds, setBeds] = useState(INITIAL_BEDS);
  const [bloodBank, setBloodBank] = useState(INITIAL_BLOOD_BANK);

  // Scroll to top when switching pages or portal mode
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage, portalMode]);

  // Patient Registration Handler
  const handleRegisterEmergency = (newCase) => {
    setEmergencyCases((prev) => [newCase, ...prev]);
  };

  // Staff Handlers
  const handleApproveEmergencyRequest = (id) => {
    setEmergencyCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Approved' } : c))
    );
  };

  const handleAssignDoctor = (id, doctorName) => {
    setEmergencyCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, assignedDoctor: doctorName, doctor: doctorName, status: 'Doctor Assigned' } : c))
    );
  };

  const handleDispatchAmbulance = (id, ambulanceNumber) => {
    setEmergencyCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ambulanceDispatched: ambulanceNumber, status: '108 Ambulance Dispatched' } : c))
    );
  };

  // Patient CRUD
  const handleAddPatient = (newPatient) => {
    setPatients((prev) => [newPatient, ...prev]);
  };

  const handleEditPatient = (updatedPatient) => {
    setPatients((prev) => prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)));
  };

  const handleDeletePatient = (id) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  // Ambulance Handler
  const handleUpdateAmbulanceStatus = (id, status, location) => {
    setAmbulances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, location: location || a.location, ETA: status === 'On Route' ? '8 mins' : 'Immediate' } : a))
    );
  };

  // Bed Handler
  const handleToggleBedStatus = (bedId, status, patientAssigned) => {
    setBeds((prev) =>
      prev.map((b) => (b.id === bedId ? { ...b, status, patientAssigned: patientAssigned || 'None' } : b))
    );
  };

  // Blood Request Handler
  const handleRequestBlood = (group, unitsNeeded) => {
    setBloodBank((prev) =>
      prev.map((item) =>
        item.group === group
          ? {
              ...item,
              units: Math.max(0, item.units - unitsNeeded),
              status: item.units - unitsNeeded < item.minRequired ? 'Low Stock' : 'Adequate Stock'
            }
          : item
      )
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-[#00695C] selection:text-white overflow-x-hidden m-0 p-0">
      
      {/* GLOBAL TOP DUAL-PORTAL SWITCHER STRIP */}
      <div className="w-full bg-[#0F172A] text-white py-2 px-4 border-b border-slate-800">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4 flex-wrap text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-300">Shared Real-Time Database Architecture:</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setPortalMode('patient')}
              className={`px-3 py-1.5 rounded-lg font-black transition-all ${
                portalMode === 'patient'
                  ? 'bg-[#00695C] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🌐 Patient Portal (Public Web)
            </button>

            <button
              onClick={() => setPortalMode('staff')}
              className={`px-3 py-1.5 rounded-lg font-black transition-all ${
                portalMode === 'staff'
                  ? 'bg-[#D32F2F] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🩺 Hospital Staff Portal (Internal Operations)
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {portalMode === 'staff' ? (
          /* STAFF PORTAL VIEW */
          <StaffPortal
            emergencyRequests={emergencyCases}
            onApproveEmergencyRequest={handleApproveEmergencyRequest}
            onAssignDoctor={handleAssignDoctor}
            onDispatchAmbulance={handleDispatchAmbulance}
            doctors={doctors}
            ambulances={ambulances}
            beds={beds}
            onToggleBedStatus={handleToggleBedStatus}
            bloodBank={bloodBank}
            onRequestBlood={handleRequestBlood}
          />
        ) : (
          /* PATIENT PORTAL & NAVIGATION VIEWS */
          <>
            {activePage === 'home' && (
              <div className="space-y-10">
                <HomePage setActivePage={setActivePage} />
                <PatientPortal
                  emergencyRequests={emergencyCases}
                  onRegisterEmergency={handleRegisterEmergency}
                  bloodBank={bloodBank}
                  onRequestBlood={handleRequestBlood}
                  doctors={doctors}
                  ambulances={ambulances}
                  setActivePageGlobal={setActivePage}
                />
              </div>
            )}

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
              <div className="space-y-10">
                <PatientPortal
                  emergencyRequests={emergencyCases}
                  onRegisterEmergency={handleRegisterEmergency}
                  bloodBank={bloodBank}
                  onRequestBlood={handleRequestBlood}
                  doctors={doctors}
                  ambulances={ambulances}
                  setActivePageGlobal={setActivePage}
                />
                <EmergencyPage
                  emergencyCases={emergencyCases}
                  doctors={doctors}
                  onUpdateEmergencyCase={handleApproveEmergencyRequest}
                />
              </div>
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
          </>
        )}
      </main>

      {/* Footer */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}
