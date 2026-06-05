import React from 'react';
import { MapPin, Flag, Compass, HelpCircle, Thermometer, Wind } from 'lucide-react';

// Each space explicitly maps to one of three curriculum categories.
// City → LEES_PUSH_PULL  |  Volcanic & Alpine → TECTONIC_RING_OF_FIRE  |  Coastal → TRUE_OR_FALSE
export const BOARD_SPACES = [
  { id: 1,  name: "Cape Reinga",        type: "coastal",  category: "TRUE_OR_FALSE",         icon: "🌅", region: "Northland" },
  { id: 2,  name: "Bay of Islands",     type: "coastal",  category: "TRUE_OR_FALSE",         icon: "⛵", region: "Northland" },
  { id: 3,  name: "Auckland",           type: "city",     category: "LEES_PUSH_PULL",        icon: "🏙️", region: "Auckland" },
  { id: 4,  name: "Coromandel",         type: "coastal",  category: "TRUE_OR_FALSE",         icon: "🏖️", region: "Waikato" },
  { id: 5,  name: "Rotorua",            type: "volcanic", category: "TECTONIC_RING_OF_FIRE", icon: "🌋", region: "Bay of Plenty" },
  { id: 6,  name: "Lake Taupō",         type: "volcanic", category: "TECTONIC_RING_OF_FIRE", icon: "🌊", region: "Waikato" },
  { id: 7,  name: "Tongariro",          type: "volcanic", category: "TECTONIC_RING_OF_FIRE", icon: "🏔️", region: "Manawatū-Whanganui" },
  {
    id: 8,  name: "Napier",             type: "city",     category: "LEES_PUSH_PULL",        icon: "🍇", region: "Hawke's Bay",
    landmark: {
      title: "Auckland City Sea Breeze Effect",
      detail: "Climate kept stable with a low seasonal temperature range due to close proximity to ocean bodies.",
      themeIcon: "wind"
    }
  },
  { id: 9,  name: "Wellington",         type: "city",     category: "LEES_PUSH_PULL",        icon: "💨", region: "Wellington" },
  { id: 10, name: "Marlborough Sounds", type: "coastal",  category: "TRUE_OR_FALSE",         icon: "🛳️", region: "Marlborough" },
  { id: 11, name: "Abel Tasman",        type: "coastal",  category: "TRUE_OR_FALSE",         icon: "🏖️", region: "Tasman" },
  { id: 12, name: "Hokitika",           type: "coastal",  category: "TRUE_OR_FALSE",         icon: "🟢", region: "West Coast" },
  { id: 13, name: "Franz Josef",        type: "alpine",   category: "TECTONIC_RING_OF_FIRE", icon: "❄️", region: "West Coast" },
  { id: 14, name: "Lake Wānaka",        type: "alpine",   category: "TECTONIC_RING_OF_FIRE", icon: "🌳", region: "Otago" },
  {
    id: 15, name: "Queenstown",         type: "alpine",   category: "TECTONIC_RING_OF_FIRE", icon: "🏂", region: "Otago",
    landmark: {
      title: "Mt Cook Altitude Peak",
      detail: "Air temperatures drop roughly 1°C per 100 m because fewer air molecules exist at high relief to absorb solar rays.",
      themeIcon: "thermometer"
    }
  },
  { id: 16, name: "Milford Sound",      type: "alpine",   category: "TECTONIC_RING_OF_FIRE", icon: "🏞️", region: "Fiordland" },
  { id: 17, name: "Dunedin",            type: "city",     category: "LEES_PUSH_PULL",        icon: "🐧", region: "Otago" },
  { id: 18, name: "The Catlins",        type: "coastal",  category: "TRUE_OR_FALSE",         icon: "🌊", region: "Southland" },
  { id: 19, name: "Stewart Island",     type: "coastal",  category: "TRUE_OR_FALSE",         icon: "🌌", region: "Southland" },
  { id: 20, name: "Bluff",              type: "coastal",  category: "TRUE_OR_FALSE",         icon: "⚓", region: "Southland" }
];

export default function BoardMap({ players, currentPlayerIndex }) {
  // ── Snake path: bottom-to-top ──────────────────────
  // Grid rows render top-to-bottom in CSS, so we build
  // the array with the LAST row of the trail first.
  //
  // Visual result (top of screen → bottom):
  //   Row 0: 20  19  18  17  16     (R→L)   ← Finish / Bluff
  //   Row 1: 11  12  13  14  15     (L→R)
  //   Row 2: 10   9   8   7   6     (R→L)
  //   Row 3:  1   2   3   4   5     (L→R)   ← Start / Cape Reinga
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

  // ── Category-based colour classes ────────────────
  const getCategoryTileClass = (category) => {
    switch (category) {
      case 'LEES_PUSH_PULL':        return 'tile-cat-migration';
      case 'TECTONIC_RING_OF_FIRE': return 'tile-cat-tectonic';
      case 'TRUE_OR_FALSE':         return 'tile-cat-truefalse';
      default:                      return '';
    }
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'LEES_PUSH_PULL':
        return { label: 'Migration', cls: 'bg-teal-500/20 text-teal-300' };
      case 'TECTONIC_RING_OF_FIRE':
        return { label: 'Tectonic', cls: 'bg-red-500/20 text-red-300' };
      case 'TRUE_OR_FALSE':
        return { label: 'T / F', cls: 'bg-yellow-500/20 text-yellow-300' };
      default:
        return { label: '?', cls: 'bg-slate-500/20 text-slate-300' };
    }
  };

  const isChallengeTile = (id) => id % 2 === 1;

  const LandmarkIcon = ({ themeIcon }) => {
    if (themeIcon === 'wind') return <Wind className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
    return <Thermometer className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
  };

  return (
    <div className="w-full">
      {/* Board Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-emerald-400 animate-spin-slow" />
          <h2 className="text-xl font-bold text-white tracking-wide">The Kiwi Trail</h2>
        </div>
        <div className="flex gap-4 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span> Migration</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Tectonic</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> True / False</span>
        </div>
      </div>

      {/* Direction indicator */}
      <div className="flex items-center justify-center gap-2 mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <span>Bluff (Finish) ↑ Top</span>
        <span className="mx-2 w-16 h-px bg-slate-800"></span>
        <span>Bottom ↓ Cape Reinga (Start)</span>
      </div>

      {/* Main Board Grid (5 cols × 4 rows, snake bottom→top) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {windingSpaces.map((space) => {
          const playersHere = players.filter(p => p.position === space.id);
          const challenge = isChallengeTile(space.id);
          const badge = getCategoryBadge(space.category);

          return (
            <div
              key={space.id}
              className={`landmark-trigger relative flex flex-col justify-between p-3.5 rounded-xl border glass-panel transition-all duration-300 min-h-[120px] select-none ${getCategoryTileClass(space.category)}`}
            >
              {/* Space Number & Icon */}
              <div className="flex justify-between items-start">
                <span className="text-2xl font-black opacity-40">{space.id}</span>
                <span className="text-xl filter drop-shadow-md">{space.icon}</span>
              </div>

              {/* Name & Category Badge */}
              <div className="mt-1.5 flex-grow">
                <h3 className="text-[13px] font-bold text-white leading-tight truncate">{space.name}</h3>
                <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider mt-1 ${badge.cls}`}>
                  {badge.label}
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

              {/* Challenge indicator for odd tiles */}
              {challenge && (
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-violet-600/90 text-white text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full shadow flex items-center gap-0.5 z-10">
                  <HelpCircle className="w-2 h-2" /> Card
                </div>
              )}

              {/* ── Landmark Tooltip (Spaces 8 & 15) ── */}
              {space.landmark && (
                <div className="landmark-tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-slate-900/95 border border-slate-700/60 shadow-2xl z-50 backdrop-blur-xl">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <LandmarkIcon themeIcon={space.landmark.themeIcon} />
                    <span className="text-[10px] font-black uppercase tracking-wider text-white">{space.landmark.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{space.landmark.detail}</p>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-slate-900/95 border-r border-b border-slate-700/60"></div>
                </div>
              )}

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
