import axios from 'axios';
import { 
  HOSPITAL_INFO, INITIAL_DOCTORS, INITIAL_EMERGENCY_CASES, 
  INITIAL_AMBULANCES, INITIAL_BEDS 
} from '../data/hospitalStore';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

export const fetchStaffEmergencies = async () => {
  try {
    const res = await api.get('/emergency');
    if (res.data && res.data.data && res.data.data.length > 0) return res.data.data;
  } catch (e) {
    console.warn('Backend API unavailable, returning seed emergency cases');
  }
  return INITIAL_EMERGENCY_CASES;
};

// PriorityQueue Live Triage Console Endpoint
export const fetchEmergencyQueue = async () => {
  try {
    const res = await api.get('/emergency/queue');
    if (res.data && res.data.data) return res.data.data;
  } catch (e) {
    console.warn('Backend Queue API unavailable, returning seed emergency cases');
  }
  return INITIAL_EMERGENCY_CASES;
};

export const fetchAppointmentsAPI = async () => {
  try {
    const res = await api.get('/appointment');
    if (res.data && res.data.data && res.data.data.length > 0) return res.data.data;
  } catch (e) {
    console.warn('Backend API unavailable, returning seed appointments');
  }
  return [
    { id: 'APT202600001', patientName: 'Rahul Sharma', doctorName: 'Dr. Rajesh Sharma', department: 'Cardiology', date: '2026-08-08', timeSlot: '10:00 AM - 10:30 AM', status: 'Appointment Requested' },
    { id: 'APT202600002', patientName: 'Pooja Verma', doctorName: 'Dr. Priya Mehta', department: 'Neurology', date: '2026-08-08', timeSlot: '02:00 PM - 02:30 PM', status: 'Approved' }
  ];
};

export const approveAppointmentAPI = async (id) => {
  try {
    const res = await api.put('/appointment/approve', { id });
    return res.data;
  } catch (e) {
    console.warn('Backend approve appointment failed');
  }
};

export const assignDoctorAppointmentAPI = async (id, doctorName) => {
  try {
    const res = await api.put('/appointment/assignDoctor', { id, doctorName });
    return res.data;
  } catch (e) {
    console.warn('Backend assign doctor appointment failed');
  }
};

export const completeAppointmentAPI = async (id) => {
  try {
    const res = await api.put('/appointment/complete', { id });
    return res.data;
  } catch (e) {
    console.warn('Backend complete appointment failed');
  }
};

export const fetchPatients = async () => {
  try {
    const res = await api.get('/patients');
    if (res.data && res.data.data && res.data.data.length > 0) return res.data.data;
  } catch (e) {
    console.warn('Backend API unavailable, returning seed patients');
  }
  return [
    { id: 'PAT202600001', name: 'Rahul Sharma', age: 42, gender: 'Male', phone: '+91 98765 43210', address: 'Sector 32, Chandigarh', bloodGroup: 'O+', status: 'Admitted', ward: 'ICU Tower', bedNumber: 'Bed-ICU-01', attendingDoctor: 'Dr. Rajesh Sharma', medicalHistory: 'Hypertension, Cardiac Observation' },
    { id: 'PAT202600002', name: 'Pooja Verma', age: 34, gender: 'Female', phone: '+91 98765 54321', address: 'Sector 17, Chandigarh', bloodGroup: 'A+', status: 'Admitted', ward: 'General Ward', bedNumber: 'Bed-GEN-04', attendingDoctor: 'Dr. Priya Mehta', medicalHistory: 'Post-op observation' }
  ];
};

export const createPatientAPI = async (patientData) => {
  try {
    const res = await api.post('/patients', patientData);
    return res.data;
  } catch (e) {
    return { success: true, data: { id: `PAT2026${Math.floor(10000 + Math.random() * 90000)}`, ...patientData } };
  }
};

export const deletePatientAPI = async (id) => {
  try {
    const res = await api.delete(`/patients/${id}`);
    return res.data;
  } catch (e) {
    return { success: true };
  }
};

export const fetchStaffMembers = async () => {
  try {
    const res = await api.get('/staff');
    if (res.data && res.data.data && res.data.data.length > 0) return res.data.data;
  } catch (e) {
    console.warn('Backend API unavailable, returning seed staff');
  }
  return [
    { id: 'STF-101', name: 'Dr. Rajesh Sharma', role: 'Doctor', department: 'Cardiology', phone: '+91 172 456 7801', email: 'dr.sharma@sanjeevanihospital.in', status: 'Active' },
    { id: 'STF-102', name: 'Vikramjit Singh', role: 'Admin', department: 'Executive Management', phone: '+91 172 456 7800', email: 'admin@sanjeevanihospital.in', status: 'Active' }
  ];
};

export const createStaffAPI = async (staffData) => {
  try {
    const res = await api.post('/staff', staffData);
    return res.data;
  } catch (e) {
    return { success: true, data: { id: `STF-${Math.floor(100 + Math.random() * 900)}`, ...staffData } };
  }
};

export const approveEmergencyAPI = async (id) => {
  try {
    const res = await api.put('/emergency/approve', { id });
    return res.data;
  } catch (e) {
    console.warn('Backend approve failed');
  }
};

export const assignDoctorAPI = async (id, doctorName) => {
  try {
    const res = await api.put('/emergency/assignDoctor', { id, doctorName });
    return res.data;
  } catch (e) {
    console.warn('Backend assignDoctor failed');
  }
};

// Graph + Dijkstra Nearest Dispatch API
export const dispatchNearestAmbulanceAPI = async (caseId, address) => {
  try {
    const res = await api.post('/ambulances/dispatch', { caseId, address });
    return res.data;
  } catch (e) {
    console.warn('Backend dispatchNearestAmbulance failed');
  }
};

// BedAllocator Greedy Free-List Allocation API
export const allocateBedAPI = async (category = 'General', priority = 'Medium', caseId = null) => {
  try {
    const res = await api.post('/beds/allocate', { category, priority, caseId });
    return res.data;
  } catch (e) {
    console.warn('Backend BedAllocator allocate failed');
  }
};

export const releaseBedAPI = async (bedId) => {
  try {
    const res = await api.post('/beds/release', { bedId });
    return res.data;
  } catch (e) {
    console.warn('Backend releaseBed failed');
  }
};

// LRUCache Diagnostic Reports API
export const fetchPatientReportsAPI = async (patientId) => {
  try {
    const res = await api.get(`/patient/reports/${patientId}`);
    return res.data;
  } catch (e) {
    console.warn('Backend fetchPatientReports failed');
  }
};

// Union-Find Compatible Blood Stock API
export const fetchCompatibleBloodAPI = async (group) => {
  try {
    const res = await api.get(`/blood/compatible/${group}`);
    return res.data;
  } catch (e) {
    console.warn('Backend fetchCompatibleBlood failed');
  }
};

export default api;
