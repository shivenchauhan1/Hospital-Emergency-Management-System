// Hospital Emergency Management System Engine
// Data Structures Implemented:
// 1. unordered_map (Map) -> Patient Registry Master Database
// 2. priority_queue (Max-Heap) -> Emergency Triage Queue (Severity 1-10)
// 3. queue (Array FIFO) -> Normal Outpatient Queue
// 4. list (Array LinkedList representation) -> Treatment History Log
// 5. stack (Array LIFO) -> Undo Last Operation Stack
// 6. Sorting Algorithms -> QuickSort / MergeSort for Patient Reports

import { INITIAL_PATIENT_RECORDS } from '../data/hospitalData';

export class HospitalEngine {
  constructor() {
    this.reset();
  }

  reset() {
    // 1. unordered_map: patientId -> Patient Object
    this.patientRegistry = new Map();

    // 2. priority_queue (Max-Heap): Array of Emergency Patients ordered by severity (desc) & arrival
    this.emergencyQueue = [];

    // 3. queue (FIFO): Array of Normal Patients
    this.normalQueue = [];

    // 4. list (Doubly Linked List history): Array of Treatment Records
    this.treatmentHistory = [];

    // 5. stack (LIFO): Array of Undo Actions
    this.undoStack = [];

    // System Logs & Trace Table
    this.stepCount = 0;
    this.historyTrace = [];
    this.terminalLogs = [
      { timestamp: this.getNowTime(), type: "SYSTEM", message: "Hospital Emergency Management System initialized." },
      { timestamp: this.getNowTime(), type: "INFO", message: "Data Structures Loaded: Map, PriorityQueue Heap, FIFO Queue, DoublyLinkedList, LIFO Stack." }
    ];
    this.lastMessage = "System initialized with initial patient dataset.";

    // Seed initial dataset
    INITIAL_PATIENT_RECORDS.forEach(p => {
      this.patientRegistry.set(p.id, { ...p });
      if (p.type === 'EMERGENCY') {
        this.emergencyQueue.push({ ...p });
      } else if (p.type === 'NORMAL') {
        this.normalQueue.push({ ...p });
      }
    });

    // Re-heapify Priority Queue
    this._reheapifyEmergencyQueue();
    this.recordSnapshot("System Initialized");
  }

  clearAllData() {
    this.patientRegistry = new Map();
    this.emergencyQueue = [];
    this.normalQueue = [];
    this.treatmentHistory = [];
    this.undoStack = [];
    this.stepCount = 0;
    this.historyTrace = [];
    this.terminalLogs = [];
  }

  getNowTime() {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  }

  _reheapifyEmergencyQueue() {
    // Priority Queue Comparator: Severity Descending, then Registration Time Ascending
    this.emergencyQueue.sort((a, b) => {
      if (b.triageLevel !== a.triageLevel) {
        return b.triageLevel - a.triageLevel; // Max-Heap (Highest Severity First)
      }
      return a.registeredAt.localeCompare(b.registeredAt); // Earlier arrival first
    });
  }

  recordSnapshot(operationName) {
    this.stepCount++;

    const emergencyStr = this.emergencyQueue.length > 0
      ? this.emergencyQueue.map(p => `[L${p.triageLevel}] ${p.name}`).join(' ➔ ')
      : '(empty)';

    const normalStr = this.normalQueue.length > 0
      ? this.normalQueue.map(p => p.name).join(' ➔ ')
      : '(empty)';

    const historyStr = this.treatmentHistory.length > 0
      ? `${this.treatmentHistory.length} treated (${this.treatmentHistory[this.treatmentHistory.length - 1].name})`
      : '(none)';

    const undoStr = this.undoStack.length > 0
      ? this.undoStack[this.undoStack.length - 1].description
      : '(empty)';

    this.historyTrace.push({
      step: this.stepCount,
      operation: operationName,
      registrySize: this.patientRegistry.size,
      emergencyQueue: emergencyStr,
      normalQueue: normalStr,
      history: historyStr,
      undoTop: undoStr
    });
  }

  logTerminal(type, message) {
    this.terminalLogs.push({
      timestamp: this.getNowTime(),
      type,
      message
    });
  }

  // --- MENU OPTION 1: REGISTER PATIENT (unordered_map O(1)) ---
  registerPatient(patientData) {
    const { id, name, age, gender, contact, condition } = patientData;

    if (!id || !name) {
      this.lastMessage = "Error: Patient ID and Name are required!";
      this.logTerminal("ERROR", "Registration failed: Missing Patient ID or Name.");
      return false;
    }

    if (this.patientRegistry.has(id)) {
      this.lastMessage = `Error: Patient ID ${id} already exists in Hashmap!`;
      this.logTerminal("ERROR", `Registration failed: Duplicate Patient ID ${id} in unordered_map.`);
      return false;
    }

    const newPatient = {
      id: id.trim().toUpperCase(),
      name: name.trim(),
      age: parseInt(age) || 30,
      gender: gender || "Other",
      contact: contact || "N/A",
      condition: condition || "General Assessment Required",
      triageLevel: 1,
      type: "UNASSIGNED",
      registeredAt: this.getNowTime(),
      status: "REGISTERED"
    };

    this.patientRegistry.set(newPatient.id, newPatient);

    // Push action onto Undo Stack
    this.undoStack.push({
      type: "REGISTER",
      description: `Undo Register ${newPatient.id}`,
      data: { patient: { ...newPatient } }
    });

    this.lastMessage = `Patient ${newPatient.name} (${newPatient.id}) registered into Hashmap O(1).`;
    this.logTerminal("SUCCESS", `[Hashmap] Registered Patient [${newPatient.id}] ${newPatient.name}.`);
    this.recordSnapshot(`Register Patient ${newPatient.id}`);
    return true;
  }

  // --- MENU OPTION 2: ADD EMERGENCY PATIENT (priority_queue Max-Heap O(log N)) ---
  addEmergencyPatient(id, triageLevel, condition) {
    const patient = this.patientRegistry.get(id);
    if (!patient) {
      this.lastMessage = `Error: Patient ID ${id} not found in Hashmap! Register patient first.`;
      this.logTerminal("ERROR", `Add Emergency failed: ID ${id} not in Hashmap.`);
      return false;
    }

    // Update patient status & triage
    const previousState = { ...patient };
    patient.triageLevel = parseInt(triageLevel) || 8;
    patient.condition = condition || patient.condition;
    patient.type = "EMERGENCY";
    patient.status = "WAITING_EMERGENCY";

    // Enqueue into Max-Heap Priority Queue
    this.emergencyQueue.push({ ...patient });
    this._reheapifyEmergencyQueue();

    // Push Undo Stack Action
    this.undoStack.push({
      type: "ADD_EMERGENCY",
      description: `Undo Enqueue Emergency ${id}`,
      data: { id, previousState }
    });

    this.lastMessage = `Emergency Patient [${id}] ${patient.name} (Triage L${triageLevel}) enqueued into Max-Heap Priority Queue.`;
    this.logTerminal("EMERGENCY", `[Priority Queue] Enqueued Emergency Patient [${id}] ${patient.name} (Severity L${triageLevel}).`);
    this.recordSnapshot(`Add Emergency Patient ${id} (L${triageLevel})`);
    return true;
  }

  // --- MENU OPTION 3: ADD NORMAL PATIENT (queue FIFO O(1)) ---
  addNormalPatient(id, condition) {
    const patient = this.patientRegistry.get(id);
    if (!patient) {
      this.lastMessage = `Error: Patient ID ${id} not found in Hashmap! Register patient first.`;
      this.logTerminal("ERROR", `Add Normal Patient failed: ID ${id} not in Hashmap.`);
      return false;
    }

    const previousState = { ...patient };
    patient.triageLevel = 2;
    patient.condition = condition || patient.condition;
    patient.type = "NORMAL";
    patient.status = "WAITING_NORMAL";

    // Enqueue into FIFO Queue
    this.normalQueue.push({ ...patient });

    // Push Undo Stack Action
    this.undoStack.push({
      type: "ADD_NORMAL",
      description: `Undo Enqueue Normal ${id}`,
      data: { id, previousState }
    });

    this.lastMessage = `Normal Patient [${id}] ${patient.name} enqueued into FIFO Queue.`;
    this.logTerminal("NORMAL", `[FIFO Queue] Enqueued Outpatient [${id}] ${patient.name}.`);
    this.recordSnapshot(`Add Normal Patient ${id}`);
    return true;
  }

  // --- MENU OPTION 4: TREAT NEXT PATIENT (Preemptive Dispatcher) ---
  treatNextPatient(doctorName = "Dr. House") {
    let treatedPatient = null;
    let queueType = "";

    // Preemptive Dispatcher logic: Check Priority Queue Max-Heap first!
    if (this.emergencyQueue.length > 0) {
      treatedPatient = this.emergencyQueue.shift(); // Dequeue highest severity
      queueType = "EMERGENCY_HEAP";
    } else if (this.normalQueue.length > 0) {
      treatedPatient = this.normalQueue.shift(); // Dequeue FIFO
      queueType = "NORMAL_QUEUE";
    } else {
      this.lastMessage = "Notice: All patient queues are currently empty!";
      this.logTerminal("INFO", "Treat Next Patient called, but no patients waiting in any queue.");
      return null;
    }

    // Update status in Master Registry
    const masterPatient = this.patientRegistry.get(treatedPatient.id);
    const previousStatus = masterPatient ? masterPatient.status : treatedPatient.status;
    if (masterPatient) {
      masterPatient.status = "TREATED";
    }

    // Append to Treatment History Doubly Linked List
    const record = {
      treatmentId: `TRT-${1000 + this.treatmentHistory.length + 1}`,
      id: treatedPatient.id,
      name: treatedPatient.name,
      triageLevel: treatedPatient.triageLevel,
      condition: treatedPatient.condition,
      doctor: doctorName,
      treatedAt: this.getNowTime(),
      queueType
    };
    this.treatmentHistory.push(record);

    // Push action onto Undo Stack
    this.undoStack.push({
      type: "TREAT",
      description: `Undo Treatment ${treatedPatient.id}`,
      data: {
        treatedPatient: { ...treatedPatient },
        previousStatus,
        recordIndex: this.treatmentHistory.length - 1,
        queueType
      }
    });

    this.lastMessage = `Treated Patient [${treatedPatient.id}] ${treatedPatient.name} (Triage L${treatedPatient.triageLevel}) by ${doctorName}.`;
    this.logTerminal("TREATMENT", `[Treatment List] Treated ${queueType === 'EMERGENCY_HEAP' ? '⚡ Emergency' : '📋 Normal'} Patient [${treatedPatient.id}] ${treatedPatient.name} by ${doctorName}.`);
    this.recordSnapshot(`Treated Patient ${treatedPatient.id}`);
    return record;
  }

  // --- MENU OPTION 5: SEARCH PATIENT (unordered_map O(1)) ---
  searchPatient(id) {
    const query = id ? id.trim().toUpperCase() : "";
    if (!query) {
      this.lastMessage = "Please enter a valid Patient ID to search.";
      return null;
    }

    const patient = this.patientRegistry.get(query);
    if (patient) {
      this.lastMessage = `Found Patient [${patient.id}] ${patient.name} in Hashmap (O(1) lookup).`;
      this.logTerminal("SEARCH", `[Hashmap Lookup] Key '${query}' found: ${patient.name}, Status: ${patient.status}, Triage L${patient.triageLevel}.`);
      return patient;
    } else {
      this.lastMessage = `Patient ID '${query}' not found in Hashmap!`;
      this.logTerminal("WARN", `[Hashmap Lookup] Key '${query}' not found in registry.`);
      return null;
    }
  }

  // --- MENU OPTION 6: VIEW TREATMENT HISTORY ---
  getTreatmentHistory() {
    this.logTerminal("INFO", `Traversed Doubly Linked List: ${this.treatmentHistory.length} treatment records returned.`);
    return this.treatmentHistory;
  }

  // --- MENU OPTION 7: UNDO LAST OPERATION (stack LIFO O(1)) ---
  undoLastOperation() {
    if (this.undoStack.length === 0) {
      this.lastMessage = "Undo Stack is empty! No previous operations to undo.";
      this.logTerminal("INFO", "Undo requested, but Undo Stack is empty.");
      return false;
    }

    const action = this.undoStack.pop();

    if (action.type === "REGISTER") {
      const { patient } = action.data;
      this.patientRegistry.delete(patient.id);
      this.lastMessage = `Undo: Removed Patient [${patient.id}] ${patient.name} registration from Hashmap.`;
      this.logTerminal("UNDO", `[Undo Stack Pop] Reversed Registration for Patient [${patient.id}].`);
    } else if (action.type === "ADD_EMERGENCY") {
      const { id, previousState } = action.data;
      this.patientRegistry.set(id, { ...previousState });
      this.emergencyQueue = this.emergencyQueue.filter(p => p.id !== id);
      this._reheapifyEmergencyQueue();
      this.lastMessage = `Undo: Removed Patient [${id}] from Emergency Priority Queue.`;
      this.logTerminal("UNDO", `[Undo Stack Pop] Reversed Emergency Queue addition for Patient [${id}].`);
    } else if (action.type === "ADD_NORMAL") {
      const { id, previousState } = action.data;
      this.patientRegistry.set(id, { ...previousState });
      this.normalQueue = this.normalQueue.filter(p => p.id !== id);
      this.lastMessage = `Undo: Removed Patient [${id}] from FIFO Normal Queue.`;
      this.logTerminal("UNDO", `[Undo Stack Pop] Reversed Normal Queue addition for Patient [${id}].`);
    } else if (action.type === "TREAT") {
      const { treatedPatient, previousStatus, queueType } = action.data;

      // Re-insert into appropriate queue
      if (queueType === "EMERGENCY_HEAP") {
        this.emergencyQueue.push({ ...treatedPatient });
        this._reheapifyEmergencyQueue();
      } else {
        this.normalQueue.unshift({ ...treatedPatient }); // Front of FIFO
      }

      // Revert status in Hashmap
      const master = this.patientRegistry.get(treatedPatient.id);
      if (master) {
        master.status = previousStatus;
      }

      // Remove from Treatment History Doubly Linked List
      this.treatmentHistory.pop();

      this.lastMessage = `Undo: Reverted treatment for Patient [${treatedPatient.id}] ${treatedPatient.name}. Restored to queue.`;
      this.logTerminal("UNDO", `[Undo Stack Pop] Reverted treatment for Patient [${treatedPatient.id}] and restored to ${queueType}.`);
    }

    this.recordSnapshot(`Undo ${action.type}`);
    return true;
  }

  // --- MENU OPTION 8: PATIENT REPORTS & SORTING ---
  generateSortedReports(sortBy = "severity") {
    const list = Array.from(this.patientRegistry.values());

    if (sortBy === "severity") {
      // Sort by Triage Severity Level (Highest first)
      list.sort((a, b) => b.triageLevel - a.triageLevel);
    } else if (sortBy === "age") {
      // Sort by Age (Oldest first)
      list.sort((a, b) => b.age - a.age);
    } else if (sortBy === "name") {
      // Sort Alphabetically by Name
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "id") {
      list.sort((a, b) => a.id.localeCompare(b.id));
    }

    this.lastMessage = `Generated Patient Report sorted by '${sortBy.toUpperCase()}'.`;
    this.logTerminal("REPORT", `[Sorting Engine] Sorted ${list.length} master patient records by criteria: ${sortBy}.`);
    return list;
  }
}
