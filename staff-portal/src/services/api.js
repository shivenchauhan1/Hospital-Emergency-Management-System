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
      return res.data.data;
    }
  } catch (e) {
    console.warn('Backend API unavailable, using seed Doctors');
  }
  return [...INITIAL_DOCTORS];
};

export const fetchAmbulances = async () => {
  try {
    const res = await api.get('/ambulances');
    if (res.data && res.data.data) {
      return res.data.data;
    }
  } catch (e) {
    console.warn('Backend API unavailable, returning seed Ambulances');
  }
  return [...INITIAL_AMBULANCES];
};

export const fetchBeds = async () => {
  try {
    const res = await api.get('/beds');
    if (res.data && res.data.data && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch (e) {
    console.warn('Backend API unavailable, returning seed Beds');
  }
  return [...INITIAL_BEDS];
};

export const fetchStaffEmergencies = async () => {
  try {
    const res = await api.get('/emergency');
    if (res.data && res.data.data && res.data.data.length > 0) {
      const data = res.data.data;
      data.isFallbackData = false;
      return data;
    }
  } catch (e) {
    console.warn('Backend API unavailable, returning seed emergency cases');
  }
  const fallback = [...INITIAL_EMERGENCY_CASES];
  fallback.isFallbackData = true;
  return fallback;
};

// PriorityQueue Live Triage Console Endpoint
export const fetchEmergencyQueue = async () => {
  try {
    const res = await api.get('/emergency/queue');
    if (res.data && res.data.data) {
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      // If queue is empty (all cases non-pending), fall through to fetchStaffEmergencies
      if (data.length === 0) {
        const allRes = await api.get('/emergency');
        if (allRes.data && allRes.data.data && allRes.data.data.length > 0) {
          const allData = allRes.data.data;
          allData.isFallbackData = false;
          return allData;
        }
      }
      data.isFallbackData = false;
      return data;
    }
  } catch (e) {
    console.warn('Backend Queue API unavailable, returning seed emergency cases');
  }
  const fallback = [...INITIAL_EMERGENCY_CASES];
  fallback.isFallbackData = true;
  return fallback;
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

export const approveAppointmentAPI = async (id) => {
  try {
    const res = await api.put('/appointment/approve', { id });
    return res.data;
  } catch (e) {
    console.error('Backend request failed:', e);
    return { success: false, message: 'Unable to reach the hospital server. Please check your connection and try again.' };
  }
};

export const assignDoctorAppointmentAPI = async (id, doctorName) => {
  try {
    const res = await api.put('/appointment/assignDoctor', { id, doctorName });
    return res.data;
  } catch (e) {
    console.error('Backend request failed:', e);
    return { success: false, message: 'Unable to reach the hospital server. Please check your connection and try again.' };
  }
};

export const completeAppointmentAPI = async (id) => {
  try {
    const res = await api.put('/appointment/complete', { id });
    return res.data;
  } catch (e) {
    console.error('Backend request failed:', e);
    return { success: false, message: 'Unable to reach the hospital server. Please check your connection and try again.' };
  }
};

export const fetchPatients = async () => {
  try {
    const res = await api.get('/patients');
    if (res.data && res.data.data && res.data.data.length > 0) {
      const data = res.data.data;
      data.isFallbackData = false;
      return data;
    }
  } catch (e) {
    console.warn('Backend API unavailable, returning seed patients');
  }
  const fallback = [
    { id: 'PAT202600001', name: 'Rahul Sharma', age: 42, gender: 'Male', phone: '+91 98765 43210', address: 'Sector 32, Chandigarh', bloodGroup: 'O+', status: 'Admitted', ward: 'ICU Tower', bedNumber: 'Bed-ICU-01', attendingDoctor: 'Dr. Rajesh Sharma', medicalHistory: 'Hypertension, Cardiac Observation' },
    { id: 'PAT202600002', name: 'Pooja Verma', age: 34, gender: 'Female', phone: '+91 98765 54321', address: 'Sector 17, Chandigarh', bloodGroup: 'A+', status: 'Admitted', ward: 'General Ward', bedNumber: 'Bed-GEN-04', attendingDoctor: 'Dr. Priya Mehta', medicalHistory: 'Post-op observation' }
  ];
  fallback.isFallbackData = true;
  return fallback;
};

export const createPatientAPI = async (patientData) => {
  try {
    const res = await api.post('/patients', patientData);
    return res.data;
  } catch (e) {
    console.error('Backend request failed:', e);
    return { success: false, message: 'Unable to reach the hospital server. Please check your connection and try again.' };
  }
};

export const deletePatientAPI = async (id) => {
  try {
    const res = await api.delete(`/patients/${id}`);
    return res.data;
  } catch (e) {
    console.error('Backend request failed:', e);
    return { success: false, message: 'Unable to reach the hospital server. Please check your connection and try again.' };
  }
};

export const fetchStaffMembers = async () => {
  try {
    const res = await api.get('/staff');
    if (res.data && res.data.data && res.data.data.length > 0) {
      const data = res.data.data;
      data.isFallbackData = false;
      return data;
    }
  } catch (e) {
    console.warn('Backend API unavailable, returning seed staff');
  }
  const fallback = [
    { id: 'STF-101', name: 'Dr. Rajesh Sharma', role: 'Doctor', department: 'Cardiology', phone: '+91 172 456 7801', email: 'dr.sharma@sanjeevanihospital.in', status: 'Active' },
    { id: 'STF-102', name: 'Vikramjit Singh', role: 'Admin', department: 'Executive Management', phone: '+91 172 456 7800', email: 'admin@sanjeevanihospital.in', status: 'Active' }
  ];
  fallback.isFallbackData = true;
  return fallback;
};

export const createStaffAPI = async (staffData) => {
  try {
    const res = await api.post('/staff', staffData);
    return res.data;
  } catch (e) {
    console.error('Backend request failed:', e);
    return { success: false, message: 'Unable to reach the hospital server. Please check your connection and try again.' };
  }
};

export const approveEmergencyAPI = async (id) => {
  try {
    const res = await api.put('/emergency/approve', { id });
    return res.data;
  } catch (e) {
    console.error('Backend request failed:', e);
    return { success: false, message: 'Unable to reach the hospital server. Please check your connection and try again.' };
  }
};

export const assignDoctorAPI = async (id, doctorName) => {
  try {
    const res = await api.put('/emergency/assignDoctor', { id, doctorName });
    return res.data;
  } catch (e) {
    console.error('Backend request failed:', e);
    return { success: false, message: 'Unable to reach the hospital server. Please check your connection and try again.' };
  }
};

// Graph + Dijkstra Nearest Dispatch API
export const dispatchNearestAmbulanceAPI = async (caseId, address) => {
  try {
    const res = await api.post('/ambulances/dispatch', { caseId, address });
    return res.data;
  } catch (e) {
    console.error('Backend request failed:', e);
    return { success: false, message: 'Unable to reach the hospital server. Please check your connection and try again.' };
  }
};

// BedAllocator Greedy Free-List Allocation API
export const allocateBedAPI = async (category = 'General', priority = 'Medium', caseId = null) => {
  try {
    const res = await api.post('/beds/allocate', { category, priority, caseId });
    return res.data;
  } catch (e) {
    console.error('Backend request failed:', e);
    return { success: false, message: 'Unable to reach the hospital server. Please check your connection and try again.' };
  }
};

export const releaseBedAPI = async (bedId) => {
  try {
    const res = await api.post('/beds/release', { bedId });
    return res.data;
  } catch (e) {
    console.error('Backend request failed:', e);
    return { success: false, message: 'Unable to reach the hospital server. Please check your connection and try again.' };
  }
};

// LRUCache Diagnostic Reports API
export const fetchPatientReportsAPI = async (patientId) => {
  try {
    const res = await api.get(`/patient/reports/${patientId}`);
    return res.data;
  } catch (e) {
    console.error('Backend request failed:', e);
    return { success: false, message: 'Unable to reach the hospital server. Please check your connection and try again.' };
  }
};

// Union-Find Compatible Blood Stock API
export const fetchCompatibleBloodAPI = async (group) => {
  try {
    const res = await api.get(`/blood/compatible/${group}`);
    return res.data;
  } catch (e) {
    console.error('Backend request failed:', e);
    return { success: false, message: 'Unable to reach the hospital server. Please check your connection and try again.' };
  }
};

// Fetch full blood inventory
export const fetchBloodStock = async () => {
  try {
    const res = await api.get('/blood');
    if (res.data && res.data.data && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch (e) {
    console.warn('Backend API unavailable, returning default blood stock');
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

// Reset all dispatched ambulances back to Available
export const resetAmbulancesAPI = async () => {
  try {
    const res = await api.post('/ambulances/reset');
    return res.data;
  } catch (e) {
    console.error('Backend request failed:', e);
    return { success: false, message: 'Unable to reach the hospital server. Please check your connection and try again.' };
  }
};

export default api;

