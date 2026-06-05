import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, ArrowRight, Compass, ShieldQuestion } from 'lucide-react';

export default function CardModal({ question, player, onAnswerSubmit, spaceName }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!question) return null;

  const handleOptionClick = (option) => {
    if (isAnswered) return;
    
    setSelectedOption(option);
    const correct = option === question.correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);
    
    // Notify parent of the outcome to add points (GKPs)
    onAnswerSubmit(correct, correct ? question.pointsValue : 0);
  };

  const getCategoryDetails = (category) => {
    switch (category) {
      case 'LEES_PUSH_PULL':
        return {
          title: "Migration & Human Geography",
          icon: <Compass className="w-5 h-5 text-cyan-400" />,
          badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
        };
      case 'TECTONIC_RING_OF_FIRE':
        return {
          title: "Physical Processes & Relief",
          icon: <ShieldQuestion className="w-5 h-5 text-orange-400" />,
          badgeClass: "bg-orange-500/20 text-orange-300 border-orange-500/30"
        };
      case 'TRUE_OR_FALSE':
        return {
          title: "Quick-Fire Facts (T/F)",
          icon: <Award className="w-5 h-5 text-emerald-400" />,
          badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
        };
      default:
        return {
          title: "Geography Challenge",
          icon: <HelpCircle className="w-5 h-5 text-slate-400" />,
          badgeClass: "bg-slate-500/20 text-slate-300 border-slate-500/30"
        };
    }
  };

  const { title, icon, badgeClass } = getCategoryDetails(question.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl overflow-hidden border rounded-2xl glass-panel shadow-2xl animate-scale-in border-slate-700/50">
        
        {/* Modal Top Ribbon (Player Identity & Space Info) */}
        <div className={`px-6 py-3 border-b border-slate-700/50 flex justify-between items-center ${player.colorClass.split(' ')[0]}`}>
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

        {/* Challenge Content */}
        <div className="p-6">
          {/* Card Header (Category, Points) */}
          <div className="flex justify-between items-center mb-4">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${badgeClass}`}>
              {icon}
              {title}
            </div>
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
              Reward: <span className="text-yellow-400 font-extrabold flex items-center gap-0.5"><Award className="w-3.5 h-3.5" />{question.pointsValue} GKP</span>
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-lg md:text-xl font-bold text-white mb-6 leading-snug">
            {question.question}
          </h2>

          {/* Multiple-choice Options */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            {question.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrectOption = option === question.correctAnswer;

              let buttonStyle = 'border-slate-700 bg-slate-800/40 text-slate-200 hover:bg-slate-700/30 hover:border-slate-500';
              let statusIcon = null;

              if (isAnswered) {
                if (isCorrectOption) {
                  // Highlight correct option in green
                  buttonStyle = 'border-emerald-500 bg-emerald-950/20 text-emerald-300 ring-1 ring-emerald-500';
                  statusIcon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
                } else if (isSelected && !isCorrect) {
                  // Highlight chosen incorrect option in red
                  buttonStyle = 'border-rose-500 bg-rose-950/20 text-rose-300 ring-1 ring-rose-500';
                  statusIcon = <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
                } else {
                  // Dull other options
                  buttonStyle = 'border-slate-800 bg-slate-900/20 text-slate-500 opacity-50 cursor-not-allowed';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  disabled={isAnswered}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-left font-medium text-sm transition-all duration-200 ${buttonStyle}`}
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

          {/* Trivia explanation section (Reveals after answering) */}
          {isAnswered && (
            <div className="border-t border-slate-800 pt-5 mt-5 animate-slide-up">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded-md ${
                    isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {isCorrect ? 'Correct! + ' + question.pointsValue + ' GKP' : 'Incorrect (+ 0 GKP)'}
                  </span>
                </div>
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">Curriculum Answer Key</h4>
                <p className="text-sm text-slate-300 leading-relaxed font-semibold">
                  Correct Answer: <span className="text-emerald-400">{question.correctAnswer}</span>
                </p>
              </div>

              {/* Action Button to close card and conclude turn */}
              <button
                onClick={() => onAnswerSubmit(isCorrect, isCorrect ? question.pointsValue : 0, true)} // 3rd arg triggers next steps
                className="w-full mt-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95"
              >
                Confirm & Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
