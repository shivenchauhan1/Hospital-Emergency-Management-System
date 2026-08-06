import React, { useState } from 'react';
import { Terminal, Play, Plus, Zap, UserCheck, Search, Clock, RotateCcw, BarChart2, Shield, HeartPulse, RefreshCw } from 'lucide-react';
import { TRIAGE_SEVERITY_LEVELS } from '../../data/hospitalData';

export default function HospitalInteractiveConsole({ engine, onStateChange }) {
  const [activeForm, setActiveForm] = useState('menu'); // menu, register, emergency, normal, search, treat, report
  const [commandInput, setCommandInput] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  // Form Fields
  const [regForm, setRegForm] = useState({
    id: `PAT-${Math.floor(100 + Math.random() * 900)}`,
    name: '',
    age: '35',
    gender: 'Male',
    contact: '+1 555-0921',
    condition: ''
  });

  const [emergForm, setEmergForm] = useState({
    id: 'PAT-101',
    triageLevel: '9',
    condition: 'Acute Respiratory Distress'
  });

  const [normalForm, setNormalForm] = useState({
    id: 'PAT-103',
    condition: 'Annual Physical Assessment'
  });

  const [doctorName, setDoctorName] = useState('Dr. Gregory House');
  const [searchId, setSearchId] = useState('PAT-101');
  const [reportSort, setReportSort] = useState('severity');

  const refreshUI = () => {
    onStateChange();
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const cmd = commandInput.trim();
    if (!cmd) return;

    setCommandInput('');

    switch (cmd) {
      case '1':
        setActiveForm('register');
        break;
      case '2':
        setActiveForm('emergency');
        break;
      case '3':
        setActiveForm('normal');
        break;
      case '4':
        setActiveForm('treat');
        break;
      case '5':
        setActiveForm('search');
        break;
      case '6':
        setActiveForm('history');
        break;
      case '7':
        engine.undoLastOperation();
        refreshUI();
        break;
      case '8':
        setActiveForm('report');
        break;
      case '9':
        engine.reset();
        refreshUI();
        break;
      default:
        engine.logTerminal("WARN", `Unknown CLI Command '${cmd}'. Type 1-8 to execute system features.`);
        refreshUI();
    }
  };

  // Preset quick scenarios
  const runPresetScenario = (scenario) => {
    if (scenario === 'cardiac') {
      const id = `PAT-${Math.floor(200 + Math.random() * 800)}`;
      engine.registerPatient({
        id,
        name: 'Arthur Pendelton',
        age: 67,
        gender: 'Male',
        contact: '+1 555-0999',
        condition: 'Severe Myocardial Infarction'
      });
      engine.addEmergencyPatient(id, 10, 'CRITICAL: Severe STEMI Cardiac Arrest');
    } else if (scenario === 'routine') {
      const id = `PAT-${Math.floor(200 + Math.random() * 800)}`;
      engine.registerPatient({
        id,
        name: 'Clara Oswald',
        age: 26,
        gender: 'Female',
        contact: '+1 555-0111',
        condition: 'Mild Skin Allergy'
      });
      engine.addNormalPatient(id, 'Mild Skin Allergy / Routine Consultation');
    } else if (scenario === 'treat_batch') {
      engine.treatNextPatient('Dr. House');
      engine.treatNextPatient('Dr. Cuddy');
    }
    refreshUI();
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              CLI Menu Console Simulation
              <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Options 1 - 8 Active
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive terminal command interpreter for the Hospital System.
            </p>
          </div>
        </div>

        {/* Quick Action Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => runPresetScenario('cardiac')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            + Preset L10 Emergency
          </button>
          <button
            onClick={() => runPresetScenario('routine')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            + Preset Outpatient
          </button>
          <button
            onClick={() => {
              engine.reset();
              refreshUI();
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Menu Buttons & Forms (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* CLI Options Quick Grid */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveForm('register')}
              className={`p-3 rounded-2xl text-left border transition-all ${
                activeForm === 'register'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Option 1</div>
              <div className="text-xs font-extrabold flex items-center gap-1.5 mt-0.5">
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                Register Patient
              </div>
              <div className="text-[10px] text-slate-400 mt-1">unordered_map O(1)</div>
            </button>

            <button
              onClick={() => setActiveForm('emergency')}
              className={`p-3 rounded-2xl text-left border transition-all ${
                activeForm === 'emergency'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-lg shadow-rose-500/10'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Option 2</div>
              <div className="text-xs font-extrabold flex items-center gap-1.5 mt-0.5 text-rose-300">
                <Zap className="w-3.5 h-3.5 text-rose-400" />
                Add Emergency
              </div>
              <div className="text-[10px] text-slate-400 mt-1">priority_queue Max-Heap</div>
            </button>

            <button
              onClick={() => setActiveForm('normal')}
              className={`p-3 rounded-2xl text-left border transition-all ${
                activeForm === 'normal'
                  ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-lg shadow-teal-500/10'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Option 3</div>
              <div className="text-xs font-extrabold flex items-center gap-1.5 mt-0.5">
                <Plus className="w-3.5 h-3.5 text-teal-400" />
                Add Normal
              </div>
              <div className="text-[10px] text-slate-400 mt-1">queue FIFO O(1)</div>
            </button>

            <button
              onClick={() => setActiveForm('treat')}
              className={`p-3 rounded-2xl text-left border transition-all ${
                activeForm === 'treat'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Option 4</div>
              <div className="text-xs font-extrabold flex items-center gap-1.5 mt-0.5 text-emerald-300">
                <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
                Treat Next
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Preemptive Dispatcher</div>
            </button>

            <button
              onClick={() => setActiveForm('search')}
              className={`p-3 rounded-2xl text-left border transition-all ${
                activeForm === 'search'
                  ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-lg shadow-blue-500/10'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Option 5</div>
              <div className="text-xs font-extrabold flex items-center gap-1.5 mt-0.5">
                <Search className="w-3.5 h-3.5 text-blue-400" />
                Search Patient
              </div>
              <div className="text-[10px] text-slate-400 mt-1">unordered_map Lookup</div>
            </button>

            <button
              onClick={() => setActiveForm('history')}
              className={`p-3 rounded-2xl text-left border transition-all ${
                activeForm === 'history'
                  ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-lg shadow-purple-500/10'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Option 6</div>
              <div className="text-xs font-extrabold flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                View History
              </div>
              <div className="text-[10px] text-slate-400 mt-1">list Doubly Linked</div>
            </button>

            <button
              onClick={() => {
                engine.undoLastOperation();
                refreshUI();
              }}
              className="p-3 rounded-2xl text-left border border-slate-800 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300 transition-all"
            >
              <div className="text-[10px] font-mono font-bold text-amber-400/80 uppercase">Option 7</div>
              <div className="text-xs font-extrabold flex items-center gap-1.5 mt-0.5">
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                Undo Last Op
              </div>
              <div className="text-[10px] text-amber-400/70 mt-1">stack LIFO Pop</div>
            </button>

            <button
              onClick={() => setActiveForm('report')}
              className={`p-3 rounded-2xl text-left border transition-all ${
                activeForm === 'report'
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Option 8</div>
              <div className="text-xs font-extrabold flex items-center gap-1.5 mt-0.5">
                <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
                Patient Reports
              </div>
              <div className="text-[10px] text-slate-400 mt-1">QuickSort & MergeSort</div>
            </button>
          </div>

          {/* Form Context Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            {/* Form 1: Register */}
            {activeForm === 'register' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (engine.registerPatient(regForm)) {
                    setRegForm(prev => ({ ...prev, id: `PAT-${Math.floor(100 + Math.random() * 900)}`, name: '', condition: '' }));
                    refreshUI();
                  }
                }}
                className="space-y-3"
              >
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                  <span>1. Register New Patient</span>
                  <span className="font-mono text-[10px] text-slate-400">unordered_map insert</span>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Patient ID</label>
                    <input
                      type="text"
                      value={regForm.id}
                      onChange={(e) => setRegForm({ ...regForm, id: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Age</label>
                    <input
                      type="number"
                      value={regForm.age}
                      onChange={(e) => setRegForm({ ...regForm, age: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Gender</label>
                    <select
                      value={regForm.gender}
                      onChange={(e) => setRegForm({ ...regForm, gender: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Initial Medical Condition</label>
                  <input
                    type="text"
                    placeholder="e.g. Fever, Fracture, Routine Checkup"
                    value={regForm.condition}
                    onChange={(e) => setRegForm({ ...regForm, condition: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  Execute Register Patient (Option 1)
                </button>
              </form>
            )}

            {/* Form 2: Add Emergency */}
            {activeForm === 'emergency' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (engine.addEmergencyPatient(emergForm.id, emergForm.triageLevel, emergForm.condition)) {
                    refreshUI();
                  }
                }}
                className="space-y-3"
              >
                <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center justify-between">
                  <span>2. Add Emergency Patient</span>
                  <span className="font-mono text-[10px] text-slate-400">priority_queue Max-Heap</span>
                </h3>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Select Registered Patient ID</label>
                  <select
                    value={emergForm.id}
                    onChange={(e) => setEmergForm({ ...emergForm, id: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                  >
                    {Array.from(engine.patientRegistry.values()).map(p => (
                      <option key={p.id} value={p.id}>
                        {p.id} - {p.name} ({p.status})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Triage Severity Rating (1 = Low, 10 = Critical)</label>
                  <select
                    value={emergForm.triageLevel}
                    onChange={(e) => setEmergForm({ ...emergForm, triageLevel: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-rose-300 font-bold focus:outline-none focus:border-rose-500"
                  >
                    {TRIAGE_SEVERITY_LEVELS.map(lvl => (
                      <option key={lvl.level} value={lvl.level}>
                        {lvl.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Emergency Condition / Triage Note</label>
                  <input
                    type="text"
                    value={emergForm.condition}
                    onChange={(e) => setEmergForm({ ...emergForm, condition: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20 hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-4 h-4" />
                  Enqueue to Priority Heap (Option 2)
                </button>
              </form>
            )}

            {/* Form 3: Add Normal */}
            {activeForm === 'normal' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (engine.addNormalPatient(normalForm.id, normalForm.condition)) {
                    refreshUI();
                  }
                }}
                className="space-y-3"
              >
                <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center justify-between">
                  <span>3. Add Normal Patient</span>
                  <span className="font-mono text-[10px] text-slate-400">queue FIFO</span>
                </h3>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Select Registered Patient ID</label>
                  <select
                    value={normalForm.id}
                    onChange={(e) => setNormalForm({ ...normalForm, id: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                  >
                    {Array.from(engine.patientRegistry.values()).map(p => (
                      <option key={p.id} value={p.id}>
                        {p.id} - {p.name} ({p.status})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Consultation Reason</label>
                  <input
                    type="text"
                    value={normalForm.condition}
                    onChange={(e) => setNormalForm({ ...normalForm, condition: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Enqueue to FIFO Queue (Option 3)
                </button>
              </form>
            )}

            {/* Form 4: Treat Next */}
            {activeForm === 'treat' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                  <span>4. Treat Next Patient</span>
                  <span className="font-mono text-[10px] text-slate-400">Preemptive Dispatch</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The system will automatically dequeue from the <strong className="text-rose-400">Max-Heap Priority Queue</strong> first. If empty, it dequeues from the <strong className="text-teal-400">Normal FIFO Queue</strong>.
                </p>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Attending Physician / Doctor</label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  onClick={() => {
                    engine.treatNextPatient(doctorName);
                    refreshUI();
                  }}
                  className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                >
                  <HeartPulse className="w-4 h-4" />
                  Execute Treat Next Patient (Option 4)
                </button>
              </div>
            )}

            {/* Form 5: Search */}
            {activeForm === 'search' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center justify-between">
                  <span>5. Search Patient Record</span>
                  <span className="font-mono text-[10px] text-slate-400">unordered_map O(1)</span>
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Patient ID (e.g. PAT-101)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => {
                      const res = engine.searchPatient(searchId);
                      setSearchResult(res);
                      refreshUI();
                    }}
                    className="px-4 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-500 transition-all flex items-center gap-1"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Lookup
                  </button>
                </div>

                {searchResult && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-blue-500/30 text-xs space-y-1 font-mono">
                    <div className="text-blue-400 font-bold">✓ PATIENT FOUND IN HASHMAP</div>
                    <div>ID: <span className="text-white">{searchResult.id}</span></div>
                    <div>Name: <span className="text-white">{searchResult.name}</span></div>
                    <div>Age/Gender: <span className="text-white">{searchResult.age} / {searchResult.gender}</span></div>
                    <div>Condition: <span className="text-amber-300">{searchResult.condition}</span></div>
                    <div>Severity: <span className="text-rose-400 font-bold">Level {searchResult.triageLevel}</span></div>
                    <div>Status: <span className="text-cyan-400">{searchResult.status}</span></div>
                  </div>
                )}
              </div>
            )}

            {/* Form 6 & 8: Reports / History info */}
            {(activeForm === 'history' || activeForm === 'report') && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  {activeForm === 'history' ? '6. Treatment History (Doubly Linked List)' : '8. Patient Reports (Sorting)'}
                </h3>
                <p className="text-xs text-slate-300">
                  {activeForm === 'history'
                    ? `Currently showing ${engine.treatmentHistory.length} completed treatment records in the Doubly Linked List log.`
                    : 'Configure sorting parameters below to reorder the master registry.'}
                </p>
                {activeForm === 'report' && (
                  <div className="flex items-center gap-2">
                    <select
                      value={reportSort}
                      onChange={(e) => {
                        setReportSort(e.target.value);
                        engine.generateSortedReports(e.target.value);
                        refreshUI();
                      }}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="severity">Sort by Severity (High to Low)</option>
                      <option value="age">Sort by Patient Age (Oldest First)</option>
                      <option value="name">Sort Alphabetically by Name</option>
                      <option value="id">Sort by Patient ID</option>
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live CLI Terminal & Command Prompt Output (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden font-mono shadow-inner">
          {/* Terminal Header Bar */}
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="text-xs font-bold text-slate-300 ml-2">Hospital_CLI_System_Terminal.exe</span>
            </div>
            <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              STATUS: READY
            </span>
          </div>

          {/* Terminal Screen Body */}
          <div className="p-4 flex-1 overflow-y-auto max-h-[380px] space-y-2 text-xs leading-relaxed">
            <div className="text-cyan-400 font-bold">
              =======================================================<br />
              &nbsp;&nbsp;HOSPITAL EMERGENCY MANAGEMENT SYSTEM (C++ STL)<br />
              =======================================================
            </div>
            <div className="text-slate-400 text-[11px]">
              1. Register Patient &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 5. Search Patient<br />
              2. Add Emergency Patient &nbsp;&nbsp; 6. View Treatment History<br />
              3. Add Normal Patient &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 7. Undo Last Operation<br />
              4. Treat Next Patient &nbsp;&nbsp;&nbsp;&nbsp; 8. Patient Reports (Sorting)<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 9. Reset Engine
            </div>
            <div className="border-b border-slate-800 my-2" />

            {/* Live Terminal Output Stream */}
            {engine.terminalLogs.slice(-12).map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-slate-500 text-[10px] font-mono shrink-0">[{log.timestamp}]</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  log.type === 'EMERGENCY' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  log.type === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  log.type === 'TREATMENT' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                  log.type === 'UNDO' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  log.type === 'ERROR' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {log.type}
                </span>
                <span className="text-slate-200">{log.message}</span>
              </div>
            ))}
          </div>

          {/* Interactive Command Input Prompt */}
          <form onSubmit={handleCommandSubmit} className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <span className="text-cyan-400 font-bold text-xs pl-2">HOSPITAL_SYS&gt;</span>
            <input
              type="text"
              placeholder="Type menu number (1-9) or click buttons on left..."
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-emerald-400 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-1 shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Exec
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
