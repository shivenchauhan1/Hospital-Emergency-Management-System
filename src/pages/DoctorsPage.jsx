import React, { useState } from 'react';
import { 
  Stethoscope, 
  Search, 
  Phone, 
  Mail, 
  Award, 
  Clock, 
  CheckCircle2, 
  X, 
  Building2, 
  UserCheck, 
  Calendar 
} from 'lucide-react';

export default function DoctorsPage({ doctors }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Exact Requested Departments
  const departments = ['ALL', 'Cardiology', 'Neurology', 'Orthopedics', 'Emergency Medicine', 'Pediatrics', 'General Surgery', 'Nephrology', 'Gynecology'];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || doc.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Header Banner */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <Stethoscope className="w-8 h-8 text-[#00695C]" />
            Medical Specialists & Consultant Doctors
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            NABH accredited senior consultants, cardiologists, neurosurgeons, orthopedic surgeons, and emergency physicians.
          </p>
        </div>
        <div className="text-xs font-mono font-bold text-[#00695C] bg-teal-50 px-3.5 py-2 rounded-xl border border-teal-200">
          Total On-Duty Specialists: {doctors.length}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="w-full p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Doctor Name (e.g. Dr. Rajesh Sharma) or Specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
            />
          </div>
        </div>

        {/* Department Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 w-full">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedDept === dept
                  ? 'bg-[#00695C] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* DOCTOR CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Doctor Header */}
              <div className="flex items-center gap-4">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-200 shadow-sm"
                />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{doc.name}</h3>
                  <div className="text-xs font-bold text-[#00695C]">{doc.department}</div>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    doc.availability === 'Available' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    doc.availability === 'In Surgery' ? 'bg-red-100 text-red-800 border border-red-200' :
                    'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    ● {doc.availability}
                  </span>
                </div>
              </div>

              {/* Specialization & Exp */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                <div className="text-slate-400 font-bold text-[10px] uppercase">Specialization:</div>
                <div className="font-bold text-slate-800">{doc.specialization}</div>
                <div className="text-slate-500 flex items-center gap-1.5 pt-1 text-[11px]">
                  <Award className="w-3.5 h-3.5 text-[#00695C]" />
                  <span>Clinical Experience: <strong>{doc.experience}</strong></span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{doc.contact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono text-[11px] truncate">{doc.email}</span>
                </div>
              </div>
            </div>

            {/* Profile Action */}
            <button
              onClick={() => setSelectedDoctor(doc)}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 hover:bg-[#00695C] hover:text-white transition-colors text-center shadow-sm"
            >
              View Consultant Profile
            </button>
          </div>
        ))}
      </div>

      {/* VIEW DOCTOR PROFILE MODAL */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setSelectedDoctor(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <img
                src={selectedDoctor.avatar}
                alt={selectedDoctor.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-200 shadow-md"
              />
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedDoctor.name}</h3>
                <p className="text-xs font-bold text-[#00695C]">{selectedDoctor.department}</p>
                <p className="text-xs font-mono text-slate-400">{selectedDoctor.id}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div>
                <strong className="text-slate-900 block font-bold">Clinical Specialization:</strong>
                <p className="text-slate-600">{selectedDoctor.specialization}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Experience:</span>
                  <span className="font-extrabold text-slate-800">{selectedDoctor.experience}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Status:</span>
                  <span className="font-extrabold text-teal-800">{selectedDoctor.availability}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <strong className="text-slate-900 block font-bold">Contact Extension:</strong>
              <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200 space-y-1 font-mono text-slate-700">
                <div>Extension: {selectedDoctor.contact}</div>
                <div>Email: {selectedDoctor.email}</div>
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#00695C]"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
