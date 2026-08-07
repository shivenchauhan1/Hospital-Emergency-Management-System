import React from 'react';
import { 
  HeartPulse, 
  Siren, 
  Stethoscope, 
  Truck, 
  Bed, 
  ShieldCheck, 
  Clock, 
  Users, 
  Activity, 
  ArrowRight, 
  PhoneCall, 
  Building2, 
  CheckCircle2, 
  Zap, 
  Droplet 
} from 'lucide-react';

export default function HomePage({ setActivePage }) {
  return (
    <div className="space-y-16 pb-12">
      {/* 1. HERO SECTION */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0F766E] via-slate-900 to-slate-950 text-white p-6 sm:p-12 lg:p-16 shadow-2xl border border-teal-800/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#14B8A6]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column Text & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Siren className="w-4 h-4 text-red-400 animate-pulse" />
              <span>Hospital Emergency Management System</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Emergency Care When <span className="bg-gradient-to-r from-teal-300 via-teal-100 to-white bg-clip-text text-transparent">Every Second Matters.</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              St. Jude Hospital Emergency System coordinates rapid medical triage, real-time ICU bed allocation, ambulance dispatch tracking, blood inventory management, and specialist doctor availability in one unified clinical dashboard.
            </p>

            {/* Hero Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActivePage('dashboard')}
                className="px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm bg-[#14B8A6] hover:bg-teal-400 text-slate-950 shadow-xl shadow-teal-500/30 hover:scale-105 transition-all flex items-center gap-2 active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActivePage('emergency')}
                className="px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm bg-[#DC2626] hover:bg-red-700 text-white shadow-xl shadow-red-600/30 hover:scale-105 transition-all flex items-center gap-2 active:scale-95"
              >
                <Siren className="w-4 h-4 animate-bounce" />
                <span>Emergency Services</span>
              </button>
            </div>

            {/* Quick Badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-teal-900/60">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">24/7</div>
                <div className="text-xs text-teal-300 font-medium">Trauma Response</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">&lt; 5 Mins</div>
                <div className="text-xs text-teal-300 font-medium">Ambulance Dispatch</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                <div className="text-xs text-teal-300 font-medium">ICU Bed Tracking</div>
              </div>
            </div>
          </div>

          {/* Right Column Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-gradient-to-tr from-slate-900 to-teal-950 p-6 sm:p-8 rounded-3xl border border-teal-700/40 shadow-2xl space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 mx-auto shadow-inner">
                <HeartPulse className="w-10 h-10 animate-pulse text-teal-400" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-extrabold text-white">Live Emergency Monitor</h3>
                <p className="text-xs text-teal-300">Resuscitation & Trauma Triage Active</p>
              </div>

              {/* Status List */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-slate-200 font-bold">Critical Trauma Bay 1</span>
                  </div>
                  <span className="text-red-400 font-extrabold">Occupied</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-slate-200 font-bold">Ambulance Fleet</span>
                  </div>
                  <span className="text-emerald-400 font-extrabold">6 Units Available</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                    <span className="text-slate-200 font-bold">ICU Bed Occupancy</span>
                  </div>
                  <span className="text-teal-300 font-extrabold">18 / 25 Beds</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATISTICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-2">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-slate-900">1,240+</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patients Treated Monthly</div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-2">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <Siren className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-slate-900">50+</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Emergency Cases</div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-slate-900">15</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">On-Duty Specialists</div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-slate-900">10</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile ICU Ambulances</div>
        </div>
      </div>

      {/* 3. ABOUT SYSTEM */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-extrabold text-[#0F766E] uppercase tracking-wider">About The System</div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
            Intelligent Emergency Healthcare Infrastructure
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            St. Jude Hospital Emergency System delivers real-time clinical decision support to emergency room doctors, triage nurses, paramedic dispatchers, and blood bank coordinators. Designed for zero-delay patient intake and lifesaving intervention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F766E] text-white flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Rapid Triage & Priority</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Color-coded Emergency Severity Index (Red Critical, Orange High, Yellow Medium, Green Stable) ensuring immediate resuscitation for cardiac STEMI and trauma cases.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F766E] text-white flex items-center justify-center font-bold">
              <Bed className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Live Bed & ICU Occupancy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time monitoring across 120 beds in ICU, Emergency Bays, Surgical Units, and General Wards to eliminate admission delays.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F766E] text-white flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">GPS Ambulance Dispatch</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time fleet tracking with instant paramedic dispatch and direct communication between ambulances and ER shock rooms.
            </p>
          </div>
        </div>
      </div>

      {/* 4. EMERGENCY SERVICES MODULE HIGHLIGHTS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-extrabold text-[#0F766E] uppercase tracking-wider">Hospital Modules</div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Explore Core Clinical Services</h2>
          </div>
          <button
            onClick={() => setActivePage('dashboard')}
            className="text-xs font-bold text-[#0F766E] hover:text-teal-800 flex items-center gap-1"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Service Card 1 */}
          <div 
            onClick={() => setActivePage('emergency')}
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-red-300 hover:shadow-lg transition-all cursor-pointer space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Siren className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-red-600 transition-colors">
              Emergency & Trauma Unit
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              24/7 Level 1 Trauma Resuscitation, Cardiac STEMI protocols, stroke management, and pediatric emergency care.
            </p>
          </div>

          {/* Service Card 2 */}
          <div 
            onClick={() => setActivePage('doctors')}
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all cursor-pointer space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#0F766E] transition-colors">
              Medical Specialists
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Board-certified emergency physicians, neurosurgeons, cardiologists, orthopedic surgeons, and pediatricians on duty.
            </p>
          </div>

          {/* Service Card 3 */}
          <div 
            onClick={() => setActivePage('bloodbank')}
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-red-300 hover:shadow-lg transition-all cursor-pointer space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Droplet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-red-600 transition-colors">
              Blood Bank Reserve
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time inventory for A+, A-, B+, B-, O+, O-, AB+ blood units with automated shortage alerts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
