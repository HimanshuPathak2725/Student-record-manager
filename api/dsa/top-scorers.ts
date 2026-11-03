import type { VercelRequest, VercelResponse } from "@vercel/node";
import { INITIAL_STUDENTS } from "../students";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const sorted = [...INITIAL_STUDENTS].sort((a, b) => b.subjectMarks - a.subjectMarks);
  const top5 = sorted.slice(0, 5);
  const total = INITIAL_STUDENTS.reduce((sum, s) => sum + s.subjectMarks, 0);

  return res.status(200).json({
    topScorers: top5,
    batchAverage: Math.round((total / (INITIAL_STUDENTS.length || 1)) * 10) / 10,
    totalStudents: INITIAL_STUDENTS.length,
    highestMark: top5[0]?.subjectMarks || 0,
    lowestMark: sorted[sorted.length - 1]?.subjectMarks || 0,
  });
}
