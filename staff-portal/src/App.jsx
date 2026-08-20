import React, { useState, useEffect } from 'react';
import { 
  Siren, Bed, Truck, Droplet, Search, CheckCircle2, LayoutDashboard, Users, Activity, 
  Menu, X, Clock, AlertTriangle, UserPlus, RefreshCw, Calendar, BarChart3, Plus, Trash2,
  Cpu, AlertCircle, Loader2
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
  fetchPatientReportsAPI, fetchCompatibleBloodAPI, fetchAmbulances, fetchBeds, fetchBloodStock, resetAmbulancesAPI
} from './services/api';
import socket from './services/socket';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeConsole, setActiveConsole] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // Cold Start & Connection Status States
  const [isWarmingUp, setIsWarmingUp] = useState(true);
  const [socketConnected, setSocketConnected] = useState(socket.connected);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [actionErrorNotice, setActionErrorNotice] = useState(null);
  const [actionSuccessNotice, setActionSuccessNotice] = useState(null);

  // Modals State
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);

  // Shared State
  const [emergencyCases, setEmergencyCases] = useState(INITIAL_EMERGENCY_CASES);
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [patients, setPatients] = useState([]);
  const [ambulances, setAmbulances] = useState(INITIAL_AMBULANCES);
  const [beds, setBeds] = useState(INITIAL_BEDS);
  const [bloodStock, setBloodStock] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [lastDsaNotice, setLastDsaNotice] = useState('DSA Engine Active: PriorityQueue, Dijkstra, LRU Cache, UnionFind, BedAllocator');

  // Loading States
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [isLoadingAmbulances, setIsLoadingAmbulances] = useState(false);
  const [isLoadingBeds, setIsLoadingBeds] = useState(false);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Input States
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: 'Male', phone: '', ward: 'General Ward', bloodGroup: 'O+', address: 'Sector 32, Chandigarh' });

  // Reports & Blood DSA Console States
  const [reportPatientId, setReportPatientId] = useState('SAN-2026-1001');
  const [patientReports, setPatientReports] = useState([]);
  const [reportNotice, setReportNotice] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('O+');
  const [compatibleGroups, setCompatibleGroups] = useState([]);
  const [bloodNotice, setBloodNotice] = useState(null);

  // Load Data & Register Socket Hooks
  const loadPortalData = async () => {
    const [erData, patData, apptData, ambData, bedData, bloodData] = await Promise.all([
      fetchEmergencyQueue(),
      fetchPatients(),
      fetchAppointmentsAPI(),
      fetchAmbulances(),
      fetchBeds(),
      fetchBloodStock()
    ]);

    if (erData) {
      setEmergencyCases(erData);
      if (erData.isFallbackData) setIsFallbackMode(true);
    }
    if (patData) setPatients(patData);
    if (apptData) setAppointments(apptData);
    if (ambData) setAmbulances(ambData);
    if (bedData) setBeds(bedData);
    if (bloodData) setBloodStock(bloodData);
  };

  useEffect(() => {
    const initializePortal = async () => {
      await warmupBackendAPI();
      setIsWarmingUp(false);
      await loadPortalData();
    };

    initializePortal();

    const handleConnect = () => setSocketConnected(true);
    const handleDisconnect = () => setSocketConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    socket.on('queue_updated', (reorderedQueue) => {
      if (Array.isArray(reorderedQueue) && reorderedQueue.length > 0) {
        setEmergencyCases(reorderedQueue);
        setLastDsaNotice('⚡ Socket Event: PriorityQueue (Binary Heap) reordered triage queue!');
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

  const showSuccess = (msg) => {
    setActionSuccessNotice(msg);
    setTimeout(() => setActionSuccessNotice(null), 5000);
  };

  // Action Handlers
  const handleApproveEmergency = async (id) => {
    setActionErrorNotice(null);
    const res = await approveEmergencyAPI(id);
    if (res && res.success === false) {
      setActionErrorNotice(res.message || 'Write operation failed.');
      return;
    }
    setEmergencyCases(emergencyCases.map(c => c.id === id ? { ...c, status: 'Approved' } : c));
    showSuccess(`Emergency case ${id} approved.`);
  };

  const handleDispatchDijkstra = async (caseId, address) => {
    setActionErrorNotice(null);
    const res = await dispatchNearestAmbulanceAPI(caseId, address);
    if (res && res.success === false) {
      setActionErrorNotice(res.message || 'Write operation failed.');
      return;
    }
    if (res && res.success) {
      setLastDsaNotice(`🚚 Dijkstra Dispatch: ${res.data.ambulance.number} assigned (${res.data.distanceKm.toFixed(1)} km)`);
      showSuccess(`Ambulance ${res.data.ambulance.number} dispatched!`);
      const updatedAmbs = await fetchAmbulances();
      if (updatedAmbs) setAmbulances(updatedAmbs);
      const updatedCases = await fetchEmergencyQueue();
      if (updatedCases) setEmergencyCases(updatedCases);
    }
  };

  const handleResetAmbulances = async () => {
    setActionErrorNotice(null);
    const res = await resetAmbulancesAPI();
    if (res && res.success === false) {
      setActionErrorNotice(res.message || 'Ambulance reset failed.');
      return;
    }
    if (res && res.data) {
      setAmbulances(res.data);
      showSuccess('All ambulances reset to Available status.');
      setLastDsaNotice('🚚 108 Fleet reset to Available status');
    }
  };

  const handleAllocateBedDSA = async (caseId, priority = 'Critical') => {
    setActionErrorNotice(null);
    const res = await allocateBedAPI('ICU', priority, caseId);
    if (res && res.success === false) {
      setActionErrorNotice(res.message || 'Bed allocation failed.');
      return;
    }
    if (res && res.success) {
      setLastDsaNotice(`🛏️ BedAllocator: Allocated ${res.data.bedNumber} (${res.data.allocatedCategory})`);
      showSuccess(`Bed ${res.data.bedNumber} allocated!`);
      const updatedBeds = await fetchBeds();
      if (updatedBeds) setBeds(updatedBeds);
      const updatedCases = await fetchEmergencyQueue();
      if (updatedCases) setEmergencyCases(updatedCases);
    }
  };

  const handleReleaseBed = async (bedId) => {
    setActionErrorNotice(null);
    const res = await releaseBedAPI(bedId);
    if (res && res.success === false) {
      setActionErrorNotice(res.message || 'Bed release failed.');
      return;
    }
    showSuccess(`Bed released successfully.`);
    const updatedBeds = await fetchBeds();
    if (updatedBeds) setBeds(updatedBeds);
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setActionErrorNotice(null);
    if (!newPatient.name || !newPatient.phone) {
      setActionErrorNotice('Patient Name and Phone are required.');
      return;
    }
    setIsSubmitting(true);
    const res = await createPatientAPI({
      name: newPatient.name,
      age: Number(newPatient.age) || 30,
      gender: newPatient.gender,
      phone: newPatient.phone,
      ward: newPatient.ward,
      bloodGroup: newPatient.bloodGroup,
      address: newPatient.address
    });
    setIsSubmitting(false);

    if (res && res.success === false) {
      setActionErrorNotice(res.message || 'Failed to add patient.');
      return;
    }

    if (res && res.data) {
      setPatients(prev => [res.data, ...prev]);
      showSuccess(`Patient ${res.data.name} (ID: ${res.data.id}) added.`);
      setShowAddPatientModal(false);
      setNewPatient({ name: '', age: '', gender: 'Male', phone: '', ward: 'General Ward', bloodGroup: 'O+', address: 'Sector 32, Chandigarh' });
    }
  };

  const handleDeletePatient = async (id) => {
    if (!window.confirm(`Delete patient record ${id}?`)) return;
    setActionErrorNotice(null);
    const res = await deletePatientAPI(id);
    if (res && res.success === false) {
      setActionErrorNotice(res.message || 'Failed to delete patient.');
      return;
    }
    setPatients(prev => prev.filter(p => p.id !== id && p._id !== id));
    showSuccess(`Patient record deleted.`);
  };

  const handleApproveAppointment = async (id) => {
    setActionErrorNotice(null);
    const res = await approveAppointmentAPI(id);
    if (res && res.success === false) {
      setActionErrorNotice(res.message || 'Failed to approve appointment.');
      return;
    }
    setAppointments(prev => prev.map(a => (a.id === id || a._id === id) ? { ...a, status: 'Approved' } : a));
    showSuccess(`Appointment ${id} approved.`);
  };

  const handleCompleteAppointment = async (id) => {
    setActionErrorNotice(null);
    const res = await completeAppointmentAPI(id);
    if (res && res.success === false) {
      setActionErrorNotice(res.message || 'Failed to complete appointment.');
      return;
    }
    setAppointments(prev => prev.map(a => (a.id === id || a._id === id) ? { ...a, status: 'Completed' } : a));
    showSuccess(`Appointment ${id} completed.`);
  };

  const handleFetchReportsDSA = async () => {
    setReportLoading(true);
    setReportNotice(null);
    const res = await fetchPatientReportsAPI(reportPatientId);
    setReportLoading(false);
    if (res && res.success === false) {
      setActionErrorNotice(res.message || 'Failed to fetch reports.');
      return;
    }
    if (res && res.data) {
      setPatientReports(res.data);
      setReportNotice({ source: res.source, count: res.data.length });
    }
  };

  const handleFetchCompatibleBlood = async (group) => {
    setSelectedBloodGroup(group);
    const res = await fetchCompatibleBloodAPI(group);
    if (res && res.success === false) {
      setActionErrorNotice(res.message || 'Union-Find query failed.');
      return;
    }
    if (res && res.compatibleGroups) {
      setCompatibleGroups(res.compatibleGroups);
      setBloodNotice(`Union-Find Lookup: Compatible Donor Groups for ${group} = [${res.compatibleGroups.join(', ')}]`);
    }
  };

  const pendingCount = emergencyCases.filter(c => c.status === 'Pending').length;
  const filteredPatients = patients.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone?.includes(searchQuery)
  );

  // Render Warmup Overlay
  if (isWarmingUp) {
    return (
      <div className="w-full min-h-screen bg-[#071A1D] text-white flex flex-col items-center justify-center p-6 space-y-4 font-sans">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#0F766E] to-[#14B8A6] flex items-center justify-center text-3xl shadow-2xl animate-bounce">🏥</div>
        <div className="flex items-center gap-2 text-teal-300 font-mono text-sm font-bold">
          <Loader2 className="w-5 h-5 animate-spin text-[#14B8A6]" />
          <span>Connecting to Sanjeevani Hospital Staff System...</span>
        </div>
        <p className="text-xs text-slate-400 max-w-sm text-center font-medium leading-relaxed">
          Waking up Render free-tier instance. Dashboard will load automatically in a few seconds.
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
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0F766E] to-[#14B8A6] flex items-center justify-center text-white text-xl shadow-lg">🏥</div>
              <div>
                <h1 className="text-sm font-black text-white leading-none">Sanjeevani HEMS</h1>
                <p className="text-[10px] text-teal-400 font-bold mt-1">Staff Operations Center</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white lg:hidden"><X className="w-5 h-5" /></button>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'emergency', label: 'Emergency Queue', icon: Siren, badge: pendingCount },
              { id: 'appointments', label: 'OPD Appointments', icon: Calendar, badge: appointments.filter(a => a.status === 'Appointment Requested').length },
              { id: 'patients', label: 'Patient Directory', icon: Users },
              { id: 'ambulances', label: '108 Fleet (Dijkstra)', icon: Truck },
              { id: 'beds', label: 'Bed Matrix (Free-Lists)', icon: Bed },
              { id: 'bloodbank', label: 'Blood Bank (Union-Find)', icon: Droplet },
              { id: 'reports', label: 'Reports (LRU Cache)', icon: BarChart3 }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={() => setActiveConsole(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                    activeConsole === item.id
                      ? 'bg-[#0F766E] text-white shadow-md shadow-teal-900/40'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}>
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-teal-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white">{item.badge}</span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-teal-900/60 text-[10px] text-teal-400 font-mono">
          <div>Sector 32, Chandigarh</div>
          <div className="text-slate-500 mt-0.5">Custom DSA Engine v2.0</div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        
        {/* TOPBAR */}
        <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-extrabold text-[#0F766E] bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
              <Clock className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span>{currentTime} | Sanjeevani Staff Console</span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={loadPortalData} className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5 text-xs font-bold" title="Refresh all data from backend">
              <RefreshCw className="w-4 h-4 text-teal-600" /> <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black border ${
              socketConnected && !isFallbackMode ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : isFallbackMode ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-red-50 text-red-900 border-red-300'
            }`}>
              <span className={`w-2.5 h-2.5 rounded-full ${socketConnected && !isFallbackMode ? 'bg-emerald-500 animate-pulse' : isFallbackMode ? 'bg-amber-500' : 'bg-red-500'}`} />
              <span>{socketConnected && !isFallbackMode ? 'Live Backend Connected' : isFallbackMode ? 'Demo / Fallback Mode' : 'Backend Disconnected'}</span>
            </div>
          </div>
        </header>

        {/* DSA LOG BAR */}
        <div className="bg-[#071A1D] text-cyan-300 px-6 py-2 text-xs font-mono font-bold border-b border-teal-900 flex items-center gap-2 overflow-x-auto">
          <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{lastDsaNotice}</span>
        </div>

        {/* MAIN BODY CONSOLES */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          
          {/* Error Banner */}
          {actionErrorNotice && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-red-900 text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{actionErrorNotice}</span>
              </div>
              <button onClick={() => setActionErrorNotice(null)} className="p-1 text-red-600 hover:bg-red-100 rounded-lg"><X className="w-4 h-4" /></button>
            </div>
          )}

          {/* Success Banner */}
          {actionSuccessNotice && (
            <div className="p-4 rounded-2xl bg-green-50 border border-green-300 text-green-900 text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <span>{actionSuccessNotice}</span>
              </div>
              <button onClick={() => setActionSuccessNotice(null)} className="p-1 text-green-600 hover:bg-green-100 rounded-lg"><X className="w-4 h-4" /></button>
            </div>
          )}

          {/* Fallback Banner */}
          {isFallbackMode && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Showing demo data — live backend unavailable. Check server connection.</span>
            </div>
          )}

          {/* ===================== DASHBOARD / OVERVIEW ===================== */}
          {activeConsole === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { title: 'Pending Triage (Heap)', count: pendingCount, color: 'bg-red-50 text-red-900 border-red-200', icon: '🚨' },
                  { title: 'Registered Patients', count: patients.length, color: 'bg-teal-50 text-teal-900 border-teal-200', icon: '👥' },
                  { title: 'OPD Appointments', count: appointments.length, color: 'bg-blue-50 text-blue-900 border-blue-200', icon: '📋' },
                  { title: 'Available Beds', count: beds.filter(b => b.status === 'Available').length, color: 'bg-purple-50 text-purple-900 border-purple-200', icon: '🛏️' }
                ].map((s, i) => (
                  <div key={i} className={`p-5 rounded-3xl border ${s.color} space-y-1`}>
                    <div className="text-2xl">{s.icon}</div>
                    <div className="text-3xl font-black">{s.count}</div>
                    <div className="text-[11px] font-extrabold uppercase tracking-wider">{s.title}</div>
                  </div>
                ))}
              </div>

              {/* Quick Actions Bar */}
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setActiveConsole('emergency')} className="px-4 py-2.5 rounded-2xl bg-red-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-red-700 shadow-sm">
                  <Siren className="w-4 h-4" /> Open Emergency Queue Console
                </button>
                <button onClick={() => setShowAddPatientModal(true)} className="px-4 py-2.5 rounded-2xl bg-[#0F766E] text-white font-bold text-xs flex items-center gap-2 hover:bg-teal-800 shadow-sm">
                  <UserPlus className="w-4 h-4" /> Add Patient Record
                </button>
                <button onClick={handleResetAmbulances} className="px-4 py-2.5 rounded-2xl bg-cyan-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-cyan-700 shadow-sm">
                  <Truck className="w-4 h-4" /> Reset All Ambulances to Available
                </button>
              </div>

              {/* Summary Table: Emergency Queue */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <Siren className="w-5 h-5 text-red-600" /> Triage Queue Summary (PriorityQueue Heap Order)
                  </h3>
                  <button onClick={() => setActiveConsole('emergency')} className="text-xs font-extrabold text-[#0F766E] hover:underline">View All →</button>
                </div>
                {emergencyCases.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4">No emergency cases in queue.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[600px]">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-extrabold border-b">
                          <th className="p-3">Rank</th>
                          <th className="p-3">Case ID</th>
                          <th className="p-3">Patient</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Priority</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {emergencyCases.slice(0, 5).map((c, idx) => (
                          <tr key={c.id}>
                            <td className="p-3 font-mono font-bold text-slate-400">#{idx + 1}</td>
                            <td className="p-3 font-mono font-bold text-[#0F766E]">{c.id}</td>
                            <td className="p-3 font-bold">{c.patientName || c.patient}</td>
                            <td className="p-3 text-red-700 font-medium">{c.emergencyType}</td>
                            <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${c.priority === 'Critical' ? 'bg-red-600 text-white' : c.priority === 'High' ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'}`}>{c.priority}</span></td>
                            <td className="p-3 font-bold text-teal-800">{c.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== EMERGENCY TRIAGE QUEUE CONSOLE ===================== */}
          {(activeConsole === 'dashboard' || activeConsole === 'emergency') && (
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded">
                    Task 1 DSA Engine • Binary Min-Heap Priority Queue
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
                    <Siren className="w-5 h-5 text-red-600 animate-bounce" />
                    Emergency Triage Command Console
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
                    Heap Order: Critical &gt; High &gt; Medium
                  </span>
                </div>
              </div>

              {emergencyCases.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 italic">No emergency requests in queue.</div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse font-sans min-w-[800px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase">
                        <th className="p-3.5">Heap Rank</th>
                        <th className="p-3.5">Case ID</th>
                        <th className="p-3.5">Patient Name</th>
                        <th className="p-3.5">Type</th>
                        <th className="p-3.5">Priority</th>
                        <th className="p-3.5">Location Address</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-center">DSA Operations</th>
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
                              req.priority === 'Critical' ? 'bg-red-600 text-white' : req.priority === 'High' ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'
                            }`}>
                              {req.priority || 'Critical'}
                            </span>
                          </td>
                          <td className="p-3.5 font-medium text-slate-600">{req.address || 'Sector 32, Chandigarh'}</td>
                          <td className="p-3.5 font-extrabold text-teal-800">{req.status}</td>
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                              {req.status === 'Pending' && (
                                <button onClick={() => handleApproveEmergency(req.id)} className="px-2.5 py-1 text-xs font-black bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                                  Approve
                                </button>
                              )}
                              <button onClick={() => handleDispatchDijkstra(req.id, req.address)} className="px-2.5 py-1 text-xs font-black bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors flex items-center gap-1">
                                <Truck className="w-3 h-3" /> Dijkstra Dispatch
                              </button>
                              <button onClick={() => handleAllocateBedDSA(req.id, req.priority)} className="px-2.5 py-1 text-xs font-black bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-1">
                                <Bed className="w-3 h-3" /> Bed Free-List
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ===================== PATIENTS DIRECTORY CONSOLE ===================== */}
          {activeConsole === 'patients' && (
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded">
                    Data Model: Patient Record Registry
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#0F766E]" /> Patient Directory ({patients.length} Records)
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input type="text" placeholder="Search by name, ID, phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#0F766E]" />
                  </div>
                  <button onClick={() => setShowAddPatientModal(true)} className="px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs font-black hover:bg-teal-800 flex items-center gap-1.5 shadow-sm">
                    <Plus className="w-4 h-4" /> Add Patient
                  </button>
                </div>
              </div>

              {filteredPatients.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 italic">No patients found. Click 'Add Patient' to register a new record.</div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase border-b">
                        <th className="p-3.5">Patient ID</th>
                        <th className="p-3.5">Full Name</th>
                        <th className="p-3.5">Age / Gender</th>
                        <th className="p-3.5">Phone</th>
                        <th className="p-3.5">Blood Group</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Ward / Bed</th>
                        <th className="p-3.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPatients.map(p => (
                        <tr key={p.id || p._id} className="hover:bg-slate-50/50">
                          <td className="p-3.5 font-mono font-bold text-[#0F766E]">{p.id || p._id}</td>
                          <td className="p-3.5 font-extrabold text-slate-900">{p.name}</td>
                          <td className="p-3.5 font-medium text-slate-600">{p.age} Yrs / {p.gender}</td>
                          <td className="p-3.5 font-mono text-slate-600">{p.phone}</td>
                          <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-mono font-bold text-[11px]">{p.bloodGroup || 'O+'}</span></td>
                          <td className="p-3.5"><span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${p.status === 'Admitted' ? 'bg-red-100 text-red-800' : 'bg-teal-100 text-teal-800'}`}>{p.status || 'Registered'}</span></td>
                          <td className="p-3.5 font-medium text-slate-600">{p.ward || 'General'} ({p.bedNumber || 'N/A'})</td>
                          <td className="p-3.5 text-center">
                            <button onClick={() => handleDeletePatient(p.id || p._id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete Patient Record">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ===================== OPD APPOINTMENTS CONSOLE ===================== */}
          {activeConsole === 'appointments' && (
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                    OPD Scheduling Engine
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" /> OPD Appointments Management ({appointments.length})
                  </h2>
                </div>
              </div>

              {appointments.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 italic">No OPD appointments booked yet.</div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase border-b">
                        <th className="p-3.5">Appt ID</th>
                        <th className="p-3.5">Patient Name</th>
                        <th className="p-3.5">Doctor</th>
                        <th className="p-3.5">Department</th>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5">Time Slot</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {appointments.map(a => (
                        <tr key={a.id || a._id} className="hover:bg-slate-50/50">
                          <td className="p-3.5 font-mono font-bold text-blue-700">{a.id || a._id}</td>
                          <td className="p-3.5 font-extrabold text-slate-900">{a.patientName}</td>
                          <td className="p-3.5 font-bold text-slate-700">{a.doctorName}</td>
                          <td className="p-3.5 font-medium text-slate-600">{a.department}</td>
                          <td className="p-3.5 font-medium text-slate-600">{a.date}</td>
                          <td className="p-3.5 font-medium text-slate-600">{a.timeSlot}</td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              a.status === 'Approved' ? 'bg-green-100 text-green-800' : a.status === 'Completed' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {a.status || 'Requested'}
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {a.status !== 'Approved' && a.status !== 'Completed' && (
                                <button onClick={() => handleApproveAppointment(a.id || a._id)} className="px-2.5 py-1 text-xs font-black bg-green-600 text-white rounded-lg hover:bg-green-700">Approve</button>
                              )}
                              {a.status !== 'Completed' && (
                                <button onClick={() => handleCompleteAppointment(a.id || a._id)} className="px-2.5 py-1 text-xs font-black bg-gray-600 text-white rounded-lg hover:bg-gray-700">Complete</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ===================== 108 AMBULANCE FLEET CONSOLE ===================== */}
          {activeConsole === 'ambulances' && (
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-700 uppercase tracking-widest bg-cyan-50 px-2 py-0.5 rounded">
                    Task 2 DSA Engine • Graph & Dijkstra Shortest Path
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-cyan-600" /> 108 Emergency Ambulance Fleet ({ambulances.length} Units)
                  </h2>
                </div>
                <button onClick={handleResetAmbulances} className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-black hover:bg-cyan-700 shadow-sm flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4" /> Reset All Units to Available
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {ambulances.map(amb => (
                  <div key={amb.id || amb._id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-base font-black text-slate-900">{amb.number}</h4>
                        <p className="text-xs text-slate-500 font-bold">{amb.driver}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        amb.status === 'Available' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {amb.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 space-y-1 font-medium">
                      <div>📍 Location: <strong>{amb.location}</strong></div>
                      <div>🗺️ Zone Node: <strong>{amb.zone || 'Sector 32'}</strong></div>
                      <div>⏱️ ETA: <strong>{amb.eta}</strong></div>
                    </div>
                    <button onClick={() => handleDispatchDijkstra(null, amb.location)} disabled={amb.status !== 'Available'}
                      className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-300 text-white font-black text-xs flex items-center justify-center gap-1 transition-all">
                      <Truck className="w-3.5 h-3.5" /> Dispatch via Dijkstra
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== BED MATRIX CONSOLE ===================== */}
          {activeConsole === 'beds' && (
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-widest bg-purple-50 px-2 py-0.5 rounded">
                    Task 4 DSA Engine • BedAllocator Free-List Stacks
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
                    <Bed className="w-5 h-5 text-purple-600" /> Hospital Bed Matrix ({beds.length} Total Beds)
                  </h2>
                </div>
                <button onClick={() => handleAllocateBedDSA(null, 'Critical')} className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-black hover:bg-purple-700 shadow-sm">
                  + Auto-Allocate Bed (Free-List)
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 font-bold text-xs">Total: {beds.length} Beds</div>
                <div className="p-3 rounded-2xl bg-green-50 border border-green-200 text-green-900 font-bold text-xs">Available: {beds.filter(b => b.status === 'Available').length} Beds</div>
                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-900 font-bold text-xs">Occupied: {beds.filter(b => b.status === 'Occupied').length} Beds</div>
                <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 font-bold text-xs">ICU Beds: {beds.filter(b => b.type === 'ICU').length} Beds</div>
              </div>

              {/* Bed Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                {beds.map(b => (
                  <div key={b.id || b._id} className={`p-3.5 rounded-2xl border text-center space-y-2 ${
                    b.status === 'Available' ? 'bg-green-50 border-green-300 text-green-900' : 'bg-red-50 border-red-300 text-red-900'
                  }`}>
                    <div className="font-mono font-black text-xs">{b.bedNumber}</div>
                    <div className="text-[10px] font-bold uppercase">{b.type}</div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black ${b.status === 'Available' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                      {b.status}
                    </span>
                    <div>
                      {b.status === 'Occupied' ? (
                        <button onClick={() => handleReleaseBed(b.id || b._id)} className="w-full py-1 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-700">Release</button>
                      ) : (
                        <button onClick={() => handleAllocateBedDSA(null, 'Critical')} className="w-full py-1 bg-green-600 text-white rounded text-[10px] font-bold hover:bg-green-700">Allocate</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== BLOOD BANK CONSOLE ===================== */}
          {activeConsole === 'bloodbank' && (
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-widest bg-purple-50 px-2 py-0.5 rounded">
                  Task 6 DSA Engine • Union-Find Disjoint Set
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-red-600" /> Blood Reserve & Compatibility Engine
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {bloodStock.map((b, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-black text-red-600">{b.group}</div>
                      <button onClick={() => handleFetchCompatibleBlood(b.group)} className="px-2 py-1 text-[10px] font-bold bg-purple-100 text-purple-800 rounded border border-purple-200 hover:bg-purple-200">
                        Union-Find
                      </button>
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-700">{b.units} Units Available</div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black ${b.status === 'Adequate' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{b.status}</span>
                  </div>
                ))}
              </div>

              {bloodNotice && (
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-mono font-bold">
                  {bloodNotice}
                </div>
              )}
            </div>
          )}

          {/* ===================== CLINICAL REPORTS (LRU CACHE) CONSOLE ===================== */}
          {activeConsole === 'reports' && (
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded">
                  Task 5 DSA Engine • LRU Cache (Doubly Linked List + Map)
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-teal-600" /> Patient Clinical Reports Lookups
                </h2>
              </div>

              <div className="flex gap-2">
                <input type="text" placeholder="Enter Patient ID (e.g. SAN-2026-1001)" value={reportPatientId} onChange={e => setReportPatientId(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0F766E]" />
                <button onClick={handleFetchReportsDSA} disabled={reportLoading} className="px-5 py-3 rounded-xl bg-[#0F766E] text-white font-bold text-xs flex items-center gap-1.5 hover:bg-teal-800">
                  {reportLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Fetch (LRU Cache)
                </button>
              </div>

              {reportNotice && (
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-mono font-bold flex justify-between">
                  <span>Cache Source: {reportNotice.source}</span>
                  <span>Reports Count: {reportNotice.count}</span>
                </div>
              )}

              <div className="space-y-3">
                {patientReports.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-6">Enter a Patient ID above and click Fetch to demonstrate LRU Cache execution.</p>
                ) : (
                  patientReports.map(rpt => (
                    <div key={rpt.reportId} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-extrabold text-slate-900">{rpt.reportType}</p>
                        <p className="text-slate-500 text-[11px]">ID: {rpt.reportId} • Prescribed by {rpt.doctor}</p>
                      </div>
                      <span className="px-3 py-1 bg-teal-100 text-teal-800 font-bold rounded-lg text-[11px]">{rpt.date}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ADD PATIENT MODAL */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">Add New Patient Record</h3>
              <button onClick={() => setShowAddPatientModal(false)} className="p-1 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddPatient} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input type="text" value={newPatient.name} onChange={e => setNewPatient(p => ({...p, name: e.target.value}))} required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium focus:outline-none focus:border-[#0F766E]" placeholder="Patient name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age *</label>
                  <input type="number" value={newPatient.age} onChange={e => setNewPatient(p => ({...p, age: e.target.value}))} required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium focus:outline-none focus:border-[#0F766E]" placeholder="Age" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select value={newPatient.gender} onChange={e => setNewPatient(p => ({...p, gender: e.target.value}))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium focus:outline-none focus:border-[#0F766E]">
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input type="tel" value={newPatient.phone} onChange={e => setNewPatient(p => ({...p, phone: e.target.value}))} required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium focus:outline-none focus:border-[#0F766E]" placeholder="Phone" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                  <select value={newPatient.bloodGroup} onChange={e => setNewPatient(p => ({...p, bloodGroup: e.target.value}))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium focus:outline-none focus:border-[#0F766E]">
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ward Assignment</label>
                <input type="text" value={newPatient.ward} onChange={e => setNewPatient(p => ({...p, ward: e.target.value}))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium focus:outline-none focus:border-[#0F766E]" placeholder="Ward name" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Address</label>
                <input type="text" value={newPatient.address} onChange={e => setNewPatient(p => ({...p, address: e.target.value}))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium focus:outline-none focus:border-[#0F766E]" placeholder="City / Address" />
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setShowAddPatientModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 rounded-xl bg-[#0F766E] text-white font-bold hover:bg-teal-800 flex items-center justify-center gap-1">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
