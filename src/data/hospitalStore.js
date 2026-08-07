// Comprehensive Hospital Emergency Management System Database & Store

export const INITIAL_PATIENTS = [
  { id: "P-1001", name: "Eleanor Vance", age: 45, gender: "Female", bloodGroup: "O+", condition: "Acute Chest Pain / STEMI", doctor: "Dr. Gregory House", ward: "ICU Unit 4", status: "Critical", phone: "+1 (555) 234-5678", address: "742 Evergreen Terrace, Springfield", emergencyContact: "Thomas Vance (Spouse) - 555-9012", history: "Hypertension, Hyperlipidemia" },
  { id: "P-1002", name: "Marcus Holloway", age: 28, gender: "Male", bloodGroup: "A-", condition: "Compound Radius Fracture", doctor: "Dr. Robert Chase", ward: "Ortho Ward 2", status: "Admitted", phone: "+1 (555) 345-6789", address: "123 Market St, San Francisco", emergencyContact: "Sitara Dhawan (Friend) - 555-8901", history: "No prior surgeries" },
  { id: "P-1003", name: "Dr. Sarah Jenkins", age: 62, gender: "Female", bloodGroup: "B+", condition: "Hypertensive Crisis", doctor: "Dr. Allison Cameron", ward: "Cardiology B", status: "Stable", phone: "+1 (555) 456-7890", address: "456 Elm Ave, Boston", emergencyContact: "Arthur Jenkins (Son) - 555-7890", history: "Type 2 Diabetes" },
  { id: "P-1004", name: "Devon Miller", age: 34, gender: "Male", bloodGroup: "AB+", condition: "Acute Respiratory Wheezing", doctor: "Dr. James Wilson", ward: "Pulmonary 1", status: "Admitted", phone: "+1 (555) 567-8901", address: "890 Pine Rd, Seattle", emergencyContact: "Rachel Miller (Wife) - 555-6789", history: "Asthma since childhood" },
  { id: "P-1005", name: "Sophia Chen", age: 19, gender: "Female", bloodGroup: "O-", condition: "Severe Anaphylaxis", doctor: "Dr. Lisa Cuddy", ward: "Emergency Bay 3", status: "Under Observation", phone: "+1 (555) 678-9012", address: "321 Oak St, Chicago", emergencyContact: "Grace Chen (Mother) - 555-5678", history: "Peanut Allergy" },
  { id: "P-1006", name: "David Kim", age: 52, gender: "Male", bloodGroup: "A+", condition: "Acute Appendicitis", doctor: "Dr. Eric Foreman", ward: "Surgical Ward 1", status: "Pre-Op", phone: "+1 (555) 789-0123", address: "555 Maple Dr, Austin", emergencyContact: "Jenny Kim (Wife) - 555-4567", history: "None" },
  { id: "P-1007", name: "Amanda Martinez", age: 31, gender: "Female", bloodGroup: "B-", condition: "Severe Migraine & Dehydration", doctor: "Dr. Remy Hadley", ward: "General Ward A", status: "Stable", phone: "+1 (555) 890-1234", address: "777 Cedar Ln, Miami", emergencyContact: "Carlos Martinez (Brother) - 555-3456", history: "Chronic Migraine" },
  { id: "P-1008", name: "James Wilson Jr.", age: 8, gender: "Male", bloodGroup: "O+", condition: "High Fever & Convulsions", doctor: "Dr. Jessica Adams", ward: "Pediatric ICU", status: "Critical", phone: "+1 (555) 901-2345", address: "124 Conch St, Bikini", emergencyContact: "James Wilson Sr. (Father) - 555-2345", history: "Febrile seizures" },
  { id: "P-1009", name: "Rachel Green", age: 29, gender: "Female", bloodGroup: "AB-", condition: "Third-Trimester Abdominal Pain", doctor: "Dr. Lisa Cuddy", ward: "Maternity Bay", status: "Under Observation", phone: "+1 (555) 012-3456", address: "90 Bedford St, New York", emergencyContact: "Ross Geller (Partner) - 555-1234", history: "First Pregnancy" },
  { id: "P-1010", name: "Christopher Nolan", age: 53, gender: "Male", bloodGroup: "A+", condition: "Traumatic Brain Injury (TBI)", doctor: "Dr. Gregory House", ward: "ICU Bed 1", status: "Critical", phone: "+1 (555) 123-9876", address: "888 Cinema Way, Los Angeles", emergencyContact: "Emma Thomas (Spouse) - 555-0987", history: "Concussion 2018" },
  { id: "P-1011", name: "Hanna Marin", age: 22, gender: "Female", bloodGroup: "O+", condition: "Laceration & Soft Tissue Damage", doctor: "Dr. Robert Chase", ward: "Trauma Room B", status: "Stable", phone: "+1 (555) 234-8765", address: "432 Rosewood Ln, PA", emergencyContact: "Ashley Marin (Mother) - 555-9876", history: "None" },
  { id: "P-1012", name: "George Clark", age: 71, gender: "Male", bloodGroup: "B+", condition: "Congestive Heart Failure", doctor: "Dr. Allison Cameron", ward: "CCU Bed 3", status: "Critical", phone: "+1 (555) 345-7654", address: "500 Grand Ave, Chicago", emergencyContact: "Martha Clark (Wife) - 555-8765", history: "CABG Surgery 2015" },
  { id: "P-1013", name: "Olivia Wilde", age: 38, gender: "Female", bloodGroup: "A-", condition: "Acute Renal Colic", doctor: "Dr. James Wilson", ward: "Urology Ward 2", status: "Admitted", phone: "+1 (555) 456-6543", address: "12 Star Ave, Hollywood", emergencyContact: "Jason S. (Husband) - 555-7654", history: "Kidney Stones" },
  { id: "P-1014", name: "Ethan Hunt", age: 41, gender: "Male", bloodGroup: "O-", condition: "Multiple Rib Fractures", doctor: "Dr. Eric Foreman", ward: "Trauma Ward 1", status: "Admitted", phone: "+1 (555) 567-5432", address: "007 Agent Way, Langley", emergencyContact: "Benji Dunn (Colleague) - 555-6543", history: "Polytrauma survivor" },
  { id: "P-1015", name: "Isla Fisher", age: 46, gender: "Female", bloodGroup: "AB+", condition: "Severe Sepsis secondary to UTI", doctor: "Dr. Remy Hadley", ward: "ICU Bed 5", status: "Critical", phone: "+1 (555) 678-4321", address: "99 Sunshine Blvd, Sydney", emergencyContact: "Sacha Baron (Spouse) - 555-5432", history: "Recurrent UTIs" },
  { id: "P-1016", name: "Lucas Scott", age: 24, gender: "Male", bloodGroup: "B-", condition: "ACL Tear & Knee Effusion", doctor: "Dr. Robert Chase", ward: "Ortho Ward 1", status: "Discharged", phone: "+1 (555) 789-3210", address: "23 Tree Hill Ln, NC", emergencyContact: "Karen Scott (Mother) - 555-4321", history: "HCM Cardiomyopathy" },
  { id: "P-1017", name: "Zoe Saldana", age: 44, gender: "Female", bloodGroup: "A+", condition: "Acute Pancreatitis", doctor: "Dr. Gregory House", ward: "Gastro Ward 3", status: "Under Observation", phone: "+1 (555) 890-2109", address: "101 Galaxy Way, LA", emergencyContact: "Marco Perego (Spouse) - 555-3210", history: "Gallstones" },
  { id: "P-1018", name: "Victor Stone", age: 25, gender: "Male", bloodGroup: "O+", condition: "Severe Electrical Burn Injury", doctor: "Dr. Eric Foreman", ward: "Burn Unit ICU", status: "Critical", phone: "+1 (555) 901-1098", address: "300 STAR Labs Blvd, Detroit", emergencyContact: "Silas Stone (Father) - 555-2109", history: "Prosthetic implants" },
  { id: "P-1019", name: "Natalie Portman", age: 40, gender: "Female", bloodGroup: "AB-", condition: "Thyroid Storm", doctor: "Dr. Allison Cameron", ward: "Endocrine Ward", status: "Admitted", phone: "+1 (555) 012-0987", address: "88 Harvard Sq, Cambridge", emergencyContact: "Benjamin Millepied - 555-1098", history: "Graves Disease" },
  { id: "P-1020", name: "Peter Parker", age: 21, gender: "Male", bloodGroup: "O-", condition: "Concussion & Smoke Inhalation", doctor: "Dr. Jessica Adams", ward: "ER Bed 4", status: "Discharged", phone: "+1 (555) 123-8901", address: "20 Ingram St, Queens", emergencyContact: "May Parker (Aunt) - 555-0123", history: "Spider bite allergy" },
  { id: "P-1021", name: "Wanda Maximoff", age: 30, gender: "Female", bloodGroup: "B+", condition: "Severe Hyponatremia & Shock", doctor: "Dr. Lisa Cuddy", ward: "ICU Bed 2", status: "Critical", phone: "+1 (555) 234-7890", address: "100 Westview Dr, NJ", emergencyContact: "Vision (Partner) - 555-9012", history: "Psychological trauma" },
  { id: "P-1022", name: "Bruce Wayne", age: 42, gender: "Male", bloodGroup: "O+", condition: "Multiple Contusions & Shoulder Dislocation", doctor: "Dr. Robert Chase", ward: "VIP Suite 1", status: "Stable", phone: "+1 (555) 345-6781", address: "1007 Mountain Drive, Gotham", emergencyContact: "Alfred Pennyworth - 555-8902", history: "Repeated physical trauma" },
  { id: "P-1023", name: "Diana Prince", age: 35, gender: "Female", bloodGroup: "A+", condition: "Deep Incised Laceration", doctor: "Dr. Remy Hadley", ward: "Surgical Ward 2", status: "Stable", phone: "+1 (555) 456-5678", address: "77 Gateway City, DC", emergencyContact: "Steve Trevor - 555-7891", history: "None" },
  { id: "P-1024", name: "Barry Allen", age: 27, gender: "Male", bloodGroup: "AB+", condition: "Severe Hypoglycemic Coma", doctor: "Dr. James Wilson", ward: "ER Bed 2", status: "Under Observation", phone: "+1 (555) 567-4567", address: "404 Central City Blvd", emergencyContact: "Iris West (Wife) - 555-6782", history: "Ultra-fast metabolic rate" },
  { id: "P-1025", name: "Clark Kent", age: 36, gender: "Male", bloodGroup: "O-", condition: "Acute Toxic Exposure (Unknown Agent)", doctor: "Dr. Gregory House", ward: "Isolation Ward 1", status: "Critical", phone: "+1 (555) 678-3456", address: "321 Smallville Rd, Kansas", emergencyContact: "Lois Lane (Spouse) - 555-5673", history: "Unknown allergy" }
];

export const INITIAL_DOCTORS = [
  { id: "DOC-101", name: "Dr. Gregory House", department: "Trauma & Emergency", specialization: "Diagnostic Medicine & Emergency Care", experience: "22 Years", availability: "Available", contact: "+1 (555) 999-0001", email: "house@stjude-hospital.org", avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-102", name: "Dr. Lisa Cuddy", department: "Hospital Administration / ER", specialization: "Endocrinology & Emergency Triage", experience: "18 Years", availability: "Available", contact: "+1 (555) 999-0002", email: "cuddy@stjude-hospital.org", avatar: "https://images.unsplash.com/photo-1594824813566-88855ce78907?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-103", name: "Dr. James Wilson", department: "Oncology & Critical Care", specialization: "Palliative & Internal Medicine", experience: "20 Years", availability: "On Call", contact: "+1 (555) 999-0003", email: "wilson@stjude-hospital.org", avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-104", name: "Dr. Eric Foreman", department: "Neurology", specialization: "Neuro-Trauma & Brain Injuries", experience: "15 Years", availability: "In Surgery", contact: "+1 (555) 999-0004", email: "foreman@stjude-hospital.org", avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-105", name: "Dr. Robert Chase", department: "Orthopedics & Surgery", specialization: "Intensive Care & Trauma Surgery", experience: "14 Years", availability: "Available", contact: "+1 (555) 999-0005", email: "chase@stjude-hospital.org", avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-106", name: "Dr. Allison Cameron", department: "Cardiology", specialization: "Interventional Cardiology", experience: "13 Years", availability: "Available", contact: "+1 (555) 999-0006", email: "cameron@stjude-hospital.org", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-107", name: "Dr. Remy Hadley (Thirteen)", department: "Internal Medicine", specialization: "Huntingtons & Genetic Disorders", experience: "11 Years", availability: "On Call", contact: "+1 (555) 999-0007", email: "hadley@stjude-hospital.org", avatar: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-108", name: "Dr. Chris Taub", department: "Plastic & Reconstruction", specialization: "Maxillofacial Trauma", experience: "19 Years", availability: "Available", contact: "+1 (555) 999-0008", email: "taub@stjude-hospital.org", avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-109", name: "Dr. Lawrence Kutner", department: "Sports Medicine & ER", specialization: "Resuscitation & Shock Management", experience: "10 Years", availability: "In Surgery", contact: "+1 (555) 999-0009", email: "kutner@stjude-hospital.org", avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-110", name: "Dr. Jessica Adams", department: "Pediatrics", specialization: "Pediatric Emergency Medicine", experience: "9 Years", availability: "Available", contact: "+1 (555) 999-0010", email: "adams@stjude-hospital.org", avatar: "https://images.unsplash.com/photo-1594824813566-88855ce78907?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-111", name: "Dr. Chi Park", department: "Neurology", specialization: "Stroke & Cerebrovascular Care", experience: "8 Years", availability: "Available", contact: "+1 (555) 999-0011", email: "park@stjude-hospital.org", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-112", name: "Dr. Martha Masters", department: "Pediatrics", specialization: "Pediatric Intensive Care", experience: "7 Years", availability: "On Call", contact: "+1 (555) 999-0012", email: "masters@stjude-hospital.org", avatar: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-113", name: "Dr. Meredith Grey", department: "General Surgery", specialization: "Abdominal & Trauma Surgery", experience: "17 Years", availability: "In Surgery", contact: "+1 (555) 999-0013", email: "grey@stjude-hospital.org", avatar: "https://images.unsplash.com/photo-1594824813566-88855ce78907?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-114", name: "Dr. Derek Shepherd", department: "Neurosurgery", specialization: "Spinal & Brain Surgery", experience: "21 Years", availability: "Available", contact: "+1 (555) 999-0014", email: "shepherd@stjude-hospital.org", avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300" },
  { id: "DOC-115", name: "Dr. Cristina Yang", department: "Cardiothoracic Surgery", specialization: "Heart Transplantation", experience: "16 Years", availability: "Available", contact: "+1 (555) 999-0015", email: "yang@stjude-hospital.org", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300" }
];

export const INITIAL_EMERGENCY_CASES = [
  { id: "EM-501", patientName: "Eleanor Vance", emergencyType: "STEMI Cardiac Arrest", priority: "Red", priorityLabel: "Critical", arrivalTime: "14:15 AM", doctor: "Dr. Gregory House", status: "In Resuscitation", bedAssigned: "ICU Bed 4" },
  { id: "EM-502", patientName: "Sophia Chen", emergencyType: "Anaphylactic Shock", priority: "Red", priorityLabel: "Critical", arrivalTime: "14:22 AM", doctor: "Dr. Lisa Cuddy", status: "Administering Epinephrine", bedAssigned: "ER Bay 3" },
  { id: "EM-503", patientName: "Christopher Nolan", emergencyType: "Traumatic Brain Injury", priority: "Red", priorityLabel: "Critical", arrivalTime: "14:30 AM", doctor: "Dr. Derek Shepherd", status: "In Pre-Op", bedAssigned: "ICU Bed 1" },
  { id: "EM-504", patientName: "Marcus Holloway", emergencyType: "Compound Radius Fracture", priority: "Orange", priorityLabel: "High", arrivalTime: "14:35 AM", doctor: "Dr. Robert Chase", status: "Casting & Stabilization", bedAssigned: "Ortho 2" },
  { id: "EM-505", patientName: "James Wilson Jr.", emergencyType: "Pediatric High Fever & Seizure", priority: "Red", priorityLabel: "Critical", arrivalTime: "14:40 AM", doctor: "Dr. Jessica Adams", status: "Cooling & Anticonvulsant", bedAssigned: "Pediatric ICU" },
  { id: "EM-506", patientName: "David Kim", emergencyType: "Acute Perforated Appendicitis", priority: "Orange", priorityLabel: "High", arrivalTime: "14:48 AM", doctor: "Dr. Meredith Grey", status: "Scheduled Appendectomy", bedAssigned: "Surgical 1" },
  { id: "EM-507", patientName: "Devon Miller", emergencyType: "Status Asthmaticus", priority: "Yellow", priorityLabel: "Medium", arrivalTime: "14:52 AM", doctor: "Dr. James Wilson", status: "Nebulizer Therapy", bedAssigned: "Pulmonary 1" },
  { id: "EM-508", patientName: "Rachel Green", emergencyType: "Obstetric Abdominal Distress", priority: "Yellow", priorityLabel: "Medium", arrivalTime: "15:05 AM", doctor: "Dr. Lisa Cuddy", status: "Fetal Ultrasound", bedAssigned: "Maternity Bay" },
  { id: "EM-509", patientName: "Amanda Martinez", emergencyType: "Severe Intractable Migraine", priority: "Green", priorityLabel: "Stable", arrivalTime: "15:12 AM", doctor: "Dr. Remy Hadley", status: "IV Hydration", bedAssigned: "General A" },
  { id: "EM-510", patientName: "Victor Stone", emergencyType: "Third-Degree Burn Injury", priority: "Red", priorityLabel: "Critical", arrivalTime: "15:20 AM", doctor: "Dr. Eric Foreman", status: "Debridement in ICU", bedAssigned: "Burn ICU" }
];

export const INITIAL_AMBULANCES = [
  { id: "AMB-01", number: "MED-911-A", driver: "Johnathan Wick", location: "Downtown Sector 4", status: "On Duty", ETA: "4 mins", contact: "+1 (555) 777-0001", type: "Advanced Life Support (ALS)" },
  { id: "AMB-02", number: "MED-911-B", driver: "Dominic Toretto", location: "Highway 101 Mile 42", status: "On Duty", ETA: "8 mins", contact: "+1 (555) 777-0002", type: "Trauma Care Ambulance" },
  { id: "AMB-03", number: "MED-911-C", driver: "Frank Martin", location: "Hospital ER Bay 1", status: "Available", ETA: "Immediate", contact: "+1 (555) 777-0003", type: "Cardiac ALS Ambulance" },
  { id: "AMB-04", number: "MED-911-D", driver: "Sarah Connor", location: "Westside Industrial Park", status: "On Duty", ETA: "12 mins", contact: "+1 (555) 777-0004", type: "Basic Life Support (BLS)" },
  { id: "AMB-05", number: "MED-911-E", driver: "Roy Miller", location: "Hospital Bay 2", status: "Available", ETA: "Immediate", contact: "+1 (555) 777-0005", type: "Pediatric Transport Unit" },
  { id: "AMB-06", number: "MED-911-F", driver: "Brian O'Conner", location: "Northside Airport Hub", status: "On Duty", ETA: "6 mins", contact: "+1 (555) 777-0006", type: "Neonatal Intensive Transport" },
  { id: "AMB-07", number: "MED-911-G", driver: "Letty Ortiz", location: "Central Service Depot", status: "Maintenance", ETA: "N/A", contact: "+1 (555) 777-0007", type: "Heavy Duty Mobile ICU" },
  { id: "AMB-08", number: "MED-911-H", driver: "Luke Hobbs", location: "Eastside Harbor District", status: "Available", ETA: "Immediate", contact: "+1 (555) 777-0008", type: "Trauma Care Ambulance" },
  { id: "AMB-09", number: "MED-911-I", driver: "Deckard Shaw", location: "Hospital Bay 3", status: "Available", ETA: "Immediate", contact: "+1 (555) 777-0009", type: "ALS Ambulance" },
  { id: "AMB-10", number: "MED-911-J", driver: "Mia Toretto", location: "Southside Community Center", status: "On Duty", ETA: "5 mins", contact: "+1 (555) 777-0010", type: "Basic Life Support" }
];

export const INITIAL_BEDS = Array.from({ length: 120 }, (_, i) => {
  const id = i + 1;
  let type = "General";
  if (id <= 25) type = "ICU Bed";
  else if (id <= 55) type = "Emergency Bed";

  let status = "Available";
  if (id % 3 === 0) status = "Occupied";
  else if (id % 11 === 0) status = "Reserved";

  return {
    id: `BED-${id < 10 ? '00' : id < 100 ? '0' : ''}${id}`,
    bedNumber: `Ward-${type === 'ICU Bed' ? 'ICU' : type === 'Emergency Bed' ? 'ER' : 'GEN'}-${id}`,
    type,
    status,
    patientAssigned: status === 'Occupied' ? `Patient #${1000 + (id % 25) + 1}` : 'None',
    floor: type === 'ICU Bed' ? 'Floor 3' : type === 'Emergency Bed' ? 'Floor 1 (ER)' : 'Floor 2'
  };
});

export const INITIAL_BLOOD_BANK = [
  { id: "BB-01", group: "A+", units: 28, minRequired: 15, status: "Adequate", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { id: "BB-02", group: "A-", units: 8, minRequired: 10, status: "Low Stock", color: "text-amber-600 bg-amber-50 border-amber-200" },
  { id: "BB-03", group: "B+", units: 34, minRequired: 20, status: "Adequate", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { id: "BB-04", group: "B-", units: 5, minRequired: 8, status: "Critical Shortage", color: "text-red-600 bg-red-50 border-red-200" },
  { id: "BB-05", group: "AB+", units: 19, minRequired: 10, status: "Adequate", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { id: "BB-06", group: "AB-", units: 3, minRequired: 5, status: "Critical Shortage", color: "text-red-600 bg-red-50 border-red-200" },
  { id: "BB-07", group: "O+", units: 42, minRequired: 25, status: "Adequate", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { id: "BB-08", group: "O-", units: 6, minRequired: 12, status: "Low Stock", color: "text-amber-600 bg-amber-50 border-amber-200" }
];

export const WEEKLY_EMERGENCY_TREND = [
  { day: "Mon", emergencyCases: 38, admissions: 24, discharges: 19 },
  { day: "Tue", emergencyCases: 45, admissions: 30, discharges: 22 },
  { day: "Wed", emergencyCases: 52, admissions: 35, discharges: 28 },
  { day: "Thu", emergencyCases: 49, admissions: 31, discharges: 26 },
  { day: "Fri", emergencyCases: 61, admissions: 42, discharges: 33 },
  { day: "Sat", emergencyCases: 68, admissions: 48, discharges: 30 },
  { day: "Sun", emergencyCases: 55, admissions: 36, discharges: 29 }
];

export const BED_OCCUPANCY_DATA = [
  { name: "ICU Beds", occupied: 18, total: 25 },
  { name: "Emergency Beds", occupied: 22, total: 30 },
  { name: "General Wards", occupied: 45, total: 65 }
];

export const DOCTOR_WORKLOAD_DATA = [
  { department: "Emergency", activeCases: 14 },
  { department: "Cardiology", activeCases: 9 },
  { department: "Trauma & Ortho", activeCases: 11 },
  { department: "Neurology", activeCases: 7 },
  { department: "Pediatric ICU", activeCases: 6 }
];
