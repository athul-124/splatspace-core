import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Splat, Environment } from '@react-three/drei';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import LeadCaptureOverlay from './LeadCaptureOverlay';

function Scene({ splatUrl }: { splatUrl: string }) {
  return (
    <>
      <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} maxDistance={10} minDistance={0.5} />
      <Environment preset="city" />
      <Splat src={splatUrl} position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1} />
    </>
  );
}

export default function SplatViewer() {
  const { splatId } = useParams();
  const navigate = useNavigate();
  // Using a fallback sample remote splat if none is provided via URL decoding
  const decodedUrl = splatId ? decodeURIComponent(splatId) : 'https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/nike/nike.splat';

  return (
    <div className="flex-1 flex w-full relative border-4 border-zinc-800 bg-zinc-950 overflow-hidden shadow-[8px_8px_0_0_#18181b]">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,_#fff,_transparent)] pointer-events-none z-10" />
      
      {/* 3D Canvas */}
      <Suspense
        fallback={
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-20 text-yellow-400">
            <Loader2 size={64} className="animate-spin mb-6" />
            <h2 className="accent-text text-3xl md:text-4xl">Loading Space...</h2>
            <div className="w-64 h-3 bg-zinc-900 border-2 border-zinc-800 mt-6">
               <div className="h-full bg-yellow-400 animate-pulse w-full"></div>
            </div>
            <p className="stat-label mt-4 text-zinc-500 tracking-wider">
              LOADING GAUSSIAN SPLAT MODEL
            </p>
          </div>
        }
      >
        <Canvas camera={{ position: [2, 1.5, 3] }} frameloop="demand" className="z-0">
          <Scene splatUrl={decodedUrl} />
        </Canvas>
      </Suspense>

      {/* Viewer UI Overlay */}
      <div className="absolute top-6 left-6 z-20 flex gap-4">
        <button 
          onClick={() => navigate('/')}
          className="brutal-btn p-3"
          title="Back to Dashboard"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="neo-brutal px-6 py-2 flex flex-col justify-center">
            <span className="stat-label text-zinc-400">Status</span>
            <span className="font-bold uppercase tracking-widest text-zinc-50">Live Viewer</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
        <div className="neo-brutal p-4 px-5 text-xs font-bold leading-relaxed uppercase tracking-widest text-zinc-400">
           CAMERA_MODE: ORBIT_FOLLOW<br/>
           FOV: 75&deg;<br/>
           EXPOSURE: 1.2
        </div>
      </div>

      {/* Automatic Lead Gen Modal via Timeout */}
      <LeadCaptureOverlay />
    </div>
  );
}
