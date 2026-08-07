const Doctor = require('../models/Doctor');
const Department = require('../models/Department');
const Ambulance = require('../models/Ambulance');
const Bed = require('../models/Bed');
const BloodInventory = require('../models/BloodInventory');
const EmergencyCase = require('../models/EmergencyCase');

const seedHospitalData = async () => {
  try {
    // Seed Doctors
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
    }

    // Seed Departments
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
    }

    // Seed Ambulances
    const ambCount = await Ambulance.countDocuments();
    if (ambCount === 0) {
      await Ambulance.insertMany([
        { id: 'AMB-01', number: 'PB01AB1234', driver: 'Gurpreet Singh', phone: '+91 98765 11111', location: 'Sector 17 Plaza, Chandigarh', eta: '5 Mins', status: 'Available' },
        { id: 'AMB-02', number: 'CH02CD5678', driver: 'Manjit Sharma', phone: '+91 98765 22222', location: 'Tribune Chowk, Chandigarh', eta: '8 Mins', status: 'On Route' },
        { id: 'AMB-03', number: 'HR26XY1122', driver: 'Rajesh Saini', phone: '+91 98765 33333', location: 'Sector 32 Hospital Bay 1', eta: 'Immediate', status: 'Available' }
      ]);
      console.log('✅ Seeded 3 108 Ambulances');
    }

    // Seed Beds
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
    }

    // Seed Blood Inventory
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
      console.log('✅ Seeded Blood Inventory Groups');
    }

    // Seed Emergency Cases
    const erCount = await EmergencyCase.countDocuments();
    if (erCount === 0) {
      await EmergencyCase.create({
        id: 'ER20260012',
        patientName: 'Rahul Sharma',
        age: '42',
        gender: 'Male',
        phone: '+91 98765 43210',
        emergencyType: 'Accident',
        priority: 'Critical',
        status: 'Pending',
        assignedDoctor: 'Dr. Rajesh Sharma',
        ambulanceDispatched: 'PB01AB1234',
        address: 'Sector 32, Chandigarh',
        description: 'Highway vehicle collision trauma near Tribune Chowk'
      });
      console.log('✅ Seeded Emergency Case ER20260012');
    }
  } catch (err) {
    console.error('❌ Error Seeding Hospital Data:', err);
  }
};

module.exports = seedHospitalData;
