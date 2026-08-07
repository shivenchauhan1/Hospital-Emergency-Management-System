import React from 'react';
import { HeartPulse, Phone, Mail, MapPin, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Hospital Brand & Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0F766E] flex items-center justify-center text-white font-extrabold shadow-lg">
                <HeartPulse className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">St. Jude Hospital</h3>
                <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">Emergency Management</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Providing state-of-the-art emergency resuscitation, trauma care, ICU monitoring, and rapid ambulance response 24 hours a day, 7 days a week.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Certified Level 1 Trauma Center</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Hospital Modules</h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button onClick={() => setActivePage('dashboard')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-teal-500" /> System Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('patients')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-teal-500" /> Patient Management
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('emergency')} className="hover:text-red-400 transition-colors flex items-center gap-1.5 font-bold text-red-400">
                  <ArrowRight className="w-3 h-3 text-red-500" /> Emergency Triage & Cases
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('doctors')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-teal-500" /> Medical Specialists & Doctors
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('ambulance')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-teal-500" /> Ambulance Dispatch & Tracking
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Clinical Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Facilities & Inventory</h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button onClick={() => setActivePage('beds')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-teal-500" /> Bed & ICU Management
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('bloodbank')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-teal-500" /> Blood Bank Inventory
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('reports')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-teal-500" /> Clinical Analytics & Reports
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('contact')} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-teal-500" /> Contact & Location Map
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Emergency Contacts */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">24/7 Emergency Contacts</h4>
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/80 flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-400 animate-bounce shrink-0" />
                <div>
                  <div className="text-[10px] text-red-300 font-bold uppercase">Trauma Hotline</div>
                  <div className="text-xs font-black text-white font-mono">+1 (800) 911-EMERGENCY</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>emergency@stjude-hospital.org</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <span>742 Evergreen Medical Complex, Chicago, IL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} St. Jude Hospital Emergency Management System. All Rights Reserved.</p>
          <div className="flex items-center gap-1">
            <span>Designed with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
            <span>for Healthcare Excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
