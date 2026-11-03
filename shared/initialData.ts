export interface Subject {
  name: string;
  marks: number;
}

export interface Student {
  id: number;
  registrationNo: string;
  name: string;
  class: string;
  subjectMarks: number;
  subjects: Subject[];
}

export type InsertStudent = Omit<Student, "id"> & { id?: number };

export const INITIAL_STUDENTS: Student[] = [
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

export function compareRoll(a: string, b: string): number {
  const numA = parseInt(a, 10);
  const numB = parseInt(b, 10);
  if (!isNaN(numA) && !isNaN(numB)) {
    return numA - numB;
  }
  return a.localeCompare(b);
}

export function mergeSortStudents(
  arr: Student[],
  key: "subjectMarks" | "registrationNo" | "name" = "subjectMarks",
  descending = false,
): Student[] {
  if (arr.length <= 1) return [...arr];
  const mid = Math.floor(arr.length / 2);
  const left = mergeSortStudents(arr.slice(0, mid), key, descending);
  const right = mergeSortStudents(arr.slice(mid), key, descending);
  return mergeStudents(left, right, key, descending);
}

function mergeStudents(
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
