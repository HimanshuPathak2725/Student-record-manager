import type { VercelRequest, VercelResponse } from "@vercel/node";
import { INITIAL_STUDENTS } from "../../students";

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
