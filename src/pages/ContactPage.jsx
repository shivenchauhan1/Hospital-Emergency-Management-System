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
  Phone, 
  Globe 
} from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalStore';

export default function ContactPage() {
  const [formSent, setFormSent] = useState(false);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Emergency Resuscitation Inquiry',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setContactData({ name: '', email: '', phone: '', subject: 'Emergency Resuscitation Inquiry', message: '' });
      setFormSent(false);
    }, 4000);
  };

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Header Banner */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <PhoneCall className="w-8 h-8 text-[#00695C]" />
            Hospital Address, Helpline & Emergency Desk
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Located at Sector 32, Chandigarh. 24x7 Emergency Resuscitation, 108 Ambulance Hotline, and Reception Desk.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        {/* Left Column: Hospital Credentials & Google Map */}
        <div className="lg:col-span-5 space-y-6">
          {/* Emergency Helpline Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 border border-red-900/60 shadow-xl text-white space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600/30 border border-red-500 flex items-center justify-center text-red-400">
                <Phone className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] text-red-300 font-extrabold uppercase tracking-wider block">24x7 Emergency Line</span>
                <h3 className="text-xl font-black text-white">Trauma Resuscitation Desk</h3>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-red-800/80 font-mono text-center space-y-1">
              <div className="text-xs text-red-300 font-bold">EMERGENCY HELPLINE:</div>
              <div className="text-xl sm:text-2xl font-black text-red-400">{HOSPITAL_INFO.emergencyHelpline}</div>
              <div className="text-xs text-teal-300 font-bold">108 AMBULANCE: {HOSPITAL_INFO.ambulanceNumber}</div>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Reception Desk: <strong>{HOSPITAL_INFO.receptionNumber}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{HOSPITAL_INFO.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{HOSPITAL_INFO.website}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{HOSPITAL_INFO.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Hospital Address & Google Maps Link */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#00695C]" />
              <h3 className="text-base font-extrabold text-slate-900">Hospital Address & Location</h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold leading-relaxed">
              {HOSPITAL_INFO.address}
            </div>

            {/* Map Preview Simulation */}
            <div className="h-52 bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-950/40 via-slate-900 to-slate-950 pointer-events-none" />
              <div className="text-center space-y-2 relative z-10">
                <div className="inline-block p-3 rounded-full bg-[#00695C]/40 border border-teal-400 text-teal-300">
                  <Building2 className="w-8 h-8" />
                </div>
                <div className="text-xs font-mono font-bold text-white">Sector 32 Chandigarh Location Pin</div>
                <a 
                  href="https://maps.google.com/?q=Sector+32+Chandigarh" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#00695C] hover:bg-teal-700 shadow-md"
                >
                  Open in Google Maps ➔
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Send Direct Hospital Inquiry</h3>
            <p className="text-xs text-slate-500 mt-1">
              For OPD consultations, doctor appointments, bed reservations, or emergency transfer inquiries.
            </p>
          </div>

          {formSent ? (
            <div className="p-8 rounded-2xl bg-teal-50 border border-teal-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#00695C] mx-auto animate-bounce" />
              <h4 className="text-lg font-black text-slate-900">Inquiry Transmitted to Sanjeevani Desk!</h4>
              <p className="text-xs text-slate-600">
                Our reception team will contact you on your provided phone number shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="rahul.sharma@example.com"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                  <select
                    value={contactData.subject}
                    onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                  >
                    <option>Emergency Resuscitation Inquiry</option>
                    <option>Doctor Consultation Booking</option>
                    <option>108 Ambulance Dispatch Request</option>
                    <option>ICU & Ward Bed Reservation</option>
                    <option>NABL Blood Bank Requisition</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Message Details</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Describe your medical query or patient transfer request..."
                  value={contactData.message}
                  onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-extrabold text-xs text-white bg-[#00695C] hover:bg-teal-800 shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Hospital Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
