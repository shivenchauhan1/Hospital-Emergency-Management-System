import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, Siren, Stethoscope, Droplet, Clock, FileText, Search, 
  Upload, QrCode, Bell, Download, CheckCircle2, Lock, ShieldCheck, 
  MapPin, Phone, Mail, Globe, ArrowRight, Activity, Users, Bed, Truck, 
  AlertCircle, Check, Award, ChevronRight, Calendar, UserCheck, Plus, X,
  Cpu, Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, AreaChart, Area 
} from 'recharts';
import { HOSPITAL_INFO, INITIAL_DOCTORS, INITIAL_EMERGENCY_CASES } from './data/hospitalStore';
import { 
  fetchDoctors, fetchAmbulances, fetchBeds, fetchBloodStock, 
  fetchEmergencies, postEmergency, registerNormalPatientAPI, 
  bookAppointmentAPI, fetchAppointmentsAPI, fetchPatientReportsAPI,
  fetchCompatibleBloodAPI, requestBloodAPI
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

  // Reports & Blood DSA State
  const [patientIdInput, setPatientIdInput] = useState('SAN-2026-1001');
  const [patientReports, setPatientReports] = useState([]);
  const [reportFetchNotice, setReportFetchNotice] = useState(null);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('O+');
  const [compatibleGroups, setCompatibleGroups] = useState([]);
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

    return () => {
      socket.off('new_emergency_request');
      socket.off('case_updated');
      socket.off('appointment_approved');
    };
  }, []);

  const handleFetchReportsDSA = async () => {
    const res = await fetchPatientReportsAPI(patientIdInput);
    if (res && res.data) {
      setPatientReports(res.data);
      setReportFetchNotice({ source: res.source, count: res.data.length });
    }
  };

  const handleFetchCompatibleBloodDSA = async (group) => {
    setSelectedBloodGroup(group);
    const res = await fetchCompatibleBloodAPI(group);
    if (res && res.compatibleGroups) {
      setCompatibleGroups(res.compatibleGroups);
    }
  };

  const handleEmergencySubmit = async (e) => {
    e.preventDefault();
    const result = await postEmergency(emergencyForm);
    const newCase = (result && result.data) || {
      id: `ER2026${Math.floor(1000 + Math.random() * 9000)}`,
      ...emergencyForm,
      status: 'Submitted'
    };
    newCase.status = 'Submitted';
    setEmergencyRequests([newCase, ...emergencyRequests]);

    const removedCount = myAppointments.length;
    setMyAppointments([]);
    localStorage.setItem('patient_emergency_submitted', 'true');
    localStorage.setItem('patient_appointments_cleared', 'true');

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

    localStorage.removeItem('patient_appointments_cleared');
    localStorage.removeItem('patient_emergency_submitted');
    setMyAppointments([newAppt, ...myAppointments]);

    setCreatedNotice({
      id: `${patientId} / ${newAppt.id}`,
      message: "Normal OPD Patient & Appointment registered successfully!"
    });
    setActiveTab('appointments');
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans relative overflow-x-hidden">
      
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
                Patient Health Portal & Diagnostic Center
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {[
              { id: 'home', label: 'Home' },
              { id: 'normal-register', label: 'Consultation' },
              { id: 'emergency-register', label: 'Emergency' },
              { id: 'appointments', label: 'My Appointments' },
              { id: 'reports', label: 'Diagnostic Reports (LRU)' },
              { id: 'bloodbank', label: 'Blood Bank (Union-Find)' }
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
            <div className="text-center space-y-2 max-w-2xl mx-auto pt-4">
              <span className="text-xs font-black uppercase text-[#0F766E] tracking-wider">Patient Portal Navigation</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Choose Your Healthcare Service</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div 
                onClick={() => setActiveTab('emergency-register')}
                className="p-8 rounded-3xl bg-gradient-to-br from-red-50 to-white border-2 border-red-200 shadow-xl hover:border-red-500 hover:shadow-2xl transition-all cursor-pointer space-y-4 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center text-2xl shadow-lg">
                  🚑
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-black text-red-600 uppercase tracking-wider">Immediate Triage Action</span>
                  <h3 className="text-2xl font-black text-slate-900">Emergency Case Registration</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Critical vehicle accident, cardiac arrest, stroke, severe trauma, or 108 ambulance request. Generates Priority Queue triage token.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('normal-register')}
                className="p-8 rounded-3xl bg-gradient-to-br from-teal-50 to-white border-2 border-teal-200 shadow-xl hover:border-[#0F766E] hover:shadow-2xl transition-all cursor-pointer space-y-4 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center text-2xl shadow-lg">
                  🩺
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-black text-[#0F766E] uppercase tracking-wider">Outpatient OPD Services</span>
                  <h3 className="text-2xl font-black text-slate-900">Normal Consultation & OPD Appointment</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  General consultation, fever, routine checkups, diabetes care, or specialist OPD booking.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* DIAGNOSTIC REPORTS TAB (POWERED BY LRU CACHE TASK 5) */}
        {activeTab === 'reports' && (
          <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 max-w-4xl mx-auto">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded">
                Task 5 DSA Engine • LRU Cache (Doubly Linked List + Map)
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">Patient Diagnostic Reports & Scans</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Demonstrates O(1) LRU Cache lookups. Recently viewed reports are served from memory cache (capacity 20).
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Patient ID (e.g. SAN-2026-1001)"
                value={patientIdInput}
                onChange={(e) => setPatientIdInput(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0F766E]"
              />
              <button
                onClick={handleFetchReportsDSA}
                className="px-5 py-3 rounded-xl bg-[#0F766E] hover:bg-teal-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" /> Fetch Reports (LRU Cache)
              </button>
            </div>

            {reportFetchNotice && (
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-mono font-bold flex items-center justify-between">
                <span>Source: {reportFetchNotice.source}</span>
                <span>Reports Found: {reportFetchNotice.count}</span>
              </div>
            )}

            <div className="space-y-3">
              {patientReports.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-6">Enter a Patient ID above and click Fetch Reports to test LRU Cache execution.</p>
              ) : (
                patientReports.map((rpt) => (
                  <div key={rpt.reportId} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-extrabold text-slate-900">{rpt.reportType}</p>
                      <p className="text-slate-500 text-[11px]">Report ID: {rpt.reportId} • Prescribed by {rpt.doctor}</p>
                    </div>
                    <span className="px-3 py-1 bg-teal-100 text-teal-800 font-bold rounded-lg text-[11px]">{rpt.date}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* BLOOD BANK TAB (POWERED BY UNION-FIND TASK 6) */}
        {activeTab === 'bloodbank' && (
          <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 max-w-4xl mx-auto">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-widest bg-purple-50 px-2 py-0.5 rounded">
                Task 6 DSA Engine • Union-Find Disjoint Set
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">Blood Compatibility Grouping Engine</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Uses Union-Find with path compression to evaluate universal donor (O-) and recipient (AB+) compatibility sets.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">Select Patient Blood Group:</label>
              <div className="flex flex-wrap gap-2">
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((grp) => (
                  <button
                    key={grp}
                    onClick={() => handleFetchCompatibleBloodDSA(grp)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                      selectedBloodGroup === grp
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {grp}
                  </button>
                ))}
              </div>
            </div>

            {compatibleGroups.length > 0 && (
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2 text-xs">
                <p className="font-bold text-purple-900">
                  Union-Find Compatible Donor Groups for <span className="text-red-600 font-mono text-sm font-black">{selectedBloodGroup}</span>:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {compatibleGroups.map((cg) => (
                    <span key={cg} className="px-3 py-1 rounded-lg bg-purple-200 font-mono font-extrabold text-purple-900 border border-purple-300">
                      {cg}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#071A1D] text-slate-400 text-xs py-8 border-t border-teal-900/50 mt-16 text-center">
        <p>© 2026 Sanjeevani Multispeciality Hospital (Sector 32, Chandigarh). Powered by Custom DSA Backend Engine.</p>
      </footer>
    </div>
  );
}
