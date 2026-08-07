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
  Phone 
} from 'lucide-react';

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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      {/* Emergency Top Hotline Bar */}
      <div className="bg-[#0F766E] text-white text-[11px] font-medium py-1.5 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-ping inline-block" />
          <span className="font-bold uppercase tracking-wider">24/7 St. Jude Hospital Trauma Hotline:</span>
          <a href="tel:911" className="font-bold text-teal-200 underline hover:text-white transition-colors">
            1-800-EMERGENCY-911
          </a>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-teal-100">
          <span>Level 1 Trauma Center</span>
          <span>•</span>
          <span>ICU & Cardiac Resuscitation Active</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Hospital Brand Logo */}
        <div 
          onClick={() => setActivePage('home')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0F766E] to-[#14B8A6] p-0.5 shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-[#0F766E]">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>St. Jude</span>
              <span className="text-[#0F766E]">HEMS</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
              Hospital Emergency Management System
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200">
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
                      ? 'bg-[#DC2626] text-white shadow-md shadow-red-500/20'
                      : 'bg-[#0F766E] text-white shadow-md shadow-teal-700/20'
                    : item.highlight
                    ? 'text-red-600 bg-red-50 hover:bg-red-100 border border-red-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Emergency Quick Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('emergency')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-[#DC2626] text-white hover:bg-red-700 shadow-md shadow-red-600/25 transition-all active:scale-95 shrink-0"
          >
            <Siren className="w-4 h-4 animate-bounce" />
            <span>Emergency Services</span>
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 shadow-xl">
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
                    ? 'bg-[#0F766E] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-red-100 text-red-700 font-black">HOT</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
