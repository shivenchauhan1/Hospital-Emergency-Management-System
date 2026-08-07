import React, { useState } from 'react';
import { 
  Siren, 
  AlertTriangle, 
  UserCheck, 
  Clock, 
  Stethoscope, 
  CheckCircle2, 
  X, 
  Zap, 
  Activity, 
  ShieldAlert 
} from 'lucide-react';

export default function EmergencyPage({ emergencyCases, doctors, onUpdateEmergencyCase }) {
  const [selectedCase, setSelectedCase] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [assignedDoctor, setAssignedDoctor] = useState('Dr. Rajesh Sharma');
  const [updatedStatus, setUpdatedStatus] = useState('Under Cardiac Resuscitation');

  const handleOpenAssignModal = (caseItem) => {
    setSelectedCase(caseItem);
    setAssignedDoctor(caseItem.doctor || doctors[0]?.name || 'Dr. Rajesh Sharma');
    setIsAssignModalOpen(true);
  };

  const handleOpenStatusModal = (caseItem) => {
    setSelectedCase(caseItem);
    setUpdatedStatus(caseItem.status);
    setIsStatusModalOpen(true);
  };

  const handleOpenViewModal = (caseItem) => {
    setSelectedCase(caseItem);
    setIsViewModalOpen(true);
  };

  const handleSaveDoctor = (e) => {
    e.preventDefault();
    if (!selectedCase) return;
    onUpdateEmergencyCase(selectedCase.id, { doctor: assignedDoctor });
    setIsAssignModalOpen(false);
  };

  const handleSaveStatus = (e) => {
    e.preventDefault();
    if (!selectedCase) return;
    onUpdateEmergencyCase(selectedCase.id, { status: updatedStatus });
    setIsStatusModalOpen(false);
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Red':
        return {
          bg: 'bg-red-50 text-red-700 border-red-200',
          badge: 'bg-[#D32F2F] text-white',
          border: 'border-l-4 border-l-[#D32F2F] border-[#D32F2F]/30',
          label: 'Critical (Red)'
        };
      case 'Orange':
        return {
          bg: 'bg-orange-50 text-orange-700 border-orange-200',
          badge: 'bg-orange-600 text-white',
          border: 'border-l-4 border-l-orange-500 border-orange-200',
          label: 'High (Orange)'
        };
      case 'Yellow':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          badge: 'bg-amber-500 text-slate-950 font-bold',
          border: 'border-l-4 border-l-amber-500 border-amber-200',
          label: 'Medium (Yellow)'
        };
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          badge: 'bg-emerald-600 text-white',
          border: 'border-l-4 border-l-emerald-600 border-emerald-200',
          label: 'Stable (Green)'
        };
    }
  };

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Header Banner */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-red-900/50 shadow-2xl text-white">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-red-600/30 text-red-300 border border-red-500/40 mb-2">
            <Zap className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>Sanjeevani Level 1 Resuscitation & Triage Unit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Siren className="w-8 h-8 text-[#D32F2F] animate-bounce" />
            24x7 Emergency Triage & Active Cases
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Real-time emergency severity triage, cardiac arrest response, stroke protocol, and trauma resuscitation.
          </p>
        </div>

        {/* Priority Color Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-[#D32F2F] text-white shadow-sm">Red = Critical</span>
          <span className="px-2.5 py-1 rounded-lg bg-orange-600 text-white shadow-sm">Orange = High</span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 shadow-sm">Yellow = Medium</span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white shadow-sm">Green = Stable</span>
        </div>
      </div>

      {/* EMERGENCY CASES CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {emergencyCases.map((c) => {
          const style = getPriorityStyle(c.priority);
          return (
            <div
              key={c.id}
              className={`p-6 rounded-3xl bg-white border shadow-sm hover:shadow-md transition-all space-y-4 ${style.border}`}
            >
              {/* Card Top */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400">{c.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-sm ${style.badge}`}>
                  {style.label}
                </span>
              </div>

              {/* Patient & Condition */}
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">{c.patientName}</h3>
                <div className="text-xs font-extrabold text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-100 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{c.emergencyType}</span>
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-2 text-xs text-slate-600 font-medium">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Arrival Time:
                  </span>
                  <span className="font-mono font-bold text-slate-800">{c.arrivalTime}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5 text-[#00695C]" /> Assigned Doctor:
                  </span>
                  <span className="font-extrabold text-slate-900">{c.doctor}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-purple-600" /> Clinical Status:
                  </span>
                  <span className="font-bold text-teal-800">{c.status}</span>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-slate-400">Bed Location:</span>
                  <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{c.bedAssigned}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleOpenAssignModal(c)}
                  className="py-2 px-2 rounded-xl text-[11px] font-extrabold bg-teal-50 text-[#00695C] border border-teal-200 hover:bg-teal-100 transition-colors text-center"
                >
                  Assign Doctor
                </button>

                <button
                  onClick={() => handleOpenStatusModal(c)}
                  className="py-2 px-2 rounded-xl text-[11px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors text-center"
                >
                  Update Status
                </button>

                <button
                  onClick={() => handleOpenViewModal(c)}
                  className="py-2 px-2 rounded-xl text-[11px] font-extrabold bg-[#00695C] text-white hover:bg-teal-800 transition-colors text-center"
                >
                  View Case
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ASSIGN DOCTOR MODAL */}
      {isAssignModalOpen && selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setIsAssignModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Assign Specialist Doctor</h3>
              <p className="text-xs text-slate-500 mt-0.5">Emergency Case: {selectedCase.id} ({selectedCase.patientName})</p>
            </div>

            <form onSubmit={handleSaveDoctor} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Available On-Duty Specialist</label>
                <select
                  value={assignedDoctor}
                  onChange={(e) => setAssignedDoctor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-[#00695C]"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.name}>
                      {d.name} — {d.department} ({d.availability})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#00695C] hover:bg-teal-800"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE STATUS MODAL */}
      {isStatusModalOpen && selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setIsStatusModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Update Resuscitation Status</h3>
              <p className="text-xs text-slate-500 mt-0.5">Emergency Case: {selectedCase.id} ({selectedCase.patientName})</p>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Resuscitation / Treatment Progress</label>
                <select
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-[#00695C]"
                >
                  <option>Under Cardiac Resuscitation</option>
                  <option>Administering Thrombolysis</option>
                  <option>In Emergency OT Surgery</option>
                  <option>Chest Tube Insertion Complete</option>
                  <option>Stabilized & Transferred to ICU</option>
                  <option>Discharged Stable</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#00695C] hover:bg-teal-800"
                >
                  Update Clinical Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {isViewModalOpen && selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                <Siren className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedCase.patientName}</h3>
                <p className="text-xs font-mono font-bold text-red-600">Case ID: {selectedCase.id}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-1">
              <span className="text-[10px] text-red-600 font-bold uppercase">Emergency Diagnosis:</span>
              <div className="text-sm font-black text-red-900">{selectedCase.emergencyType}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs p-4 rounded-2xl bg-slate-50 border border-slate-200 font-medium">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Priority Rating:</span>
                <span className="font-extrabold text-red-600">{selectedCase.priority} ({selectedCase.priorityLabel})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Arrival Timestamp:</span>
                <span className="font-mono font-bold text-slate-800">{selectedCase.arrivalTime}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Attending Specialist:</span>
                <span className="font-extrabold text-slate-900">{selectedCase.doctor}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Bed Location:</span>
                <span className="font-mono font-bold text-slate-800">{selectedCase.bedAssigned}</span>
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#00695C]"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
