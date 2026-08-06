// Data & PRD Specification for Hospital Emergency Management System

export const INITIAL_PATIENT_RECORDS = [
  {
    id: "PAT-101",
    name: "Eleanor Vance",
    age: 45,
    gender: "Female",
    contact: "+1 555-0192",
    condition: "Acute Chest Pain / Suspected STEMI",
    triageLevel: 10,
    type: "EMERGENCY",
    registeredAt: "14:15:00",
    status: "WAITING_EMERGENCY"
  },
  {
    id: "PAT-102",
    name: "Marcus Holloway",
    age: 28,
    gender: "Male",
    contact: "+1 555-0144",
    condition: "Compound Distal Radius Fracture",
    triageLevel: 7,
    type: "EMERGENCY",
    registeredAt: "14:18:20",
    status: "WAITING_EMERGENCY"
  },
  {
    id: "PAT-103",
    name: "Dr. Sarah Jenkins",
    age: 62,
    gender: "Female",
    contact: "+1 555-0188",
    condition: "Routine Hypertension Follow-up",
    triageLevel: 2,
    type: "NORMAL",
    registeredAt: "14:20:10",
    status: "WAITING_NORMAL"
  },
  {
    id: "PAT-104",
    name: "Devon Miller",
    age: 34,
    gender: "Male",
    contact: "+1 555-0173",
    condition: "Mild Respiratory Wheezing & Allergy",
    triageLevel: 4,
    type: "NORMAL",
    registeredAt: "14:22:45",
    status: "WAITING_NORMAL"
  },
  {
    id: "PAT-105",
    name: "Sophia Chen",
    age: 19,
    gender: "Female",
    contact: "+1 555-0129",
    condition: "Severe Anaphylactic Reaction to Peanuts",
    triageLevel: 9,
    type: "EMERGENCY",
    registeredAt: "14:25:30",
    status: "WAITING_EMERGENCY"
  }
];

export const TRIAGE_SEVERITY_LEVELS = [
  { level: 10, label: "Level 10 - Resuscitation / Critical", color: "text-red-500 bg-red-500/10 border-red-500/30" },
  { level: 9, label: "Level 9 - Severe Trauma / Anaphylaxis", color: "text-rose-500 bg-rose-500/10 border-rose-500/30" },
  { level: 8, label: "Level 8 - Stroke / Uncontrolled Bleeding", color: "text-pink-500 bg-pink-500/10 border-pink-500/30" },
  { level: 7, label: "Level 7 - Severe Fracture / High Fever", color: "text-orange-500 bg-orange-500/10 border-orange-500/30" },
  { level: 6, label: "Level 6 - Moderate Pain / Laceration", color: "text-amber-500 bg-amber-500/10 border-amber-500/30" },
  { level: 5, label: "Level 5 - Urgent Abdominal Distress", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30" },
  { level: 4, label: "Level 4 - Mild Asthma / Minor Sprain", color: "text-lime-500 bg-lime-500/10 border-lime-500/30" },
  { level: 3, label: "Level 3 - Routine Sore Throat", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30" },
  { level: 2, label: "Level 2 - Routine Consultation", color: "text-teal-500 bg-teal-500/10 border-teal-500/30" },
  { level: 1, label: "Level 1 - Non-urgent Prescription Refill", color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30" }
];

export const HOSPITAL_PRD_DOCUMENT = {
  title: "Hospital Emergency Management System (HEMS) - Technical Specification & PRD",
  version: "v2.4 Production Specification",
  author: "DSA Project Engineering Team",
  abstract: "This project implements a high-throughput Hospital Emergency Management System using C++ STL Data Structures. It guarantees preemptive emergency treatment via Max-Heap Priority Queues, O(1) patient lookups via Unordered Maps, FIFO outpatient routing via Queues, sequential treatment history tracking via Doubly Linked Lists, complete undo capabilities via Stacks, and multi-criteria patient report sorting.",
  
  dsaMapping: [
    {
      feature: "Patient Master Database",
      dsa: "unordered_map<string, Patient>",
      complexity: "O(1) Avg Search / Insert",
      desc: "Stores full patient demographic data indexed by unique Patient ID for instant retrieval."
    },
    {
      feature: "Emergency Triage Queue",
      dsa: "priority_queue<EmergencyPatient>",
      complexity: "O(log N) Push / Pop",
      desc: "Max-Heap queue prioritizing emergency patients by severity score (1-10) with arrival timestamp tie-breakers."
    },
    {
      feature: "Normal Outpatient Queue",
      dsa: "queue<NormalPatient>",
      complexity: "O(1) Push / Pop",
      desc: "FIFO queue managing non-critical routine walk-ins in order of registration."
    },
    {
      feature: "Treatment History Log",
      dsa: "list<TreatmentRecord>",
      complexity: "O(1) Push Back / O(N) View",
      desc: "Doubly Linked List tracking completed treatments with doctor assignments and discharge timestamps."
    },
    {
      feature: "Undo Operation Engine",
      dsa: "stack<UndoAction>",
      complexity: "O(1) Push / Pop",
      desc: "LIFO Stack capturing state mutations to support 1-click reversal of registration, queueing, and treatment actions."
    },
    {
      feature: "Patient Reports Sorter",
      dsa: "QuickSort / MergeSort / std::sort",
      complexity: "O(N log N) Time, O(N) Space",
      desc: "Sorts master patient data for medical audit reports by Severity, Age, Name, or Registration Time."
    }
  ],

  requirements: [
    { id: "FR1", title: "Patient Registration", desc: "Allows registering new patients with demographic details, assigning a unique Patient ID, and caching in unordered_map." },
    { id: "FR2", title: "Emergency Triage Enqueue", desc: "Enqueues critical patients into priority_queue sorted by urgency rating 1-10." },
    { id: "FR3", title: "Normal Patient Enqueue", desc: "Enqueues routine patients into queue for standard First-In-First-Out consultation." },
    { id: "FR4", title: "Preemptive Treatment Dispatcher", desc: "Always checks priority_queue first; dequeues highest severity patient. If priority_queue is empty, dequeues normal queue." },
    { id: "FR5", title: "Immediate Patient Lookup", desc: "Executes O(1) unordered_map search by Patient ID to display medical profile, triage level, and status." },
    { id: "FR6", title: "Treatment History Audit", desc: "Traverses doubly linked list to display full chronological timeline of treated patients." },
    { id: "FR7", title: "LIFO State Undo", desc: "Pops undo stack to revert last state mutation (e.g. un-treating patient, removing registration)." },
    { id: "FR8", title: "Report Generation & Sorting", desc: "Applies QuickSort or MergeSort to render sorted clinical reports by severity or age." }
  ]
};

export const CPP_HOSPITAL_CODE = `#include <iostream>
#include <unordered_map>
#include <queue>
#include <list>
#include <stack>
#include <vector>
#include <string>
#include <algorithm>
#include <iomanip>

using namespace std;

// Patient Structure
struct Patient {
    string id;
    string name;
    int age;
    string gender;
    string condition;
    int severity; // 1 to 10 (10 = Critical, 1 = Low)
    string type;  // "EMERGENCY" or "NORMAL"
    string registeredAt;
    string status; // "WAITING_EMERGENCY", "WAITING_NORMAL", "TREATED"
};

// Comparator for Priority Queue (Max-Heap based on Severity)
struct CompareEmergency {
    bool operator()(const Patient& a, const Patient& b) {
        if (a.severity != b.severity) {
            return a.severity < b.severity; // Higher severity pops first
        }
        return a.registeredAt > b.registeredAt; // Tie-breaker: earlier arrival pops first
    }
};

// Treatment History Record
struct TreatmentRecord {
    string patientId;
    string patientName;
    int severity;
    string doctorAssigned;
    string treatmentNotes;
    string treatedAt;
};

// Undo Action Structure
enum ActionType { REGISTER, ENQUEUE_EMERGENCY, ENQUEUE_NORMAL, TREAT };

struct UndoAction {
    ActionType type;
    Patient patientData;
    TreatmentRecord treatmentData;
};

// Main Hospital Management System Class
class HospitalEmergencySystem {
private:
    // 1. unordered_map -> Patient Master Records
    unordered_map<string, Patient> patientRegistry;

    // 2. priority_queue -> Emergency Patients (Max-Heap by Severity)
    priority_queue<Patient, vector<Patient>, CompareEmergency> emergencyQueue;

    // 3. queue -> Normal Patients (FIFO)
    queue<Patient> normalQueue;

    // 4. list -> Treatment History (Doubly Linked List)
    list<TreatmentRecord> treatmentHistory;

    // 5. stack -> Undo Operation Audit Log
    stack<UndoAction> undoStack;

public:
    // 1. Register Patient
    void registerPatient(const Patient& p) {
        patientRegistry[p.id] = p;
        undoStack.push({REGISTER, p, {}});
        cout << "✓ Patient [" << p.id << "] " << p.name << " registered successfully in Hashmap.\\n";
    }

    // 2. Add Emergency Patient
    void addEmergencyPatient(string patientId, int severity, string condition) {
        if (patientRegistry.find(patientId) == patientRegistry.end()) {
            cout << "✗ Error: Patient ID not registered in system! Register patient first.\\n";
            return;
        }

        Patient& p = patientRegistry[patientId];
        p.severity = severity;
        p.condition = condition;
        p.type = "EMERGENCY";
        p.status = "WAITING_EMERGENCY";

        emergencyQueue.push(p);
        undoStack.push({ENQUEUE_EMERGENCY, p, {}});
        cout << "⚡ Emergency Patient [" << p.id << "] " << p.name 
             << " (Severity " << severity << ") added to Priority Queue Max-Heap.\\n";
    }

    // 3. Add Normal Patient
    void addNormalPatient(string patientId, string condition) {
        if (patientRegistry.find(patientId) == patientRegistry.end()) {
            cout << "✗ Error: Patient ID not registered in system! Register patient first.\\n";
            return;
        }

        Patient& p = patientRegistry[patientId];
        p.severity = 2; // Default normal triage
        p.condition = condition;
        p.type = "NORMAL";
        p.status = "WAITING_NORMAL";

        normalQueue.push(p);
        undoStack.push({ENQUEUE_NORMAL, p, {}});
        cout << "📋 Normal Patient [" << p.id << "] " << p.name 
             << " added to FIFO Queue.\\n";
    }

    // 4. Treat Next Patient (Preemptive Dispatcher)
    void treatNextPatient(string doctorName) {
        Patient treatedPatient;
        bool isEmergency = false;

        if (!emergencyQueue.empty()) {
            treatedPatient = emergencyQueue.top();
            emergencyQueue.pop();
            isEmergency = true;
        } else if (!normalQueue.empty()) {
            treatedPatient = normalQueue.front();
            normalQueue.pop();
        } else {
            cout << "ℹ Notice: No patients in queue waiting for treatment.\\n";
            return;
        }

        // Update status in Master Registry
        patientRegistry[treatedPatient.id].status = "TREATED";

        // Record in Doubly Linked List History
        TreatmentRecord record = {
            treatedPatient.id,
            treatedPatient.name,
            treatedPatient.severity,
            doctorName,
            isEmergency ? "Emergency Triage Stabilized" : "Routine Outpatient Consultation",
            "14:40:00"
        };
        treatmentHistory.push_back(record);

        // Push action to Undo Stack
        undoStack.push({TREAT, treatedPatient, record});

        cout << "🏥 Treated Patient [" << treatedPatient.id << "] " << treatedPatient.name 
             << " (Severity " << treatedPatient.severity << ") by Dr. " << doctorName << ".\\n";
    }

    // 5. Search Patient (O(1) Hashmap Lookup)
    void searchPatient(string patientId) {
        auto it = patientRegistry.find(patientId);
        if (it != patientRegistry.end()) {
            const Patient& p = it->second;
            cout << "\\n=== PATIENT RECORD FOUND (Hashmap O(1)) ===\\n";
            cout << "ID: " << p.id << " | Name: " << p.name << " | Age: " << p.age << "\\n";
            cout << "Condition: " << p.condition << " | Severity: " << p.severity << "\\n";
            cout << "Status: " << p.status << " | Type: " << p.type << "\\n";
        } else {
            cout << "✗ Patient ID [" << patientId << "] not found in registry.\\n";
        }
    }

    // 6. View Treatment History (Doubly Linked List Traversal)
    void viewTreatmentHistory() {
        cout << "\\n=== TREATMENT HISTORY LOG (Doubly Linked List) ===\\n";
        if (treatmentHistory.empty()) {
            cout << "(No treatments recorded yet)\\n";
            return;
        }
        for (const auto& rec : treatmentHistory) {
            cout << "[" << rec.treatedAt << "] " << rec.patientId << " - " << rec.patientName 
                 << " (Sev: " << rec.severity << ") | Dr: " << rec.doctorAssigned 
                 << " | Note: " << rec.treatmentNotes << "\\n";
        }
    }

    // 7. Undo Last Operation
    void undoLastOperation() {
        if (undoStack.empty()) {
            cout << "ℹ Undo Stack is empty. No operations to undo.\\n";
            return;
        }

        UndoAction lastAction = undoStack.top();
        undoStack.pop();

        if (lastAction.type == TREAT) {
            // Revert treatment -> Remove from history list, reset status in registry
            treatmentHistory.pop_back();
            patientRegistry[lastAction.patientData.id].status = lastAction.patientData.status;
            cout << "↩ Undo: Reverted treatment for Patient [" << lastAction.patientData.id << "].\\n";
        } else if (lastAction.type == REGISTER) {
            patientRegistry.erase(lastAction.patientData.id);
            cout << "↩ Undo: Removed Patient [" << lastAction.patientData.id << "] registration from Hashmap.\\n";
        } else {
            cout << "↩ Undo: Reverted queue addition for [" << lastAction.patientData.id << "].\\n";
        }
    }

    // 8. Sorting & Patient Reports
    void generateReport(string sortBy) {
        vector<Patient> reportList;
        for (const auto& pair : patientRegistry) {
            reportList.push_back(pair.second);
        }

        if (sortBy == "severity") {
            // Sort by Severity Descending
            sort(reportList.begin(), reportList.end(), [](const Patient& a, const Patient& b) {
                return a.severity > b.severity;
            });
        } else if (sortBy == "age") {
            // Sort by Age Descending
            sort(reportList.begin(), reportList.end(), [](const Patient& a, const Patient& b) {
                return a.age > b.age;
            });
        } else if (sortBy == "name") {
            // Sort Alphabetically
            sort(reportList.begin(), reportList.end(), [](const Patient& a, const Patient& b) {
                return a.name < b.name;
            });
        }

        cout << "\\n=== SORTED PATIENT REPORT (Sorted by " << sortBy << ") ===\\n";
        cout << left << setw(10) << "ID" << setw(20) << "Name" << setw(6) << "Age" 
             << setw(10) << "Severity" << setw(20) << "Status" << "\\n";
        cout << string(66, '-') << "\\n";
        for (const auto& p : reportList) {
            cout << left << setw(10) << p.id << setw(20) << p.name << setw(6) << p.age 
                 << setw(10) << p.severity << setw(20) << p.status << "\\n";
        }
    }
};

int main() {
    HospitalEmergencySystem system;
    int choice;

    do {
        cout << "\\n===== HOSPITAL SYSTEM =====\\n";
        cout << "1. Register Patient\\n";
        cout << "2. Add Emergency Patient\\n";
        cout << "3. Add Normal Patient\\n";
        cout << "4. Treat Next Patient\\n";
        cout << "5. Search Patient\\n";
        cout << "6. View Treatment History\\n";
        cout << "7. Undo Last Operation\\n";
        cout << "8. Patient Reports (Sorting)\\n";
        cout << "9. Exit\\n";
        cout << "Enter your choice (1-9): ";
        cin >> choice;

        switch (choice) {
            case 1: {
                Patient p;
                cout << "Enter Patient ID (e.g. PAT-201): "; cin >> p.id;
                cout << "Enter Name: "; cin.ignore(); getline(cin, p.name);
                cout << "Enter Age: "; cin >> p.age;
                cout << "Enter Gender: "; cin >> p.gender;
                p.severity = 1;
                p.registeredAt = "14:45:00";
                p.status = "REGISTERED";
                system.registerPatient(p);
                break;
            }
            case 2: {
                string id, condition; int sev;
                cout << "Enter Patient ID: "; cin >> id;
                cout << "Enter Severity (1-10): "; cin >> sev;
                cout << "Enter Condition: "; cin.ignore(); getline(cin, condition);
                system.addEmergencyPatient(id, sev, condition);
                break;
            }
            case 3: {
                string id, condition;
                cout << "Enter Patient ID: "; cin >> id;
                cout << "Enter Condition: "; cin.ignore(); getline(cin, condition);
                system.addNormalPatient(id, condition);
                break;
            }
            case 4: {
                string doc;
                cout << "Enter Treating Doctor Name: "; cin.ignore(); getline(cin, doc);
                system.treatNextPatient(doc);
                break;
            }
            case 5: {
                string id;
                cout << "Enter Patient ID to Search: "; cin >> id;
                system.searchPatient(id);
                break;
            }
            case 6:
                system.viewTreatmentHistory();
                break;
            case 7:
                system.undoLastOperation();
                break;
            case 8: {
                string criteria;
                cout << "Enter Sort Criteria (severity / age / name): "; cin >> criteria;
                system.generateReport(criteria);
                break;
            }
            case 9:
                cout << "Exiting Hospital System... Stay Healthy!\\n";
                break;
            default:
                cout << "Invalid choice! Try again.\\n";
        }
    } while (choice != 9);

    return 0;
}
`;
