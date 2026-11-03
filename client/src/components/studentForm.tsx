import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InsertStudent, Student, Subject } from "@shared/schema";
import { studentFormSchema, CLASS_OPTIONS, SUBJECT_NAME_OPTIONS } from "@/types/student";
import { DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";

interface StudentFormProps {
  title: string;
  student?: Student | null;
  onSubmit: (data: InsertStudent) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function StudentForm({ 
  title, 
  student, 
  onSubmit, 
  onCancel, 
  isLoading 
}: StudentFormProps) {
  const getDefaultSubjects = (existingSubjects?: Subject[]): Subject[] => {
    if (existingSubjects && existingSubjects.length > 0) {
      return existingSubjects;
    }
    return [
      { name: "Design & Analysis of Algorithms", marks: 85 },
      { name: "Operating Systems", marks: 80 },
      { name: "Database Systems", marks: 85 },
    ];
  };

  const form = useForm<InsertStudent>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: student ? {
      registrationNo: student.registrationNo,
      name: student.name,
      class: student.class,
      subjectMarks: student.subjectMarks,
      subjects: getDefaultSubjects(student.subjects),
    } : {
      registrationNo: "",
      name: "",
      class: "Computer Science",
      subjectMarks: 85,
      subjects: getDefaultSubjects(),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subjects",
  });

  const syncAverageMarks = () => {
    const currentSubjects = form.getValues("subjects") || [];
    if (currentSubjects.length > 0) {
      const total = currentSubjects.reduce((sum, s) => sum + (Number(s.marks) || 0), 0);
      const avg = Math.round(total / currentSubjects.length);
      form.setValue("subjectMarks", avg);
    }
  };

  const addSubject = () => {
    append({ 
      name: SUBJECT_NAME_OPTIONS[fields.length % SUBJECT_NAME_OPTIONS.length] || `Subject-${fields.length + 1}`, 
      marks: 80 
    });
    setTimeout(syncAverageMarks, 50);
  };
  
  const canRemoveSubject = fields.length > 1;

  return (
    <div className="text-zinc-100 font-sans">
      <DialogTitle className="mb-4 text-lg font-bold text-white tracking-tight font-sans">
        {title}
      </DialogTitle>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="registrationNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-sans text-zinc-300">Roll / Reg. No.</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. 101 or 14715602724" 
                      {...field} 
                      className="bg-zinc-900 border-zinc-700 text-white font-mono text-xs rounded-md h-9"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px] text-zinc-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-sans text-zinc-300">Student Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Aarav Sharma" 
                      {...field} 
                      className="bg-zinc-900 border-zinc-700 text-white text-xs rounded-md h-9"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px] text-zinc-400" />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-sans text-zinc-300">Department</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white font-sans text-xs rounded-md h-9">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-950 border border-zinc-800 text-white rounded-md">
                      {CLASS_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value} className="text-xs font-sans">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[11px] text-zinc-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subjectMarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-sans text-zinc-300">Aggregate Marks (0–100)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min={0}
                      max={100}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      className="bg-zinc-900 border-zinc-700 text-white font-mono text-xs rounded-md h-9"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px] text-zinc-400" />
                </FormItem>
              )}
            />
          </div>
          
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xs font-sans font-semibold text-white uppercase tracking-wider">
                  Enrolled Subjects & Scores
                </h3>
                <p className="text-[11px] text-zinc-500 font-sans">Scores evaluated on 0 to 100 scale</p>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addSubject}
                className="flex items-center gap-1 text-[11px] font-sans border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 rounded-md h-7"
              >
                <Plus className="h-3 w-3" />
                Add Subject
              </Button>
            </div>
            
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {fields.map((field, index) => (
                <div key={field.id} className="border border-zinc-800 p-2.5 bg-zinc-900/60 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name={`subjects.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value || undefined}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-zinc-950 border-zinc-700 text-white font-sans text-xs rounded-md h-8">
                                  <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-zinc-950 border-zinc-800 text-white rounded-md">
                                {SUBJECT_NAME_OPTIONS.map(option => (
                                  <SelectItem key={option} value={option} className="text-xs font-sans">
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="w-24">
                      <FormField
                        control={form.control}
                        name={`subjects.${index}.marks`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <Input 
                                type="number"
                                min={0}
                                max={100}
                                placeholder="Marks"
                                className="bg-zinc-950 border-zinc-700 text-white font-mono text-xs rounded-md h-8"
                                {...field}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  field.onChange(value);
                                  syncAverageMarks();
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {canRemoveSubject && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-md shrink-0"
                        onClick={() => {
                          remove(index);
                          setTimeout(syncAverageMarks, 50);
                        }}
                        title="Remove subject"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-800">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 text-xs font-sans rounded-md h-8"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-sans font-semibold rounded-md h-8 px-4"
            >
              {isLoading ? "Saving..." : student ? "Update Record" : "Save Record"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
