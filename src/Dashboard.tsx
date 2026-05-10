import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Upload, Loader2 } from 'lucide-react';
import { useTours } from './hooks/useTours';

export default function Dashboard() {
  const navigate = useNavigate();
  const { tours, loading, addTour, fetchTours } = useTours();
  
  const [splatUrl, setSplatUrl] = useState('');
  const [splatName, setSplatName] = useState('');
  const [splatDescription, setSplatDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!splatUrl || !splatName) return;
    
    setIsSubmitting(true);
    const { error } = await addTour({
      name: splatName,
      description: splatDescription || 'Custom imported tour.',
      url: splatUrl,
    });
    
    setIsSubmitting(false);
    if (!error) {
      setSplatUrl('');
      setSplatName('');
      setSplatDescription('');
      fetchTours();
    }
  };

  // We keep mock ones if `tours` is empty or just always show tours from DB.
  const displayTours = tours.length > 0 ? tours : [
    {
      id: 'mock-1',
      name: 'Nike Shoe',
      description: 'High-fidelity product scan.',
      url: 'https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/nike/nike.splat'
    },
    {
      id: 'mock-2',
      name: 'Plushie',
      description: 'Small object capture demo.',
      url: 'https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/plushie/plushie.splat'
    }
  ];

  return (
    <div className="flex-1 w-full flex flex-col overflow-y-auto">
      <div className="max-w-[1200px] w-full mx-auto pb-12">
        <div className="mb-8 p-12 lg:p-16 border-4 border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 text-zinc-50 text-center relative overflow-hidden shadow-[8px_8px_0_0_#18181b]">
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl accent-text mb-6">
              Your <span className="inline-block bg-yellow-400 text-zinc-950 px-5 pt-3 pb-2 -rotate-2 border-4 border-zinc-950 shadow-[6px_6px_0_0_#18181b]">Spaces</span>
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl font-bold uppercase max-w-2xl mx-auto tracking-wider">
              Manage your high-fidelity Gaussian Splatting tours
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_350px] gap-8">
          {/* Recent Splats */}
          <div className="neo-brutal flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between p-8 pb-6 border-b-4 border-zinc-800 bg-zinc-950">
              <h3 className="accent-text text-2xl text-zinc-50 flex items-center gap-3 m-0">
                <Box className="stroke-[3]" />
                Demo Projects
              </h3>
            </div>
            
            <div className="flex-1 flex flex-col p-8 pt-6 gap-6">
              {loading ? (
                 <div className="flex justify-center py-12 w-full text-zinc-50">
                   <Loader2 className="animate-spin w-8 h-8 text-yellow-400" />
                 </div>
              ) : (
                displayTours.map((splat) => (
                  <div key={splat.id} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-6 bg-zinc-900 border-4 border-zinc-800 hover:border-zinc-500 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/viewer/${encodeURIComponent(splat.url)}`)}>
                    <div className="mb-6 sm:mb-0">
                      <span className="stat-label text-yellow-400">Asset Loaded</span>
                      <h4 className="text-zinc-50 font-black text-2xl uppercase tracking-tight mt-2">{splat.name}</h4>
                      <p className="text-zinc-400 text-sm font-bold uppercase mt-2 tracking-wider">{splat.description}</p>
                    </div>
                    <button className="brutal-btn self-stretch sm:self-auto py-3">
                      View Tour
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Import New Splat */}
          <div className="flex flex-col gap-8">
            <div className="neo-brutal flex flex-col">
              <div className="flex items-center justify-between p-8 pb-6 border-b-4 border-zinc-800 bg-zinc-950">
                <h3 className="accent-text text-xl text-zinc-50 flex items-center gap-3 m-0">
                  <Upload size={20} />
                  Load External
                </h3>
              </div>
              
              <form onSubmit={handleCustomSubmit} className="flex flex-col p-8 pt-6 space-y-6 bg-zinc-900 border-b-4 border-zinc-800">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="stat-label text-zinc-400">
                      Project Name
                    </label>
                    <input 
                      type="text" 
                      value={splatName}
                      onChange={(e) => setSplatName(e.target.value)}
                      placeholder="E.g. Modern Villa"
                      required
                      className="brutal-input bg-zinc-950"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="stat-label text-zinc-400">
                      Description
                    </label>
                    <input 
                      type="text" 
                      value={splatDescription}
                      onChange={(e) => setSplatDescription(e.target.value)}
                      placeholder="Short description..."
                      className="brutal-input bg-zinc-950"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="stat-label text-zinc-400">
                      Splat File URL
                    </label>
                    <input 
                      type="url" 
                      value={splatUrl}
                      onChange={(e) => setSplatUrl(e.target.value)}
                      placeholder="https://example.com/model.splat"
                      required
                      className="brutal-input bg-zinc-950"
                    />
                    <p className="stat-label text-zinc-500 pt-2 float-right hover:text-zinc-400 transition-colors">
                      Must be CORS enabled
                    </p>
                  </div>
                </div>
                
                <button type="submit" disabled={isSubmitting} className="brutal-btn w-full flex items-center justify-center gap-3 disabled:opacity-50 mt-4">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5 text-zinc-950" />
                      LOADING...
                    </>
                  ) : 'ADD PROJECT'}
                </button>
              </form>
            </div>
            
            <div className="neo-brutal p-8 text-center bg-zinc-900">
              <span className="accent-text text-xl block mb-3 text-zinc-400">TOTAL REVENUE</span>
              <span className="text-5xl font-black block text-yellow-400">$1.2K</span>
              <div className="stat-label mt-4 border-t-2 border-zinc-800 pt-4 text-zinc-500">Monthly Recurring</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
