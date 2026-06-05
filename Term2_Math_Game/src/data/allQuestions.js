import { questionBank } from './questionBank';
import { wordProblems } from './wordProblems';

/**
 * Unified question pool combining standard math questions (IDs 101-115)
 * and word problems (IDs 1-15) into a single 30-question bank.
 */
export const allQuestions = [...questionBank, ...wordProblems];

export const TOTAL_QUESTIONS = allQuestions.length;

/**
 * All unique mastery categories across both question types.
 */
export const ALL_CATEGORIES = [
  // Standard question categories
  'Number',
  'Algebra',
  'Measurement',
  'Geometry',
  // Word problem categories
  'Age Problems',
  'Financial & Percentages',
  'Systems & Logic',
  'Rates & Distribution',
  'Measurements & Units'
];
