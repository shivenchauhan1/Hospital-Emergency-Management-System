# 🏥 Hospital Emergency Management System (HEMS)
### **Sanjeevani Multispeciality Hospital (Sector 32, Chandigarh – 160030, Punjab, India)**

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Patient%20%26%20Staff%20Portals-000000?style=for-the-badge&logo=vercel)](https://hospital-emergency-management-syste.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-teal.svg?style=for-the-badge)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg?style=for-the-badge)]()

---

## 📌 Architecture & Data Structures Overview

```
Hospital-Emergency-Management-System
│
├── patient-portal          # Patient Public Web App (React + Vite + Tailwind)
│   ├── src/components      # Patient Registration, Tracker, Diagnostic Reports
│   └── src/pages           # Home, Emergency, Doctors, Blood Bank, Appointments
│
├── staff-portal            # Hospital Staff Command Portal (React + Vite + Tailwind)
│   ├── src/components      # Priority Queue Console, Dijkstra Dispatch, Bed Matrix
│   └── src/pages           # Admin Dashboard, Emergency Queue, Analytics
│
├── backend                 # Node.js + Express + MongoDB + Socket.IO + Custom DSA Engine
│   ├── dsa/                # Custom Data Structure Engine Classes (Zero npm dependencies)
│   │   ├── PriorityQueue.js # Binary Min-Heap Triage Queue with FIFO tie-breaker
│   │   ├── Graph.js         # Weighted Graph & Dijkstra Shortest Path Engine
│   │   ├── CaseCache.js     # O(1) Hash Map Cache with DB-First Consistency
│   │   ├── BedAllocator.js  # Greedy Interval Free-List Stacks with Fallback Chain
│   │   ├── LRUCache.js      # Doubly-Linked List + Hash Map LRU Report Cache
│   │   ├── UnionFind.js     # Disjoint-Set Blood Group Compatibility Engine
│   │   └── testDSA.js       # Automated Plain-Assertion Unit Test Runner
│   ├── config/              # MongoDB Atlas Mongoose Config & Seeder
│   ├── controllers/         # emergencyController, ambulanceController, bedController, etc.
│   ├── models/              # EmergencyCase, Ambulance, Bed, BloodInventory, Patient, Report
│   ├── routes/              # REST API Endpoints (/api/emergency/queue, /api/ambulances/dispatch, etc.)
│   ├── socket/              # Socket.IO Real-Time Stream Engine (queue_updated, case_updated)
│   └── server.js            # Express Server & Cache Hydration Engine
│
└── README.md
```

---

## 🧠 Data Structures Used (Custom JavaScript Engine)

All data structures are implemented from scratch in `backend/dsa/` as pure JavaScript classes without external libraries.

| Data Structure | Class & File Path | Applied Hospital Feature | Time / Space Complexity | Justification & Architectural Benefit |
| :--- | :--- | :--- | :--- | :--- |
| **Binary Min-Heap** | `PriorityQueue.js`<br>`(backend/dsa/)` | **Emergency Triage Queue** (`GET /api/emergency/queue`) | Insert: $O(\log N)$<br>Extract: $O(\log N)$<br>Peek: $O(1)$ | Fixes triage sorting bug where earlier Medium cases ranked above later Critical cases. Ranks cases by severity (`Critical` > `High` > `Medium`) with `createdAt` FIFO tiebreaker. |
| **Weighted Graph + Dijkstra** | `Graph.js`<br>`(backend/dsa/)` | **108 Ambulance Dispatch** (`POST /api/ambulances/dispatch`) | Dijkstra: $O((V + E) \log V)$ | Computes shortest road distance from emergency incident zone (e.g., Sector 17, PGI, Mohali) to available 108 ambulances, dispatching the nearest fleet vehicle. |
| **Hash Map Cache** | `CaseCache.js`<br>`(backend/dsa/)` | **Emergency Case Cache** (In-Memory Engine) | Lookups: $O(1)$<br>Inserts: $O(1)$ | Provides instantaneous $O(1)$ case lookups and dual-writes with MongoDB (DB-First rule) to broadcast real-time Socket.IO triage updates without DB bottlenecks. |
| **Greedy Free-List Stacks** | `BedAllocator.js`<br>`(backend/dsa/)` | **ICU & Ward Bed Allocation** (`POST /api/beds/allocate`) | Pop/Push: $O(1)$ | Manages category free-lists (`ICU`, `EmergencyBay`, `General`). Executes greedy fallback chain for Critical patients when primary category is full. |
| **Doubly-Linked List + Hash Map** | `LRUCache.js`<br>`(backend/dsa/)` | **Diagnostic Reports Cache** (`GET /api/patient/reports/:id`) | Get: $O(1)$<br>Put: $O(1)$ | Caches recently viewed patient MRI/X-Ray diagnostic scans with fixed capacity (20), evicting least-recently-used scans to optimize memory usage. |
| **Disjoint-Set (Union-Find)** | `UnionFind.js`<br>`(backend/dsa/)` | **Blood Group Compatibility** (`GET /api/blood/compatible/:group`) | Find/Union: $O(\alpha(N))$ *(Nearly $O(1)$)* | Uses path compression and rank union to group compatible blood donors ($O-$ universal donor unioned across all recipient types). |

---

## 🛠️ Technology Stack

- **Frontend**: React.js + Vite, Tailwind CSS, Lucide Icons, Recharts, Socket.IO Client
- **Backend**: Node.js, Express.js, Custom DSA Engine, Socket.IO, Mongoose
- **Database**: MongoDB Atlas M0 Cluster
- **Testing**: Plain Assertion Automated DSA Test Suite (`node backend/dsa/testDSA.js`)

---

## 🔌 API Documentation

| Method | Endpoint | Description | Data Structure Engine |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/emergency/queue` | Live Triage Ranked Queue | **PriorityQueue (Min-Heap)** |
| `POST` | `/api/ambulances/dispatch` | Dispatch Nearest Ambulance | **Graph + Dijkstra Algorithm** |
| `POST` | `/api/beds/allocate` | Allocate Bed with Critical Fallback | **BedAllocator (Free-List Stacks)** |
| `POST` | `/api/beds/release` | Release Bed Back to Free-List | **BedAllocator (Free-List Stacks)** |
| `GET` | `/api/patient/reports/:id` | Fetch Diagnostic Reports | **LRUCache (List + Map)** |
| `GET` | `/api/blood/compatible/:group` | Compatible Blood Stock Lookup | **Union-Find Disjoint-Set** |

---

## 💻 Local Setup & Test Suite Execution

```bash
# 1. Clone Repository
git clone https://github.com/shivenchauhan1/Hospital-Emergency-Management-System.git
cd Hospital-Emergency-Management-System

# 2. Run Automated DSA Unit Test Suite (Zero Dependencies)
node backend/dsa/testDSA.js

# 3. Start Backend Engine
cd backend
npm install
npm start

# 4. Start Staff Portal Command Center
cd ../staff-portal
npm install
npm run dev

# 5. Start Patient Portal
cd ../patient-portal
npm install
npm run dev
```

---

## 📜 License
Developed for **Sanjeevani Multispeciality Hospital, Chandigarh**. Released under the MIT License.
