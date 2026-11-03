import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Database, Play, RefreshCw, Save, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface QueryResult {
  data: any[];
  message?: string;
  error?: string;
}

export default function DatabaseManager() {
  const { toast } = useToast();
  const [sqlQuery, setSqlQuery] = useState("SELECT AVG(subject_marks) as average_marks FROM students;");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedQueries, setSavedQueries] = useState<string[]>([
    "SELECT * FROM students;",
    "SELECT AVG(subject_marks) as average_marks FROM students;",
    "SELECT class, COUNT(*) as student_count FROM students GROUP BY class;",
    "SELECT * FROM students WHERE subject_marks >= 90;"
  ]);

  const runQuery = async () => {
    if (!sqlQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a SQL query",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/db-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sqlQuery }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
        toast({
          title: "Execution Succeeded",
          description: data.message || "Query executed successfully",
        });
      } else {
        const errorMsg = data.error || data.message || "Failed to execute query";
        setResult({ data: [], error: errorMsg });
        toast({
          title: "Execution Error",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const errorMsg = error.message || "An unexpected error occurred";
      setResult({ data: [], error: errorMsg });
      toast({
        title: "Execution Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveQuery = () => {
    if (!sqlQuery.trim()) return;
    if (!savedQueries.includes(sqlQuery)) {
      setSavedQueries([...savedQueries, sqlQuery]);
      toast({
        title: "Saved",
        description: "Query saved to workspace presets",
      });
    }
  };

  const loadQuery = (query: string) => {
    setSqlQuery(query);
  };

  const deleteQuery = (index: number) => {
    const newQueries = [...savedQueries];
    newQueries.splice(index, 1);
    setSavedQueries(newQueries);
  };

  const sampleQueries = [
    "SELECT registration_no, name, class, subject_marks FROM students ORDER BY subject_marks DESC LIMIT 5;",
    "SELECT class, COUNT(*) as count, ROUND(AVG(subject_marks), 2) as dept_avg FROM students GROUP BY class;",
    "SELECT * FROM students WHERE class = 'Computer Science' AND subject_marks >= 90;",
    "SELECT MIN(subject_marks) as lowest, MAX(subject_marks) as highest FROM students;"
  ];

  return (
    <div className="py-6 mx-auto px-4 sm:px-6 md:px-8 space-y-6 text-zinc-100 font-sans">
      <div className="pb-4 border-b border-zinc-800/80">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-sans">
          <Database className="h-5 w-5 text-zinc-400" />
          Database Query Terminal
        </h1>
        <p className="text-xs text-zinc-400 font-sans mt-0.5">
          Execute direct SQL operations on in-memory SQLite synchronized with student records
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Query Editor Box */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-lg shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
              <span className="text-xs font-sans font-semibold text-zinc-400 uppercase tracking-wider">
                SQL Console
              </span>
              <span className="text-[11px] font-mono text-zinc-400 px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded-md">
                SQLite 3 Engine Active
              </span>
            </div>

            <Textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="min-h-36 font-mono text-xs bg-zinc-950 border-zinc-700 text-zinc-100 focus:border-white transition-colors rounded-md"
              placeholder="Enter your SQL query (e.g. SELECT * FROM students;)..."
            />
            
            <div className="flex flex-wrap gap-2 pt-1">
              <Button 
                onClick={runQuery} 
                disabled={isLoading}
                className="bg-white text-zinc-950 hover:bg-zinc-200 transition-colors text-xs font-sans font-semibold rounded-md h-9 px-4"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="mr-1.5 h-3.5 w-3.5" />
                    Execute Query
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={saveQuery}
                className="border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 text-xs font-sans rounded-md h-9"
              >
                <Save className="mr-1.5 h-3.5 w-3.5" />
                Save Preset
              </Button>
            </div>
          </div>

          {/* Results Box */}
          {result && (
            <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-lg shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                <span className="text-xs font-sans font-semibold text-zinc-400 uppercase tracking-wider">
                  Query Results
                </span>
                <Badge 
                  variant="outline" 
                  className="rounded-md border-zinc-700 font-mono text-xs text-zinc-300"
                >
                  {result.error ? "Execution Failed" : `${result.data.length} row(s)`}
                </Badge>
              </div>

              {result.error ? (
                <div className="p-3.5 bg-zinc-950 border border-zinc-700 rounded-md text-zinc-300 font-mono text-xs flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white mb-0.5 font-sans">SQL Execution Error:</div>
                    <div>{result.error}</div>
                  </div>
                </div>
              ) : result.data.length > 0 ? (
                <div className="overflow-x-auto border border-zinc-800 rounded-lg">
                  <Table className="font-mono text-xs">
                    <TableHeader className="bg-zinc-950 text-zinc-400 uppercase">
                      <TableRow className="border-zinc-800 hover:bg-transparent">
                        {Object.keys(result.data[0]).map((key) => (
                          <TableHead key={key} className="py-2.5 px-3.5 text-zinc-400 font-mono">
                            {key}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-zinc-800/70 text-zinc-200">
                      {result.data.map((row, i) => (
                        <TableRow key={i} className="hover:bg-zinc-800/40 border-zinc-800">
                          {Object.values(row).map((value: any, j) => (
                            <TableCell key={j} className="py-2.5 px-3.5 font-mono">
                              {value === null ? (
                                <span className="text-zinc-500 italic">null</span>
                              ) : typeof value === 'object' ? (
                                JSON.stringify(value)
                              ) : (
                                String(value)
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-6 text-zinc-500 font-sans text-xs">
                  Query completed successfully. No matching records returned.
                </div>
              )}
              
              {result.message && !result.error && (
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-300 font-mono text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-zinc-400 shrink-0" />
                  <span>{result.message}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Saved & Sample Queries */}
        <div className="space-y-6">
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-lg shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
              <span className="text-xs font-sans font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-zinc-400" />
                Saved Presets
              </span>
            </div>

            {savedQueries.length === 0 ? (
              <p className="text-zinc-500 text-center py-4 text-xs font-sans">No saved queries yet</p>
            ) : (
              <div className="space-y-2">
                {savedQueries.map((query, index) => (
                  <div key={index} className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-md text-xs font-mono">
                    <div className="text-zinc-300 font-mono truncate">{query}</div>
                    <div className="mt-2.5 flex gap-2">
                      <button 
                        type="button"
                        onClick={() => loadQuery(query)}
                        className="px-2.5 py-1 text-[11px] font-sans border border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-white hover:text-black transition-colors rounded-md"
                      >
                        Load
                      </button>
                      <button 
                        type="button"
                        onClick={() => deleteQuery(index)}
                        className="px-2.5 py-1 text-[11px] font-sans border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 transition-colors rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-lg shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
              <span className="text-xs font-sans font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="h-4 w-4 text-zinc-400" />
                Institutional Presets
              </span>
            </div>

            <div className="space-y-2">
              {sampleQueries.map((query, index) => (
                <div key={index} className="p-3 bg-zinc-950/80 border border-zinc-800/80 rounded-md text-xs font-mono">
                  <div className="text-zinc-400 font-mono text-[11px] truncate">{query}</div>
                  <div className="mt-2.5">
                    <button 
                      type="button"
                      onClick={() => setSqlQuery(query)}
                      className="px-2.5 py-1 text-[11px] font-sans border border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-white hover:text-black transition-colors rounded-md"
                    >
                      Load Query
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
