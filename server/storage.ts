import { students, type Student, type InsertStudent } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getStudents(): Promise<Student[]>;
  getStudent(id: number): Promise<Student | undefined>;
  getStudentByRegistrationNo(registrationNo: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, student: Partial<InsertStudent>): Promise<Student | undefined>;
  deleteStudent(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private students: Map<number, Student>;
  currentId: number;

  constructor() {
    this.students = new Map();
    this.currentId = 1;

    // Standardized academic dataset from students_data.csv (20 students)
    const sampleData: InsertStudent[] = [
      {
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

    sampleData.forEach((student) => {
      const id = this.currentId++;
      this.students.set(id, {
        id,
        registrationNo: student.registrationNo,
        name: student.name,
        class: student.class,
        subjectMarks: student.subjectMarks,
        subjects: student.subjects ?? [],
      });
    });
  }

  async getStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }

  async getStudent(id: number): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getStudentByRegistrationNo(registrationNo: string): Promise<Student | undefined> {
    return Array.from(this.students.values()).find(
      (student) => student.registrationNo === registrationNo,
    );
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = this.currentId++;
    const student: Student = {
      id,
      registrationNo: insertStudent.registrationNo,
      name: insertStudent.name,
      class: insertStudent.class,
      subjectMarks: insertStudent.subjectMarks,
      subjects: insertStudent.subjects ?? [],
    };
    this.students.set(id, student);
    return student;
  }

  async updateStudent(
    id: number,
    studentUpdate: Partial<InsertStudent>,
  ): Promise<Student | undefined> {
    const student = this.students.get(id);
    if (!student) {
      return undefined;
    }

    const updatedStudent: Student = {
      ...student,
      ...studentUpdate,
      subjects: studentUpdate.subjects ?? student.subjects,
    };
    this.students.set(id, updatedStudent);
    return updatedStudent;
  }

  async deleteStudent(id: number): Promise<boolean> {
    return this.students.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  async getStudents(): Promise<Student[]> {
    return await db.select().from(students);
  }

  async getStudent(id: number): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student || undefined;
  }

  async getStudentByRegistrationNo(registrationNo: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.registrationNo, registrationNo));
    return student || undefined;
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const [student] = await db
      .insert(students)
      .values(insertStudent)
      .returning();
    return student;
  }

  async updateStudent(
    id: number,
    studentUpdate: Partial<InsertStudent>,
  ): Promise<Student | undefined> {
    const student = await this.getStudent(id);
    if (!student) {
      return undefined;
    }

    const [updatedStudent] = await db
      .update(students)
      .set(studentUpdate)
      .where(eq(students.id, id))
      .returning();

    return updatedStudent;
  }

  async deleteStudent(id: number): Promise<boolean> {
    const result = await db
      .delete(students)
      .where(eq(students.id, id))
      .returning({ id: students.id });

    return result.length > 0;
  }
}

export const storage: IStorage = process.env.DATABASE_URL
  ? new DatabaseStorage()
  : new MemStorage();
