export const questionBank = [
  // Easy Category
  {
    id: 101,
    type: 'standard',
    difficulty: 'easy',
    category: 'Number',
    problem: 'Evaluate \\(2^3 \\times 5^0\\)',
    answer: '8',
    hint: 'Any non-zero number to the power of 0 is 1 (\\(5^0 = 1\\)), so the calculation is \\(8 \\times 1 = 8\\).'
  },
  {
    id: 102,
    type: 'standard',
    difficulty: 'easy',
    category: 'Number',
    problem: 'Calculate \\(3.6 \\div 0.2\\)',
    answer: '18',
    hint: 'Multiply both numbers by 10 to remove decimals, making the equation \\(36 \\div 2 = 18\\).'
  },
  {
    id: 103,
    type: 'standard',
    difficulty: 'easy',
    category: 'Algebra',
    problem: 'Simplify the expression \\(7xy - 2yx - 3x^2 - 5y\\)',
    answer: '5xy - 3x^2 - 5y',
    hint: '\\(7xy\\) and \\(2yx\\) are like terms (order of variables does not matter); subtract \\(2xy\\) from \\(7xy\\) to get \\(5xy\\).'
  },
  {
    id: 104,
    type: 'standard',
    difficulty: 'easy',
    category: 'Measurement',
    problem: 'Convert \\(0.79\\text{m}\\) to \\(\\text{cm}\\)',
    answer: '79',
    hint: 'There are 100 centimetres in a metre, so multiply \\(0.79 \\times 100 = 79\\).'
  },
  {
    id: 105,
    type: 'standard',
    difficulty: 'easy',
    category: 'Geometry',
    problem: 'Find the value of a if angles on a straight line are given as \\(4a\\) and \\(60^\\circ\\)',
    answer: '30',
    hint: 'Angles on a straight line add up to \\(180^\\circ\\). Set up the equation \\(4a + 60 = 180\\), which simplifies to \\(4a = 120\\) and \\(a = 30\\).'
  },
  // Medium Category
  {
    id: 106,
    type: 'standard',
    difficulty: 'medium',
    category: 'Number',
    problem: 'Express \\(168\\) as a product of its prime factors in exponent form',
    answer: '2^3 \\times 3 \\times 7',
    hint: 'Divide 168 successively by prime numbers: \\(168 \\div 2 = 84\\), \\(84 \\div 2 = 42\\), \\(42 \\div 2 = 21\\), and \\(21 \\div 3 = 7\\). Thus, \\(168 = 2 \\times 2 \\times 2 \\times 3 \\times 7 = 2^3 \\times 3 \\times 7\\).'
  },
  {
    id: 107,
    type: 'standard',
    difficulty: 'medium',
    category: 'Number',
    problem: 'Increase $96 by \\(30\\%\\)',
    answer: '124.80',
    hint: 'To calculate a 30% increase, multiply 96 by 1.3: \\(96 \\times 1.3 = 124.8\\). Expressed in currency, it is $124.80.'
  },
  {
    id: 108,
    type: 'standard',
    difficulty: 'medium',
    category: 'Algebra',
    problem: 'Solve the equation \\(3x - 7 = 7x - 15\\)',
    answer: '2',
    hint: 'Rearrange the equation to group the variables on one side: \\(-7 + 15 = 7x - 3x\\), which simplifies to \\(8 = 4x\\). Dividing by 4 gives \\(x = 2\\).'
  },
  {
    id: 109,
    type: 'standard',
    difficulty: 'medium',
    category: 'Algebra',
    problem: 'Make \\(y\\) the subject of the equation: \\(xy - 3y = 7y + 10\\)',
    answer: '10 / (x - 10)',
    hint: 'Move all terms containing \\(y\\) to one side: \\(xy - 3y - 7y = 10 \\Rightarrow xy - 10y = 10\\). Factor out \\(y\\): \\(y(x - 10) = 10\\). Finally, divide by \\((x-10)\\) to get \\(y = \\frac{10}{x - 10}\\).'
  },
  {
    id: 110,
    type: 'standard',
    difficulty: 'medium',
    category: 'Measurement',
    problem: 'Find the area of an isosceles trapezium with parallel sides of \\(7\\text{cm}\\) and \\(13\\text{cm}\\), and a perpendicular height of \\(4\\text{cm}\\) (give units in \\(\\text{cm}^2\\))',
    answer: '40',
    hint: 'Use the trapezium area formula \\(A = \\frac{1}{2}(a+b)h\\). Substitute the values: \\(A = \\frac{1}{2}(7+13) \\times 4 = \\frac{1}{2}(20) \\times 4 = 10 \\times 4 = 40\\text{ cm}^2\\).'
  },
  // Hard Category
  {
    id: 111,
    type: 'standard',
    difficulty: 'hard',
    category: 'Number',
    problem: 'Evaluate \\(5\\frac{5}{8} + 2\\frac{3}{4} - 6\\frac{2}{3}\\)',
    answer: '1 17/24',
    hint: 'Group the whole numbers: \\(5 + 2 - 6 = 1\\). Find a common denominator (24) for the fractions: \\(\\frac{5}{8} + \\frac{3}{4} - \\frac{2}{3} = \\frac{15}{24} + \\frac{18}{24} - \\frac{16}{24} = \\frac{17}{24}\\). Combine them to get \\(1\\frac{17}{24}\\).'
  },
  {
    id: 112,
    type: 'standard',
    difficulty: 'hard',
    category: 'Algebra',
    problem: 'Solve the equation \\(\\frac{2x-7}{3} = \\frac{4}{5}(x-3)\\)',
    answer: '1/2',
    hint: 'Multiply both sides by the common denominator 15: \\(5(2x-7) = 12(x-3)\\). Expand: \\(10x - 35 = 12x - 36\\). Rearrange: \\(36 - 35 = 12x - 10x \\Rightarrow 1 = 2x \\Rightarrow x = \\frac{1}{2}\\).'
  },
  {
    id: 113,
    type: 'standard',
    difficulty: 'hard',
    category: 'Algebra',
    problem: 'Rearrange the equation to make \\(r\\) the subject: \\(g = \\sqrt{\\frac{r}{t} + 2}\\)',
    answer: 't(g^2 - 2)',
    hint: 'Square both sides to remove the radical: \\(g^2 = \\frac{r}{t} + 2\\). Subtract 2: \\(g^2 - 2 = \\frac{r}{t}\\). Multiply by \\(t\\): \\(r = t(g^2 - 2)\\).'
  },
  {
    id: 114,
    type: 'standard',
    difficulty: 'hard',
    category: 'Measurement',
    problem: 'The volume of a cylinder is \\(640\\pi\\text{ cm}^3\\). Calculate its surface area if the height is \\(10\\text{cm}\\). (Leave your answer in terms of \\(\\pi\\), e.g. \\(288\\pi\\))',
    answer: '288\\pi',
    hint: '1. Find the radius using \\(V = \\pi r^2 h\\): \\(640\\pi = \\pi r^2(10) \\Rightarrow r^2 = 64 \\Rightarrow r = 8\\text{ cm}\\).\\n2. Calculate Surface Area \\(A = 2\\pi r^2 + 2\\pi rh = 2\\pi(64) + 2\\pi(8)(10) = 128\\pi + 160\\pi = 288\\pi\\text{ cm}^2\\).'
  },
  {
    id: 115,
    type: 'standard',
    difficulty: 'hard',
    category: 'Number',
    problem: 'A cricket bat has increased in value by \\(30\\%\\) over \\(25\\) years. It is now valued at $455. What was its original value?',
    answer: '350',
    hint: 'The current value represents 130% of the original value. Set up the equation \\(1.3x = 455\\). Divide: \\(x = 455 \\div 1.3 = 350\\).'
  }
];
