import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Siren, Stethoscope, Bed, Truck, Droplet, Download, 
  Search, Check, CheckCircle2, LayoutDashboard, Users, Activity, 
  FileText, Bell, Settings, LogOut, Menu, X, Clock, AlertTriangle, 
  PhoneCall, ChevronRight, UserPlus, FileCheck, Layers, RefreshCw, 
  Filter, Calendar, BarChart3, TrendingUp, Plus, Trash2, Edit3, Eye, 
  CheckSquare, ShieldAlert, HeartPulse, Cpu, Sparkles, AlertCircle, Loader2
} from 'lucide-react';
import { 
  HOSPITAL_INFO, INITIAL_DOCTORS, INITIAL_EMERGENCY_CASES, 
  INITIAL_AMBULANCES, INITIAL_BEDS 
} from './data/hospitalStore';
import { 
  warmupBackendAPI, fetchStaffEmergencies, fetchEmergencyQueue, fetchPatients, createPatientAPI, deletePatientAPI, 
  fetchStaffMembers, createStaffAPI, approveEmergencyAPI, assignDoctorAPI, 
  dispatchNearestAmbulanceAPI, allocateBedAPI, releaseBedAPI, fetchAppointmentsAPI, 
  approveAppointmentAPI, assignDoctorAppointmentAPI, completeAppointmentAPI,
  fetchPatientReportsAPI, fetchCompatibleBloodAPI
} from './services/api';
import socket from './services/socket';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeConsole, setActiveConsole] = useState('dashboard');
  const [staffRole, setStaffRole] = useState('Admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // Cold Start & Connection Status States
  const [isWarmingUp, setIsWarmingUp] = useState(true);
  const [socketConnected, setSocketConnected] = useState(socket.connected);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [actionErrorNotice, setActionErrorNotice] = useState(null);

  // Modals State
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);

  // Shared State
  const [emergencyCases, setEmergencyCases] = useState(INITIAL_EMERGENCY_CASES);
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [patients, setPatients] = useState([]);
  const [ambulances, setAmbulances] = useState(INITIAL_AMBULANCES);
  const [beds, setBeds] = useState(INITIAL_BEDS);
  const [staffMembers, setStaffMembers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [lastDsaNotice, setLastDsaNotice] = useState('DSA Engine Ready: PriorityQueue (Heap) & Graph (Dijkstra) Active');

  // Form Input States
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: 'Male', phone: '', ward: 'General Ward', bloodGroup: 'O+' });

  // Blood Stock State
  const [bloodStock, setBloodStock] = useState([
    { group: 'A+', units: 65, status: 'Adequate' },
    { group: 'A-', units: 14, status: 'Low Stock' },
    { group: 'B+', units: 82, status: 'Adequate' },
    { group: 'B-', units: 9, status: 'Critical Shortage' },
    { group: 'AB+', units: 48, status: 'Adequate' },
    { group: 'AB-', units: 6, status: 'Critical Shortage' },
    { group: 'O+', units: 88, status: 'Adequate' },
    { group: 'O-', units: 8, status: 'Low Stock' }
  ]);

  // Load Data & Socket Hooks with Render Cold-Start Warmup
  useEffect(() => {
    const initializePortal = async () => {
      // 1. Task 3: Render Free-Tier Cold-Start Warmup Ping (60s timeout)
      await warmupBackendAPI();
      setIsWarmingUp(false);

      // 2. Load Normal Portal Data
      const [erData, patData, stfData, apptData] = await Promise.all([
        fetchEmergencyQueue(),
        fetchPatients(),
        fetchStaffMembers(),
        fetchAppointmentsAPI()
      ]);

      if (erData) {
        setEmergencyCases(erData);
        if (erData.isFallbackData) setIsFallbackMode(true);
      }
      if (patData) setPatients(patData);
      if (stfData) setStaffMembers(stfData);
      if (apptData) setAppointments(apptData);
    };

    initializePortal();

    // Task 6: Socket Connection Listeners
    const handleConnect = () => setSocketConnected(true);
    const handleDisconnect = () => setSocketConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Socket.IO Listener: PriorityQueue Reordered Stream
    socket.on('queue_updated', (reorderedQueue) => {
      if (Array.isArray(reorderedQueue) && reorderedQueue.length > 0) {
        setEmergencyCases(reorderedQueue);
        setLastDsaNotice('⚡ Socket Event: PriorityQueue (Binary Heap) reordered triage queue in real time!');
        setIsFallbackMode(false);
      }
    });

    socket.on('new_emergency_request', (newCase) => {
      setEmergencyCases(prev => [newCase, ...prev.filter(c => c.id !== newCase.id)]);
      setIsFallbackMode(false);
    });

    socket.on('case_updated', (updatedCase) => {
      setEmergencyCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
    });

    socket.on('bed_allocated', (data) => {
      setLastDsaNotice(`🛏️ Socket Event: BedAllocator assigned ${data.bed ? data.bed.bedNumber : 'Bed'} via Free-List Stack`);
    });

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('queue_updated');
      socket.off('new_emergency_request');
      socket.off('case_updated');
      socket.off('bed_allocated');
    };
  }, []);

  // Update Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    return () => clearInterval(timer);
  }, []);

  // Action Handlers with Strict Write Error Validation
  const handleApproveEmergency = async (id) => {
    setActionErrorNotice(null);
    const res = await approveEmergencyAPI(id);
    if (res && res.success === false) {
      setActionErrorNotice(res.message || 'Write operation failed. Check backend connection.');
      return;
    }
    setEmergencyCases(emergencyCases.map(c => c.id === id ? { ...c, status: 'Approved' } : c));
  };

  const handleDispatchDijkstra = async (caseId, address) => {
    setActionErrorNotice(null);
    const res = await dispatchNearestAmbulanceAPI(caseId, address);
    if (res && res.success === false) {
      setActionErrorNotice(res.message || 'Write operation failed. Check backend connection.');
      return;
    }
    if (res && res.success) {
      setLastDsaNotice(`🚚 Dijkstra Dispatch Success: ${res.data.ambulance.number} assigned (${res.data.distanceKm.toFixed(1)} km)`);
      const updatedCases = await fetchEmergencyQueue();
      if (updatedCases) setEmergencyCases(updatedCases);
    }
  };

  const handleAllocateBedDSA = async (caseId, priority = 'Critical') => {
    setActionErrorNotice(null);
    const res = await allocateBedAPI('ICU', priority, caseId);
    if (res && res.success === false) {
      setActionErrorNotice(res.message || 'Write operation failed. Check backend connection.');
      return;
    }
    if (res && res.success) {
      setLastDsaNotice(`🛏️ BedAllocator Success: Allocated ${res.data.bedNumber} (${res.data.allocatedCategory}${res.data.fallbackUsed ? ' via Fallback' : ''})`);
      const updatedCases = await fetchEmergencyQueue();
      if (updatedCases) setEmergencyCases(updatedCases);
    }
  };

  const handleFetchCompatibleBlood = async (group) => {
    setActionErrorNotice(null);
    const res = await fetchCompatibleBloodAPI(group);
    if (res && res.success === false) {
      setActionErrorNotice(res.message || 'Write operation failed. Check backend connection.');
      return;
    }
    if (res && res.success) {
      setLastDsaNotice(`🩸 Union-Find Blood Lookup: Compatible Donor Groups for ${group} = [${res.compatibleGroups.join(', ')}]`);
    }
  };

  const pendingCount = emergencyCases.filter(c => c.status === 'Pending').length;

  // Render Warmup Loading Overlay
  if (isWarmingUp) {
    return (
      <div className="w-full min-h-screen bg-[#071A1D] text-white flex flex-col items-center justify-center p-6 space-y-4 font-sans">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#0F766E] to-[#14B8A6] flex items-center justify-center text-3xl shadow-2xl animate-bounce">
          🏥
        </div>
        <div className="flex items-center gap-2 text-teal-300 font-mono text-sm font-bold">
          <Loader2 className="w-5 h-5 animate-spin text-[#14B8A6]" />
          <span>Connecting to Sanjeevani Hospital Servers...</span>
        </div>
        <p className="text-xs text-slate-400 max-w-sm text-center font-medium leading-relaxed">
          Waking up Render free-tier instance (cold-start initialization). Normal operations will resume automatically in a few seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans overflow-x-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-[#071A1D] text-slate-300 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out border-r border-teal-900/50 flex flex-col justify-between shadow-2xl`}>
        <div className="space-y-6 p-5">
          <div className="flex items-center justify-between border-b border-teal-900/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0F766E] to-[#14B8A6] flex items-center justify-center text-white text-xl shadow-lg">
                🏥
              </div>
              <div>
                <h1 className="text-sm font-black text-white tracking-tight leading-none">Sanjeevani HEMS</h1>
                <p className="text-[10px] text-teal-400 font-bold mt-1">Hospital Admin & DSA Engine</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white lg:hidden">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'emergency', label: 'Emergency Queue (Heap)', icon: Siren, badge: pendingCount },
              { id: 'appointments', label: 'OPD Appointments', icon: Calendar },
              { id: 'patients', label: 'Patients Directory', icon: Users },
              { id: 'ambulances', label: '108 Fleet (Dijkstra)', icon: Truck },
              { id: 'beds', label: 'Bed Matrix (Free-Lists)', icon: Bed },
              { id: 'bloodbank', label: 'Blood Bank (Union-Find)', icon: Droplet },
              { id: 'reports', label: 'Clinical Reports (LRU)', icon: BarChart3 }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveConsole(item.id); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                    activeConsole === item.id
                      ? 'bg-[#0F766E] text-white shadow-md shadow-teal-900/40'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-teal-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        
        {/* TOPBAR */}
        <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-extrabold text-[#0F766E] bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
              <Clock className="w-3.5 h-3.5 text-[#14B8A6] animate-spin" />
              <span>{currentTime} | Sector 32 Chandigarh</span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Task 6: Real-Time Connection Status Indicator Pill */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black border ${
              socketConnected && !isFallbackMode 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                : isFallbackMode
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-red-50 text-red-900 border-red-300'
            }`}>
              <span className={`w-2.5 h-2.5 rounded-full ${
                socketConnected && !isFallbackMode 
                  ? 'bg-emerald-500 animate-pulse' 
                  : isFallbackMode 
                  ? 'bg-amber-500' 
                  : 'bg-red-500'
              }`} />
              <span>
                {socketConnected && !isFallbackMode 
                  ? 'Live Backend Connected' 
                  : isFallbackMode 
                  ? 'Demo / Fallback Mode' 
                  : 'Backend Disconnected'}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs font-mono bg-cyan-50 text-cyan-800 border border-cyan-200 px-3 py-1.5 rounded-xl font-bold">
              <Cpu className="w-4 h-4 text-cyan-600 animate-pulse" />
              <span>{lastDsaNotice}</span>
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
          
          {/* Write Operation Error Banner */}
          {actionErrorNotice && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-red-900 text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{actionErrorNotice}</span>
              </div>
              <button onClick={() => setActionErrorNotice(null)} className="p-1 text-red-600 hover:bg-red-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Demo Fallback Data Notice */}
          {isFallbackMode && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Showing demo data — live backend connection unavailable. Writes will require an active backend server connection.</span>
            </div>
          )}

          {/* EMERGENCY TRIAGE QUEUE CONSOLE (POWERED BY PRIORITY QUEUE BINARY MIN-HEAP) */}
          {(activeConsole === 'dashboard' || activeConsole === 'emergency') && (
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded">
                    Task 1 DSA Engine • Binary Min-Heap Priority Queue
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
                    <Siren className="w-5 h-5 text-red-600 animate-bounce" />
                    Emergency Queue Console (Live Triage Ranked Order)
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
                  Critical &gt; High &gt; Medium (FIFO Tiebreaker)
                </span>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse font-sans min-w-[800px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase">
                      <th className="p-3.5">Heap Rank</th>
                      <th className="p-3.5">Case ID</th>
                      <th className="p-3.5">Patient Name</th>
                      <th className="p-3.5">Emergency Type</th>
                      <th className="p-3.5">Triage Severity</th>
                      <th className="p-3.5">Zone Location</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-center">DSA Automated Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {emergencyCases.map((req, idx) => (
                      <tr key={req.id} className="hover:bg-slate-50/50">
                        <td className="p-3.5 font-mono font-bold text-slate-400">#{idx + 1}</td>
                        <td className="p-3.5 font-mono font-bold text-[#0F766E]">{req.id}</td>
                        <td className="p-3.5 font-extrabold text-slate-900">{req.patientName || req.patient}</td>
                        <td className="p-3.5 font-bold text-red-700">{req.emergencyType}</td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                            req.priority === 'Critical' ? 'bg-red-600 text-white' :
                            req.priority === 'High' ? 'bg-amber-500 text-white' :
                            'bg-blue-600 text-white'
                          }`}>
                            {req.priority || 'Critical'}
                          </span>
                        </td>
                        <td className="p-3.5 font-medium text-slate-600">{req.address || 'Sector 32, Chandigarh'}</td>
                        <td className="p-3.5 font-extrabold text-teal-800">{req.status}</td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => handleDispatchDijkstra(req.id, req.address)}
                              className="px-2.5 py-1 text-xs font-black bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors flex items-center gap-1"
                              title="Run Dijkstra Shortest Path to Dispatch Ambulance"
                            >
                              <Truck className="w-3 h-3" /> Dijkstra Dispatch
                            </button>
                            <button
                              onClick={() => handleAllocateBedDSA(req.id, req.priority)}
                              className="px-2.5 py-1 text-xs font-black bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-1"
                              title="Allocate Bed via BedAllocator Free-List Stack"
                            >
                              <Bed className="w-3 h-3" /> Bed Free-List
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

          {/* BLOOD BANK CONSOLE (POWERED BY UNION-FIND) */}
          {activeConsole === 'bloodbank' && (
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-2 py-0.5 rounded">
                    Task 6 DSA Engine • Union-Find Disjoint Set
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-1">NABL Blood Reserve & Compatibility Engine</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {bloodStock.map((b, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-black text-red-600">{b.group}</div>
                      <button
                        onClick={() => handleFetchCompatibleBlood(b.group)}
                        className="px-2 py-1 text-[10px] font-bold bg-purple-100 text-purple-800 rounded border border-purple-200 hover:bg-purple-200"
                        title="Check Compatible Donor Groups using Union-Find"
                      >
                        Union-Find Lookup
                      </button>
                    </div>
                    <div className="text-xs font-mono font-bold">{b.units} Units Available</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
