/**
 * backend/seed.js — Standalone Hospital Data Seeder
 * 
 * Usage: node backend/seed.js
 * 
 * Run ONCE to populate an empty MongoDB database with demo data.
 * Will NOT insert duplicates (checks countDocuments before inserting).
 * 
 * Also resets all ambulance statuses to 'Available' if all are dispatched.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Models
const Doctor = require('./models/Doctor');
const Department = require('./models/Department');
const Ambulance = require('./models/Ambulance');
const Bed = require('./models/Bed');
const BloodInventory = require('./models/BloodInventory');
const EmergencyCase = require('./models/EmergencyCase');
const Patient = require('./models/Patient');
const Staff = require('./models/Staff');
const Report = require('./models/Report');

async function runSeed() {
  try {
    await connectDB();
    console.log('\n🌱 Starting hospital data seed...\n');

    // ---- PATIENTS ----
    const patientCount = await Patient.countDocuments();
    if (patientCount === 0) {
      await Patient.insertMany([
        { id: 'SAN-2026-1001', name: 'Rahul Sharma', age: 42, gender: 'Male', phone: '+91 98765 43210', address: 'Sector 32, Chandigarh', bloodGroup: 'O+', status: 'Admitted', ward: 'ICU Tower', bedNumber: 'Bed-ICU-01', attendingDoctor: 'Dr. Rajesh Sharma', medicalHistory: 'Hypertension, Cardiac Observation' },
        { id: 'SAN-2026-1002', name: 'Pooja Verma', age: 34, gender: 'Female', phone: '+91 98765 54321', address: 'Sector 17, Chandigarh', bloodGroup: 'A+', status: 'Admitted', ward: 'General Ward', bedNumber: 'Bed-GEN-04', attendingDoctor: 'Dr. Priya Mehta', medicalHistory: 'Post-op observation' },
        { id: 'SAN-2026-1003', name: 'Gurpreet Singh', age: 58, gender: 'Male', phone: '+91 98765 67890', address: 'Mohali Phase 7, Punjab', bloodGroup: 'B+', status: 'Outpatient', ward: 'OPD Care', bedNumber: 'N/A', attendingDoctor: 'Dr. Vivek Singh', medicalHistory: 'Routine Triage Checkup' }
      ]);
      console.log('✅ Seeded 3 Patient Records');
    } else {
      console.log(`ℹ️  Patients already seeded (${patientCount} records)`);
    }

    // ---- STAFF ----
    const staffCount = await Staff.countDocuments();
    if (staffCount === 0) {
      await Staff.insertMany([
        { id: 'STF-101', name: 'Dr. Rajesh Sharma', role: 'Doctor', department: 'Cardiology', phone: '+91 172 456 7801', email: 'dr.sharma@sanjeevanihospital.in', status: 'Active' },
        { id: 'STF-102', name: 'Vikramjit Singh', role: 'Admin', department: 'Executive Management', phone: '+91 172 456 7800', email: 'admin@sanjeevanihospital.in', status: 'Active' },
        { id: 'STF-103', name: 'Sunita Devi', role: 'Receptionist', department: 'Patient Intake', phone: '+91 172 456 7890', email: 'reception@sanjeevanihospital.in', status: 'Active' },
        { id: 'STF-104', name: 'Harpreet Kaur', role: 'Emergency Coordinator', department: 'Trauma & Resuscitation', phone: '+91 172 456 7810', email: 'emergency@sanjeevanihospital.in', status: 'Active' },
        { id: 'STF-105', name: 'Dr. Rekha Gupta', role: 'Blood Bank Officer', department: 'Transfusion Medicine', phone: '+91 172 456 7820', email: 'bloodbank@sanjeevanihospital.in', status: 'Active' }
      ]);
      console.log('✅ Seeded 5 Staff Members');
    } else {
      console.log(`ℹ️  Staff already seeded (${staffCount} records)`);
    }

    // ---- DOCTORS ----
    const doctorCount = await Doctor.countDocuments();
    if (doctorCount === 0) {
      await Doctor.insertMany([
        { id: 'DOC-101', name: 'Dr. Rajesh Sharma', department: 'Cardiology', specialization: 'Interventional Cardiology & Cardiac Arrest', availability: 'Available', experience: '18 Years', todayAppointments: 14 },
        { id: 'DOC-102', name: 'Dr. Priya Mehta', department: 'Neurology', specialization: 'Neurosurgery & Acute Brain Stroke', availability: 'Available', experience: '14 Years', todayAppointments: 9 },
        { id: 'DOC-103', name: 'Dr. Vivek Singh', department: 'Emergency Medicine', specialization: 'Level 1 Trauma & Resuscitation', availability: 'Available', experience: '12 Years', todayAppointments: 22 },
        { id: 'DOC-104', name: 'Dr. Kavita Kapoor', department: 'Orthopedics', specialization: 'Joint Trauma & Fracture Care', availability: 'Available', experience: '15 Years', todayAppointments: 11 },
        { id: 'DOC-105', name: 'Dr. Aman Verma', department: 'Trauma Surgery', specialization: 'Polytrauma & Emergency Laparotomy', availability: 'Available', experience: '16 Years', todayAppointments: 8 },
        { id: 'DOC-106', name: 'Dr. Neha Kapoor', department: 'General Medicine', specialization: 'Internal Medicine & Critical Care', availability: 'Available', experience: '10 Years', todayAppointments: 16 }
      ]);
      console.log('✅ Seeded 6 Consultant Doctors');
    } else {
      console.log(`ℹ️  Doctors already seeded (${doctorCount} records)`);
    }

    // ---- DEPARTMENTS ----
    const deptCount = await Department.countDocuments();
    if (deptCount === 0) {
      await Department.insertMany([
        { name: 'Emergency Medicine', head: 'Dr. Vivek Singh', staffCount: 45 },
        { name: 'Cardiology', head: 'Dr. Rajesh Sharma', staffCount: 28 },
        { name: 'Neurology', head: 'Dr. Priya Mehta', staffCount: 22 },
        { name: 'Orthopedics', head: 'Dr. Kavita Kapoor', staffCount: 20 },
        { name: 'ICU', head: 'Dr. Neha Kapoor', staffCount: 50 },
        { name: 'Pediatrics', head: 'Dr. Sunita Rao', staffCount: 18 },
        { name: 'Radiology', head: 'Dr. Anil Kumar', staffCount: 15 },
        { name: 'General Surgery', head: 'Dr. Aman Verma', staffCount: 25 },
        { name: 'Blood Bank', head: 'Dr. Rekha Gupta', staffCount: 12 }
      ]);
      console.log('✅ Seeded 9 Departments');
    } else {
      console.log(`ℹ️  Departments already seeded (${deptCount} records)`);
    }

    // ---- AMBULANCES ----
    const ambCount = await Ambulance.countDocuments();
    if (ambCount === 0) {
      await Ambulance.insertMany([
        { id: 'AMB-01', number: 'PB01AB1234', driver: 'Gurpreet Singh', phone: '+91 98765 11111', location: 'Sector 17 Plaza, Chandigarh', zone: 'Sector 17', eta: '5 Mins', status: 'Available' },
        { id: 'AMB-02', number: 'CH02CD5678', driver: 'Manjit Sharma', phone: '+91 98765 22222', location: 'Tribune Chowk, Chandigarh', zone: 'Tribune Chowk', eta: '8 Mins', status: 'Available' },
        { id: 'AMB-03', number: 'HR26XY1122', driver: 'Rajesh Saini', phone: '+91 98765 33333', location: 'Sector 32 Hospital Bay 1', zone: 'Sector 32', eta: '2 Mins', status: 'Available' }
      ]);
      console.log('✅ Seeded 3 Ambulances');
    } else {
      // Reset any dispatched ambulances so dispatch API works
      const allDispatched = await Ambulance.countDocuments({ status: { $in: ['Dispatched', 'On Route'] } });
      const totalAmbs = await Ambulance.countDocuments();
      if (allDispatched === totalAmbs && totalAmbs > 0) {
        await Ambulance.updateMany({}, { $set: { status: 'Available', eta: '5 Mins' } });
        console.log(`🔄 Reset ${totalAmbs} ambulances from Dispatched/On Route → Available`);
      } else {
        console.log(`ℹ️  Ambulances already seeded (${ambCount} records, ${totalAmbs - allDispatched} available)`);
      }
    }

    // ---- BEDS ----
    const bedCount = await Bed.countDocuments();
    if (bedCount === 0) {
      const initialBeds = Array.from({ length: 30 }, (_, i) => ({
        id: `BED-${i + 1}`,
        bedNumber: `Bed-${i < 10 ? 'ICU' : 'GEN'}-${i + 1}`,
        type: i < 10 ? 'ICU' : 'General',
        status: i % 3 === 0 ? 'Occupied' : 'Available'
      }));
      await Bed.insertMany(initialBeds);
      console.log('✅ Seeded 30 Hospital Beds');
    } else {
      console.log(`ℹ️  Beds already seeded (${bedCount} records)`);
    }

    // ---- BLOOD INVENTORY ----
    const bloodCount = await BloodInventory.countDocuments();
    if (bloodCount === 0) {
      await BloodInventory.insertMany([
        { group: 'A+', units: 65, status: 'Adequate' },
        { group: 'A-', units: 14, status: 'Low Stock' },
        { group: 'B+', units: 82, status: 'Adequate' },
        { group: 'B-', units: 9, status: 'Critical Shortage' },
        { group: 'AB+', units: 48, status: 'Adequate' },
        { group: 'AB-', units: 6, status: 'Critical Shortage' },
        { group: 'O+', units: 88, status: 'Adequate' },
        { group: 'O-', units: 8, status: 'Low Stock' }
      ]);
      console.log('✅ Seeded Blood Inventory (8 groups)');
    } else {
      console.log(`ℹ️  Blood inventory already seeded (${bloodCount} records)`);
    }

    // ---- DIAGNOSTIC REPORTS ----
    const reportCount = await Report.countDocuments();
    if (reportCount === 0) {
      await Report.insertMany([
        { reportId: 'RPT-1001', patientId: 'SAN-2026-1001', patientName: 'Rahul Sharma', reportType: 'MRI Brain Scan', doctor: 'Dr. Priya Mehta', fileUrl: '/uploads/mri_brain_1001.pdf', date: '2026-08-15' },
        { reportId: 'RPT-1002', patientId: 'SAN-2026-1001', patientName: 'Rahul Sharma', reportType: 'Blood Test Lab Report', doctor: 'Dr. Rajesh Sharma', fileUrl: '/uploads/blood_1001.pdf', date: '2026-08-18' },
        { reportId: 'RPT-1003', patientId: 'SAN-2026-1002', patientName: 'Pooja Verma', reportType: 'X-Ray Scan', doctor: 'Dr. Kavita Kapoor', fileUrl: '/uploads/xray_1002.pdf', date: '2026-08-19' }
      ]);
      console.log('✅ Seeded 3 Diagnostic Reports');
    } else {
      console.log(`ℹ️  Reports already seeded (${reportCount} records)`);
    }

    // ---- EMERGENCY CASES ----
    const erCount = await EmergencyCase.countDocuments();
    if (erCount === 0) {
      await EmergencyCase.create({
        id: 'ER20260001',
        patientName: 'Rahul Sharma',
        age: '42',
        gender: 'Male',
        phone: '+91 98765 43210',
        emergencyType: 'Accident',
        priority: 'Critical',
        status: 'Pending',
        assignedDoctor: 'Unassigned',
        ambulanceDispatched: 'None',
        address: 'Sector 32, Chandigarh',
        description: 'Highway vehicle collision trauma near Tribune Chowk'
      });
      console.log('✅ Seeded 1 Emergency Case');
    } else {
      console.log(`ℹ️  Emergency cases already seeded (${erCount} records)`);
    }

    console.log('\n🎉 Hospital seed completed successfully!\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seed failed:', err.message);
    process.exit(1);
  }
}

runSeed();
