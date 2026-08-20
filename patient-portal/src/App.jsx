import React, { useState, useEffect } from 'react';
import {
  HeartPulse, Siren, Stethoscope, Droplet, Clock, FileText, Search,
  MapPin, Phone, ArrowRight, Activity, Users, Bed, Truck,
  AlertCircle, CheckCircle2, Award, Calendar, Plus, X,
  AlertTriangle, Loader2, RefreshCw
} from 'lucide-react';
import { HOSPITAL_INFO, INITIAL_DOCTORS, INITIAL_EMERGENCY_CASES } from './data/hospitalStore';
import {
  warmupBackendAPI, fetchDoctors, fetchAmbulances, fetchBeds, fetchBloodStock,
  fetchEmergencies, postEmergency, registerNormalPatientAPI,
  bookAppointmentAPI, fetchAppointmentsAPI, fetchPatientReportsAPI,
  fetchCompatibleBloodAPI
} from './services/api';
import socket from './services/socket';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [emergencyRequests, setEmergencyRequests] = useState(INITIAL_EMERGENCY_CASES);
  const [myAppointments, setMyAppointments] = useState([]);

  // Cold Start & Connection Status
  const [isWarmingUp, setIsWarmingUp] = useState(true);
  const [socketConnected, setSocketConnected] = useState(socket.connected);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [actionErrorNotice, setActionErrorNotice] = useState(null);
  const [successNotice, setSuccessNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reports & Blood DSA State
  const [patientIdInput, setPatientIdInput] = useState('SAN-2026-1001');
  const [patientReports, setPatientReports] = useState([]);
  const [reportFetchNotice, setReportFetchNotice] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('O+');
  const [compatibleGroups, setCompatibleGroups] = useState([]);
  const [compatibleInventory, setCompatibleInventory] = useState([]);
  const [bloodLoading, setBloodLoading] = useState(false);

  // Emergency Form State
  const [emergencyForm, setEmergencyForm] = useState({
    patientName: '',
    age: '',
    gender: 'Male',
    phone: '',
    emergencyType: 'Accident',
    address: '',
    description: '',
    priority: 'Critical'
  });

  // Normal Registration & Appointment Form State
  const [normalForm, setNormalForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    bloodGroup: 'O+',
    department: '',
    doctorPreference: '',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '10:00 AM - 10:30 AM',
    symptoms: '',
    medicalHistory: 'None'
  });

  // Selected doctor for OPD
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const initializePortal = async () => {
      await warmupBackendAPI();
      setIsWarmingUp(false);

      const [docsData, erData, apptData] = await Promise.all([
        fetchDoctors(),
        fetchEmergencies(),
        fetchAppointmentsAPI()
      ]);

      if (docsData && docsData.length > 0) {
        setDoctors(docsData);
        if (docsData.isFallbackData) setIsFallbackMode(true);
      }
      if (erData) {
        setEmergencyRequests(erData);
        if (erData.isFallbackData) setIsFallbackMode(true);
      }
      if (apptData && apptData.length > 0) {
        setMyAppointments(apptData);
      }
    };

    initializePortal();

    const handleConnect = () => setSocketConnected(true);
    const handleDisconnect = () => setSocketConnected(false);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('new_emergency_request', (newCase) => {
      setEmergencyRequests(prev => [newCase, ...prev]);
      setIsFallbackMode(false);
    });
    socket.on('case_updated', (updatedCase) => {
      setEmergencyRequests(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
    });
    socket.on('appointment_approved', (updatedAppt) => {
      setMyAppointments(prev => prev.map(a => a.id === updatedAppt.id ? updatedAppt : a));
    });

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('new_emergency_request');
      socket.off('case_updated');
      socket.off('appointment_approved');
    };
  }, []);

  const showSuccess = (msg, id) => {
    setSuccessNotice({ message: msg, id });
    setTimeout(() => setSuccessNotice(null), 6000);
  };

  const handleFetchReports = async () => {
    setReportError(null);
    setReportFetchNotice(null);
    setPatientReports([]);
    setReportLoading(true);
    const res = await fetchPatientReportsAPI(patientIdInput);
    setReportLoading(false);
    if (!res || res.success === false) {
      setReportError(res?.message || 'Unable to connect to hospital server.');
      return;
    }
    setPatientReports(res.data || []);
    setReportFetchNotice({ source: res.source, count: (res.data || []).length });
  };

  const handleCompatibleBlood = async (group) => {
    setSelectedBloodGroup(group);
    setCompatibleGroups([]);
    setCompatibleInventory([]);
    setBloodLoading(true);
    const res = await fetchCompatibleBloodAPI(group);
    setBloodLoading(false);
    if (!res || res.success === false) {
      setActionErrorNotice(res?.message || 'Unable to connect to hospital server.');
      return;
    }
    setCompatibleGroups(res.compatibleGroups || []);
    setCompatibleInventory(res.data || []);
  };

  const handleEmergencySubmit = async (e) => {
    e.preventDefault();
    setActionErrorNotice(null);
    if (!emergencyForm.patientName || !emergencyForm.phone || !emergencyForm.address) {
      setActionErrorNotice('Please fill in all required fields: Patient Name, Phone, and Address.');
      return;
    }
    setIsSubmitting(true);
    const result = await postEmergency(emergencyForm);
    setIsSubmitting(false);

    if (!result || result.success === false) {
      setActionErrorNotice((result && result.message) || 'Emergency registration failed. Please check your connection.');
      return;
    }

    const newCase = result.data;
    setEmergencyRequests(prev => [newCase, ...prev]);
    showSuccess(`Emergency case ${newCase.id} submitted successfully! Staff have been notified.`, newCase.id);
    setEmergencyForm({ patientName: '', age: '', gender: 'Male', phone: '', emergencyType: 'Accident', address: '', description: '', priority: 'Critical' });
    setTimeout(() => setActiveTab('home'), 2000);
  };

  const handleNormalSubmit = async (e) => {
    e.preventDefault();
    setActionErrorNotice(null);
    if (!normalForm.name || !normalForm.phone || !normalForm.doctorPreference) {
      setActionErrorNotice('Please fill in Patient Name, Phone, and select a Doctor.');
      return;
    }
    setIsSubmitting(true);
    const patRes = await registerNormalPatientAPI(normalForm);
    if (!patRes || patRes.success === false) {
      setIsSubmitting(false);
      setActionErrorNotice((patRes && patRes.message) || 'Patient registration failed. Please check your connection.');
      return;
    }

    const apptRes = await bookAppointmentAPI({
      patientName: normalForm.name,
      doctorName: normalForm.doctorPreference,
      department: normalForm.department,
      date: normalForm.appointmentDate,
      timeSlot: normalForm.timeSlot
    });
    setIsSubmitting(false);

    if (!apptRes || apptRes.success === false) {
      setActionErrorNotice((apptRes && apptRes.message) || 'Appointment booking failed. Please check your connection.');
      return;
    }

    const patientId = patRes.patientId || (patRes.data && patRes.data.id) || 'N/A';
    const newAppt = apptRes.data;
    setMyAppointments(prev => [newAppt, ...prev]);
    showSuccess(`Registration successful! Patient ID: ${patientId} | Appointment ID: ${newAppt.id}`, patientId);
    setNormalForm({ name: '', age: '', gender: 'Male', phone: '', email: '', address: '', bloodGroup: 'O+', department: '', doctorPreference: '', appointmentDate: new Date().toISOString().split('T')[0], timeSlot: '10:00 AM - 10:30 AM', symptoms: '', medicalHistory: 'None' });
    setSelectedDoctor(null);
    setTimeout(() => setActiveTab('appointments'), 2000);
  };

  const handleDoctorSelect = (doc) => {
    setSelectedDoctor(doc);
    setNormalForm(prev => ({ ...prev, doctorPreference: doc.name, department: doc.department }));
  };

  const statusBadgeAppt = (status) => {
    const map = {
      'Appointment Requested': 'bg-blue-100 text-blue-800',
      'Approved': 'bg-green-100 text-green-800',
      'Doctor Assigned': 'bg-teal-100 text-teal-800',
      'Completed': 'bg-gray-100 text-gray-700',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return map[status] || 'bg-slate-100 text-slate-700';
  };

  const priorityBadge = (priority) => {
    const map = { 'Critical': 'bg-red-600 text-white', 'High': 'bg-amber-500 text-white', 'Medium': 'bg-blue-600 text-white' };
    return map[priority] || 'bg-slate-200 text-slate-800';
  };

  // === WARMUP SCREEN ===
  if (isWarmingUp) {
    return (
      <div className="w-full min-h-screen bg-[#071A1D] text-white flex flex-col items-center justify-center p-6 space-y-4 font-sans">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#0F766E] to-[#14B8A6] flex items-center justify-center text-3xl shadow-2xl animate-bounce">🏥</div>
        <div className="flex items-center gap-2 text-teal-300 font-mono text-sm font-bold">
          <Loader2 className="w-5 h-5 animate-spin text-[#14B8A6]" />
          <span>Connecting to Sanjeevani Hospital Servers...</span>
        </div>
        <p className="text-xs text-slate-400 max-w-sm text-center font-medium leading-relaxed">
          Waking up Render free-tier instance. Normal operations will resume in a few seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans relative overflow-x-hidden">

      {/* TOP HEADER BAR */}
      <header className="w-full bg-[#071A1D] text-slate-300 text-xs py-2.5 px-4 border-b border-teal-900/50">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 font-bold text-red-400">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>Emergency: <strong className="font-mono text-white">+91 112</strong></span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-teal-300 font-bold">
              <Truck className="w-3.5 h-3.5 shrink-0" />
              <span>Ambulance: <strong className="font-mono text-white">108</strong></span>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black border ${
            socketConnected && !isFallbackMode
              ? 'bg-emerald-950 text-emerald-300 border-emerald-700/50'
              : isFallbackMode
              ? 'bg-amber-950 text-amber-300 border-amber-700/50'
              : 'bg-red-950 text-red-300 border-red-700/50'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${socketConnected && !isFallbackMode ? 'bg-emerald-400 animate-pulse' : isFallbackMode ? 'bg-amber-400' : 'bg-red-400'}`} />
            <span>{socketConnected && !isFallbackMode ? 'Live Backend Connected' : isFallbackMode ? 'Demo / Fallback Mode' : 'Backend Disconnected'}</span>
          </div>
        </div>
      </header>

      {/* MAIN NAVIGATION */}
      <nav className="w-full bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/80 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0F766E] to-[#14B8A6] flex items-center justify-center text-white text-xl shadow-lg">🏥</div>
            <div>
              <h1 className="text-sm font-black text-slate-900 leading-none">Sanjeevani Multispeciality Hospital</h1>
              <p className="text-[10px] text-[#0F766E] font-bold mt-0.5">Patient Health Portal</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {[
              { id: 'home', label: 'Home' },
              { id: 'emergency-register', label: '🚑 Emergency' },
              { id: 'normal-register', label: '🩺 OPD Consult' },
              { id: 'appointments', label: 'My Appointments' },
              { id: 'reports', label: 'Reports (LRU)' },
              { id: 'bloodbank', label: 'Blood Bank' }
            ].map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${activeTab === item.id ? 'bg-[#0F766E]/10 text-[#0F766E]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}>
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveTab('emergency-register')} className="px-3 py-2 rounded-xl text-xs font-black text-white bg-red-600 hover:bg-red-700 shadow-sm transition-all">🚑 Emergency</button>
            <button onClick={() => setActiveTab('normal-register')} className="px-3 py-2 rounded-xl text-xs font-black text-white bg-[#0F766E] hover:bg-teal-800 shadow-sm transition-all">🩺 Book OPD</button>
          </div>
        </div>
      </nav>

      {/* MAIN BODY */}
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Error Banner */}
        {actionErrorNotice && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-red-900 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{actionErrorNotice}</span>
            </div>
            <button onClick={() => setActionErrorNotice(null)} className="p-1 text-red-600 hover:bg-red-100 rounded-lg"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Success Banner */}
        {successNotice && (
          <div className="p-4 rounded-2xl bg-green-50 border border-green-300 text-green-900 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>{successNotice.message}</span>
            </div>
            <button onClick={() => setSuccessNotice(null)} className="p-1 text-green-600 hover:bg-green-100 rounded-lg"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Fallback Warning */}
        {isFallbackMode && (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Showing demo data — live backend unavailable. Write operations require an active backend.</span>
          </div>
        )}

        {/* ===================== HOME TAB ===================== */}
        {activeTab === 'home' && (
          <div className="space-y-10">
            <div className="text-center space-y-2 pt-4">
              <span className="text-xs font-black uppercase text-[#0F766E] tracking-wider">Patient Portal</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">How can we help you today?</h2>
              <p className="text-sm text-slate-500 font-medium">Choose the service that best describes your situation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div onClick={() => setActiveTab('emergency-register')} className="p-8 rounded-3xl bg-gradient-to-br from-red-50 to-white border-2 border-red-200 shadow-xl hover:border-red-500 hover:shadow-2xl transition-all cursor-pointer space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center text-2xl shadow-lg">🚑</div>
                <div>
                  <span className="text-xs font-black text-red-600 uppercase tracking-wider">Immediate Triage</span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">Emergency Case Registration</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">Critical accident, cardiac arrest, stroke, severe trauma, or 108 ambulance needed. Cases are ranked by Priority Queue (Critical → High → Medium).</p>
                <div className="flex items-center gap-2 text-red-600 text-xs font-black">
                  <span>Register Emergency</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div onClick={() => setActiveTab('normal-register')} className="p-8 rounded-3xl bg-gradient-to-br from-teal-50 to-white border-2 border-teal-200 shadow-xl hover:border-[#0F766E] hover:shadow-2xl transition-all cursor-pointer space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center text-2xl shadow-lg">🩺</div>
                <div>
                  <span className="text-xs font-black text-[#0F766E] uppercase tracking-wider">OPD Consultation</span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">Normal Consultation & Appointment</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">General consultation, fever, routine checkups, or specialist OPD appointment booking with any of our {doctors.length} consultants.</p>
                <div className="flex items-center gap-2 text-[#0F766E] text-xs font-black">
                  <span>Book Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { label: 'Doctors Available', value: doctors.length, icon: '👨‍⚕️', color: 'bg-teal-50 border-teal-200 text-teal-800' },
                { label: 'Active Emergencies', value: emergencyRequests.filter(e => e.status === 'Pending').length, icon: '🚨', color: 'bg-red-50 border-red-200 text-red-800' },
                { label: 'My Appointments', value: myAppointments.length, icon: '📋', color: 'bg-blue-50 border-blue-200 text-blue-800' },
                { label: 'Hospital', value: '24×7', icon: '🏥', color: 'bg-purple-50 border-purple-200 text-purple-800' }
              ].map((stat, i) => (
                <div key={i} className={`p-4 rounded-2xl border ${stat.color} space-y-1`}>
                  <div className="text-xl">{stat.icon}</div>
                  <div className="text-2xl font-black">{stat.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== EMERGENCY REGISTRATION TAB ===================== */}
        {activeTab === 'emergency-register' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-red-600 to-red-700 text-white">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-red-800/50 px-2 py-0.5 rounded">DSA: Priority Queue (Binary Min-Heap)</span>
                <h2 className="text-2xl font-black mt-2 flex items-center gap-2">🚑 Emergency Case Registration</h2>
                <p className="text-xs text-red-100 mt-1 font-medium">Your case will be ranked by severity in the Staff Priority Queue. Critical cases are always at the top.</p>
              </div>

              <form onSubmit={handleEmergencySubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Patient Name <span className="text-red-500">*</span></label>
                    <input type="text" value={emergencyForm.patientName} onChange={e => setEmergencyForm(p => ({...p, patientName: e.target.value}))}
                      placeholder="Full name of patient" required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                    <input type="tel" value={emergencyForm.phone} onChange={e => setEmergencyForm(p => ({...p, phone: e.target.value}))}
                      placeholder="+91 XXXXX XXXXX" required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Age</label>
                    <input type="number" value={emergencyForm.age} onChange={e => setEmergencyForm(p => ({...p, age: e.target.value}))}
                      placeholder="Age in years" min="0" max="120"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Gender</label>
                    <select value={emergencyForm.gender} onChange={e => setEmergencyForm(p => ({...p, gender: e.target.value}))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition-all">
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Emergency Type <span className="text-red-500">*</span></label>
                    <select value={emergencyForm.emergencyType} onChange={e => setEmergencyForm(p => ({...p, emergencyType: e.target.value}))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition-all">
                      {['Accident', 'Heart Attack', 'Stroke', 'Burn', 'Trauma', 'Poisoning', 'Cardiac Arrest', 'Respiratory Distress', 'Fracture', 'Other'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Triage Priority <span className="text-red-500">*</span></label>
                    <select value={emergencyForm.priority} onChange={e => setEmergencyForm(p => ({...p, priority: e.target.value}))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition-all">
                      <option>Critical</option><option>High</option><option>Medium</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Patient Address / Pickup Location <span className="text-red-500">*</span></label>
                  <input type="text" value={emergencyForm.address} onChange={e => setEmergencyForm(p => ({...p, address: e.target.value}))}
                    placeholder="Exact address or landmark for ambulance dispatch" required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Emergency Description</label>
                  <textarea value={emergencyForm.description} onChange={e => setEmergencyForm(p => ({...p, description: e.target.value}))}
                    placeholder="Brief description of the emergency, injuries, symptoms..." rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition-all resize-none" />
                </div>

                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-900 font-medium">
                  <strong className="font-black">⚠️ Important:</strong> After submission, your emergency will be placed in the Staff Priority Queue (PriorityQueue Binary Min-Heap). Critical cases are automatically ranked at the top regardless of submission time.
                </div>

                <button type="submit" disabled={isSubmitting}
                  className="w-full px-6 py-4 rounded-2xl bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-700/20 transition-all">
                  {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" /> Submitting Emergency...</>) : (<>🚑 Submit Emergency Registration</>)}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ===================== NORMAL OPD REGISTRATION TAB ===================== */}
        {activeTab === 'normal-register' && (
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Doctor Selection Grid */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded">Step 1: Select Your Doctor</span>
                <h2 className="text-xl font-black text-slate-900 mt-1">Our Medical Consultants</h2>
                <p className="text-xs text-slate-500 mt-0.5">Click a doctor to select them for your appointment</p>
              </div>

              {doctors.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500 font-medium">Loading doctors from server...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {doctors.map(doc => (
                    <div key={doc.id || doc._id}
                      onClick={() => handleDoctorSelect(doc)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedDoctor && (selectedDoctor.id === doc.id || selectedDoctor._id === doc._id) ? 'border-[#0F766E] bg-teal-50 shadow-md' : 'border-slate-200 bg-slate-50 hover:border-teal-300 hover:bg-teal-50/50'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-black text-slate-900">{doc.name}</p>
                          <p className="text-[10px] font-bold text-[#0F766E] mt-0.5">{doc.department}</p>
                          <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{doc.specialization}</p>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-black rounded-full shrink-0 ${doc.availability === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {doc.availability || 'Available'}
                        </span>
                      </div>
                      <div className="mt-2 text-[10px] text-slate-400 font-medium">Experience: {doc.experience || 'N/A'}</div>
                      {selectedDoctor && (selectedDoctor.id === doc.id || selectedDoctor._id === doc._id) && (
                        <div className="mt-2 text-[10px] font-black text-[#0F766E] flex items-center gap-1">✅ Selected for appointment</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* OPD Registration Form */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div>
                <span className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded">Step 2: Patient Details & Appointment</span>
                <h2 className="text-xl font-black text-slate-900 mt-1">OPD Registration Form</h2>
              </div>

              {!selectedDoctor && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">⚠️ Please select a doctor above before filling the form.</div>
              )}

              <form onSubmit={handleNormalSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Patient Full Name <span className="text-red-500">*</span></label>
                    <input type="text" value={normalForm.name} onChange={e => setNormalForm(p => ({...p, name: e.target.value}))}
                      placeholder="Full name" required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0F766E] focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                    <input type="tel" value={normalForm.phone} onChange={e => setNormalForm(p => ({...p, phone: e.target.value}))}
                      placeholder="+91 XXXXX XXXXX" required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0F766E] focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Age</label>
                    <input type="number" value={normalForm.age} onChange={e => setNormalForm(p => ({...p, age: e.target.value}))}
                      placeholder="Age" min="0" max="120"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0F766E] focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Gender</label>
                    <select value={normalForm.gender} onChange={e => setNormalForm(p => ({...p, gender: e.target.value}))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0F766E] focus:bg-white transition-all">
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Blood Group</label>
                    <select value={normalForm.bloodGroup} onChange={e => setNormalForm(p => ({...p, bloodGroup: e.target.value}))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0F766E] focus:bg-white transition-all">
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
                    <input type="email" value={normalForm.email} onChange={e => setNormalForm(p => ({...p, email: e.target.value}))}
                      placeholder="email@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0F766E] focus:bg-white transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Address</label>
                  <input type="text" value={normalForm.address} onChange={e => setNormalForm(p => ({...p, address: e.target.value}))}
                    placeholder="Your residential address"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0F766E] focus:bg-white transition-all" />
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-4">
                  <h3 className="text-sm font-black text-slate-900">Appointment Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Selected Doctor</label>
                      <input type="text" value={normalForm.doctorPreference} readOnly
                        placeholder="Select doctor above"
                        className="w-full bg-teal-50 border border-teal-200 rounded-xl p-3 text-xs font-bold text-teal-800 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Department</label>
                      <input type="text" value={normalForm.department} readOnly
                        placeholder="Auto-filled from doctor"
                        className="w-full bg-teal-50 border border-teal-200 rounded-xl p-3 text-xs font-bold text-teal-800 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Appointment Date <span className="text-red-500">*</span></label>
                      <input type="date" value={normalForm.appointmentDate} min={new Date().toISOString().split('T')[0]}
                        onChange={e => setNormalForm(p => ({...p, appointmentDate: e.target.value}))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0F766E] focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Time Slot</label>
                      <select value={normalForm.timeSlot} onChange={e => setNormalForm(p => ({...p, timeSlot: e.target.value}))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0F766E] focus:bg-white transition-all">
                        {['09:00 AM - 09:30 AM','10:00 AM - 10:30 AM','11:00 AM - 11:30 AM','12:00 PM - 12:30 PM','02:00 PM - 02:30 PM','03:00 PM - 03:30 PM','04:00 PM - 04:30 PM'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Symptoms / Reason for Visit</label>
                      <textarea value={normalForm.symptoms} onChange={e => setNormalForm(p => ({...p, symptoms: e.target.value}))}
                        placeholder="Briefly describe your symptoms or reason for visit..." rows={2}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0F766E] focus:bg-white transition-all resize-none" />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting || !selectedDoctor}
                  className="w-full px-6 py-4 rounded-2xl bg-[#0F766E] hover:bg-teal-800 disabled:bg-slate-300 disabled:text-slate-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all">
                  {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" /> Registering Patient...</>) : (<>🩺 Register Patient & Book Appointment</>)}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ===================== MY APPOINTMENTS TAB ===================== */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">My Appointments</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Your OPD appointments — book via Consultation tab</p>
              </div>
              <button onClick={() => setActiveTab('normal-register')} className="px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs font-black hover:bg-teal-800 transition-all">
                + Book New Appointment
              </button>
            </div>

            {myAppointments.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center space-y-3">
                <div className="text-4xl">📋</div>
                <h3 className="text-lg font-black text-slate-900">No Appointments Yet</h3>
                <p className="text-xs text-slate-500 font-medium">Book your first OPD appointment by selecting a doctor.</p>
                <button onClick={() => setActiveTab('normal-register')} className="mt-2 px-5 py-2.5 rounded-xl bg-[#0F766E] text-white text-xs font-black hover:bg-teal-800 transition-all">
                  Book Appointment
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-sans min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase">
                        <th className="p-4">Appointment ID</th>
                        <th className="p-4">Patient</th>
                        <th className="p-4">Doctor</th>
                        <th className="p-4">Department</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Time Slot</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myAppointments.map((appt, i) => (
                        <tr key={appt.id || appt._id || i} className="hover:bg-slate-50/50">
                          <td className="p-4 font-mono font-bold text-[#0F766E] text-[11px]">{appt.id || appt._id}</td>
                          <td className="p-4 font-extrabold text-slate-900">{appt.patientName}</td>
                          <td className="p-4 font-bold text-slate-700">{appt.doctorName}</td>
                          <td className="p-4 text-slate-600">{appt.department}</td>
                          <td className="p-4 font-medium text-slate-600">{appt.date}</td>
                          <td className="p-4 font-medium text-slate-600">{appt.timeSlot}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${statusBadgeAppt(appt.status)}`}>{appt.status || 'Appointment Requested'}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== DIAGNOSTIC REPORTS TAB (LRU CACHE) ===================== */}
        {activeTab === 'reports' && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded">DSA Engine: LRU Cache (Doubly Linked List + HashMap, Capacity 20)</span>
              <h2 className="text-xl font-black text-slate-900 mt-1">Patient Diagnostic Reports & Scans</h2>
              <p className="text-xs text-slate-500 mt-0.5">Demonstrates O(1) cache lookups. Recently viewed reports served from memory.</p>
            </div>

            <div className="flex gap-2">
              <input type="text" placeholder="Enter Patient ID (e.g. SAN-2026-1001)"
                value={patientIdInput} onChange={e => setPatientIdInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleFetchReports()}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0F766E]" />
              <button onClick={handleFetchReports} disabled={reportLoading}
                className="px-5 py-3 rounded-xl bg-[#0F766E] hover:bg-teal-800 disabled:bg-teal-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all">
                {reportLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {reportLoading ? 'Searching...' : 'Fetch Reports'}
              </button>
            </div>

            {reportFetchNotice && (
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-mono font-bold flex items-center justify-between">
                <span>Source: <strong>{reportFetchNotice.source}</strong></span>
                <span>Reports Found: {reportFetchNotice.count}</span>
              </div>
            )}

            {reportError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{reportError}</span>
                <button onClick={handleFetchReports} className="ml-auto px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-black flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Retry
                </button>
              </div>
            )}

            <div className="space-y-3">
              {!reportFetchNotice && !reportError && !reportLoading && (
                <p className="text-xs text-slate-400 italic text-center py-6">Enter a Patient ID (e.g. SAN-2026-1001) and click Fetch Reports to demonstrate LRU Cache.</p>
              )}
              {patientReports.length === 0 && reportFetchNotice && (
                <p className="text-xs text-slate-500 italic text-center py-4">No diagnostic reports found for this patient ID.</p>
              )}
              {patientReports.map(rpt => (
                <div key={rpt.reportId} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-extrabold text-slate-900">{rpt.reportType}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">ID: {rpt.reportId} • Dr. {rpt.doctor}</p>
                  </div>
                  <span className="px-3 py-1 bg-teal-100 text-teal-800 font-bold rounded-lg text-[11px]">{rpt.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== BLOOD BANK TAB (UNION-FIND) ===================== */}
        {activeTab === 'bloodbank' && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-widest bg-purple-50 px-2 py-0.5 rounded">DSA Engine: Union-Find Disjoint Set with Path Compression</span>
              <h2 className="text-xl font-black text-slate-900 mt-1">Blood Compatibility Engine</h2>
              <p className="text-xs text-slate-500 mt-0.5">Union-Find evaluates compatible donor groups for transfusion compatibility.</p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">Select Patient Blood Group:</label>
              <div className="flex flex-wrap gap-2">
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(grp => (
                  <button key={grp} onClick={() => handleCompatibleBlood(grp)} disabled={bloodLoading}
                    className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${selectedBloodGroup === grp ? 'bg-red-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                    {grp}
                  </button>
                ))}
              </div>
              {bloodLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Loader2 className="w-4 h-4 animate-spin" /> Running Union-Find lookup...
                </div>
              )}
            </div>

            {compatibleGroups.length > 0 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2 text-xs">
                  <p className="font-bold text-purple-900">Compatible Donor Groups for <span className="text-red-600 font-mono text-sm font-black">{selectedBloodGroup}</span>:</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {compatibleGroups.map(cg => (
                      <span key={cg} className="px-3 py-1 rounded-lg bg-purple-200 font-mono font-extrabold text-purple-900 border border-purple-300">{cg}</span>
                    ))}
                  </div>
                </div>

                {compatibleInventory.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black text-slate-700 mb-3">Available Compatible Inventory:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {compatibleInventory.map(inv => (
                        <div key={inv.group} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                          <div className="text-xl font-black text-red-600">{inv.group}</div>
                          <div className="text-xs font-bold text-slate-700 mt-1">{inv.units} Units</div>
                          <div className={`text-[10px] font-black mt-1 px-2 py-0.5 rounded ${inv.status === 'Adequate' ? 'bg-green-100 text-green-700' : inv.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                            {inv.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {compatibleInventory.length === 0 && (
                  <p className="text-xs text-slate-500 italic">No compatible blood stock currently available in inventory for {selectedBloodGroup}.</p>
                )}
              </div>
            )}
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#071A1D] text-slate-400 text-xs py-6 border-t border-teal-900/50 mt-8 text-center">
        <p>© 2026 Sanjeevani Multispeciality Hospital, Sector 32, Chandigarh — Powered by Custom DSA Engine (PriorityQueue · Graph/Dijkstra · LRU Cache · UnionFind · BedAllocator · CaseCache)</p>
      </footer>
    </div>
  );
}
