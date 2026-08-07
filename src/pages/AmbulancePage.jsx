import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  Navigation, 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  X, 
  Send 
} from 'lucide-react';

export default function AmbulancePage({ ambulances, onUpdateAmbulanceStatus }) {
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [dispatchLocation, setDispatchLocation] = useState('');

  const handleOpenDispatchModal = (amb) => {
    setSelectedAmbulance(amb);
    setDispatchLocation('Downtown Sector 7 Emergency Call');
    setIsDispatchModalOpen(true);
  };

  const handleOpenTrackModal = (amb) => {
    setSelectedAmbulance(amb);
    setIsTrackModalOpen(false); // reset
    setIsTrackModalOpen(true);
  };

  const handleDispatchSubmit = (e) => {
    e.preventDefault();
    if (!selectedAmbulance) return;
    onUpdateAmbulanceStatus(selectedAmbulance.id, 'On Duty', dispatchLocation);
    setIsDispatchModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <Truck className="w-8 h-8 text-[#0F766E]" />
            Mobile ICU & Ambulance Dispatch Fleet
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real-time ambulance dispatching, paramedic GPS tracking, and mobile resuscitation unit status.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono font-bold">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            {ambulances.filter(a => a.status === 'Available').length} Ready for Dispatch
          </span>
        </div>
      </div>

      {/* AMBULANCE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ambulances.map((amb) => (
          <div
            key={amb.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{amb.number}</h3>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">{amb.type}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                  amb.status === 'Available' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                  amb.status === 'On Duty' ? 'bg-red-100 text-red-800 border border-red-200 animate-pulse' :
                  'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {amb.status}
                </span>
              </div>

              {/* Driver & Location */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">Driver Paramedic:</span>
                  <span className="font-extrabold text-slate-900">{amb.driver}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">Current GPS Location:</span>
                  <span className="font-mono font-bold text-teal-800 truncate max-w-[170px]">{amb.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">ETA to Base:</span>
                  <span className="font-mono font-bold text-slate-800">{amb.ETA}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                disabled={amb.status === 'Maintenance'}
                onClick={() => handleOpenDispatchModal(amb)}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5 ${
                  amb.status === 'Maintenance'
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-[#0F766E] text-white hover:bg-teal-800 shadow-sm'
                }`}
              >
                <Send className="w-3.5 h-3.5" /> Dispatch
              </button>

              <button
                onClick={() => handleOpenTrackModal(amb)}
                className="py-2 px-3 rounded-xl text-xs font-extrabold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-teal-600" /> Live GPS
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DISPATCH MODAL */}
      {isDispatchModalOpen && selectedAmbulance && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setIsDispatchModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Dispatch Ambulance ({selectedAmbulance.number})</h3>
              <p className="text-xs text-slate-500 mt-0.5">Driver: {selectedAmbulance.driver} ({selectedAmbulance.type})</p>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Emergency Scene Destination Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 742 Evergreen Terrace, Sector 4"
                  value={dispatchLocation}
                  onChange={(e) => setDispatchLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#DC2626] hover:bg-red-700 shadow-md shadow-red-600/20"
                >
                  Authorize Siren Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TRACK MODAL */}
      {isTrackModalOpen && selectedAmbulance && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setIsTrackModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center font-bold">
                <Navigation className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Live GPS Fleet Radar</h3>
                <p className="text-xs font-mono font-bold text-teal-700">Ambulance: {selectedAmbulance.number}</p>
              </div>
            </div>

            {/* Map Preview Simulation */}
            <div className="h-48 bg-slate-900 rounded-2xl border border-slate-800 p-4 relative overflow-hidden flex flex-col justify-between text-white">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-950/40 via-slate-900 to-slate-950 pointer-events-none" />
              <div className="flex items-center justify-between text-xs relative z-10 font-mono">
                <span className="text-teal-400 font-bold">● GPS Satellite Connected</span>
                <span className="text-slate-400">Signal: 98% (4G Telematics)</span>
              </div>

              <div className="text-center space-y-1 relative z-10">
                <div className="inline-block p-3 rounded-full bg-red-600/30 border border-red-500 text-red-400 animate-pulse">
                  <Truck className="w-8 h-8" />
                </div>
                <div className="text-sm font-extrabold">{selectedAmbulance.location}</div>
                <div className="text-[11px] text-teal-300">ETA to ER Resuscitation Room: {selectedAmbulance.ETA}</div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 relative z-10 font-mono">
                <span>Driver: {selectedAmbulance.driver}</span>
                <span>Speed: 64 MPH</span>
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={() => setIsTrackModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0F766E]"
              >
                Close Tracking Radar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
