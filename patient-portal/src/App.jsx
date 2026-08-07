import React, { useState } from 'react';
import { 
  HeartPulse, Siren, Stethoscope, Droplet, Clock, FileText, Search, 
  Upload, QrCode, Bell, Download, CheckCircle2, Lock 
} from 'lucide-react';
import { HOSPITAL_INFO, INITIAL_DOCTORS, INITIAL_EMERGENCY_CASES } from './data/hospitalStore';

export default function App() {
  const [activeTab, setActiveTab] = useState('emergency-register');
  const [emergencyRequests, setEmergencyRequests] = useState(INITIAL_EMERGENCY_CASES);
  const [showQR, setShowQR] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [emergencyForm, setEmergencyForm] = useState({
    patientName: 'Rahul Sharma',
    age: '42',
    gender: 'Male',
    phone: '9876543210',
    emergencyType: 'Accident',
    address: 'Sector 32, Chandigarh',
    description: 'Collision trauma near Tribune Chowk',
    priority: 'Critical'
  });

  const [createdNotice, setCreatedNotice] = useState(null);

  const handleEmergencySubmit = (e) => {
    e.preventDefault();
    const requestId = `ER202600${10 + emergencyRequests.length + 1}`;
    const newCase = {
      id: requestId,
      patient: emergencyForm.patientName,
      patientName: emergencyForm.patientName,
      phone: emergencyForm.phone,
      emergencyType: emergencyForm.emergencyType,
      priority: emergencyForm.priority,
      status: 'Pending',
      doctor: null,
      assignedDoctor: 'Unassigned',
      ambulance: null,
      ambulanceDispatched: 'None',
      address: emergencyForm.address,
      description: emergencyForm.description,
      createdAt: new Date().toISOString()
    };

    setEmergencyRequests([newCase, ...emergencyRequests]);
    setCreatedNotice({
      id: requestId,
      message: "Your request has been sent successfully. Hospital staff will review your request shortly."
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Top Green Emergency Strip */}
      <div className="w-full bg-[#00695C] text-white py-2 px-4 text-xs font-bold text-center">
        🚑 Emergency Helpline: {HOSPITAL_INFO.emergencyHelpline} | 📞 Ambulance: {HOSPITAL_INFO.ambulanceNumber} | 🩺 {HOSPITAL_INFO.accreditation}
      </div>

      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        {/* Welcome Header */}
        <div className="w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>Welcome,</span>
              <span className="text-[#00695C] underline decoration-teal-400">Rahul Sharma</span> 👋
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Patient ID: <span className="font-mono font-bold text-slate-800">SAN-2026-8842</span> | Sanjeevani Public Website
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowQR(!showQR)}
              className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-[#00695C] hover:bg-teal-100 transition-colors flex items-center gap-1.5 text-xs font-extrabold"
            >
              <QrCode className="w-4 h-4" />
              <span>Patient Health QR</span>
            </button>
          </div>
        </div>

        {/* QR Code Modal */}
        {showQR && (
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4 max-w-sm mx-auto text-center animate-fade-in">
            <h3 className="text-lg font-black">Digital Patient Health ID</h3>
            <div className="p-4 bg-white rounded-2xl inline-block">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SANJEEVANI-PATIENT-RAHUL-SHARMA-ID-SAN-2026-8842" 
                alt="Patient QR Code" 
                className="w-36 h-36 mx-auto"
              />
            </div>
            <div className="font-mono text-xs text-teal-300 font-bold">SAN-2026-8842</div>
            <button onClick={() => setShowQR(false)} className="w-full py-2 rounded-xl bg-slate-800 text-xs font-bold">Close</button>
          </div>
        )}

        {/* Emergency Registration Card */}
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-800 mb-2">
                <Siren className="w-4 h-4 text-red-600 animate-pulse" />
                <span>24x7 Immediate Triage Registration</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">EMERGENCY CASE REGISTRATION</h2>
            </div>
          </div>

          {createdNotice && (
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-1">
              <h3 className="text-base font-black text-[#00695C]">{createdNotice.message}</h3>
              <div className="text-xs font-mono font-bold text-slate-700">Request ID: <span className="text-red-600">{createdNotice.id}</span> | Status: <span className="bg-amber-100 px-2 py-0.5 rounded text-amber-800">Pending</span></div>
            </div>
          )}

          <form onSubmit={handleEmergencySubmit} className="space-y-4">
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
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone *</label>
                <input
                  type="text"
                  required
                  value={emergencyForm.phone}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Priority *</label>
                <select
                  value={emergencyForm.priority}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, priority: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-[#00695C]"
                >
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
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

            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-black text-sm text-white bg-[#D32F2F] hover:bg-red-700 shadow-xl shadow-red-600/25 transition-all flex items-center justify-center gap-2"
            >
              <Siren className="w-5 h-5 animate-bounce" />
              <span>Submit Emergency Request</span>
            </button>
          </form>
        </div>

        {/* Emergency Tracker */}
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#00695C]" /> Track Emergency Request Live Stages
          </h3>

          <div className="space-y-4">
            {emergencyRequests.map((req) => (
              <div key={req.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <span className="font-mono font-bold text-[#00695C] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">{req.id}</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">{req.status}</span>
                </div>
                <div className="text-sm font-black text-slate-900">{req.patientName || req.patient} — {req.emergencyType} ({req.priority})</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-semibold text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                  <div>Doctor: {req.assignedDoctor || req.doctor || 'Unassigned'}</div>
                  <div>Ambulance: {req.ambulanceDispatched || req.ambulance || 'None'}</div>
                  <div>Location: Sector 32 Chandigarh</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#0F172A] text-slate-400 text-xs py-6 border-t border-slate-800 text-center">
        <p>© 2026 Sanjeevani Multispeciality Hospital (Sector 32, Chandigarh). All Rights Reserved.</p>
      </footer>
    </div>
  );
}
