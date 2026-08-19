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
  dispatchAmbulanceAPI, allocateBedAPI, fetchAppointmentsAPI, 
  approveAppointmentAPI, assignDoctorAppointmentAPI, completeAppointmentAPI 
} from './services/api';
import socket from './services/socket';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeConsole, setActiveConsole] = useState('dashboard');
  const [staffRole, setStaffRole] = useState('Admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [downloadNotice, setDownloadNotice] = useState('');

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
  const [appointments, setAppointments] = useState([]);

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
    { id: 2, title: 'New OPD Appointment Requested', time: '5 Mins ago', message: 'APT202600001 - Pooja Verma (Cardiology Consultation)', type: 'appointment' }
  ]);

  // Load Data & Socket Hooks
  useEffect(() => {
    const loadAllData = async () => {
      const [erData, patData, stfData, apptData] = await Promise.all([
        fetchStaffEmergencies(),
        fetchPatients(),
        fetchStaffMembers(),
        fetchAppointmentsAPI()
      ]);
      if (erData) setEmergencyCases(erData);
      if (patData) setPatients(patData);
      if (stfData) setStaffMembers(stfData);
      if (apptData) setAppointments(apptData);
    };

    loadAllData();

    socket.on('new_emergency_request', (newCase) => {
      setEmergencyCases(prev => [newCase, ...prev.filter(c => c.id !== newCase.id)]);
      setNotifications(prev => [
        {
          id: Date.now(),
          title: '🚨 NEW EMERGENCY SUBMITTED',
          time: 'Just now',
          message: `${newCase.id} - ${newCase.patientName || newCase.patient} (${newCase.emergencyType || 'Critical Emergency'})`,
          type: 'emergency'
        },
        ...prev
      ]);
    });

    socket.on('new_appointment', (newAppt) => {
      setAppointments(prev => [newAppt, ...prev.filter(a => a.id !== newAppt.id)]);
      setNotifications(prev => [
        {
          id: Date.now(),
          title: '🩺 NEW OPD APPOINTMENT BOOKED',
          time: 'Just now',
          message: `${newAppt.id} - ${newAppt.patientName} (${newAppt.department})`,
          type: 'appointment'
        },
        ...prev
      ]);
    });

    socket.on('new_patient', (newPat) => {
      setPatients(prev => [newPat, ...prev.filter(p => p.id !== newPat.id)]);
      setNotifications(prev => [
        {
          id: Date.now(),
          title: '👤 NEW OPD PATIENT REGISTERED',
          time: 'Just now',
          message: `${newPat.id} - ${newPat.name} (${newPat.ward || 'OPD Care'})`,
          type: 'patient'
        },
        ...prev
      ]);
    });

    socket.on('case_updated', (updatedCase) => {
      setEmergencyCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
    });

    socket.on('appointment_approved', (updatedAppt) => {
      setAppointments(prev => prev.map(a => a.id === updatedAppt.id ? updatedAppt : a));
    });

    // Cross-Tab Local Storage Fallback Listener (Immediate sync)
    const handleStorageChange = (e) => {
      if (e.key === 'hems_sync_event' && e.newValue) {
        try {
          const eventData = JSON.parse(e.newValue);
          if (eventData.type === 'NORMAL_OPD_BOOKED') {
            if (eventData.appointment) {
              setAppointments(prev => [eventData.appointment, ...prev.filter(a => a.id !== eventData.appointment.id)]);
            }
            if (eventData.patient) {
              setPatients(prev => [eventData.patient, ...prev.filter(p => p.id !== eventData.patient.id)]);
            }
          } else if (eventData.type === 'EMERGENCY_SUBMITTED') {
            if (eventData.caseData) {
              setEmergencyCases(prev => [eventData.caseData, ...prev.filter(c => c.id !== eventData.caseData.id)]);
            }
            if (eventData.cancelledAppointments) {
              setAppointments(prev => prev.map(a => ({
                ...a,
                status: a.status === 'Appointment Requested' || a.status === 'Approved' ? 'Cancelled - Emergency Submitted' : a.status
              })));
            }
          }
        } catch (err) {
          console.warn('Local sync parse error:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      socket.off('new_emergency_request');
      socket.off('new_appointment');
      socket.off('new_patient');
      socket.off('case_updated');
      socket.off('appointment_approved');
      window.removeEventListener('storage', handleStorageChange);
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

  // Handlers
  const handleApproveEmergency = async (id) => {
    setEmergencyCases(emergencyCases.map(c => c.id === id ? { ...c, status: 'Approved' } : c));
    await approveEmergencyAPI(id);
  };

  const handleApproveAppointment = async (id) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
    await approveAppointmentAPI(id);
  };

  const handleAssignDoctorAppointment = async (id, doctorName) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, doctorName, status: 'Doctor Assigned' } : a));
    await assignDoctorAppointmentAPI(id, doctorName);
  };

  const handleCompleteAppointment = async (id) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'Completed' } : a));
    await completeAppointmentAPI(id);
  };

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

  const pendingCount = emergencyCases.filter(c => c.status === 'Pending').length;
  const pendingApptCount = appointments.filter(a => a.status === 'Appointment Requested').length;

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
              { id: 'appointments', label: 'OPD Appointments', icon: Calendar, badge: pendingApptCount },
              { id: 'patients', label: 'Patients Directory', icon: Users, badge: patients.length },
              { id: 'doctors', label: 'Doctor Panel', icon: Stethoscope, badge: doctors.length },
              { id: 'departments', label: 'Departments', icon: Layers },
              { id: 'ambulances', label: '108 Fleet Control', icon: Truck },
              { id: 'beds', label: 'Bed & ICU Matrix', icon: Bed },
              { id: 'bloodbank', label: 'Blood Bank Stock', icon: Droplet },
              { id: 'reports', label: 'Clinical Analytics', icon: BarChart3 },
              { id: 'staff', label: 'Staff Management', icon: ShieldCheck, badge: staffMembers.length }
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
                  { title: 'OPD APPTS', val: appointments.length },
                  { title: 'PENDING APPTS', val: pendingApptCount },
                  { title: 'DOCTORS READY', val: doctors.length },
                  { title: 'ICU BEDS FREE', val: '22 / 50' },
                  { title: 'BLOOD UNITS', val: '320' },
                  { title: '108 AMBULANCE', val: ambulances.length },
                  { title: 'SURGERIES', val: '6 Today' },
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
                  <h3 className="text-base font-black text-slate-900">Emergency Intake Queue</h3>
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
                        <th className="p-3.5 text-center">Control Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {emergencyCases.map((req) => (
                        <tr key={req.id}>
                          <td className="p-3.5 font-mono font-bold text-[#0F766E]">{req.id}</td>
                          <td className="p-3.5 font-extrabold text-slate-900">{req.patientName || req.patient}</td>
                          <td className="p-3.5 font-bold text-red-700">{req.emergencyType}</td>
                          <td className="p-3.5"><span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-600 text-white">{req.priority || 'Critical'}</span></td>
                          <td className="p-3.5 font-extrabold text-teal-800">{req.status}</td>
                          <td className="p-3.5 text-center">
                            <button onClick={() => handleApproveEmergency(req.id)} className="px-2.5 py-1 text-xs font-black bg-emerald-600 text-white rounded-lg">Approve</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* APPOINTMENTS MANAGEMENT CONSOLE */}
          {activeConsole === 'appointments' && (
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">OPD Appointments & Normal Patient Intake Console</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Real-time list of all OPD consultation bookings registered from the Patient Website.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search patient name, ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#0F766E]"
                  />
                  <span className="text-xs font-mono font-bold text-[#0F766E] bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
                    Total Bookings: {appointments.length}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse font-sans min-w-[800px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase">
                      <th className="p-3.5">Appointment ID</th>
                      <th className="p-3.5">Patient Name</th>
                      <th className="p-3.5">Doctor</th>
                      <th className="p-3.5">Department</th>
                      <th className="p-3.5">Date / Time</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments
                      .filter(a => !searchQuery || (a.patientName && a.patientName.toLowerCase().includes(searchQuery.toLowerCase())) || (a.id && a.id.toLowerCase().includes(searchQuery.toLowerCase())))
                      .map((appt) => (
                      <tr key={appt.id} className="hover:bg-slate-50/50">
                        <td className="p-3.5 font-mono font-bold text-[#0F766E]">{appt.id}</td>
                        <td className="p-3.5 font-extrabold text-slate-900">{appt.patientName}</td>
                        <td className="p-3.5 font-semibold text-[#0F766E]">{appt.doctorName || 'Dr. Rajesh Sharma'}</td>
                        <td className="p-3.5 font-medium">{appt.department || 'General Medicine'}</td>
                        <td className="p-3.5 font-mono">{appt.date} ({appt.timeSlot})</td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                            appt.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                            appt.status === 'Completed' ? 'bg-slate-200 text-slate-800' :
                            appt.status && appt.status.includes('Cancelled') ? 'bg-red-100 text-red-800 border border-red-200' :
                            'bg-teal-100 text-teal-800 border border-teal-200'
                          }`}>
                            {appt.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="flex justify-center gap-1.5 flex-wrap">
                            {appt.status !== 'Approved' && appt.status !== 'Completed' && !appt.status.includes('Cancelled') && (
                              <button onClick={() => handleApproveAppointment(appt.id)} className="px-2.5 py-1 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">Approve</button>
                            )}
                            {appt.status !== 'Completed' && !appt.status.includes('Cancelled') && (
                              <>
                                <button onClick={() => handleAssignDoctorAppointment(appt.id, 'Dr. Rajesh Sharma')} className="px-2.5 py-1 text-xs font-black bg-teal-50 text-[#0F766E] border border-teal-200 hover:bg-teal-100 rounded-lg transition-colors">Assign Dr. Sharma</button>
                                <button onClick={() => handleCompleteAppointment(appt.id)} className="px-2.5 py-1 text-xs font-black bg-slate-900 hover:bg-black text-white rounded-lg transition-colors">Mark Completed</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* EMERGENCY CONSOLE */}
          {activeConsole === 'emergency' && (
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-xl font-black text-slate-900">Emergency Intake Queue</h2>
                <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-xl border border-red-200">
                  Total Cases: {emergencyCases.length}
                </span>
              </div>
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
                      <tr key={c.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono font-bold text-[#0F766E]">{c.id}</td>
                        <td className="p-3 font-extrabold text-slate-900">{c.patientName || c.patient}</td>
                        <td className="p-3 font-bold text-red-700">{c.emergencyType}</td>
                        <td className="p-3"><span className="px-2 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded">{c.priority || 'Critical'}</span></td>
                        <td className="p-3 font-bold">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                            c.status === 'Submitted' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                            c.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-red-50 text-red-800'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {c.status !== 'Approved' && (
                            <button onClick={() => handleApproveEmergency(c.id)} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors">Approve</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PATIENTS CONSOLE */}
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
                          <button onClick={() => handleDeletePatient(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
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

          {/* DOCTORS CONSOLE */}
          {activeConsole === 'doctors' && (
            <div className="w-full space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-xl font-black text-slate-900">Consultant Doctor Roster</h2>
                <button onClick={() => setShowAddDoctorModal(true)} className="px-4 py-2 bg-[#0F766E] text-white text-xs font-black rounded-xl flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Doctor
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((d) => (
                  <div key={d.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <h3 className="text-base font-black text-slate-900">{d.name}</h3>
                    <div className="text-xs font-extrabold text-[#0F766E]">{d.department}</div>
                    <p className="text-xs text-slate-500 font-medium">{d.specialization}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DEPARTMENTS CONSOLE */}
          {activeConsole === 'departments' && (
            <div className="w-full space-y-6">
              <h2 className="text-xl font-black text-slate-900">Hospital Departments</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  'General Medicine', 'Cardiology', 'Neurology', 'Orthopedics', 
                  'Dermatology', 'ENT', 'Dental', 'Ophthalmology', 'Pediatrics', 
                  'Gynecology', 'Psychiatry', 'Pulmonology', 'Radiology', 'Oncology'
                ].map((d, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
                    <h3 className="text-base font-black text-slate-900">{d}</h3>
                    <span className="text-xs text-teal-700 font-bold">Active OPD Services</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AMBULANCE CONSOLE */}
          {activeConsole === 'ambulances' && (
            <div className="w-full space-y-6">
              <h2 className="text-xl font-black text-slate-900">108 Fleet Control</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ambulances.map((a) => (
                  <div key={a.id} className="p-6 rounded-3xl bg-white border space-y-2 text-xs">
                    <div className="font-mono font-black text-base">{a.number}</div>
                    <div>Driver: {a.driver}</div>
                    <div>Status: <span className="font-bold text-teal-700">{a.status}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BEDS CONSOLE */}
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BLOOD BANK CONSOLE */}
          {activeConsole === 'bloodbank' && (
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-slate-900">NABL Blood Stock Reserve</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {bloodStock.map((b, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border space-y-2">
                    <div className="text-2xl font-black text-red-600">{b.group}</div>
                    <div className="text-xs font-mono font-bold">{b.units} Units</div>
                    <button onClick={() => handleAddBloodStock(b.group, 5)} className="w-full py-1 text-[10px] font-bold bg-[#0F766E] text-white rounded-lg">+ Add 5 Units</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* MODAL DIALOGS */}
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

        {/* FOOTER */}
        <footer className="w-full bg-[#071A1D] text-slate-400 text-xs py-6 text-center border-t border-teal-900/50 mt-12">
          <p>© 2026 Sanjeevani Multispeciality Hospital (Sector 32, Chandigarh). Enterprise Administration Dashboard.</p>
        </footer>
      </div>
    </div>
  );
}
