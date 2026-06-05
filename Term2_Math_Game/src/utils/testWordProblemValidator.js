import { validateWordProblemAnswer } from './wordProblemValidator.js';

const tests = [
  // Problem 1: Sum of three numbers is 66 -> Answer: 12, 24, 30
  { user: '12, 24, 30', correct: '12, 24, 30', expected: true },
  { user: '12 24 30', correct: '12, 24, 30', expected: true },
  { user: 'first is 12, second is 24, third is 30', correct: '12, 24, 30', expected: true },
  { user: '12,24,31', correct: '12, 24, 30', expected: false },

  // Problem 2: Sam is 32 years older -> Answer: Sam is 58, Son is 26
  { user: 'Sam is 58, Son is 26', correct: 'Sam is 58, Son is 26', expected: true },
  { user: '58, 26', correct: 'Sam is 58, Son is 26', expected: true },
  { user: 'Sam 58 and Son 26', correct: 'Sam is 58, Son is 26', expected: true },
  { user: '58 and 25', correct: 'Sam is 58, Son is 26', expected: false },

  // Problem 3: Weekly income -> Answer: 1800
  { user: '1800', correct: '1800', expected: true },
  { user: '$1800', correct: '1800', expected: true },
  { user: 'income is 1800 dollars', correct: '1800', expected: true },

  // Problem 4: pay first year -> Answer: 58000
  { user: '58,000', correct: '58000', expected: true },
  { user: '$58,000', correct: '58000', expected: true },
  { user: '58000', correct: '58000', expected: true },

  // Problem 6: fruit vendor -> Answer: 6kg of oranges and 9kg of apples
  { user: '6kg of oranges and 9kg of apples', correct: '6kg of oranges and 9kg of apples', expected: true },
  { user: '6, 9', correct: '6kg of oranges and 9kg of apples', expected: true },
  { user: 'oranges: 6, apples: 9', correct: '6kg of oranges and 9kg of apples', expected: true },
  { user: '9, 6', correct: '6kg of oranges and 9kg of apples', expected: false },

  // Problem 15: shirt decrease -> Answer: 15%
  { user: '15%', correct: '15%', expected: true },
  { user: '15', correct: '15%', expected: true }
];

let failed = 0;
tests.forEach((test, idx) => {
  const result = validateWordProblemAnswer(test.user, test.correct);
  if (result !== test.expected) {
    console.error(`❌ Test #${idx + 1} Failed. User: "${test.user}", Correct: "${test.correct}". Expected ${test.expected}, got ${result}`);
    failed++;
  } else {
    console.log(`✅ Test #${idx + 1} Passed.`);
  }
});

console.log(`\nWord problem validation results: ${tests.length - failed}/${tests.length} passed.`);
process.exit(failed > 0 ? 1 : 0);
