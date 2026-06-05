import React, { useState } from 'react';
import GameScreen from './components/GameScreen';
import { Compass, Users, MapPin, Play, HelpCircle, Award, Sparkles, BookOpen } from 'lucide-react';

const COLOR_PRESETS = [
  { id: "teal", name: "Takahē Teal", class: "bg-gradient-to-br from-cyan-500 to-teal-600 border-cyan-400" },
  { id: "gold", name: "Kōwhai Gold", class: "bg-gradient-to-br from-amber-500 to-yellow-500 border-amber-400" },
  { id: "orange", name: "Wētā Volcanic", class: "bg-gradient-to-br from-orange-500 to-rose-600 border-orange-400" },
  { id: "green", name: "Pounamu Green", class: "bg-gradient-to-br from-emerald-600 to-teal-800 border-emerald-500" }
];

export default function App() {
  const [gameState, setGameState] = useState("lobby"); // "lobby" | "game"
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState([
    { id: 1, name: "Kiwi Jack", colorClass: COLOR_PRESETS[0].class, colorId: "teal" },
    { id: 2, name: "Fern Sarah", colorClass: COLOR_PRESETS[1].class, colorId: "gold" },
    { id: 3, name: "Kea David", colorClass: COLOR_PRESETS[2].class, colorId: "orange" },
    { id: 4, name: "Tuatara Emma", colorClass: COLOR_PRESETS[3].class, colorId: "green" }
  ]);

  const handlePlayerCountChange = (count) => {
    setPlayerCount(count);
    // Adjust players state size keeping existing if possible
    setPlayers(prev => {
      const current = [...prev];
      if (current.length < count) {
        // Add more
        for (let i = current.length; i < count; i++) {
          const defaultNames = ["Kiwi Jack", "Fern Sarah", "Kea David", "Tuatara Emma"];
          current.push({
            id: i + 1,
            name: defaultNames[i] || `Explorer ${i + 1}`,
            colorClass: COLOR_PRESETS[i % COLOR_PRESETS.length].class,
            colorId: COLOR_PRESETS[i % COLOR_PRESETS.length].id
          });
        }
      } else if (current.length > count) {
        // Truncate
        return current.slice(0, count);
      }
      return current;
    });
  };

  const handlePlayerNameChange = (id, newName) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, name: newName.slice(0, 16) } : p));
  };

  const handlePlayerColorChange = (id, colorId) => {
    const preset = COLOR_PRESETS.find(c => c.id === colorId);
    if (!preset) return;
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, colorId, colorClass: preset.class } : p));
  };

  const handleStartGame = () => {
    // Basic validation
    const validPlayers = players.map(p => ({
      ...p,
      name: p.name.trim() === "" ? `Player ${p.id}` : p.name.trim()
    }));
    setPlayers(validPlayers);
    setGameState("game");
  };

  const handleResetGame = () => {
    setGameState("lobby");
  };

  return (
    <div className="min-h-screen text-slate-100 relative">
      {/* Background Ambience */}
      <div className="kiwi-ambient-bg">
        <div className="kiwi-ambient-glow-1"></div>
        <div className="kiwi-ambient-glow-2"></div>
      </div>

      {gameState === "lobby" ? (
        <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-10 items-center justify-center min-h-screen">
          
          {/* Landing Header */}
          <div className="text-center flex flex-col items-center gap-3 max-w-2xl">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-4 rounded-3xl shadow-xl shadow-emerald-500/20 mb-2 animate-bounce-slow">
              <Compass className="w-12 h-12 text-slate-950" />
            </div>
            
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5" /> Interactive Revision Game
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
              The Great <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Kiwi Drift</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mt-2">
              Embark on a geographical quest down New Zealand from Cape Reinga to Bluff. Answer location-themed questions, accumulate Geographic Knowledge Points (GKP), and drift your way to victory!
            </p>
          </div>

          {/* Lobby Panel Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
            
            {/* Left side: Setup Form (3 cols) */}
            <div className="md:col-span-3 flex flex-col gap-6 p-6 rounded-3xl glass-panel border-slate-800/80">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800/80">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" /> Player Setup
                </h2>
                {/* Player count selector */}
                <div className="flex bg-slate-950/60 p-1 rounded-xl border border-slate-800">
                  {[2, 3, 4].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handlePlayerCountChange(num)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        playerCount === num
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {num} Players
                    </button>
                  ))}
                </div>
              </div>

              {/* Individual Player Inputs */}
              <div className="flex flex-col gap-4">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/35 border border-slate-800/50 hover:border-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {/* Badge / Token representation */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${player.colorClass}`}>
                        {player.name ? player.name[0].toUpperCase() : `P${player.id}`}
                      </div>
                      
                      {/* Name input */}
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) => handlePlayerNameChange(player.id, e.target.value)}
                        placeholder={`Player ${player.id} Name`}
                        className="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-44"
                      />
                    </div>

                    {/* Color Presets */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-slate-500 mr-1">Token:</span>
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handlePlayerColorChange(player.id, preset.id)}
                          className={`w-6 h-6 rounded-full border transition-all ${preset.class} ${
                            player.colorId === preset.id
                              ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-950'
                              : 'opacity-65 hover:opacity-100'
                          }`}
                          title={preset.name}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartGame}
                className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:scale-[1.01] active:scale-95 mt-2"
              >
                Start Journey <Play className="w-4.5 h-4.5 fill-current" />
              </button>
            </div>

            {/* Right side: Instructions Drawer (2 cols) */}
            <div className="md:col-span-2 flex flex-col gap-6 p-6 rounded-3xl glass-panel border-slate-800/80 justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2 pb-4 border-b border-slate-800/80 mb-4">
                  <BookOpen className="w-5 h-5 text-cyan-400" /> Trail Rules
                </h2>

                <div className="flex flex-col gap-4 text-xs text-slate-300">
                  <div className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
                    <p className="leading-relaxed">
                      <strong>Roll the Die:</strong> Players take turns rolling a 6-sided die to drift down the 20-tile New Zealand trail.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
                    <p className="leading-relaxed">
                      <strong>Answer Cards:</strong> Landing on a tile draws a geography quiz card. Correct answers award <strong>Geographic Knowledge Points (GKP)</strong>.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold shrink-0 mt-0.5">3</span>
                    <p className="leading-relaxed">
                      <strong>Landmark Categories:</strong> Questions match the geology/geography of your tile (e.g. Volcanic, Coastal, Alpine, or City).
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold shrink-0 mt-0.5">4</span>
                    <p className="leading-relaxed">
                      <strong>Victory Bonus:</strong> The first to reach space 20 (Bluff) earns a <strong>+300 GKP Speed Bonus</strong>. The player with the highest total GKP wins!
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual Decorative Banner */}
              <div className="p-4 rounded-2xl bg-cyan-950/10 border border-cyan-500/20 text-[11px] text-cyan-200/90 leading-relaxed flex items-center gap-3">
                <MapPin className="w-6 h-6 text-cyan-400 shrink-0" />
                <span>
                  Map starts at Cape Reinga (1), travels through Hobbiton, Rotorua, Wellington, Abel Tasman, Queenstown, and finishes at Bluff (20).
                </span>
              </div>
            </div>

          </div>

          {/* Footer branding */}
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            SpencerStudy Geography Series © 2026
          </span>
        </div>
      ) : (
        <GameScreen initialPlayers={players} onReset={handleResetGame} />
      )}
    </div>
  );
}
