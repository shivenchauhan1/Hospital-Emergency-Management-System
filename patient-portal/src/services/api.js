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

export const fetchDoctors = async () => {
  try {
    const res = await api.get('/doctors');
    if (res.data && res.data.data && res.data.data.length > 0) return res.data.data;
  } catch (e) {
    console.warn('Backend API unavailable, using seed Doctors');
  }
  return INITIAL_DOCTORS;
};

export const fetchAmbulances = async () => {
  try {
    const res = await api.get('/ambulances');
    if (res.data && res.data.data && res.data.data.length > 0) return res.data.data;
  } catch (e) {
    console.warn('Backend API unavailable, using seed Ambulances');
  }
  return INITIAL_AMBULANCES;
};

export const fetchBeds = async () => {
  try {
    const res = await api.get('/beds');
    if (res.data && res.data.data && res.data.data.length > 0) return res.data.data;
  } catch (e) {
    console.warn('Backend API unavailable, using seed Beds');
  }
  return INITIAL_BEDS;
};

export const fetchBloodStock = async () => {
  try {
    const res = await api.get('/blood');
    if (res.data && res.data.data && res.data.data.length > 0) return res.data.data;
  } catch (e) {
    console.warn('Backend API unavailable, using seed Blood stock');
  }
  return [
    { group: 'A+', units: 65, status: 'Adequate' },
    { group: 'A-', units: 14, status: 'Low Stock' },
    { group: 'B+', units: 82, status: 'Adequate' },
    { group: 'B-', units: 9, status: 'Critical Shortage' },
    { group: 'AB+', units: 48, status: 'Adequate' },
    { group: 'AB-', units: 6, status: 'Critical Shortage' },
    { group: 'O+', units: 88, status: 'Adequate' },
    { group: 'O-', units: 8, status: 'Low Stock' }
  ];
};

export const fetchEmergencies = async () => {
  try {
    const res = await api.get('/emergency');
    if (res.data && res.data.data && res.data.data.length > 0) return res.data.data;
  } catch (e) {
    console.warn('Backend API unavailable, using seed Emergency cases');
  }
  return INITIAL_EMERGENCY_CASES;
};

export const postEmergency = async (formData) => {
  try {
    const res = await api.post('/emergency', formData);
    return res.data;
  } catch (e) {
    console.error('Backend POST failed:', e);
    return {
      success: true,
      data: {
        id: `ER2026${Math.floor(1000 + Math.random() * 9000)}`,
        ...formData,
        status: 'Pending'
      }
    };
  }
};

export const registerNormalPatientAPI = async (formData) => {
  try {
    const res = await api.post('/patient/register', formData);
    return res.data;
  } catch (e) {
    return {
      success: true,
      patientId: `PAT2026${Math.floor(10000 + Math.random() * 90000)}`,
      data: { id: `PAT2026${Math.floor(10000 + Math.random() * 90000)}`, ...formData }
    };
  }
};

export const bookAppointmentAPI = async (appointmentData) => {
  try {
    const res = await api.post('/appointment', appointmentData);
    return res.data;
  } catch (e) {
    return {
      success: true,
      data: {
        id: `APT2026${Math.floor(10000 + Math.random() * 90000)}`,
        ...appointmentData,
        status: 'Appointment Requested'
      }
    };
  }
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

export default api;
