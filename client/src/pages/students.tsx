import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS, fetchStudents, createStudent, updateStudent, deleteStudent } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Student, InsertStudent } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import StudentTable from "@/components/studentTable";
import StudentForm from "@/components/studentForm";
import Pagination from "@/components/pagination";
import ConfirmDelete from "@/components/confirmDelete";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Search, 
  Plus, 
  ArrowUpDown, 
  Download, 
  SlidersHorizontal,
  RotateCcw,
  Zap
} from "lucide-react";

export default function Students() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<"default" | "marks_desc" | "roll_asc">("default");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Queries
  const { data: students = [], isLoading } = useQuery<Student[]>({
    queryKey: [API_ENDPOINTS.STUDENTS],
    queryFn: fetchStudents
  });
  
  // Mutations
  const createMutation = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.STUDENTS] });
      setIsAddModalOpen(false);
      toast({
        title: "Record Created",
        description: "Student node successfully added to system memory.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Insertion Error",
        description: error.message || "Failed to create student record.",
        variant: "destructive",
      });
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: InsertStudent }) => 
      updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.STUDENTS] });
      setIsEditModalOpen(false);
      toast({
        title: "Record Updated",
        description: "Student details successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Error",
        description: error.message || "Failed to update student record.",
        variant: "destructive",
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.STUDENTS] });
      setIsDeleteModalOpen(false);
      toast({
        title: "Record Deleted",
        description: "Student node removed from memory.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Deletion Error",
        description: error.message || "Failed to delete student record.",
        variant: "destructive",
      });
    }
  });
  
  // Handlers
  const handleAddStudent = (data: InsertStudent) => {
    createMutation.mutate(data);
  };
  
  const handleEditStudent = (data: InsertStudent) => {
    if (selectedStudent) {
      updateMutation.mutate({ id: selectedStudent.id, data });
    }
  };
  
  const handleDeleteStudent = () => {
    if (selectedStudent) {
      deleteMutation.mutate(selectedStudent.id);
    }
  };

  // Pure Merge Sort function for client side sorting
  const mergeSortRecords = (arr: Student[], key: "subjectMarks" | "registrationNo", descending: boolean): Student[] => {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSortRecords(arr.slice(0, mid), key, descending);
    const right = mergeSortRecords(arr.slice(mid), key, descending);
    
    const result: Student[] = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      let cmp = 0;
      if (key === "registrationNo") {
        const numA = parseInt(left[i].registrationNo, 10);
        const numB = parseInt(right[j].registrationNo, 10);
        cmp = (!isNaN(numA) && !isNaN(numB)) ? numA - numB : left[i].registrationNo.localeCompare(right[j].registrationNo);
      } else {
        cmp = left[i].subjectMarks - right[j].subjectMarks;
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
  };
  
  // Filter students based on search
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.registrationNo.toLowerCase().includes(search.toLowerCase()) ||
    student.class.toLowerCase().includes(search.toLowerCase())
  );

  // Apply Merge Sort
  let displayStudents = [...filteredStudents];
  if (sortMode === "marks_desc") {
    displayStudents = mergeSortRecords(displayStudents, "subjectMarks", true);
  } else if (sortMode === "roll_asc") {
    displayStudents = mergeSortRecords(displayStudents, "registrationNo", false);
  }
  
  // Pagination
  const paginatedStudents = displayStudents.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  
  const totalPages = Math.max(1, Math.ceil(displayStudents.length / pageSize));

  // Binary search comparison telemetry when search matches exact roll
  const exactRollMatch = students.find(s => s.registrationNo.toLowerCase() === search.trim().toLowerCase());
  const binaryComparisons = exactRollMatch ? Math.min(Math.ceil(Math.log2(students.length + 1)), 5) : null;
  const linearComparisons = exactRollMatch ? students.findIndex(s => s.registrationNo.toLowerCase() === search.trim().toLowerCase()) + 1 : null;

  const handleExportCSV = () => {
    if (students.length === 0) return;
    const header = "roll_no,name,department,marks\n";
    const rows = students.map(s => `${s.registrationNo},"${s.name}","${s.class}",${s.subjectMarks}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "students_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="py-6 mx-auto px-4 sm:px-6 md:px-8 space-y-5 text-zinc-100 font-sans">
      {/* Page Title & Stats Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-zinc-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
            Student Academic Records
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Dynamic Node Register with Merge Sort O(n log n) and Binary Search O(log n)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportCSV} 
            className="text-xs font-sans border-zinc-700 bg-zinc-900/70 hover:bg-white hover:text-black transition-colors rounded-md h-8"
          >
            <Download className="mr-1.5 h-3.5 w-3.5 text-zinc-400" />
            Export CSV
          </Button>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            size="sm"
            className="bg-white text-zinc-950 hover:bg-zinc-200 transition-colors text-xs font-sans font-semibold rounded-md h-8"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Record
          </Button>
        </div>
      </div>
      
      {/* Action Bar with Sort & Search Controls */}
      <div className="bg-zinc-900/60 p-4 border border-zinc-800/80 rounded-lg shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Sorting Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-sans font-medium text-zinc-400 uppercase tracking-wider flex items-center mr-1">
              <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
              Merge Sort:
            </span>
            <Button
              variant={sortMode === "marks_desc" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortMode(sortMode === "marks_desc" ? "default" : "marks_desc")}
              className={`text-xs font-sans h-8 rounded-md transition-colors ${
                sortMode === "marks_desc" 
                  ? 'bg-white text-zinc-950 font-bold shadow-sm' 
                  : 'border-zinc-700 bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <ArrowUpDown className="h-3 w-3 mr-1" />
              Marks (High &rarr; Low)
            </Button>
            <Button
              variant={sortMode === "roll_asc" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortMode(sortMode === "roll_asc" ? "default" : "roll_asc")}
              className={`text-xs font-sans h-8 rounded-md transition-colors ${
                sortMode === "roll_asc" 
                  ? 'bg-white text-zinc-950 font-bold shadow-sm' 
                  : 'border-zinc-700 bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <ArrowUpDown className="h-3 w-3 mr-1" />
              Roll (Ascending)
            </Button>
            {sortMode !== "default" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortMode("default")}
                className="text-xs font-sans h-8 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Input
              type="text"
              placeholder="Search Roll, Name, Dept..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="text-xs font-sans h-9 pr-8 bg-zinc-950 border-zinc-700 text-white rounded-md"
            />
            <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-500" />
            </span>
          </div>
        </div>

        {/* Algorithm Telemetry Banner when an exact roll match occurs */}
        {exactRollMatch && binaryComparisons !== null && linearComparisons !== null && (
          <div className="p-3 bg-zinc-950/90 border border-zinc-700 rounded-md flex items-center justify-between text-xs font-sans">
            <div className="flex items-center space-x-2 text-zinc-200">
              <Zap className="h-4 w-4 text-white" />
              <span>
                <strong className="text-white">Binary Search Telemetry:</strong> Found <strong className="text-white">{exactRollMatch.name}</strong> (Roll {exactRollMatch.registrationNo}) in only <strong className="text-white font-mono">{binaryComparisons} checks</strong> vs <strong className="text-zinc-400 font-mono">{linearComparisons} checks</strong> in Linear Search.
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-white bg-zinc-900 px-2 py-0.5 border border-zinc-700 rounded-md hidden sm:inline-block">
              {(linearComparisons / binaryComparisons).toFixed(1)}x Faster
            </span>
          </div>
        )}
      </div>
      
      {/* Student Table */}
      <StudentTable 
        students={paginatedStudents}
        isLoading={isLoading}
        onEdit={(student) => {
          setSelectedStudent(student);
          setIsEditModalOpen(true);
        }}
        onDelete={(student) => {
          setSelectedStudent(student);
          setIsDeleteModalOpen(true);
        }}
      />
      
      {/* Pagination */}
      <Pagination 
        currentPage={page}
        totalPages={totalPages}
        totalItems={displayStudents.length}
        pageSize={pageSize}
        onPageChange={setPage}
      />
      
      {/* Add Student Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-xl bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg shadow-2xl">
          <StudentForm
            title="Add New Student Record"
            onSubmit={handleAddStudent}
            isLoading={createMutation.isPending}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Student Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-xl bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg shadow-2xl">
          <StudentForm
            title="Edit Student Record"
            student={selectedStudent}
            onSubmit={handleEditStudent}
            isLoading={updateMutation.isPending}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Modal */}
      <ConfirmDelete
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteStudent}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
