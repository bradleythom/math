/**
 * Normalizes a text string by:
 * - Removing thousands-separator commas (e.g. "58,000" -> "58000")
 * - Removing currency symbols ($)
 * - Lowercasing
 */
function cleanString(str) {
  if (!str) return '';
  return str
    .replace(/(\d),(\d)/g, '$1$2') // strip thousands commas
    .replace(/\$/g, '')            // strip currency signs
    .toLowerCase()
    .trim();
}

/**
 * Extracts all integers and floating-point numbers in sequence from a cleaned string.
 */
function extractNumbers(str) {
  const cleaned = cleanString(str);
  const matches = cleaned.match(/\d+(?:\.\d+)?/g);
  if (!matches) return [];
  return matches.map(Number);
}

/**
 * Validates if the user's answer is equivalent to the correct answer.
 * - Extracts numerical sequences from both.
 * - Compares array length and values element-by-element with a tolerance of 0.05.
 * - Returns true on match, false otherwise.
 */
export function validateWordProblemAnswer(userAnswer, correctAnswer) {
  if (!userAnswer) return false;

  const userNumbers = extractNumbers(userAnswer);
  const correctNumbers = extractNumbers(correctAnswer);

  // If no numbers were entered or expected
  if (userNumbers.length === 0 || correctNumbers.length === 0) {
    // Fall back to clean string comparison
    return cleanString(userAnswer) === cleanString(correctAnswer);
  }

  if (userNumbers.length !== correctNumbers.length) {
    return false;
  }

  // Verify all numbers in sequence match within tolerance
  return userNumbers.every((val, index) => {
    const correctVal = correctNumbers[index];
    return Math.abs(val - correctVal) < 0.05;
  });
}
