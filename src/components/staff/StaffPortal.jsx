import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Users, 
  Siren, 
  Stethoscope, 
  Bed, 
  Truck, 
  Droplet, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  Send, 
  Clock, 
  FileText, 
  BarChart3, 
  SlidersHorizontal, 
  AlertTriangle, 
  PlusCircle, 
  Check, 
  Search, 
  Download, 
  Bell, 
  Calendar, 
  TrendingUp 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line 
} from 'recharts';
import { HOSPITAL_INFO, DAILY_ADMISSIONS_TREND } from '../../data/hospitalStore';

export default function StaffPortal({ 
  emergencyRequests, 
  onApproveEmergencyRequest, 
  onAssignDoctor, 
  onDispatchAmbulance, 
  doctors, 
  ambulances, 
  beds, 
  onToggleBedStatus, 
  bloodBank, 
  onRequestBlood 
}) {
  const [staffRole, setStaffRole] = useState('Admin');
  const [activeConsole, setActiveConsole] = useState('emergency-console');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe, setTimeframe] = useState('Weekly');
  const [downloadNotice, setDownloadNotice] = useState('');

  // Analytics Data
  const weeklyAnalytics = [
    { name: 'Mon', emergency: 32, admissions: 112 },
    { name: 'Tue', emergency: 38, admissions: 124 },
    { name: 'Wed', emergency: 41, admissions: 135 },
    { name: 'Thu', emergency: 34, admissions: 128 },
    { name: 'Fri', emergency: 46, admissions: 142 },
    { name: 'Sat', emergency: 52, admissions: 150 },
    { name: 'Sun', emergency: 34, admissions: 127 }
  ];

  const pendingApprovalsCount = emergencyRequests.filter(r => r.status === 'Pending' || r.status === 'Pending Review').length;

  const handleDownloadPDF = () => {
    setDownloadNotice('Generating Sanjeevani Staff Operations Audit PDF...');
    setTimeout(() => {
      setDownloadNotice('✅ PDF Clinical Audit Report Downloaded!');
      setTimeout(() => setDownloadNotice(''), 3000);
    }, 1200);
  };

  const handleDownloadExcel = () => {
    setDownloadNotice('Exporting HEMS Emergency & Bed Matrix to Excel (.xlsx)...');
    setTimeout(() => {
      setDownloadNotice('✅ Excel Operations Export Downloaded!');
      setTimeout(() => setDownloadNotice(''), 3000);
    }, 1200);
  };

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Staff Header Bar with RBAC Role Selector & Search */}
      <div className="w-full bg-[#0F172A] text-white rounded-3xl p-6 flex items-center justify-between gap-4 flex-wrap shadow-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00695C] flex items-center justify-center font-bold text-white shadow-md">
            <ShieldCheck className="w-6 h-6 text-teal-300" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Sanjeevani Internal Staff Operations Portal</h3>
            <p className="text-xs text-teal-300 font-mono">Role-Based Access Control (RBAC) Enabled</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Live Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search patients, doctors, ER ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#00695C] w-48 sm:w-60"
            />
          </div>

          {/* Role Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 hidden sm:inline">Role:</span>
            <select
              value={staffRole}
              onChange={(e) => setStaffRole(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-extrabold text-teal-300 focus:outline-none focus:border-[#00695C]"
            >
              <option value="Admin">Admin (Full Control)</option>
              <option value="Doctor">Doctor Consultant</option>
              <option value="Receptionist">Emergency Receptionist</option>
              <option value="Blood Bank">Blood Bank Staff</option>
              <option value="Ambulance Staff">108 Ambulance Staff</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Dashboard Metrics (Today's Patients, Pending, ER, Doctors, Beds, Ambulances) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 w-full">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Today's Patients</span>
          <div className="text-2xl font-black text-slate-900">127</div>
          <span className="text-[10px] text-emerald-600 font-bold">Active Intake</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-200 bg-amber-50/40 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-amber-800 uppercase block">Pending Requests</span>
          <div className="text-2xl font-black text-amber-800">{pendingApprovalsCount}</div>
          <span className="text-[10px] text-amber-700 font-bold">Requires Review</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-red-200 bg-red-50/40 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-red-700 uppercase block">Emergency Cases</span>
          <div className="text-2xl font-black text-red-700">{emergencyRequests.length}</div>
          <span className="text-[10px] text-red-600 font-bold">Resuscitation</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Available Doctors</span>
          <div className="text-2xl font-black text-slate-900">58</div>
          <span className="text-[10px] text-emerald-600 font-bold">On Active Shift</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Beds Free</span>
          <div className="text-2xl font-black text-slate-900">22 / 50</div>
          <span className="text-[10px] text-purple-600 font-bold">ICU Beds Ready</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Blood Units</span>
          <div className="text-2xl font-black text-slate-900">320</div>
          <span className="text-[10px] text-red-600 font-bold">NABL Stock</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">108 Ambulances</span>
          <div className="text-2xl font-black text-slate-900">11</div>
          <span className="text-[10px] text-indigo-600 font-bold">Fleet Ready</span>
        </div>
      </div>

      {/* RECHARTS DASHBOARD ANALYTICS (Weekly, Monthly, Yearly) */}
      <div className="w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#00695C]" />
              Staff Analytics & Patient Intake Trends
            </h3>
            <p className="text-xs text-slate-500">Live operational data visualization for Sanjeevani Multispeciality Hospital.</p>
          </div>

          <div className="flex items-center gap-2">
            {['Weekly', 'Monthly', 'Yearly'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold ${
                  timeframe === t ? 'bg-[#00695C] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyAnalytics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff' }} />
              <Bar dataKey="emergency" name="Emergency Resuscitation" fill="#D32F2F" radius={[6, 6, 0, 0]} />
              <Bar dataKey="admissions" name="General Admissions" fill="#00695C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DOWNLOAD PDF / EXCEL REPORT BUTTONS */}
      <div className="w-full flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-xs font-bold text-slate-700">Export Clinical Operations Audit Reports:</div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 rounded-xl text-xs font-extrabold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>Download PDF Report</span>
          </button>
          <button
            onClick={handleDownloadExcel}
            className="px-4 py-2 rounded-xl text-xs font-extrabold bg-[#00695C] text-white hover:bg-teal-800 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {downloadNotice && (
        <div className="w-full p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold text-center animate-fade-in">
          {downloadNotice}
        </div>
      )}

      {/* Staff Consoles Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 border-b border-slate-200 w-full">
        <button
          onClick={() => setActiveConsole('emergency-console')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeConsole === 'emergency-console'
              ? 'bg-[#00695C] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Siren className="w-4 h-4" />
          <span>Emergency Queue ({pendingApprovalsCount})</span>
        </button>

        <button
          onClick={() => setActiveConsole('doctors-console')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeConsole === 'doctors-console'
              ? 'bg-[#00695C] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Doctor Panel</span>
        </button>

        <button
          onClick={() => setActiveConsole('beds-console')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeConsole === 'beds-console'
              ? 'bg-[#00695C] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Bed className="w-4 h-4" />
          <span>Bed Management (ICU / Wards)</span>
        </button>

        <button
          onClick={() => setActiveConsole('ambulance-console')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeConsole === 'ambulance-console'
              ? 'bg-[#00695C] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>108 Ambulance Dispatch</span>
        </button>

        <button
          onClick={() => setActiveConsole('blood-console')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeConsole === 'blood-console'
              ? 'bg-[#00695C] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Droplet className="w-4 h-4" />
          <span>Blood Requisitions</span>
        </button>
      </div>

      {/* CONSOLE 1: EMERGENCY QUEUE (ER20260012, Rahul Sharma, Accident, Critical, Pending) */}
      {activeConsole === 'emergency-console' && (
        <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900">Emergency Queue & Staff Approvals</h3>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse font-sans min-w-[850px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase">
                  <th className="p-4">Emergency ID</th>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Emergency Type</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Assigned Doctor</th>
                  <th className="p-4 text-center">Staff Control Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {emergencyRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50">
                    <td className="p-4 font-mono font-bold text-[#00695C]">{req.id}</td>
                    <td className="p-4 font-extrabold text-slate-900">{req.patientName || req.patient}</td>
                    <td className="p-4 font-bold text-red-700 bg-red-50 px-2 py-1 rounded border border-red-100">{req.emergencyType}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-red-600 text-white">
                        {req.priority || req.emergencyLevel || 'Critical'}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-teal-800">{req.status}</td>
                    <td className="p-4 text-slate-700 font-semibold">{req.assignedDoctor || req.doctor || 'Unassigned'}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {req.status === 'Pending' || req.status === 'Pending Review' ? (
                          <>
                            <button
                              onClick={() => onApproveEmergencyRequest(req.id)}
                              className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onApproveEmergencyRequest(req.id)}
                              className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-200 text-slate-700 hover:bg-slate-300"
                            >
                              Reject
                            </button>
                          </>
                        ) : null}

                        <button
                          onClick={() => onAssignDoctor(req.id, 'Dr. Rajesh Sharma')}
                          className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-teal-50 text-[#00695C] border border-teal-200 hover:bg-teal-100"
                        >
                          Assign Dr. Sharma
                        </button>

                        <button
                          onClick={() => onDispatchAmbulance(req.id, 'PB01AB1234')}
                          className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                        >
                          Dispatch 108
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONSOLE 2: DOCTOR PANEL */}
      {activeConsole === 'doctors-console' && (
        <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900">Consultant Doctor Panel & Today's Schedule</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((d) => (
              <div key={d.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-slate-900 text-xs">{d.name}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {d.availability || 'Available'}
                  </span>
                </div>
                <div className="text-[11px] text-[#00695C] font-bold">{d.department}</div>
                <div className="text-[10px] text-slate-500 font-mono">Specialization: {d.specialization}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONSOLE 3: BED MANAGEMENT */}
      {activeConsole === 'beds-console' && (
        <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900">Bed Allocation Matrix (ICU, Emergency, General)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {beds.slice(0, 30).map((b) => (
              <div key={b.id} className={`p-3 rounded-2xl border text-center font-mono text-xs ${
                b.status === 'Occupied' ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <div className="font-extrabold">{b.bedNumber}</div>
                <div className="text-[10px] font-bold">{b.status}</div>
                <div className="pt-1 flex justify-center gap-1">
                  <button onClick={() => onToggleBedStatus(b.id, 'Available', 'None')} className="px-2 py-0.5 text-[9px] bg-emerald-600 text-white rounded font-bold">Release</button>
                  <button onClick={() => onToggleBedStatus(b.id, 'Occupied', 'Rahul Sharma')} className="px-2 py-0.5 text-[9px] bg-red-600 text-white rounded font-bold">Allocate</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONSOLE 4: AMBULANCE DISPATCH (PB01AB1234) */}
      {activeConsole === 'ambulance-console' && (
        <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900">108 Emergency Ambulance Dispatch Fleet</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ambulances.map((a) => (
              <div key={a.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-black text-slate-900 text-sm">{a.number}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">{a.status}</span>
                </div>
                <div className="text-slate-600 font-medium">Driver: {a.driver}</div>
                <div className="text-slate-500 font-mono">Location: {a.location}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONSOLE 5: BLOOD REQUISITIONS */}
      {activeConsole === 'blood-console' && (
        <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900">Sanjeevani NABL Blood Reserve Requisitions</h3>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase">
                  <th className="p-3">Blood Group</th>
                  <th className="p-3">Stock Units</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bloodBank.map((b) => (
                  <tr key={b.id}>
                    <td className="p-3 font-black text-base text-[#00695C]">{b.group}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{b.units} Units</td>
                    <td className="p-3"><span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${b.color}`}>{b.status}</span></td>
                    <td className="p-3 text-center">
                      <button onClick={() => onRequestBlood(b.group, -5)} className="px-3 py-1 bg-teal-50 text-[#00695C] border border-teal-200 rounded-lg font-bold">
                        + Add 5 Units
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
