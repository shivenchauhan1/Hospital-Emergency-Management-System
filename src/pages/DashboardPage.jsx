import React from 'react';
import { 
  Users, 
  Siren, 
  Stethoscope, 
  Bed, 
  HeartPulse, 
  Truck, 
  Droplet, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Activity, 
  AlertTriangle 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { WEEKLY_EMERGENCY_TREND } from '../data/hospitalStore';

export default function DashboardPage({ patients, emergencyCases, doctors, ambulances, beds, bloodBank, setActivePage }) {
  // Calculated Statistics
  const totalPatientsCount = patients.length;
  const activeEmergencyCount = emergencyCases.length;
  const availableDoctorsCount = doctors.filter(d => d.availability === 'Available').length;
  const availableBedsCount = beds.filter(b => b.status === 'Available').length;
  const icuBedsAvailable = beds.filter(b => b.type === 'ICU Bed' && b.status === 'Available').length;
  const availableAmbulancesCount = ambulances.filter(a => a.status === 'Available').length;
  const totalBloodUnits = bloodBank.reduce((sum, item) => sum + item.units, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <Activity className="w-8 h-8 text-[#0F766E]" />
            Hospital Command Dashboard
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real-time monitoring of clinical operations, bed availability, emergency triage, and medical staff.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('emergency')}
            className="px-4 py-2.5 rounded-xl font-extrabold text-xs bg-[#DC2626] text-white hover:bg-red-700 shadow-md shadow-red-600/20 transition-all flex items-center gap-2"
          >
            <Siren className="w-4 h-4 animate-bounce" />
            <span>Manage Emergency Cases</span>
          </button>
        </div>
      </div>

      {/* 7 STATISTIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
        {/* Card 1: Total Patients */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5 hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Patients</span>
            <Users className="w-4 h-4 text-[#0F766E]" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalPatientsCount}</div>
          <div className="text-[10px] text-teal-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% this week
          </div>
        </div>

        {/* Card 2: Emergency Cases */}
        <div className="p-4 rounded-2xl bg-white border border-red-200 bg-red-50/30 shadow-sm space-y-1.5 hover:border-red-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-red-600 uppercase">Emergency Cases</span>
            <Siren className="w-4 h-4 text-red-600 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-red-700">{activeEmergencyCount}</div>
          <div className="text-[10px] text-red-600 font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> 5 Critical Cases
          </div>
        </div>

        {/* Card 3: Available Doctors */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5 hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Doctors On Duty</span>
            <Stethoscope className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{availableDoctorsCount} / {doctors.length}</div>
          <div className="text-[10px] text-emerald-600 font-bold">Ready for Intake</div>
        </div>

        {/* Card 4: Available Beds */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5 hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Available Beds</span>
            <Bed className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{availableBedsCount} / 120</div>
          <div className="text-[10px] text-blue-600 font-bold">Total Wards</div>
        </div>

        {/* Card 5: ICU Beds */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5 hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">ICU Beds Free</span>
            <HeartPulse className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{icuBedsAvailable} / 25</div>
          <div className="text-[10px] text-purple-600 font-bold">Critical Beds</div>
        </div>

        {/* Card 6: Ambulances Available */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5 hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Ambulances Ready</span>
            <Truck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{availableAmbulancesCount} / {ambulances.length}</div>
          <div className="text-[10px] text-indigo-600 font-bold">Fleet Standby</div>
        </div>

        {/* Card 7: Blood Units */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5 hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Blood Reserves</span>
            <Droplet className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalBloodUnits}</div>
          <div className="text-[10px] text-red-500 font-bold">Units On Hand</div>
        </div>
      </div>

      {/* 2 CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Emergency Cases This Week */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Emergency Cases This Week</h3>
              <p className="text-xs text-slate-500">Daily triage count of critical and high-priority arrivals</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-red-50 text-red-600 border border-red-200">
              Weekly Total: 371
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_EMERGENCY_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="emergencyCases" name="Emergency Cases" fill="#DC2626" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Patient Admission Trend */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Patient Admission & Discharge Trend</h3>
              <p className="text-xs text-slate-500">Admissions vs. Discharge volume over the past 7 days</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-teal-50 text-[#0F766E] border border-teal-200">
              Net Admissions: +39
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_EMERGENCY_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="admissions" name="Admissions" stroke="#0F766E" fill="#14B8A6" fillOpacity={0.2} strokeWidth={2} />
                <Area type="monotone" dataKey="discharges" name="Discharges" stroke="#3B82F6" fill="#93C5FD" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY TABLE */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#0F766E]" />
            <h3 className="text-base font-extrabold text-slate-900">Recent Emergency & Clinical Activity</h3>
          </div>
          <button 
            onClick={() => setActivePage('patients')}
            className="text-xs font-bold text-[#0F766E] hover:underline"
          >
            View All Patients ➔
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-3">Time</th>
                <th className="p-3">Patient ID</th>
                <th className="p-3">Patient Name</th>
                <th className="p-3">Clinical Condition</th>
                <th className="p-3">Assigned Doctor</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.slice(0, 7).map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 text-slate-400 font-mono">14:25 AM</td>
                  <td className="p-3 font-bold text-slate-900 font-mono">{p.id}</td>
                  <td className="p-3 font-bold text-slate-900">{p.name}</td>
                  <td className="p-3 text-slate-600 font-medium">{p.condition}</td>
                  <td className="p-3 text-slate-700 font-semibold">{p.doctor}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      p.status === 'Critical' ? 'bg-red-100 text-red-700 border border-red-200' :
                      p.status === 'Admitted' ? 'bg-teal-100 text-teal-800 border border-teal-200' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
