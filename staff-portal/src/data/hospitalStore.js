export const HOSPITAL_INFO = {
  name: "Sanjeevani Multispeciality Hospital",
  address: "Sector 32, Chandigarh – 160030, Punjab, India",
  emergencyHelpline: "+91 112",
  ambulanceNumber: "108"
};

export const INITIAL_DOCTORS = [
  { id: "DOC-101", name: "Dr. Rajesh Sharma", department: "Cardiology", availability: "Available" },
  { id: "DOC-102", name: "Dr. Priya Mehta", department: "Neurology", availability: "Available" },
  { id: "DOC-103", name: "Dr. Vivek Singh", department: "Emergency Medicine", availability: "Available" }
];

export const INITIAL_EMERGENCY_CASES = [
  { id: "ER20260012", patient: "Rahul Sharma", patientName: "Rahul Sharma", age: 42, emergencyType: "Accident", priority: "Critical", status: "Pending", doctor: null, ambulance: null, address: "Sector 32, Chandigarh" }
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
