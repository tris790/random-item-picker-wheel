import { RandomPicker } from "@/components/random-picker/RandomPicker";
import "./index.css";

export function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/50 via-background to-background">
      <div className="container mx-auto p-4 sm:p-8 relative z-10">
        <header className="mb-8 text-center space-y-4">
          <h1 className="text-4xl font-black text-white tracking-tight sm:text-6xl mb-2 drop-shadow-2xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Spin</span>
            <span className="text-slate-200 mx-2">The</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Wheel</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg">Just one more spin</p>
        </header>

        <RandomPicker />
      </div>
    </div>
  );
}

export default App;
