import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Siren, Stethoscope, Bed, Truck, Droplet, Download, 
  Search, Check, CheckCircle2, LayoutDashboard, Users, Activity, 
  FileText, Bell, Settings, LogOut, Menu, X, Clock, AlertTriangle, 
  PhoneCall, ChevronRight, UserPlus, FileCheck, Layers, RefreshCw, 
  Filter, Calendar, BarChart3, TrendingUp 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  HOSPITAL_INFO, INITIAL_DOCTORS, INITIAL_EMERGENCY_CASES, 
  INITIAL_AMBULANCES, INITIAL_BEDS 
} from './data/hospitalStore';
import { 
  fetchStaffEmergencies, approveEmergencyAPI, assignDoctorAPI, 
  dispatchAmbulanceAPI, allocateBedAPI 
} from './services/api';
import socket from './services/socket';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeConsole, setActiveConsole] = useState('dashboard');
  const [staffRole, setStaffRole] = useState('Admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [downloadNotice, setDownloadNotice] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Shared State
  const [emergencyCases, setEmergencyCases] = useState(INITIAL_EMERGENCY_CASES);
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [ambulances, setAmbulances] = useState(INITIAL_AMBULANCES);
  const [beds, setBeds] = useState(INITIAL_BEDS);

  // Blood Stock State
  const [bloodStock, setBloodStock] = useState([
    { group: 'A+', units: 65, status: 'Adequate' },
    { group: 'A-', units: 14, status: 'Low Stock' },
    { group: 'B+', units: 82, status: 'Adequate' },
    { group: 'B-', units: 9, status: 'Critical Shortage' },
    { group: 'AB+', units: 48, status: 'Adequate' },
    { group: 'AB-', units: 6, status: 'Critical Shortage' },
    { group: 'O+', units: 88, status: 'Adequate' },
    { group: 'O-', units: 8, status: 'Low Stock' }
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Emergency Triage Intake', time: 'Just now', message: 'ER20260012 - Rahul Sharma (Accident / Critical)', type: 'emergency' },
    { id: 2, title: '108 Ambulance Dispatch Alert', time: '10 Mins ago', message: 'Vehicle PB01AB1234 dispatched to Tribune Chowk', type: 'ambulance' }
  ]);

  // Initial Data Fetch & Socket.IO Event Engine Setup
  useEffect(() => {
    const loadStaffData = async () => {
      const erData = await fetchStaffEmergencies();
      if (erData && erData.length > 0) {
        setEmergencyCases(erData);
      }
    };

    loadStaffData();

    // Listen for Real-Time Socket.IO broadcasts from Patient submissions
    socket.on('new_emergency_request', (newCase) => {
      setEmergencyCases(prev => [newCase, ...prev]);
      setNotifications(prev => [
        {
          id: Date.now(),
          title: '🚨 INCOMING EMERGENCY REQUEST',
          time: 'Just now',
          message: `${newCase.id} - ${newCase.patientName} (${newCase.emergencyType} / ${newCase.priority})`,
          type: 'emergency'
        },
        ...prev
      ]);
    });

    socket.on('case_updated', (updatedCase) => {
      setEmergencyCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
    });

    return () => {
      socket.off('new_emergency_request');
      socket.off('case_updated');
    };
  }, []);

  // Update Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    return () => clearInterval(timer);
  }, []);

  // Staff Actions
  const handleApprove = async (id) => {
    setEmergencyCases(emergencyCases.map(c => c.id === id ? { ...c, status: 'Approved' } : c));
    await approveEmergencyAPI(id);
  };

  const handleAssignDoctor = async (id, doctorName) => {
    setEmergencyCases(emergencyCases.map(c => c.id === id ? { ...c, doctor: doctorName, assignedDoctor: doctorName, status: 'Doctor Assigned' } : c));
    await assignDoctorAPI(id, doctorName);
  };

  const handleDispatchAmbulance = async (id, ambulanceNumber) => {
    setEmergencyCases(emergencyCases.map(c => c.id === id ? { ...c, ambulance: ambulanceNumber, ambulanceDispatched: ambulanceNumber, status: 'Ambulance Dispatched' } : c));
    await dispatchAmbulanceAPI(id, ambulanceNumber);
  };

  const handleToggleBedStatus = (bedId, newStatus) => {
    setBeds(beds.map(b => b.id === bedId ? { ...b, status: newStatus } : b));
  };

  const handleAddBloodStock = (group, units) => {
    setBloodStock(bloodStock.map(b => b.group === group ? { ...b, units: b.units + units } : b));
  };

  const handleDownloadPDF = () => {
    setDownloadNotice('Generating Sanjeevani Hospital Operations PDF Audit Report...');
    setTimeout(() => {
      setDownloadNotice('✅ PDF Executive Report Downloaded Successfully!');
      setTimeout(() => setDownloadNotice(''), 3000);
    }, 1200);
  };

  const handleDownloadExcel = () => {
    setDownloadNotice('Exporting Sanjeevani Clinical & Bed Dataset to Excel (.xlsx)...');
    setTimeout(() => {
      setDownloadNotice('✅ Excel Dataset Export Downloaded Successfully!');
      setTimeout(() => setDownloadNotice(''), 3000);
    }, 1200);
  };

  const analyticsData = [
    { name: 'Mon', emergency: 32, admissions: 112 },
    { name: 'Tue', emergency: 38, admissions: 124 },
    { name: 'Wed', emergency: 41, admissions: 135 },
    { name: 'Thu', emergency: 34, admissions: 128 },
    { name: 'Fri', emergency: 46, admissions: 142 },
    { name: 'Sat', emergency: 52, admissions: 150 },
    { name: 'Sun', emergency: 34, admissions: 127 }
  ];

  const pendingCount = emergencyCases.filter(c => c.status === 'Pending').length;

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans overflow-x-hidden">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-[#071A1D] text-slate-300 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out border-r border-teal-900/50 flex flex-col justify-between shadow-2xl`}>
        <div className="space-y-6 p-5">
          <div className="flex items-center justify-between border-b border-teal-900/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0F766E] to-[#14B8A6] flex items-center justify-center text-white text-xl shadow-lg">
                🏥
              </div>
              <div>
                <h1 className="text-sm font-black text-white tracking-tight leading-none">Sanjeevani HEMS</h1>
                <p className="text-[10px] text-teal-400 font-bold mt-1">Hospital Administration</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white lg:hidden">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'emergency', label: 'Emergency Queue', icon: Siren, badge: pendingCount },
              { id: 'doctors', label: 'Doctor Panel', icon: Stethoscope },
              { id: 'ambulances', label: '108 Fleet Control', icon: Truck },
              { id: 'beds', label: 'Bed & ICU Matrix', icon: Bed },
              { id: 'bloodbank', label: 'Blood Bank Stock', icon: Droplet },
              { id: 'reports', label: 'Clinical Analytics', icon: BarChart3 }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveConsole(item.id); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                    activeConsole === item.id
                      ? 'bg-[#0F766E] text-white shadow-md shadow-teal-900/40'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-teal-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        
        {/* TOPBAR */}
        <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-extrabold text-[#0F766E] bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
              <Clock className="w-3.5 h-3.5 text-[#14B8A6] animate-spin" />
              <span>{currentTime} | Sector 32 Chandigarh</span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={staffRole}
              onChange={(e) => setStaffRole(e.target.value)}
              className="bg-[#071A1D] border border-teal-800 rounded-xl px-3 py-1.5 text-xs font-extrabold text-teal-300 focus:outline-none"
            >
              <option value="Admin">Admin (Full Control)</option>
              <option value="Doctor">Doctor Consultant</option>
              <option value="Receptionist">Receptionist Intake</option>
              <option value="Emergency Coordinator">Emergency Coordinator</option>
              <option value="Blood Bank Officer">Blood Bank Officer</option>
              <option value="Ambulance Control">Ambulance Control</option>
            </select>

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 relative"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-red-600 absolute top-1 right-1 animate-ping" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h4 className="text-xs font-black text-slate-900">Hospital Real-Time Alerts</h4>
                    <span className="text-[10px] text-teal-600 font-bold">{notifications.length} New</span>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-teal-50/60 border border-teal-100 text-xs space-y-1">
                        <div className="font-extrabold text-slate-900">{n.title}</div>
                        <div className="text-[11px] text-slate-600">{n.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
          {activeConsole === 'dashboard' && (
            <div className="space-y-8">
              
              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
                {[
                  { title: 'TOTAL PATIENTS', val: '127' },
                  { title: 'ER CASES', val: emergencyCases.length },
                  { title: 'PENDING', val: pendingCount },
                  { title: 'DOCTORS READY', val: doctors.length },
                  { title: 'ICU BEDS FREE', val: '22 / 50' },
                  { title: 'BLOOD UNITS', val: '320' },
                  { title: '108 AMBULANCE', val: ambulances.length },
                  { title: 'SURGERIES', val: '6 Today' },
                  { title: 'AVG RESPONSE', val: '4.2 Mins' },
                  { title: 'RECOVERY RATE', val: '98.4%' }
                ].map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl border bg-white shadow-sm space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider block opacity-75">{m.title}</span>
                    <div className="text-xl font-black">{m.val}</div>
                  </div>
                ))}
              </div>

              {/* Emergency Queue Table */}
              <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h3 className="text-base font-black text-slate-900">Emergency Queue & Real-Time Control Table</h3>
                  <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                    Pending Actions: {pendingCount}
                  </span>
                </div>

                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse font-sans min-w-[800px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase">
                        <th className="p-3.5">ID</th>
                        <th className="p-3.5">Patient Name</th>
                        <th className="p-3.5">Type</th>
                        <th className="p-3.5">Priority</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Assigned Doctor</th>
                        <th className="p-3.5 text-center">Staff Control Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {emergencyCases.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50">
                          <td className="p-3.5 font-mono font-bold text-[#0F766E]">{req.id}</td>
                          <td className="p-3.5 font-extrabold text-slate-900">{req.patientName || req.patient}</td>
                          <td className="p-3.5 font-bold text-red-700">{req.emergencyType}</td>
                          <td className="p-3.5">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-600 text-white">
                              {req.priority || 'Critical'}
                            </span>
                          </td>
                          <td className="p-3.5 font-extrabold text-teal-800">{req.status}</td>
                          <td className="p-3.5 font-semibold text-slate-700">{req.assignedDoctor || req.doctor || 'Unassigned'}</td>
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                              {req.status === 'Pending' && (
                                <button onClick={() => handleApprove(req.id)} className="px-2.5 py-1 text-xs font-black bg-emerald-600 text-white rounded-lg shadow-sm">Approve</button>
                              )}
                              <button onClick={() => handleAssignDoctor(req.id, 'Dr. Rajesh Sharma')} className="px-2.5 py-1 text-xs font-black bg-teal-50 text-[#0F766E] border border-teal-200 rounded-lg">Assign Dr. Sharma</button>
                              <button onClick={() => handleDispatchAmbulance(req.id, 'PB01AB1234')} className="px-2.5 py-1 text-xs font-black bg-red-50 text-red-700 border border-red-200 rounded-lg">Dispatch 108</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
