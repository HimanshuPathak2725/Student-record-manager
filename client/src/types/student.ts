import { z } from "zod";
import { insertStudentSchema } from "@shared/schema";

export const studentFormSchema = insertStudentSchema;

export enum NotificationType {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
}

export interface Notification {
  type: NotificationType;
  title: string;
  message: string;
  show: boolean;
}

// Class & Department options matching our institutional dataset
export const CLASS_OPTIONS = [
  { value: "Computer Science", label: "Computer Science" },
  { value: "Information Technology", label: "Information Technology" },
  { value: "Electronics", label: "Electronics" },
  { value: "Mechanical", label: "Mechanical" },
  { value: "Civil", label: "Civil" },
  { value: "CSE – T3", label: "CSE – T3 (ADGIPS)" },
];

// Subject name options
export const SUBJECT_NAME_OPTIONS = [
  "Design & Analysis of Algorithms",
  "Data Structures & Algorithms",
  "Operating Systems",
  "Database Management Systems",
  "Computer Networks",
  "Machine Learning",
  "Artificial Intelligence",
  "Software Engineering",
  "Web Technologies",
  "Signal Processing",
  "Digital Electronics",
  "Microprocessors",
  "Thermodynamics",
  "Fluid Mechanics",
  "Structural Analysis",
  "Mathematics",
  "Theory of Computation",
  "Compiler Design",
  "Cyber Security",
  "Cloud Computing",
];
