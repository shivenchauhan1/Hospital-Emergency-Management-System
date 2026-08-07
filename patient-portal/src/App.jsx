import React, { useState } from 'react';
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

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [emergencyRequests, setEmergencyRequests] = useState([
    {
      id: "ER-2026-0001",
      patientName: "Rahul Sharma",
      age: "42",
      gender: "Male",
      phone: "+91 98765 43210",
      emergencyType: "Accident",
      priority: "Critical",
      status: "Approved",
      assignedDoctor: "Dr. Rajesh Sharma",
      ambulanceDispatched: "PB01AB1234",
      address: "Sector 32, Chandigarh",
      description: "Highway vehicle collision trauma near Tribune Chowk",
      createdAt: "10:14 AM"
    },
    ...INITIAL_EMERGENCY_CASES
  ]);

  const [showQR, setShowQR] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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

  const [createdNotice, setCreatedNotice] = useState(null);

  // Recharts Data for Hero Live Preview
  const heroChartData = [
    { time: '08:00', cases: 12, beds: 88 },
    { time: '10:00', cases: 24, beds: 76 },
    { time: '12:00', cases: 34, beds: 68 },
    { time: '14:00', cases: 29, beds: 72 },
    { time: '16:00', cases: 38, beds: 64 }
  ];

  const handleEmergencySubmit = (e) => {
    e.preventDefault();
    const requestId = `ER-2026-00${emergencyRequests.length + 1}`;
    const newCase = {
      id: requestId,
      patientName: emergencyForm.patientName,
      age: emergencyForm.age,
      gender: emergencyForm.gender,
      phone: emergencyForm.phone,
      emergencyType: emergencyForm.emergencyType,
      priority: emergencyForm.priority,
      status: 'Pending Review',
      assignedDoctor: 'Unassigned',
      ambulanceDispatched: 'None',
      address: emergencyForm.address,
      description: emergencyForm.description,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setEmergencyRequests([newCase, ...emergencyRequests]);
    setCreatedNotice({
      id: requestId,
      message: "Your emergency resuscitation request has been registered. Triage staff notified."
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans relative overflow-x-hidden selection:bg-[#0F766E] selection:text-white">
      
      {/* BACKGROUND FLOATING BLOBS & GRID PATTERN */}
      <div className="fixed inset-0 bg-grid-pattern opacity-60 pointer-events-none z-0" />
      <div className="fixed -top-24 -left-24 w-96 h-96 rounded-full bg-[#14B8A6]/15 blur-3xl animate-blob-1 pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-24 w-96 h-96 rounded-full bg-[#0F766E]/15 blur-3xl animate-blob-2 pointer-events-none z-0" />
      <div className="fixed -bottom-24 left-1/3 w-96 h-96 rounded-full bg-[#DC2626]/10 blur-3xl animate-blob-3 pointer-events-none z-0" />

      <div className="relative z-10 flex-1 flex flex-col w-full">
        
        {/* TOP HEADER - EMERGENCY CONTACT STRIP */}
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
              <div className="hidden md:flex items-center gap-1.5 text-slate-300 font-semibold">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Reception: +91 172 456 7890</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <div className="hidden lg:flex items-center gap-1.5 text-slate-300 font-semibold">
                <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>info@sanjeevanihospital.in</span>
              </div>
              <span className="bg-teal-950 px-2.5 py-1 rounded-full text-[10px] font-extrabold text-teal-300 border border-teal-700/50">
                NABH & NABL Accredited 24×7
              </span>
            </div>
          </div>
        </header>

        {/* MAIN NAVIGATION BAR (SAAS STYLE) */}
        <nav className="w-full bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/80 shadow-sm">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
            
            {/* Logo */}
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

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {[
                { id: 'home', label: 'Home' },
                { id: 'emergency', label: 'Emergency' },
                { id: 'departments', label: 'Departments' },
                { id: 'doctors', label: 'Doctors' },
                { id: 'patients', label: 'Patients' },
                { id: 'bloodbank', label: 'Blood Bank' },
                { id: 'ambulance', label: 'Ambulance' },
                { id: 'reports', label: 'Reports' },
                { id: 'contact', label: 'Contact' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                    activeTab === item.id
                      ? 'bg-[#0F766E]/10 text-[#0F766E] font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* CTA Button & QR Trigger */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowQR(!showQR)}
                className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors"
                title="View Digital Health QR"
              >
                <QrCode className="w-4 h-4 text-[#0F766E]" />
              </button>

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

        {/* QR Code Modal Dialog */}
        {showQR && (
          <div className="p-6 rounded-3xl bg-[#071A1D] text-white border border-teal-800 space-y-4 max-w-sm mx-auto text-center my-4 shadow-2xl relative z-50 animate-fade-in">
            <h3 className="text-lg font-black text-teal-300">Digital Patient Health ID</h3>
            <p className="text-xs text-slate-300">Scan at Sanjeevani Kiosk, Sector 32 Chandigarh for immediate triage registration.</p>
            <div className="p-4 bg-white rounded-2xl inline-block shadow-inner">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SANJEEVANI-PATIENT-RAHUL-SHARMA-ID-SAN-2026-8842" 
                alt="Patient QR Code" 
                className="w-36 h-36 mx-auto"
              />
            </div>
            <div className="font-mono text-xs text-teal-300 font-bold">SAN-2026-8842</div>
            <button onClick={() => setShowQR(false)} className="w-full py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300">Close</button>
          </div>
        )}

        {/* MAIN BODY CONTENT */}
        <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
          
          {/* HOME PAGE VIEW */}
          {activeTab === 'home' && (
            <div className="w-full space-y-16">
              
              {/* HOME HERO SECTION (SAAS STYLE) */}
              <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
                
                {/* Left Side Hero Text */}
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

                    <button
                      onClick={() => setActiveTab('appointment')}
                      className="px-6 py-3.5 rounded-2xl text-xs font-black text-white bg-[#0F766E] hover:bg-teal-800 shadow-lg shadow-teal-700/20 transition-all flex items-center gap-2"
                    >
                      <Stethoscope className="w-4 h-4" />
                      <span>Book Appointment</span>
                    </button>
                  </div>
                </div>

                {/* Right Side Live Hospital Dashboard Preview Card (Glassmorphism) */}
                <div className="lg:col-span-6">
                  <div className="glass-card p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-200/80 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Hospital Live Command Dashboard</h3>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-[#0F766E] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                        24x7 Live Feed
                      </span>
                    </div>

                    {/* Live Metric Cards Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-2xl bg-red-50/80 border border-red-200/60 text-red-900 space-y-0.5">
                        <span className="text-[10px] font-bold uppercase block text-red-700">Emergency Cases</span>
                        <div className="text-xl font-black text-red-700">34</div>
                        <span className="text-[9px] font-bold text-red-600">Active Triage</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200/60 text-teal-900 space-y-0.5">
                        <span className="text-[10px] font-bold uppercase block text-teal-700">Doctors Available</span>
                        <div className="text-xl font-black text-[#0F766E]">58</div>
                        <span className="text-[9px] font-bold text-teal-600">On Active Duty</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200/60 text-purple-900 space-y-0.5">
                        <span className="text-[10px] font-bold uppercase block text-purple-700">ICU Beds Free</span>
                        <div className="text-xl font-black text-purple-800">22 / 50</div>
                        <span className="text-[9px] font-bold text-purple-600">Critical Care</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200/60 text-indigo-900 space-y-0.5">
                        <span className="text-[10px] font-bold uppercase block text-indigo-700">108 Ambulances</span>
                        <div className="text-xl font-black text-indigo-800">11</div>
                        <span className="text-[9px] font-bold text-indigo-600">Ready Fleet</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-amber-900 space-y-0.5">
                        <span className="text-[10px] font-bold uppercase block text-amber-700">Critical Patients</span>
                        <div className="text-xl font-black text-amber-800">8</div>
                        <span className="text-[9px] font-bold text-amber-600">ICU Monitoring</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/60 text-emerald-900 space-y-0.5">
                        <span className="text-[10px] font-bold uppercase block text-emerald-700">Blood Units</span>
                        <div className="text-xl font-black text-emerald-800">320</div>
                        <span className="text-[9px] font-bold text-emerald-600">NABL Stock</span>
                      </div>
                    </div>

                    {/* Recharts Area Chart Preview */}
                    <div className="h-32 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={heroChartData}>
                          <defs>
                            <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#DC2626" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                          <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} />
                          <YAxis stroke="#94A3B8" fontSize={10} />
                          <Tooltip />
                          <Area type="monotone" dataKey="cases" stroke="#DC2626" strokeWidth={2} fillOpacity={1} fill="url(#colorCases)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* ANIMATED STATISTICS SECTION */}
              <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { value: '500+', label: 'Beds Capacity', desc: 'ICU & Wards' },
                  { value: '150+', label: 'Doctors', desc: 'Medical Specialists' },
                  { value: '24×7', label: 'Emergency Care', desc: 'Level 1 Trauma' },
                  { value: '250,000+', label: 'Patients Treated', desc: 'Serving Chandigarh' },
                  { value: '98%', label: 'Patient Satisfaction', desc: 'NABH Accredited' }
                ].map((stat, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
                    <div className="text-3xl sm:text-4xl font-black text-[#0F766E]">{stat.value}</div>
                    <div className="text-xs font-black text-slate-900">{stat.label}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{stat.desc}</div>
                  </div>
                ))}
              </div>

              {/* HEALTHCARE FEATURES CARDS SECTION */}
              <div className="w-full space-y-8 pt-4">
                <div className="text-center space-y-2 max-w-2xl mx-auto">
                  <span className="text-xs font-black uppercase text-[#0F766E] tracking-wider">Comprehensive Emergency Infrastructure</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Healthcare SaaS Services & Capabilities</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: 'Emergency Registration', icon: Siren, desc: 'Instant online triage submission generating ER-2026-0001 case token for immediate resuscitation.' },
                    { title: 'Real-Time Doctor Assignment', icon: Stethoscope, desc: 'Automated matching with available specialist consultants based on severity priority.' },
                    { title: 'Ambulance Tracking (108)', icon: Truck, desc: 'GPS live fleet tracking for emergency response vehicles with automated ETA calculations.' },
                    { title: 'Blood Availability', icon: Droplet, desc: 'Real-time stock monitoring of NABL accredited blood reserve units across all groups.' },
                    { title: 'Bed Management', icon: Bed, desc: 'Live bed occupancy tracking across ICU, Emergency Bays, and General Wards.' },
                    { title: 'Patient Monitoring', icon: Activity, desc: 'Continuous vital signs monitoring and emergency alert broadcasting.' },
                    { title: 'Emergency Notifications', icon: Bell, desc: 'Real-time notifications sent to emergency doctors and resuscitation staff.' },
                    { title: 'Medical Reports', icon: FileText, desc: 'Digital upload and download of PDF clinical audits, Chest X-Rays, and MRI scans.' }
                  ].map((feat, idx) => {
                    const Icon = feat.icon;
                    return (
                      <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:border-teal-300 hover:shadow-md transition-all space-y-3">
                        <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center font-bold">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-black text-slate-900">{feat.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* EMERGENCY REGISTRATION FORM SECTION */}
              <div className="w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-800 mb-2">
                    <Siren className="w-4 h-4 text-red-600 animate-pulse" />
                    <span>24x7 Immediate Triage Registration</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">EMERGENCY CASE REGISTRATION FORM</h2>
                </div>

                {createdNotice && (
                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold space-y-1">
                    <div>{createdNotice.message}</div>
                    <div className="font-mono text-red-600 font-black">Registered Request ID: {createdNotice.id}</div>
                  </div>
                )}

                <form onSubmit={handleEmergencySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Patient Name *</label>
                      <input
                        type="text"
                        required
                        value={emergencyForm.patientName}
                        onChange={(e) => setEmergencyForm({ ...emergencyForm, patientName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0F766E]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Age *</label>
                      <input
                        type="number"
                        required
                        value={emergencyForm.age}
                        onChange={(e) => setEmergencyForm({ ...emergencyForm, age: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0F766E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Gender *</label>
                      <select
                        value={emergencyForm.gender}
                        onChange={(e) => setEmergencyForm({ ...emergencyForm, gender: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0F766E]"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Phone *</label>
                      <input
                        type="text"
                        required
                        value={emergencyForm.phone}
                        onChange={(e) => setEmergencyForm({ ...emergencyForm, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0F766E]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Emergency Type *</label>
                      <select
                        value={emergencyForm.emergencyType}
                        onChange={(e) => setEmergencyForm({ ...emergencyForm, emergencyType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0F766E]"
                      >
                        <option>Accident</option>
                        <option>Heart Attack</option>
                        <option>Stroke</option>
                        <option>Burn</option>
                        <option>Fracture</option>
                        <option>Poisoning</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Priority *</label>
                      <select
                        value={emergencyForm.priority}
                        onChange={(e) => setEmergencyForm({ ...emergencyForm, priority: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-[#0F766E]"
                      >
                        <option>Critical</option>
                        <option>High</option>
                        <option>Medium</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Address *</label>
                      <input
                        type="text"
                        required
                        value={emergencyForm.address}
                        onChange={(e) => setEmergencyForm({ ...emergencyForm, address: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0F766E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                    <textarea
                      rows="3"
                      value={emergencyForm.description}
                      onChange={(e) => setEmergencyForm({ ...emergencyForm, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0F766E]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl font-black text-sm text-white bg-[#DC2626] hover:bg-red-700 shadow-xl shadow-red-600/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Siren className="w-5 h-5 animate-bounce" />
                    <span>Submit Emergency Case Registration</span>
                  </button>
                </form>
              </div>

              {/* DOCTORS SECTION */}
              <div className="w-full space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <span className="text-xs font-black uppercase text-[#0F766E]">Medical Faculty</span>
                    <h2 className="text-2xl font-black text-slate-900">Consultant Doctors & Specialists</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { name: 'Dr Rajesh Sharma', dept: 'Cardiology', spec: 'Interventional Cardiology & Cardiac Arrest' },
                    { name: 'Dr Priya Mehta', dept: 'Neurology', spec: 'Neurosurgery & Acute Brain Stroke' },
                    { name: 'Dr Vivek Singh', dept: 'Emergency Medicine', spec: 'Level 1 Trauma & Resuscitation' },
                    { name: 'Dr Kavita Kapoor', dept: 'Orthopedics', spec: 'Pediatric Emergency & Joint Trauma' }
                  ].map((doc, idx) => (
                    <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center font-bold text-lg">
                        👨‍⚕️
                      </div>
                      <h3 className="text-base font-black text-slate-900">{doc.name}</h3>
                      <div className="text-xs font-extrabold text-[#0F766E]">{doc.dept}</div>
                      <p className="text-[11px] text-slate-500 font-medium">{doc.spec}</p>
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Available</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 108 AMBULANCE DISPATCH SECTION */}
              <div className="w-full space-y-6">
                <div>
                  <span className="text-xs font-black uppercase text-[#0F766E]">Emergency Fleet</span>
                  <h2 className="text-2xl font-black text-slate-900">108 Emergency Ambulance Dispatch</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { number: 'PB01AB1234', status: 'Available', eta: '5 Mins', driver: 'Gurpreet Singh', location: 'Sector 17 Plaza, Chandigarh' },
                    { number: 'CH02CD5678', status: 'On Route', eta: '8 Mins', driver: 'Manjit Sharma', location: 'Tribune Chowk, Chandigarh' },
                    { number: 'HR26XY1122', status: 'Available', eta: 'Immediate', driver: 'Rajesh Saini', location: 'Sector 32 Hospital Bay 1' }
                  ].map((amb, idx) => (
                    <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-black text-slate-900 text-base">{amb.number}</span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">{amb.status}</span>
                      </div>
                      <div className="text-xs text-slate-700 font-semibold">ETA: <strong className="text-red-600 font-mono">{amb.eta}</strong></div>
                      <div className="text-xs text-slate-600">Driver: {amb.driver}</div>
                      <div className="text-xs text-slate-500 font-mono">Location: {amb.location}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* EMERGENCY TAB */}
          {activeTab === 'emergency-register' && (
            <div className="w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-6">
              <h2 className="text-2xl font-black text-slate-900">EMERGENCY CASE REGISTRATION FORM</h2>
              <form onSubmit={handleEmergencySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" required placeholder="Patient Name" value={emergencyForm.patientName} onChange={(e) => setEmergencyForm({ ...emergencyForm, patientName: e.target.value })} className="w-full bg-slate-50 border p-3 rounded-xl text-xs" />
                  <input type="text" required placeholder="Phone" value={emergencyForm.phone} onChange={(e) => setEmergencyForm({ ...emergencyForm, phone: e.target.value })} className="w-full bg-slate-50 border p-3 rounded-xl text-xs" />
                </div>
                <button type="submit" className="w-full py-4 text-xs font-black text-white bg-[#DC2626] rounded-2xl shadow-lg">Submit Emergency Case Registration</button>
              </form>
            </div>
          )}

          {/* OTHER TABS SIMULATION */}
          {activeTab !== 'home' && activeTab !== 'emergency-register' && (
            <div className="w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase">{activeTab} Module</h2>
              <p className="text-xs text-slate-500">Live operational data synced with Sanjeevani Hospital Command Center.</p>
            </div>
          )}
        </main>

        {/* FOOTER SECTION */}
        <footer className="w-full bg-[#071A1D] text-slate-300 text-xs pt-12 pb-8 border-t border-teal-900/50 mt-16">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏥</span>
                  <h3 className="text-base font-black text-white">Sanjeevani Hospital</h3>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Sanjeevani Multispeciality Hospital, Sector 32 Chandigarh. 24x7 Emergency Resuscitation, Cardiac Care, and Level 1 Trauma Care.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-teal-400">Emergency Contacts</h4>
                <div className="text-red-400 font-mono font-bold">Helpline: +91 112</div>
                <div className="text-teal-300 font-mono font-bold">Ambulance: 108</div>
                <div className="text-slate-300">Reception: +91 172 456 7890</div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-teal-400">Location Map</h4>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300">
                  Sector 32, Chandigarh – 160030, Punjab, India
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-teal-400">Accreditation</h4>
                <div className="p-3 bg-teal-950/80 rounded-xl border border-teal-800 text-[11px] text-teal-200 font-bold">
                  NABH & NABL Accredited Multispeciality Institution
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-teal-950 text-center text-slate-500 text-[11px]">
              © 2026 Sanjeevani Multispeciality Hospital. All Rights Reserved. Designed for Healthcare Excellence in India.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
