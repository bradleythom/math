import React from 'react';

export default function Header({ score, streak, multiplier, answeredCount, totalQuestions, onReset }) {
  // Determine streak flame color based on multiplier
  let flameColor = 'text-slate-500';
  let multiplierBadge = 'bg-slate-800 text-slate-400 border border-slate-700/50';
  let flameGlow = '';

  if (multiplier === 1.5) {
    flameColor = 'text-amber-500 animate-pulse';
    multiplierBadge = 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
    flameGlow = 'drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]';
  } else if (multiplier === 2.0) {
    flameColor = 'text-fuchsia-500 animate-bounce';
    multiplierBadge = 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/30 font-bold';
    flameGlow = 'drop-shadow-[0_0_12px_rgba(217,70,239,0.8)]';
  } else if (streak > 0) {
    flameColor = 'text-orange-500';
    multiplierBadge = 'bg-orange-500/10 text-orange-400 border border-orange-500/30';
  }

  return (
    <header className="w-full backdrop-blur-md bg-slate-900/80 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-40">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-outfit font-black text-xl text-white shadow-lg shadow-indigo-500/20">
          Σ
        </div>
        <div>
          <h1 className="font-outfit font-bold text-lg leading-tight tracking-wide text-white m-0">
            Form 3 Math Quest
          </h1>
          <p className="text-xs text-slate-400 font-sans">
            Year 9 Curriculum Mastery
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="flex items-center gap-6">
        {/* Progress Bar */}
        <div className="hidden sm:flex flex-col items-end gap-1.5">
          <span className="text-xs text-slate-400">
            Quest Progress: <span className="text-white font-semibold">{answeredCount}/{totalQuestions}</span>
          </span>
          <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/30">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Score */}
        <div className="bg-slate-950/50 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
          <div className="text-xs text-slate-400">SCORE</div>
          <div className="font-outfit font-extrabold text-2xl text-emerald-400 tracking-tight drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
            {score}
          </div>
        </div>

        {/* Streak */}
        <div className="bg-slate-950/50 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            {/* SVG Flame */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-6 h-6 transition-all duration-300 ${flameColor} ${flameGlow}`}
            >
              <path
                fillRule="evenodd"
                d="M12.96 5.96a.75.75 0 0 1 1.06-.02c.98.96 1.6 2.27 1.6 3.72a3 3 0 1 1-6 0c0-1.45.62-2.76 1.6-3.72a.75.75 0 0 1 1.06.02.75.75 0 0 0 1.06.02Z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M12.384 2.25c.16-.015.32-.022.48-.022a.75.75 0 0 1 .75.75c0 1.959-.37 3.738-1 5.25a6.003 6.003 0 0 0-5.83 5.92c0 3.3 2.7 6 6 6s6-2.7 6-6c0-2.483-1.513-4.612-3.666-5.503a.75.75 0 0 1-.413-1.026c.712-1.503 1.079-3.23 1.079-5.141a.75.75 0 0 1 .75-.75c.16 0 .32.007.48.022 3.847.37 6.854 3.633 6.854 7.578 0 4.28-3.47 7.75-7.75 7.75s-7.75-3.47-7.75-7.75c0-3.945 3.007-7.208 6.854-7.578Z"
                clipRule="evenodd"
              />
            </svg>
            {streak > 0 && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${multiplier === 2 ? 'bg-fuchsia-400' : 'bg-orange-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${multiplier === 2 ? 'bg-fuchsia-500' : 'bg-orange-500'}`}></span>
              </span>
            )}
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] text-slate-400 tracking-wider">STREAK</span>
            <span className="font-outfit font-extrabold text-lg text-white">
              {streak}
            </span>
          </div>
          <div className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${multiplierBadge}`}>
            {multiplier}x
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer"
          title="Reset Game Progress"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
