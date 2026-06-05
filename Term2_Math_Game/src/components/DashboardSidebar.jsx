import React from 'react';
import { getMasteryLabel, getMasteryColorClass } from '../utils/gameLogic';

export default function DashboardSidebar({ mastery, currentDifficulty, answeredList, questionBank }) {
  const categories = [
    {
      name: 'Age Problems',
      icon: (
        <svg xmlns="http://www.w3.org/2059/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      color: 'from-amber-500 to-orange-500',
    },
    {
      name: 'Financial & Percentages',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5m-18 4.75h18m-18 4.75h18M9 9h.008v.008H9V9Zm0 4.75h.008v.008H9v-.008Z" />
        </svg>
      ),
      color: 'from-emerald-500 to-teal-500',
    },
    {
      name: 'Systems & Logic',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
      ),
      color: 'from-violet-500 to-indigo-500',
    },
    {
      name: 'Rates & Distribution',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Measurements & Units',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2Z" />
        </svg>
      ),
      color: 'from-purple-500 to-fuchsia-500',
    },
  ];

  return (
    <aside className="w-full lg:w-80 bg-slate-900/40 border-r border-slate-800 p-6 flex flex-col gap-6 select-none shrink-0">
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

      {/* Category Mastery */}
      <div className="flex flex-col gap-4">
        <h3 className="font-outfit font-bold text-sm text-slate-300 uppercase tracking-wider">
          Topic Mastery
        </h3>
        <div className="flex flex-col gap-3">
          {categories.map((category) => {
            const level = mastery[category.name] || 0;
            const label = getMasteryLabel(level);
            const badgeClasses = getMasteryColorClass(level);

            // Filter for question counts in this category
            const catQuestions = questionBank.filter(q => q.category === category.name);
            const catAnswered = catQuestions.filter(q => answeredList.includes(q.id));

            return (
              <div
                key={category.name}
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-800 p-4 rounded-2xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="text-slate-400 group-hover:text-white transition-colors">
                      {category.icon}
                    </div>
                    <span className="font-outfit font-semibold text-slate-200 group-hover:text-white transition-colors text-xs leading-tight">
                      {category.name}
                    </span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 font-mono border rounded-full ${badgeClasses} whitespace-nowrap`}>
                    {label} ({level}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/30 p-0.5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${category.color} transition-all duration-500 ease-out`}
                    style={{ width: `${level}%` }}
                  />
                </div>

                {/* Question count */}
                <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400">
                  <span>Solved: {catAnswered.length} / {catQuestions.length}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {level === 100 ? '⭐ Maxed' : 'Progressing'}
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
            <span>Using a Translation Hint</span>
            <span className="text-rose-400 font-mono">-50% Score</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
