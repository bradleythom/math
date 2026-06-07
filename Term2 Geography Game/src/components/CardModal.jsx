import React, { useState, useCallback } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, ArrowRight, Compass, ShieldQuestion, BookOpen } from 'lucide-react';

// ── Web Audio API helper: short UI alert tones ─────
const playTone = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      // Pleasant ascending two-note chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523, ctx.currentTime);        // C5
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.12); // E5
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.24); // G5
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } else {
      // Low, subdued buzz
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.setValueAtTime(140, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch {
    // Audio unavailable – silent fallback
  }
};

export default function CardModal({ question, player, onClose, spaceName }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [flashClass, setFlashClass] = useState('');

  if (!question) return null;

  const handleOptionClick = (option) => {
    if (isAnswered) return;

    const correct = option === question.correctAnswer;
    setSelectedOption(option);
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      playTone('correct');
      setFlashClass('animate-flash-green');

      // Auto-close after a brief pause so the player sees the green flash
      setTimeout(() => {
        onClose({ correct: true, points: question.pointsValue });
      }, 1200);
    } else {
      playTone('incorrect');
      setFlashClass('animate-flash-red');
      // Do NOT auto-close — player must read the reinforcement and dismiss manually
    }
  };

  // Manual dismiss for incorrect answers
  const handleDismiss = () => {
    onClose({ correct: false, points: 0 });
  };

  const title = question.topic || "Geography Challenge";
  const icon = <BookOpen className="w-5 h-5 text-violet-400" />;
  const badgeClass = "bg-violet-500/20 text-violet-300 border-violet-500/30";

  return (
    /* ── Expansive frosted backdrop ──────────────────── */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
         style={{
           backgroundColor: 'rgba(2, 6, 23, 0.75)',
           backdropFilter: 'blur(18px) saturate(1.4)',
           WebkitBackdropFilter: 'blur(18px) saturate(1.4)'
         }}
    >
      <div className={`w-full max-w-xl overflow-hidden border rounded-2xl shadow-2xl animate-scale-in border-slate-700/50 ${flashClass}`}
           style={{
             background: 'rgba(15, 23, 42, 0.82)',
             backdropFilter: 'blur(24px)',
             WebkitBackdropFilter: 'blur(24px)'
           }}
      >

        {/* ── Top Ribbon ──────────────────────────────── */}
        <div className={`px-6 py-3 border-b border-slate-700/40 flex justify-between items-center ${player.colorClass.split(' ')[0]}`}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
            <span className="text-xs font-black uppercase tracking-wider text-white">
              {player.name}'s Challenge
            </span>
          </div>
          <span className="text-xs font-semibold text-white/80">
            Landed on: <strong className="text-white">{spaceName}</strong>
          </span>
        </div>

        {/* ── Challenge Content ────────────────────────── */}
        <div className="p-6">
          {/* Category & Points Header */}
          <div className="flex justify-between items-center mb-4">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${badgeClass}`}>
              {icon}
              {title}
            </div>
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
              Reward: <span className="text-yellow-400 font-extrabold flex items-center gap-0.5">
                <Award className="w-3.5 h-3.5" />{question.pointsValue} GKP
              </span>
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-lg md:text-xl font-bold text-white mb-6 leading-snug">
            {question.question}
          </h2>

          {/* ── Multiple-choice Option Buttons ───────── */}
          <div className="grid grid-cols-1 gap-3 mb-4">
            {question.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrectOption = option === question.correctAnswer;

              let btnClass = 'border-slate-700 bg-slate-800/40 text-slate-200 hover:bg-slate-700/30 hover:border-slate-500 cursor-pointer';
              let statusIcon = null;

              if (isAnswered) {
                if (isCorrectOption) {
                  btnClass = 'border-emerald-500 bg-emerald-950/25 text-emerald-300 ring-1 ring-emerald-500/60';
                  statusIcon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
                } else if (isSelected && !isCorrect) {
                  btnClass = 'border-rose-500 bg-rose-950/25 text-rose-300 ring-1 ring-rose-500/60';
                  statusIcon = <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
                } else {
                  btnClass = 'border-slate-800 bg-slate-900/20 text-slate-500 opacity-40 cursor-not-allowed';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  disabled={isAnswered}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-left font-medium text-sm transition-all duration-200 ${btnClass}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800/60 border border-slate-700/80 flex items-center justify-center text-xs font-semibold text-slate-400">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </span>
                  {statusIcon}
                </button>
              );
            })}
          </div>

          {/* ── Post-answer: Correct (brief flash then auto-closes) ── */}
          {isAnswered && isCorrect && (
            <div className="border-t border-emerald-800/40 pt-4 mt-3 animate-slide-up">
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-extrabold uppercase text-emerald-300">Correct! +{question.pointsValue} GKP</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Closing automatically…</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Post-answer: Incorrect → educational reinforcement ── */}
          {isAnswered && !isCorrect && (
            <div className="border-t border-rose-800/40 pt-4 mt-3 animate-slide-up">
              <div className="p-5 rounded-xl bg-slate-900 border-2 border-rose-500/40 shadow-inner">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-black uppercase px-2.5 py-1 rounded-md bg-rose-500 text-white shadow-lg shadow-rose-500/30">
                    Incorrect (+0 GKP)
                  </span>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                  <div className="flex items-start gap-3 relative z-10">
                    <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30 shrink-0">
                      <BookOpen className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-1.5">
                        Textbook Explanation
                      </h4>
                      <p className="text-base text-white leading-relaxed font-medium">
                        {question.correctAnswer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Manual dismiss button */}
              <button
                onClick={handleDismiss}
                className="w-full mt-4 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-bold text-sm py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 active:scale-95"
              >
                Close & Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
