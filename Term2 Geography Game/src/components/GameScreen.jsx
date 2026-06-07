import React, { useState, useRef } from 'react';
import BoardMap, { BOARD_SPACES } from './BoardMap';
import CardModal from './CardModal';
import questionsData from '../../data/questions.json';
import { Trophy, Dice5, RotateCcw, Award, Compass, MapPin, Target, TrendingUp, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GameScreen({ player: initialPlayer, onReset }) {
  // Single-player state
  const [player, setPlayer] = useState({ ...initialPlayer, position: 1, gkp: 0 });
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [rollResult, setRollResult] = useState(null);
  const [isMoving, setIsMoving] = useState(false);

  // Quiz card states
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [activeSpaceName, setActiveSpaceName] = useState('');
  const [usedQuestionKeys, setUsedQuestionKeys] = useState([]);

  // Stats tracking
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [questionsCorrect, setQuestionsCorrect] = useState(0);

  // Game over
  const [gameOver, setGameOver] = useState(false);

  // Ref for movement interval cleanup
  const moveIntervalRef = useRef(null);

  // Activity feed
  const [logs, setLogs] = useState([
    { id: 1, text: "Revision session started! Roll the die to begin your journey from Cape Reinga.", type: "info" }
  ]);

  const addLog = (text, type = "info") => {
    setLogs(prev => [{ id: Date.now() + Math.random(), text, type }, ...prev].slice(0, 20));
    console.log(`[KiwiDrift] ${type.toUpperCase()}: ${text}`);
  };

  // ── Die Roll (1–4) ──────────────────────────────
  const handleRollDie = () => {
    if (isRolling || isMoving || showQuestionModal || gameOver) return;

    setIsRolling(true);
    setRollResult(null);
    addLog("Rolling the die…", "roll");

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
        addLog(`Rolled a ${roll}!`, "move");
        animateMovement(roll);
      }
    }, 90);
  };

  // ── Step-by-step movement ───────────────────────
  const animateMovement = (steps) => {
    setIsMoving(true);
    const startPos = player.position;
    const targetPos = Math.min(20, startPos + steps);
    let currentPos = startPos;

    moveIntervalRef.current = setInterval(() => {
      currentPos += 1;
      if (currentPos <= targetPos) {
        setPlayer(prev => ({ ...prev, position: currentPos }));
      }
      if (currentPos >= targetPos) {
        clearInterval(moveIntervalRef.current);
        moveIntervalRef.current = null;
        setIsMoving(false);

        const space = BOARD_SPACES[targetPos - 1];
        addLog(`Landed on Space ${targetPos} — ${space.name}.`, "move");

        // Every tile is now an active challenge
        setTimeout(() => triggerCard(targetPos), 500);
      }
    }, 220);
  };

  // ── Draw a question card ────────────────────────
  const triggerCard = (position) => {
    const space = BOARD_SPACES[position - 1];

    // Find all questions mapped explicitly to this tile
    const tileQuestions = questionsData.filter(q => q.tileId === position);

    // Prioritize questions not yet seen from this tile's pool
    let pool = tileQuestions.filter(q => !usedQuestionKeys.includes(q.question));
    
    // If all questions for this tile have been answered, allow them to repeat
    if (pool.length === 0) {
      pool = tileQuestions;
    }
    
    // Fallback in case of data error
    if (pool.length === 0) pool = questionsData;

    const q = pool[Math.floor(Math.random() * pool.length)];
    setUsedQuestionKeys(prev => [...prev, q.question]);
    setActiveQuestion(q);
    setActiveSpaceName(space.name);
    setShowQuestionModal(true);

    addLog(`Drew a challenge at ${space.name}: ${q.topic}`, "card");
  };

  // ── Modal close handler ─────────────────────────
  const handleModalClose = ({ correct, points }) => {
    setQuestionsAnswered(prev => prev + 1);

    if (correct) {
      setPlayer(prev => ({ ...prev, gkp: prev.gkp + points }));
      setQuestionsCorrect(prev => prev + 1);
      addLog(`Correct! +${points} GKP earned.`, "success");
      console.log(`[KiwiDrift] SCORE_UPDATE: +${points} GKP → total ${player.gkp + points}`);
    } else {
      addLog("Incorrect — review the answer shown and try to remember it!", "error");
    }

    setShowQuestionModal(false);
    setActiveQuestion(null);

    if (player.position >= 20) {
      setTimeout(() => handleGameEnd(), 300);
    }
  };

  // ── Game end ────────────────────────────────────
  const handleGameEnd = () => {
    const bonus = 50;
    addLog(`Reached Bluff! Speed bonus: +${bonus} GKP.`, "finish");
    setPlayer(prev => ({ ...prev, gkp: prev.gkp + bonus }));
    setGameOver(true);
    console.log(`[KiwiDrift] GAME_OVER — Final GKP: ${player.gkp + bonus}`);
    triggerConfetti();
  };

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

  // ── Derived ─────────────────────────────────────
  const dieDisabled = isRolling || isMoving || showQuestionModal || gameOver;
  const accuracy = questionsAnswered > 0 ? Math.round((questionsCorrect / questionsAnswered) * 100) : 0;
  // Wrap single player in array for BoardMap compatibility
  const playersArray = [player];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-6 relative">

      {/* ── Top Bar ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl shadow-lg shadow-emerald-500/20">
            <Compass className="w-6 h-6 text-slate-950 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-wide">The Great Kiwi Drift</h1>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Solo Revision Session</p>
          </div>
        </div>
        <button onClick={onReset} className="flex items-center gap-2 px-4 py-2 border border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all duration-300 hover:shadow-lg active:scale-95">
          <RotateCcw className="w-4 h-4" /> Back to Menu
        </button>
      </div>

      {/* ── Main Grid ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Board + Controls (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-3xl p-5 shadow-xl">
            <BoardMap players={playersArray} currentPlayerIndex={0} />
          </div>

          {/* ── Control Dock ────────────────────────── */}
          <div className="bg-gradient-to-r from-slate-900/80 to-slate-950/80 backdrop-blur-md border border-slate-800/60 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">

            {/* Player info */}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-xl ${player.colorClass}`}>
                {player.name[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white leading-tight">{player.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Space <strong className="text-white">{player.position}</strong> / 20
                </p>
              </div>
            </div>

            {/* Roll Die */}
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

            {/* Dice graphic */}
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-inner relative overflow-hidden">
              <span className={`text-3xl font-black text-white ${isRolling ? 'animate-bounce text-emerald-400' : ''}`}>{diceValue}</span>
              <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-slate-600"></div>
              <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-slate-600"></div>
            </div>
          </div>
        </div>

        {/* ── Sidebar: Score + Stats + Logs ─────────── */}
        <div className="flex flex-col gap-6">

          {/* Score Card */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-3xl p-6 shadow-xl flex flex-col gap-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h2 className="text-md font-bold text-white uppercase tracking-wider">Your Score</h2>
            </div>

            {/* GKP Score */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/15">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-yellow-400" />
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Geographic Knowledge Points</span>
                  <span className="text-3xl font-black text-yellow-400 leading-tight">{player.gkp}</span>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center p-3 rounded-xl bg-slate-800/30 border border-slate-800/60">
                <MapPin className="w-4 h-4 text-cyan-400 mb-1" />
                <span className="text-lg font-black text-white">{player.position}</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Position</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-xl bg-slate-800/30 border border-slate-800/60">
                <Target className="w-4 h-4 text-violet-400 mb-1" />
                <span className="text-lg font-black text-white">{questionsAnswered}</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Questions</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-xl bg-slate-800/30 border border-slate-800/60">
                <TrendingUp className="w-4 h-4 text-emerald-400 mb-1" />
                <span className="text-lg font-black text-white">{accuracy}%</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Accuracy</span>
              </div>
            </div>

            {/* Correct / Incorrect tally */}
            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-2 p-2.5 rounded-lg bg-emerald-950/15 border border-emerald-800/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-emerald-300">{questionsCorrect} Correct</span>
              </div>
              <div className="flex-1 flex items-center gap-2 p-2.5 rounded-lg bg-rose-950/15 border border-rose-800/20">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-xs font-bold text-rose-300">{questionsAnswered - questionsCorrect} Incorrect</span>
              </div>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-3xl p-6 shadow-xl flex flex-col gap-3 min-h-[220px] max-h-[320px]">
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800/80">Activity Log</h2>
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

      {/* ── Card Modal ──────────────────────────── */}
      {showQuestionModal && activeQuestion && (
        <CardModal
          question={activeQuestion}
          player={player}
          onClose={handleModalClose}
          spaceName={activeSpaceName}
        />
      )}

      {/* ── Game Complete Screen ─────────────────── */}
      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg overflow-hidden border border-yellow-500/30 rounded-3xl bg-slate-900 p-8 text-center shadow-2xl animate-scale-in">
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-500/10 p-5 rounded-full border border-yellow-500/20 animate-bounce-slow">
                <Trophy className="w-16 h-16 text-yellow-400" />
              </div>
            </div>

            <span className="text-xs font-black uppercase tracking-widest text-yellow-400">Revision Complete</span>
            <h2 className="text-3xl font-black text-white mt-2 mb-2">Well Done, {player.name}!</h2>
            <p className="text-slate-400 text-sm mb-6">You completed the Kiwi Trail from Cape Reinga to Bluff.</p>

            {/* Final Stats */}
            <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800/80 mb-8 max-w-sm mx-auto">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">Session Results</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <span className="text-3xl font-black text-yellow-400">{player.gkp}</span>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase mt-1">Total GKP</span>
                </div>
                <div>
                  <span className="text-3xl font-black text-emerald-400">{accuracy}%</span>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase mt-1">Accuracy</span>
                </div>
                <div>
                  <span className="text-3xl font-black text-cyan-400">{questionsCorrect}</span>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase mt-1">Correct</span>
                </div>
                <div>
                  <span className="text-3xl font-black text-rose-400">{questionsAnswered - questionsCorrect}</span>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase mt-1">Incorrect</span>
                </div>
              </div>
            </div>

            <button
              onClick={onReset}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-3 px-8 rounded-xl flex items-center justify-center gap-2 mx-auto transition-all duration-300 shadow-xl shadow-emerald-500/15 hover:scale-105 active:scale-95"
            >
              Revise Again <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
