import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Application, Entity } from '@playcanvas/react';
import { Camera, GSplat } from '@playcanvas/react/components';
import { OrbitControls } from '@playcanvas/react/scripts';
import { useSplat } from '@playcanvas/react/hooks';
import LeadCaptureOverlay from './LeadCaptureOverlay';

function Scene({ splatUrl, setLoading }: { splatUrl: string; setLoading: (l: boolean) => void }) {
  const { asset, loading, error } = useSplat(splatUrl);

  // Notify parent of loading state
  // We use useEffect or just call it if we are careful, 
  // but better to just use a timeout to avoid strict mode double render warnings or effect issues
  setTimeout(() => setLoading(loading), 0);

  return (
    <>
      <Entity name="Camera" position={[2, 1.5, 3]}>
         <Camera clearColor="#09090b" fov={75} />
         <OrbitControls />
      </Entity>
      
      {asset && (
        <Entity name="GaussianSplat" rotation={[0, 0, 0]} position={[0, 0, 0]} scale={[1, 1, 1]}>
          <GSplat asset={asset} />
        </Entity>
      )}
    </>
  );
}

export default function SplatViewer() {
  const { splatId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // Using a fallback sample remote splat if none is provided via URL decoding
  const decodedUrl = splatId ? decodeURIComponent(splatId) : 'https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/nike/nike.splat';

  return (
    <div className="flex-1 flex w-full relative border-4 border-zinc-800 bg-zinc-950 overflow-hidden shadow-[8px_8px_0_0_#18181b]">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,_#fff,_transparent)] pointer-events-none z-10" />
      
      {/* Loading Overlay */}
      {isLoading && (
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
      )}

      {/* 3D Canvas */}
      <Application className="w-full h-full z-0 absolute inset-0">
        <Scene splatUrl={decodedUrl} setLoading={setIsLoading} />
      </Application>

      {/* Viewer UI Overlay */}
      <div className="absolute top-6 left-6 z-20 flex gap-4">
        <button 
          onClick={() => navigate('/')}
          className="brutal-btn p-3"
          title="Back to Dashboard"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="neo-brutal px-6 py-2 flex flex-col justify-center bg-zinc-900/80 backdrop-blur-sm">
            <span className="stat-label text-zinc-400">Status</span>
            <span className="font-bold uppercase tracking-widest text-zinc-50">Live Viewer</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
        <div className="neo-brutal p-4 px-5 text-xs font-bold leading-relaxed uppercase tracking-widest text-zinc-400 bg-zinc-900/80 backdrop-blur-sm">
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
