import React from 'react';
import { getMasteryLabel, getMasteryColorClass } from '../utils/gameLogic';

export default function Sidebar({ mastery, currentDifficulty, answeredList, questionBank }) {
  const topics = [
    {
      name: 'Number',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
        </svg>
      ),
      color: 'from-blue-500 to-indigo-500',
    },
    {
      name: 'Algebra',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.75 12h14.5M12 4.75v14.5" />
        </svg>
      ),
      color: 'from-violet-500 to-fuchsia-500',
    },
    {
      name: 'Measurement',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18h4.5a3.75 3.75 0 1 1 0 7.5H12m0-7.5H7.5a3.75 3.75 0 1 0 0 7.5H12m0 0v8.25m-4.5-4.5h9" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Geometry',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5 12 3 3 7.5M12 3v18M3 7.5v9l9 4.5m9-13.5v9l-9 4.5" />
        </svg>
      ),
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <aside className="w-full lg:w-80 bg-slate-900/40 border-r border-slate-800 p-6 flex flex-col gap-6 select-none">
      {/* Current Difficulty Status Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 p-5 border border-slate-800">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl" />
        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
          System Level
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="font-outfit font-black text-2xl tracking-wide text-white capitalize">
            {currentDifficulty} Mode
          </div>
          {/* Pulsing indicator */}
          <span className="flex h-3 w-3 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              currentDifficulty === 'easy' ? 'bg-emerald-400' :
              currentDifficulty === 'medium' ? 'bg-amber-400' : 'bg-rose-400'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${
              currentDifficulty === 'easy' ? 'bg-emerald-500' :
              currentDifficulty === 'medium' ? 'bg-amber-500' : 'bg-rose-500'
            }`}></span>
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
          Solve 2 in a row to level up. Miss 2 in a row to level down.
        </p>
      </div>

      {/* Mastery Levels */}
      <div className="flex flex-col gap-4">
        <h3 className="font-outfit font-bold text-sm text-slate-300 uppercase tracking-wider">
          Topic Mastery
        </h3>
        <div className="flex flex-col gap-3">
          {topics.map((topic) => {
            const level = mastery[topic.name] || 0;
            const label = getMasteryLabel(level);
            const badgeClasses = getMasteryColorClass(level);

            // Filter for question counts in this topic
            const topicQuestions = questionBank.filter(q => q.topic === topic.name);
            const topicAnswered = topicQuestions.filter(q => answeredList.includes(q.id));

            return (
              <div
                key={topic.name}
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-800 p-4 rounded-2xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="text-slate-400 group-hover:text-white transition-colors">
                      {topic.icon}
                    </div>
                    <span className="font-outfit font-semibold text-slate-200 group-hover:text-white transition-colors">
                      {topic.name}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 font-mono border rounded-full ${badgeClasses}`}>
                    {label} ({level}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850 p-0.5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${topic.color} transition-all duration-500 ease-out`}
                    style={{ width: `${level}%` }}
                  />
                </div>

                {/* Question count */}
                <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400">
                  <span>Solved: {topicAnswered.length} / {topicQuestions.length}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {level === 100 ? '⭐ Completed' : 'In Progress'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules Guide / Legend */}
      <div className="mt-auto rounded-2xl bg-slate-950/40 border border-slate-800/60 p-4">
        <h4 className="text-xs font-semibold text-slate-300 mb-2">SCORING RULES</h4>
        <div className="space-y-1.5 text-[10px] text-slate-400">
          <div className="flex justify-between">
            <span>Easy / Medium / Hard</span>
            <span className="text-white font-mono">10 / 20 / 30 pts</span>
          </div>
          <div className="flex justify-between">
            <span>Streak (3-4 / 5+)</span>
            <span className="text-amber-400 font-mono">1.5x / 2.0x</span>
          </div>
          <div className="flex justify-between">
            <span>Using a Hint</span>
            <span className="text-rose-400 font-mono">-50% Score</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
