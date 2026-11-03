import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { Student } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";

interface StudentTableProps {
  students: Student[];
  isLoading: boolean;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onSaveChanges?: (student: Student) => void;
}

export default function StudentTable({ 
  students, 
  isLoading, 
  onEdit, 
  onDelete,
}: StudentTableProps) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  
  const toggleRowExpansion = (studentId: number) => {
    setExpandedRows(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  const getScoreBadge = (marks: number) => {
    if (marks >= 90) return "border-white bg-white text-zinc-950 font-bold";
    if (marks >= 80) return "border-zinc-500 bg-zinc-900 text-white font-bold";
    if (marks >= 70) return "border-zinc-700 bg-zinc-950 text-zinc-300";
    return "border-zinc-800 bg-zinc-950 text-zinc-500";
  };

  if (isLoading) {
    return (
      <div className="border border-zinc-800/80 bg-zinc-900/60 rounded-lg overflow-x-auto shadow-sm">
        <Table className="text-xs">
          <TableHeader className="bg-zinc-950 border-b border-zinc-800">
            <TableRow className="border-zinc-800">
              <TableHead className="text-zinc-400 font-sans">Roll No.</TableHead>
              <TableHead className="text-zinc-400 font-sans">Name</TableHead>
              <TableHead className="text-zinc-400 font-sans">Department</TableHead>
              <TableHead className="text-zinc-400 font-sans">Score</TableHead>
              <TableHead className="text-zinc-400 font-sans">Subjects</TableHead>
              <TableHead className="text-right text-zinc-400 font-sans">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index} className="border-zinc-800">
                <TableCell><Skeleton className="h-4 w-16 bg-zinc-800 rounded-md" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28 bg-zinc-800 rounded-md" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24 bg-zinc-800 rounded-md" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12 bg-zinc-800 rounded-md" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32 bg-zinc-800 rounded-md" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-7 w-16 ml-auto bg-zinc-800 rounded-md" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="border border-zinc-800/80 bg-zinc-900/60 p-12 text-center rounded-lg shadow-sm font-sans">
        <p className="text-zinc-400 text-xs font-semibold">No student records match your query.</p>
        <p className="text-[11px] text-zinc-500 mt-1">Try entering roll numbers (e.g. 101, 112) or clearing search filters.</p>
      </div>
    );
  }

  return (
    <div className="border border-zinc-800/80 bg-zinc-900/60 rounded-lg overflow-x-auto shadow-sm">
      <Table className="text-xs">
        <TableHeader className="bg-zinc-950 border-b border-zinc-800">
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="px-5 py-3 text-left font-sans font-semibold text-zinc-400">
              Roll No.
            </TableHead>
            <TableHead className="px-5 py-3 text-left font-sans font-semibold text-zinc-400">
              Student Name
            </TableHead>
            <TableHead className="px-5 py-3 text-left font-sans font-semibold text-zinc-400">
              Department
            </TableHead>
            <TableHead className="px-5 py-3 text-left font-sans font-semibold text-zinc-400">
              Marks (100)
            </TableHead>
            <TableHead className="px-5 py-3 text-left font-sans font-semibold text-zinc-400">
              Subject Scores
            </TableHead>
            <TableHead className="px-5 py-3 text-right font-sans font-semibold text-zinc-400">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-zinc-800/70 text-zinc-200">
          {students.map((student) => {
            const isExpanded = expandedRows.includes(student.id);
            return (
              <React.Fragment key={student.id}>
                <TableRow 
                  className={`hover:bg-zinc-800/40 transition-colors border-zinc-800/80 ${isExpanded ? 'bg-zinc-800/30' : ''}`}
                >
                  <TableCell className="px-5 py-3.5 whitespace-nowrap font-mono font-bold text-white">
                    {student.registrationNo}
                  </TableCell>
                  <TableCell className="px-5 py-3.5 whitespace-nowrap font-sans font-medium text-white">
                    {student.name}
                  </TableCell>
                  <TableCell className="px-5 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 border border-zinc-800 bg-zinc-950 text-zinc-300 font-sans text-[11px] rounded-md">
                      {student.class}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-3.5 whitespace-nowrap">
                    <Badge variant="outline" className={`font-mono text-xs rounded-md ${getScoreBadge(student.subjectMarks)}`}>
                      {student.subjectMarks}%
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-3.5">
                    <div className="flex items-center">
                      <div className="flex-1">
                        {student.subjects && student.subjects.length > 0 ? (
                          <div className="flex gap-1.5 flex-wrap">
                            {student.subjects.slice(0, 2).map((subject, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-0.5 border border-zinc-800 bg-zinc-950 text-zinc-300 font-sans text-[10px] rounded-md">
                                {subject.name}: <strong className="ml-1 text-white font-mono">{subject.marks}</strong>
                              </span>
                            ))}
                            {student.subjects.length > 2 && (
                              <span className="inline-flex items-center px-1.5 py-0.5 border border-zinc-800 bg-zinc-950 text-zinc-500 font-mono text-[10px] rounded-md">
                                +{student.subjects.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-zinc-500 font-mono text-xs">{student.subjectMarks} / 100</span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(student.id)}
                        className="ml-2 h-6 w-6 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md"
                        title={isExpanded ? "Collapse subjects" : "Expand subjects"}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-3.5 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(student)}
                        className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md"
                        title="Edit student record"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(student)}
                        className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md"
                        title="Delete record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                
                {/* Expanded row for showing all subjects */}
                {isExpanded && student.subjects && student.subjects.length > 0 && (
                  <TableRow className="bg-zinc-950/70 border-b border-zinc-800">
                    <TableCell colSpan={6} className="px-8 py-4 font-sans">
                      <div className="text-[11px] font-sans font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                        Subject Performance Breakdown ({student.name})
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                        {student.subjects.map((subject, index) => (
                          <div key={index} className="border border-zinc-800 p-2.5 bg-zinc-900/60 rounded-md">
                            <div className="text-xs text-zinc-300 font-sans truncate" title={subject.name}>
                              {subject.name}
                            </div>
                            <div className="text-sm font-bold text-white font-mono mt-0.5">
                              {subject.marks} <span className="text-[10px] text-zinc-500 font-normal">/ 100</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
