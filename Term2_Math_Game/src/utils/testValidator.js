import { validateAnswer } from './mathValidator.js';

const tests = [
  // Q1
  { qId: 1, user: '8', correct: '8', expected: true },
  
  // Q2
  { qId: 2, user: '18', correct: '18', expected: true },
  
  // Q3 - algebra
  { qId: 3, user: '5xy - 3x^2 - 5y', correct: '5xy - 3x^2 - 5y', expected: true },
  { qId: 3, user: '-3x^2 + 5xy - 5y', correct: '5xy - 3x^2 - 5y', expected: true },
  { qId: 3, user: '5xy - 5y - 3x^2', correct: '5xy - 3x^2 - 5y', expected: true },
  { qId: 3, user: '5*x*y - 3*x^2 - 5*y', correct: '5xy - 3x^2 - 5y', expected: true },
  { qId: 3, user: '4xy - 3x^2 - 5y', correct: '5xy - 3x^2 - 5y', expected: false },
  
  // Q4 - units
  { qId: 4, user: '79cm', correct: '79', expected: true },
  { qId: 4, user: '79 cm', correct: '79', expected: true },
  { qId: 4, user: '79', correct: '79', expected: true },
  
  // Q5
  { qId: 5, user: '30', correct: '30', expected: true },
  { qId: 5, user: '30°', correct: '30', expected: true },
  { qId: 5, user: '30 degrees', correct: '30', expected: true },
  
  // Q6 - prime factorization
  { qId: 6, user: '2^3 \\times 3 \\times 7', correct: '2^3 \\times 3 \\times 7', expected: true },
  { qId: 6, user: '2^3 * 3 * 7', correct: '2^3 \\times 3 \\times 7', expected: true },
  { qId: 6, user: '2^3 x 3 x 7', correct: '2^3 \\times 3 \\times 7', expected: true },
  { qId: 6, user: '2*2*2*3*7', correct: '2^3 \\times 3 \\times 7', expected: true },
  { qId: 6, user: '3 * 7 * 2^3', correct: '2^3 \\times 3 \\times 7', expected: true },
  { qId: 6, user: '168', correct: '2^3 \\times 3 \\times 7', expected: false },
  { qId: 6, user: '8*3*7', correct: '2^3 \\times 3 \\times 7', expected: false },
  
  // Q7 - currency / decimal
  { qId: 7, user: '124.80', correct: '124.80', expected: true },
  { qId: 7, user: '124.8', correct: '124.80', expected: true },
  { qId: 7, user: '$124.80', correct: '124.80', expected: true },
  { qId: 7, user: '125', correct: '124.80', expected: false },
  
  // Q8
  { qId: 8, user: '2', correct: '2', expected: true },
  { qId: 8, user: 'x = 2', correct: '2', expected: true },
  
  // Q9 - algebra rearrange
  { qId: 9, user: '10 / (x - 10)', correct: '10 / (x - 10)', expected: true },
  { qId: 9, user: '10/(x-10)', correct: '10 / (x - 10)', expected: true },
  { qId: 9, user: 'y = 10 / (x - 10)', correct: '10 / (x - 10)', expected: true },
  { qId: 9, user: '10 / (x - 9)', correct: '10 / (x - 10)', expected: false },
  
  // Q11 - fractions
  { qId: 11, user: '1 17/24', correct: '1 17/24', expected: true },
  { qId: 11, user: '41/24', correct: '1 17/24', expected: true },
  
  // Q12
  { qId: 12, user: '1/2', correct: '1/2', expected: true },
  { qId: 12, user: '0.5', correct: '1/2', expected: true },
  { qId: 12, user: 'x = 0.5', correct: '1/2', expected: true },
  
  // Q13 - rearrange
  { qId: 13, user: 't(g^2 - 2)', correct: 't(g^2 - 2)', expected: true },
  { qId: 13, user: 'tg^2 - 2t', correct: 't(g^2 - 2)', expected: true },
  { qId: 13, user: 'r = t*(g^2 - 2)', correct: 't(g^2 - 2)', expected: true },
  { qId: 13, user: 't*(g^2 - 3)', correct: 't(g^2 - 2)', expected: false },
  
  // Q14 - pi
  { qId: 14, user: '288\\pi', correct: '288\\pi', expected: true },
  { qId: 14, user: '288 pi', correct: '288\\pi', expected: true },
  { qId: 14, user: '288*pi', correct: '288\\pi', expected: true },
];

let failed = 0;
tests.forEach((test, idx) => {
  const result = validateAnswer(test.user, test.correct, test.qId);
  if (result !== test.expected) {
    console.error(`❌ Test #${idx + 1} Failed: Q${test.qId}. User input: "${test.user}", Correct: "${test.correct}". Expected ${test.expected}, got ${result}`);
    failed++;
  } else {
    console.log(`✅ Test #${idx + 1} Passed: Q${test.qId}.`);
  }
});

console.log(`\nTest results: ${tests.length - failed}/${tests.length} passed.`);
process.exit(failed > 0 ? 1 : 0);
