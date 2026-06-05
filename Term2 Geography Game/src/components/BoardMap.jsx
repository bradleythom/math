import React from 'react';
import { MapPin, Flag, Compass, HelpCircle } from 'lucide-react';

// Each space explicitly maps to one of three curriculum categories.
// Volcanic & Alpine → TECTONIC_RING_OF_FIRE
// City → LEES_PUSH_PULL
// Coastal → TRUE_OR_FALSE
export const BOARD_SPACES = [
  { id: 1,  name: "Cape Reinga",       type: "coastal",  category: "TRUE_OR_FALSE",         icon: "🌅", region: "Northland" },
  { id: 2,  name: "Bay of Islands",    type: "coastal",  category: "TRUE_OR_FALSE",         icon: "⛵", region: "Northland" },
  { id: 3,  name: "Auckland",          type: "city",     category: "LEES_PUSH_PULL",        icon: "🏙️", region: "Auckland" },
  { id: 4,  name: "Coromandel",        type: "coastal",  category: "TRUE_OR_FALSE",         icon: "🏖️", region: "Waikato" },
  { id: 5,  name: "Rotorua",           type: "volcanic", category: "TECTONIC_RING_OF_FIRE", icon: "🌋", region: "Bay of Plenty" },
  { id: 6,  name: "Lake Taupō",        type: "volcanic", category: "TECTONIC_RING_OF_FIRE", icon: "🌊", region: "Waikato" },
  { id: 7,  name: "Tongariro",         type: "volcanic", category: "TECTONIC_RING_OF_FIRE", icon: "🏔️", region: "Manawatū-Whanganui" },
  { id: 8,  name: "Napier",            type: "city",     category: "LEES_PUSH_PULL",        icon: "🍇", region: "Hawke's Bay" },
  { id: 9,  name: "Wellington",        type: "city",     category: "LEES_PUSH_PULL",        icon: "💨", region: "Wellington" },
  { id: 10, name: "Marlborough Sounds",type: "coastal",  category: "TRUE_OR_FALSE",         icon: "🛳️", region: "Marlborough" },
  { id: 11, name: "Abel Tasman",       type: "coastal",  category: "TRUE_OR_FALSE",         icon: "🏖️", region: "Tasman" },
  { id: 12, name: "Hokitika",          type: "coastal",  category: "TRUE_OR_FALSE",         icon: "🟢", region: "West Coast" },
  { id: 13, name: "Franz Josef",       type: "alpine",   category: "TECTONIC_RING_OF_FIRE", icon: "❄️", region: "West Coast" },
  { id: 14, name: "Lake Wānaka",       type: "alpine",   category: "TECTONIC_RING_OF_FIRE", icon: "🌳", region: "Otago" },
  { id: 15, name: "Queenstown",        type: "alpine",   category: "TECTONIC_RING_OF_FIRE", icon: "🏂", region: "Otago" },
  { id: 16, name: "Milford Sound",     type: "alpine",   category: "TECTONIC_RING_OF_FIRE", icon: "🏞️", region: "Fiordland" },
  { id: 17, name: "Dunedin",           type: "city",     category: "LEES_PUSH_PULL",        icon: "🐧", region: "Otago" },
  { id: 18, name: "The Catlins",       type: "coastal",  category: "TRUE_OR_FALSE",         icon: "🌊", region: "Southland" },
  { id: 19, name: "Stewart Island",    type: "coastal",  category: "TRUE_OR_FALSE",         icon: "🌌", region: "Southland" },
  { id: 20, name: "Bluff",             type: "coastal",  category: "TRUE_OR_FALSE",         icon: "⚓", region: "Southland" }
];

export default function BoardMap({ players, currentPlayerIndex }) {
  // Winding path on desktop (5 cols x 4 rows):
  // Row 0 (1-5):   Left to Right
  // Row 1 (6-10):  Right to Left
  // Row 2 (11-15): Left to Right
  // Row 3 (16-20): Right to Left
  const getWindingOrder = () => {
    const grid = [];
    const columns = 5;
    const rows = 4;

    for (let r = 0; r < rows; r++) {
      const rowStartIndex = r * columns;
      const rowItems = BOARD_SPACES.slice(rowStartIndex, rowStartIndex + columns);

      if (r % 2 === 1) {
        rowItems.reverse();
      }
      grid.push(...rowItems);
    }
    return grid;
  };

  const windingSpaces = getWindingOrder();

  const getTypeStyles = (type) => {
    switch (type) {
      case 'volcanic':
        return 'border-orange-500/30 hover:border-orange-400 bg-orange-950/10 text-orange-200';
      case 'coastal':
        return 'border-emerald-500/30 hover:border-emerald-400 bg-emerald-950/10 text-emerald-200';
      case 'alpine':
        return 'border-cyan-500/30 hover:border-cyan-400 bg-cyan-950/10 text-cyan-200';
      case 'city':
        return 'border-amber-500/30 hover:border-amber-400 bg-amber-950/10 text-amber-200';
      default:
        return 'border-slate-500/30 hover:border-slate-400 bg-slate-900/10 text-slate-200';
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'volcanic': return 'bg-orange-500/20 text-orange-300';
      case 'coastal': return 'bg-emerald-500/20 text-emerald-300';
      case 'alpine': return 'bg-cyan-500/20 text-cyan-300';
      case 'city': return 'bg-amber-500/20 text-amber-300';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  // Whether a tile is odd (triggers a question challenge)
  const isChallengeTile = (id) => id % 2 === 1;

  return (
    <div className="w-full">
      {/* Board Header Info */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-emerald-400 animate-spin-slow" />
          <h2 className="text-xl font-bold text-white tracking-wide">The Kiwi Trail</h2>
        </div>
        <div className="flex gap-4 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Coastal</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Volcanic</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Alpine</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> City</span>
        </div>
      </div>

      {/* Main Board Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {windingSpaces.map((space) => {
          const playersHere = players.filter(p => p.position === space.id);
          const challenge = isChallengeTile(space.id);

          return (
            <div
              key={space.id}
              className={`relative flex flex-col justify-between p-4 rounded-xl border glass-panel transition-all duration-300 min-h-[125px] select-none ${getTypeStyles(space.type)}`}
            >
              {/* Space Number and Icon */}
              <div className="flex justify-between items-start">
                <span className="text-2xl font-black opacity-45">{space.id}</span>
                <span className="text-2xl filter drop-shadow-md">{space.icon}</span>
              </div>

              {/* Title & Type Badge */}
              <div className="mt-2 flex-grow">
                <h3 className="text-sm font-bold text-white leading-tight truncate">{space.name}</h3>
                <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider mt-1 ${getTypeBadge(space.type)}`}>
                  {space.type}
                </span>
              </div>

              {/* Start/Finish Indicators */}
              {space.id === 1 && (
                <div className="absolute -top-2 -left-2 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-lg flex items-center gap-1">
                  <Flag className="w-2.5 h-2.5" /> Start
                </div>
              )}
              {space.id === 20 && (
                <div className="absolute -top-2 -right-2 bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-lg flex items-center gap-1 animate-pulse">
                  <Flag className="w-2.5 h-2.5" /> Finish
                </div>
              )}

              {/* Challenge indicator for odd tiles */}
              {challenge && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-violet-600/90 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow flex items-center gap-0.5">
                  <HelpCircle className="w-2.5 h-2.5" /> Card
                </div>
              )}

              {/* Player Tokens Container */}
              <div className="mt-3 flex flex-wrap gap-1.5 min-h-[24px]">
                {playersHere.map((player) => {
                  const isActivePlayer = players[currentPlayerIndex]?.id === player.id;
                  return (
                    <div
                      key={player.id}
                      className={`relative w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg border transition-transform duration-300 ${player.colorClass} ${
                        isActivePlayer ? 'scale-110 ring-2 ring-white ring-offset-1 ring-offset-slate-900 animate-bounce' : ''
                      }`}
                      title={`${player.name} (GKP: ${player.gkp})`}
                    >
                      {player.name[0].toUpperCase()}
                      {isActivePlayer && (
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
