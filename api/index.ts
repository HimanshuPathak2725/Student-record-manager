import type { VercelRequest, VercelResponse } from "@vercel/node";
import { INITIAL_STUDENTS } from "./students";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: "ok",
    message: "CIC-311 Student Record System API",
    records: INITIAL_STUDENTS.length,
    students: INITIAL_STUDENTS,
  });
}
