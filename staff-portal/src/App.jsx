import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Siren, Stethoscope, Bed, Truck, Droplet, Download, 
  Search, Check, CheckCircle2, LayoutDashboard, Users, Activity, 
  FileText, Bell, Settings, LogOut, Menu, X, Clock, AlertTriangle, 
  PhoneCall, ChevronRight, UserPlus, FileCheck, Layers, RefreshCw, 
  Filter, Calendar, BarChart3, TrendingUp, Plus, Trash2, Edit3, Eye, 
  CheckSquare, ShieldAlert, HeartPulse 
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
  fetchStaffEmergencies, fetchPatients, createPatientAPI, deletePatientAPI, 
  fetchStaffMembers, createStaffAPI, approveEmergencyAPI, assignDoctorAPI, 
  dispatchAmbulanceAPI, allocateBedAPI 
} from './services/api';
import socket from './services/socket';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeConsole, setActiveConsole] = useState('dashboard');
  const [staffRole, setStaffRole] = useState('Admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [downloadNotice, setDownloadNotice] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Modals State
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  // Shared State
  const [emergencyCases, setEmergencyCases] = useState(INITIAL_EMERGENCY_CASES);
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [patients, setPatients] = useState([]);
  const [ambulances, setAmbulances] = useState(INITIAL_AMBULANCES);
  const [beds, setBeds] = useState(INITIAL_BEDS);
  const [staffMembers, setStaffMembers] = useState([]);

  // Form Input States
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: 'Male', phone: '', ward: 'General Ward', bloodGroup: 'O+' });
  const [newDoctor, setNewDoctor] = useState({ name: '', department: 'Cardiology', specialization: '', experience: '10 Years' });
  const [newStaff, setNewStaff] = useState({ name: '', role: 'Receptionist', department: 'Patient Intake', email: '', phone: '' });

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
    { id: 2, title: '108 Ambulance Dispatch Alert', time: '10 Mins ago', message: 'Vehicle PB01AB1234 dispatched to Tribune Chowk', type: 'ambulance' },
    { id: 3, title: 'ICU Bed Allocation Notice', time: '20 Mins ago', message: 'Bed-ICU-02 allocated for cardiac resuscitation', type: 'bed' }
  ]);

  // Load Data & Socket Hooks
  useEffect(() => {
    const loadAllData = async () => {
      const [erData, patData, stfData] = await Promise.all([
        fetchStaffEmergencies(),
        fetchPatients(),
        fetchStaffMembers()
      ]);
      if (erData) setEmergencyCases(erData);
      if (patData) setPatients(patData);
      if (stfData) setStaffMembers(stfData);
    };

    loadAllData();

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

  // Emergency Queue Staff Handlers
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

  const handleAllocateBed = async (id, bedNumber) => {
    setEmergencyCases(emergencyCases.map(c => c.id === id ? { ...c, bedAllocated: bedNumber, status: 'Treatment Started' } : c));
    await allocateBedAPI(id, bedNumber);
  };

  // CRUD Handlers
  const handleCreatePatient = async (e) => {
    e.preventDefault();
    const res = await createPatientAPI(newPatient);
    setPatients([res.data, ...patients]);
    setShowAddPatientModal(false);
    setNewPatient({ name: '', age: '', gender: 'Male', phone: '', ward: 'General Ward', bloodGroup: 'O+' });
  };

  const handleDeletePatient = async (id) => {
    await deletePatientAPI(id);
    setPatients(patients.filter(p => p.id !== id));
  };

  const handleCreateDoctor = (e) => {
    e.preventDefault();
    const createdDoc = {
      id: `DOC-${100 + doctors.length + 1}`,
      name: newDoctor.name,
      department: newDoctor.department,
      specialization: newDoctor.specialization || 'Consultant Specialist',
      experience: newDoctor.experience,
      availability: 'Available'
    };
    setDoctors([createdDoc, ...doctors]);
    setShowAddDoctorModal(false);
    setNewDoctor({ name: '', department: 'Cardiology', specialization: '', experience: '10 Years' });
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    const res = await createStaffAPI(newStaff);
    setStaffMembers([res.data, ...staffMembers]);
    setShowAddStaffModal(false);
    setNewStaff({ name: '', role: 'Receptionist', department: 'Patient Intake', email: '', phone: '' });
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
      
      {/* SIDEBAR NAVIGATION */}
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
              { id: 'patients', label: 'Patients Directory', icon: Users, badge: patients.length },
              { id: 'doctors', label: 'Doctor Panel', icon: Stethoscope, badge: doctors.length },
              { id: 'departments', label: 'Departments', icon: Layers },
              { id: 'ambulances', label: '108 Fleet Control', icon: Truck },
              { id: 'beds', label: 'Bed & ICU Matrix', icon: Bed },
              { id: 'bloodbank', label: 'Blood Bank Stock', icon: Droplet },
              { id: 'appointments', label: 'Appointments Roster', icon: Calendar },
              { id: 'reports', label: 'Clinical Analytics', icon: BarChart3 },
              { id: 'notifications', label: 'Alerts Feed', icon: Bell, badge: notifications.length },
              { id: 'staff', label: 'Staff Management', icon: ShieldCheck, badge: staffMembers.length },
              { id: 'settings', label: 'System Settings', icon: Settings }
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

        <div className="p-5 border-t border-teal-900/60 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-800 text-teal-200 flex items-center justify-center font-black text-xs border border-teal-600">
              RS
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-black text-white truncate">Dr. Rajesh Sharma</div>
              <div className="text-[10px] text-teal-400 font-mono font-bold truncate">Role: {staffRole}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
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
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Global search patients, doctors, ER ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#0F766E] w-36 sm:w-56"
              />
            </div>

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
            </select>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
          
          {/* DASHBOARD CONSOLE */}
          {activeConsole === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
                {[
                  { title: 'TOTAL PATIENTS', val: patients.length || '127' },
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
                    <div className="text-xl font-black text-slate-900">{m.val}</div>
                  </div>
                ))}
              </div>

              {/* Emergency Queue Table */}
              <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h3 className="text-base font-black text-slate-900">Emergency Queue & Control Table</h3>
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
                          <td className="p-3.5"><span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-600 text-white">{req.priority || 'Critical'}</span></td>
                          <td className="p-3.5 font-extrabold text-teal-800">{req.status}</td>
                          <td className="p-3.5 font-semibold text-slate-700">{req.assignedDoctor || req.doctor || 'Unassigned'}</td>
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                              {req.status === 'Pending' && (
                                <button onClick={() => handleApprove(req.id)} className="px-2.5 py-1 text-xs font-black bg-emerald-600 text-white rounded-lg shadow-sm">Approve</button>
                              )}
                              <button onClick={() => handleAssignDoctor(req.id, 'Dr. Rajesh Sharma')} className="px-2.5 py-1 text-xs font-black bg-teal-50 text-[#0F766E] border border-teal-200 rounded-lg">Assign Dr. Sharma</button>
                              <button onClick={() => handleDispatchAmbulance(req.id, 'PB01AB1234')} className="px-2.5 py-1 text-xs font-black bg-red-50 text-red-700 border border-red-200 rounded-lg">Dispatch 108</button>
                              <button onClick={() => handleAllocateBed(req.id, 'Bed-ICU-01')} className="px-2.5 py-1 text-xs font-black bg-purple-50 text-purple-800 border border-purple-200 rounded-lg">Allocate Bed</button>
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

          {/* EMERGENCY QUEUE CONSOLE */}
          {activeConsole === 'emergency' && (
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-slate-900">Emergency Queue & Control Table</h2>
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse font-sans min-w-[800px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase">
                      <th className="p-3">Emergency ID</th>
                      <th className="p-3">Patient</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Doctor</th>
                      <th className="p-3">Ambulance</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {emergencyCases.map((req) => (
                      <tr key={req.id}>
                        <td className="p-3 font-mono font-bold text-[#0F766E]">{req.id}</td>
                        <td className="p-3 font-extrabold">{req.patientName || req.patient}</td>
                        <td className="p-3 font-bold text-red-700">{req.emergencyType}</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">{req.priority}</span></td>
                        <td className="p-3 font-bold text-teal-800">{req.status}</td>
                        <td className="p-3">{req.assignedDoctor || 'Unassigned'}</td>
                        <td className="p-3 font-mono">{req.ambulanceDispatched || 'None'}</td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center gap-1.5 flex-wrap">
                            <button onClick={() => handleApprove(req.id)} className="px-2 py-1 bg-emerald-600 text-white font-bold rounded text-xs">Approve</button>
                            <button onClick={() => handleAssignDoctor(req.id, 'Dr. Rajesh Sharma')} className="px-2 py-1 bg-teal-50 text-[#0F766E] border border-teal-200 font-bold rounded text-xs">Assign Doctor</button>
                            <button onClick={() => handleDispatchAmbulance(req.id, 'PB01AB1234')} className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 font-bold rounded text-xs">Dispatch 108</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PATIENTS DIRECTORY CONSOLE */}
          {activeConsole === 'patients' && (
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-xl font-black text-slate-900">Hospital Patient Directory</h2>
                <button onClick={() => setShowAddPatientModal(true)} className="px-4 py-2 bg-[#0F766E] text-white text-xs font-black rounded-xl flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add New Patient
                </button>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse font-sans min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase">
                      <th className="p-3">Patient ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Age / Gender</th>
                      <th className="p-3">Blood Group</th>
                      <th className="p-3">Ward</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {patients.map((p) => (
                      <tr key={p.id}>
                        <td className="p-3 font-mono font-bold text-[#0F766E]">{p.id}</td>
                        <td className="p-3 font-extrabold">{p.name}</td>
                        <td className="p-3">{p.age} Yrs / {p.gender}</td>
                        <td className="p-3 font-bold text-red-600">{p.bloodGroup}</td>
                        <td className="p-3 font-medium">{p.ward}</td>
                        <td className="p-3"><span className="px-2 py-0.5 text-[10px] font-bold bg-teal-100 text-teal-800 rounded">{p.status}</span></td>
                        <td className="p-3 text-center">
                          <button onClick={() => handleDeletePatient(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Delete Patient">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DOCTOR PANEL CONSOLE */}
          {activeConsole === 'doctors' && (
            <div className="w-full space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-xl font-black text-slate-900">Consultant Doctor Roster & Medical Faculty</h2>
                <button onClick={() => setShowAddDoctorModal(true)} className="px-4 py-2 bg-[#0F766E] text-white text-xs font-black rounded-xl flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Doctor
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((d) => (
                  <div key={d.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center text-xl font-bold">
                        👨‍⚕️
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900">{d.name}</h3>
                        <div className="text-xs font-extrabold text-[#0F766E]">{d.department}</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{d.specialization}</p>
                    <div className="text-xs font-semibold text-slate-600">Experience: {d.experience}</div>
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">{d.availability}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DEPARTMENTS CONSOLE */}
          {activeConsole === 'departments' && (
            <div className="w-full space-y-6">
              <h2 className="text-xl font-black text-slate-900">Hospital Departments Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Emergency Medicine', head: 'Dr. Vivek Singh', staff: 45, status: 'Operational' },
                  { name: 'Cardiology', head: 'Dr. Rajesh Sharma', staff: 28, status: 'Operational' },
                  { name: 'Neurology', head: 'Dr. Priya Mehta', staff: 22, status: 'Operational' },
                  { name: 'Orthopedics', head: 'Dr. Kavita Kapoor', staff: 20, status: 'Operational' },
                  { name: 'ICU Tower', head: 'Dr. Neha Kapoor', staff: 50, status: 'Operational' },
                  { name: 'Blood Bank', head: 'Dr. Rekha Gupta', staff: 12, status: 'Operational' }
                ].map((dept, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <h3 className="text-base font-black text-slate-900">{dept.name}</h3>
                    <div className="text-xs text-slate-600">HOD: <strong className="text-[#0F766E]">{dept.head}</strong></div>
                    <div className="text-xs text-slate-500">Staff On Duty: {dept.staff} Members</div>
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">{dept.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 108 AMBULANCE FLEET CONSOLE */}
          {activeConsole === 'ambulances' && (
            <div className="w-full space-y-6">
              <h2 className="text-xl font-black text-slate-900">108 Emergency Ambulance Fleet Control</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ambulances.map((a) => (
                  <div key={a.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-black text-slate-900 text-base">{a.number}</span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">{a.status}</span>
                    </div>
                    <div className="text-slate-700 font-semibold">Driver: {a.driver}</div>
                    <div className="text-slate-500 font-mono">Location: {a.location}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BED MATRIX CONSOLE */}
          {activeConsole === 'beds' && (
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-slate-900">Ward & ICU Bed Allocation Matrix</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {beds.map((b) => (
                  <div key={b.id} className={`p-3 rounded-2xl border text-center font-mono text-xs ${
                    b.status === 'Occupied' ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}>
                    <div className="font-extrabold">{b.bedNumber}</div>
                    <div className="text-[10px] font-bold">{b.status}</div>
                    <div className="pt-1 flex justify-center gap-1">
                      <button onClick={() => handleToggleBedStatus(b.id, 'Available')} className="px-2 py-0.5 text-[9px] bg-emerald-600 text-white rounded font-bold">Release</button>
                      <button onClick={() => handleToggleBedStatus(b.id, 'Occupied')} className="px-2 py-0.5 text-[9px] bg-red-600 text-white rounded font-bold">Allocate</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BLOOD BANK CONSOLE */}
          {activeConsole === 'bloodbank' && (
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-slate-900">Sanjeevani NABL Blood Reserve Inventory</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {bloodStock.map((b, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-2xl font-black text-red-600">{b.group}</div>
                    <div className="text-xs font-mono font-bold">{b.units} Units Available</div>
                    <span className="inline-block px-2 py-0.5 text-[9px] font-bold bg-teal-100 text-teal-800 rounded">{b.status}</span>
                    <button onClick={() => handleAddBloodStock(b.group, 5)} className="w-full py-1 text-[10px] font-bold bg-[#0F766E] text-white rounded-lg">+ Add 5 Units</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* APPOINTMENTS CONSOLE */}
          {activeConsole === 'appointments' && (
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-slate-900">Patient Appointments Roster</h2>
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse font-sans min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase">
                      <th className="p-3">Patient</th>
                      <th className="p-3">Doctor</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Date / Time</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { patient: 'Rahul Sharma', doctor: 'Dr. Rajesh Sharma', dept: 'Cardiology', time: 'Today 11:30 AM', status: 'Scheduled' },
                      { patient: 'Pooja Verma', doctor: 'Dr. Priya Mehta', dept: 'Neurology', time: 'Today 02:00 PM', status: 'Scheduled' }
                    ].map((app, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-extrabold">{app.patient}</td>
                        <td className="p-3 font-semibold text-[#0F766E]">{app.doctor}</td>
                        <td className="p-3">{app.dept}</td>
                        <td className="p-3 font-mono">{app.time}</td>
                        <td className="p-3"><span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded">{app.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REPORTS CONSOLE */}
          {activeConsole === 'reports' && (
            <div className="w-full space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-xl font-black text-slate-900">Clinical Operations & Analytics Reports</h2>
                <div className="flex gap-2">
                  <button onClick={handleDownloadPDF} className="px-4 py-2 bg-slate-900 text-white text-xs font-black rounded-xl">Download PDF</button>
                  <button onClick={handleDownloadExcel} className="px-4 py-2 bg-[#0F766E] text-white text-xs font-black rounded-xl">Export Excel</button>
                </div>
              </div>

              {downloadNotice && (
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold text-center">
                  {downloadNotice}
                </div>
              )}

              <div className="p-6 bg-white border rounded-3xl space-y-4">
                <h3 className="text-sm font-black text-slate-900">Weekly Patient Intake Chart</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                      <YAxis stroke="#64748B" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="emergency" name="Emergency Cases" fill="#DC2626" />
                      <Bar dataKey="admissions" name="Admissions" fill="#0F766E" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS CONSOLE */}
          {activeConsole === 'notifications' && (
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-slate-900">Hospital Real-Time Alerts Feed</h2>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">{n.title}</div>
                      <div className="text-xs text-slate-600 mt-1">{n.message}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAFF MANAGEMENT CONSOLE */}
          {activeConsole === 'staff' && (
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-xl font-black text-slate-900">Staff User Directory & RBAC Permissions</h2>
                <button onClick={() => setShowAddStaffModal(true)} className="px-4 py-2 bg-[#0F766E] text-white text-xs font-black rounded-xl flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Staff Member
                </button>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse font-sans min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase">
                      <th className="p-3">Staff ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {staffMembers.map((s) => (
                      <tr key={s.id}>
                        <td className="p-3 font-mono font-bold text-[#0F766E]">{s.id}</td>
                        <td className="p-3 font-extrabold">{s.name}</td>
                        <td className="p-3 font-bold text-teal-800">{s.role}</td>
                        <td className="p-3">{s.department}</td>
                        <td className="p-3 font-mono">{s.email}</td>
                        <td className="p-3"><span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded">{s.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SETTINGS CONSOLE */}
          {activeConsole === 'settings' && (
            <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-slate-900">Sanjeevani Hospital Administration Settings</h2>
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border space-y-1">
                  <div className="font-bold text-slate-900">Hospital Institution:</div>
                  <div className="text-slate-600 font-medium">Sanjeevani Multispeciality Hospital, Sector 32, Chandigarh – 160030, Punjab, India</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border space-y-1">
                  <div className="font-bold text-slate-900">Emergency Helpline Integration:</div>
                  <div className="text-red-600 font-mono font-bold">Helpline: +91 112 | 108 Ambulance Fleet Active</div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* MODAL DIALOGS FOR CRUD */}
        {showAddPatientModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <h3 className="text-base font-black text-slate-900">Add New Patient Intake</h3>
              <form onSubmit={handleCreatePatient} className="space-y-3 text-xs">
                <input type="text" required placeholder="Patient Full Name" value={newPatient.name} onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })} className="w-full border p-2.5 rounded-xl bg-slate-50" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" required placeholder="Age" value={newPatient.age} onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })} className="border p-2.5 rounded-xl bg-slate-50" />
                  <input type="text" required placeholder="Phone" value={newPatient.phone} onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })} className="border p-2.5 rounded-xl bg-slate-50" />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button type="button" onClick={() => setShowAddPatientModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[#0F766E] text-white rounded-xl font-black">Save Patient</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAddDoctorModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <h3 className="text-base font-black text-slate-900">Add Consultant Doctor</h3>
              <form onSubmit={handleCreateDoctor} className="space-y-3 text-xs">
                <input type="text" required placeholder="Dr. Full Name" value={newDoctor.name} onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })} className="w-full border p-2.5 rounded-xl bg-slate-50" />
                <input type="text" required placeholder="Department (e.g. Cardiology)" value={newDoctor.department} onChange={(e) => setNewDoctor({ ...newDoctor, department: e.target.value })} className="w-full border p-2.5 rounded-xl bg-slate-50" />
                <div className="flex gap-2 justify-end pt-2">
                  <button type="button" onClick={() => setShowAddDoctorModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[#0F766E] text-white rounded-xl font-black">Save Doctor</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAddStaffModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <h3 className="text-base font-black text-slate-900">Add Staff Roster Member</h3>
              <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
                <input type="text" required placeholder="Staff Full Name" value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} className="w-full border p-2.5 rounded-xl bg-slate-50" />
                <input type="email" required placeholder="Email Address" value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} className="w-full border p-2.5 rounded-xl bg-slate-50" />
                <div className="flex gap-2 justify-end pt-2">
                  <button type="button" onClick={() => setShowAddStaffModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[#0F766E] text-white rounded-xl font-black">Save Staff Member</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="w-full bg-[#071A1D] text-slate-400 text-xs py-6 text-center border-t border-teal-900/50 mt-12">
          <p>© 2026 Sanjeevani Multispeciality Hospital (Sector 32, Chandigarh). Enterprise Administration Dashboard.</p>
        </footer>
      </div>
    </div>
  );
}
