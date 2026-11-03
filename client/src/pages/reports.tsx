import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/api";
import { Student } from "@shared/schema";
import { INITIAL_STUDENTS } from "@shared/initialData";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, PieChart, GraduationCap } from "lucide-react";

export default function Reports() {
  const { data: students = (INITIAL_STUDENTS as Student[]), isLoading } = useQuery<Student[]>({
    queryKey: [API_ENDPOINTS.STUDENTS],
    initialData: INITIAL_STUDENTS as Student[],
  });

  // Department counts
  const getStudentsByClass = () => {
    const classCounts: Record<string, number> = {};
    students.forEach(student => {
      classCounts[student.class] = (classCounts[student.class] || 0) + 1;
    });
    return classCounts;
  };

  // Average marks by department
  const getAverageMarksByClass = () => {
    const classMarks: Record<string, { total: number; count: number }> = {};
    students.forEach(student => {
      if (classMarks[student.class]) {
        classMarks[student.class].total += student.subjectMarks;
        classMarks[student.class].count++;
      } else {
        classMarks[student.class] = { total: student.subjectMarks, count: 1 };
      }
    });

    const averages: Record<string, number> = {};
    Object.entries(classMarks).forEach(([className, { total, count }]) => {
      averages[className] = Math.round(total / count);
    });

    return averages;
  };

  // Grade buckets out of 100 in monochrome
  const gradeBands = [
    { label: "90–100% (Merit / O)", min: 90, max: 100 },
    { label: "80–89% (Very Good / A+)", min: 80, max: 89 },
    { label: "70–79% (Good / A)", min: 70, max: 79 },
    { label: "60–69% (Satisfactory / B)", min: 60, max: 69 },
    { label: "< 60% (Passing)", min: 0, max: 59 },
  ];

  return (
    <div className="py-6 mx-auto px-4 sm:px-6 md:px-8 space-y-6 text-zinc-100 font-sans">
      <div className="pb-4 border-b border-zinc-800/80">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-sans">
          <BarChart3 className="h-5 w-5 text-zinc-400" />
          Academic Analytics & Reports
        </h1>
        <p className="text-xs text-zinc-400 font-sans mt-0.5">
          Departmental distributions and score frequency bands across enrolled cohort
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Students by Department Card */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2 font-sans">
                <PieChart className="h-4 w-4 text-zinc-400" />
                Department Enrollment Ratio
              </div>
              <p className="text-[11px] text-zinc-400 font-sans mt-0.5">Distribution across engineering branches</p>
            </div>
            <span className="text-[11px] font-mono text-zinc-300 px-2 py-0.5 border border-zinc-700 bg-zinc-950 rounded-md">
              5 Disciplines
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3 pt-2">
              <Skeleton className="h-5 w-full bg-zinc-800 rounded-md" />
              <Skeleton className="h-5 w-3/4 bg-zinc-800 rounded-md" />
              <Skeleton className="h-5 w-4/5 bg-zinc-800 rounded-md" />
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              {Object.entries(getStudentsByClass()).map(([deptName, count]) => {
                const percentage = students.length > 0 ? Math.round((count / students.length) * 100) : 0;
                return (
                  <div key={deptName} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-200 font-sans">{deptName}</span>
                      <span className="text-zinc-400 font-mono text-[11px]">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-zinc-950 border border-zinc-800 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-zinc-200 h-full rounded-full transition-all duration-300" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Average Marks by Department Card */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2 font-sans">
                <BarChart3 className="h-4 w-4 text-zinc-400" />
                Departmental Mean Marks
              </div>
              <p className="text-[11px] text-zinc-400 font-sans mt-0.5">Average score evaluated out of 100</p>
            </div>
            <span className="text-[11px] font-mono text-zinc-300 px-2 py-0.5 border border-zinc-700 bg-zinc-950 rounded-md">
              Mean Score
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3 pt-2">
              <Skeleton className="h-5 w-full bg-zinc-800 rounded-md" />
              <Skeleton className="h-5 w-3/4 bg-zinc-800 rounded-md" />
              <Skeleton className="h-5 w-4/5 bg-zinc-800 rounded-md" />
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              {Object.entries(getAverageMarksByClass()).map(([deptName, avg]) => (
                <div key={deptName} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-200 font-sans">{deptName}</span>
                    <span className="text-white font-mono font-bold">{avg} / 100</span>
                  </div>
                  <div className="w-full bg-zinc-950 border border-zinc-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-zinc-300 h-full rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(avg, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Academic Performance Distribution Card */}
        <div className="md:col-span-2 bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2 font-sans">
                <GraduationCap className="h-4 w-4 text-zinc-400" />
                Grade Frequency Distribution
              </div>
              <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                Cohort headcount grouped into university grade brackets
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-300 px-2 py-0.5 border border-zinc-700 bg-zinc-950 rounded-md">
              GPA Bands
            </span>
          </div>

          {isLoading ? (
            <Skeleton className="h-32 w-full bg-zinc-800 rounded-md" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
              {gradeBands.map((band) => {
                const count = students.filter(
                  s => s.subjectMarks >= band.min && s.subjectMarks <= band.max
                ).length;
                const pct = students.length > 0 ? Math.round((count / students.length) * 100) : 0;
                
                return (
                  <div key={band.label} className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-lg text-center flex flex-col justify-between">
                    <div className="text-[11px] font-sans font-medium text-zinc-400 mb-1 leading-tight">{band.label}</div>
                    <div className="text-2xl font-mono font-bold text-white my-1">
                      {count}
                    </div>
                    <div className="w-full bg-zinc-900 border border-zinc-800 h-1.5 my-1.5 rounded-full overflow-hidden">
                      <div className="bg-zinc-200 h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500">{pct}% cohort</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
