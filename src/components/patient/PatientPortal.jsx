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
  Lock 
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

  // Emergency Form State
  const [emergencyForm, setEmergencyForm] = useState({
    patientName: '',
    age: '',
    gender: 'Male',
    phone: '',
    emergencyType: 'Heart Attack',
    address: 'Sector 32, Chandigarh',
    description: '',
    emergencyLevel: 'Critical',
    imageFile: null
  });

  const [createdRequestNotice, setCreatedRequestNotice] = useState(null);

  // Blood Request Form State
  const [bloodForm, setBloodForm] = useState({
    group: 'O-',
    units: '2',
    patientName: '',
    patientId: 'P-1001',
    doctor: 'Dr. Rajesh Sharma'
  });
  const [bloodNotice, setBloodNotice] = useState('');

  // Appointment Form State
  const [appointmentForm, setAppointmentForm] = useState({
    patientName: '',
    phone: '',
    department: 'Cardiology',
    doctor: 'Dr. Rajesh Sharma',
    date: '2026-08-10',
    time: '10:30 AM'
  });
  const [appointmentNotice, setAppointmentNotice] = useState('');

  // Emergency Registration Submit
  const handleEmergencySubmit = (e) => {
    e.preventDefault();
    const requestId = `ER-2026-00${120 + emergencyRequests.length + 1}`;
    
    const newCase = {
      id: requestId,
      ...emergencyForm,
      status: 'Pending Review',
      assignedDoctor: 'Unassigned',
      ambulanceDispatched: 'None',
      bedAssigned: 'Pending Staff Allocation',
      arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onRegisterEmergency(newCase);

    setCreatedRequestNotice({
      id: requestId,
      patientName: emergencyForm.patientName,
      message: "Your request has been sent successfully. Hospital staff will review your request shortly."
    });

    setEmergencyForm({
      patientName: '',
      age: '',
      gender: 'Male',
      phone: '',
      emergencyType: 'Heart Attack',
      address: 'Sector 32, Chandigarh',
      description: '',
      emergencyLevel: 'Critical',
      imageFile: null
    });
  };

  // Blood Request Submit
  const handleBloodSubmit = (e) => {
    e.preventDefault();
    onRequestBlood(bloodForm.group, parseInt(bloodForm.units, 10));
    setBloodNotice(`✅ Blood requisition for ${bloodForm.units} Units of ${bloodForm.group} submitted to Sanjeevani Blood Bank.`);
    setTimeout(() => setBloodNotice(''), 4000);
  };

  // Appointment Submit
  const handleAppointmentSubmit = (e) => {
    e.preventDefault();
    setAppointmentNotice(`✅ OPD Appointment Request confirmed for ${appointmentForm.patientName} with ${appointmentForm.doctor} on ${appointmentForm.date} at ${appointmentForm.time}.`);
    setTimeout(() => setAppointmentNotice(''), 4000);
  };

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Patient Protection Banner */}
      <div className="w-full bg-[#00695C]/10 border border-[#00695C]/30 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap text-xs text-[#00695C] font-bold">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 shrink-0 text-[#00695C]" />
          <span>Patient Portal Mode: Read-Only & Request Submission Access Only</span>
        </div>
        <span className="bg-white px-2.5 py-1 rounded-lg border border-teal-200 text-[11px] font-mono">
          Strict Permission Guard Active
        </span>
      </div>

      {/* Hero Header */}
      <div className="w-full rounded-3xl bg-gradient-to-r from-[#00695C] via-teal-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-teal-700/50 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-teal-500/20 text-teal-200 border border-teal-400/30">
          <HeartPulse className="w-4 h-4 text-teal-300 animate-pulse" />
          <span>Sanjeevani Multispeciality Hospital — Patient Portal</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black">
          Patient Services & Emergency Case Registration
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
          Submit emergency resuscitation requests, requisition blood units, book OPD specialist appointments, and track your medical case in real-time.
        </p>

        {/* Navigation Tabs */}
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
            onClick={() => setActiveTab('blood-request')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'blood-request'
                ? 'bg-[#00695C] text-white shadow-md'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Droplet className="w-4 h-4" />
            <span>Request Blood Unit</span>
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

      {/* TAB 1: EMERGENCY CASE REGISTRATION (LARGE CARD) */}
      {activeTab === 'emergency-register' && (
        <div className="w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-800 mb-2">
              <Siren className="w-4 h-4 text-red-600 animate-pulse" />
              <span>24x7 Immediate Triage Registration</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">EMERGENCY CASE REGISTRATION</h2>
            <p className="text-xs text-slate-500 mt-1">
              Fill in patient condition details for instant triage alert to Sanjeevani Emergency Resuscitation Staff.
            </p>
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
              <p className="text-xs text-slate-600">
                You can view live staff approvals, assigned doctor, and 108 ambulance dispatch status under the <strong>Track Emergency Request</strong> tab.
              </p>
            </div>
          )}

          <form onSubmit={handleEmergencySubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
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
                  placeholder="e.g. 42"
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
                <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
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
              <label className="text-xs font-bold text-slate-700 block mb-1">Patient Location Address *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sector 32, Chandigarh / Phase 7 Mohali"
                value={emergencyForm.address}
                onChange={(e) => setEmergencyForm({ ...emergencyForm, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Emergency Level *</label>
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
                <label className="text-xs font-bold text-slate-700 block mb-1">Upload Medical Image / Prescription (Optional)</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-500">
                  <Upload className="w-4 h-4 text-[#00695C]" />
                  <span>Choose JPG/PNG file preview</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Short Symptoms Description</label>
              <textarea
                rows="3"
                placeholder="Describe current symptoms (e.g. crushing chest pain, difficulty breathing)..."
                value={emergencyForm.description}
                onChange={(e) => setEmergencyForm({ ...emergencyForm, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-black text-sm text-white bg-[#D32F2F] hover:bg-red-700 shadow-xl shadow-red-600/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Siren className="w-5 h-5 animate-bounce" />
              <span>Submit Emergency Request</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: LIVE EMERGENCY REQUEST TRACKER */}
      {activeTab === 'track-request' && (
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Clock className="w-6 h-6 text-[#00695C]" />
                Track Emergency Requests (Real-Time Live Feed)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Real-time synchronization with Sanjeevani Hospital Staff Console.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {emergencyRequests.map((req) => (
              <div key={req.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#00695C]">{req.id}</span>
                    <h3 className="text-base font-extrabold text-slate-900">{req.patientName} ({req.emergencyType})</h3>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    req.status === 'Approved' || req.status === 'Doctor Assigned' ? 'bg-teal-100 text-teal-800 border border-teal-200' :
                    req.status === 'Pending Review' ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    Status: {req.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs p-3.5 rounded-xl bg-white border border-slate-200 font-medium">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Specialist:</span>
                    <span className="font-extrabold text-slate-900">{req.assignedDoctor || 'Dr. Rajesh Sharma'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">108 Ambulance Dispatch:</span>
                    <span className="font-mono font-bold text-red-600">{req.ambulanceDispatched || 'PB01AB1234 En Route'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Bed Location:</span>
                    <span className="font-mono font-bold text-slate-800">{req.bedAssigned || 'ICU Tower Bed'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SANJEEVANI BLOOD BANK REQUISITION */}
      {activeTab === 'blood-request' && (
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Droplet className="w-6 h-6 text-red-600 fill-red-600" />
              Sanjeevani Hospital Blood Bank Requisition
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Submit blood unit request directly to Sanjeevani NABL Blood Reserve.
            </p>
          </div>

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
                <label className="text-xs font-bold text-slate-700 block mb-1">Number of Units Needed</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={bloodForm.units}
                  onChange={(e) => setBloodForm({ ...bloodForm, units: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00695C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={bloodForm.patientName}
                  onChange={(e) => setBloodForm({ ...bloodForm, patientName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Requisition Doctor</label>
                <input
                  type="text"
                  required
                  value={bloodForm.doctor}
                  onChange={(e) => setBloodForm({ ...bloodForm, doctor: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl text-xs font-extrabold text-white bg-[#D32F2F] hover:bg-red-700 shadow-md shadow-red-600/20"
            >
              Submit Blood Request
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: BOOK OPD APPOINTMENT */}
      {activeTab === 'appointment' && (
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-[#00695C]" />
              Book OPD Specialist Appointment
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select doctor, department, date, and preferred time slot for consultation at Sector 32 Chandigarh.
            </p>
          </div>

          {appointmentNotice && (
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold">
              {appointmentNotice}
            </div>
          )}

          <form onSubmit={handleAppointmentSubmit} className="space-y-4 max-w-xl">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Patient Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Priya Verma"
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
                  <option>Dr. Anish Mukherjee (Orthopedics)</option>
                  <option>Dr. Smita Deshmukh (General Surgery)</option>
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
