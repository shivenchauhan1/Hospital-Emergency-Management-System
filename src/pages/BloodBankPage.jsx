import React, { useState } from 'react';
import { 
  Droplet, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  X, 
  ShieldAlert, 
  PlusCircle 
} from 'lucide-react';

export default function BloodBankPage({ bloodBank, onRequestBlood }) {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('O-');
  const [requestedUnits, setRequestedUnits] = useState('2');
  const [requesterName, setRequesterName] = useState('Dr. Gregory House');
  const [patientId, setPatientId] = useState('P-1001');

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    onRequestBlood(selectedGroup, parseInt(requestedUnits, 10));
    setIsRequestModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-red-900/50 shadow-2xl text-white">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Droplet className="w-8 h-8 text-red-500 fill-red-500 animate-pulse" />
            Blood Bank & Transfusion Reserve
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Real-time inventory tracking for all 8 blood groups (A+, A-, B+, B-, AB+, AB-, O+, O-) with automated minimum threshold warnings.
          </p>
        </div>

        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="px-5 py-3 rounded-2xl font-black text-xs sm:text-sm bg-[#DC2626] hover:bg-red-700 text-white shadow-xl shadow-red-600/30 transition-all flex items-center gap-2 active:scale-95"
        >
          <Send className="w-4 h-4" />
          <span>Request Blood Units</span>
        </button>
      </div>

      {/* BLOOD GROUP INVENTORY TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900">Blood Inventory Stock Level</h3>
          <span className="text-xs font-mono font-bold text-slate-500">Updated Real-Time</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider">
                <th className="p-4">Blood Group</th>
                <th className="p-4">Units Available</th>
                <th className="p-4">Minimum Threshold Required</th>
                <th className="p-4">Reserve Status</th>
                <th className="p-4 text-center">Emergency Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bloodBank.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="inline-flex items-center gap-2 font-black text-base text-slate-900 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 font-mono">
                      <Droplet className="w-4 h-4 text-red-600 fill-red-600" />
                      {item.group}
                    </div>
                  </td>
                  <td className="p-4 font-mono font-black text-base text-slate-900">{item.units} Units</td>
                  <td className="p-4 font-mono font-bold text-slate-500">{item.minRequired} Units</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${item.color}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedGroup(item.group);
                        setIsRequestModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-extrabold bg-slate-100 text-slate-800 hover:bg-[#0F766E] hover:text-white transition-colors shadow-sm"
                    >
                      Request {item.group}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REQUEST BLOOD MODAL */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setIsRequestModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Emergency Transfusion Blood Request</h3>
              <p className="text-xs text-slate-500 mt-0.5">Submit immediate blood requisition to St. Jude Blood Reserve.</p>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Blood Group</label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-black text-slate-900 focus:outline-none focus:border-[#0F766E]"
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
                <label className="text-xs font-bold text-slate-700 block mb-1">Number of Blood Units Needed</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={requestedUnits}
                  onChange={(e) => setRequestedUnits(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Patient ID / Medical Record</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. P-1001"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Requisition Physician</label>
                <input
                  type="text"
                  required
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#DC2626] hover:bg-red-700 shadow-md shadow-red-600/20"
                >
                  Confirm Transfusion Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
