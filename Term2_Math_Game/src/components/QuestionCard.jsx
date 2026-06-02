import React from 'react';
import MathRenderer from './MathRenderer';

export default function QuestionCard({ question, currentNum, totalQuestions }) {
  if (!question) return null;

  // Set difficulty badge colors
  let diffBadge = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  if (question.difficulty === 'medium') {
    diffBadge = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
  } else if (question.difficulty === 'hard') {
    diffBadge = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
  }

  // Set topic colors
  let topicBadge = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
  if (question.topic === 'Algebra') {
    topicBadge = 'bg-violet-500/10 text-violet-400 border border-violet-500/20';
  } else if (question.topic === 'Measurement') {
    topicBadge = 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
  } else if (question.topic === 'Geometry') {
    topicBadge = 'bg-teal-500/10 text-teal-400 border border-teal-500/20';
  }

  return (
    <div className="w-full flex flex-col gap-6 select-text">
      {/* Badges & Meta info */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <span className={`text-xs px-2.5 py-1 font-outfit font-semibold rounded-lg capitalize ${diffBadge}`}>
            {question.difficulty}
          </span>
          <span className={`text-xs px-2.5 py-1 font-outfit font-semibold rounded-lg ${topicBadge}`}>
            {question.topic}
          </span>
        </div>
        <span className="text-xs font-mono text-slate-500">
          Q{currentNum} / {totalQuestions}
        </span>
      </div>

      {/* Problem Display */}
      <div className="py-6 flex flex-col items-center justify-center min-h-[140px] border-y border-slate-900/60">
        <h2 className="text-sm font-semibold tracking-wide text-slate-400 uppercase mb-4 text-center select-none">
          Solve the problem below
        </h2>
        {/* Render the question prompt with inline KaTeX formulas */}
        <div className="text-white text-lg md:text-xl font-outfit font-medium max-w-full text-center px-4 leading-relaxed">
          <MathRenderer text={question.problem} />
        </div>
      </div>
    </div>
  );
}
