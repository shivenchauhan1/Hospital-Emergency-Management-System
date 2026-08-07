import React, { useState } from 'react';
import { 
  HeartPulse, 
  Siren, 
  Stethoscope, 
  Truck, 
  Bed, 
  Droplet, 
  Search, 
  CheckCircle2, 
  Clock, 
  Send, 
  FileText, 
  PhoneCall, 
  Award, 
  MapPin, 
  Download, 
  ShieldCheck, 
  AlertTriangle, 
  Upload, 
  UserCheck, 
  Lock, 
  Bell, 
  QrCode, 
  FileCheck 
} from 'lucide-react';
import { HOSPITAL_INFO } from '../../data/hospitalStore';

export default function PatientPortal({ 
  emergencyRequests, 
  onRegisterEmergency, 
  bloodBank, 
  onRequestBlood, 
  doctors, 
  ambulances, 
  setActivePageGlobal 
}) {
  const [activeTab, setActiveTab] = useState('emergency-register');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Notifications State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Emergency Approved', time: '10 Mins ago', message: 'Staff approved ER20260012. Dr. Rajesh Sharma assigned.', read: false },
    { id: 2, title: '108 Ambulance Dispatched', time: '5 Mins ago', message: 'Ambulance PB01AB1234 is en route to Sector 32 Chandigarh.', read: false },
    { id: 3, title: 'Blood Request Ready', time: '1 Hour ago', message: '2 Units of O- Blood reserved at Sanjeevani Blood Bank.', read: true }
  ]);

  // QR Code State
  const [showQR, setShowQR] = useState(false);

  // Medical Reports State
  const [reportsList, setReportsList] = useState([
    { id: 'REP-901', name: 'X-Ray Chest PA View', type: 'X-Ray', date: '2026-08-01', doctor: 'Dr. Rajesh Sharma', file: 'xray_chest_rahul.pdf' },
    { id: 'REP-902', name: 'Brain MRI T2 Contrast', type: 'MRI Scan', date: '2026-07-28', doctor: 'Dr. Priya Mehta', file: 'mri_brain_scan.pdf' },
    { id: 'REP-903', name: 'Abdominal CT Scan', type: 'CT Scan', date: '2026-07-15', doctor: 'Dr. Smita Deshmukh', file: 'ct_scan_abdo.pdf' }
  ]);

  // Upload Report State
  const [uploadReportForm, setUploadReportForm] = useState({
    name: '',
    type: 'PDF Clinical Audit',
    doctor: 'Dr. Rajesh Sharma'
  });
  const [uploadNotice, setUploadNotice] = useState('');

  // Emergency Form State
  const [emergencyForm, setEmergencyForm] = useState({
    patientName: 'Rahul Sharma',
    age: '42',
    gender: 'Male',
    phone: '+91 98765 43210',
    emergencyType: 'Accident',
    address: 'Sector 32, Chandigarh',
    description: 'Highway vehicle collision trauma near Tribune Chowk',
    emergencyLevel: 'Critical',
    imageFile: null
  });

  const [createdRequestNotice, setCreatedRequestNotice] = useState(null);

  // Blood Request Form State
  const [bloodForm, setBloodForm] = useState({
    group: 'O-',
    units: '2',
    patientName: 'Rahul Sharma',
    patientId: 'P-1001',
    doctor: 'Dr. Rajesh Sharma'
  });
  const [bloodNotice, setBloodNotice] = useState('');

  // Appointment Form State
  const [appointmentForm, setAppointmentForm] = useState({
    patientName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    department: 'Cardiology',
    doctor: 'Dr. Rajesh Sharma',
    date: '2026-08-10',
    time: '10:30 AM'
  });
  const [appointmentNotice, setAppointmentNotice] = useState('');

  // Emergency Registration Submit
  const handleEmergencySubmit = (e) => {
    e.preventDefault();
    const requestId = `ER202600${10 + emergencyRequests.length + 1}`;
    
    const newCase = {
      id: requestId,
      patient: emergencyForm.patientName,
      patientName: emergencyForm.patientName,
      age: emergencyForm.age,
      gender: emergencyForm.gender,
      phone: emergencyForm.phone,
      emergencyType: emergencyForm.emergencyType,
      address: emergencyForm.address,
      description: emergencyForm.description,
      priority: emergencyForm.emergencyLevel,
      emergencyLevel: emergencyForm.emergencyLevel,
      status: 'Pending',
      doctor: null,
      assignedDoctor: 'Unassigned',
      ambulance: null,
      ambulanceDispatched: 'None',
      bedAssigned: 'Pending Staff Allocation',
      createdAt: new Date().toISOString()
    };

    onRegisterEmergency(newCase);

    setCreatedRequestNotice({
      id: requestId,
      patientName: emergencyForm.patientName,
      message: "Your request has been sent successfully. Hospital staff will review your request shortly."
    });

    // Add Live Notification
    setNotifications((prev) => [
      { id: Date.now(), title: `Emergency Registered (${requestId})`, time: 'Just now', message: `Emergency request for ${emergencyForm.patientName} submitted.`, read: false },
      ...prev
    ]);
  };

  // Upload Report Submit
  const handleUploadReport = (e) => {
    e.preventDefault();
    const newReport = {
      id: `REP-${Math.floor(100 + Math.random() * 900)}`,
      name: uploadReportForm.name,
      type: uploadReportForm.type,
      date: new Date().toISOString().split('T')[0],
      doctor: uploadReportForm.doctor,
      file: `${uploadReportForm.name.toLowerCase().replace(/\s+/g, '_')}.pdf`
    };
    setReportsList([newReport, ...reportsList]);
    setUploadNotice(`✅ Medical File (${uploadReportForm.name}) uploaded successfully.`);
    setUploadReportForm({ name: '', type: 'PDF Clinical Audit', doctor: 'Dr. Rajesh Sharma' });
    setTimeout(() => setUploadNotice(''), 3000);
  };

  const handleBloodSubmit = (e) => {
    e.preventDefault();
    onRequestBlood(bloodForm.group, parseInt(bloodForm.units, 10));
    setBloodNotice(`✅ Blood requisition for ${bloodForm.units} Units of ${bloodForm.group} submitted to Sanjeevani Blood Bank.`);
    setTimeout(() => setBloodNotice(''), 4000);
  };

  const handleAppointmentSubmit = (e) => {
    e.preventDefault();
    setAppointmentNotice(`✅ OPD Appointment Request confirmed for ${appointmentForm.patientName} with ${appointmentForm.doctor} on ${appointmentForm.date} at ${appointmentForm.time}.`);
    setTimeout(() => setAppointmentNotice(''), 4000);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Top Header Bar with Welcome Rahul Sharma, QR Code & Notifications Bell */}
      <div className="w-full bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>Welcome,</span>
            <span className="text-[#00695C] underline decoration-teal-400">Rahul Sharma</span> 👋
          </h2>
          <p className="text-xs text-slate-500 font-medium">Patient ID: <span className="font-mono font-bold text-slate-800">SAN-2026-8842</span> | Chandigarh Resident</p>
        </div>

        {/* Search, QR Code & Notifications Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Live Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search doctors, emergency..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00695C] w-44 sm:w-56"
            />
          </div>

          {/* QR Code Button */}
          <button
            onClick={() => setShowQR(!showQR)}
            className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-[#00695C] hover:bg-teal-100 transition-colors flex items-center gap-1.5 text-xs font-extrabold"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">Patient QR</span>
          </button>

          {/* Notifications Bell Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center absolute -top-1 -right-1">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-[#00695C]" /> Notifications Alert
                  </h4>
                  <button 
                    onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))} 
                    className="text-[10px] text-teal-600 font-bold hover:underline"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className={`p-2.5 rounded-xl text-xs space-y-1 ${n.read ? 'bg-slate-50' : 'bg-teal-50/70 border border-teal-100 font-bold'}`}>
                      <div className="flex justify-between items-center text-slate-900 font-extrabold">
                        <span>{n.title}</span>
                        <span className="text-[9px] text-slate-400 font-normal">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-normal">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Patient QR Code Modal Dialog */}
      {showQR && (
        <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4 max-w-sm mx-auto text-center animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-[#00695C] text-white flex items-center justify-center mx-auto">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black">Digital Patient Health ID</h3>
          <p className="text-xs text-slate-300">Scan at Sanjeevani Kiosk, Sector 32 Chandigarh for immediate triage registration.</p>
          
          <div className="p-4 bg-white rounded-2xl inline-block shadow-inner">
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SANJEEVANI-PATIENT-RAHUL-SHARMA-ID-SAN-2026-8842" 
              alt="Patient QR Code" 
              className="w-36 h-36 mx-auto"
            />
          </div>

          <div className="font-mono text-xs text-teal-300 font-bold">SAN-2026-8842</div>
          <button 
            onClick={() => setShowQR(false)} 
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
          >
            Close QR Modal
          </button>
        </div>
      )}

      {/* Patient Service Tabs Header */}
      <div className="w-full rounded-3xl bg-gradient-to-r from-[#00695C] via-teal-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-teal-700/50 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-teal-500/20 text-teal-200 border border-teal-400/30">
              <HeartPulse className="w-4 h-4 text-teal-300 animate-pulse" />
              <span>Sanjeevani Multispeciality Hospital — Patient Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">
              Patient Services & Medical Tracker
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-2 border-t border-teal-800/60 w-full">
          <button
            onClick={() => setActiveTab('emergency-register')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'emergency-register'
                ? 'bg-[#D32F2F] text-white shadow-md'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Siren className="w-4 h-4 animate-bounce" />
            <span>Emergency Registration</span>
          </button>

          <button
            onClick={() => setActiveTab('track-request')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'track-request'
                ? 'bg-[#00695C] text-white shadow-md'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Track Emergency Request</span>
          </button>

          <button
            onClick={() => setActiveTab('medical-reports')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'medical-reports'
                ? 'bg-[#00695C] text-white shadow-md'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Medical Reports (PDF / Scans)</span>
          </button>

          <button
            onClick={() => setActiveTab('blood-request')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'blood-request'
                ? 'bg-[#00695C] text-white shadow-md'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Droplet className="w-4 h-4" />
            <span>Request Blood</span>
          </button>

          <button
            onClick={() => setActiveTab('appointment')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'appointment'
                ? 'bg-[#00695C] text-white shadow-md'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* TAB 1: EMERGENCY CASE REGISTRATION */}
      {activeTab === 'emergency-register' && (
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-800 mb-2">
              <Siren className="w-4 h-4 text-red-600 animate-pulse" />
              <span>24x7 Immediate Triage Registration</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">EMERGENCY CASE REGISTRATION</h2>
          </div>

          {createdRequestNotice && (
            <div className="p-6 rounded-2xl bg-teal-50 border border-teal-200 space-y-3 animate-fade-in">
              <div className="flex items-center gap-3 text-[#00695C]">
                <CheckCircle2 className="w-8 h-8 shrink-0" />
                <div>
                  <h3 className="text-lg font-black">{createdRequestNotice.message}</h3>
                  <p className="text-xs font-mono font-bold">
                    Emergency Request ID: <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">{createdRequestNotice.id}</span>
                  </p>
                </div>
              </div>
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Age *</label>
                <input
                  type="number"
                  required
                  value={emergencyForm.age}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, age: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Gender *</label>
                <select
                  value={emergencyForm.gender}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, gender: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Emergency Type *</label>
                <select
                  value={emergencyForm.emergencyType}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, emergencyType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00695C]"
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

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Address *</label>
              <input
                type="text"
                required
                value={emergencyForm.address}
                onChange={(e) => setEmergencyForm({ ...emergencyForm, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Priority *</label>
                <select
                  value={emergencyForm.emergencyLevel}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, emergencyLevel: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-[#00695C]"
                >
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Photo Upload (Optional)</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-500">
                  <Upload className="w-4 h-4 text-[#00695C]" />
                  <span>Choose JPG/PNG file</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
              <textarea
                rows="3"
                value={emergencyForm.description}
                onChange={(e) => setEmergencyForm({ ...emergencyForm, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-black text-sm text-white bg-[#D32F2F] hover:bg-red-700 shadow-xl shadow-red-600/25 transition-all flex items-center justify-center gap-2"
            >
              <Siren className="w-5 h-5 animate-bounce" />
              <span>Submit Emergency Request</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: LIVE TRACK EMERGENCY STAGES */}
      {activeTab === 'track-request' && (
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#00695C]" />
            Track Emergency Request Live Stages
          </h2>

          <div className="space-y-6">
            {emergencyRequests.map((req) => (
              <div key={req.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#00695C] bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">{req.id}</span>
                    <h3 className="text-lg font-black text-slate-900 mt-1">{req.patientName || req.patient} ({req.emergencyType})</h3>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    req.status === 'Approved' || req.status === 'Doctor Assigned' ? 'bg-teal-100 text-teal-800' :
                    req.status === 'Pending' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {req.status}
                  </span>
                </div>

                {/* 5-Stage Visual Stepper Timeline */}
                <div className="w-full grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                  <div className={`p-2.5 rounded-xl text-center text-xs font-bold border ${req.status ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    1. Pending
                  </div>
                  <div className={`p-2.5 rounded-xl text-center text-xs font-bold border ${req.status !== 'Pending' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    2. Approved
                  </div>
                  <div className={`p-2.5 rounded-xl text-center text-xs font-bold border ${req.assignedDoctor !== 'Unassigned' || req.doctor ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    3. Doctor Assigned
                  </div>
                  <div className={`p-2.5 rounded-xl text-center text-xs font-bold border ${req.ambulanceDispatched !== 'None' || req.ambulance ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    4. 108 Ambulance
                  </div>
                  <div className={`p-2.5 rounded-xl text-center text-xs font-bold border ${req.status === 'In Resuscitation' || req.status === 'Doctor Assigned' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    5. Treatment Started
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs p-4 rounded-2xl bg-white border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Doctor:</span>
                    <span className="font-extrabold text-slate-900">{req.assignedDoctor || req.doctor || 'Dr. Rajesh Sharma'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Ambulance Unit:</span>
                    <span className="font-mono font-bold text-red-600">{req.ambulanceDispatched || req.ambulance || 'PB01AB1234 En Route'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Hospital Location:</span>
                    <span className="font-semibold text-slate-800">Sector 32 Chandigarh</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MEDICAL REPORTS (PDF, X-RAY, MRI, CT SCAN) */}
      {activeTab === 'medical-reports' && (
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#00695C]" />
                Medical Reports & Diagnostic Scans
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                View, download, or upload PDF clinical reports, Chest X-Rays, Brain MRI scans, and Abdominal CT Scans.
              </p>
            </div>
          </div>

          {/* Upload New Medical File Form */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">Upload New Diagnostic Scan / PDF</h3>
            
            {uploadNotice && (
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold">
                {uploadNotice}
              </div>
            )}

            <form onSubmit={handleUploadReport} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Report Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brain MRI T2 Scan"
                  value={uploadReportForm.name}
                  onChange={(e) => setUploadReportForm({ ...uploadReportForm, name: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Scan / File Category</label>
                <select
                  value={uploadReportForm.type}
                  onChange={(e) => setUploadReportForm({ ...uploadReportForm, type: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00695C]"
                >
                  <option>PDF Clinical Audit</option>
                  <option>X-Ray Scan</option>
                  <option>MRI Brain Scan</option>
                  <option>CT Scan Abdomen</option>
                  <option>Blood Test Lab Report</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Attending Doctor</label>
                <input
                  type="text"
                  required
                  value={uploadReportForm.doctor}
                  onChange={(e) => setUploadReportForm({ ...uploadReportForm, doctor: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-4 rounded-xl text-xs font-extrabold text-white bg-[#00695C] hover:bg-teal-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Medical Report</span>
              </button>
            </form>
          </div>

          {/* Reports Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse font-sans min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase">
                  <th className="p-3.5">Report ID</th>
                  <th className="p-3.5">Document Title</th>
                  <th className="p-3.5">Scan Type</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Consultant</th>
                  <th className="p-3.5 text-center">Download Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportsList.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-mono font-bold text-[#00695C]">{rep.id}</td>
                    <td className="p-3.5 font-extrabold text-slate-900">{rep.name}</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                        {rep.type}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600 font-mono">{rep.date}</td>
                    <td className="p-3.5 font-semibold text-slate-800">{rep.doctor}</td>
                    <td className="p-3.5 text-center">
                      <button className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-slate-900 text-white hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5 text-teal-400" />
                        <span>Download PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BLOOD REQUEST */}
      {activeTab === 'blood-request' && (
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Droplet className="w-6 h-6 text-red-600 fill-red-600" />
            Sanjeevani Blood Bank Requisition
          </h2>

          {bloodNotice && (
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold">
              {bloodNotice}
            </div>
          )}

          <form onSubmit={handleBloodSubmit} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Blood Group</label>
                <select
                  value={bloodForm.group}
                  onChange={(e) => setBloodForm({ ...bloodForm, group: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-black text-slate-900 focus:outline-none focus:border-[#00695C]"
                >
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

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Units Needed</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={bloodForm.units}
                  onChange={(e) => setBloodForm({ ...bloodForm, units: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00695C]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Attending Doctor</label>
              <input
                type="text"
                required
                value={bloodForm.doctor}
                onChange={(e) => setBloodForm({ ...bloodForm, doctor: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl text-xs font-extrabold text-white bg-[#D32F2F] hover:bg-red-700 shadow-md"
            >
              Submit Blood Request
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: BOOK APPOINTMENT */}
      {activeTab === 'appointment' && (
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-[#00695C]" />
            Book OPD Specialist Appointment
          </h2>

          {appointmentNotice && (
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold">
              {appointmentNotice}
            </div>
          )}

          <form onSubmit={handleAppointmentSubmit} className="space-y-4 max-w-xl">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Patient Name</label>
              <input
                type="text"
                required
                value={appointmentForm.patientName}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, patientName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Attending Specialist</label>
                <select
                  value={appointmentForm.doctor}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, doctor: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00695C]"
                >
                  <option>Dr. Rajesh Sharma (Cardiology)</option>
                  <option>Dr. Priya Mehta (Neurosurgery)</option>
                  <option>Dr. Vivek Singh (Emergency Medicine)</option>
                  <option>Dr. Kavita Kapoor (Pediatrics)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Date</label>
                <input
                  type="date"
                  required
                  value={appointmentForm.date}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl text-xs font-extrabold text-white bg-[#00695C] hover:bg-teal-800 shadow-md"
            >
              Confirm OPD Booking
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
