import { Menu, Info, Award, GraduationCap, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Sidebar from "./sidebar";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  return (
    <>
      <header className="relative z-20 flex flex-shrink-0 h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 text-zinc-100">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden px-3 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex-1 flex justify-between px-4 sm:px-6">
          <div className="flex-1 flex items-center space-x-3">
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="text-sm sm:text-base font-semibold tracking-tight text-white font-sans">
                  CIC-311: Student Record Manager
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono tracking-wider border border-zinc-700 bg-zinc-900/90 text-zinc-300 rounded-md">
                  ADGIPS CSE-T3
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans hidden md:block mt-0.5">
                Design & Analysis of Algorithms • Dr. Akhilesh Das Gupta Institute of Professional Studies
              </p>
            </div>
          </div>
          <div className="ml-4 flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTeamModalOpen(true)}
              className="text-xs font-sans border-zinc-700 text-zinc-200 bg-zinc-900/70 hover:bg-white hover:text-black transition-colors rounded-md h-8"
            >
              <Info className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
              Project Info
            </Button>

            <div className="flex items-center space-x-2 pl-3 border-l border-zinc-800">
              <Avatar className="h-8 w-8 bg-zinc-900 border border-zinc-700 text-white font-mono text-xs rounded-md">
                <AvatarFallback className="rounded-md bg-zinc-900 text-white">ADG</AvatarFallback>
              </Avatar>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-zinc-200 leading-tight font-sans">GGSIPU</div>
                <div className="text-[10px] text-zinc-400 font-mono">2024-28</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-zinc-950 border-r border-zinc-800 text-zinc-100">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Project & Team Credentials Modal */}
      <Dialog open={isTeamModalOpen} onOpenChange={setIsTeamModalOpen}>
        <DialogContent className="max-w-lg bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 text-zinc-100 rounded-lg shadow-2xl font-sans">
          <DialogHeader>
            <div className="flex items-center space-x-2 text-zinc-300">
              <GraduationCap className="h-5 w-5 text-white" />
              <DialogTitle className="text-lg font-bold tracking-tight text-white font-sans">
                DAA Mini Project (CIC-311)
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-zinc-400 font-sans">
              Department of Computer Science & Engineering, ADGIPS (GGSIPU)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 bg-zinc-900/70 border border-zinc-800 rounded-lg">
              <div className="text-[10px] font-sans text-zinc-400 uppercase tracking-wider font-semibold">
                Project Supervisor
              </div>
              <div className="text-sm font-bold text-white mt-0.5 font-sans">
                Prof. (Dr.) Pinky Nayak
              </div>
              <div className="text-xs text-zinc-400 font-sans">
                Department of Computer Science & Engineering, ADGIPS
              </div>
            </div>

            <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <div className="text-[10px] font-sans text-zinc-400 uppercase tracking-wider mb-2 flex items-center font-semibold">
                <Award className="h-3 w-3 mr-1.5 text-zinc-400" />
                Submitted By (Team Members)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-md">
                  <div className="font-semibold text-white font-sans">Nitesh Agarwal</div>
                  <div className="text-zinc-400 font-mono text-[11px] mt-0.5">14715602724</div>
                  <div className="text-zinc-400 font-mono text-[10px]">CSE - T3</div>
                </div>
                <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-md">
                  <div className="font-semibold text-white font-sans">Himanshu Pathak</div>
                  <div className="text-zinc-400 font-mono text-[11px] mt-0.5">14815602724</div>
                  <div className="text-zinc-400 font-mono text-[10px]">CSE - T3</div>
                </div>
                <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-md">
                  <div className="font-semibold text-white font-sans">Shivag Shukla</div>
                  <div className="text-zinc-400 font-mono text-[11px] mt-0.5">14915602724</div>
                  <div className="text-zinc-400 font-mono text-[10px]">CSE - T3</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-lg">
              <div className="flex items-center gap-1.5 text-zinc-200 font-semibold mb-1 font-sans">
                <Terminal className="h-3.5 w-3.5 text-zinc-400" />
                Integrated Algorithms
              </div>
              <ul className="space-y-1 text-zinc-400 text-[11px] font-sans">
                <li><strong className="text-zinc-200">Singly Linked List:</strong> Dynamic node-based memory allocation</li>
                <li><strong className="text-zinc-200">Merge Sort O(n log n):</strong> Stable divide-and-conquer ranking</li>
                <li><strong className="text-zinc-200">Binary Search O(log n):</strong> Logarithmic roll search and step bounds</li>
                <li><strong className="text-zinc-200">Distribution Analytics:</strong> Batch performance and top scorers</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
