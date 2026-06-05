import React, { useState, useEffect } from 'react';
import BoardMap, { BOARD_SPACES } from './BoardMap';
import CardModal from './CardModal';
import questionsData from '../../data/questions.json';
import { Trophy, Dice5, RotateCcw, Volume2, ShieldAlert, Award, Compass, Play, Sparkles, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GameScreen({ initialPlayers, onReset }) {
  const [players, setPlayers] = useState(
    initialPlayers.map(p => ({ ...p, position: 1, gkp: 0 }))
  );
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [rollResult, setRollResult] = useState(null);
  
  // Quiz Card states
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [usedQuestionIds, setUsedQuestionIds] = useState([]);

  // Game over state
  const [gameOver, setGameOver] = useState(false);
  const [gameWinner, setGameWinner] = useState(null);

  // Activity feed logs
  const [logs, setLogs] = useState([
    { id: 1, text: "Game started! Cape Reinga is our starting point. Good luck!", type: "info" }
  ]);

  const addLog = (text, type = "info") => {
    setLogs(prev => [{ id: Date.now(), text, type }, ...prev].slice(0, 15));
  };

  // Roll die with rolling animation
  const handleRollDie = () => {
    if (isRolling || showQuestionModal || gameOver) return;

    setIsRolling(true);
    setRollResult(null);
    addLog(`${players[currentPlayerIndex].name} is rolling the die...`, "roll");

    // Animate numbers
    let counter = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        
        // Final roll result
        const roll = Math.floor(Math.random() * 6) + 1;
        setDiceValue(roll);
        setRollResult(roll);
        setIsRolling(false);
        
        // Initiate movement
        animatePlayerMovement(currentPlayerIndex, roll);
      }
    }, 100);
  };

  // Animates the player token stepping tile-by-tile along the board
  const animatePlayerMovement = (playerIndex, steps) => {
    const player = players[playerIndex];
    const targetPosition = Math.min(20, player.position + steps);
    
    addLog(`${player.name} rolled a ${steps}! Drifting down the trail.`, "move");

    const moveInterval = setInterval(() => {
      setPlayers(prevPlayers => {
        const updated = [...prevPlayers];
        if (updated[playerIndex].position < targetPosition) {
          updated[playerIndex].position += 1;
          return updated;
        } else {
          clearInterval(moveInterval);
          
          // Player finished moving, now draw a card!
          setTimeout(() => {
            triggerCardChallenge(playerIndex, targetPosition);
          }, 600);
          
          return prevPlayers;
        }
      });
    }, 250); // Speed of tile-by-tile hop
  };

  // Select a question that matches the category of the space, otherwise pick random
  const triggerCardChallenge = (playerIndex, position) => {
    const player = players[playerIndex];
    const space = BOARD_SPACES[position - 1];
    
    // Map board space type to curriculum category
    // Volcanic & Alpine -> TECTONIC_RING_OF_FIRE
    // City -> LEES_PUSH_PULL
    // Coastal -> Alternates between LEES_PUSH_PULL and TRUE_OR_FALSE
    let desiredCategory = "TECTONIC_RING_OF_FIRE";
    if (space.type === "city") {
      desiredCategory = "LEES_PUSH_PULL";
    } else if (space.type === "coastal") {
      desiredCategory = space.id % 2 === 0 ? "LEES_PUSH_PULL" : "TRUE_OR_FALSE";
    } else if (space.type === "alpine") {
      desiredCategory = "TECTONIC_RING_OF_FIRE";
    }

    // Filter questions not yet used in this session (if possible)
    let pool = questionsData.filter(q => q.category === desiredCategory && !usedQuestionIds.includes(q.question));
    
    // Fallback 1: category questions that were already used
    if (pool.length === 0) {
      pool = questionsData.filter(q => q.category === desiredCategory);
    }

    // Fallback 2: any unused question
    if (pool.length === 0) {
      pool = questionsData.filter(q => !usedQuestionIds.includes(q.question));
    }

    // Fallback 3: any question at all
    if (pool.length === 0) {
      pool = questionsData;
      setUsedQuestionIds([]);
    }

    // Pick a random question from the qualified pool
    const selectedQ = pool[Math.floor(Math.random() * pool.length)];

    setUsedQuestionIds(prev => [...prev, selectedQ.question]);
    setActiveQuestion(selectedQ);
    setShowQuestionModal(true);
    
    // Create printable category names
    let categoryLabel = "Physical Processes";
    if (selectedQ.category === "LEES_PUSH_PULL") categoryLabel = "Migration/Human Geography";
    else if (selectedQ.category === "TRUE_OR_FALSE") categoryLabel = "Quick-Fire Facts";

    addLog(`${player.name} drew a ${categoryLabel} challenge at ${space.name}!`, "card");
  };

  // Handle answers
  const handleAnswerSubmit = (isCorrect, pointsEarned, isFinalConfirmation = false) => {
    if (!isFinalConfirmation) {
      // Just track local points accumulation inside players state
      if (isCorrect) {
        setPlayers(prev => {
          const updated = [...prev];
          updated[currentPlayerIndex].gkp += pointsEarned;
          return updated;
        });
        addLog(`Correct! ${players[currentPlayerIndex].name} earned +${pointsEarned} GKP!`, "success");
      } else {
        addLog(`Incorrect answer. No GKP awarded to ${players[currentPlayerIndex].name}.`, "error");
      }
      return;
    }

    // This handles the final confirmation overlay click (closing the modal)
    setShowQuestionModal(false);
    setActiveQuestion(null);

    // Check if the current player has reached the final space (20 - Bluff)
    const player = players[currentPlayerIndex];
    if (player.position === 20) {
      handleGameEnd();
    } else {
      // Advance to next player
      setCurrentPlayerIndex(prev => (prev + 1) % players.length);
    }
  };

  // End game logic
  const handleGameEnd = () => {
    // Add speed bonus to whoever finished first
    const firstFinisher = players[currentPlayerIndex];
    const bonusPoints = 50; // Balanced bonus for first to Bluff
    
    addLog(`${firstFinisher.name} reached Bluff first! Awarded a speed bonus of +${bonusPoints} GKP!`, "finish");
    
    const finalPlayers = players.map((p, idx) => {
      if (idx === currentPlayerIndex) {
        return { ...p, gkp: p.gkp + bonusPoints };
      }
      return p;
    });

    setPlayers(finalPlayers);
    
    // Determine winner based on total GKPs
    let winner = finalPlayers[0];
    for (let i = 1; i < finalPlayers.length; i++) {
      if (finalPlayers[i].gkp > winner.gkp) {
        winner = finalPlayers[i];
      }
    }

    setGameWinner(winner);
    setGameOver(true);
    
    // Trigger confetti!
    triggerConfetti();
  };

  const triggerConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Confetti from left and right corners
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  // Leaderboard lists players sorted by GKP
  const sortedLeaderboard = [...players].sort((a, b) => b.gkp - a.gkp);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-6 relative">
      
      {/* Top Navigation / Dashboard Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl shadow-lg shadow-emerald-500/20">
            <Compass className="w-6 h-6 text-slate-950 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-wide flex items-center gap-1.5">
              The Great Kiwi Drift
            </h1>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Aotearoa Geography revision game</p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 border border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all duration-300 hover:shadow-lg active:scale-95"
        >
          <RotateCcw className="w-4 h-4" /> Reset Lobby
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Game Map Column (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Main Map Container */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-3xl p-6 shadow-xl">
            <BoardMap players={players} currentPlayerIndex={currentPlayerIndex} />
          </div>

          {/* Action Control Dock (Big Central trigger button + Roll state) */}
          <div className="bg-gradient-to-r from-slate-900/80 to-slate-950/80 backdrop-blur-md border border-slate-800/60 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Left side: Turn status */}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-xl ${players[currentPlayerIndex].colorClass}`}>
                {players[currentPlayerIndex].name[0].toUpperCase()}
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Active Player</span>
                <h2 className="text-xl font-extrabold text-white leading-tight">
                  {players[currentPlayerIndex].name}'s Turn
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Currently on step <strong className="text-white">{players[currentPlayerIndex].position} / 20</strong>
                </p>
              </div>
            </div>

            {/* Center: The Roll Action */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleRollDie}
                disabled={isRolling || showQuestionModal || gameOver}
                className={`group relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-lg py-4 px-10 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-emerald-500/25 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                  isRolling ? 'animate-pulse' : 'hover:scale-[1.03] hover:shadow-cyan-500/20'
                }`}
              >
                {/* Glow layer */}
                <span className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                
                <Dice5 className={`w-6 h-6 transition-transform duration-500 ${isRolling ? 'rotate-180 animate-spin-slow' : 'group-hover:rotate-12'}`} />
                {isRolling ? "Rolling..." : "Roll Die"}
              </button>
              
              {rollResult && (
                <span className="text-xs font-bold text-slate-400 animate-fade-in">
                  Rolled a <strong className="text-white text-sm bg-slate-800 px-2 py-0.5 rounded border border-slate-700/80">{rollResult}</strong>
                </span>
              )}
            </div>

            {/* Right side: Dice Value Graphic */}
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-inner relative overflow-hidden">
              <span className={`text-3xl font-black text-white ${isRolling ? 'animate-bounce text-emerald-400' : ''}`}>
                {diceValue}
              </span>
              <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-slate-600"></div>
              <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-slate-600"></div>
            </div>
          </div>
        </div>

        {/* Sidebar Column (Leaderboard & Logs, 1/3 width) */}
        <div className="flex flex-col gap-6">
          
          {/* Persistent Leaderboard */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-3xl p-6 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h2 className="text-md font-bold text-white uppercase tracking-wider">Scoreboard (GKP)</h2>
            </div>
            
            <div className="flex flex-col gap-3">
              {sortedLeaderboard.map((player, index) => {
                const isCurrentTurn = players[currentPlayerIndex].id === player.id;
                
                // Rank styling
                let rankBadge = "bg-slate-800 text-slate-400";
                if (index === 0) rankBadge = "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
                else if (index === 1) rankBadge = "bg-slate-300/20 text-slate-200 border border-slate-300/30";
                else if (index === 2) rankBadge = "bg-amber-700/20 text-amber-500 border border-amber-700/30";

                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 ${
                      isCurrentTurn
                        ? 'border-emerald-500/40 bg-emerald-950/10 shadow-md shadow-emerald-500/5'
                        : 'border-slate-800/80 bg-slate-900/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank Indicator */}
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${rankBadge}`}>
                        {index + 1}
                      </span>
                      
                      {/* Token */}
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${player.colorClass}`}>
                        {player.name[0].toUpperCase()}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-white leading-none">{player.name}</h3>
                          {isCurrentTurn && (
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                          )}
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-0.5 mt-1">
                          <MapPin className="w-3 h-3 text-slate-500" /> Space {player.position}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Score</span>
                      <span className="text-sm font-extrabold text-yellow-400 flex items-center gap-0.5 justify-end">
                        <Award className="w-4 h-4" /> {player.gkp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-3xl p-6 shadow-xl flex flex-col gap-3 min-h-[250px] max-h-[350px]">
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800/80">
              Drift Activity Log
            </h2>
            <div className="flex-grow overflow-y-auto pr-1 flex flex-col gap-2.5 text-xs text-slate-300">
              {logs.map((log) => {
                let textClass = "text-slate-300";
                if (log.type === "success") textClass = "text-emerald-400 font-medium";
                else if (log.type === "error") textClass = "text-rose-400";
                else if (log.type === "finish") textClass = "text-yellow-400 font-extrabold";
                else if (log.type === "move") textClass = "text-cyan-400";

                return (
                  <div key={log.id} className="leading-relaxed border-b border-slate-800/20 pb-1.5">
                    <span className="text-slate-500 mr-1.5">»</span>
                    <span className={textClass}>{log.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Cards Modal overlay */}
      {showQuestionModal && (
        <CardModal
          question={activeQuestion}
          player={players[currentPlayerIndex]}
          onAnswerSubmit={handleAnswerSubmit}
          spaceName={BOARD_SPACES[players[currentPlayerIndex].position - 1].name}
        />
      )}

      {/* Game Over Screen */}
      {gameOver && gameWinner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg overflow-hidden border border-yellow-500/30 rounded-3xl bg-slate-900 p-8 text-center shadow-2xl animate-scale-in">
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-500/10 p-5 rounded-full border border-yellow-500/20 animate-bounce-slow">
                <Trophy className="w-16 h-16 text-yellow-400" />
              </div>
            </div>
            
            <span className="text-xs font-black uppercase tracking-widest text-yellow-400">Ultimate Kiwi Geographer</span>
            <h2 className="text-3xl font-black text-white mt-2 mb-4">
              {gameWinner.name} Wins!
            </h2>
            
            <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
              Congratulations! {gameWinner.name} conquered the Kiwi Trail and accumulated the highest knowledge score of <strong className="text-yellow-400 font-bold">{gameWinner.gkp} GKP</strong>!
            </p>

            <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/80 mb-8 max-w-xs mx-auto">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Final Standings</h4>
              <div className="flex flex-col gap-2.5">
                {players.sort((a,b) => b.gkp - a.gkp).map((p, idx) => (
                  <div key={p.id} className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <span className="text-slate-500">#{idx+1}</span> {p.name}
                    </span>
                    <span className="font-bold text-yellow-400">{p.gkp} GKP</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onReset}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-3 px-8 rounded-xl flex items-center justify-center gap-2 mx-auto transition-all duration-300 shadow-xl shadow-emerald-500/15 hover:scale-105 active:scale-95"
            >
              Play Again <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
