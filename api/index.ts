import express, { Request, Response } from "express";
import { 
  INITIAL_STUDENTS, 
  Student, 
  InsertStudent, 
  compareRoll, 
  mergeSortStudents 
} from "../shared/initialData";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware for Vercel Serverless Function
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Normalized in-memory store for serverless execution
let studentsStore: Student[] = INITIAL_STUDENTS.map(s => ({
  ...s,
  subjects: s.subjects ? [...s.subjects] : []
}));
let currentId = 21;

// Helper to execute in-memory SQL queries reliably across platforms
function executeQuery(sql: string) {
  const clean = sql.trim().replace(/;+$/, "");
  const lower = clean.toLowerCase();

  if (lower.includes("avg(subject_marks)")) {
    const avg = studentsStore.reduce((sum, s) => sum + s.subjectMarks, 0) / (studentsStore.length || 1);
    return {
      data: [{ average_marks: Math.round(avg * 10) / 10 }],
      message: "Query executed successfully: 1 row(s) returned.",
    };
  }

  if (lower.includes("group by class")) {
    const deptMap: Record<string, { count: number; totalMarks: number }> = {};
    for (const s of studentsStore) {
      if (!deptMap[s.class]) {
        deptMap[s.class] = { count: 0, totalMarks: 0 };
      }
      deptMap[s.class].count++;
      deptMap[s.class].totalMarks += s.subjectMarks;
    }
    const rows = Object.entries(deptMap).map(([dept, val]) => ({
      class: dept,
      student_count: val.count,
      count: val.count,
      dept_avg: Math.round((val.totalMarks / val.count) * 10) / 10,
    }));
    return {
      data: rows,
      message: `Query executed successfully: ${rows.length} row(s) returned.`,
    };
  }

  if (lower.includes("where subject_marks >=")) {
    const match = lower.match(/where\s+subject_marks\s*>=\s*(\d+)/);
    const threshold = match ? parseInt(match[1], 10) : 90;
    const filtered = studentsStore
      .filter(s => s.subjectMarks >= threshold)
      .map(s => ({
        id: s.id,
        registration_no: s.registrationNo,
        name: s.name,
        class: s.class,
        subject_marks: s.subjectMarks,
      }));
    return {
      data: filtered,
      message: `Query executed successfully: ${filtered.length} row(s) returned.`,
    };
  }

  if (lower.includes("order by subject_marks desc") && lower.includes("limit 5")) {
    const sorted = [...studentsStore].sort((a, b) => b.subjectMarks - a.subjectMarks).slice(0, 5);
    return {
      data: sorted.map(s => ({
        registration_no: s.registrationNo,
        name: s.name,
        class: s.class,
        subject_marks: s.subjectMarks,
      })),
      message: "Query executed successfully: 5 row(s) returned.",
    };
  }

  // Default: SELECT * FROM students
  const rows = studentsStore.map(s => ({
    id: s.id,
    registration_no: s.registrationNo,
    registrationNo: s.registrationNo,
    name: s.name,
    class: s.class,
    subject_marks: s.subjectMarks,
    subjectMarks: s.subjectMarks,
  }));
  return {
    data: rows,
    message: `Query executed successfully: ${rows.length} row(s) returned.`,
  };
}

// Router helper to register routes for both /api/... and /...
function registerApi(path: string, method: "get" | "post" | "put" | "delete", handler: (req: Request, res: Response) => any) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const apiPath = normalized.startsWith("/api") ? normalized : `/api${normalized}`;
  const directPath = normalized.startsWith("/api") ? normalized.replace(/^\/api/, "") : normalized;

  app[method](apiPath, handler);
  if (directPath && directPath !== apiPath) {
    app[method](directPath, handler);
  }
}

// -------------------------------------------------------------
// CORE CRUD ROUTES
// -------------------------------------------------------------

// Get all students
registerApi("/students", "get", (req, res) => {
  res.json(studentsStore);
});

// Get student by ID
registerApi("/students/:id", "get", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const student = studentsStore.find(s => s.id === id);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }
  res.json(student);
});

// Create student
registerApi("/students", "post", (req, res) => {
  const { registrationNo, name, class: studentClass, subjectMarks, subjects } = req.body;
  if (!registrationNo || !name || !studentClass || subjectMarks === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (studentsStore.some(s => s.registrationNo === String(registrationNo).trim())) {
    return res.status(409).json({ message: "Registration number already in use" });
  }

  const newStudent: Student = {
    id: currentId++,
    registrationNo: String(registrationNo).trim(),
    name: String(name).trim(),
    class: String(studentClass).trim(),
    subjectMarks: Number(subjectMarks),
    subjects: Array.isArray(subjects) ? subjects : [],
  };

  studentsStore.push(newStudent);
  res.status(201).json(newStudent);
});

// Update student
registerApi("/students/:id", "put", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = studentsStore.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  const { registrationNo, name, class: studentClass, subjectMarks, subjects } = req.body;
  if (registrationNo) {
    const existing = studentsStore.find(s => s.registrationNo === String(registrationNo).trim() && s.id !== id);
    if (existing) {
      return res.status(409).json({ message: "Registration number already in use by another student" });
    }
  }

  const updated: Student = {
    ...studentsStore[index],
    ...(registrationNo ? { registrationNo: String(registrationNo).trim() } : {}),
    ...(name ? { name: String(name).trim() } : {}),
    ...(studentClass ? { class: String(studentClass).trim() } : {}),
    ...(subjectMarks !== undefined ? { subjectMarks: Number(subjectMarks) } : {}),
    ...(subjects ? { subjects: Array.isArray(subjects) ? subjects : [] } : {}),
  };

  studentsStore[index] = updated;
  res.json(updated);
});

// Delete student
registerApi("/students/:id", "delete", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = studentsStore.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }
  studentsStore.splice(index, 1);
  res.status(204).send();
});

// -------------------------------------------------------------
// DSA ALGORITHMIC ENDPOINTS (CIC-311 Showcase)
// -------------------------------------------------------------

// Binary Search by Roll Number (O(log n))
registerApi("/dsa/search/binary", "get", (req, res) => {
  const targetRoll = String(req.query.roll || "").trim();
  if (!targetRoll) {
    return res.status(400).json({ message: "roll query parameter is required" });
  }

  const sorted = mergeSortStudents(studentsStore, "registrationNo", false);

  let low = 0;
  let high = sorted.length - 1;
  let comparisons = 0;
  let found: Student | null = null;
  const steps: Array<{
    step: number;
    low: number;
    mid: number;
    high: number;
    midRoll: string;
    action: string;
  }> = [];

  while (low <= high) {
    comparisons++;
    const mid = Math.floor((low + high) / 2);
    const midRoll = sorted[mid].registrationNo;
    const compareResult = compareRoll(midRoll, targetRoll);

    if (compareResult === 0) {
      found = sorted[mid];
      steps.push({
        step: comparisons,
        low,
        mid,
        high,
        midRoll,
        action: `Match found at index ${mid}!`,
      });
      break;
    } else if (compareResult < 0) {
      steps.push({
        step: comparisons,
        low,
        mid,
        high,
        midRoll,
        action: `Target (${targetRoll}) > Mid (${midRoll}) → Search Right (low = ${mid + 1})`,
      });
      low = mid + 1;
    } else {
      steps.push({
        step: comparisons,
        low,
        mid,
        high,
        midRoll,
        action: `Target (${targetRoll}) < Mid (${midRoll}) → Search Left (high = ${mid - 1})`,
      });
      high = mid - 1;
    }
  }

  let linearComparisons = 0;
  for (const s of studentsStore) {
    linearComparisons++;
    if (s.registrationNo === targetRoll) {
      break;
    }
  }

  res.json({
    found: found !== null,
    student: found,
    targetRoll,
    comparisons,
    linearComparisons,
    worstCaseBinary: Math.ceil(Math.log2(studentsStore.length + 1)),
    worstCaseLinear: studentsStore.length,
    algorithm: "Binary Search O(log n)",
    totalRecords: studentsStore.length,
    steps,
  });
});

// Linear search
registerApi("/dsa/search/linear", "get", (req, res) => {
  const targetRoll = String(req.query.roll || "").trim();
  let comparisons = 0;
  let found: Student | null = null;
  for (const s of studentsStore) {
    comparisons++;
    if (s.registrationNo === targetRoll) {
      found = s;
      break;
    }
  }
  res.json({
    found: found !== null,
    student: found,
    targetRoll,
    comparisons,
    totalRecords: studentsStore.length,
    algorithm: "Linear Search O(n)",
  });
});

// Merge Sort endpoint (O(n log n))
registerApi("/dsa/sort", "get", (req, res) => {
  const key = (req.query.key as "subjectMarks" | "registrationNo" | "name") || "subjectMarks";
  const order = req.query.order === "asc" ? "asc" : "desc";

  const startTime = process.hrtime.bigint();
  const sorted = mergeSortStudents(studentsStore, key, order === "desc");
  const endTime = process.hrtime.bigint();
  const timeMicroseconds = Number(endTime - startTime) / 1000;

  res.json({
    algorithm: "Merge Sort O(n log n)",
    isStable: true,
    sortKey: key,
    sortOrder: order,
    timeMicroseconds,
    count: sorted.length,
    data: sorted,
  });
});

// Top 5 Scorers endpoint with Batch Average
registerApi("/dsa/top-scorers", "get", (req, res) => {
  const sorted = mergeSortStudents(studentsStore, "subjectMarks", true);
  const top5 = sorted.slice(0, 5);
  const totalMarks = studentsStore.reduce((sum, s) => sum + s.subjectMarks, 0);
  const averageMarks =
    studentsStore.length > 0 ? Math.round((totalMarks / studentsStore.length) * 10) / 10 : 0;

  res.json({
    topScorers: top5,
    batchAverage: averageMarks,
    totalStudents: studentsStore.length,
    highestMark: top5[0]?.subjectMarks || 0,
    lowestMark: sorted[sorted.length - 1]?.subjectMarks || 0,
  });
});

// Custom SQL queries for database management
registerApi("/db-query", "post", (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== "string") {
    return res.status(400).json({
      error: "Invalid query parameter",
      data: [],
    });
  }

  const result = executeQuery(query);
  res.json(result);
});

// Health check
registerApi("/health", "get", (req, res) => {
  res.json({ status: "healthy", records: studentsStore.length });
});

export default function handler(req: Request, res: Response) {
  return app(req, res);
}
