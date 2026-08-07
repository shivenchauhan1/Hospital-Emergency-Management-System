import React, { useState } from 'react';
import { 
  Bed, 
  HeartPulse, 
  CheckCircle2, 
  UserCheck, 
  X, 
  SlidersHorizontal, 
  Search 
} from 'lucide-react';

export default function BedsPage({ beds, onToggleBedStatus }) {
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected bed for modal allocation
  const [activeBedModal, setActiveBedModal] = useState(null);

  const filteredBeds = beds.filter((b) => {
    const matchesWard = selectedWard === 'ALL' || b.type === selectedWard;
    const matchesStatus = selectedStatus === 'ALL' || b.status === selectedStatus;
    const matchesSearch = b.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.patientAssigned.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesWard && matchesStatus && matchesSearch;
  });

  const totalBeds = beds.length;
  const occupiedCount = beds.filter(b => b.status === 'Occupied').length;
  const availableCount = beds.filter(b => b.status === 'Available').length;
  const reservedCount = beds.filter(b => b.status === 'Reserved').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <Bed className="w-8 h-8 text-[#0F766E]" />
            Hospital Bed & Ward Management Grid
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real-time bed occupancy matrix across 120 total beds (ICU, Emergency Bays, and General Wards).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
            Available: {availableCount}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-red-100 text-red-800 border border-red-200">
            Occupied: {occupiedCount}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
            Reserved: {reservedCount}
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Bed Number, Ward ID, or Patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0F766E]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0F766E]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Available">Available Only</option>
              <option value="Occupied">Occupied Only</option>
              <option value="Reserved">Reserved Only</option>
            </select>
          </div>
        </div>

        {/* Ward Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {['ALL', 'ICU Bed', 'Emergency Bed', 'General'].map((ward) => (
            <button
              key={ward}
              onClick={() => setSelectedWard(ward)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedWard === ward
                  ? 'bg-[#0F766E] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {ward === 'ALL' ? 'All 120 Beds' : ward}
            </button>
          ))}
        </div>
      </div>

      {/* 120 BEDS GRID LAYOUT */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
        {filteredBeds.map((bed) => {
          const isOccupied = bed.status === 'Occupied';
          const isReserved = bed.status === 'Reserved';

          return (
            <div
              key={bed.id}
              onClick={() => setActiveBedModal(bed)}
              className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer hover:scale-105 shadow-sm space-y-1.5 ${
                isOccupied
                  ? 'bg-red-50/70 border-red-200 text-red-900'
                  : isReserved
                  ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                  : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono font-bold opacity-75">
                <span>{bed.id}</span>
                <span className="truncate max-w-[50px]">{bed.floor}</span>
              </div>

              <div className="py-1">
                <Bed className={`w-6 h-6 mx-auto ${
                  isOccupied ? 'text-red-600' : isReserved ? 'text-amber-600' : 'text-emerald-600'
                }`} />
              </div>

              <div className="text-xs font-black truncate">{bed.bedNumber}</div>

              <div className="text-[10px] font-mono font-bold truncate">
                {isOccupied ? bed.patientAssigned : bed.status}
              </div>
            </div>
          );
        })}
      </div>

      {/* BED ACTION MODAL */}
      {activeBedModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setActiveBedModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center font-bold">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">{activeBedModal.bedNumber}</h3>
                <p className="text-xs font-mono font-bold text-teal-700">{activeBedModal.id} ({activeBedModal.type})</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Current Status:</span>
                <span className="font-extrabold text-slate-900">{activeBedModal.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Location Floor:</span>
                <span className="font-mono text-slate-800">{activeBedModal.floor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Patient Occupant:</span>
                <span className="font-extrabold text-teal-800">{activeBedModal.patientAssigned}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 block">Update Bed Occupancy Status:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    onToggleBedStatus(activeBedModal.id, 'Available', 'None');
                    setActiveBedModal(null);
                  }}
                  className="py-2 px-3 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                >
                  Set Available
                </button>
                <button
                  onClick={() => {
                    onToggleBedStatus(activeBedModal.id, 'Occupied', 'Patient Intake');
                    setActiveBedModal(null);
                  }}
                  className="py-2 px-3 rounded-xl text-xs font-bold bg-red-100 text-red-800 hover:bg-red-200"
                >
                  Set Occupied
                </button>
                <button
                  onClick={() => {
                    onToggleBedStatus(activeBedModal.id, 'Reserved', 'On Hold');
                    setActiveBedModal(null);
                  }}
                  className="py-2 px-3 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 hover:bg-amber-200"
                >
                  Set Reserved
                </button>
              </div>
            </div>

            <div className="text-right pt-2">
              <button
                onClick={() => setActiveBedModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
