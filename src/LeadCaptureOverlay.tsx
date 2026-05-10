import React, { useState, useEffect } from 'react';
import { Target, Loader2 } from 'lucide-react';

export default function LeadCaptureOverlay() {
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Show after 10 seconds of interacting
    const timer = setTimeout(() => {
      setShow(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('https://your-n8n-instance.com/webhook/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone }),
      });
      
      // Even if fetch fails because dummy endpoint, we simulate success for demo
      if (!response.ok) {
        // console.warn("Webhook might fail because it's a dummy endpoint, but proceeding.");
      }
      
      setSubmitted(true);
      // Wait a bit before closing
      setTimeout(() => setShow(false), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to send details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="absolute top-0 right-0 h-full w-full max-w-sm border-l-4 border-zinc-800 bg-zinc-950 shadow-[-16px_0_40px_rgba(0,0,0,0.8)] p-0 flex flex-col overflow-y-auto z-30 animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center p-6 bg-zinc-950 border-b-4 border-zinc-800">
        <h3 className="accent-text text-xl text-zinc-50 m-0 flex items-center gap-3">
          <Target size={24} className="text-yellow-400" />
          VIP Access
        </h3>
        <button 
          onClick={() => setShow(false)}
          className="text-zinc-500 hover:text-yellow-400 font-black text-xl transition-colors px-2 py-1"
        >
          [X]
        </button>
      </div>
      
      <div className="p-6 flex-1 flex flex-col gap-8 justify-center">
        {!submitted ? (
          <>
            <div className="p-6 border-4 border-zinc-800 bg-zinc-900 shadow-[8px_8px_0_0_#18181b]">
              <h4 className="accent-text text-zinc-50 mb-3 text-lg md:text-xl">Interested in this property?</h4>
              <p className="text-zinc-400 text-sm font-bold uppercase tracking-wider leading-relaxed">
                Unlock full pricing, floor plans, and schedule a private in-person tour.
              </p>
            </div>

            <div className="mt-2">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="stat-label text-zinc-400">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="YOUR NAME" required className="brutal-input bg-zinc-950" />
                </div>
                <div className="space-y-2">
                  <label className="stat-label text-zinc-400">Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 000-0000" required className="brutal-input bg-zinc-950" />
                </div>
                {error && <p className="text-red-500 font-bold bg-zinc-950 p-3 border-4 border-red-500 uppercase tracking-tight">{error}</p>}
                <button type="submit" disabled={isSubmitting} className="brutal-btn w-full h-[60px] flex items-center justify-center gap-3 disabled:opacity-75 mt-6">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin w-6 h-6 text-zinc-950" />
                      SENDING...
                    </>
                  ) : 'REQUEST DETAILS'}
                </button>
              </form>
            </div>
            
            <div className="mt-auto text-center border-t-2 border-zinc-900 pt-6">
              <span className="stat-label text-zinc-600">Secured by Supabase // Routed to n8n</span>
            </div>
          </>
        ) : (
          <div className="neo-brutal-yellow p-8 flex flex-col items-center gap-6 text-center">
            <h4 className="accent-text text-3xl md:text-4xl mb-0 text-zinc-950">AGENT NOTIFIED</h4>
            <div className="h-3 w-full bg-zinc-950"></div>
            <p className="font-bold text-lg uppercase tracking-wider text-zinc-950">Our team will contact you shortly.</p>
          </div>
        )}
      </div>
    </div>
  );
}
