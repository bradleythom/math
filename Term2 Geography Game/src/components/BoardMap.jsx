import React from 'react';
import { MapPin, Flag, Compass, HelpCircle } from 'lucide-react';
import questionsData from '../../data/questions.json';

export const BOARD_SPACES = [
  { id: 1,  name: "Cape Reinga",        icon: "🌅" },
  { id: 2,  name: "Bay of Islands",     icon: "⛵" },
  { id: 3,  name: "Auckland",           icon: "🏙️" },
  { id: 4,  name: "Coromandel",         icon: "🏖️" },
  { id: 5,  name: "Rotorua",            icon: "🌋" },
  { id: 6,  name: "Lake Taupō",         icon: "🌊" },
  { id: 7,  name: "Tongariro",          icon: "🏔️" },
  { id: 8,  name: "Napier",             icon: "🍇" },
  { id: 9,  name: "Wellington",         icon: "💨" },
  { id: 10, name: "Marlborough Sounds", icon: "🛳️" },
  { id: 11, name: "Abel Tasman",        icon: "🏖️" },
  { id: 12, name: "Hokitika",           icon: "🟢" },
  { id: 13, name: "Franz Josef",        icon: "❄️" },
  { id: 14, name: "Lake Wānaka",        icon: "🌳" },
  { id: 15, name: "Queenstown",         icon: "🏂" },
  { id: 16, name: "Milford Sound",      icon: "🏞️" },
  { id: 17, name: "Dunedin",            icon: "🐧" },
  { id: 18, name: "The Catlins",        icon: "🌊" },
  { id: 19, name: "Stewart Island",     icon: "🌌" },
  { id: 20, name: "Bluff",              icon: "⚓" }
];

export default function BoardMap({ players, currentPlayerIndex }) {
  // ── Snake path: bottom-to-top ──────────────────────
  const getWindingOrder = () => {
    const columns = 5;
    const totalRows = 4;
    const grid = [];

    // Build rows in REVERSE so row 0 (spaces 1-5) appears at the bottom
    for (let r = totalRows - 1; r >= 0; r--) {
      const rowStartIndex = r * columns;
      const rowItems = BOARD_SPACES.slice(rowStartIndex, rowStartIndex + columns);

      // Even original-row-index → left-to-right, odd → right-to-left
      if (r % 2 === 1) {
        rowItems.reverse();
      }
      grid.push(...rowItems);
    }
    return grid;
  };

  const windingSpaces = getWindingOrder();

  // Retrieve the topic for a tile from the questions dataset
  const getTopicForTile = (tileId) => {
    const q = questionsData.find(q => q.tileId === tileId);
    return q ? q.topic : "Revision";
  };

  return (
    <div className="w-full">
      {/* Board Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-emerald-400 animate-spin-slow" />
          <h2 className="text-xl font-bold text-white tracking-wide">The Kiwi Trail (Exam Mode)</h2>
        </div>
        <div className="flex gap-4 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1">Every step is a challenge!</span>
        </div>
      </div>

      {/* Direction indicator */}
      <div className="flex items-center justify-center gap-2 mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <span>Bluff (Finish) ↑ Top</span>
        <span className="mx-2 w-16 h-px bg-slate-800"></span>
        <span>Bottom ↓ Cape Reinga (Start)</span>
      </div>

      {/* Main Board Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {windingSpaces.map((space) => {
          const playersHere = players.filter(p => p.position === space.id);
          const topic = getTopicForTile(space.id);

          return (
            <div
              key={space.id}
              className={`landmark-trigger relative flex flex-col justify-between p-3.5 rounded-xl border glass-panel transition-all duration-300 min-h-[120px] select-none bg-slate-800/20 border-slate-700`}
            >
              {/* Space Number & Icon */}
              <div className="flex justify-between items-start">
                <span className="text-2xl font-black opacity-40">{space.id}</span>
                <span className="text-xl filter drop-shadow-md">{space.icon}</span>
              </div>

              {/* Name & Topic Badge */}
              <div className="mt-1.5 flex-grow">
                <h3 className="text-[13px] font-bold text-white leading-tight truncate">{space.name}</h3>
                <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider mt-1 bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {topic}
                </span>
              </div>

              {/* Start / Finish flags */}
              {space.id === 1 && (
                <div className="absolute -bottom-2 -left-2 bg-emerald-600 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-lg flex items-center gap-1 z-10">
                  <Flag className="w-2.5 h-2.5" /> Start
                </div>
              )}
              {space.id === 20 && (
                <div className="absolute -top-2 -right-2 bg-rose-600 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-lg flex items-center gap-1 animate-pulse z-10">
                  <Flag className="w-2.5 h-2.5" /> Finish
                </div>
              )}

              {/* Challenge indicator for all tiles */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-violet-600/90 text-white text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full shadow flex items-center gap-0.5 z-10">
                <HelpCircle className="w-2 h-2" /> Card
              </div>

              {/* Player Tokens */}
              <div className="mt-2.5 flex flex-wrap gap-1.5 min-h-[22px]">
                {playersHere.map((player) => {
                  const isActive = players[currentPlayerIndex]?.id === player.id;
                  return (
                    <div
                      key={player.id}
                      className={`relative w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg border transition-transform duration-300 ${player.colorClass} ${
                        isActive ? 'scale-110 ring-2 ring-white ring-offset-1 ring-offset-slate-900 animate-bounce' : ''
                      }`}
                      title={`${player.name} (GKP: ${player.gkp})`}
                    >
                      {player.name[0].toUpperCase()}
                      {isActive && (
                         <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-green-400 border border-white animate-ping"></span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
