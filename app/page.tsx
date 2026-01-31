import { MonitorGrid } from "@/components/MonitorGrid";
import { ControlPanel } from "@/components/ControlPanel";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white relative font-sans selection:bg-cyan-500/30">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header / Top Bar */}
      <div className="h-14 border-b border-zinc-800 flex items-center px-6 justify-between bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-40">
        <h1 className="text-sm font-mono text-zinc-500 tracking-tight">
          <span className="text-cyan-500 font-bold">SYSTEM.STATUS</span> :: MONITORING_ACTIVE
        </h1>
        <div className="text-xs text-zinc-600 font-mono">
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="relative z-0">
        <MonitorGrid />
      </div>

      {/* Floating Control Panel */}
      <ControlPanel />
    </main>
  );
}
