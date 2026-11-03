import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define subject schema for validation
const subjectSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
  marks: z.number()
    .min(0, "Marks must be between 0 and 100")
    .max(100, "Marks must be between 0 and 100"),
});

export type Subject = z.infer<typeof subjectSchema>;

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  registrationNo: text("registration_no").notNull().unique(),
  name: text("name").notNull(),
  class: text("class").notNull(),
  subjectMarks: integer("subject_marks").notNull(), // Aggregate marks (0 - 100)
  subjects: jsonb("subjects").$type<Subject[]>().default([]).notNull(), // Array of subjects
});

export const insertStudentSchema = createInsertSchema(students).pick({
  registrationNo: true,
  name: true,
  class: true,
  subjectMarks: true,
  subjects: true,
}).extend({
  registrationNo: z.string()
    .min(1, "Roll / Registration number is required")
    .regex(/^[\w\-]+$/, "Roll number must contain alphanumeric characters or hyphens (e.g. 101 or 14715602724)"),
  name: z.string().min(1, "Full name is required"),
  class: z.string().min(1, "Department / Class selection is required"),
  subjectMarks: z.number()
    .min(0, "Marks must be between 0 and 100")
    .max(100, "Marks must be between 0 and 100"),
  subjects: z.array(subjectSchema).default([]),
});

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;
