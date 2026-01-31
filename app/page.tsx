import { Sidebar } from "@/components/Sidebar";
import { WorkspaceManager } from "@/components/WorkspaceManager";
import { ControlPanel } from "@/components/ControlPanel";

export default function Home() {
  return (
    <main className="flex h-screen w-full bg-zinc-950 text-white font-sans selection:bg-cyan-500/30 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col relative w-full h-full">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Header / Top Bar */}
        <div className="h-10 border-b border-zinc-800 flex items-center px-6 justify-between bg-zinc-950/90 backdrop-blur-sm z-40 shrink-0">
          <h1 className="text-sm font-mono text-zinc-500 tracking-tight">
            <span className="text-cyan-500 font-bold">SYSTEM.STATUS</span> :: MONITORING_ACTIVE
          </h1>
        </div>

        {/* Workspace Area */}
        <WorkspaceManager />

        {/* Floating Control Panel */}
        <ControlPanel />
      </div>
    </main>
  );
}
