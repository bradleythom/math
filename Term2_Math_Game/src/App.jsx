import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardSidebar from './components/DashboardSidebar';
import WordProblemText from './components/WordProblemText';
import MathTranslationHint from './components/MathTranslationHint';
import InputForm from './components/InputForm';
import KaTeXRenderer from './components/KaTeXRenderer';
import { wordProblems } from './data/wordProblems';
import {
  calculatePoints,
  getNextQuestion,
  updateMastery,
  getMasteryLabel,
  getMasteryColorClass
} from './utils/gameLogic';
import { validateWordProblemAnswer } from './utils/wordProblemValidator';

export default function App() {
  // Game state hooks
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [answeredIds, setAnsweredIds] = useState([]);
  const [currentDifficulty, setCurrentDifficulty] = useState('easy');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  
  // Hint states
  const [revealedStepsCount, setRevealedStepsCount] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);

  // Form states
  const [inputValue, setInputValue] = useState('');
  const [feedbackState, setFeedbackState] = useState('idle'); // 'idle' | 'correct' | 'incorrect'
  const [animationClass, setAnimationClass] = useState('');
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Performance logs
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalIncorrect, setTotalIncorrect] = useState(0);
  const [totalHintsUnlocked, setTotalHintsUnlocked] = useState(0);

  // Difficulty adjustment trackers
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveIncorrect, setConsecutiveIncorrect] = useState(0);

  // Category masteries (starts at 0%)
  const [mastery, setMastery] = useState({
    'Age Problems': 0,
    'Financial & Percentages': 0,
    'Systems & Logic': 0,
    'Rates & Distribution': 0,
    'Measurements & Units': 0
  });

  // Pull first question on load
  useEffect(() => {
    const firstQ = getNextQuestion([], 'easy', wordProblems);
    setCurrentQuestion(firstQ);
  }, []);

  // Update max streak
  useEffect(() => {
    if (streak > maxStreak) {
      setMaxStreak(streak);
    }
  }, [streak, maxStreak]);

  const handleReset = () => {
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setAnsweredIds([]);
    setCurrentDifficulty('easy');
    setRevealedStepsCount(0);
    setHintUsed(false);
    setInputValue('');
    setFeedbackState('idle');
    setAnimationClass('');
    setEarnedPoints(0);
    setGameCompleted(false);
    setTotalCorrect(0);
    setTotalIncorrect(0);
    setTotalHintsUnlocked(0);
    setConsecutiveCorrect(0);
    setConsecutiveIncorrect(0);
    setMastery({
      'Age Problems': 0,
      'Financial & Percentages': 0,
      'Systems & Logic': 0,
      'Rates & Distribution': 0,
      'Measurements & Units': 0
    });

    const firstQ = getNextQuestion([], 'easy', wordProblems);
    setCurrentQuestion(firstQ);
  };

  const handleRevealStep = () => {
    if (!currentQuestion) return;
    setHintUsed(true);
    setRevealedStepsCount((prev) => {
      const nextCount = prev + 1;
      if (nextCount > currentQuestion.translationGuide.length) {
        return currentQuestion.translationGuide.length;
      }
      return nextCount;
    });
    setTotalHintsUnlocked((prev) => prev + 1);
  };

  const getMultiplier = () => {
    if (streak >= 5) return 2.0;
    if (streak >= 3) return 1.5;
    return 1.0;
  };

  const handleSubmit = () => {
    if (!inputValue.trim() || feedbackState !== 'idle' || !currentQuestion) return;

    const isCorrect = validateWordProblemAnswer(inputValue, currentQuestion.answer);
    let pointsAwarded = 0;

    // Update mastery for the category
    setMastery((prevMastery) => {
      const currentVal = prevMastery[currentQuestion.category] || 0;
      return {
        ...prevMastery,
        [currentQuestion.category]: updateMastery(currentVal, isCorrect)
      };
    });

    if (isCorrect) {
      setTotalCorrect((prev) => prev + 1);
      
      // Calculate points (using a hint halves final points)
      // Consecutive correct answers WITHOUT hints builds a multiplier
      let nextStreak = streak;
      if (!hintUsed) {
        nextStreak = streak + 1;
        setStreak(nextStreak);
      } else {
        setStreak(0); // broken streak since hint was used
      }

      pointsAwarded = calculatePoints(currentQuestion.difficulty, nextStreak, hintUsed);
      setScore((prevScore) => prevScore + pointsAwarded);
      setEarnedPoints(pointsAwarded);
      setFeedbackState('correct');
      setAnimationClass('animate-correct-pulse');

      // Adaptive level up trackers
      const nextConsecutiveCorrect = consecutiveCorrect + 1;
      setConsecutiveCorrect(nextConsecutiveCorrect);
      setConsecutiveIncorrect(0);

      if (nextConsecutiveCorrect >= 2) {
        if (currentDifficulty === 'easy') {
          setCurrentDifficulty('medium');
        } else if (currentDifficulty === 'medium') {
          setCurrentDifficulty('hard');
        }
        setConsecutiveCorrect(0);
      }
    } else {
      setTotalIncorrect((prev) => prev + 1);
      setStreak(0); // Break streak
      setFeedbackState('incorrect');
      setAnimationClass('animate-shake');

      // Adaptive level down trackers
      const nextConsecutiveIncorrect = consecutiveIncorrect + 1;
      setConsecutiveIncorrect(nextConsecutiveIncorrect);
      setConsecutiveCorrect(0);

      if (nextConsecutiveIncorrect >= 2) {
        if (currentDifficulty === 'hard') {
          setCurrentDifficulty('medium');
        } else if (currentDifficulty === 'medium') {
          setCurrentDifficulty('easy');
        }
        setConsecutiveIncorrect(0);
      }
    }
  };

  const handleContinue = () => {
    if (!currentQuestion) return;

    const updatedAnsweredIds = [...answeredIds, currentQuestion.id];
    setAnsweredIds(updatedAnsweredIds);

    const nextQ = getNextQuestion(updatedAnsweredIds, currentDifficulty, wordProblems);

    if (nextQ === null) {
      setGameCompleted(true);
    } else {
      setCurrentQuestion(nextQ);
      setRevealedStepsCount(0);
      setHintUsed(false);
      setInputValue('');
      setFeedbackState('idle');
      setEarnedPoints(0);
      setAnimationClass('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header component */}
      <Header
        score={score}
        streak={streak}
        multiplier={getMultiplier()}
        answeredCount={answeredIds.length}
        totalQuestions={wordProblems.length}
        onReset={handleReset}
      />

      {/* Main Layout */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        {/* Left Dashboard Sidebar */}
        <DashboardSidebar
          mastery={mastery}
          currentDifficulty={currentDifficulty}
          answeredList={answeredIds}
          questionBank={wordProblems}
        />

        {/* Central Problem Panel */}
        <main className="flex-1 p-6 md:p-8 flex items-center justify-center">
          {!gameCompleted ? (
            /* Word Problem Active Board */
            <div
              className={`w-full max-w-3xl bg-slate-900/20 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl flex flex-col gap-6 transition-all duration-300 ${animationClass}`}
              onAnimationEnd={() => setAnimationClass('')}
            >
              {/* Question badges */}
              <div className="flex items-center justify-between border-b border-slate-900/60 pb-3">
                <div className="flex gap-2">
                  <span className={`text-xs px-2.5 py-1 font-outfit font-semibold rounded-lg capitalize ${
                    currentQuestion.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    currentQuestion.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                  <span className="text-xs px-2.5 py-1 font-outfit font-semibold rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {currentQuestion.category}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  Q{answeredIds.length + 1} / {wordProblems.length}
                </span>
              </div>

              {/* Text Container */}
              <WordProblemText text={currentQuestion.text} />

              {/* Input or Feedback form */}
              <div className="flex flex-col gap-4 border-t border-slate-900/60 pt-4">
                {feedbackState === 'idle' ? (
                  <>
                    <InputForm
                      value={inputValue}
                      onChange={setInputValue}
                      onSubmit={handleSubmit}
                      disabled={false}
                    />

                    <MathTranslationHint
                      translationGuide={currentQuestion.translationGuide}
                      revealedStepsCount={revealedStepsCount}
                      onRevealStep={handleRevealStep}
                      incorrectShown={false}
                    />
                  </>
                ) : (
                  /* Feedback Report */
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
                            <p className="text-xs text-slate-300">Formulated and solved correctly.</p>
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
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Expected Answer:</span>
                          <div className="text-sm text-white font-mono bg-slate-950/50 p-2.5 rounded-xl inline-block border border-slate-900">
                            <KaTeXRenderer text={'\\(' + currentQuestion.answer + '\\)'} />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Show full translation guide in both feedback states (always unlocked if incorrect) */}
                    <MathTranslationHint
                      translationGuide={currentQuestion.translationGuide}
                      revealedStepsCount={revealedStepsCount}
                      onRevealStep={handleRevealStep}
                      incorrectShown={feedbackState === 'incorrect'}
                    />

                    {/* Next step controller */}
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleContinue}
                        className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/50 text-white font-outfit font-semibold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        Next Word Problem
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* quest complete summary panel */
            <div className="w-full max-w-2xl bg-slate-900/20 border border-amber-500/20 rounded-3xl p-8 backdrop-blur-md shadow-2xl flex flex-col items-center gap-6 text-center animate-correct-pulse">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 mb-2 relative">
                <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-orange-450 opacity-20"></span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-amber-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-6.75a1.125 1.125 0 0 1-1.125-1.125V18.75m9 0V21m-9-2.25V21m9 0H4.5" />
                </svg>
              </div>

              <div>
                <h2 className="font-outfit font-black text-3xl tracking-tight text-white m-0">
                  Algebra Mastered!
                </h2>
                <p className="text-slate-400 mt-2 text-sm">
                  You have successfully translated and solved all 15 word problems.
                </p>
              </div>

              {/* Stats Panel */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-4">
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex flex-col items-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Final Score</span>
                  <span className="font-outfit font-black text-2xl text-emerald-400 mt-1">{score}</span>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex flex-col items-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Accuracy</span>
                  <span className="font-outfit font-black text-2xl text-indigo-400 mt-1">
                    {totalCorrect + totalIncorrect > 0
                      ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex flex-col items-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Max Streak</span>
                  <span className="font-outfit font-black text-2xl text-amber-400 mt-1">🔥 {maxStreak}</span>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex flex-col items-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Hints Opened</span>
                  <span className="font-outfit font-black text-2xl text-slate-300 mt-1">💡 {totalHintsUnlocked}</span>
                </div>
              </div>

              {/* Detailed Mastery Summary */}
              <div className="w-full text-left bg-slate-950/40 border border-slate-850 p-5 rounded-2xl">
                <h4 className="font-outfit font-bold text-xs text-slate-300 uppercase tracking-wider mb-3">
                  Topic Graduation Status
                </h4>
                <div className="space-y-3.5">
                  {Object.keys(mastery).map((topic) => {
                    const level = mastery[topic] || 0;
                    const label = getMasteryLabel(level);
                    const colorClass = getMasteryColorClass(level);
                    return (
                      <div key={topic} className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-350">{topic}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500" style={{ width: `${level}%` }} />
                          </div>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono border ${colorClass}`}>
                            {label} ({level}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleReset}
                className="mt-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-outfit font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 cursor-pointer"
              >
                Restart Word Quest
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
