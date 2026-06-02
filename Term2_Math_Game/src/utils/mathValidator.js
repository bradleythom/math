/**
 * Safely evaluates a mathematical expression string using a Shunting-yard / RPN parser.
 * Supports numbers, operators (+, -, *, /, ^), parentheses, and variables.
 * Preprocesses unary negative signs.
 */
function evaluateExpression(exprStr, variables = {}) {
  // Preprocess: Replace unary minus with (0-1)*
  // A minus is unary if it is at the start of the string, or follows an operator or opening parenthesis.
  let preprocessed = exprStr
    .replace(/\s+/g, '')
    .replace(/^-/, '(0-1)*')
    .replace(/([+\-*/^(\[,])-/g, '$1(0-1)*');

  // Tokenizer
  const tokens = [];
  let i = 0;
  const varKeys = Object.keys(variables);

  while (i < preprocessed.length) {
    const char = preprocessed[i];

    // Numbers (integers & decimals)
    if (/\d|\./.test(char)) {
      let numStr = '';
      while (i < preprocessed.length && /[\d\.]/.test(preprocessed[i])) {
        numStr += preprocessed[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: parseFloat(numStr) });
      continue;
    }

    // Variables
    let matchedVar = false;
    for (const v of varKeys) {
      if (preprocessed.startsWith(v, i)) {
        tokens.push({ type: 'VARIABLE', value: variables[v] });
        i += v.length;
        matchedVar = true;
        break;
      }
    }
    if (matchedVar) continue;

    // Operators and Parentheses (mapping brackets [] and braces {} to parentheses)
    if ('+-*/^()[]{}'.includes(char)) {
      let mappedChar = char;
      if (char === '[' || char === '{') mappedChar = '(';
      if (char === ']' || char === '}') mappedChar = ')';
      tokens.push({ type: 'OPERATOR', value: mappedChar });
      i++;
      continue;
    }

    // Ignore unsupported chars (like units, etc.)
    i++;
  }

  // Shunting-yard implementation (Infix to Postfix)
  const outputQueue = [];
  const operatorStack = [];

  const precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '^': 3
  };

  const associativity = {
    '+': 'LEFT',
    '-': 'LEFT',
    '*': 'LEFT',
    '/': 'LEFT',
    '^': 'RIGHT'
  };

  for (const token of tokens) {
    if (token.type === 'NUMBER' || token.type === 'VARIABLE') {
      outputQueue.push(token);
    } else if (token.type === 'OPERATOR') {
      const op = token.value;
      if (op === '(') {
        operatorStack.push(token);
      } else if (op === ')') {
        while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].value !== '(') {
          outputQueue.push(operatorStack.pop());
        }
        operatorStack.pop(); // Remove '('
      } else {
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1].value !== '(' &&
          (precedence[operatorStack[operatorStack.length - 1].value] > precedence[op] ||
            (precedence[operatorStack[operatorStack.length - 1].value] === precedence[op] &&
              associativity[op] === 'LEFT'))
        ) {
          outputQueue.push(operatorStack.pop());
        }
        operatorStack.push(token);
      }
    }
  }

  while (operatorStack.length > 0) {
    outputQueue.push(operatorStack.pop());
  }

  // RPN Evaluator
  const stack = [];
  for (const token of outputQueue) {
    if (token.type === 'NUMBER' || token.type === 'VARIABLE') {
      stack.push(token.value);
    } else if (token.type === 'OPERATOR') {
      const op = token.value;
      const b = stack.pop();
      const a = stack.pop();

      if (a === undefined || b === undefined) return NaN;

      if (op === '^') {
        stack.push(Math.pow(a, b));
      } else if (op === '*') {
        stack.push(a * b);
      } else if (op === '/') {
        stack.push(a / b);
      } else if (op === '+') {
        stack.push(a + b);
      } else if (op === '-') {
        stack.push(a - b);
      }
    }
  }

  if (stack.length !== 1) return NaN;
  return stack[0];
}

/**
 * Normalizes a math string:
 * - Strips currency symbols ($), units (cm, cm^2, m, degrees, etc.)
 * - Replaces LaTeX elements (\frac, \times, \div, etc.) with computer math format
 * - Handles mixed numbers: e.g. "1 17/24" -> "(1 + 17/24)"
 * - Isolates RHS if expression starts with variable assignment (e.g. "y = ...")
 */
export function normalizeMathString(str) {
  if (!str) return '';

  let normalized = str.trim();

  // Strip dollar signs and standard currency
  normalized = normalized.replace(/\$/g, '');

  // Strip common units
  normalized = normalized.replace(/\s*(cm\^2|cm²|cm\^3|cm³|cm|m|degrees|deg|°|sq\s*cm)/gi, '');

  // Strip assignments like "y =", "x =", "r =", "a ="
  normalized = normalized.replace(/^[a-zA-Z]\s*=\s*/, '');

  // Map LaTeX \frac{A}{B} to ((A)/(B)) recursively
  while (normalized.includes('\\frac')) {
    const updated = normalized.replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '(($1)/($2))');
    if (updated === normalized) break;
    normalized = updated;
  }

  // Replace LaTeX operators with standard characters
  normalized = normalized
    .replace(/\\times/g, '*')
    .replace(/\\div/g, '/')
    .replace(/\\cdot/g, '*')
    .replace(/\\pi/g, 'pi');

  // Convert mixed numbers: e.g., "5 5/8" -> "(5 + 5/8)" or "1 17/24" -> "(1 + 17/24)"
  normalized = normalized.replace(/(\d+)\s+(\d+)\/(\d+)/g, '($1+$2/$3)');

  // Remove remaining backslashes
  normalized = normalized.replace(/\\/g, '');

  // Normalize pi to word 'pi' for variable evaluation
  normalized = normalized.replace(/pi/g, 'pi');

  // Add implicit multiplication:
  // e.g. "5xy" -> "5*x*y", "3x^2" -> "3*x^2", "t(g^2 - 2)" -> "t*(g^2 - 2)"
  normalized = insertImplicitMultiplication(normalized);

  return normalized;
}

function insertImplicitMultiplication(str) {
  let res = str.replace(/\s+/g, '');
  // Number followed by Letter: 5x -> 5*x
  res = res.replace(/(\d+)([a-zA-Z])/g, '$1*$2');
  // Letter followed by Number: x5 -> x*5
  res = res.replace(/([a-zA-Z])(\d+)/g, '$1*$2');
  // Letter followed by Letter: xy -> x*y (but skip multiletter variables like 'pi')
  // We'll handle 'pi' by temporarily replacing it
  res = res.replace(/pi/g, 'p'); // temporarily simplify pi to single letter 'p'
  res = res.replace(/([a-zA-Z])([a-zA-Z])/g, '$1*$2');
  // Number/Letter followed by (: 5( -> 5*(, x( -> x*(, p( -> p*(
  res = res.replace(/(\d|[a-zA-Z])\(/g, '$1*(');
  // ) followed by Number/Letter/(: )5 -> )*5, )x -> )*x, )( -> )*(
  res = res.replace(/\)(\d|[a-zA-Z]|\()/g, ')*$1');
  return res;
}

/**
 * Validates if the user's prime factors match the prime factorization of 168.
 * Correct answer is 2^3 * 3 * 7.
 * Expands all factors and compares the sorted list of primes.
 */
function validatePrimeFactors(userStr) {
  try {
    // Normalize multiplication symbols
    let clean = userStr.replace(/\s+/g, '')
                        .replace(/\\times/g, '*')
                        .replace(/x/g, '*')
                        .replace(/·/g, '*');
    
    // Split by multiplication
    const parts = clean.split('*');
    const factors = [];

    for (const part of parts) {
      if (!part) continue;
      if (part.includes('^')) {
        const [baseStr, expStr] = part.split('^');
        const base = parseInt(baseStr, 10);
        const exp = parseInt(expStr, 10);
        if (isNaN(base) || isNaN(exp)) return false;
        for (let k = 0; k < exp; k++) {
          factors.push(base);
        }
      } else {
        const val = parseInt(part, 10);
        if (isNaN(val)) return false;
        factors.push(val);
      }
    }

    // Sort factors and compare with expected prime factors of 168: [2, 2, 2, 3, 7]
    factors.sort((a, b) => a - b);
    const expected = [2, 2, 2, 3, 7];
    if (factors.length !== expected.length) return false;
    return factors.every((val, index) => val === expected[index]);
  } catch (e) {
    return false;
  }
}

/**
 * Primary validator function.
 * Compares user input against the correct answer.
 */
export function validateAnswer(userVal, correctVal, questionId) {
  if (!userVal) return false;

  // Special factorization check for Question 6 (Express 168 as a product of prime factors)
  if (questionId === 6) {
    return validatePrimeFactors(userVal);
  }

  const normUser = normalizeMathString(userVal);
  const normCorrect = normalizeMathString(correctVal);

  if (normUser === normCorrect) return true;

  // Let's test with variable substitution for algebraic expressions
  // Define variables that could appear in our algebraic database
  // Variables: x, y, t, g, p (for pi)
  // Let's create two distinct testing sets of values
  const testSets = [
    { x: 2.34, y: 3.45, t: 4.56, g: 5.67, p: Math.PI },
    { x: 7.12, y: 1.89, t: 3.23, g: 2.76, p: Math.PI }
  ];

  try {
    let matchesAll = true;
    for (const vars of testSets) {
      const valUser = evaluateExpression(normUser, vars);
      const valCorrect = evaluateExpression(normCorrect, vars);

      // Check if both are numbers and are very close (tolerance 0.001)
      if (isNaN(valUser) || isNaN(valCorrect)) {
        matchesAll = false;
        break;
      }
      if (Math.abs(valUser - valCorrect) > 0.005) {
        matchesAll = false;
        break;
      }
    }

    if (matchesAll) return true;
  } catch (e) {
    // If evaluation fails, fall back to simple string comparison
  }

  // Fallback direct float comparison (for simple fractions vs decimals like 1/2 and 0.5)
  try {
    const valUserDirect = evaluateExpression(normUser, { p: Math.PI });
    const valCorrectDirect = evaluateExpression(normCorrect, { p: Math.PI });
    if (!isNaN(valUserDirect) && !isNaN(valCorrectDirect)) {
      return Math.abs(valUserDirect - valCorrectDirect) < 0.005;
    }
  } catch (e) {}

  return false;
}
