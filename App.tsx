
import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Search, 
  Sparkles, 
  BrainCircuit, 
  Waves, 
  Info, 
  ChevronRight, 
  Activity, 
  Rocket, 
  Atom, 
  Circle, 
  Triangle, 
  Square, 
  Orbit 
} from 'lucide-react';
import { fetchPhysicsSimulation } from './services/geminiService';
import { PhysicsData } from './types';
import MotionCanvas from './components/MotionCanvas';
import GraphCanvas from './components/GraphCanvas';

const BackgroundDecor = () => {
  const icons = [
    { Icon: Rocket, size: 48, top: '10%', left: '5%', delay: '0s' },
    { Icon: Atom, size: 64, top: '20%', left: '85%', delay: '2s' },
    { Icon: Orbit, size: 120, top: '60%', left: '10%', delay: '4s' },
    { Icon: Circle, size: 24, top: '40%', left: '80%', delay: '1s' },
    { Icon: Triangle, size: 32, top: '75%', left: '90%', delay: '3s' },
    { Icon: Square, size: 20, top: '15%', left: '45%', delay: '5s' },
    { Icon: Rocket, size: 32, top: '85%', left: '30%', delay: '7s' },
    { Icon: Orbit, size: 40, top: '5%', left: '70%', delay: '6s' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-10">
      {icons.map((item, idx) => (
        <div 
          key={idx}
          className="absolute drifting"
          style={{ 
            top: item.top, 
            left: item.left, 
            animationDelay: item.delay,
            color: idx % 2 === 0 ? '#547792' : '#94B4C1'
          }}
        >
          <item.Icon size={item.size} strokeWidth={1} />
        </div>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PhysicsData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);
    setIsPlaying(false);

    try {
      const result = await fetchPhysicsSimulation(query);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while simulating. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetSimulation = () => {
    setIsPlaying(false);
    const oldData = data;
    setData(null);
    setTimeout(() => setData(oldData), 10);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#213448] relative">
      <BackgroundDecor />
      
      {/* Header */}
      <header className="border-b border-[#547792] py-4 px-6 bg-[#213448] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#94B4C1] rounded-lg flex items-center justify-center shadow-lg shadow-[#54779244]">
              <BrainCircuit className="text-[#213448] w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#EAE0CF]">SeeTheForce</h1>
              <p className="text-xs text-[#94B4C1] font-medium uppercase tracking-widest">From Equation to Motion</p>
            </div>
          </div>
          
          <div className="hidden md:flex gap-6 text-sm font-medium text-[#94B4C1]">
            <a href="#" className="hover:text-[#EAE0CF] transition-colors">Library</a>
            <a href="#" className="hover:text-[#EAE0CF] transition-colors">Concepts</a>
            <a href="#" className="hover:text-[#EAE0CF] transition-colors">Documentation</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-grow flex flex-col max-w-7xl mx-auto w-full px-4 z-10 ${!data ? 'justify-center' : 'py-8'}`}>
        {/* Hero / Input Section */}
        <section className={`text-center max-w-3xl mx-auto w-full transition-all duration-500 ${!data ? 'mb-0' : 'mb-12'}`}>
          {!data && !loading && (
            <div className="max-w-xs mx-auto mb-8 floating text-[#547792]">
               <Waves className="w-20 h-20 mx-auto" strokeWidth={1} />
            </div>
          )}
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#EAE0CF] leading-tight">
            Visualize Physics <span className="text-[#94B4C1]">Clearly</span>.
          </h2>
          <p className="text-lg text-[#94B4C1] mb-8">
            Ask any classical physics question. Our AI tutor builds a clean, 
            educational animation to help you master the fundamentals.
          </p>

          <form onSubmit={handleSubmit} className="relative group">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. A ball is dropped from 50m. When does it hit the ground?"
              className="w-full bg-[#54779222] border-2 border-[#54779244] focus:border-[#94B4C1] rounded-2xl py-5 px-6 pr-16 text-[#EAE0CF] placeholder-[#547792] outline-none transition-all shadow-xl"
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-3 top-3 bottom-3 aspect-square bg-[#94B4C1] hover:bg-[#EAE0CF] disabled:bg-[#547792] text-[#213448] rounded-xl flex items-center justify-center transition-all shadow-md active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#213448] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </form>
          
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {['Projectile motion', 'Braking car', 'Free fall', 'Inclined plane'].map(chip => (
              <button 
                key={chip} 
                onClick={() => setQuery(`Simulate a ${chip.toLowerCase()}`)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#54779233] border border-[#54779244] text-[#94B4C1] hover:text-[#EAE0CF] hover:border-[#94B4C1] transition-all"
              >
                {chip}
              </button>
            ))}
          </div>
        </section>

        {error && (
          <div className="mb-8 p-4 bg-[#94B4C111] border border-[#94B4C144] rounded-xl text-[#EAE0CF] text-sm flex items-center gap-3">
             <Info className="w-5 h-5 flex-shrink-0 text-[#94B4C1]" />
             {error}
          </div>
        )}

        {/* Results Area */}
        {data && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Simulation Header */}
            <div className="bg-[#54779222] border border-[#54779244] p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#94B4C1]" />
                  <h3 className="text-[#EAE0CF] font-bold text-xl">{data.concept}</h3>
                </div>
                <p className="text-[#94B4C1] text-sm">Category: <span className="capitalize">{data.category.replace('_', ' ')}</span></p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-2 bg-[#94B4C1] hover:bg-[#EAE0CF] text-[#213448] px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
                >
                  {isPlaying ? <Waves className="w-5 h-5 animate-pulse" /> : <Play className="w-5 h-5 fill-current" />}
                  {isPlaying ? 'Simulating...' : 'Run Animation'}
                </button>
                <button 
                  onClick={resetSimulation}
                  className="p-3 bg-[#54779233] hover:bg-[#54779266] text-[#EAE0CF] rounded-xl border border-[#54779244] transition-all"
                  title="Reset Simulation"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Visualizers Grid */}
            <div className={`grid gap-6 ${data.visualization_mode === 'space_and_graph' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
              {(data.visualization_mode === 'space_motion' || data.visualization_mode === 'space_and_graph') && data.space_motion && (
                <MotionCanvas 
                  data={data.space_motion} 
                  isPlaying={isPlaying} 
                  onComplete={() => setIsPlaying(false)}
                />
              )}
              {(data.visualization_mode === 'graph_only' || data.visualization_mode === 'space_and_graph') && data.graph && (
                <GraphCanvas data={data.graph} />
              )}
            </div>

            {/* Explanation Section */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-[#54779211] p-6 rounded-2xl border border-[#54779233]">
                  <h4 className="text-[#94B4C1] font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" /> Final Solution
                  </h4>
                  <div className="text-2xl font-bold text-[#EAE0CF] mb-4 mono">
                    {data.final_answer}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[#94B4C1] text-sm font-semibold">Underlying Assumptions:</p>
                    <ul className="list-disc list-inside text-[#EAE0CF] text-sm space-y-1 opacity-80">
                      {data.assumptions.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="bg-[#54779211] p-6 rounded-2xl border border-[#54779233]">
                  <h4 className="text-[#94B4C1] font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Educational Insight
                  </h4>
                  <p className="text-[#EAE0CF] leading-relaxed italic">
                    {data.teaching_note}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-[#213448] p-5 rounded-2xl border border-[#54779244] shadow-sm">
                   <h5 className="text-[#EAE0CF] font-bold text-sm mb-3">Why Dual-View?</h5>
                   <p className="text-xs text-[#94B4C1] leading-relaxed">
                     By observing space motion alongside its velocity/position graph, you build a mental link between physical events and their mathematical representation.
                   </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#547792] py-8 px-6 bg-[#213448] z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[#547792] text-xs uppercase tracking-widest font-bold">
          <div>© Made using Gemini 3</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-[#94B4C1] transition-colors">Safety</a>
            <a href="#" className="hover:text-[#94B4C1] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#94B4C1] transition-colors">API</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
