import React, { useState } from 'react';
import { 
  ShieldCheck, Siren, Stethoscope, Bed, Truck, Droplet, Download, 
  Search, Check, CheckCircle2 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { HOSPITAL_INFO, INITIAL_DOCTORS, INITIAL_EMERGENCY_CASES, INITIAL_AMBULANCES, INITIAL_BEDS } from './data/hospitalStore';

export default function App() {
  const [staffRole, setStaffRole] = useState('Admin');
  const [emergencyCases, setEmergencyCases] = useState(INITIAL_EMERGENCY_CASES);
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [ambulances, setAmbulances] = useState(INITIAL_AMBULANCES);
  const [beds, setBeds] = useState(INITIAL_BEDS);
  const [downloadNotice, setDownloadNotice] = useState('');

  const analyticsData = [
    { name: 'Mon', emergency: 32 },
    { name: 'Tue', emergency: 38 },
    { name: 'Wed', emergency: 41 },
    { name: 'Thu', emergency: 34 },
    { name: 'Fri', emergency: 46 },
    { name: 'Sat', emergency: 52 },
    { name: 'Sun', emergency: 34 }
  ];

  const handleApprove = (id) => {
    setEmergencyCases(emergencyCases.map(c => c.id === id ? { ...c, status: 'Approved' } : c));
  };

  const handleAssignDoctor = (id, doctorName) => {
    setEmergencyCases(emergencyCases.map(c => c.id === id ? { ...c, doctor: doctorName, assignedDoctor: doctorName, status: 'Doctor Assigned' } : c));
  };

  const handleDispatchAmbulance = (id, ambulanceNumber) => {
    setEmergencyCases(emergencyCases.map(c => c.id === id ? { ...c, ambulance: ambulanceNumber, ambulanceDispatched: ambulanceNumber, status: 'Ambulance Dispatched' } : c));
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Header Bar */}
      <div className="w-full bg-[#0F172A] text-white p-6 shadow-md">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00695C] flex items-center justify-center font-bold text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black">Sanjeevani Staff Operations Portal</h1>
              <p className="text-xs text-teal-300 font-mono">Role-Based Control (RBAC) Active</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Staff Role:</span>
            <select
              value={staffRole}
              onChange={(e) => setStaffRole(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-extrabold text-teal-300 focus:outline-none"
            >
              <option value="Admin">Admin</option>
              <option value="Doctor">Doctor</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Blood Bank">Blood Bank Staff</option>
              <option value="Ambulance Staff">Ambulance Coordinator</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 w-full">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm"><span className="text-[10px] text-slate-400 font-bold block">PATIENTS</span><div className="text-2xl font-black">127</div></div>
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 shadow-sm"><span className="text-[10px] font-bold block">PENDING</span><div className="text-2xl font-black">{emergencyCases.filter(c => c.status === 'Pending').length}</div></div>
          <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-red-900 shadow-sm"><span className="text-[10px] font-bold block">EMERGENCY</span><div className="text-2xl font-black">{emergencyCases.length}</div></div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm"><span className="text-[10px] text-slate-400 font-bold block">DOCTORS</span><div className="text-2xl font-black">58</div></div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm"><span className="text-[10px] text-slate-400 font-bold block">ICU BEDS</span><div className="text-2xl font-black">22 / 50</div></div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm"><span className="text-[10px] text-slate-400 font-bold block">BLOOD UNITS</span><div className="text-2xl font-black">320</div></div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm"><span className="text-[10px] text-slate-400 font-bold block">AMBULANCES</span><div className="text-2xl font-black">11</div></div>
        </div>

        {/* Analytics Chart */}
        <div className="w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900">Weekly Patient Resuscitation Trends</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip />
                <Bar dataKey="emergency" fill="#00695C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emergency Queue Table */}
        <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900">Emergency Queue & Control Table</h3>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse font-sans min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase">
                  <th className="p-3">Emergency ID</th>
                  <th className="p-3">Patient Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {emergencyCases.map((req) => (
                  <tr key={req.id}>
                    <td className="p-3 font-mono font-bold text-[#00695C]">{req.id}</td>
                    <td className="p-3 font-extrabold text-slate-900">{req.patientName || req.patient}</td>
                    <td className="p-3 font-bold text-red-700">{req.emergencyType}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">{req.priority}</span></td>
                    <td className="p-3 font-bold text-teal-800">{req.status}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {req.status === 'Pending' && (
                          <button onClick={() => handleApprove(req.id)} className="px-2.5 py-1 text-xs font-bold bg-emerald-600 text-white rounded">Approve</button>
                        )}
                        <button onClick={() => handleAssignDoctor(req.id, 'Dr. Rajesh Sharma')} className="px-2.5 py-1 text-xs font-bold bg-teal-50 text-[#00695C] border border-teal-200 rounded">Assign Doctor</button>
                        <button onClick={() => handleDispatchAmbulance(req.id, 'PB01AB1234')} className="px-2.5 py-1 text-xs font-bold bg-red-50 text-red-700 border border-red-200 rounded">Dispatch 108</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <footer className="w-full bg-[#0F172A] text-slate-400 text-xs py-6 text-center border-t border-slate-800">
        <p>© 2026 Sanjeevani Multispeciality Hospital. Staff Portal.</p>
      </footer>
    </div>
  );
}
