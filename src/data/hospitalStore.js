// Sanjeevani Multispeciality Hospital Database Store (Chandigarh, India)

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

export const INITIAL_PATIENTS = [
  { id: "P-1001", name: "Rahul Sharma", age: 42, gender: "Male", bloodGroup: "O+", condition: "Acute Myocardial Infarction", doctor: "Dr. Rajesh Sharma", ward: "ICU Bay 3", status: "Critical", phone: "+91 98765 43210", address: "House 142, Sector 15, Chandigarh", emergencyContact: "Sunita Sharma (Spouse) - 98765 43211", history: "Hypertension, Smoking" },
  { id: "P-1002", name: "Priya Verma", age: 29, gender: "Female", bloodGroup: "A-", condition: "Fractured Tibia & Soft Tissue Trauma", doctor: "Dr. Anish Mukherjee", ward: "Ortho Ward 1", status: "Admitted", phone: "+91 98123 45678", address: "Flat 204, Phase 7, Mohali, Punjab", emergencyContact: "Vikram Verma (Husband) - 98123 45679", history: "No previous surgeries" },
  { id: "P-1003", name: "Ankit Singh", age: 35, gender: "Male", bloodGroup: "B+", condition: "Severe Dengue Fever & Low Platelets", doctor: "Dr. Sunita Rao", ward: "General Ward B", status: "Under Observation", phone: "+91 97654 32109", address: "SCF 45, Sector 22-D, Chandigarh", emergencyContact: "Gurpreet Singh (Brother) - 97654 32110", history: "Type 2 Diabetes" },
  { id: "P-1004", name: "Neha Kapoor", age: 61, gender: "Female", bloodGroup: "AB+", condition: "Acute Stroke & Hemiparesis", doctor: "Dr. Priya Mehta", ward: "Neuro ICU Bed 2", status: "Critical", phone: "+91 98888 77766", address: "Kothi 89, Sector 9, Panchkula, Haryana", emergencyContact: "Rajiv Kapoor (Son) - 98888 77767", history: "Chronic Hypertension" },
  { id: "P-1005", name: "Aman Gupta", age: 24, gender: "Male", bloodGroup: "O-", condition: "Acute Appendicitis", doctor: "Dr. Smita Deshmukh", ward: "Surgical Ward 2", status: "Pre-Op", phone: "+91 99150 12345", address: "House 512, Sector 34-C, Chandigarh", emergencyContact: "Ramesh Gupta (Father) - 99150 12346", history: "None" },
  { id: "P-1006", name: "Sneha Patel", age: 31, gender: "Female", bloodGroup: "A+", condition: "Third-Trimester Eclampsia", doctor: "Dr. Meenakshi Joshi", ward: "Maternity ICU Bed 1", status: "Critical", phone: "+91 98722 33445", address: "Flat 401, Sector 68, Mohali", emergencyContact: "Karan Patel (Spouse) - 98722 33446", history: "First Pregnancy" },
  { id: "P-1007", name: "Aarav Mehta", age: 7, gender: "Male", bloodGroup: "B-", condition: "Severe Asthma Attack", doctor: "Dr. Kavita Kapoor", ward: "Pediatric Bay 4", status: "Stable", phone: "+91 98144 55667", address: "House 302, Sector 40, Chandigarh", emergencyContact: "Pooja Mehta (Mother) - 98144 55668", history: "Dust Allergy" },
  { id: "P-1008", name: "Vikram Malhotra", age: 53, gender: "Male", bloodGroup: "AB-", condition: "Coronary Artery Disease & Angina", doctor: "Dr. Suresh Iyer", ward: "CCU Bed 4", status: "Admitted", phone: "+91 98555 66778", address: "Sector 8-C, Chandigarh", emergencyContact: "Anita Malhotra (Wife) - 98555 66779", history: "High Cholesterol" },
  { id: "P-1009", name: "Ananya Deshmukh", age: 22, gender: "Female", bloodGroup: "O+", condition: "Laceration & Burn Injuries", doctor: "Dr. Vivek Singh", ward: "Trauma Bay 2", status: "Under Observation", phone: "+91 98777 88990", address: "Phase 3B2, Mohali", emergencyContact: "Rohit Deshmukh (Brother) - 98777 88991", history: "None" },
  { id: "P-1010", name: "Rohan Joshi", age: 48, gender: "Male", bloodGroup: "A+", condition: "Acute Renal Calculus & Colic", doctor: "Dr. Harpreet Singh", ward: "Urology Ward 1", status: "Stable", phone: "+91 98111 22334", address: "Sector 11, Panchkula", emergencyContact: "Neelam Joshi (Wife) - 98111 22335", history: "Kidney Stones" },
  { id: "P-1011", name: "Kavya Reddy", age: 19, gender: "Female", bloodGroup: "B+", condition: "Severe Food Poisoning & Dehydration", doctor: "Dr. Sunita Rao", ward: "General Ward A", status: "Stable", phone: "+91 97800 11223", address: "Hostel 4, PU Campus, Sector 14, Chandigarh", emergencyContact: "Venkat Reddy (Father) - 97800 11224", history: "Gastritis" },
  { id: "P-1012", name: "Rajesh Kumar", age: 67, gender: "Male", bloodGroup: "O+", condition: "Congestive Cardiac Failure", doctor: "Dr. Rajesh Sharma", ward: "ICU Bed 5", status: "Critical", phone: "+91 98150 99887", address: "Village Burail, Sector 45, Chandigarh", emergencyContact: "Amit Kumar (Son) - 98150 99888", history: "Pacemaker implanted 2019" },
  { id: "P-1013", name: "Sunita Rao", age: 50, gender: "Female", bloodGroup: "A-", condition: "Acute Cholecystitis", doctor: "Dr. Smita Deshmukh", ward: "Surgical Ward 1", status: "Admitted", phone: "+91 98880 12345", address: "Sector 20-B, Chandigarh", emergencyContact: "Pradeep Rao (Spouse) - 98880 12346", history: "Gallbladder stones" },
  { id: "P-1014", name: "Devansh Verma", age: 12, gender: "Male", bloodGroup: "AB+", condition: "Typhoid & High Grade Fever", doctor: "Dr. Kavita Kapoor", ward: "Pediatric Ward 2", status: "Stable", phone: "+91 98760 54321", address: "Phase 11, Mohali", emergencyContact: "Sangeeta Verma (Mother) - 98760 54322", history: "Recurrent tonsillitis" },
  { id: "P-1015", name: "Ishaan Choudhury", age: 38, gender: "Male", bloodGroup: "O-", condition: "Traumatic Rib Fracture & Pneumothorax", doctor: "Dr. Vivek Singh", ward: "Trauma ICU Bed 1", status: "Critical", phone: "+91 98122 88776", address: "Sector 16, Panchkula", emergencyContact: "Maya Choudhury (Wife) - 98122 88777", history: "Polytrauma" }
];

export const INITIAL_DOCTORS = [
  { id: "DOC-101", name: "Dr. Rajesh Sharma", department: "Cardiology", specialization: "Interventional Cardiology & Cardiac Arrest", experience: "24 Years", availability: "Available", contact: "+91 172 456 7801", email: "dr.sharma@sanjeevanihospital.in", avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-102", name: "Dr. Priya Mehta", department: "Neurology", specialization: "Neurosurgery & Acute Brain Stroke", experience: "19 Years", availability: "Available", contact: "+91 172 456 7802", email: "dr.mehta@sanjeevanihospital.in", avatar: "https://images.unsplash.com/photo-1594824813566-88855ce78907?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-103", name: "Dr. Vivek Singh", department: "Emergency Medicine", specialization: "Level 1 Trauma & Resuscitation", experience: "16 Years", availability: "Available", contact: "+91 172 456 7803", email: "dr.singh@sanjeevanihospital.in", avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-104", name: "Dr. Kavita Kapoor", department: "Pediatrics", specialization: "Pediatric Emergency & Neonatal ICU", experience: "15 Years", availability: "Available", contact: "+91 172 456 7804", email: "dr.kapoor@sanjeevanihospital.in", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-105", name: "Dr. Anish Mukherjee", department: "Orthopedics", specialization: "Trauma Joint Replacement & Polytrauma", experience: "18 Years", availability: "In Surgery", contact: "+91 172 456 7805", email: "dr.mukherjee@sanjeevanihospital.in", avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-106", name: "Dr. Smita Deshmukh", department: "General Surgery", specialization: "Laparoscopic & Abdominal Emergency Surgery", experience: "14 Years", availability: "Available", contact: "+91 172 456 7806", email: "dr.deshmukh@sanjeevanihospital.in", avatar: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-107", name: "Dr. Suresh Iyer", department: "Cardiology", specialization: "Cardiothoracic & Vascular Surgery", experience: "22 Years", availability: "On Call", contact: "+91 172 456 7807", email: "dr.iyer@sanjeevanihospital.in", avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-108", name: "Dr. Sunita Rao", department: "Internal Medicine", specialization: "Critical Care & Infectious Diseases", experience: "17 Years", availability: "Available", contact: "+91 172 456 7808", email: "dr.rao@sanjeevanihospital.in", avatar: "https://images.unsplash.com/photo-1594824813566-88855ce78907?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-109", name: "Dr. Harpreet Singh", department: "Nephrology", specialization: "Dialysis & Acute Kidney Injury", experience: "13 Years", availability: "Available", contact: "+91 172 456 7809", email: "dr.hsingh@sanjeevanihospital.in", avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-110", name: "Dr. Meenakshi Joshi", department: "Gynecology", specialization: "High-Risk Obstetrics & Emergency Delivery", experience: "16 Years", availability: "In Surgery", contact: "+91 172 456 7810", email: "dr.mjoshi@sanjeevanihospital.in", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-111", name: "Dr. Tarun Agarwal", department: "Pulmonology", specialization: "Respiratory ICU & ARDS Care", experience: "12 Years", availability: "Available", contact: "+91 172 456 7811", email: "dr.tagarwal@sanjeevanihospital.in", avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-112", name: "Dr. Vandana Saxena", department: "Emergency Medicine", specialization: "Emergency Resuscitation & Poisoning", experience: "20 Years", availability: "Available", contact: "+91 172 456 7812", email: "dr.vsaxena@sanjeevanihospital.in", avatar: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=300" }
];

export const INITIAL_EMERGENCY_CASES = [
  { id: "EM-901", patientName: "Rahul Sharma", emergencyType: "Acute STEMI Cardiac Arrest", priority: "Red", priorityLabel: "Critical", arrivalTime: "10:14 AM", doctor: "Dr. Rajesh Sharma", status: "Under Cardiac Resuscitation", bedAssigned: "ICU Bay 3" },
  { id: "EM-902", patientName: "Neha Kapoor", emergencyType: "Acute Ischemic Stroke", priority: "Red", priorityLabel: "Critical", arrivalTime: "10:22 AM", doctor: "Dr. Priya Mehta", status: "Administering Thrombolysis", bedAssigned: "Neuro ICU 2" },
  { id: "EM-903", patientName: "Sneha Patel", emergencyType: "Severe Eclampsia & Seizure", priority: "Red", priorityLabel: "Critical", arrivalTime: "10:35 AM", doctor: "Dr. Meenakshi Joshi", status: "In Emergency OT", bedAssigned: "Maternity ICU 1" },
  { id: "EM-904", patientName: "Ishaan Choudhury", emergencyType: "Highway Collision Polytrauma", priority: "Red", priorityLabel: "Critical", arrivalTime: "10:40 AM", doctor: "Dr. Vivek Singh", status: "Chest Tube Insertion", bedAssigned: "Trauma ICU 1" },
  { id: "EM-905", patientName: "Priya Verma", emergencyType: "Compound Tibia Fracture", priority: "Orange", priorityLabel: "High", arrivalTime: "10:48 AM", doctor: "Dr. Anish Mukherjee", status: "Splinting & Analgesia", bedAssigned: "Ortho 1" },
  { id: "EM-906", patientName: "Aman Gupta", emergencyType: "Perforated Appendicitis", priority: "Orange", priorityLabel: "High", arrivalTime: "11:02 AM", doctor: "Dr. Smita Deshmukh", status: "Pre-Op Evaluation", bedAssigned: "Surgical 2" },
  { id: "EM-907", patientName: "Ankit Singh", emergencyType: "Severe Dengue & Thrombocytopenia", priority: "Yellow", priorityLabel: "Medium", arrivalTime: "11:15 AM", doctor: "Dr. Sunita Rao", status: "Platelet Transfusion", bedAssigned: "General B" },
  { id: "EM-908", patientName: "Aarav Mehta", emergencyType: "Acute Pediatric Wheezing", priority: "Yellow", priorityLabel: "Medium", arrivalTime: "11:28 AM", doctor: "Dr. Kavita Kapoor", status: "Nebulizer Therapy", bedAssigned: "Pediatric Bay 4" }
];

export const INITIAL_AMBULANCES = [
  { id: "AMB-01", number: "PB01AB1234", driver: "Gurpreet Singh", location: "Sector 17 Plaza, Chandigarh", status: "On Route", ETA: "5 mins", contact: "+91 98765 10801", type: "Advanced Life Support (ALS)" },
  { id: "AMB-02", number: "CH02CD5678", driver: "Manjit Sharma", location: "Tribune Chowk, Chandigarh", status: "On Route", ETA: "8 mins", contact: "+91 98765 10802", type: "Cardiac Resuscitation Ambulance" },
  { id: "AMB-03", number: "HR26XY1122", driver: "Rajesh Saini", location: "Hospital Bay 1, Sector 32", status: "Available", ETA: "Immediate", contact: "+91 98765 10803", type: "Advanced Life Support (ALS)" },
  { id: "AMB-04", number: "PB65BC9988", driver: "Harinder Gill", location: "Phase 7 Market, Mohali", status: "On Route", ETA: "12 mins", contact: "+91 98765 10804", type: "Basic Life Support (BLS)" },
  { id: "AMB-05", number: "CH01EF4321", driver: "Suresh Kumar", location: "Hospital Bay 2", status: "Available", ETA: "Immediate", contact: "+91 98765 10805", type: "Neonatal Transport Unit" },
  { id: "AMB-06", number: "HR10PQ8877", driver: "Amit Verma", location: "Zirakpur Flyover", status: "On Route", ETA: "7 mins", contact: "+91 98765 10806", type: "Trauma Care Ambulance" },
  { id: "AMB-07", number: "PB11MN3456", driver: "Balwinder Singh", location: "Central Workshop", status: "Maintenance", ETA: "N/A", contact: "+91 98765 10807", type: "Mobile ICU Unit" },
  { id: "AMB-08", number: "CH04JK7766", driver: "Deepak Yadav", location: "Sector 43 Bus Stand", status: "Available", ETA: "Immediate", contact: "+91 98765 10808", type: "Cardiac ALS Ambulance" },
  { id: "AMB-09", number: "HR51RS2211", driver: "Vikas Rana", location: "Hospital Bay 3", status: "Available", ETA: "Immediate", contact: "+91 98765 10809", type: "Basic Life Support (BLS)" },
  { id: "AMB-10", number: "PB08UV5544", driver: "Jaspal Kaur", location: "Panchkula Sector 20", status: "Available", ETA: "Immediate", contact: "+91 98765 10810", type: "ALS Trauma Ambulance" }
];

export const INITIAL_BEDS = Array.from({ length: 170 }, (_, i) => {
  const id = i + 1;
  let type = "General Bed";
  if (id <= 22) type = "ICU Bed";
  else if (id <= 50) type = "Emergency Bed";

  let status = "Available";
  if (id % 3 === 0) status = "Occupied";
  else if (id % 13 === 0) status = "Reserved";

  return {
    id: `BED-${id < 10 ? '00' : id < 100 ? '0' : ''}${id}`,
    bedNumber: `Bed-${type === 'ICU Bed' ? 'ICU' : type === 'Emergency Bed' ? 'ER' : 'GEN'}-${id}`,
    type,
    status,
    patientAssigned: status === 'Occupied' ? `Patient #${1000 + (id % 15) + 1}` : 'None',
    floor: type === 'ICU Bed' ? 'Floor 3 (ICU Tower)' : type === 'Emergency Bed' ? 'Floor 1 (ER Resuscitation)' : 'Floor 2 (General Ward)'
  };
});

export const INITIAL_BLOOD_BANK = [
  { id: "BB-01", group: "A+", units: 65, minRequired: 30, status: "Adequate Stock", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { id: "BB-02", group: "A-", units: 14, minRequired: 15, status: "Low Stock", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { id: "BB-03", group: "B+", units: 82, minRequired: 40, status: "Adequate Stock", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { id: "BB-04", group: "B-", units: 9, minRequired: 15, status: "Critical Shortage", color: "text-red-700 bg-red-50 border-red-200" },
  { id: "BB-05", group: "AB+", units: 48, minRequired: 20, status: "Adequate Stock", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { id: "BB-06", group: "AB-", units: 6, minRequired: 10, status: "Critical Shortage", color: "text-red-700 bg-red-50 border-red-200" },
  { id: "BB-07", group: "O+", units: 88, minRequired: 50, status: "Adequate Stock", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { id: "BB-08", group: "O-", units: 8, minRequired: 20, status: "Low Stock", color: "text-amber-700 bg-amber-50 border-amber-200" }
];

export const DAILY_ADMISSIONS_TREND = [
  { day: "Mon", admissions: 112, emergencyArrivals: 32, discharges: 94 },
  { day: "Tue", admissions: 124, emergencyArrivals: 38, discharges: 102 },
  { day: "Wed", admissions: 135, emergencyArrivals: 41, discharges: 110 },
  { day: "Thu", admissions: 128, emergencyArrivals: 34, discharges: 105 },
  { day: "Fri", admissions: 142, emergencyArrivals: 46, discharges: 118 },
  { day: "Sat", admissions: 150, emergencyArrivals: 52, discharges: 125 },
  { day: "Sun", admissions: 127, emergencyArrivals: 34, discharges: 98 }
];

export const EMERGENCY_RESPONSE_SPEED = [
  { timeRange: "0-3 Mins", count: 42 },
  { timeRange: "3-5 Mins", count: 35 },
  { timeRange: "5-8 Mins", count: 18 },
  { timeRange: "8+ Mins", count: 5 }
];

export const BED_OCCUPANCY_DATA = [
  { name: "ICU Beds", occupied: 28, total: 50 },
  { name: "Emergency Beds", occupied: 32, total: 50 },
  { name: "General Wards", occupied: 110, total: 170 }
];

export const DOCTOR_WORKLOAD_DATA = [
  { department: "Emergency", activeCases: 14 },
  { department: "Cardiology", activeCases: 12 },
  { department: "Orthopedics", activeCases: 9 },
  { department: "Neurology", activeCases: 8 },
  { department: "Pediatrics", activeCases: 7 }
];
