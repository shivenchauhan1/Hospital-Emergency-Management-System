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
    { id: 2, title: '108 Ambulance Dispatch Alert', time: '10 Mins ago', message: 'Vehicle PB01AB1234 dispatched to Tribune Chowk', type: 'ambulance' },
    { id: 3, title: 'ICU Bed 04 Reserved', time: '25 Mins ago', message: 'ICU Tower Bed allocated for Resuscitation', type: 'bed' }
  ]);

  // Update Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    return () => clearInterval(timer);
  }, []);

  // Handlers
  const handleApprove = (id) => {
    setEmergencyCases(emergencyCases.map(c => c.id === id ? { ...c, status: 'Approved' } : c));
  };

  const handleAssignDoctor = (id, doctorName) => {
    setEmergencyCases(emergencyCases.map(c => c.id === id ? { ...c, doctor: doctorName, assignedDoctor: doctorName, status: 'Doctor Assigned' } : c));
  };

  const handleDispatchAmbulance = (id, ambulanceNumber) => {
    setEmergencyCases(emergencyCases.map(c => c.id === id ? { ...c, ambulance: ambulanceNumber, ambulanceDispatched: ambulanceNumber, status: 'Ambulance Dispatched' } : c));
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
      
      {/* SIDEBAR (DESKTOP & RESPONSIVE DRAWER) */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-[#071A1D] text-slate-300 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out border-r border-teal-900/50 flex flex-col justify-between shadow-2xl`}>
        <div className="space-y-6 p-5">
          
          {/* Hospital Logo Header */}
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

          {/* Navigation Items */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'emergency', label: 'Emergency Queue', icon: Siren, badge: pendingCount },
              { id: 'patients', label: 'Patient Directory', icon: Users },
              { id: 'doctors', label: 'Doctor Panel', icon: Stethoscope },
              { id: 'ambulances', label: '108 Fleet Control', icon: Truck },
              { id: 'beds', label: 'Bed & ICU Matrix', icon: Bed },
              { id: 'bloodbank', label: 'Blood Bank Stock', icon: Droplet },
              { id: 'reports', label: 'Clinical Analytics', icon: BarChart3 },
              { id: 'notifications', label: 'Alerts Feed', icon: Bell, badge: notifications.length },
              { id: 'settings', label: 'System Settings', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveConsole(item.id); setMobileMenuOpen(false); }}
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

        {/* Sidebar Footer User Info */}
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
          <button className="w-full py-2 rounded-xl text-xs font-extrabold text-red-400 bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 flex items-center justify-center gap-2">
            <LogOut className="w-3.5 h-3.5" /> Logout Session
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER CONTENT AREA */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        
        {/* TOPBAR HEADER */}
        <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 shadow-sm">
          
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Live Clock & Location */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-extrabold text-[#0F766E] bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
              <Clock className="w-3.5 h-3.5 text-[#14B8A6] animate-spin" />
              <span>{currentTime} | Sector 32 Chandigarh</span>
            </div>
          </div>

          {/* Search Bar & Role Switcher */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search patient, doctor, ER ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#0F766E] w-36 sm:w-56"
              />
            </div>

            {/* RBAC Role Selector */}
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

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 relative"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-red-600 absolute top-1 right-1 animate-ping" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 space-y-3 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-black text-slate-900">Hospital Real-Time Alerts</h4>
                    <span className="text-[10px] text-teal-600 font-bold">3 New</span>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-teal-50/60 border border-teal-100 text-xs space-y-1">
                        <div className="font-extrabold text-slate-900">{n.title}</div>
                        <div className="text-[11px] text-slate-600">{n.message}</div>
                        <div className="text-[9px] text-slate-400 font-mono">{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY CONTENT */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
          
          {/* DASHBOARD CONSOLE VIEW */}
          {activeConsole === 'dashboard' && (
            <div className="space-y-8">
              
              {/* 10 Core Enterprise Hospital Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
                {[
                  { title: 'TOTAL PATIENTS', val: '127', color: 'border-slate-200 bg-white', tag: 'Active' },
                  { title: 'ER CASES', val: emergencyCases.length, color: 'border-red-200 bg-red-50/50 text-red-900', tag: 'Resuscitation' },
                  { title: 'PENDING', val: pendingCount, color: 'border-amber-200 bg-amber-50/50 text-amber-900', tag: 'Action Required' },
                  { title: 'DOCTORS READY', val: '58', color: 'border-slate-200 bg-white', tag: 'On Duty' },
                  { title: 'ICU BEDS FREE', val: '22 / 50', color: 'border-[#0F766E]/20 bg-teal-50/50 text-[#0F766E]', tag: 'Critical' },
                  { title: 'BLOOD UNITS', val: '320', color: 'border-slate-200 bg-white', tag: 'NABL Stock' },
                  { title: '108 AMBULANCE', val: '11', color: 'border-slate-200 bg-white', tag: 'Ready Fleet' },
                  { title: 'SURGERIES', val: '6 Today', color: 'border-purple-200 bg-purple-50/50 text-purple-900', tag: 'OT Active' },
                  { title: 'AVG RESPONSE', val: '4.2 Mins', color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900', tag: 'Target < 5m' },
                  { title: 'RECOVERY RATE', val: '98.4%', color: 'border-slate-200 bg-white', tag: 'NABH Audit' }
                ].map((m, idx) => (
                  <div key={idx} className={`p-3.5 rounded-2xl border ${m.color} shadow-sm space-y-1`}>
                    <span className="text-[9px] font-bold uppercase tracking-wider block opacity-75">{m.title}</span>
                    <div className="text-xl font-black">{m.val}</div>
                    <span className="text-[9px] font-extrabold block opacity-80">{m.tag}</span>
                  </div>
                ))}
              </div>

              {/* Action Export Buttons */}
              <div className="w-full flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-700">Export Clinical Operations Audit Reports:</div>
                <div className="flex items-center gap-3">
                  <button onClick={handleDownloadPDF} className="px-4 py-2 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2">
                    <Download className="w-4 h-4 text-teal-400" /> Download PDF Report
                  </button>
                  <button onClick={handleDownloadExcel} className="px-4 py-2 rounded-xl text-xs font-black bg-[#0F766E] text-white hover:bg-teal-800 flex items-center gap-2">
                    <Download className="w-4 h-4" /> Export Excel Dataset
                  </button>
                </div>
              </div>

              {downloadNotice && (
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold text-center animate-fade-in">
                  {downloadNotice}
                </div>
              )}

              {/* Recharts Operational Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-base font-black text-slate-900">Weekly Patient Resuscitation & Intake Trends</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                        <YAxis stroke="#64748B" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#071A1D', borderRadius: '12px', color: '#fff' }} />
                        <Bar dataKey="emergency" name="Emergency Resuscitation" fill="#DC2626" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="admissions" name="General Admissions" fill="#0F766E" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Bed Occupancy Pie Chart */}
                <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-base font-black text-slate-900">Bed Occupancy Distribution</h3>
                  <div className="h-64 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'ICU Beds', value: 28, fill: '#DC2626' },
                            { name: 'Emergency Bays', value: 32, fill: '#0F766E' },
                            { name: 'General Wards', value: 110, fill: '#14B8A6' }
                          ]}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={75}
                          label
                        />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
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
                        <th className="p-3.5">Emergency ID</th>
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

          {/* EMERGENCY QUEUE CONSOLE */}
          {activeConsole === 'emergency' && (
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-slate-900">Emergency Queue Console</h2>
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse font-sans min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase">
                      <th className="p-3">ID</th>
                      <th className="p-3">Patient</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {emergencyCases.map((c) => (
                      <tr key={c.id}>
                        <td className="p-3 font-mono font-bold text-[#0F766E]">{c.id}</td>
                        <td className="p-3 font-extrabold">{c.patientName || c.patient}</td>
                        <td className="p-3 font-bold text-red-700">{c.emergencyType}</td>
                        <td className="p-3"><span className="px-2 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded">{c.priority}</span></td>
                        <td className="p-3 font-bold text-teal-800">{c.status}</td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center gap-1.5">
                            <button onClick={() => handleApprove(c.id)} className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-xs">Approve</button>
                            <button onClick={() => handleAssignDoctor(c.id, 'Dr. Rajesh Sharma')} className="px-2.5 py-1 bg-teal-50 text-[#0F766E] font-bold border border-teal-200 rounded-lg text-xs">Assign Doctor</button>
                          </div>
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
              <h2 className="text-xl font-black text-slate-900">Consultant Doctor Panel & Today's Schedule</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((d) => (
                  <div key={d.id} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center text-xl font-bold">
                        👨‍⚕️
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900">{d.name}</h3>
                        <div className="text-xs font-extrabold text-[#0F766E]">{d.department}</div>
                      </div>
                    </div>
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">{d.availability}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 108 AMBULANCE CONSOLE */}
          {activeConsole === 'ambulances' && (
            <div className="w-full space-y-6">
              <h2 className="text-xl font-black text-slate-900">108 Emergency Ambulance Dispatch Fleet</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ambulances.map((a) => (
                  <div key={a.id} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2 text-xs">
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

          {/* OTHER CONSOLES SIMULATION */}
          {activeConsole !== 'dashboard' && activeConsole !== 'emergency' && activeConsole !== 'doctors' && activeConsole !== 'ambulances' && activeConsole !== 'beds' && activeConsole !== 'bloodbank' && (
            <div className="w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase">{activeConsole} Administration Console</h2>
              <p className="text-xs text-slate-500">Live operational database connected to Sanjeevani Hospital Command Center.</p>
            </div>
          )}
        </main>

        {/* FOOTER */}
        <footer className="w-full bg-[#071A1D] text-slate-400 text-xs py-6 text-center border-t border-teal-900/50 mt-12">
          <p>© 2026 Sanjeevani Multispeciality Hospital (Sector 32, Chandigarh). Enterprise Administration Dashboard.</p>
        </footer>
      </div>
    </div>
  );
}
