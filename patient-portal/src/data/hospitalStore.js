export const HOSPITAL_INFO = {
  name: "Sanjeevani Multispeciality Hospital",
  tagline: "Caring for Life, Every Second Counts",
  address: "Sector 32, Chandigarh – 160030, Punjab, India",
  emergencyHelpline: "+91 112",
  ambulanceNumber: "108",
  receptionNumber: "+91 172 456 7890",
  email: "info@sanjeevanihospital.in",
  website: "www.sanjeevanihospital.in",
  workingHours: "24×7 Emergency Services",
  accreditation: "NABH & NABL Accredited Multispeciality Hospital"
};

export const INITIAL_DOCTORS = [
  { id: "DOC-101", name: "Dr. Rajesh Sharma", department: "Cardiology", specialization: "Interventional Cardiology & Cardiac Arrest", experience: "24 Years", availability: "Available", contact: "+91 172 456 7801", email: "dr.sharma@sanjeevanihospital.in" },
  { id: "DOC-102", name: "Dr. Priya Mehta", department: "Neurology", specialization: "Neurosurgery & Acute Brain Stroke", experience: "19 Years", availability: "Available", contact: "+91 172 456 7802", email: "dr.mehta@sanjeevanihospital.in" },
  { id: "DOC-103", name: "Dr. Vivek Singh", department: "Emergency Medicine", specialization: "Level 1 Trauma & Resuscitation", experience: "16 Years", availability: "Available", contact: "+91 172 456 7803", email: "dr.singh@sanjeevanihospital.in" },
  { id: "DOC-104", name: "Dr. Kavita Kapoor", department: "Pediatrics", specialization: "Pediatric Emergency & Neonatal ICU", experience: "15 Years", availability: "Available", contact: "+91 172 456 7804", email: "dr.kapoor@sanjeevanihospital.in" }
];

export const INITIAL_EMERGENCY_CASES = [
  { id: "ER20260012", patient: "Rahul Sharma", patientName: "Rahul Sharma", age: 42, gender: "Male", phone: "9876543210", emergencyType: "Accident", priority: "Critical", emergencyLevel: "Critical", status: "Pending", doctor: null, assignedDoctor: "Unassigned", ambulance: null, ambulanceDispatched: "None", address: "Sector 32, Chandigarh", description: "Collision trauma near Tribune Chowk", createdAt: "2026-08-07T10:25:00.000Z" }
];

export const INITIAL_AMBULANCES = [
  { id: "AMB-01", number: "PB01AB1234", driver: "Gurpreet Singh", location: "Sector 17 Plaza, Chandigarh", status: "Available" },
  { id: "AMB-02", number: "CH02CD5678", driver: "Manjit Sharma", location: "Tribune Chowk, Chandigarh", status: "On Route" }
];

export const INITIAL_BEDS = Array.from({ length: 30 }, (_, i) => ({
  id: `BED-${i + 1}`,
  bedNumber: `Bed-${i < 10 ? 'ICU' : 'GEN'}-${i + 1}`,
  status: i % 3 === 0 ? 'Occupied' : 'Available'
}));
