import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  X, 
  Check, 
  Phone, 
  MapPin, 
  UserCheck, 
  FileText, 
  Heart 
} from 'lucide-react';

export default function PatientsPage({ patients, onAddPatient, onEditPatient, onDeletePatient }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodFilter, setBloodFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Form state
  const [patientForm, setPatientForm] = useState({
    id: '',
    name: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    condition: '',
    doctor: 'Dr. Rajesh Sharma',
    ward: 'General Ward 1',
    status: 'Admitted',
    phone: '',
    address: '',
    emergencyContact: '',
    history: ''
  });

  const handleOpenAddModal = () => {
    setPatientForm({
      id: `P-${1000 + patients.length + 1}`,
      name: '',
      age: '32',
      gender: 'Male',
      bloodGroup: 'O+',
      condition: '',
      doctor: 'Dr. Rajesh Sharma',
      ward: 'General Ward 1',
      status: 'Admitted',
      phone: '+91 98765 ',
      address: 'Sector 32, Chandigarh',
      emergencyContact: '',
      history: 'None'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (patient) => {
    setSelectedPatient(patient);
    setPatientForm({ ...patient });
    setIsEditModalOpen(true);
  };

  const handleOpenViewModal = (patient) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!patientForm.name) return;
    onAddPatient(patientForm);
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEditPatient(patientForm);
    setIsEditModalOpen(false);
  };

  // Filtered Patient List
  const filteredPatients = patients.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlood = bloodFilter === 'ALL' || p.bloodGroup === bloodFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesBlood && matchesStatus;
  });

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Header Banner */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#00695C]" />
            Patient Directory & Admission Registry
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Sanjeevani Hospital patient intake, medical history records, bed allocation, and attending specialist updates.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 rounded-2xl font-black text-xs sm:text-sm bg-[#00695C] hover:bg-teal-800 text-white shadow-md shadow-teal-700/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="w-full p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Patient Name (e.g. Rahul Sharma), ID, or Condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <select
              value={bloodFilter}
              onChange={(e) => setBloodFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#00695C]"
            >
              <option value="ALL">All Blood Groups</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#00695C]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Critical">Critical</option>
              <option value="Admitted">Admitted</option>
              <option value="Under Observation">Under Observation</option>
              <option value="Stable">Stable</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>

          <span className="text-xs font-mono text-slate-500 font-bold">
            Showing {filteredPatients.length} of {patients.length}
          </span>
        </div>
      </div>

      {/* PATIENT TABLE */}
      <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse font-sans min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider">
                <th className="p-4">Patient ID</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Age / Gender</th>
                <th className="p-4">Blood Group</th>
                <th className="p-4">Diagnosis</th>
                <th className="p-4">Assigned Doctor</th>
                <th className="p-4">Ward / Bed</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-500 italic">
                    No patient records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#00695C]">{p.id}</td>
                    <td className="p-4 font-extrabold text-slate-900">{p.name}</td>
                    <td className="p-4 text-slate-600 font-semibold">{p.age} Yrs / {p.gender}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-red-50 text-red-700 border border-red-200 font-mono">
                        {p.bloodGroup}
                      </span>
                    </td>
                    <td className="p-4 text-slate-800 font-semibold max-w-xs truncate">{p.condition}</td>
                    <td className="p-4 text-slate-700 font-medium">{p.doctor}</td>
                    <td className="p-4 text-slate-600 font-mono">{p.ward}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        p.status === 'Critical' ? 'bg-red-100 text-red-800 border border-red-200' :
                        p.status === 'Admitted' ? 'bg-teal-100 text-teal-800 border border-teal-200' :
                        p.status === 'Under Observation' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenViewModal(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#00695C] hover:bg-slate-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                          title="Edit Patient"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeletePatient(p.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 transition-colors"
                          title="Delete Patient"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP FORM MODAL (ADD / EDIT PATIENT) */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                {isAddModalOpen ? 'Register Patient - Sanjeevani Hospital' : `Edit Patient Record (${selectedPatient?.id})`}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter complete patient demographic, medical history, and emergency contact details.
              </p>
            </div>

            <form onSubmit={isAddModalOpen ? handleAddSubmit : handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name (e.g. Rahul Sharma)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={patientForm.name}
                    onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 42"
                    value={patientForm.age}
                    onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={patientForm.gender}
                    onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Blood Group</label>
                  <select
                    value={patientForm.bloodGroup}
                    onChange={(e) => setPatientForm({ ...patientForm, bloodGroup: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#00695C]"
                  >
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                    <option>O+</option>
                    <option>O-</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={patientForm.status}
                    onChange={(e) => setPatientForm({ ...patientForm, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                  >
                    <option>Critical</option>
                    <option>Admitted</option>
                    <option>Under Observation</option>
                    <option>Stable</option>
                    <option>Discharged</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Primary Medical Condition / Diagnosis</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute Myocardial Infarction"
                  value={patientForm.condition}
                  onChange={(e) => setPatientForm({ ...patientForm, condition: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Doctor</label>
                  <input
                    type="text"
                    value={patientForm.doctor}
                    onChange={(e) => setPatientForm({ ...patientForm, doctor: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Ward / Bed Location</label>
                  <input
                    type="text"
                    value={patientForm.ward}
                    onChange={(e) => setPatientForm({ ...patientForm, ward: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={patientForm.phone}
                    onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Emergency Kin Contact</label>
                  <input
                    type="text"
                    placeholder="e.g. Sunita Sharma (Spouse) - 98765 43211"
                    value={patientForm.emergencyContact}
                    onChange={(e) => setPatientForm({ ...patientForm, emergencyContact: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Residential Address (Chandigarh / Punjab / Haryana)</label>
                <input
                  type="text"
                  placeholder="e.g. House 142, Sector 15, Chandigarh"
                  value={patientForm.address}
                  onChange={(e) => setPatientForm({ ...patientForm, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Medical History & Prior Comorbidities</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Type 2 Diabetes, Hypertension"
                  value={patientForm.history}
                  onChange={(e) => setPatientForm({ ...patientForm, history: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00695C]"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-[#00695C] hover:bg-teal-800 shadow-md shadow-teal-700/20"
                >
                  {isAddModalOpen ? 'Save Patient Record' : 'Update Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {isViewModalOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#00695C] border border-teal-100 flex items-center justify-center font-black text-xl">
                {selectedPatient.bloodGroup}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{selectedPatient.name}</h2>
                <p className="text-xs font-mono font-bold text-[#00695C]">ID: {selectedPatient.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Age / Gender</span>
                <span className="font-extrabold text-slate-800">{selectedPatient.age} Yrs / {selectedPatient.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Status</span>
                <span className="font-extrabold text-teal-800">{selectedPatient.status}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Attending Specialist</span>
                <span className="font-extrabold text-slate-800">{selectedPatient.doctor}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Ward / Bed Location</span>
                <span className="font-extrabold text-slate-800">{selectedPatient.ward}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <strong className="text-slate-900 block font-bold">Medical Diagnosis:</strong>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">{selectedPatient.condition}</p>
              </div>

              <div>
                <strong className="text-slate-900 block font-bold">Address & Contact:</strong>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">{selectedPatient.address} ({selectedPatient.phone})</p>
              </div>

              <div>
                <strong className="text-slate-900 block font-bold">Emergency Kin Contact:</strong>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">{selectedPatient.emergencyContact}</p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsViewModalOpen(false)}
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
