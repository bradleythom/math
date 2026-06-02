import React, { useState } from 'react';
import MathRenderer from './MathRenderer';

export default function HintOverlay({ hint, hintUsed, onRequestHint, incorrectShown }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRequestClick = () => {
    if (hintUsed || incorrectShown) return;
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    onRequestHint();
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  // If the hint has been unlocked (either requested or automatically shown due to incorrect answer)
  const isUnlocked = hintUsed || incorrectShown;

  return (
    <div className="w-full mt-4">
      {!isUnlocked ? (
        <div className="flex flex-col items-center">
          {!showConfirm ? (
            <button
              onClick={handleRequestClick}
              className="text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer bg-slate-900/40 hover:bg-indigo-500/5 border border-slate-800 hover:border-indigo-500/30 px-4 py-2 rounded-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-indigo-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
              Request Hint
              <span className="text-[9px] text-slate-500 font-mono">(costs 50% points)</span>
            </button>
          ) : (
            <div className="bg-slate-950/80 border border-amber-500/20 rounded-2xl p-4 max-w-sm w-full text-center shadow-lg animate-shake">
              <p className="text-xs text-amber-200 mb-3 font-medium">
                Unlock hint? This will halve the points earned for this question.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleConfirm}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                >
                  Yes, Unlock
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 shadow-inner transition-all duration-500 animate-glow-slow">
          <div className="flex items-center gap-2 mb-3 text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18Z" />
              </svg>
              <h4 className="font-outfit font-bold text-xs uppercase tracking-wider">
                {incorrectShown ? 'Solution Study Guide' : 'Tutoring Hint'}
              </h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              <MathRenderer text={hint} />
            </p>
        </div>
      )}
    </div>
  );
}
