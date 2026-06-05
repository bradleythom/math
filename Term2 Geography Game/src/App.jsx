import React, { useState } from 'react';
import GameScreen from './components/GameScreen';
import { Compass, User, MapPin, Play, Sparkles, BookOpen, GraduationCap } from 'lucide-react';

const COLOR_PRESETS = [
  { id: "teal",   name: "Takahē Teal",    class: "bg-gradient-to-br from-cyan-500 to-teal-600 border-cyan-400" },
  { id: "gold",   name: "Kōwhai Gold",     class: "bg-gradient-to-br from-amber-500 to-yellow-500 border-amber-400" },
  { id: "orange", name: "Wētā Volcanic",   class: "bg-gradient-to-br from-orange-500 to-rose-600 border-orange-400" },
  { id: "green",  name: "Pounamu Green",   class: "bg-gradient-to-br from-emerald-600 to-teal-800 border-emerald-500" }
];

export default function App() {
  const [gameState, setGameState] = useState("lobby"); // "lobby" | "game"
  const [playerName, setPlayerName] = useState("");
  const [playerColor, setPlayerColor] = useState(COLOR_PRESETS[0]);

  const handleStartGame = () => {
    const name = playerName.trim() === "" ? "Explorer" : playerName.trim();
    setPlayerName(name);
    setGameState("game");
  };

  const handleResetGame = () => {
    setGameState("lobby");
  };

  const player = {
    id: 1,
    name: playerName.trim() === "" ? "Explorer" : playerName.trim(),
    colorClass: playerColor.class,
    colorId: playerColor.id
  };

  return (
    <div className="min-h-screen text-slate-100 relative">
      {/* Background Ambience */}
      <div className="kiwi-ambient-bg">
        <div className="kiwi-ambient-glow-1"></div>
        <div className="kiwi-ambient-glow-2"></div>
      </div>

      {gameState === "lobby" ? (
        <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-10 items-center justify-center min-h-screen">

          {/* Landing Header */}
          <div className="text-center flex flex-col items-center gap-3 max-w-2xl">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-4 rounded-3xl shadow-xl shadow-emerald-500/20 mb-2 animate-bounce-slow">
              <Compass className="w-12 h-12 text-slate-950" />
            </div>

            <span className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Solo Revision Tool
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
              The Great <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Kiwi Drift</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mt-2">
              Test your New Zealand geography knowledge on a solo trek from Cape Reinga to Bluff.
              Answer curriculum questions, build your GKP score, and see how much you know!
            </p>
          </div>

          {/* Setup + Rules Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">

            {/* Left: Player Setup (3 cols) */}
            <div className="md:col-span-3 flex flex-col gap-6 p-6 rounded-3xl glass-panel border-slate-800/80">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-800/80">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Your Profile</h2>
              </div>

              {/* Name Input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Display Name</label>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md shrink-0 ${playerColor.class}`}>
                    {(playerName || "E")[0].toUpperCase()}
                  </div>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value.slice(0, 16))}
                    placeholder="Enter your name…"
                    className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Colour Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Token Colour</label>
                <div className="flex items-center gap-3">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setPlayerColor(preset)}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${preset.class} ${
                        playerColor.id === preset.id
                          ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-950'
                          : 'opacity-55 hover:opacity-100'
                      }`}
                      title={preset.name}
                    />
                  ))}
                  <span className="text-xs text-slate-500 font-semibold ml-1">{playerColor.name}</span>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartGame}
                className="w-full mt-2 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:scale-[1.01] active:scale-95"
              >
                Begin Revision <Play className="w-4.5 h-4.5 fill-current" />
              </button>
            </div>

            {/* Right: Rules (2 cols) */}
            <div className="md:col-span-2 flex flex-col gap-6 p-6 rounded-3xl glass-panel border-slate-800/80 justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2 pb-4 border-b border-slate-800/80 mb-4">
                  <BookOpen className="w-5 h-5 text-cyan-400" /> How It Works
                </h2>

                <div className="flex flex-col gap-4 text-xs text-slate-300">
                  <div className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
                    <p className="leading-relaxed">
                      <strong>Roll the Die</strong> (1–4) to move along the 20-tile New Zealand trail.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
                    <p className="leading-relaxed">
                      <strong>Odd-numbered tiles</strong> trigger a curriculum quiz card. Even tiles are rest stops.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold shrink-0 mt-0.5">3</span>
                    <p className="leading-relaxed">
                      Correct answers earn <strong>Geographic Knowledge Points (GKP)</strong>. Wrong answers reveal the correct answer for revision.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold shrink-0 mt-0.5">4</span>
                    <p className="leading-relaxed">
                      Reach <strong>Bluff (Space 20)</strong> to finish. Your final GKP score measures your revision progress!
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/10 border border-cyan-500/20 text-[11px] text-cyan-200/90 leading-relaxed flex items-center gap-3">
                <MapPin className="w-6 h-6 text-cyan-400 shrink-0" />
                <span>Three question categories: <strong>Migration</strong>, <strong>Tectonic Processes</strong>, and <strong>True / False</strong> quick-fire facts.</span>
              </div>
            </div>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            SpencerStudy Geography Series © 2026
          </span>
        </div>
      ) : (
        <GameScreen player={player} onReset={handleResetGame} />
      )}
    </div>
  );
}
