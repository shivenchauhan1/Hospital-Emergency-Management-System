import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  FileText, 
  Table, 
  CheckCircle2, 
  TrendingUp, 
  Activity, 
  Calendar 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  WEEKLY_EMERGENCY_TREND, 
  BED_OCCUPANCY_DATA, 
  DOCTOR_WORKLOAD_DATA 
} from '../data/hospitalStore';

export default function ReportsPage() {
  const [downloadNotice, setDownloadNotice] = useState('');

  const handleDownloadPDF = () => {
    setDownloadNotice('Generating PDF Clinical Audit Report...');
    setTimeout(() => {
      setDownloadNotice('✅ PDF Clinical Report Downloaded Successfully!');
      setTimeout(() => setDownloadNotice(''), 3000);
    }, 1200);
  };

  const handleDownloadExcel = () => {
    setDownloadNotice('Exporting Hospital Dataset to Excel (.xlsx)...');
    setTimeout(() => {
      setDownloadNotice('✅ Excel Data Export Downloaded Successfully!');
      setTimeout(() => setDownloadNotice(''), 3000);
    }, 1200);
  };

  const PIE_COLORS = ['#0F766E', '#DC2626', '#3B82F6'];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-[#0F766E]" />
            Clinical Analytics & Hospital Reports
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Statistical breakdown of patient intake, emergency response speed, ward occupancy, and specialist workload.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
          >
            <FileText className="w-4 h-4 text-teal-400" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handleDownloadExcel}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#0F766E] text-white hover:bg-teal-800 transition-all flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold text-center animate-fade-in">
          {downloadNotice}
        </div>
      )}

      {/* CHART 1 & 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Admissions & Discharges */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">Daily Admissions vs. Discharges</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEEKLY_EMERGENCY_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff' }} />
                <Line type="monotone" dataKey="admissions" name="Admissions" stroke="#0F766E" strokeWidth={3} />
                <Line type="monotone" dataKey="discharges" name="Discharges" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emergency Triage Cases */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">Emergency Triage Arrivals</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_EMERGENCY_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="emergencyCases" name="Emergency Arrivals" fill="#DC2626" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CHART 3 & 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bed Occupancy Distribution */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">Bed Occupancy Distribution Across Wards</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={BED_OCCUPANCY_DATA}
                  dataKey="occupied"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, occupied }) => `${name}: ${occupied} Beds`}
                >
                  {BED_OCCUPANCY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Doctor Workload Distribution */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">Doctor Active Workload by Department</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DOCTOR_WORKLOAD_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis type="number" stroke="#64748B" fontSize={12} />
                <YAxis dataKey="department" type="category" stroke="#64748B" fontSize={11} width={110} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="activeCases" name="Active Patients Assigned" fill="#14B8A6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
