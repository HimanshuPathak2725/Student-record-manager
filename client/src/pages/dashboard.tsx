import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Trophy, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Download,
  Terminal,
  Activity,
  Layers,
  Network
} from "lucide-react";
import type { Student } from "@shared/schema";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Cell
} from "recharts";

interface BinarySearchStep {
  step: number;
  low: number;
  mid: number;
  high: number;
  midRoll: string;
  action: string;
}

interface BinarySearchResult {
  found: boolean;
  student: Student | null;
  targetRoll: string;
  comparisons: number;
  linearComparisons: number;
  worstCaseBinary: number;
  worstCaseLinear: number;
  algorithm: string;
  totalRecords: number;
  steps: BinarySearchStep[];
}

export default function Dashboard() {
  const { data: students = [], isLoading } = useQuery<Student[]>({
    queryKey: [API_ENDPOINTS.STUDENTS],
  });

  const [searchRoll, setSearchRoll] = useState("112");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<BinarySearchResult | null>(null);
  const [activeListNode, setActiveListNode] = useState<Student | null>(null);

  const totalStudents = students.length;
  const uniqueClasses = new Set(students.map(s => s.class)).size;
  const totalMarks = students.reduce((sum, s) => sum + s.subjectMarks, 0);
  const averageMarks = totalStudents > 0 ? Math.round((totalMarks / totalStudents) * 10) / 10 : 0;
  
  // Sorted descending for top scorers
  const sortedByMarks = [...students].sort((a, b) => b.subjectMarks - a.subjectMarks);
  const topScorer = sortedByMarks[0];
  const top5Scorers = sortedByMarks.slice(0, 5).map((s, idx) => ({
    name: s.name.split(" ")[0],
    fullName: s.name,
    roll: s.registrationNo,
    marks: s.subjectMarks,
    rank: idx + 1,
    subjects: s.subjects || [],
  }));

  // Department comparative metrics
  const departmentAverages = (() => {
    const map: Record<string, { total: number; count: number }> = {};
    students.forEach(s => {
      if (!map[s.class]) map[s.class] = { total: 0, count: 0 };
      map[s.class].total += s.subjectMarks;
      map[s.class].count += 1;
    });
    return Object.entries(map).map(([dept, data]) => ({
      department: dept,
      avgMarks: Math.round((data.total / data.count) * 10) / 10,
      count: data.count,
    })).sort((a, b) => b.avgMarks - a.avgMarks);
  })();

  // Grade frequency distribution
  const gradeBands = [
    { label: "90–100% (Merit)", min: 90, max: 100 },
    { label: "80–89% (Very Good)", min: 80, max: 89 },
    { label: "70–79% (Good)", min: 70, max: 79 },
    { label: "60–69% (Satisfactory)", min: 60, max: 69 },
    { label: "< 60% (Passing)", min: 0, max: 59 },
  ].map(b => {
    const count = students.filter(s => s.subjectMarks >= b.min && s.subjectMarks <= b.max).length;
    const percentage = students.length > 0 ? Math.round((count / students.length) * 100) : 0;
    return { ...b, count, percentage };
  });

  const handleBinarySearch = async (rollToSearch?: string) => {
    const target = (rollToSearch ?? searchRoll).trim();
    if (!target) return;

    setIsSearching(true);
    try {
      const res = await fetch(`/api/dsa/search/binary?roll=${encodeURIComponent(target)}`);
      if (res.ok) {
        const data: BinarySearchResult = await res.json();
        setSearchResult(data);
      }
    } catch (err) {
      console.error("Binary search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

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

  const sortedRolls = [...students]
    .map(s => s.registrationNo)
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

  return (
    <div className="py-6 mx-auto px-4 sm:px-6 md:px-8 space-y-6 text-zinc-100 font-sans">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
            Academic Performance Dashboard
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            CIC-311: Design and Analysis of Algorithms • Algorithmic Telemetry & Record Analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportCSV} 
            className="text-xs font-sans border-zinc-700 bg-zinc-900/70 hover:bg-white hover:text-black transition-colors rounded-md h-8"
          >
            <Download className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
            Export CSV
          </Button>
          <Link href="/students">
            <Button 
              size="sm" 
              className="bg-white text-zinc-950 hover:bg-zinc-200 transition-colors text-xs font-sans font-semibold rounded-md h-8"
            >
              <span>View Records</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all rounded-lg shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400 font-sans">
              Enrolled Records
            </span>
            <Users className="h-4 w-4 text-zinc-400" />
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-20 bg-zinc-800 rounded-md" />
          ) : (
            <div className="text-2xl font-mono font-bold text-white">{totalStudents}</div>
          )}
          <p className="text-[11px] text-zinc-500 font-sans mt-1">Singly Linked List dynamic heap</p>
        </div>

        <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all rounded-lg shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400 font-sans">
              Batch Average
            </span>
            <BarChart3 className="h-4 w-4 text-zinc-400" />
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-20 bg-zinc-800 rounded-md" />
          ) : (
            <div className="text-2xl font-mono font-bold text-white">{averageMarks}%</div>
          )}
          <p className="text-[11px] text-zinc-500 font-sans mt-1">Institutional baseline metric</p>
        </div>

        <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all rounded-lg shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400 font-sans">
              Topper (#1 Rank)
            </span>
            <Trophy className="h-4 w-4 text-zinc-400" />
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-24 bg-zinc-800 rounded-md" />
          ) : (
            <div className="text-2xl font-mono font-bold text-white">
              {topScorer ? `${topScorer.subjectMarks}%` : "N/A"}
            </div>
          )}
          <p className="text-[11px] text-zinc-400 font-sans mt-1 truncate">
            {topScorer ? `${topScorer.name} (Roll ${topScorer.registrationNo})` : "None"}
          </p>
        </div>

        <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all rounded-lg shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400 font-sans">
              Active Departments
            </span>
            <BookOpen className="h-4 w-4 text-zinc-400" />
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-16 bg-zinc-800 rounded-md" />
          ) : (
            <div className="text-2xl font-mono font-bold text-white">{uniqueClasses}</div>
          )}
          <p className="text-[11px] text-zinc-500 font-sans mt-1">CS, IT, ECE, Mech, Civil</p>
        </div>
      </div>

      {/* Row 2: Top 5 Scorers Chart & Binary Search Live Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top 5 Scorers Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-lg shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2 font-sans">
                  <Activity className="h-4 w-4 text-zinc-400" />
                  Top 5 Student Scorers (Merge Sort Ranking)
                </div>
                <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                  Evaluated via Divide-and-Conquer Merge Sort O(n log n)
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 border border-zinc-700 bg-zinc-950 text-zinc-200 rounded-md">
                Batch Average: {averageMarks}%
              </span>
            </div>

            {isLoading ? (
              <div className="h-72 flex items-center justify-center">
                <Skeleton className="h-full w-full bg-zinc-800 rounded-md" />
              </div>
            ) : top5Scorers.length > 0 ? (
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={top5Scorers}
                    margin={{ top: 15, right: 15, left: -15, bottom: 20 }}
                  >
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 11, fill: "#a1a1aa", fontFamily: "Geist, sans-serif" }}
                      tickFormatter={(name, i) => `${name} (#${top5Scorers[i].roll})`}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      tick={{ fontSize: 11, fill: "#71717a", fontFamily: "JetBrains Mono" }}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-zinc-950 p-3 border border-zinc-700 rounded-lg shadow-xl text-xs font-sans">
                              <div className="font-bold text-white font-sans">Rank #{data.rank}: {data.fullName}</div>
                              <div className="text-zinc-400 font-mono text-[11px]">Roll: {data.roll}</div>
                              <div className="text-white font-mono font-bold mt-1">Overall Marks: {data.marks} / 100</div>
                              {data.subjects && data.subjects.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-zinc-800 space-y-0.5 text-[10px] font-mono text-zinc-400">
                                  {data.subjects.map((sub: any, idx: number) => (
                                    <div key={idx} className="flex justify-between gap-3">
                                      <span className="truncate max-w-[140px]">{sub.name}:</span>
                                      <span className="text-white font-bold">{sub.marks}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    {/* Subtle reference line with NO overlapping label */}
                    <ReferenceLine 
                      y={averageMarks} 
                      stroke="#71717a" 
                      strokeDasharray="4 4"
                    />
                    <Bar dataKey="marks" radius={[6, 6, 0, 0]}>
                      {top5Scorers.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index === 0 ? "#f8fafc" : "#64748b"} 
                          stroke={index === 0 ? "#ffffff" : "#475569"}
                          strokeWidth={1}
                        />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-zinc-500 text-xs font-sans">
                No student records available
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 text-[11px] font-sans text-zinc-400 pt-3 border-t border-zinc-800/80">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 bg-white inline-block border border-zinc-400 rounded-sm" />
              #1 Rank Batch Topper
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 bg-slate-500 inline-block rounded-sm" />
              Top 2–5 Rankers
            </span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-3 border-b-2 border-dashed border-zinc-400 inline-block" />
              Batch Average ({averageMarks}%)
            </span>
          </div>
        </div>

        {/* Right Column: Binary Search Live Simulator Widget (5 Cols) */}
        <div className="lg:col-span-5 bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-lg shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2 font-sans">
                  <Terminal className="h-4 w-4 text-zinc-400" />
                  Binary Search Visualizer
                </div>
                <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                  Divide-and-conquer roll telemetry in O(log n)
                </p>
              </div>
              <span className="text-[11px] font-mono text-zinc-300 px-2 py-0.5 border border-zinc-700 bg-zinc-950 rounded-md">
                O(log n)
              </span>
            </div>

            <form 
              onSubmit={(e) => { e.preventDefault(); handleBinarySearch(); }} 
              className="flex gap-2 mt-4"
            >
              <Input
                type="text"
                placeholder="Enter Roll (e.g. 104, 112, 120)"
                value={searchRoll}
                onChange={(e) => setSearchRoll(e.target.value)}
                className="text-xs font-mono h-9 bg-zinc-950 border-zinc-700 text-white rounded-md"
              />
              <Button 
                type="submit" 
                size="sm" 
                disabled={isSearching} 
                className="h-9 bg-white text-zinc-950 hover:bg-zinc-200 transition-colors text-xs font-sans font-semibold rounded-md px-4"
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </form>

            {/* Clickable Quick Roll Strip */}
            <div className="mt-4">
              <div className="text-[10px] font-sans font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Quick Select Sorted Cells:</span>
                <span className="font-mono text-zinc-500">20 Nodes</span>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                {sortedRolls.map((r) => {
                  const isSelected = searchResult?.targetRoll === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => { setSearchRoll(r); handleBinarySearch(r); }}
                      className={`py-1 text-[11px] font-mono border transition-all text-center rounded-md ${
                        isSelected
                          ? "bg-white text-zinc-950 border-white font-bold shadow-sm"
                          : "bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600"
                      }`}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            {searchResult ? (
              <div className="space-y-3 pt-3">
                <div className={`p-3.5 border rounded-lg ${searchResult.found ? 'bg-zinc-950/90 border-zinc-700' : 'bg-zinc-950/50 border-zinc-800'}`}>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-xs font-sans font-bold">
                      {searchResult.found ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 mr-1.5" />
                          <span className="text-white">Record Located in Memory</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-zinc-500 mr-1.5" />
                          <span className="text-zinc-400">Record Not Found</span>
                        </>
                      )}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 border border-zinc-700 bg-zinc-900 text-zinc-300 rounded-md">
                      Target: {searchResult.targetRoll}
                    </span>
                  </div>

                  {searchResult.found && searchResult.student && (
                    <div className="mt-2 text-xs font-sans text-zinc-300 space-y-0.5 border-t border-zinc-800/80 pt-2">
                      <div className="font-bold text-sm text-white font-sans">{searchResult.student.name}</div>
                      <div className="text-zinc-400">{searchResult.student.class}</div>
                      <div className="text-zinc-200 font-mono font-semibold">Aggregate Score: {searchResult.student.subjectMarks}%</div>
                    </div>
                  )}
                </div>

                {/* Algorithmic Comparisons Comparison */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-3 bg-zinc-950 border border-zinc-700 text-center rounded-lg shadow-sm">
                    <div className="text-[10px] uppercase font-sans text-zinc-400">Binary Search</div>
                    <div className="text-xl font-bold text-white my-0.5">
                      {searchResult.comparisons}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-sans">
                      Checks (O(log n))
                    </div>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 text-center rounded-lg shadow-sm">
                    <div className="text-[10px] uppercase font-sans text-zinc-500">Linear Scan</div>
                    <div className="text-xl font-bold text-zinc-400 my-0.5">
                      {searchResult.linearComparisons}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-sans">
                      Checks (O(n))
                    </div>
                  </div>
                </div>

                {/* Steps Trace */}
                {searchResult.steps.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-sans font-semibold text-zinc-400 uppercase tracking-wider">
                      Execution Trace Log:
                    </div>
                    <div className="max-h-24 overflow-y-auto space-y-1 text-[11px] font-mono pr-1">
                      {searchResult.steps.map((st) => (
                        <div key={st.step} className="p-1.5 bg-zinc-950/80 border border-zinc-800/80 rounded-md text-zinc-300">
                          <span className="font-bold text-white mr-1.5">Step {st.step}:</span>
                          <span>Range [{st.low}..{st.high}], Mid: <b>{st.midRoll}</b> ({st.action})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 bg-zinc-950/40 border border-dashed border-zinc-800 rounded-lg text-center flex-1 flex flex-col items-center justify-center mt-3">
                <Search className="h-6 w-6 text-zinc-600 mb-2" />
                <div className="text-xs font-sans font-semibold text-zinc-300">Run Binary Search Simulation</div>
                <div className="text-[11px] font-sans text-zinc-500 mt-1 max-w-xs">
                  Select or type any roll number to observe logarithmic midpoint halving in real time.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Department Performance Comparison & Grade Frequency Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Diagram A: Department Performance Breakdown (6 cols) */}
        <div className="lg:col-span-6 bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2 font-sans">
                <Layers className="h-4 w-4 text-zinc-400" />
                Department Performance Comparison
              </div>
              <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                Mean aggregate scores evaluated across 5 engineering disciplines
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-300 px-2 py-0.5 border border-zinc-700 bg-zinc-950 rounded-md">
              5 Depts
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {departmentAverages.map((dept) => (
              <div key={dept.department} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-sans font-medium text-zinc-200">{dept.department}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-zinc-400 text-[11px]">({dept.count} students)</span>
                    <span className="text-white font-bold">{dept.avgMarks}%</span>
                  </div>
                </div>
                <div className="w-full bg-zinc-950 border border-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-zinc-200 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(dept.avgMarks, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Diagram B: Grade Frequency Distribution Histogram (6 cols) */}
        <div className="lg:col-span-6 bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2 font-sans">
                <BarChart3 className="h-4 w-4 text-zinc-400" />
                Grade Frequency Distribution
              </div>
              <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                Cohort headcount grouped into standard GPA score bands
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-300 px-2 py-0.5 border border-zinc-700 bg-zinc-950 rounded-md">
              GPA Bands
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
            {gradeBands.map((band) => (
              <div 
                key={band.label}
                className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-lg text-center flex flex-col justify-between"
              >
                <div className="text-[10px] font-sans font-medium text-zinc-400 mb-1 leading-tight">
                  {band.label}
                </div>
                <div className="text-xl font-mono font-bold text-white my-1">
                  {band.count}
                </div>
                <div className="w-full bg-zinc-900 border border-zinc-800 h-1.5 my-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-zinc-200 h-full rounded-full" 
                    style={{ width: `${band.percentage}%` }}
                  />
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                  {band.percentage}% cohort
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Diagram C: Singly Linked List Dynamic Memory Chain Visualizer */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-zinc-800/80">
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2 font-sans">
              <Network className="h-4 w-4 text-zinc-400" />
              Singly Linked List: Dynamic Memory Chain Simulation
            </div>
            <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
              Live RAM node sequence in heap memory • Click any node to inspect pointer references
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 border border-zinc-700 bg-zinc-950 text-zinc-300 rounded-md">
              Head: 0x7ffe10
            </span>
            <span className="text-zinc-500">──&gt;</span>
            <span className="px-2 py-0.5 border border-zinc-700 bg-zinc-950 text-zinc-300 rounded-md">
              Tail: 0x7ffecc
            </span>
          </div>
        </div>

        {/* Scrollable Node Chain */}
        <div className="overflow-x-auto pb-2 pt-1">
          <div className="flex items-center gap-2 min-w-max">
            <div className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 rounded-md text-[10px] font-mono text-zinc-400 font-bold uppercase">
              HEAD
            </div>
            <span className="text-zinc-500 font-mono text-xs">─►</span>

            {students.slice(0, 10).map((st, idx) => {
              const isSelected = activeListNode?.id === st.id;
              const simulatedAddr = `0x${(5242880 + idx * 48).toString(16)}`;
              return (
                <div key={st.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveListNode(isSelected ? null : st)}
                    className={`p-2.5 border rounded-lg text-left transition-all font-mono text-xs ${
                      isSelected
                        ? "bg-white text-zinc-950 border-white shadow-md scale-105"
                        : "bg-zinc-950/80 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px]">
                      <span className="opacity-60">{simulatedAddr}</span>
                      <span className="font-bold">Roll {st.registrationNo}</span>
                    </div>
                    <div className="font-sans font-semibold text-xs mt-1 truncate max-w-[120px]">
                      {st.name}
                    </div>
                    <div className="flex items-center justify-between text-[10px] mt-1 pt-1 border-t border-zinc-800/80">
                      <span className="opacity-70">{st.subjectMarks}%</span>
                      <span className="opacity-50">next ─►</span>
                    </div>
                  </button>
                  <span className="text-zinc-600 font-mono text-xs">─►</span>
                </div>
              );
            })}

            <div className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-[10px] font-mono text-zinc-500 font-bold uppercase">
              NULL
            </div>
          </div>
        </div>

        {/* Focused Node Drawer if clicked */}
        {activeListNode && (
          <div className="p-3.5 bg-zinc-950 border border-zinc-700 rounded-lg flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-zinc-900 border border-zinc-700 rounded-md flex items-center justify-center font-mono font-bold text-white text-xs">
                {activeListNode.registrationNo}
              </div>
              <div>
                <div className="font-sans font-bold text-sm text-white">
                  {activeListNode.name}
                </div>
                <div className="text-xs text-zinc-400 font-sans">
                  {activeListNode.class} • Aggregate: <strong className="text-white font-mono">{activeListNode.subjectMarks}%</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearchRoll(activeListNode.registrationNo);
                  handleBinarySearch(activeListNode.registrationNo);
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                className="text-xs font-sans border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-white hover:text-black rounded-md h-8"
              >
                <Search className="h-3.5 w-3.5 mr-1 text-zinc-400" />
                Binary Search This Node
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setActiveListNode(null)}
                className="text-xs text-zinc-400 hover:text-white rounded-md h-8"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
