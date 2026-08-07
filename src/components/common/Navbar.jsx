import React, { useState } from 'react';
import { 
  HeartPulse, 
  Home, 
  LayoutDashboard, 
  Users, 
  Siren, 
  Stethoscope, 
  Truck, 
  Bed, 
  Droplet, 
  BarChart3, 
  PhoneCall, 
  Menu, 
  X, 
  Phone, 
  Award, 
  Clock 
} from 'lucide-react';
import { HOSPITAL_INFO } from '../../data/hospitalStore';

export default function Navbar({ activePage, setActivePage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'emergency', label: 'Emergency', icon: Siren, highlight: true },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'ambulance', label: 'Ambulance', icon: Truck },
    { id: 'beds', label: 'Beds', icon: Bed },
    { id: 'bloodbank', label: 'Blood Bank', icon: Droplet },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'contact', label: 'Contact', icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm transition-all">
      {/* 3. TOP GREEN STRIP (#00695C) */}
      <div className="bg-[#00695C] text-white text-xs font-semibold py-2 px-4 sm:px-8 w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] sm:text-xs">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping inline-block" />
              <span>🚑 Emergency Helpline:</span>
              <a href="tel:112" className="text-teal-200 hover:text-white underline font-extrabold">{HOSPITAL_INFO.emergencyHelpline}</a>
            </div>

            <div className="flex items-center gap-1.5">
              <span>📞 Ambulance:</span>
              <a href="tel:108" className="text-teal-200 hover:text-white font-extrabold">{HOSPITAL_INFO.ambulanceNumber}</a>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-5 text-[11px] sm:text-xs text-teal-100 font-medium">
            <div className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-teal-300" />
              <span>🩺 NABH Accredited Hospital</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-300" />
              <span>🕒 Open 24×7</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION BAR */}
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Hospital Brand Logo */}
        <div 
          onClick={() => setActivePage('home')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#00695C] to-[#26A69A] p-0.5 shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-[#00695C]">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Sanjeevani</span>
              <span className="text-[#00695C]">Hospital</span>
            </h1>
            <p className="text-[10px] sm:text-[11px] font-bold text-[#00695C] tracking-wider italic">
              "{HOSPITAL_INFO.tagline}"
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? item.highlight
                      ? 'bg-[#D32F2F] text-white shadow-md shadow-red-600/20'
                      : 'bg-[#00695C] text-white shadow-md shadow-teal-800/20'
                    : item.highlight
                    ? 'text-red-700 bg-red-50 hover:bg-red-100 border border-red-200'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Emergency Quick Red Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('emergency')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-[#D32F2F] text-white hover:bg-red-700 shadow-md shadow-red-600/25 transition-all active:scale-95 shrink-0"
          >
            <Siren className="w-4 h-4 animate-bounce" />
            <span className="hidden sm:inline">Emergency Services</span>
            <span className="sm:hidden">24x7 Emergency</span>
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 shadow-xl w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#00695C] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-red-100 text-red-700 font-black">24x7</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
