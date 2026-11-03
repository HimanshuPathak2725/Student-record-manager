import express from "express";
import serverless from "serverless-http";
import { 
  INITIAL_STUDENTS, 
  Student, 
  compareRoll, 
  mergeSortStudents 
} from "../../shared/initialData";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Normalize URL path if routed via Netlify Functions
app.use((req, res, next) => {
  if (req.url.startsWith("/.netlify/functions/api")) {
    req.url = req.url.replace("/.netlify/functions/api", "/api");
  }
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

let studentsStore: Student[] = INITIAL_STUDENTS.map(s => ({
  ...s,
  subjects: s.subjects ? [...s.subjects] : []
}));
let currentId = 21;

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

function registerApi(path: string, method: "get" | "post" | "put" | "delete", handler: any) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const apiPath = normalized.startsWith("/api") ? normalized : `/api${normalized}`;
  const directPath = normalized.startsWith("/api") ? normalized.replace(/^\/api/, "") : normalized;

  app[method](apiPath, handler);
  if (directPath && directPath !== apiPath) {
    app[method](directPath, handler);
  }
}

registerApi("/students", "get", (req: any, res: any) => {
  res.json(studentsStore);
});

registerApi("/students/:id", "get", (req: any, res: any) => {
  const id = parseInt(req.params.id, 10);
  const student = studentsStore.find(s => s.id === id);
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(student);
});

registerApi("/students", "post", (req: any, res: any) => {
  const { registrationNo, name, class: studentClass, subjectMarks, subjects } = req.body;
  if (!registrationNo || !name || !studentClass || subjectMarks === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
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

registerApi("/students/:id", "put", (req: any, res: any) => {
  const id = parseInt(req.params.id, 10);
  const index = studentsStore.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ message: "Student not found" });
  const updated = { ...studentsStore[index], ...req.body };
  studentsStore[index] = updated;
  res.json(updated);
});

registerApi("/students/:id", "delete", (req: any, res: any) => {
  const id = parseInt(req.params.id, 10);
  const index = studentsStore.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ message: "Student not found" });
  studentsStore.splice(index, 1);
  res.status(204).send();
});

registerApi("/dsa/search/binary", "get", (req: any, res: any) => {
  const targetRoll = String(req.query.roll || "").trim();
  const sorted = mergeSortStudents(studentsStore, "registrationNo", false);
  let low = 0, high = sorted.length - 1, comparisons = 0, found: Student | null = null;
  const steps: any[] = [];
  while (low <= high) {
    comparisons++;
    const mid = Math.floor((low + high) / 2);
    const midRoll = sorted[mid].registrationNo;
    const cmp = compareRoll(midRoll, targetRoll);
    if (cmp === 0) {
      found = sorted[mid];
      steps.push({ step: comparisons, low, mid, high, midRoll, action: `Match found at index ${mid}!` });
      break;
    } else if (cmp < 0) {
      steps.push({ step: comparisons, low, mid, high, midRoll, action: `Target > Mid → Search Right` });
      low = mid + 1;
    } else {
      steps.push({ step: comparisons, low, mid, high, midRoll, action: `Target < Mid → Search Left` });
      high = mid - 1;
    }
  }
  res.json({
    found: found !== null,
    student: found,
    targetRoll,
    comparisons,
    worstCaseBinary: Math.ceil(Math.log2(studentsStore.length + 1)),
    algorithm: "Binary Search O(log n)",
    totalRecords: studentsStore.length,
    steps,
  });
});

registerApi("/dsa/top-scorers", "get", (req: any, res: any) => {
  const sorted = mergeSortStudents(studentsStore, "subjectMarks", true);
  const top5 = sorted.slice(0, 5);
  const total = studentsStore.reduce((sum, s) => sum + s.subjectMarks, 0);
  res.json({
    topScorers: top5,
    batchAverage: Math.round((total / (studentsStore.length || 1)) * 10) / 10,
    totalStudents: studentsStore.length,
    highestMark: top5[0]?.subjectMarks || 0,
    lowestMark: sorted[sorted.length - 1]?.subjectMarks || 0,
  });
});

registerApi("/db-query", "post", (req: any, res: any) => {
  const { query } = req.body;
  res.json(executeQuery(query || ""));
});

const serverlessHandler = serverless(app);
export const handler = async (event: any, context: any) => {
  return serverlessHandler(event, context);
};
