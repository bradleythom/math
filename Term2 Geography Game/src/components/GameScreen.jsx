import React, { useState, useRef } from 'react';
import BoardMap, { BOARD_SPACES } from './BoardMap';
import CardModal from './CardModal';
import questionsData from '../../data/questions.json';
import { Trophy, Dice5, RotateCcw, Award, Compass, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GameScreen({ initialPlayers, onReset }) {
  const [players, setPlayers] = useState(
    initialPlayers.map(p => ({ ...p, position: 1, gkp: 0 }))
  );
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [rollResult, setRollResult] = useState(null);
  const [isMoving, setIsMoving] = useState(false);

  // Quiz Card states
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [activeSpaceName, setActiveSpaceName] = useState('');
  const [usedQuestionKeys, setUsedQuestionKeys] = useState([]);

  // Game over state
  const [gameOver, setGameOver] = useState(false);
  const [gameWinner, setGameWinner] = useState(null);

  // Refs for interval cleanup
  const moveIntervalRef = useRef(null);

  // Activity feed logs
  const [logs, setLogs] = useState([
    { id: 1, text: "Game started! Cape Reinga is the starting point. Roll the die to begin.", type: "info" }
  ]);

  const addLog = (text, type = "info") => {
    setLogs(prev => [{ id: Date.now() + Math.random(), text, type }, ...prev].slice(0, 20));
    console.log(`[KiwiDrift] ${type.toUpperCase()}: ${text}`);
  };

  // ── Die Roll (1–4 range) ────────────────────────
  const handleRollDie = () => {
    if (isRolling || isMoving || showQuestionModal || gameOver) return;

    setIsRolling(true);
    setRollResult(null);
    addLog(`${players[currentPlayerIndex].name} is rolling the die…`, "roll");

    let counter = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 4) + 1);
      counter++;
      if (counter > 10) {
        clearInterval(interval);

        const roll = Math.floor(Math.random() * 4) + 1;
        setDiceValue(roll);
        setRollResult(roll);
        setIsRolling(false);

        addLog(`${players[currentPlayerIndex].name} rolled a ${roll}!`, "move");
        animatePlayerMovement(currentPlayerIndex, roll);
      }
    }, 90);
  };

  // ── Step-by-step tile movement ──────────────────
  const animatePlayerMovement = (playerIndex, steps) => {
    setIsMoving(true);
    const startPos = players[playerIndex].position;
    const targetPosition = Math.min(20, startPos + steps);
    let currentPos = startPos;

    moveIntervalRef.current = setInterval(() => {
      currentPos += 1;
      if (currentPos <= targetPosition) {
        setPlayers(prev => {
          const updated = prev.map((p, i) =>
            i === playerIndex ? { ...p, position: currentPos } : p
          );
          return updated;
        });
      }

      if (currentPos >= targetPosition) {
        clearInterval(moveIntervalRef.current);
        moveIntervalRef.current = null;
        setIsMoving(false);

        const landedSpace = BOARD_SPACES[targetPosition - 1];
        addLog(`${players[playerIndex].name} landed on Space ${targetPosition} — ${landedSpace.name}.`, "move");

        // ── Check for game end (reached tile 20) ──
        if (targetPosition >= 20) {
          setTimeout(() => handleGameEnd(playerIndex), 400);
          return;
        }

        // ── Odd-numbered tile → launch card challenge ──
        if (targetPosition % 2 === 1) {
          setTimeout(() => {
            triggerCardChallenge(playerIndex, targetPosition);
          }, 500);
        } else {
          // Even tile → no challenge, auto-advance turn
          addLog(`Space ${targetPosition} is a rest stop — no challenge. Turn passes.`, "info");
          setTimeout(() => advanceToNextPlayer(), 800);
        }
      }
    }, 220);
  };

  // ── Pick a question matching the space's curriculum category ──
  const triggerCardChallenge = (playerIndex, position) => {
    const space = BOARD_SPACES[position - 1];
    const desiredCategory = space.category;

    // Build pool: prefer unused questions in the right category
    let pool = questionsData.filter(q => q.category === desiredCategory && !usedQuestionKeys.includes(q.question));
    if (pool.length === 0) pool = questionsData.filter(q => q.category === desiredCategory);
    if (pool.length === 0) pool = questionsData.filter(q => !usedQuestionKeys.includes(q.question));
    if (pool.length === 0) {
      pool = [...questionsData];
      setUsedQuestionKeys([]);
    }

    const selectedQ = pool[Math.floor(Math.random() * pool.length)];
    setUsedQuestionKeys(prev => [...prev, selectedQ.question]);
    setActiveQuestion(selectedQ);
    setActiveSpaceName(space.name);
    setShowQuestionModal(true);

    const catLabel =
      selectedQ.category === 'LEES_PUSH_PULL' ? 'Migration' :
      selectedQ.category === 'TECTONIC_RING_OF_FIRE' ? 'Tectonic' : 'True/False';

    addLog(`${players[playerIndex].name} drew a ${catLabel} card at ${space.name}!`, "card");
  };

  // ── Unified modal close handler ─────────────────
  const handleModalClose = ({ correct, points }) => {
    const playerName = players[currentPlayerIndex].name;

    if (correct) {
      setPlayers(prev => prev.map((p, i) =>
        i === currentPlayerIndex ? { ...p, gkp: p.gkp + points } : p
      ));
      addLog(`Correct! ${playerName} earned +${points} GKP.`, "success");
      console.log(`[KiwiDrift] SCORE_UPDATE: ${playerName} +${points} GKP → total ${players[currentPlayerIndex].gkp + points}`);
    } else {
      addLog(`Incorrect. No GKP awarded to ${playerName}.`, "error");
    }

    setShowQuestionModal(false);
    setActiveQuestion(null);

    // Check for finish after answering
    if (players[currentPlayerIndex].position >= 20) {
      setTimeout(() => handleGameEnd(currentPlayerIndex), 300);
    } else {
      setTimeout(() => advanceToNextPlayer(), 300);
    }
  };

  // ── Advance to next player in the turn cycle ────
  const advanceToNextPlayer = () => {
    setCurrentPlayerIndex(prev => {
      const next = (prev + 1) % players.length;
      console.log(`[KiwiDrift] TURN_CYCLE: Advancing to Player ${next + 1} (${players[next].name})`);
      return next;
    });
  };

  // ── End game logic ──────────────────────────────
  const handleGameEnd = (finisherIndex) => {
    const bonusPoints = 50;
    const finisher = players[finisherIndex];
    addLog(`${finisher.name} reached Bluff (Space 20)! Speed bonus: +${bonusPoints} GKP!`, "finish");

    const finalPlayers = players.map((p, idx) =>
      idx === finisherIndex ? { ...p, gkp: p.gkp + bonusPoints } : p
    );
    setPlayers(finalPlayers);

    const winner = finalPlayers.reduce((best, p) => p.gkp > best.gkp ? p : best, finalPlayers[0]);
    setGameWinner(winner);
    setGameOver(true);

    console.log('[KiwiDrift] GAME_OVER — Final standings:',
      finalPlayers.map(p => `${p.name}: ${p.gkp} GKP`).join(' | ')
    );
    triggerConfetti();
  };

  // ── Confetti burst ──────────────────────────────
  const triggerConfetti = () => {
    const duration = 5000;
    const end = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    const rand = (a, b) => Math.random() * (b - a) + a;

    const interval = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);
      const n = 50 * ((end - Date.now()) / duration);
      confetti({ ...defaults, particleCount: n, origin: { x: rand(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount: n, origin: { x: rand(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  // ── Derived state ───────────────────────────────
  const sortedLeaderboard = [...players].sort((a, b) => b.gkp - a.gkp);
  const activePlayer = players[currentPlayerIndex];
  const dieDisabled = isRolling || isMoving || showQuestionModal || gameOver;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-6 relative">

      {/* ── Top Bar ────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl shadow-lg shadow-emerald-500/20">
            <Compass className="w-6 h-6 text-slate-950 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-wide">The Great Kiwi Drift</h1>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Aotearoa Geography Revision Game</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 border border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all duration-300 hover:shadow-lg active:scale-95"
        >
          <RotateCcw className="w-4 h-4" /> Reset Lobby
        </button>
      </div>

      {/* ── Main Grid Layout ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Board + Control Dock (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Board Map */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-3xl p-5 shadow-xl">
            <BoardMap players={players} currentPlayerIndex={currentPlayerIndex} />
          </div>

          {/* ── Action Control Dock ─────────────────── */}
          <div className="bg-gradient-to-r from-slate-900/80 to-slate-950/80 backdrop-blur-md border border-slate-800/60 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">

            {/* Turn status */}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-xl ${activePlayer.colorClass}`}>
                {activePlayer.name[0].toUpperCase()}
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Active Player</span>
                <h2 className="text-xl font-extrabold text-white leading-tight">{activePlayer.name}'s Turn</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Space <strong className="text-white">{activePlayer.position}</strong> / 20
                </p>
              </div>
            </div>

            {/* Roll Die button */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleRollDie}
                disabled={dieDisabled}
                className={`group relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-lg py-4 px-10 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-emerald-500/25 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                  isRolling ? 'animate-pulse' : 'hover:scale-[1.03] hover:shadow-cyan-500/20'
                }`}
              >
                <span className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <Dice5 className={`w-6 h-6 transition-transform duration-500 ${isRolling ? 'rotate-180 animate-spin-slow' : 'group-hover:rotate-12'}`} />
                {isRolling ? "Rolling…" : isMoving ? "Moving…" : "Roll Die"}
              </button>
              {rollResult && (
                <span className="text-xs font-bold text-slate-400 animate-fade-in">
                  Rolled a <strong className="text-white text-sm bg-slate-800 px-2 py-0.5 rounded border border-slate-700/80">{rollResult}</strong>
                </span>
              )}
              <span className="text-[10px] text-slate-600 font-semibold">Range: 1 – 4</span>
            </div>

            {/* Dice Value Display */}
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-inner relative overflow-hidden">
              <span className={`text-3xl font-black text-white ${isRolling ? 'animate-bounce text-emerald-400' : ''}`}>
                {diceValue}
              </span>
              <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-slate-600"></div>
              <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-slate-600"></div>
            </div>
          </div>
        </div>

        {/* ── Sidebar (Leaderboard + Logs) ──────────── */}
        <div className="flex flex-col gap-6">

          {/* Leaderboard */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-3xl p-6 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h2 className="text-md font-bold text-white uppercase tracking-wider">Scoreboard (GKP)</h2>
            </div>

            <div className="flex flex-col gap-3">
              {sortedLeaderboard.map((player, index) => {
                const isCurrent = activePlayer.id === player.id;
                let rankBadge = "bg-slate-800 text-slate-400";
                if (index === 0) rankBadge = "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
                else if (index === 1) rankBadge = "bg-slate-300/20 text-slate-200 border border-slate-300/30";
                else if (index === 2) rankBadge = "bg-amber-700/20 text-amber-500 border border-amber-700/30";

                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 ${
                      isCurrent ? 'border-emerald-500/40 bg-emerald-950/10 shadow-md shadow-emerald-500/5' : 'border-slate-800/80 bg-slate-900/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${rankBadge}`}>{index + 1}</span>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${player.colorClass}`}>
                        {player.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-white leading-none">{player.name}</h3>
                          {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>}
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
                let cls = "text-slate-300";
                if (log.type === "success") cls = "text-emerald-400 font-semibold";
                else if (log.type === "error") cls = "text-rose-400";
                else if (log.type === "finish") cls = "text-yellow-400 font-extrabold";
                else if (log.type === "move") cls = "text-cyan-400";
                else if (log.type === "card") cls = "text-violet-400";

                return (
                  <div key={log.id} className="leading-relaxed border-b border-slate-800/20 pb-1.5">
                    <span className="text-slate-500 mr-1.5">»</span>
                    <span className={cls}>{log.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Card Modal Overlay ──────────────────────── */}
      {showQuestionModal && activeQuestion && (
        <CardModal
          question={activeQuestion}
          player={activePlayer}
          onClose={handleModalClose}
          spaceName={activeSpaceName}
        />
      )}

      {/* ── Game Over Screen ───────────────────────── */}
      {gameOver && gameWinner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg overflow-hidden border border-yellow-500/30 rounded-3xl bg-slate-900 p-8 text-center shadow-2xl animate-scale-in">
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-500/10 p-5 rounded-full border border-yellow-500/20 animate-bounce-slow">
                <Trophy className="w-16 h-16 text-yellow-400" />
              </div>
            </div>

            <span className="text-xs font-black uppercase tracking-widest text-yellow-400">Ultimate Kiwi Geographer</span>
            <h2 className="text-3xl font-black text-white mt-2 mb-4">{gameWinner.name} Wins!</h2>

            <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
              {gameWinner.name} conquered the Kiwi Trail with <strong className="text-yellow-400 font-bold">{gameWinner.gkp} GKP</strong>!
            </p>

            <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/80 mb-8 max-w-xs mx-auto">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Final Standings</h4>
              <div className="flex flex-col gap-2.5">
                {[...players].sort((a, b) => b.gkp - a.gkp).map((p, idx) => (
                  <div key={p.id} className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <span className="text-slate-500">#{idx + 1}</span> {p.name}
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
