import type { VercelRequest, VercelResponse } from "@vercel/node";

const INITIAL_STUDENTS = [
  {
    id: 1,
    registrationNo: "101",
    name: "Aarav Sharma",
    class: "Computer Science",
    subjectMarks: 95,
    subjects: [
      { name: "Design & Analysis of Algorithms", marks: 95 },
      { name: "Operating Systems", marks: 94 },
      { name: "Database Management Systems", marks: 95 },
    ],
  },
  {
    id: 2,
    registrationNo: "102",
    name: "Diya Patel",
    class: "Information Technology",
    subjectMarks: 88,
    subjects: [
      { name: "Data Structures", marks: 87 },
      { name: "Web Technologies", marks: 89 },
      { name: "Computer Networks", marks: 88 },
    ],
  },
  {
    id: 3,
    registrationNo: "103",
    name: "Rohan Verma",
    class: "Computer Science",
    subjectMarks: 77,
    subjects: [
      { name: "Discrete Mathematics", marks: 75 },
      { name: "Data Structures", marks: 78 },
      { name: "Software Engineering", marks: 77 },
    ],
  },
  {
    id: 4,
    registrationNo: "104",
    name: "Ananya Iyer",
    class: "Electronics",
    subjectMarks: 91,
    subjects: [
      { name: "Signal Processing", marks: 92 },
      { name: "Digital Electronics", marks: 90 },
      { name: "Microprocessors", marks: 91 },
    ],
  },
  {
    id: 5,
    registrationNo: "105",
    name: "Vikram Singh",
    class: "Mechanical",
    subjectMarks: 69,
    subjects: [
      { name: "Thermodynamics", marks: 68 },
      { name: "Fluid Mechanics", marks: 70 },
      { name: "Machine Design", marks: 69 },
    ],
  },
  {
    id: 6,
    registrationNo: "106",
    name: "Neha Gupta",
    class: "Computer Science",
    subjectMarks: 85,
    subjects: [
      { name: "Algorithms", marks: 86 },
      { name: "Artificial Intelligence", marks: 84 },
      { name: "Computer Networks", marks: 85 },
    ],
  },
  {
    id: 7,
    registrationNo: "107",
    name: "Karan Mehta",
    class: "Information Technology",
    subjectMarks: 72,
    subjects: [
      { name: "Cloud Computing", marks: 71 },
      { name: "Information Security", marks: 73 },
      { name: "Python Programming", marks: 72 },
    ],
  },
  {
    id: 8,
    registrationNo: "108",
    name: "Pooja Nair",
    class: "Electronics",
    subjectMarks: 96,
    subjects: [
      { name: "VLSI Design", marks: 97 },
      { name: "Embedded Systems", marks: 95 },
      { name: "Digital Signal Processing", marks: 96 },
    ],
  },
  {
    id: 9,
    registrationNo: "109",
    name: "Aditya Rao",
    class: "Computer Science",
    subjectMarks: 83,
    subjects: [
      { name: "Compiler Design", marks: 82 },
      { name: "Computer Architecture", marks: 84 },
      { name: "Operating Systems", marks: 83 },
    ],
  },
  {
    id: 10,
    registrationNo: "110",
    name: "Sneha Joshi",
    class: "Civil",
    subjectMarks: 79,
    subjects: [
      { name: "Structural Analysis", marks: 80 },
      { name: "Surveying", marks: 78 },
      { name: "Geotechnical Engineering", marks: 79 },
    ],
  },
  {
    id: 11,
    registrationNo: "111",
    name: "Rahul Deshmukh",
    class: "Mechanical",
    subjectMarks: 90,
    subjects: [
      { name: "Robotics & Automation", marks: 91 },
      { name: "CAD/CAM", marks: 89 },
      { name: "Manufacturing Processes", marks: 90 },
    ],
  },
  {
    id: 12,
    registrationNo: "112",
    name: "Tanvi Kulkarni",
    class: "Computer Science",
    subjectMarks: 98,
    subjects: [
      { name: "Data Structures & Algorithms", marks: 99 },
      { name: "Machine Learning", marks: 98 },
      { name: "Theory of Computation", marks: 97 },
    ],
  },
  {
    id: 13,
    registrationNo: "113",
    name: "Siddharth Jain",
    class: "Information Technology",
    subjectMarks: 65,
    subjects: [
      { name: "Web Technologies", marks: 66 },
      { name: "Relational Databases", marks: 64 },
      { name: "Java Programming", marks: 65 },
    ],
  },
  {
    id: 14,
    registrationNo: "114",
    name: "Riya Kapoor",
    class: "Electronics",
    subjectMarks: 78,
    subjects: [
      { name: "Circuit Analysis", marks: 79 },
      { name: "Telecommunications", marks: 77 },
      { name: "Control Systems", marks: 78 },
    ],
  },
  {
    id: 15,
    registrationNo: "115",
    name: "Manish Kumar",
    class: "Civil",
    subjectMarks: 71,
    subjects: [
      { name: "Hydraulics Engineering", marks: 70 },
      { name: "Transportation Systems", marks: 72 },
      { name: "Environmental Engineering", marks: 71 },
    ],
  },
  {
    id: 16,
    registrationNo: "116",
    name: "Isha Roy",
    class: "Computer Science",
    subjectMarks: 93,
    subjects: [
      { name: "Data Science & Big Data", marks: 94 },
      { name: "Algorithms", marks: 93 },
      { name: "Cloud Architecture", marks: 92 },
    ],
  },
  {
    id: 17,
    registrationNo: "117",
    name: "Gaurav Bhatt",
    class: "Mechanical",
    subjectMarks: 84,
    subjects: [
      { name: "Heat & Mass Transfer", marks: 85 },
      { name: "Applied Mechanics", marks: 83 },
      { name: "Automobile Engineering", marks: 84 },
    ],
  },
  {
    id: 18,
    registrationNo: "118",
    name: "Shreya Sen",
    class: "Information Technology",
    subjectMarks: 90,
    subjects: [
      { name: "Cyber Security & Forensics", marks: 91 },
      { name: "Data Mining", marks: 89 },
      { name: "DevOps & SRE", marks: 90 },
    ],
  },
  {
    id: 19,
    registrationNo: "119",
    name: "Kunal Chopra",
    class: "Electronics",
    subjectMarks: 64,
    subjects: [
      { name: "Analog Communication", marks: 63 },
      { name: "Sensors & Actuators", marks: 65 },
      { name: "Instrumentation", marks: 64 },
    ],
  },
  {
    id: 20,
    registrationNo: "120",
    name: "Meera Nambiar",
    class: "Computer Science",
    subjectMarks: 96,
    subjects: [
      { name: "Advanced Data Structures", marks: 97 },
      { name: "Cryptography", marks: 95 },
      { name: "Distributed Systems", marks: 96 },
    ],
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { query } = req.body || {};
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Invalid query parameter", data: [] });
  }

  const clean = query.trim().replace(/;+$/, "");
  const lower = clean.toLowerCase();

  if (lower.includes("avg(subject_marks)")) {
    const avg = INITIAL_STUDENTS.reduce((sum, s) => sum + s.subjectMarks, 0) / (INITIAL_STUDENTS.length || 1);
    return res.status(200).json({
      data: [{ average_marks: Math.round(avg * 10) / 10 }],
      message: "Query executed successfully: 1 row(s) returned.",
    });
  }

  if (lower.includes("group by class")) {
    const deptMap: Record<string, { count: number; totalMarks: number }> = {};
    for (const s of INITIAL_STUDENTS) {
      if (!deptMap[s.class]) deptMap[s.class] = { count: 0, totalMarks: 0 };
      deptMap[s.class].count++;
      deptMap[s.class].totalMarks += s.subjectMarks;
    }
    const rows = Object.entries(deptMap).map(([dept, val]) => ({
      class: dept,
      student_count: val.count,
      count: val.count,
      dept_avg: Math.round((val.totalMarks / val.count) * 10) / 10,
    }));
    return res.status(200).json({
      data: rows,
      message: `Query executed successfully: ${rows.length} row(s) returned.`,
    });
  }

  if (lower.includes("where subject_marks >=")) {
    const match = lower.match(/where\s+subject_marks\s*>=\s*(\d+)/);
    const threshold = match ? parseInt(match[1], 10) : 90;
    const filtered = INITIAL_STUDENTS
      .filter(s => s.subjectMarks >= threshold)
      .map(s => ({
        id: s.id,
        registration_no: s.registrationNo,
        name: s.name,
        class: s.class,
        subject_marks: s.subjectMarks,
      }));
    return res.status(200).json({
      data: filtered,
      message: `Query executed successfully: ${filtered.length} row(s) returned.`,
    });
  }

  if (lower.includes("order by subject_marks desc") && lower.includes("limit 5")) {
    const sorted = [...INITIAL_STUDENTS].sort((a, b) => b.subjectMarks - a.subjectMarks).slice(0, 5);
    return res.status(200).json({
      data: sorted.map(s => ({
        registration_no: s.registrationNo,
        name: s.name,
        class: s.class,
        subject_marks: s.subjectMarks,
      })),
      message: "Query executed successfully: 5 row(s) returned.",
    });
  }

  const rows = INITIAL_STUDENTS.map(s => ({
    id: s.id,
    registration_no: s.registrationNo,
    registrationNo: s.registrationNo,
    name: s.name,
    class: s.class,
    subject_marks: s.subjectMarks,
    subjectMarks: s.subjectMarks,
  }));
  return res.status(200).json({
    data: rows,
    message: `Query executed successfully: ${rows.length} row(s) returned.`,
  });
}
