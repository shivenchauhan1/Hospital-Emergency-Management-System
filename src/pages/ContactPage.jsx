import React, { useState } from 'react';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  Phone 
} from 'lucide-react';

export default function ContactPage() {
  const [formSent, setFormSent] = useState(false);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Emergency Inquiry',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setContactData({ name: '', email: '', phone: '', subject: 'Emergency Inquiry', message: '' });
      setFormSent(false);
    }, 4000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <PhoneCall className="w-8 h-8 text-[#0F766E]" />
            Hospital Emergency Contact & Location
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            24/7 Level 1 Trauma Center helpline, paramedic dispatch center, and direct medical inquiry form.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Hospital Details & Map */}
        <div className="lg:col-span-5 space-y-6">
          {/* Emergency Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-red-950 to-slate-900 border border-red-900/60 shadow-xl text-white space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600/30 border border-red-500 flex items-center justify-center text-red-400">
                <Phone className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] text-red-300 font-extrabold uppercase tracking-wider block">24/7 Hotline</span>
                <h3 className="text-xl font-black text-white">Trauma Resuscitation</h3>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-red-800/80 font-mono text-center space-y-1">
              <div className="text-xs text-red-300 font-bold">TOLL-FREE EMERGENCY LINE:</div>
              <div className="text-xl font-black text-white text-red-400">1-800-EMERGENCY-911</div>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400" />
                <span>emergency@stjude-hospital.org</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>Operating 365 Days / 24 Hours Non-Stop</span>
              </div>
            </div>
          </div>

          {/* Location Map Preview Simulation */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#0F766E]" />
              <h3 className="text-base font-extrabold text-slate-900">Hospital Complex Location</h3>
            </div>

            <p className="text-xs text-slate-600">
              742 Evergreen Medical Complex, Sector 4, Chicago, IL 60601
            </p>

            <div className="h-52 bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-950/40 via-slate-900 to-slate-950 pointer-events-none" />
              <div className="text-center space-y-2 relative z-10">
                <div className="inline-block p-3 rounded-full bg-[#0F766E]/40 border border-teal-400 text-teal-300">
                  <Building2 className="w-8 h-8" />
                </div>
                <div className="text-xs font-mono font-bold text-white">St. Jude Medical Complex GPS Pin</div>
                <div className="text-[10px] text-teal-300">Latitude: 41.8781° N | Longitude: 87.6298° W</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Send Direct Medical Inquiry</h3>
            <p className="text-xs text-slate-500 mt-1">
              Have questions regarding bed reservations, doctor consultations, or ambulance transfer? Contact our intake team.
            </p>
          </div>

          {formSent ? (
            <div className="p-8 rounded-2xl bg-teal-50 border border-teal-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#0F766E] mx-auto animate-bounce" />
              <h4 className="text-lg font-black text-slate-900">Inquiry Transmitted Successfully!</h4>
              <p className="text-xs text-slate-600">
                Our hospital emergency desk has received your message and will contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="s.jenkins@example.com"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Inquiry Subject</label>
                  <select
                    value={contactData.subject}
                    onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0F766E]"
                  >
                    <option>Emergency Triage Inquiry</option>
                    <option>Patient Bed Reservation</option>
                    <option>Specialist Doctor Appointment</option>
                    <option>Ambulance Dispatch Request</option>
                    <option>Blood Bank Transfusion</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Message Details</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Describe your medical query or emergency transfer request..."
                  value={contactData.message}
                  onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0F766E]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-extrabold text-xs text-white bg-[#0F766E] hover:bg-teal-800 shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Emergency Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
