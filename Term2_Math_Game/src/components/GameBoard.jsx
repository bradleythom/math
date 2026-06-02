import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import AnswerInput from './AnswerInput';
import HintOverlay from './HintOverlay';
import MathRenderer from './MathRenderer';

export default function GameBoard({
  question,
  currentNum,
  totalQuestions,
  onSubmitAnswer,
  onSkipQuestion,
  hintUsed,
  onUnlockHint
}) {
  const [inputValue, setInputValue] = useState('');
  const [animationClass, setAnimationClass] = useState('');
  const [feedbackState, setFeedbackState] = useState('idle'); // 'idle' | 'correct' | 'incorrect'
  const [earnedPoints, setEarnedPoints] = useState(0);

  // Reset local card states when question changes
  useEffect(() => {
    setInputValue('');
    setAnimationClass('');
    setFeedbackState('idle');
    setEarnedPoints(0);
  }, [question]);

  const handleSubmit = () => {
    if (!inputValue.trim() || feedbackState !== 'idle') return;

    const result = onSubmitAnswer(inputValue);
    
    if (result.isCorrect) {
      setFeedbackState('correct');
      setEarnedPoints(result.pointsAwarded);
      setAnimationClass('animate-correct-pulse');
    } else {
      setFeedbackState('incorrect');
      setAnimationClass('animate-shake');
    }
  };

  const handleNext = () => {
    onSkipQuestion(); // Proceed to next question in parent state
  };

  // Remove animation class after animation completes so it can be re-triggered
  const handleAnimationEnd = () => {
    setAnimationClass('');
  };

  if (!question) {
    return (
      <div className="w-full flex items-center justify-center p-8 bg-slate-900/10 border border-slate-800 rounded-3xl backdrop-blur-md">
        <p className="text-slate-400 font-medium">Loading next question...</p>
      </div>
    );
  }

  return (
    <div
      className={`w-full max-w-2xl bg-slate-900/20 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl flex flex-col gap-6 transition-all duration-300 ${animationClass}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Active Question Details */}
      <QuestionCard
        question={question}
        currentNum={currentNum}
        totalQuestions={totalQuestions}
      />

      {/* Answer Form & Feedback Area */}
      <div className="flex flex-col gap-4">
        {feedbackState === 'idle' ? (
          <>
            <AnswerInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSubmit}
              disabled={false}
              placeholder="Type your math answer..."
            />

            <HintOverlay
              hint={question.hint}
              hintUsed={hintUsed}
              onRequestHint={onUnlockHint}
              incorrectShown={false}
            />
          </>
        ) : (
          /* Submission Feedback Mode */
          <div className="flex flex-col gap-5">
            {feedbackState === 'correct' ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-outfit font-bold text-emerald-400 text-sm">Correct Answer!</h3>
                    <p className="text-xs text-slate-300">Superb calculation.</p>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Points Earned</span>
                  <span className="font-outfit font-extrabold text-2xl text-emerald-400">+{earnedPoints}</span>
                </div>
              </div>
            ) : (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-outfit font-bold text-rose-400 text-sm">Incorrect Answer</h3>
                    <p className="text-xs text-slate-300">
                      Your answer: <code className="text-rose-300 font-mono">{inputValue}</code>
                    </p>
                  </div>
                </div>

                <div className="border-t border-rose-500/10 pt-3 flex flex-col gap-1.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Correct solution:</span>
                  <div className="text-sm text-white font-mono bg-slate-950/50 p-2 rounded-xl inline-block border border-slate-900">
                    <MathRenderer text={'\\(' + question.answer + '\\)'} />
                  </div>
                </div>
              </div>
            )}

            {/* In both feedback states, show the step-by-step hint study guide (always shown if incorrect) */}
            <HintOverlay
              hint={question.hint}
              hintUsed={hintUsed}
              onRequestHint={onUnlockHint}
              incorrectShown={feedbackState === 'incorrect'}
            />

            {/* Action buttons to proceed */}
            <div className="flex justify-end mt-2">
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/50 text-white font-outfit font-semibold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                Continue Quest
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
