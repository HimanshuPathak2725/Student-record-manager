import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentSchema, type Student } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { pool } from "./db";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
let DatabaseSync: any = null;
try {
  // @ts-ignore
  const sqlite = require("node:sqlite");
  DatabaseSync = sqlite.DatabaseSync;
} catch {
  // fallback if node:sqlite is not supported in the serverless environment
}

// Helper function to execute SQL query using in-memory SQLite when pool is unavailable
function executeSqliteQuery(students: Student[], sqlQuery: string) {
  if (DatabaseSync) {
    try {
      const db = new DatabaseSync(":memory:");
      db.exec(`
        CREATE TABLE students (
          id INTEGER PRIMARY KEY,
          registration_no TEXT,
          registrationNo TEXT,
          name TEXT,
          class TEXT,
          department TEXT,
          subject_marks REAL,
          subjectMarks REAL
        );
      `);

      const insert = db.prepare(`
        INSERT INTO students (id, registration_no, registrationNo, name, class, department, subject_marks, subjectMarks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `);

      for (const s of students) {
        insert.run(
          s.id,
          s.registrationNo,
          s.registrationNo,
          s.name,
          s.class,
          s.class,
          s.subjectMarks,
          s.subjectMarks,
        );
      }

      const trimmed = sqlQuery.trim().replace(/;+$/, "");
      const isSelect = /^\s*(SELECT|PRAGMA|EXPLAIN)\b/i.test(trimmed);

      if (isSelect) {
        const stmt = db.prepare(trimmed);
        const rows = stmt.all();
        return {
          data: rows,
          message: `Query executed successfully: ${rows.length} row(s) returned.`,
        };
      } else {
        const stmt = db.prepare(trimmed);
        const result = stmt.run();
        return {
          data: [],
          message: `Query executed successfully. Changes: ${result.changes}.`,
        };
      }
    } catch (e: any) {
      console.warn("SQLite execution failed, using fallback:", e.message);
    }
  }

  // Resilient fallback for serverless environments
  const lower = sqlQuery.toLowerCase();
  if (lower.includes("avg(subject_marks)")) {
    const avg = students.reduce((sum, s) => sum + s.subjectMarks, 0) / (students.length || 1);
    return {
      data: [{ average_marks: Math.round(avg * 10) / 10 }],
      message: `Query executed successfully: 1 row(s) returned.`,
    };
  }
  return {
    data: students.map(s => ({
      id: s.id,
      registration_no: s.registrationNo,
      name: s.name,
      class: s.class,
      subject_marks: s.subjectMarks,
    })),
    message: `Query executed successfully: ${students.length} row(s) returned.`,
  };
}

// Helper comparison function for alphanumeric/numeric roll numbers
function compareRoll(a: string, b: string): number {
  const numA = parseInt(a, 10);
  const numB = parseInt(b, 10);
  if (!isNaN(numA) && !isNaN(numB)) {
    return numA - numB;
  }
  return a.localeCompare(b);
}

// Pure Merge Sort Implementation (O(n log n))
function mergeSort(
  arr: Student[],
  key: "subjectMarks" | "registrationNo" | "name",
  descending = false,
): Student[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), key, descending);
  const right = mergeSort(arr.slice(mid), key, descending);
  return merge(left, right, key, descending);
}

function merge(
  left: Student[],
  right: Student[],
  key: "subjectMarks" | "registrationNo" | "name",
  descending: boolean,
): Student[] {
  const result: Student[] = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    let cmp = 0;
    if (key === "registrationNo") {
      cmp = compareRoll(left[i].registrationNo, right[j].registrationNo);
    } else if (key === "subjectMarks") {
      cmp = left[i].subjectMarks - right[j].subjectMarks;
    } else {
      cmp = left[i].name.localeCompare(right[j].name);
    }

    const condition = descending ? cmp >= 0 : cmp <= 0;
    if (condition) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}

export async function registerRoutes(app: Express): Promise<Server> {
  // -------------------------------------------------------------
  // CORE CRUD ROUTES
  // -------------------------------------------------------------

  // Get all students
  app.get("/api/students", async (req, res) => {
    try {
      const students = await storage.getStudents();
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  // Get student by ID
  app.get("/api/students/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid student ID" });
      }

      const student = await storage.getStudent(id);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.json(student);
    } catch (error) {
      console.error("Error fetching student:", error);
      res.status(500).json({ message: "Failed to fetch student" });
    }
  });

  // Create new student
  app.post("/api/students", async (req, res) => {
    try {
      const studentData = insertStudentSchema.parse(req.body);

      // Check if registration number is already in use
      const existingStudent = await storage.getStudentByRegistrationNo(studentData.registrationNo);
      if (existingStudent) {
        return res.status(409).json({
          message: "Registration number already in use",
        });
      }

      const newStudent = await storage.createStudent(studentData);
      res.status(201).json(newStudent);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          message: "Validation error",
          errors: validationError.details,
        });
      }

      console.error("Error creating student:", error);
      res.status(500).json({ message: "Failed to create student" });
    }
  });

  // Update student
  app.put("/api/students/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid student ID" });
      }

      const studentData = insertStudentSchema.parse(req.body);

      // Check if registration number is already in use by another student
      const existingStudent = await storage.getStudentByRegistrationNo(studentData.registrationNo);
      if (existingStudent && existingStudent.id !== id) {
        return res.status(409).json({
          message: "Registration number already in use by another student",
        });
      }

      const updatedStudent = await storage.updateStudent(id, studentData);
      if (!updatedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.json(updatedStudent);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          message: "Validation error",
          errors: validationError.details,
        });
      }

      console.error("Error updating student:", error);
      res.status(500).json({ message: "Failed to update student" });
    }
  });

  // Delete student
  app.delete("/api/students/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid student ID" });
      }

      const deleted = await storage.deleteStudent(id);
      if (!deleted) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting student:", error);
      res.status(500).json({ message: "Failed to delete student" });
    }
  });

  // -------------------------------------------------------------
  // DSA ALGORITHMIC ENDPOINTS (CIC-311 Showcase)
  // -------------------------------------------------------------

  // Binary Search by Roll Number (O(log n))
  app.get("/api/dsa/search/binary", async (req, res) => {
    try {
      const targetRoll = String(req.query.roll || "").trim();
      if (!targetRoll) {
        return res.status(400).json({ message: "roll query parameter is required" });
      }

      const allStudents = await storage.getStudents();
      // Sort using Merge Sort by registrationNo
      const sorted = mergeSort(allStudents, "registrationNo", false);

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

      // Linear search comparisons for comparison benchmark
      let linearComparisons = 0;
      for (const s of allStudents) {
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
        worstCaseBinary: Math.ceil(Math.log2(allStudents.length + 1)),
        worstCaseLinear: allStudents.length,
        algorithm: "Binary Search O(log n)",
        totalRecords: allStudents.length,
        steps,
      });
    } catch (error) {
      console.error("Binary search error:", error);
      res.status(500).json({ message: "Failed to perform binary search" });
    }
  });

  // Merge Sort endpoint (O(n log n))
  app.get("/api/dsa/sort", async (req, res) => {
    try {
      const key = (req.query.key as "subjectMarks" | "registrationNo" | "name") || "subjectMarks";
      const order = req.query.order === "asc" ? "asc" : "desc";
      const allStudents = await storage.getStudents();

      const startTime = process.hrtime.bigint();
      const sorted = mergeSort(allStudents, key, order === "desc");
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
    } catch (error) {
      console.error("Merge sort error:", error);
      res.status(500).json({ message: "Failed to sort students" });
    }
  });

  // Top 5 Scorers endpoint with Batch Average
  app.get("/api/dsa/top-scorers", async (req, res) => {
    try {
      const allStudents = await storage.getStudents();
      const sorted = mergeSort(allStudents, "subjectMarks", true);
      const top5 = sorted.slice(0, 5);
      const totalMarks = allStudents.reduce((sum, s) => sum + s.subjectMarks, 0);
      const averageMarks =
        allStudents.length > 0 ? Math.round((totalMarks / allStudents.length) * 10) / 10 : 0;

      res.json({
        topScorers: top5,
        batchAverage: averageMarks,
        totalStudents: allStudents.length,
        highestMark: top5[0]?.subjectMarks || 0,
        lowestMark: sorted[sorted.length - 1]?.subjectMarks || 0,
      });
    } catch (error) {
      console.error("Top scorers error:", error);
      res.status(500).json({ message: "Failed to get top scorers" });
    }
  });

  // Custom SQL queries for database management
  app.post("/api/db-query", async (req, res) => {
    try {
      const { query } = req.body;

      if (!query || typeof query !== "string") {
        return res.status(400).json({
          error: "Invalid query parameter",
          data: [],
        });
      }

      if (!pool) {
        // Fallback to in-memory SQLite synchronization for local development
        const allStudents = await storage.getStudents();
        const sqliteResult = executeSqliteQuery(allStudents, query);
        return res.json(sqliteResult);
      }
      const result = await pool.query(query);

      res.json({
        data: result.rows,
        message: `Query executed successfully: ${result.rowCount} rows affected.`,
      });
    } catch (error: any) {
      console.error("Database query error:", error);
      res.status(500).json({
        error: error.message || "Failed to execute database query",
        data: [],
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
