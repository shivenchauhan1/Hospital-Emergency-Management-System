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
import { DAILY_ADMISSIONS_TREND, HOSPITAL_INFO } from '../data/hospitalStore';

export default function DashboardPage({ patients, emergencyCases, doctors, ambulances, beds, bloodBank, setActivePage }) {
  // Exact Specified Indian Hospital Dashboard Metrics:
  const patientsTodayCount = 127;
  const emergencyCasesCount = 34;
  const doctorsAvailableCount = 58;
  const icuBedsCount = 22;
  const generalBedsCount = 148;
  const ambulancesCount = 11;
  const bloodUnitsCount = 320;

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Header Banner */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="text-xs font-extrabold text-[#00695C] uppercase tracking-wider">Hospital Live Operations</div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <Activity className="w-8 h-8 text-[#00695C]" />
            Sanjeevani Central Command Dashboard
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real-time monitoring of emergency admissions, doctor shifts, bed matrix, 108 ambulances, and blood inventory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('emergency')}
            className="px-4 py-2.5 rounded-xl font-extrabold text-xs bg-[#D32F2F] text-white hover:bg-red-700 shadow-md shadow-red-600/20 transition-all flex items-center gap-2"
          >
            <Siren className="w-4 h-4 animate-bounce" />
            <span>24x7 Emergency Triage</span>
          </button>
        </div>
      </div>

      {/* 7 SPECIFIED METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4 w-full">
        {/* Card 1: Patients Today */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5 hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Patients Today</span>
            <Users className="w-4 h-4 text-[#00695C]" />
          </div>
          <div className="text-2xl font-black text-slate-900">{patientsTodayCount}</div>
          <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14 Admissions
          </div>
        </div>

        {/* Card 2: Emergency Cases */}
        <div className="p-4 rounded-2xl bg-white border border-red-200 bg-red-50/40 shadow-sm space-y-1.5 hover:border-red-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-red-700 uppercase">Emergency Cases</span>
            <Siren className="w-4 h-4 text-red-600 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-red-700">{emergencyCasesCount}</div>
          <div className="text-[10px] text-red-600 font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> 8 Critical Resus
          </div>
        </div>

        {/* Card 3: Doctors Available */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5 hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Doctors Available</span>
            <Stethoscope className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{doctorsAvailableCount}</div>
          <div className="text-[10px] text-emerald-600 font-bold">On Active Duty</div>
        </div>

        {/* Card 4: ICU Beds */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5 hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">ICU Beds Free</span>
            <HeartPulse className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{icuBedsCount}</div>
          <div className="text-[10px] text-purple-600 font-bold">Critical Care Beds</div>
        </div>

        {/* Card 5: General Beds */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5 hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">General Beds Free</span>
            <Bed className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{generalBedsCount}</div>
          <div className="text-[10px] text-blue-600 font-bold">Ward Capacity</div>
        </div>

        {/* Card 6: Ambulances */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5 hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Ambulances Ready</span>
            <Truck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{ambulancesCount}</div>
          <div className="text-[10px] text-indigo-600 font-bold">108 Fleet Units</div>
        </div>

        {/* Card 7: Blood Units */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5 hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Blood Reserves</span>
            <Droplet className="w-4 h-4 text-red-500 fill-red-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{bloodUnitsCount}</div>
          <div className="text-[10px] text-red-500 font-bold">Units in NABL Bank</div>
        </div>
      </div>

      {/* 2 CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Chart 1: Emergency Cases This Week */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Emergency Triage Arrivals This Week</h3>
              <p className="text-xs text-slate-500">24x7 ER Triage intake at Sanjeevani Chandigarh</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-red-50 text-red-600 border border-red-200">
              Weekly Total: 279 Cases
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DAILY_ADMISSIONS_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="emergencyArrivals" name="Emergency Cases" fill="#D32F2F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Patient Admission Trend */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Patient Admission & Discharge Volume</h3>
              <p className="text-xs text-slate-500">Daily admissions vs. successful discharges</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-teal-50 text-[#00695C] border border-teal-200">
              Avg: 131 Admissions/Day
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DAILY_ADMISSIONS_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="admissions" name="Admissions" stroke="#00695C" fill="#26A69A" fillOpacity={0.25} strokeWidth={2.5} />
                <Area type="monotone" dataKey="discharges" name="Discharges" stroke="#3B82F6" fill="#93C5FD" fillOpacity={0.2} strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY TABLE */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#00695C]" />
            <h3 className="text-base font-extrabold text-slate-900">Recent Indian Patient Emergency Arrivals</h3>
          </div>
          <button 
            onClick={() => setActivePage('patients')}
            className="text-xs font-bold text-[#00695C] hover:underline"
          >
            View All Patients ➔
          </button>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse font-sans min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-3">Time</th>
                <th className="p-3">Patient ID</th>
                <th className="p-3">Patient Name</th>
                <th className="p-3">Diagnosis</th>
                <th className="p-3">Attending Doctor</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.slice(0, 7).map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 text-slate-400 font-mono">10:45 AM</td>
                  <td className="p-3 font-bold text-[#00695C] font-mono">{p.id}</td>
                  <td className="p-3 font-extrabold text-slate-900">{p.name}</td>
                  <td className="p-3 text-slate-700 font-medium">{p.condition}</td>
                  <td className="p-3 text-slate-700 font-semibold">{p.doctor}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      p.status === 'Critical' ? 'bg-red-100 text-red-800 border border-red-200' :
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
