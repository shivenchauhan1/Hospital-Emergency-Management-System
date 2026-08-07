# 🏥 Hospital Emergency Management System (HEMS)
### **Sanjeevani Multispeciality Hospital (Sector 32, Chandigarh – 160030, Punjab, India)**

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Patient%20%26%20Staff%20Portals-000000?style=for-the-badge&logo=vercel)](https://hospital-emergency-management-syste.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-teal.svg?style=for-the-badge)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg?style=for-the-badge)]()

---

## 📌 Architecture Overview

```
Hospital-Emergency-Management-System
│
├── patient-portal          # Patient Public Web App (React + Vite + Tailwind)
│   ├── src/components      # Patient Registration, Tracker, QR Code, Reports
│   ├── src/pages           # Home, Emergency, Doctors, Blood Bank, Appointments
│   └── package.json
│
├── staff-portal            # Hospital Staff Command Portal (React + Vite + Tailwind)
│   ├── src/components      # RBAC Approvals, Doctor Panel, Bed Matrix, 108 Fleet
│   ├── src/pages           # Admin Dashboard, Emergency Queue, Analytics
│   └── package.json
│
├── backend                 # Node.js + Express + MongoDB + Socket.IO Engine
│   ├── config/db.js        # MongoDB Atlas Mongoose Config
│   ├── controllers/        # authController.js, emergencyController.js
│   ├── middleware/         # auth.js (JWT Verification & RBAC Guards)
│   ├── models/             # User, Patient, Doctor, EmergencyRequest, etc.
│   ├── routes/             # REST API Endpoints
│   ├── socket/             # Socket.IO Real-Time Stream Engine
│   ├── uploads/            # Diagnostic Scans (X-Ray, MRI, CT Scan)
│   ├── utils/              # Email Service & QR Code Generator
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🛠️ Technology Stack

- **Frontend**: React.js + Vite, Tailwind CSS, Lucide Icons, Recharts, Socket.IO Client
- **Backend**: Node.js, Express.js, Socket.IO, JWT Authentication, Multer, Nodemailer
- **Database**: MongoDB Atlas / Mongoose Schema Models
- **Deployment**:
  - **Patient Portal**: Vercel (`https://hospital-emergency-management-syste.vercel.app/`)
  - **Staff Portal**: Vercel
  - **Backend API**: Render / Railway (`port 5000`)
  - **Database**: MongoDB Atlas M0 Cluster

---

## ⚡ Key Features

### 1. 🌐 Patient Portal (`patient-portal/`)
- **Strict Read-Only Permission Guard**: Patients CANNOT alter hospital records, assign doctors, allocate beds, or dispatch ambulances.
- **Emergency Case Registration**:
  - Patient Name, Age, Gender, Phone, Address, Emergency Type (*Accident, Heart Attack, Stroke, Burn, Fracture, Poisoning, Other*), Priority (*Critical, High, Medium*), Description, Photo Upload.
  - ID Generator: `ER20260012`.
- **5-Stage Real-Time Request Tracker**:
  - `Pending` ➔ `Approved` ➔ `Doctor Assigned (Dr. Rajesh Sharma)` ➔ `108 Ambulance Dispatched (PB01AB1234)` ➔ `Treatment Started`.
- **Medical Reports & Diagnostics**:
  - Upload & Download PDF Clinical Reports, Chest X-Rays, Brain MRI Scans, Abdominal CT Scans.
- **Digital Patient Health ID QR Code**:
  - Instant QR Code modal generation for emergency kiosk scanning.
- **Notifications Bell**: Real-time alerts for case approvals and doctor assignments.

### 2. 🩺 Staff Portal (`staff-portal/`)
- **Role-Based Access Control (RBAC)**: Admin, Doctor, Receptionist, Blood Bank Staff, 108 Ambulance Staff.
- **Operations Command Dashboard**:
  - Metrics: Today's Patients (127), Pending Requests, Emergency Cases, Available Doctors (58), Beds Free (22/50 ICU), Blood Units (320), 108 Ambulances (11).
- **Emergency Queue Console**:
  - Review `ER20260012` (Rahul Sharma, Accident, Critical, Pending) with direct control buttons: **Approve**, **Reject**, **Assign Doctor (Dr. Rajesh Sharma)**, **Dispatch 108 Ambulance**.
- **Bed Management Console**:
  - Real-time allocation & release for 170 beds across ICU, Emergency Bays, and General Wards.
- **Recharts Operational Analytics**:
  - Interactive Weekly, Monthly, and Yearly emergency intake charts.
- **Report Generation**: PDF download & Excel dataset export.

---

## 🔌 API Documentation

| Method | Endpoint | Description | Permission |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/register` | Patient Registration | Public |
| `POST` | `/api/login` | Patient & Staff Login (JWT) | Public |
| `POST` | `/api/emergency` | Register Emergency Case | Patient |
| `GET` | `/api/emergency` | Fetch Emergency Queue | Staff |
| `PUT` | `/api/emergency/:id` | Approve/Reject Request | Staff |
| `PUT` | `/api/emergency/assignDoctor` | Assign Specialist Doctor | Staff |
| `PUT` | `/api/emergency/dispatchAmbulance` | Dispatch 108 Ambulance | Staff |

---

## 💻 Local Setup & Installation

```bash
# 1. Clone Repository
git clone https://github.com/shivenchauhan1/Hospital-Emergency-Management-System.git
cd Hospital-Emergency-Management-System

# 2. Run Backend Engine
cd backend
npm install
npm start

# 3. Run Patient Portal
cd ../patient-portal
npm install
npm run dev

# 4. Run Staff Portal
cd ../staff-portal
npm install
npm run dev
```

---

## 📜 License
Developed for **Sanjeevani Multispeciality Hospital, Chandigarh**. Released under the MIT License.
