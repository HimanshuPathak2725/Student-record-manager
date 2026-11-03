import type { VercelRequest, VercelResponse } from "@vercel/node";
import { INITIAL_STUDENTS } from "./students";

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
