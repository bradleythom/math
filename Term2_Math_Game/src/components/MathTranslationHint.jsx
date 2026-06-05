import React, { useState } from 'react';
import KaTeXRenderer from './KaTeXRenderer';

export default function MathTranslationHint({
  translationGuide = [],
  revealedStepsCount = 0,
  onRevealStep,
  incorrectShown = false
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRequestClick = () => {
    if (revealedStepsCount > 0 || incorrectShown) {
      // If already unlocked, just reveal next step
      onRevealStep();
    } else {
      // If first unlock, show confirmation for the 50% point reduction
      setShowConfirm(true);
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    onRevealStep(); // Unlocks first step & triggers point penalty
  };

  // Determine which steps to show
  const activeRevealedCount = incorrectShown ? translationGuide.length : revealedStepsCount;
  const isUnlocked = activeRevealedCount > 0;
  const allStepsRevealed = activeRevealedCount >= translationGuide.length;

  return (
    <div className="w-full mt-4 flex flex-col items-center">
      {/* Unlock Button / Confirm Block */}
      {!allStepsRevealed && !incorrectShown && (
        <div className="mb-4">
          {!showConfirm ? (
            <button
              onClick={handleRequestClick}
              className="text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer bg-slate-900/40 hover:bg-amber-500/5 border border-slate-800 hover:border-amber-500/30 px-4 py-2 rounded-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-amber-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18Z" />
              </svg>
              {revealedStepsCount === 0 ? 'Translate to Math' : 'Next Translation Step'}
              {revealedStepsCount === 0 && (
                <span className="text-[9px] text-slate-500 font-mono">(costs 50% points)</span>
              )}
            </button>
          ) : (
            <div className="bg-slate-950/80 border border-amber-500/20 rounded-2xl p-4 max-w-sm w-full text-center shadow-lg animate-shake">
              <p className="text-xs text-amber-200 mb-3 font-medium">
                Unlock Translation Guide? This will halve the potential points earned for this question.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleConfirm}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                >
                  Yes, Unlock
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Accordion List */}
      {isUnlocked && (
        <div className="w-full max-w-2xl bg-slate-950/30 border border-slate-800/60 rounded-2xl p-5 shadow-inner transition-all duration-500 animate-glow-slow text-left">
          <div className="flex items-center gap-2 mb-4 text-amber-400/90">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            <h4 className="font-outfit font-bold text-xs uppercase tracking-wider">
              {incorrectShown ? 'Algebraic Solution Blueprint' : 'Math Translation Guide'}
            </h4>
          </div>

          <div className="flex flex-col gap-3">
            {translationGuide.slice(0, activeRevealedCount).map((step, idx) => (
              <div
                key={idx}
                className="flex gap-3 items-start border-l-2 border-amber-500/20 pl-3.5 py-0.5 animate-correct-pulse"
              >
                <span className="font-mono text-xs text-amber-500/50 mt-1 select-none">
                  Step {idx + 1}:
                </span>
                <div className="text-slate-300 text-sm leading-relaxed">
                  <KaTeXRenderer text={step} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
