import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, Siren, Stethoscope, Droplet, Clock, FileText, Search, 
  Upload, QrCode, Bell, Download, CheckCircle2, Lock, ShieldCheck, 
  MapPin, Phone, Mail, Globe, ArrowRight, Activity, Users, Bed, Truck, 
  AlertCircle, Check, Award, ChevronRight, Calendar, UserCheck, Plus, X 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, AreaChart, Area 
} from 'recharts';
import { HOSPITAL_INFO, INITIAL_DOCTORS, INITIAL_EMERGENCY_CASES } from './data/hospitalStore';
import { 
  fetchDoctors, fetchAmbulances, fetchBeds, fetchBloodStock, 
  fetchEmergencies, postEmergency, registerNormalPatientAPI, 
  bookAppointmentAPI, fetchAppointmentsAPI 
} from './services/api';
import socket from './services/socket';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [ambulances, setAmbulances] = useState([]);
  const [beds, setBeds] = useState([]);
  const [bloodStock, setBloodStock] = useState([]);
  const [emergencyRequests, setEmergencyRequests] = useState(INITIAL_EMERGENCY_CASES);
  const [myAppointments, setMyAppointments] = useState([]);

  const [showQR, setShowQR] = useState(false);
  const [createdNotice, setCreatedNotice] = useState(null);

  // Emergency Form State
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

  // Normal Registration & Appointment Form State
  const [normalForm, setNormalForm] = useState({
    name: 'Pooja Verma',
    age: '34',
    gender: 'Female',
    phone: '+91 98765 54321',
    email: 'pooja.verma@example.com',
    address: 'Sector 17, Chandigarh',
    city: 'Chandigarh',
    state: 'Punjab',
    bloodGroup: 'A+',
    aadharNumber: '9988 7766 5544',
    department: 'General Medicine',
    doctorPreference: 'Dr. Rajesh Sharma',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '10:00 AM - 10:30 AM',
    symptoms: 'Fever and seasonal cold for 2 days',
    medicalHistory: 'None',
    insuranceProvider: 'Star Health Insurance'
  });

  // Load Initial Data & Register Socket Hooks
  useEffect(() => {
    const loadInitialData = async () => {
      const [docsData, ambData, bedData, bloodData, erData, apptData] = await Promise.all([
        fetchDoctors(),
        fetchAmbulances(),
        fetchBeds(),
        fetchBloodStock(),
        fetchEmergencies(),
        fetchAppointmentsAPI()
      ]);
      setDoctors(docsData);
      setAmbulances(ambData);
      setBeds(bedData);
      setBloodStock(bloodData);
      setEmergencyRequests(erData);

      const isCleared = localStorage.getItem('patient_appointments_cleared') === 'true';
      const isEmergencySubmitted = localStorage.getItem('patient_emergency_submitted') === 'true';
      if (isCleared || isEmergencySubmitted) {
        setMyAppointments([]);
      } else {
        setMyAppointments(apptData);
      }
    };

    loadInitialData();

    // Socket.IO Events
    socket.on('new_emergency_request', (newCase) => {
      setEmergencyRequests(prev => [newCase, ...prev]);
    });

    socket.on('case_updated', (updatedCase) => {
      setEmergencyRequests(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
    });

    socket.on('appointment_approved', (updatedAppt) => {
      setMyAppointments(prev => prev.map(a => a.id === updatedAppt.id ? updatedAppt : a));
    });

    socket.on('appointment_completed', (updatedAppt) => {
      setMyAppointments(prev => prev.map(a => a.id === updatedAppt.id ? updatedAppt : a));
    });

    return () => {
      socket.off('new_emergency_request');
      socket.off('case_updated');
      socket.off('appointment_approved');
      socket.off('appointment_completed');
    };
  }, []);

  const handleRemoveAppointment = (id) => {
    const updated = myAppointments.filter(a => a.id !== id);
    setMyAppointments(updated);
    if (updated.length === 0) {
      localStorage.setItem('patient_appointments_cleared', 'true');
    }
    try {
      localStorage.setItem('hems_sync_event', JSON.stringify({
        type: 'APPOINTMENT_CANCELLED',
        appointmentId: id,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.warn('Sync error:', err);
    }
  };

  const handleClearAllAppointments = () => {
    setMyAppointments([]);
    localStorage.setItem('patient_appointments_cleared', 'true');
    try {
      localStorage.setItem('hems_sync_event', JSON.stringify({
        type: 'ALL_APPOINTMENTS_CANCELLED',
        timestamp: Date.now()
      }));
    } catch (err) {
      console.warn('Sync error:', err);
    }
  };

  const handleEmergencySubmit = async (e) => {
    e.preventDefault();
    const result = await postEmergency(emergencyForm);
    const newCase = (result && result.data) || {
      id: `ER2026${Math.floor(1000 + Math.random() * 9000)}`,
      ...emergencyForm,
      status: 'Submitted',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Force status to Submitted
    newCase.status = 'Submitted';

    setEmergencyRequests([newCase, ...emergencyRequests]);

    // Remove / Cancel existing OPD appointments when emergency is submitted
    const removedCount = myAppointments.length;
    setMyAppointments([]);
    localStorage.setItem('patient_emergency_submitted', 'true');
    localStorage.setItem('patient_appointments_cleared', 'true');

    // Local Sync Event for Staff Portal (fallback + cross-tab)
    try {
      localStorage.setItem('hems_sync_event', JSON.stringify({
        type: 'EMERGENCY_SUBMITTED',
        caseData: newCase,
        cancelledAppointments: true,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.warn('LocalStorage sync warning:', err);
    }

    setCreatedNotice({
      id: newCase.id,
      status: 'Submitted',
      type: emergencyForm.emergencyType,
      message: removedCount > 0
        ? `Emergency request SUBMITTED successfully! ${removedCount} active OPD appointment(s) have been cancelled and removed.`
        : "Emergency request SUBMITTED successfully & broadcasted to Staff Command Center!"
    });
  };

  const handleNormalSubmit = async (e) => {
    e.preventDefault();
    const patRes = await registerNormalPatientAPI(normalForm);
    const apptRes = await bookAppointmentAPI({
      patientName: normalForm.name,
      doctorName: normalForm.doctorPreference,
      department: normalForm.department,
      date: normalForm.appointmentDate,
      timeSlot: normalForm.timeSlot
    });

    const patientId = patRes.patientId || (patRes.data && patRes.data.id) || `PAT2026${Math.floor(10000 + Math.random() * 90000)}`;
    const newAppt = (apptRes && apptRes.data) || {
      id: `APT2026${Math.floor(10000 + Math.random() * 90000)}`,
      patientName: normalForm.name,
      doctorName: normalForm.doctorPreference,
      department: normalForm.department,
      date: normalForm.appointmentDate,
      timeSlot: normalForm.timeSlot,
      status: 'Appointment Requested'
    };

    const newPatObj = (patRes && patRes.data) || {
      id: patientId,
      name: normalForm.name,
      age: normalForm.age,
      gender: normalForm.gender,
      phone: normalForm.phone,
      address: normalForm.address,
      bloodGroup: normalForm.bloodGroup,
      status: 'Registered (OPD)',
      ward: normalForm.department || 'General OPD Care',
      attendingDoctor: normalForm.doctorPreference || 'Dr. Rajesh Sharma'
    };

    localStorage.removeItem('patient_appointments_cleared');
    localStorage.removeItem('patient_emergency_submitted');

    setMyAppointments([newAppt, ...myAppointments]);

    // Local Sync Event for Staff Portal (fallback + cross-tab)
    try {
      localStorage.setItem('hems_sync_event', JSON.stringify({
        type: 'NORMAL_OPD_BOOKED',
        appointment: newAppt,
        patient: newPatObj,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.warn('LocalStorage sync warning:', err);
    }

    setCreatedNotice({
      id: `${patientId} / ${newAppt.id}`,
      message: "Normal OPD Patient & Appointment registered successfully!"
    });
    setActiveTab('appointments');
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans relative overflow-x-hidden selection:bg-[#0F766E] selection:text-white">
      
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
                { id: 'normal-register', label: 'Consultation' },
                { id: 'emergency-register', label: 'Emergency' },
                { id: 'appointments', label: 'My Appointments' },
                { id: 'doctors', label: 'Doctors' },
                { id: 'bloodbank', label: 'Blood Bank' }
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

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('normal-register')}
                className="px-3.5 py-2 rounded-xl text-xs font-black text-white bg-[#0F766E] hover:bg-teal-800 shadow-sm transition-all"
              >
                🩺 Book Appointment
              </button>
              <button
                onClick={() => setActiveTab('emergency-register')}
                className="px-3.5 py-2 rounded-xl text-xs font-black text-white bg-[#DC2626] hover:bg-red-700 shadow-sm transition-all"
              >
                🚑 Register Emergency
              </button>
            </div>
          </div>
        </nav>

        {/* MAIN BODY CONTENT */}
        <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          
          {/* HOME PAGE VIEW */}
          {activeTab === 'home' && (
            <div className="w-full space-y-12">
              
              {/* DUAL REGISTRATION CARDS */}
              <div className="text-center space-y-2 max-w-2xl mx-auto pt-4">
                <span className="text-xs font-black uppercase text-[#0F766E] tracking-wider">Patient Portal Navigation</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Choose Your Healthcare Registration Mode</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Emergency Registration Card */}
                <div 
                  onClick={() => setActiveTab('emergency-register')}
                  className="p-8 rounded-3xl bg-gradient-to-br from-red-50 to-white border-2 border-red-200 shadow-xl hover:border-red-500 hover:shadow-2xl transition-all cursor-pointer space-y-4 group relative overflow-hidden"
                >
                  <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-red-600/30 group-hover:scale-110 transition-transform">
                    🚑
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-black text-red-600 uppercase tracking-wider">Immediate Triage Action</span>
                    <h3 className="text-2xl font-black text-slate-900">Emergency Case Registration</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Critical vehicle accident, acute cardiac arrest, stroke, severe trauma, or 108 emergency ambulance dispatch. Generates <strong className="text-red-600 font-mono">ER202600001</strong> case token.
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs font-black text-red-600 group-hover:translate-x-1 transition-transform">
                    <span>Proceed to Emergency Triage Form</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Normal Patient Consultation Card */}
                <div 
                  onClick={() => setActiveTab('normal-register')}
                  className="p-8 rounded-3xl bg-gradient-to-br from-teal-50 to-white border-2 border-teal-200 shadow-xl hover:border-[#0F766E] hover:shadow-2xl transition-all cursor-pointer space-y-4 group relative overflow-hidden"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center text-2xl shadow-lg shadow-teal-700/30 group-hover:scale-110 transition-transform">
                    🩺
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-black text-[#0F766E] uppercase tracking-wider">Outpatient OPD Services</span>
                    <h3 className="text-2xl font-black text-slate-900">Normal Consultation & OPD Appointment</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    General consultation, fever, seasonal cold, diabetes checkup, routine health checkup, pregnancy care, or follow-up visits. Generates Patient ID <strong className="text-[#0F766E] font-mono">PAT202600001</strong> and Appointment ID <strong className="text-[#0F766E] font-mono">APT202600001</strong>.
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs font-black text-[#0F766E] group-hover:translate-x-1 transition-transform">
                    <span>Proceed to OPD Booking Form</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* LIVE EMERGENCY TRACKER QUEUE */}
              <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-black text-slate-900">Live Emergency Status Tracker (Real-Time Socket Sync)</h3>
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
            </div>
          )}

          {/* NORMAL PATIENT REGISTRATION FORM TAB */}
          {activeTab === 'normal-register' && (
            <div className="w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg space-y-6 max-w-4xl mx-auto">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-teal-100 text-[#0F766E] mb-2">
                  <Stethoscope className="w-4 h-4 text-[#0F766E]" />
                  <span>Outpatient OPD Registration & Doctor Booking</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">NORMAL PATIENT CONSULTATION FORM</h2>
              </div>

              <form onSubmit={handleNormalSubmit} className="space-y-6">
                
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-[#0F766E] border-b pb-1">1. Patient Personal Details</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Full Patient Name *</label>
                      <input type="text" required value={normalForm.name} onChange={(e) => setNormalForm({ ...normalForm, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0F766E]" />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Age *</label>
                      <input type="number" required value={normalForm.age} onChange={(e) => setNormalForm({ ...normalForm, age: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0F766E]" />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Gender *</label>
                      <select value={normalForm.gender} onChange={(e) => setNormalForm({ ...normalForm, gender: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0F766E]">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
                      <input type="text" required value={normalForm.phone} onChange={(e) => setNormalForm({ ...normalForm, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0F766E]" />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                      <input type="email" value={normalForm.email} onChange={(e) => setNormalForm({ ...normalForm, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0F766E]" />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Blood Group</label>
                      <select value={normalForm.bloodGroup} onChange={(e) => setNormalForm({ ...normalForm, bloodGroup: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0F766E]">
                        <option>A+</option>
                        <option>A-</option>
                        <option>B+</option>
                        <option>B-</option>
                        <option>AB+</option>
                        <option>AB-</option>
                        <option>O+</option>
                        <option>O-</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Consultation & Appointment Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-[#0F766E] border-b pb-1">2. Department & Consultation Booking</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Department *</label>
                      <select value={normalForm.department} onChange={(e) => setNormalForm({ ...normalForm, department: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0F766E]">
                        {[
                          'General Medicine', 'Cardiology', 'Neurology', 'Orthopedics', 
                          'Dermatology', 'ENT', 'Dental', 'Ophthalmology', 'Pediatrics', 
                          'Gynecology', 'Psychiatry', 'Pulmonology', 'Radiology', 'Oncology'
                        ].map((dept, i) => (
                          <option key={i}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Doctor Preference</label>
                      <select value={normalForm.doctorPreference} onChange={(e) => setNormalForm({ ...normalForm, doctorPreference: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0F766E]">
                        <option>Dr. Rajesh Sharma (Cardiology HOD)</option>
                        <option>Dr. Priya Mehta (Neurology)</option>
                        <option>Dr. Vivek Singh (Emergency Medicine)</option>
                        <option>Dr. Kavita Kapoor (Pediatrics)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Appointment Date *</label>
                      <input type="date" required value={normalForm.appointmentDate} onChange={(e) => setNormalForm({ ...normalForm, appointmentDate: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0F766E]" />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Time Slot *</label>
                      <select value={normalForm.timeSlot} onChange={(e) => setNormalForm({ ...normalForm, timeSlot: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0F766E]">
                        <option>10:00 AM - 10:30 AM</option>
                        <option>11:00 AM - 11:30 AM</option>
                        <option>02:00 PM - 02:30 PM</option>
                        <option>04:00 PM - 04:30 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Current Symptoms & Health Concern</label>
                    <textarea rows="2" value={normalForm.symptoms} onChange={(e) => setNormalForm({ ...normalForm, symptoms: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0F766E]"></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl font-black text-xs text-white bg-[#0F766E] hover:bg-teal-800 shadow-xl shadow-teal-700/25 transition-all flex items-center justify-center gap-2"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Submit OPD Registration & Book Appointment</span>
                </button>
              </form>
            </div>
          )}

          {/* EMERGENCY REGISTRATION TAB */}
          {activeTab === 'emergency-register' && (
            <div className="w-full bg-white rounded-3xl p-6 sm:p-10 border border-red-200 shadow-xl space-y-8 max-w-4xl mx-auto">
              
              <div className="border-b border-red-100 pb-4 flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-700 mb-2">
                    <Siren className="w-4 h-4 text-red-600 animate-pulse" />
                    <span>24×7 Rapid Emergency Triage Unit</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">EMERGENCY CASE REGISTRATION FORM</h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Select emergency type and submit. Emergency request will show as <strong className="text-red-600 font-bold">SUBMITTED</strong> and automatically cancel/remove any routine OPD appointments.
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-2xl text-right">
                  <span className="text-[10px] uppercase font-bold text-red-500 block">Immediate Helpline</span>
                  <span className="text-base font-mono font-black text-red-700">112 / 108</span>
                </div>
              </div>

              {createdNotice && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-2">
                  <div className="flex items-center gap-2 font-black text-sm text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>EMERGENCY CASE SUBMITTED SUCCESSFULLY!</span>
                  </div>
                  <div className="text-xs font-semibold">
                    Token ID: <span className="font-mono font-bold text-emerald-900">{createdNotice.id}</span> | Status: <span className="font-bold bg-emerald-200 px-2 py-0.5 rounded text-emerald-900">Submitted</span>
                  </div>
                  <p className="text-xs text-emerald-700 font-medium">{createdNotice.message}</p>
                </div>
              )}

              <form onSubmit={handleEmergencySubmit} className="space-y-6">
                
                {/* 1. Emergency Type Selection */}
                <div className="space-y-3 bg-red-50/50 p-4 sm:p-5 rounded-2xl border border-red-100">
                  <label className="text-xs font-black uppercase text-red-700 block tracking-wider">
                    1. Select Type of Emergency *
                  </label>
                  
                  {/* Quick Select Category Chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { type: 'Accident / Road Trauma', icon: '🚗', label: 'Accident / Trauma' },
                      { type: 'Cardiac Arrest / Chest Pain', icon: '❤️', label: 'Cardiac Arrest' },
                      { type: 'Stroke / Paralysis', icon: '🧠', label: 'Stroke / Brain' },
                      { type: 'Severe Trauma / Bleeding', icon: '🩸', label: 'Severe Bleeding' },
                      { type: 'Respiratory Failure / Breathing Issue', icon: '🫁', label: 'Breathing Emergency' },
                      { type: 'Burns / Chemical Injury', icon: '🔥', label: 'Severe Burns' },
                      { type: 'Maternity / Obstetrics Emergency', icon: '🤰', label: 'Maternity Crisis' },
                      { type: 'Poisoning / Toxicity', icon: '☣️', label: 'Poisoning / Overdose' },
                      { type: 'General Critical Emergency', icon: '🚨', label: 'General Emergency' }
                    ].map((item, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setEmergencyForm({ ...emergencyForm, emergencyType: item.type })}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all text-xs font-bold ${
                          emergencyForm.emergencyType === item.type
                            ? 'bg-red-600 text-white border-red-700 shadow-md ring-2 ring-red-400'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-red-300 hover:bg-red-50/50'
                        }`}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Dropdown Select for Emergency Type */}
                  <div className="pt-2">
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Emergency Category Dropdown Select *</label>
                    <select 
                      value={emergencyForm.emergencyType} 
                      onChange={(e) => setEmergencyForm({ ...emergencyForm, emergencyType: e.target.value })} 
                      className="w-full bg-white border border-red-300 rounded-xl p-3 text-xs font-black text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
                    >
                      <option value="Accident / Road Trauma">🚗 Accident / Road Trauma</option>
                      <option value="Cardiac Arrest / Chest Pain">❤️ Cardiac Arrest / Chest Pain</option>
                      <option value="Stroke / Paralysis">🧠 Stroke / Brain Hemorrhage</option>
                      <option value="Severe Trauma / Bleeding">🩸 Severe Trauma / Hemorrhage</option>
                      <option value="Respiratory Failure / Breathing Issue">🫁 Respiratory Failure / Severe Breathing Issue</option>
                      <option value="Burns / Chemical Injury">🔥 Burns / Chemical Exposure</option>
                      <option value="Maternity / Obstetrics Emergency">🤰 Maternity / Pregnancy Emergency</option>
                      <option value="Poisoning / Toxicity">☣️ Poisoning / Overdose Toxicity</option>
                      <option value="General Critical Emergency">🚨 General Critical Emergency</option>
                    </select>
                  </div>
                </div>

                {/* 2. Patient Personal Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-red-700 border-b border-slate-100 pb-1">
                    2. Patient Contact & Triage Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Patient Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Rahul Sharma" 
                        value={emergencyForm.patientName} 
                        onChange={(e) => setEmergencyForm({ ...emergencyForm, patientName: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-red-500" 
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="+91 98765 43210" 
                        value={emergencyForm.phone} 
                        onChange={(e) => setEmergencyForm({ ...emergencyForm, phone: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-red-500" 
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Priority Level *</label>
                      <select 
                        value={emergencyForm.priority} 
                        onChange={(e) => setEmergencyForm({ ...emergencyForm, priority: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-red-700 focus:outline-none focus:border-red-500"
                      >
                        <option value="Critical">🔴 Critical (Immediate Triage)</option>
                        <option value="High">🟠 High Priority</option>
                        <option value="Medium">🟡 Medium Priority</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Age</label>
                      <input 
                        type="number" 
                        placeholder="Age (Years)" 
                        value={emergencyForm.age} 
                        onChange={(e) => setEmergencyForm({ ...emergencyForm, age: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-red-500" 
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Gender</label>
                      <select 
                        value={emergencyForm.gender} 
                        onChange={(e) => setEmergencyForm({ ...emergencyForm, gender: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-red-500"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Emergency Location / Pickup Address *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Street address, city, landmark for 108 Ambulance" 
                      value={emergencyForm.address} 
                      onChange={(e) => setEmergencyForm({ ...emergencyForm, address: e.target.value })} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-red-500" 
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Accident Details & Symptoms Description</label>
                    <textarea 
                      rows="3" 
                      placeholder="Brief details about the condition, injury, consciousness, or ambulance requirement..." 
                      value={emergencyForm.description} 
                      onChange={(e) => setEmergencyForm({ ...emergencyForm, description: e.target.value })} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-red-500" 
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="font-semibold">
                    <strong>Note:</strong> Submitting this emergency request will register your case with status <strong className="text-red-700">SUBMITTED</strong>, notify trauma doctors, and automatically remove/cancel any active OPD consultation appointments.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl font-black text-xs text-white bg-[#DC2626] hover:bg-red-700 shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 tracking-wide"
                >
                  <Siren className="w-5 h-5 animate-bounce" />
                  <span>SUBMIT EMERGENCY REQUEST (STATUS: SUBMITTED)</span>
                </button>
              </form>
            </div>
          )}

          {/* MY APPOINTMENTS TAB */}
          {activeTab === 'appointments' && (
            <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">My Registered OPD Appointments</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Manage your outpatient doctor consultations and appointment slips.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {myAppointments.length > 0 && (
                    <button 
                      onClick={handleClearAllAppointments} 
                      className="px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Clear All Appointments
                    </button>
                  )}
                  <button onClick={() => setActiveTab('normal-register')} className="px-4 py-2 bg-[#0F766E] hover:bg-teal-800 text-white text-xs font-black rounded-xl flex items-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" /> Book New Appointment
                  </button>
                </div>
              </div>

              {myAppointments.length === 0 ? (
                <div className="p-10 text-center space-y-4 bg-slate-50/60 rounded-3xl border border-dashed border-slate-200 max-w-lg mx-auto my-6">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center text-2xl mx-auto shadow-sm border border-teal-100">
                    🩺
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900">No Active OPD Appointments</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      You currently have no scheduled OPD consultation appointments. Active appointments are automatically removed when an emergency case is submitted or manually cancelled.
                    </p>
                  </div>
                  <div className="pt-2 flex justify-center gap-3 flex-wrap">
                    <button 
                      onClick={() => setActiveTab('normal-register')} 
                      className="px-4 py-2.5 bg-[#0F766E] text-white rounded-xl text-xs font-black shadow-md hover:bg-teal-800 transition-colors"
                    >
                      Book OPD Consultation
                    </button>
                    <button 
                      onClick={() => setActiveTab('emergency-register')} 
                      className="px-4 py-2.5 bg-red-600 text-white rounded-xl text-xs font-black shadow-md hover:bg-red-700 transition-colors"
                    >
                      Register Emergency
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse font-sans min-w-[750px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase">
                        <th className="p-3">Appointment ID</th>
                        <th className="p-3">Patient Name</th>
                        <th className="p-3">Doctor</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">Date / Time Slot</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myAppointments.map((appt) => (
                        <tr key={appt.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono font-bold text-[#0F766E]">{appt.id}</td>
                          <td className="p-3 font-extrabold text-slate-900">{appt.patientName}</td>
                          <td className="p-3 font-semibold text-[#0F766E]">{appt.doctorName}</td>
                          <td className="p-3 font-medium">{appt.department}</td>
                          <td className="p-3 font-mono">{appt.date} ({appt.timeSlot})</td>
                          <td className="p-3">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-teal-100 text-teal-800">
                              {appt.status}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button className="px-2.5 py-1 bg-slate-900 hover:bg-black text-white rounded-lg font-bold text-[10px]">
                                Download Slip
                              </button>
                              <button 
                                onClick={() => handleRemoveAppointment(appt.id)}
                                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg font-bold text-[10px] transition-colors"
                              >
                                Cancel / Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
        </main>

        {/* FOOTER */}
        <footer className="w-full bg-[#071A1D] text-slate-400 text-xs py-8 border-t border-teal-900/50 mt-16 text-center">
          <p>© 2026 Sanjeevani Multispeciality Hospital (Sector 32, Chandigarh). Real-Time Connected Engine.</p>
        </footer>
      </div>
    </div>
  );
}
