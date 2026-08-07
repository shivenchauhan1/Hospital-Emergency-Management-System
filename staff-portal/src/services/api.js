import axios from 'axios';
import { 
  HOSPITAL_INFO, INITIAL_DOCTORS, INITIAL_EMERGENCY_CASES, 
  INITIAL_AMBULANCES, INITIAL_BEDS 
} from '../data/hospitalStore';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://hospital-emergency-management-system-1qmx.onrender.com/api';

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

export const fetchPatients = async () => {
  try {
    const res = await api.get('/patients');
    if (res.data && res.data.data && res.data.data.length > 0) return res.data.data;
  } catch (e) {
    console.warn('Backend API unavailable, returning seed patients');
  }
  return [
    { id: 'SAN-2026-1001', name: 'Rahul Sharma', age: 42, gender: 'Male', phone: '+91 98765 43210', address: 'Sector 32, Chandigarh', bloodGroup: 'O+', status: 'Admitted', ward: 'ICU Tower', bedNumber: 'Bed-ICU-01', attendingDoctor: 'Dr. Rajesh Sharma', medicalHistory: 'Hypertension, Cardiac Observation' },
    { id: 'SAN-2026-1002', name: 'Pooja Verma', age: 34, gender: 'Female', phone: '+91 98765 54321', address: 'Sector 17, Chandigarh', bloodGroup: 'A+', status: 'Admitted', ward: 'General Ward', bedNumber: 'Bed-GEN-04', attendingDoctor: 'Dr. Priya Mehta', medicalHistory: 'Post-op observation' },
    { id: 'SAN-2026-1003', name: 'Gurpreet Singh', age: 58, gender: 'Male', phone: '+91 98765 67890', address: 'Mohali Phase 7, Punjab', bloodGroup: 'B+', status: 'Outpatient', ward: 'OPD Care', bedNumber: 'N/A', attendingDoctor: 'Dr. Vivek Singh', medicalHistory: 'Routine Triage Checkup' }
  ];
};

export const createPatientAPI = async (patientData) => {
  try {
    const res = await api.post('/patients', patientData);
    return res.data;
  } catch (e) {
    return { success: true, data: { id: `SAN-2026-${Math.floor(1000 + Math.random() * 9000)}`, ...patientData } };
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
    { id: 'STF-102', name: 'Vikramjit Singh', role: 'Admin', department: 'Executive Management', phone: '+91 172 456 7800', email: 'admin@sanjeevanihospital.in', status: 'Active' },
    { id: 'STF-103', name: 'Sunita Devi', role: 'Receptionist', department: 'Patient Intake', phone: '+91 172 456 7890', email: 'reception@sanjeevanihospital.in', status: 'Active' },
    { id: 'STF-104', name: 'Harpreet Kaur', role: 'Emergency Coordinator', department: 'Trauma & Resuscitation', phone: '+91 172 456 7810', email: 'emergency@sanjeevanihospital.in', status: 'Active' },
    { id: 'STF-105', name: 'Dr. Rekha Gupta', role: 'Blood Bank Officer', department: 'Transfusion Medicine', phone: '+91 172 456 7820', email: 'bloodbank@sanjeevanihospital.in', status: 'Active' }
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

export const dispatchAmbulanceAPI = async (id, ambulanceNumber) => {
  try {
    const res = await api.put('/emergency/dispatchAmbulance', { id, ambulanceNumber });
    return res.data;
  } catch (e) {
    console.warn('Backend dispatchAmbulance failed');
  }
};

export const allocateBedAPI = async (id, bedNumber) => {
  try {
    const res = await api.put('/emergency/allocateBed', { id, bedNumber });
    return res.data;
  } catch (e) {
    console.warn('Backend allocateBed failed');
  }
};

export default api;
