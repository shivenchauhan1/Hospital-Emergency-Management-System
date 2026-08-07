import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, Siren, Stethoscope, Droplet, Clock, FileText, Search, 
  Upload, QrCode, Bell, Download, CheckCircle2, Lock, ShieldCheck, 
  MapPin, Phone, Mail, Globe, ArrowRight, Activity, Users, Bed, Truck, 
  AlertCircle, Check, Award, ChevronRight 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, AreaChart, Area 
} from 'recharts';
import { HOSPITAL_INFO, INITIAL_DOCTORS, INITIAL_EMERGENCY_CASES } from './data/hospitalStore';
import { 
  fetchDoctors, fetchAmbulances, fetchBeds, fetchBloodStock, 
  fetchEmergencies, postEmergency 
} from './services/api';
import socket from './services/socket';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [ambulances, setAmbulances] = useState([]);
  const [beds, setBeds] = useState([]);
  const [bloodStock, setBloodStock] = useState([]);
  const [emergencyRequests, setEmergencyRequests] = useState(INITIAL_EMERGENCY_CASES);

  const [showQR, setShowQR] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [createdNotice, setCreatedNotice] = useState(null);

  // Initial Data Fetch & Socket.IO Listener Registration
  useEffect(() => {
    const loadInitialData = async () => {
      const [docsData, ambData, bedData, bloodData, erData] = await Promise.all([
        fetchDoctors(),
        fetchAmbulances(),
        fetchBeds(),
        fetchBloodStock(),
        fetchEmergencies()
      ]);
      setDoctors(docsData);
      setAmbulances(ambData);
      setBeds(bedData);
      setBloodStock(bloodData);
      setEmergencyRequests(erData);
    };

    loadInitialData();

    // Socket.IO Listeners
    socket.on('new_emergency_request', (newCase) => {
      setEmergencyRequests(prev => [newCase, ...prev]);
    });

    socket.on('case_updated', (updatedCase) => {
      setEmergencyRequests(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
    });

    socket.on('doctor_assigned', (updatedCase) => {
      setEmergencyRequests(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
    });

    socket.on('ambulance_dispatched', (updatedCase) => {
      setEmergencyRequests(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
    });

    socket.on('bed_allocated', (updatedCase) => {
      setEmergencyRequests(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
    });

    return () => {
      socket.off('new_emergency_request');
      socket.off('case_updated');
      socket.off('doctor_assigned');
      socket.off('ambulance_dispatched');
      socket.off('bed_allocated');
    };
  }, []);

  // Form State
  const [emergencyForm, setEmergencyForm] = useState({
    patientName: 'Rahul Sharma',
    age: '42',
    gender: 'Male',
    phone: '+91 98765 43210',
    emergencyType: 'Accident',
    address: 'Sector 32, Chandigarh',
    description: 'Highway vehicle collision trauma near Tribune Chowk',
    priority: 'Critical'
  });

  const heroChartData = [
    { time: '08:00', cases: 12, beds: 88 },
    { time: '10:00', cases: 24, beds: 76 },
    { time: '12:00', cases: 34, beds: 68 },
    { time: '14:00', cases: 29, beds: 72 },
    { time: '16:00', cases: 38, beds: 64 }
  ];

  const handleEmergencySubmit = async (e) => {
    e.preventDefault();
    const result = await postEmergency(emergencyForm);
    const newCase = result.data || {
      id: `ER-2026-00${emergencyRequests.length + 1}`,
      ...emergencyForm,
      status: 'Pending',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setEmergencyRequests([newCase, ...emergencyRequests]);
    setCreatedNotice({
      id: newCase.id,
      message: "Emergency request registered & broadcasted to Staff Command Center."
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans relative overflow-x-hidden selection:bg-[#0F766E] selection:text-white">
      
      {/* BACKGROUND BLOBS */}
      <div className="fixed inset-0 bg-grid-pattern opacity-60 pointer-events-none z-0" />
      <div className="fixed -top-24 -left-24 w-96 h-96 rounded-full bg-[#14B8A6]/15 blur-3xl animate-blob-1 pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-24 w-96 h-96 rounded-full bg-[#0F766E]/15 blur-3xl animate-blob-2 pointer-events-none z-0" />

      <div className="relative z-10 flex-1 flex flex-col w-full">
        
        {/* TOP HEADER */}
        <header className="w-full bg-[#071A1D] text-slate-300 text-xs py-2.5 px-4 border-b border-teal-900/50 shadow-md">
          <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 font-bold text-red-400">
                <Phone className="w-3.5 h-3.5 animate-bounce shrink-0" />
                <span>Emergency Helpline: <strong className="font-mono text-white text-sm">+91 112</strong></span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-teal-300 font-bold">
                <Truck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Ambulance Hotline: <strong className="font-mono text-white">108</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <span className="bg-teal-950 px-2.5 py-1 rounded-full text-[10px] font-extrabold text-teal-300 border border-teal-700/50">
                NABH & NABL Accredited 24×7
              </span>
            </div>
          </div>
        </header>

        {/* MAIN NAVIGATION BAR */}
        <nav className="w-full bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/80 shadow-sm">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0F766E] to-[#14B8A6] flex items-center justify-center text-white text-xl shadow-lg shadow-teal-700/20">
                🏥
              </div>
              <div>
                <h1 className="text-base font-black text-slate-900 tracking-tight leading-none">
                  Sanjeevani Multispeciality Hospital
                </h1>
                <p className="text-[11px] text-[#0F766E] font-bold mt-0.5">
                  Sector 32, Chandigarh • Punjab, India
                </p>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {[
                { id: 'home', label: 'Home' },
                { id: 'emergency-register', label: 'Emergency' },
                { id: 'doctors', label: 'Doctors' },
                { id: 'bloodbank', label: 'Blood Bank' },
                { id: 'ambulance', label: 'Ambulance' },
                { id: 'beds', label: 'ICU Beds' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                    activeTab === item.id
                      ? 'bg-[#0F766E]/10 text-[#0F766E] font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setActiveTab('emergency-register')}
                className="px-4 py-2.5 rounded-xl text-xs font-black text-white bg-[#DC2626] hover:bg-red-700 shadow-md shadow-red-600/25 transition-all flex items-center gap-2 active:scale-95"
              >
                <Siren className="w-4 h-4 animate-bounce" />
                <span>Register Emergency</span>
              </button>
            </div>
          </div>
        </nav>

        {/* MAIN BODY CONTENT */}
        <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
          
          {/* HOME VIEW */}
          {activeTab === 'home' && (
            <div className="w-full space-y-16">
              
              {/* HERO SECTION */}
              <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
                <div className="lg:col-span-6 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-teal-50 border border-teal-200 text-[#0F766E]">
                    <Activity className="w-4 h-4 text-[#14B8A6] animate-pulse" />
                    <span>Real-Time Emergency Coordination Engine</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
                    Hospital Emergency Management System
                  </h1>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl font-medium">
                    Real-Time Emergency Coordination for Faster, Smarter and Safer Patient Care across Sector 32 Chandigarh.
                  </p>

                  <div className="flex items-center gap-3 pt-2 flex-wrap">
                    <button
                      onClick={() => setActiveTab('emergency-register')}
                      className="px-6 py-3.5 rounded-2xl text-xs font-black text-white bg-[#DC2626] hover:bg-red-700 shadow-lg shadow-red-600/30 transition-all flex items-center gap-2"
                    >
                      <Siren className="w-4 h-4" />
                      <span>Register Emergency</span>
                    </button>
                  </div>
                </div>

                {/* Dashboard Preview Card */}
                <div className="lg:col-span-6">
                  <div className="glass-card p-6 rounded-3xl shadow-2xl border border-slate-200/80 space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                        <h3 className="text-sm font-black text-slate-900 uppercase">Live Command Center Feed</h3>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-[#0F766E] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                        Socket.IO Connected
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-2xl bg-red-50/80 border border-red-200/60 text-red-900">
                        <span className="text-[10px] font-bold uppercase block text-red-700">Emergency Cases</span>
                        <div className="text-xl font-black text-red-700">{emergencyRequests.length}</div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200/60 text-teal-900">
                        <span className="text-[10px] font-bold uppercase block text-teal-700">Doctors Ready</span>
                        <div className="text-xl font-black text-[#0F766E]">{doctors.length}</div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200/60 text-purple-900">
                        <span className="text-[10px] font-bold uppercase block text-purple-700">ICU Beds</span>
                        <div className="text-xl font-black text-purple-800">22 / 50</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* LIVE EMERGENCY TRACKER QUEUE */}
              <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-xl font-black text-slate-900">Live Emergency Status Tracker (Real-Time Socket Sync)</h2>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse font-sans min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase">
                        <th className="p-3">ID</th>
                        <th className="p-3">Patient Name</th>
                        <th className="p-3">Emergency Type</th>
                        <th className="p-3">Priority</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Assigned Doctor</th>
                        <th className="p-3">Ambulance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {emergencyRequests.map((req) => (
                        <tr key={req.id}>
                          <td className="p-3 font-mono font-bold text-[#0F766E]">{req.id}</td>
                          <td className="p-3 font-extrabold text-slate-900">{req.patientName}</td>
                          <td className="p-3 font-bold text-red-700">{req.emergencyType}</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">{req.priority || 'Critical'}</span></td>
                          <td className="p-3 font-extrabold text-teal-800">{req.status}</td>
                          <td className="p-3 font-semibold">{req.assignedDoctor || 'Unassigned'}</td>
                          <td className="p-3 font-mono">{req.ambulanceDispatched || 'None'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* DOCTORS CARDS SECTION */}
              <div className="w-full space-y-6">
                <h2 className="text-2xl font-black text-slate-900">Available Consultant Doctors</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doctors.map((doc) => (
                    <div key={doc.id || doc.name} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center font-bold text-xl">
                        👨‍⚕️
                      </div>
                      <h3 className="text-base font-black text-slate-900">{doc.name}</h3>
                      <div className="text-xs font-extrabold text-[#0F766E]">{doc.department}</div>
                      <p className="text-xs text-slate-500 font-medium">{doc.specialization}</p>
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">{doc.availability}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* EMERGENCY REGISTRATION TAB */}
          {activeTab === 'emergency-register' && (
            <div className="w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-6">
              <h2 className="text-2xl font-black text-slate-900">EMERGENCY CASE REGISTRATION FORM</h2>
              
              {createdNotice && (
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold">
                  {createdNotice.message} (ID: <span className="font-mono text-red-600">{createdNotice.id}</span>)
                </div>
              )}

              <form onSubmit={handleEmergencySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" required placeholder="Patient Name" value={emergencyForm.patientName} onChange={(e) => setEmergencyForm({ ...emergencyForm, patientName: e.target.value })} className="w-full bg-slate-50 border p-3 rounded-xl text-xs" />
                  <input type="text" required placeholder="Phone" value={emergencyForm.phone} onChange={(e) => setEmergencyForm({ ...emergencyForm, phone: e.target.value })} className="w-full bg-slate-50 border p-3 rounded-xl text-xs" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select value={emergencyForm.emergencyType} onChange={(e) => setEmergencyForm({ ...emergencyForm, emergencyType: e.target.value })} className="w-full bg-slate-50 border p-3 rounded-xl text-xs font-bold">
                    <option>Accident</option>
                    <option>Heart Attack</option>
                    <option>Stroke</option>
                    <option>Burn</option>
                    <option>Fracture</option>
                  </select>
                  <input type="text" required placeholder="Address" value={emergencyForm.address} onChange={(e) => setEmergencyForm({ ...emergencyForm, address: e.target.value })} className="w-full bg-slate-50 border p-3 rounded-xl text-xs" />
                </div>
                <button type="submit" className="w-full py-4 text-xs font-black text-white bg-[#DC2626] rounded-2xl shadow-lg">Submit Emergency Case Registration</button>
              </form>
            </div>
          )}

          {/* DOCTORS TAB */}
          {activeTab === 'doctors' && (
            <div className="w-full space-y-6">
              <h2 className="text-2xl font-black text-slate-900">Hospital Medical Faculty</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doc) => (
                  <div key={doc.id || doc.name} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <h3 className="text-base font-black text-slate-900">{doc.name}</h3>
                    <div className="text-xs font-bold text-[#0F766E]">{doc.department}</div>
                    <p className="text-xs text-slate-500">{doc.specialization}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BLOOD BANK TAB */}
          {activeTab === 'bloodbank' && (
            <div className="w-full space-y-6">
              <h2 className="text-2xl font-black text-slate-900">NABL Blood Bank Inventory Stock</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {bloodStock.map((b, idx) => (
                  <div key={idx} className="p-4 bg-white border rounded-2xl space-y-2">
                    <div className="text-2xl font-black text-red-600">{b.group}</div>
                    <div className="text-xs font-mono font-bold">{b.units} Units</div>
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-teal-100 text-teal-800 rounded">{b.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AMBULANCE TAB */}
          {activeTab === 'ambulance' && (
            <div className="w-full space-y-6">
              <h2 className="text-2xl font-black text-slate-900">108 Fleet Availability</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ambulances.map((amb, idx) => (
                  <div key={idx} className="p-6 bg-white border rounded-3xl space-y-2 text-xs">
                    <div className="font-mono font-black text-slate-900 text-base">{amb.number}</div>
                    <div>Driver: {amb.driver}</div>
                    <div>Status: <span className="font-bold text-teal-700">{amb.status}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ICU BEDS TAB */}
          {activeTab === 'beds' && (
            <div className="w-full space-y-6">
              <h2 className="text-2xl font-black text-slate-900">Live ICU & Ward Bed Availability Matrix</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {beds.map((b) => (
                  <div key={b.id} className={`p-3 rounded-2xl border text-center text-xs font-mono ${
                    b.status === 'Occupied' ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}>
                    <div className="font-extrabold">{b.bedNumber}</div>
                    <div>{b.status}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* FOOTER */}
        <footer className="w-full bg-[#071A1D] text-slate-400 text-xs py-8 border-t border-teal-900/50 mt-16 text-center">
          <p>© 2026 Sanjeevani Multispeciality Hospital (Sector 32, Chandigarh). Real-Time Connected Engine.</p>
        </footer>
      </div>
    </div>
  );
}
