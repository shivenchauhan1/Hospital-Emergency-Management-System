import axios from 'axios';
import { 
  HOSPITAL_INFO, INITIAL_DOCTORS, INITIAL_EMERGENCY_CASES, 
  INITIAL_AMBULANCES, INITIAL_BEDS 
} from '../data/hospitalStore';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000
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
