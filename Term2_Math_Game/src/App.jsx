import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GameBoard from './components/GameBoard';
import MathRenderer from './components/MathRenderer';
import { questionBank } from './data/questionBank';
import {
  calculatePoints,
  getNextQuestion,
  updateMastery,
  getMasteryLabel,
  getMasteryColorClass
} from './utils/gameLogic';
import { validateAnswer } from './utils/mathValidator';

export default function App() {
  // Game states
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [answeredIds, setAnsweredIds] = useState([]);
  const [currentDifficulty, setCurrentDifficulty] = useState('easy');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Statistics states
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalIncorrect, setTotalIncorrect] = useState(0);
  const [totalHintsUnlocked, setTotalHintsUnlocked] = useState(0);

  // Difficulty progression trackers
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveIncorrect, setConsecutiveIncorrect] = useState(0);

  // Topic mastery stats (starts at 0% for each)
  const [mastery, setMastery] = useState({
    Number: 0,
    Algebra: 0,
    Measurement: 0,
    Geometry: 0
  });

  // Choose the initial question on mount
  useEffect(() => {
    const firstQ = getNextQuestion([], 'easy', questionBank);
    setCurrentQuestion(firstQ);
  }, []);

  // Sync max streak
  useEffect(() => {
    if (streak > maxStreak) {
      setMaxStreak(streak);
    }
  }, [streak, maxStreak]);

  // Handle game reset
  const handleReset = () => {
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setAnsweredIds([]);
    setCurrentDifficulty('easy');
    setHintUsed(false);
    setGameCompleted(false);
    setTotalCorrect(0);
    setTotalIncorrect(0);
    setTotalHintsUnlocked(0);
    setConsecutiveCorrect(0);
    setConsecutiveIncorrect(0);
    setMastery({
      Number: 0,
      Algebra: 0,
      Measurement: 0,
      Geometry: 0
    });

    const firstQ = getNextQuestion([], 'easy', questionBank);
    setCurrentQuestion(firstQ);
  };

  // Unlocks the hint for the current question
  const handleUnlockHint = () => {
    setHintUsed(true);
    setTotalHintsUnlocked((prev) => prev + 1);
  };

  // Calculates current streak multiplier
  const getMultiplier = () => {
    if (streak >= 5) return 2.0;
    if (streak >= 3) return 1.5;
    return 1.0;
  };

  // Submission handler
  const handleSubmitAnswer = (userAnswer) => {
    if (!currentQuestion) return { isCorrect: false, pointsAwarded: 0 };

    const isCorrect = validateAnswer(userAnswer, currentQuestion.answer, currentQuestion.id);
    let pointsAwarded = 0;

    // Update mastery for the topic
    setMastery((prevMastery) => {
      const currentVal = prevMastery[currentQuestion.topic] || 0;
      return {
        ...prevMastery,
        [currentQuestion.topic]: updateMastery(currentVal, isCorrect)
      };
    });

    if (isCorrect) {
      setTotalCorrect((prev) => prev + 1);
      
      // Calculate streak points
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      
      const multiplier = nextStreak >= 5 ? 2.0 : nextStreak >= 3 ? 1.5 : 1.0;
      pointsAwarded = calculatePoints(currentQuestion.difficulty, nextStreak, hintUsed);
      setScore((prevScore) => prevScore + pointsAwarded);

      // Level up trackers
      const nextConsecutiveCorrect = consecutiveCorrect + 1;
      setConsecutiveCorrect(nextConsecutiveCorrect);
      setConsecutiveIncorrect(0); // Reset incorrect streak

      // Check if we should upgrade difficulty
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

      // Level down trackers
      const nextConsecutiveIncorrect = consecutiveIncorrect + 1;
      setConsecutiveIncorrect(nextConsecutiveIncorrect);
      setConsecutiveCorrect(0); // Reset correct streak

      // Check if we should downgrade difficulty
      if (nextConsecutiveIncorrect >= 2) {
        if (currentDifficulty === 'hard') {
          setCurrentDifficulty('medium');
        } else if (currentDifficulty === 'medium') {
          setCurrentDifficulty('easy');
        }
        setConsecutiveIncorrect(0);
      }
    }

    return { isCorrect, pointsAwarded };
  };

  // Continue to next question
  const handleContinue = () => {
    if (!currentQuestion) return;

    // Add current question to answered set
    const updatedAnsweredIds = [...answeredIds, currentQuestion.id];
    setAnsweredIds(updatedAnsweredIds);

    // Fetch next adaptive question
    const nextQ = getNextQuestion(updatedAnsweredIds, currentDifficulty, questionBank);

    if (nextQ === null) {
      setGameCompleted(true);
    } else {
      setCurrentQuestion(nextQ);
      setHintUsed(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans relative overflow-hidden">
      {/* Background glowing shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header component */}
      <Header
        score={score}
        streak={streak}
        multiplier={getMultiplier()}
        answeredCount={answeredIds.length}
        totalQuestions={questionBank.length}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        {/* Left Sidebar */}
        <Sidebar
          mastery={mastery}
          currentDifficulty={currentDifficulty}
          answeredList={answeredIds}
          questionBank={questionBank}
        />

        {/* Dashboard Center */}
        <main className="flex-1 p-6 md:p-8 flex items-center justify-center">
          {!gameCompleted ? (
            <GameBoard
              question={currentQuestion}
              currentNum={answeredIds.length + 1}
              totalQuestions={questionBank.length}
              onSubmitAnswer={handleSubmitAnswer}
              onSkipQuestion={handleContinue}
              hintUsed={hintUsed}
              onUnlockHint={handleUnlockHint}
            />
          ) : (
            /* Quest Completed Screen */
            <div className="w-full max-w-2xl bg-slate-900/20 border border-indigo-500/20 rounded-3xl p-8 backdrop-blur-md shadow-2xl flex flex-col items-center gap-6 text-center animate-correct-pulse">
              {/* Achievement Badge */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 mb-2 relative">
                <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-orange-400 opacity-20"></span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-6.75a1.125 1.125 0 0 1-1.125-1.125V18.75m9 0V21m-9-2.25V21m9 0H4.5" />
                </svg>
              </div>

              <div>
                <h2 className="font-outfit font-black text-3xl tracking-tight text-white m-0">
                  Quest Complete!
                </h2>
                <p className="text-slate-400 mt-2 text-sm">
                  You have successfully tackled all Year 9 syllabus exam questions.
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
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Hints Read</span>
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
                        <span className="text-sm font-semibold text-slate-300">{topic}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: `${level}%` }} />
                          </div>
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono border ${colorClass}`}>
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
                className="mt-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-outfit font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20 cursor-pointer"
              >
                Restart Learning Quest
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
