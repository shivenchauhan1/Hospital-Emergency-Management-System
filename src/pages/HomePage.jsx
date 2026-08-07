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
  Droplet, 
  Calendar 
} from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalStore';

export default function HomePage({ setActivePage }) {
  return (
    <div className="w-full space-y-12 sm:space-y-16 pb-12">
      {/* 1. HERO SECTION */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#00695C] via-teal-950 to-slate-900 text-white p-6 sm:p-12 lg:p-16 shadow-2xl border border-teal-700/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#26A69A]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D32F2F]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Left Column Text & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-teal-500/20 text-teal-200 border border-teal-400/30">
              <ShieldCheck className="w-4 h-4 text-teal-300" />
              <span>{HOSPITAL_INFO.accreditation}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Sanjeevani <span className="bg-gradient-to-r from-teal-200 via-teal-100 to-white bg-clip-text text-transparent">Multispeciality Hospital</span>
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
              Providing Advanced Emergency Care with Compassion and Excellence. Located at Sector 32, Chandigarh, equipped with 500+ beds, 150+ specialist doctors, Level 1 Trauma Resuscitation, and 24x7 Ambulance dispatch.
            </p>

            {/* Hero Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActivePage('contact')}
                className="px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm bg-[#26A69A] hover:bg-teal-400 text-slate-950 shadow-xl shadow-teal-500/30 hover:scale-105 transition-all flex items-center gap-2 active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>

              <button
                onClick={() => setActivePage('emergency')}
                className="px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm bg-[#D32F2F] hover:bg-red-700 text-white shadow-xl shadow-red-600/30 hover:scale-105 transition-all flex items-center gap-2 active:scale-95"
              >
                <Siren className="w-4 h-4 animate-bounce" />
                <span>Emergency Services (24x7)</span>
              </button>
            </div>

            {/* Quick Badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-teal-800/60">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">24×7</div>
                <div className="text-xs text-teal-200 font-medium">Emergency Triage</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">108</div>
                <div className="text-xs text-teal-200 font-medium">Ambulance Hotline</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">Sector 32</div>
                <div className="text-xs text-teal-200 font-medium">Chandigarh, Punjab</div>
              </div>
            </div>
          </div>

          {/* Right Column Hospital Badge Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-gradient-to-tr from-slate-900 via-teal-950 to-slate-950 p-6 sm:p-8 rounded-3xl border border-teal-600/40 shadow-2xl space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 mx-auto shadow-inner">
                <HeartPulse className="w-10 h-10 animate-pulse text-teal-300" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-extrabold text-white">Sanjeevani Trauma Monitor</h3>
                <p className="text-xs text-teal-300">Level 1 Emergency & Resuscitation Active</p>
              </div>

              {/* Status List */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-slate-200 font-bold">Cardiac Resuscitation Room</span>
                  </div>
                  <span className="text-red-400 font-extrabold">Active</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-slate-200 font-bold">108 Ambulance Fleet</span>
                  </div>
                  <span className="text-emerald-400 font-extrabold">11 Units Ready</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                    <span className="text-slate-200 font-bold">ICU Beds Available</span>
                  </div>
                  <span className="text-teal-300 font-extrabold">22 / 50 Beds</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATISTICS CARDS (REQUIRED 4 CARDS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
        {/* Card 1: 500+ Beds */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#00695C] flex items-center justify-center font-bold">
            <Bed className="w-6 h-6" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900">500+</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hospital Beds</div>
        </div>

        {/* Card 2: 150+ Doctors */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#00695C] flex items-center justify-center font-bold">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900">150+</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Specialist Doctors</div>
        </div>

        {/* Card 3: 24×7 Emergency */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <Siren className="w-6 h-6" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900">24×7</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Emergency Care</div>
        </div>

        {/* Card 4: 50,000+ Patients Served */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900">50,000+</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patients Served</div>
        </div>
      </div>

      {/* 3. ABOUT SANJEEVANI HOSPITAL */}
      <div className="w-full bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-extrabold text-[#00695C] uppercase tracking-wider">About Sanjeevani Hospital</div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
            North India's Trusted Multispeciality Emergency Care Center
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Established at Sector 32, Chandigarh, Sanjeevani Multispeciality Hospital provides world-class emergency resuscitation, advanced cardiac catheterization labs, neurosurgery OTs, pediatric ICUs, and blood bank facilities 24 hours a day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#00695C] text-white flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Immediate Triage Protocol</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Immediate resuscitation for cardiac STEMI, stroke thrombolysis, eclampsia, and polytrauma cases within 3 minutes of arrival.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#00695C] text-white flex items-center justify-center font-bold">
              <Bed className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">500+ Bed Capacity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dedicated ICU towers, Cardiac Care Units (CCU), Neonatal NICUs, Emergency Bay wards, and Deluxe Private Patient suites.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#00695C] text-white flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">108 Ambulance Dispatch</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rapid response GPS-tracked Mobile ICU ambulances stationed across Chandigarh, Mohali, Panchkula, and Zirakpur.
            </p>
          </div>
        </div>
      </div>

      {/* 4. CORE CLINICAL SERVICES */}
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-extrabold text-[#00695C] uppercase tracking-wider">Clinical Departments</div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Specialized Emergency Departments</h2>
          </div>
          <button
            onClick={() => setActivePage('doctors')}
            className="text-xs font-bold text-[#00695C] hover:underline flex items-center gap-1"
          >
            <span>View All Doctors</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <div 
            onClick={() => setActivePage('emergency')}
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-red-400 hover:shadow-lg transition-all cursor-pointer space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Siren className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-red-600 transition-colors">
              Emergency & Trauma Resuscitation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              24/7 Level 1 Emergency Bay equipped with ventilators, defibrillators, shock trauma rooms, and bedside ultrasound.
            </p>
          </div>

          <div 
            onClick={() => setActivePage('doctors')}
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-lg transition-all cursor-pointer space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#00695C] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#00695C] transition-colors">
              Cardiology & Cardiac Surgery
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Primary angioplasty, pacemaker implantation, CABG surgeries, and dedicated Cardiac Intensive Care Unit (CCU).
            </p>
          </div>

          <div 
            onClick={() => setActivePage('bloodbank')}
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-red-400 hover:shadow-lg transition-all cursor-pointer space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Droplet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-red-600 transition-colors">
              24x7 NABL Blood Reserve
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instant availability of A+, A-, B+, B-, O+, O-, AB+ blood units, packed red cells, and fresh frozen plasma.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
