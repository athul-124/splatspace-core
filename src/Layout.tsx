import { Link, Outlet } from 'react-router-dom';
import { Box } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative selection:bg-yellow-400 selection:text-zinc-950">
      {/* Brutalist Header */}
      <header className="p-6 pb-2">
        <div className="neo-brutal p-4 px-6 flex justify-between items-center bg-zinc-950 border-zinc-800 shadow-[8px_8px_0px_#18181b]">
          <Link to="/" className="flex items-center gap-3 group">
            <h1 className="accent-text text-3xl md:text-4xl m-0 text-zinc-50">SplatSpace // Architect</h1>
          </Link>
          <nav className="hidden md:flex gap-6 items-center">
            <div className="flex flex-col text-right mr-4">
              <span className="stat-label text-zinc-400">Project Status</span>
              <span className="font-black text-yellow-400 uppercase tracking-wider">● LIVE_RENDER</span>
            </div>
            <Link to="/" className="text-zinc-50 font-black uppercase hover:text-yellow-400 transition-colors">
              Dashboard
            </Link>
            <a href="#" className="text-zinc-50 font-black uppercase hover:text-yellow-400 transition-colors">
              Settings
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col p-6">
        <Outlet />
      </main>

      {/* Brutalist Footer overlay (optional, absolute positioned bottom left/right) */}
      <footer className="fixed bottom-2 left-6 right-6 z-50 pointer-events-none mix-blend-difference hidden md:flex justify-between items-center text-[10px] font-bold uppercase opacity-50 text-zinc-400">
        <div>Built by Founder_Architect // SplatSpace v0.8.2-alpha</div>
        <div>Memory: 412MB // Shaders: Optimized // RLS: Enabled</div>
      </footer>
    </div>
  );
}
