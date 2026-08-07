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
  Check 
} from 'lucide-react';
import { HOSPITAL_INFO } from '../../data/hospitalStore';

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
  const [selectedCase, setSelectedCase] = useState(null);

  // Stats
  const pendingApprovalsCount = emergencyRequests.filter(r => r.status === 'Pending Review').length;

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Staff Role Switcher Bar */}
      <div className="w-full bg-[#0F172A] text-white rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00695C] flex items-center justify-center font-bold text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Sanjeevani Internal Staff Operations Portal</h3>
            <p className="text-[11px] text-teal-300 font-mono">Role-Based Access Control (RBAC) Active</p>
          </div>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 hidden sm:inline">Active Staff Role:</span>
          <select
            value={staffRole}
            onChange={(e) => setStaffRole(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-extrabold text-teal-300 focus:outline-none focus:border-[#00695C]"
          >
            <option value="Admin">Admin (Full Control)</option>
            <option value="Doctor">Doctor Consultant</option>
            <option value="Receptionist">Emergency Receptionist</option>
            <option value="Blood Bank Staff">Blood Bank Technician</option>
            <option value="Ambulance Coordinator">108 Dispatch Coordinator</option>
          </select>
        </div>
      </div>

      {/* Staff Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 w-full">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Today's Patients</span>
          <div className="text-2xl font-black text-slate-900">127</div>
          <span className="text-[10px] text-emerald-600 font-bold">Active Intake</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-red-200 bg-red-50/40 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-red-700 uppercase block">Emergency Cases</span>
          <div className="text-2xl font-black text-red-700">{emergencyRequests.length}</div>
          <span className="text-[10px] text-red-600 font-bold">Resuscitation</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-200 bg-amber-50/40 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-amber-800 uppercase block">Pending Approvals</span>
          <div className="text-2xl font-black text-amber-800">{pendingApprovalsCount}</div>
          <span className="text-[10px] text-amber-700 font-bold">Requires Action</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Doctors Ready</span>
          <div className="text-2xl font-black text-slate-900">58</div>
          <span className="text-[10px] text-emerald-600 font-bold">On Active Duty</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">ICU Beds Free</span>
          <div className="text-2xl font-black text-slate-900">22 / 50</div>
          <span className="text-[10px] text-purple-600 font-bold">Critical Care</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">108 Ambulances</span>
          <div className="text-2xl font-black text-slate-900">11</div>
          <span className="text-[10px] text-indigo-600 font-bold">Fleet Ready</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Blood Units</span>
          <div className="text-2xl font-black text-slate-900">320</div>
          <span className="text-[10px] text-red-600 font-bold">NABL Stock</span>
        </div>
      </div>

      {/* Staff Action Consoles Navigation */}
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
          <span>Emergency Approval Console ({pendingApprovalsCount})</span>
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
          <span>Doctor Shift & Assignment</span>
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
          <span>Bed & ICU Allocation</span>
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
          <span>108 Ambulance Dispatch Fleet</span>
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
          <span>Blood Bank Approvals</span>
        </button>
      </div>

      {/* CONSOLE 1: EMERGENCY APPROVAL & DOCTOR/AMBULANCE DISPATCH TABLE */}
      {activeConsole === 'emergency-console' && (
        <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Emergency Requests Management Table</h3>
              <p className="text-xs text-slate-500">Approve patient emergency requests, assign specialist doctors, and authorize 108 ambulance dispatch.</p>
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse font-sans min-w-[850px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider">
                  <th className="p-4">Emergency ID</th>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Emergency Type</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4">Assigned Doctor</th>
                  <th className="p-4 text-center">Staff Control Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {emergencyRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#00695C]">{req.id}</td>
                    <td className="p-4 font-extrabold text-slate-900">{req.patientName}</td>
                    <td className="p-4 font-bold text-red-700 bg-red-50 px-2 py-1 rounded border border-red-100">{req.emergencyType}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        req.emergencyLevel === 'Critical' || req.priority === 'Red' ? 'bg-red-600 text-white' :
                        req.emergencyLevel === 'High' || req.priority === 'Orange' ? 'bg-orange-600 text-white' :
                        'bg-amber-500 text-slate-950 font-bold'
                      }`}>
                        {req.emergencyLevel || req.priorityLabel || 'Critical'}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-teal-800">{req.status}</td>
                    <td className="p-4 text-slate-700 font-semibold">{req.assignedDoctor || 'Unassigned'}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {req.status === 'Pending Review' && (
                          <button
                            onClick={() => onApproveEmergencyRequest(req.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                        )}

                        <button
                          onClick={() => onAssignDoctor(req.id, 'Dr. Rajesh Sharma')}
                          className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-teal-50 text-[#00695C] border border-teal-200 hover:bg-teal-100 transition-colors"
                        >
                          Assign Dr. Sharma
                        </button>

                        <button
                          onClick={() => onDispatchAmbulance(req.id, 'PB01AB1234')}
                          className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
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

      {/* CONSOLE 2: BED ALLOCATION CONSOLE */}
      {activeConsole === 'beds-console' && (
        <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900">Bed Allocation & Release Matrix (170 Beds)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {beds.slice(0, 36).map((bed) => (
              <div
                key={bed.id}
                className={`p-3 rounded-2xl border text-center font-mono text-xs space-y-1 ${
                  bed.status === 'Occupied' ? 'bg-red-50 border-red-200 text-red-900' :
                  bed.status === 'Reserved' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                  'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
              >
                <div className="font-extrabold">{bed.bedNumber}</div>
                <div className="text-[10px] font-bold">{bed.status}</div>
                <div className="pt-1 flex justify-center gap-1">
                  <button
                    onClick={() => onToggleBedStatus(bed.id, 'Available', 'None')}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white"
                  >
                    Release
                  </button>
                  <button
                    onClick={() => onToggleBedStatus(bed.id, 'Occupied', 'Rahul Sharma')}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white"
                  >
                    Allocate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONSOLE 3: BLOOD BANK APPROVALS */}
      {activeConsole === 'blood-console' && (
        <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900">NABL Blood Requisition Approvals</h3>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse font-sans min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider">
                  <th className="p-3">Blood Group</th>
                  <th className="p-3">Units In Stock</th>
                  <th className="p-3">Min Required</th>
                  <th className="p-3">Reserve Status</th>
                  <th className="p-3 text-center">Staff Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bloodBank.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="p-3 font-black text-base text-[#00695C]">{b.group}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{b.units} Units</td>
                    <td className="p-3 font-mono text-slate-500">{b.minRequired} Units</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${b.color}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onRequestBlood(b.group, -5)}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-teal-50 text-[#00695C] border border-teal-200"
                      >
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

      {/* CONSOLE 4: DOCTOR ASSIGNMENT */}
      {activeConsole === 'doctors-console' && (
        <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900">Specialist Doctor Shift & Availability Roster</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((d) => (
              <div key={d.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">{d.name}</h4>
                  <p className="text-[11px] text-[#00695C] font-bold">{d.department}</p>
                  <span className="text-[10px] font-mono text-slate-500">{d.availability}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  On Duty
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONSOLE 5: 108 AMBULANCE FLEET */}
      {activeConsole === 'ambulance-console' && (
        <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900">108 Emergency Ambulance Dispatch Fleet</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ambulances.map((a) => (
              <div key={a.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-black text-slate-900 text-sm">{a.number}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-teal-100 text-teal-800">{a.status}</span>
                </div>
                <div className="text-slate-600 font-medium">Driver: {a.driver}</div>
                <div className="text-slate-500 font-mono text-[11px]">Location: {a.location}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
