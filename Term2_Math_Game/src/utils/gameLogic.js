/**
 * Calculates the score awarded for a question based on its difficulty,
 * the current streak, and whether a hint was used.
 * - Easy: 10 points
 * - Medium: 20 points
 * - Hard: 30 points
 * - Streak Multiplier:
 *   - 0-2 correct: 1x
 *   - 3-4 correct: 1.5x
 *   - 5+ correct: 2x
 * - Hint Penalty: halves the final score.
 */
export function calculatePoints(difficulty, streak, hintUsed) {
  let basePoints = 10;
  if (difficulty === 'medium') {
    basePoints = 20;
  } else if (difficulty === 'hard') {
    basePoints = 30;
  }

  let multiplier = 1.0;
  if (streak >= 5) {
    multiplier = 2.0;
  } else if (streak >= 3) {
    multiplier = 1.5;
  }

  let points = basePoints * multiplier;
  if (hintUsed) {
    points = points * 0.5;
  }

  return Math.round(points);
}

/**
 * Selects the next question from the question bank.
 * Prioritizes the current difficulty. If all questions in that difficulty
 * are answered, it falls back to other unanswered questions.
 * Returns null if all questions have been answered.
 */
export function getNextQuestion(answeredIds, currentDifficulty, questionBank) {
  // Filter for unanswered questions in current difficulty
  let available = questionBank.filter(
    (q) => !answeredIds.includes(q.id) && q.difficulty === currentDifficulty
  );

  // If no unanswered questions in current difficulty, check all unanswered questions
  if (available.length === 0) {
    available = questionBank.filter((q) => !answeredIds.includes(q.id));
  }

  // If still none, all questions are answered
  if (available.length === 0) {
    return null;
  }

  // Pick a random question from available list
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}

/**
 * Calculates updated topic mastery.
 * - Correct: +20%
 * - Incorrect: -10%
 * - Bounds: 0% to 100%
 */
export function updateMastery(currentMastery, isCorrect) {
  let change = isCorrect ? 20 : -10;
  let nextMastery = currentMastery + change;
  if (nextMastery > 100) nextMastery = 100;
  if (nextMastery < 0) nextMastery = 0;
  return nextMastery;
}

/**
 * Returns the text label for a mastery percentage.
 */
export function getMasteryLabel(percentage) {
  if (percentage <= 20) return 'Novice';
  if (percentage <= 50) return 'Apprentice';
  if (percentage <= 80) return 'Practitioner';
  return 'Expert';
}

/**
 * Returns a CSS color class based on the mastery percentage.
 */
export function getMasteryColorClass(percentage) {
  if (percentage <= 20) return 'text-slate-400 border-slate-500/20 bg-slate-500/5';
  if (percentage <= 50) return 'text-blue-400 border-blue-500/20 bg-blue-500/5';
  if (percentage <= 80) return 'text-purple-400 border-purple-500/20 bg-purple-500/5';
  return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
}
