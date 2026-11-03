import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Users, BarChart2, Database, BookOpen } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Student Records", href: "/students", icon: Users },
  { name: "Performance & Reports", href: "/reports", icon: BarChart2 },
  { name: "Database Manager", href: "/database", icon: Database },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col shrink-0">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-zinc-950 border-r border-zinc-800/80 text-zinc-100">
        <div className="flex items-center px-5 mb-5 pb-4 border-b border-zinc-800/80">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 bg-zinc-900 border border-zinc-700 text-white font-mono font-bold flex items-center justify-center text-xs rounded-lg shadow-sm">
              DAA
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight leading-tight font-sans">
                Record Manager
              </h1>
              <span className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase block mt-0.5">
                CIC-311 Project
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 mt-1 space-y-1 px-3">
          <div className="text-[10px] font-sans font-semibold text-zinc-500 uppercase tracking-widest px-3 mb-2">
            Navigation
          </div>
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <div key={item.name}>
                <Link href={item.href}>
                  <div
                    className={cn(
                      "flex items-center px-3 py-2.5 text-xs font-medium cursor-pointer transition-all duration-150 rounded-md font-sans",
                      isActive
                        ? "bg-white text-zinc-950 font-semibold shadow-sm"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/80",
                    )}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </div>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Footer Info Box */}
        <div className="p-3.5 mx-3 mt-auto bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 rounded-lg">
          <div className="flex items-center space-x-1.5 font-semibold text-zinc-200 text-[11px] mb-1 font-sans">
            <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
            <span>ADGIPS (GGSIPU)</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
            Batch 2024–28 • CSE–T3
            <br />
            Supervisor: Dr. Pinky Nayak
          </p>
        </div>
      </div>
    </aside>
  );
}
