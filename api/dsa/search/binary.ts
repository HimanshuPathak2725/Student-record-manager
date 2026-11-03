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

function compareRoll(a: string, b: string): number {
  const numA = parseInt(a, 10);
  const numB = parseInt(b, 10);
  if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
  return a.localeCompare(b);
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const targetRoll = String(req.query.roll || "").trim();
  if (!targetRoll) {
    return res.status(400).json({ message: "roll query parameter is required" });
  }

  const sorted = [...INITIAL_STUDENTS].sort((a, b) => compareRoll(a.registrationNo, b.registrationNo));
  let low = 0;
  let high = sorted.length - 1;
  let comparisons = 0;
  let found: any = null;
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

  return res.status(200).json({
    found: found !== null,
    student: found,
    targetRoll,
    comparisons,
    worstCaseBinary: Math.ceil(Math.log2(INITIAL_STUDENTS.length + 1)),
    algorithm: "Binary Search O(log n)",
    totalRecords: INITIAL_STUDENTS.length,
    steps,
  });
}
