import type { VercelRequest, VercelResponse } from "@vercel/node";

const INITIAL_STUDENTS = [
  { id: 1, registrationNo: "101", name: "Aarav Sharma", class: "Computer Science", subjectMarks: 95 },
  { id: 2, registrationNo: "102", name: "Diya Patel", class: "Information Technology", subjectMarks: 88 },
  { id: 3, registrationNo: "103", name: "Rohan Verma", class: "Computer Science", subjectMarks: 77 },
  { id: 4, registrationNo: "104", name: "Ananya Iyer", class: "Electronics", subjectMarks: 91 },
  { id: 5, registrationNo: "105", name: "Vikram Singh", class: "Mechanical", subjectMarks: 69 },
  { id: 6, registrationNo: "106", name: "Neha Gupta", class: "Computer Science", subjectMarks: 85 },
  { id: 7, registrationNo: "107", name: "Karan Mehta", class: "Information Technology", subjectMarks: 72 },
  { id: 8, registrationNo: "108", name: "Pooja Nair", class: "Electronics", subjectMarks: 96 },
  { id: 9, registrationNo: "109", name: "Aditya Rao", class: "Computer Science", subjectMarks: 83 },
  { id: 10, registrationNo: "110", name: "Sneha Joshi", class: "Civil", subjectMarks: 79 },
  { id: 11, registrationNo: "111", name: "Rahul Deshmukh", class: "Mechanical", subjectMarks: 90 },
  { id: 12, registrationNo: "112", name: "Tanvi Kulkarni", class: "Computer Science", subjectMarks: 98 },
  { id: 13, registrationNo: "113", name: "Siddharth Jain", class: "Information Technology", subjectMarks: 65 },
  { id: 14, registrationNo: "114", name: "Riya Kapoor", class: "Electronics", subjectMarks: 78 },
  { id: 15, registrationNo: "115", name: "Manish Kumar", class: "Civil", subjectMarks: 71 },
  { id: 16, registrationNo: "116", name: "Isha Roy", class: "Computer Science", subjectMarks: 93 },
  { id: 17, registrationNo: "117", name: "Gaurav Bhatt", class: "Mechanical", subjectMarks: 84 },
  { id: 18, registrationNo: "118", name: "Shreya Sen", class: "Information Technology", subjectMarks: 90 },
  { id: 19, registrationNo: "119", name: "Kunal Chopra", class: "Electronics", subjectMarks: 64 },
  { id: 20, registrationNo: "120", name: "Meera Nambiar", class: "Computer Science", subjectMarks: 96 },
];

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
