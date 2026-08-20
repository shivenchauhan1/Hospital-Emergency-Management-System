import axios from 'axios';
import { 
  HOSPITAL_INFO, INITIAL_DOCTORS, INITIAL_EMERGENCY_CASES, 
  INITIAL_AMBULANCES, INITIAL_BEDS 
} from '../data/hospitalStore';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://hospital-emergency-management-system-1qmx.onrender.com/api';
const RENDER_ROOT_URL = import.meta.env.VITE_SOCKET_URL || 'https://hospital-emergency-management-system-1qmx.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

// Render Free-Tier Cold-Start Warmup API Ping (60s timeout)
export const warmupBackendAPI = async () => {
  try {
    const res = await axios.get(RENDER_ROOT_URL, { timeout: 60000 });
    return { success: true, data: res.data };
  } catch (e) {
    console.warn('Backend warmup ping failed or timed out:', e.message);
    return { success: false, message: 'Cold start warmup failed' };
  }
};

export const fetchDoctors = async () => {
  try {
    const res = await api.get('/doctors');
    if (res.data && res.data.data && res.data.data.length > 0) {
      const data = res.data.data;
      data.isFallbackData = false;
      return data;
    }
  } catch (e) {
    console.warn('Backend API unavailable, using seed Doctors');
  }
  const fallback = [...INITIAL_DOCTORS];
  fallback.isFallbackData = true;
  return fallback;
};

export const fetchAmbulances = async () => {
  try {
    const res = await api.get('/ambulances');
    if (res.data && res.data.data && res.data.data.length > 0) {
      const data = res.data.data;
      data.isFallbackData = false;
      return data;
    }
  } catch (e) {
    console.warn('Backend API unavailable, using seed Ambulances');
  }
  const fallback = [...INITIAL_AMBULANCES];
  fallback.isFallbackData = true;
  return fallback;
};

export const fetchBeds = async () => {
  try {
    const res = await api.get('/beds');
    if (res.data && res.data.data && res.data.data.length > 0) {
      const data = res.data.data;
      data.isFallbackData = false;
      return data;
    }
  } catch (e) {
    console.warn('Backend API unavailable, using seed Beds');
  }
  const fallback = [...INITIAL_BEDS];
  fallback.isFallbackData = true;
  return fallback;
};

export const fetchBloodStock = async () => {
  try {
    const res = await api.get('/blood');
    if (res.data && res.data.data && res.data.data.length > 0) {
      const data = res.data.data;
      data.isFallbackData = false;
      return data;
    }
  } catch (e) {
    console.warn('Backend API unavailable, using seed Blood stock');
  }
  const fallback = [
    { group: 'A+', units: 65, status: 'Adequate' },
    { group: 'A-', units: 14, status: 'Low Stock' },
    { group: 'B+', units: 82, status: 'Adequate' },
    { group: 'B-', units: 9, status: 'Critical Shortage' },
    { group: 'AB+', units: 48, status: 'Adequate' },
    { group: 'AB-', units: 6, status: 'Critical Shortage' },
    { group: 'O+', units: 88, status: 'Adequate' },
    { group: 'O-', units: 8, status: 'Low Stock' }
  ];
  fallback.isFallbackData = true;
  return fallback;
};

export const fetchEmergencies = async () => {
  try {
    const res = await api.get('/emergency');
    if (res.data && res.data.data && res.data.data.length > 0) {
      const data = res.data.data;
      data.isFallbackData = false;
      return data;
    }
  } catch (e) {
    console.warn('Backend API unavailable, using seed Emergency cases');
  }
  const fallback = [...INITIAL_EMERGENCY_CASES];
  fallback.isFallbackData = true;
  return fallback;
};

// WRITE OPERATIONS - Return error object on failure (NO silent faking)
export const postEmergency = async (formData) => {
  try {
    const res = await api.post('/emergency', formData);
    return res.data;
  } catch (e) {
    console.error('Backend request failed:', e);
    return {
      success: false,
      message: 'Unable to reach the hospital server. Please check your connection and try again.'
    };
  }
};

export const registerNormalPatientAPI = async (formData) => {
  try {
    const res = await api.post('/patient/register', formData);
    return res.data;
  } catch (e) {
    console.error('Backend request failed:', e);
    return {
      success: false,
      message: 'Unable to reach the hospital server. Please check your connection and try again.'
    };
  }
};

export const bookAppointmentAPI = async (appointmentData) => {
  try {
    const res = await api.post('/appointment', appointmentData);
    return res.data;
  } catch (e) {
    console.error('Backend request failed:', e);
    return {
      success: false,
      message: 'Unable to reach the hospital server. Please check your connection and try again.'
    };
  }
};

export const fetchAppointmentsAPI = async () => {
  try {
    const res = await api.get('/appointment');
    if (res.data && res.data.data && res.data.data.length > 0) {
      const data = res.data.data;
      data.isFallbackData = false;
      return data;
    }
  } catch (e) {
    console.warn('Backend API unavailable, returning seed appointments');
  }
  const fallback = [
    { id: 'APT202600001', patientName: 'Rahul Sharma', doctorName: 'Dr. Rajesh Sharma', department: 'Cardiology', date: '2026-08-08', timeSlot: '10:00 AM - 10:30 AM', status: 'Appointment Requested' },
    { id: 'APT202600002', patientName: 'Pooja Verma', doctorName: 'Dr. Priya Mehta', department: 'Neurology', date: '2026-08-08', timeSlot: '02:00 PM - 02:30 PM', status: 'Approved' }
  ];
  fallback.isFallbackData = true;
  return fallback;
};

// Task 5: LRU Cache Diagnostic Report API
export const fetchPatientReportsAPI = async (patientId) => {
  try {
    const res = await api.get(`/patient/reports/${patientId}`);
    return res.data;
  } catch (e) {
    console.error('Backend request failed:', e);
    return {
      success: false,
      message: 'Unable to reach the hospital server. Please check your connection and try again.'
    };
  }
};

// Task 6: Union-Find Compatible Blood Group API
export const fetchCompatibleBloodAPI = async (group) => {
  try {
    const res = await api.get(`/blood/compatible/${group}`);
    return res.data;
  } catch (e) {
    console.error('Backend request failed:', e);
    return {
      success: false,
      message: 'Unable to reach the hospital server. Please check your connection and try again.'
    };
  }
};

export const requestBloodAPI = async (bloodReqData) => {
  try {
    const res = await api.post('/blood/request', bloodReqData);
    return res.data;
  } catch (e) {
    console.error('Backend request failed:', e);
    return {
      success: false,
      message: 'Unable to reach the hospital server. Please check your connection and try again.'
    };
  }
};

export default api;
