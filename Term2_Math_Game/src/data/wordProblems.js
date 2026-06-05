export const wordProblems = [
  {
    id: 1,
    type: 'word',
    difficulty: 'medium',
    category: 'Systems & Logic',
    text: 'The sum of three numbers is \\(66\\). The second number is twice the first, and \\(6\\) less than the third number. Form an equation to represent this problem and then calculate the three numbers.',
    answer: '12, 24, 30',
    translationGuide: [
      'Let \\(n\\) = the second number.',
      'Therefore, the first number is \\(\\frac{n}{2}\\).',
      'The third number is \\(n + 6\\).',
      'Set up the equation: \\(\\frac{n}{2} + n + n + 6 = 66\\).'
    ]
  },
  {
    id: 2,
    type: 'word',
    difficulty: 'medium',
    category: 'Age Problems',
    text: "Sam is \\(32\\) years older than his son. \\(10\\) years ago, he was three times as old as his son was then. Form an equation to represent this problem and then calculate both Sam and his son's age now.",
    answer: 'Sam is 58, Son is 26',
    translationGuide: [
      "Let \\(a\\) = Sam's age now.",
      "Therefore, the son's age is \\(a - 32\\).",
      "\\(10\\) years ago, Sam's age was \\(a - 10\\) and the son's age was \\(a - 32 - 10\\) (which simplifies to \\(a - 42\\)).",
      "Set up the equation based on three times age: \\(a - 10 = 3(a - 42)\\)."
    ]
  },
  {
    id: 3,
    type: 'word',
    difficulty: 'hard',
    category: 'Financial & Percentages',
    text: 'Brian spends \\(\\frac{2}{9}\\) of his weekly income on food, and from his remaining income he spends \\(\\frac{1}{2}\\) on rent and \\(\\frac{1}{4}\\) on transport. If there is \\(\\$350\\) left at the end each week calculate his weekly income.',
    answer: '1800',
    translationGuide: [
      'Let \\(x\\) = total weekly income.',
      'After food, he has \\(\\frac{7}{9}\\) of his income left (\\(1 - \\frac{2}{9} = \\frac{7}{9}\\)).',
      'He spends \\(\\frac{1}{2} + \\frac{1}{4} = \\frac{3}{4}\\) of the *remaining* income on rent and transport.',
      'Calculate the fraction of total income spent on rent/transport: \\(\\frac{3}{4} \\times \\frac{7}{9} = \\frac{21}{36}\\).',
      'Add fractions spent: \\(\\frac{2}{9}\\) (food) + \\(\\frac{21}{36}\\) (rent/transport) = \\(\\frac{8}{36} + \\frac{21}{36} = \\frac{29}{36}\\).',
      'The fraction left is \\(\\frac{7}{36}\\) (\\(1 - \\frac{29}{36} = \\frac{7}{36}\\)). Set up the equation: \\(\\frac{7}{36}x = 350\\).'
    ]
  },
  {
    id: 4,
    type: 'word',
    difficulty: 'easy',
    category: 'Financial & Percentages',
    text: 'Every year a woman is paid \\(\\$2,000\\) more than in the previous year. If she receives \\(\\$180,000\\) over the course of three years, how much did she get paid in the first year? Form an algebraic equation and solve it.',
    answer: '58000',
    translationGuide: [
      "Let \\(x\\) = the first year's pay.",
      "The second year's pay is \\(x + 2000\\).",
      "The third year's pay is \\(x + 4000\\).",
      "Set up the equation summing three years: \\(x + x + 2000 + x + 4000 = 180000\\)."
    ]
  },
  {
    id: 5,
    type: 'word',
    difficulty: 'medium',
    category: 'Rates & Distribution',
    text: 'Tom was training for a swimming gala. Every day for \\(9\\) weeks he swam the same number of lengths in either a \\(25\\)-metre indoor pool or a \\(20\\)-metre outdoor pool. After the \\(9\\) weeks of training, he calculated that he had swam the same distance in each pool. How many times (days) did he swim in the indoor pool?',
    answer: '28 days',
    translationGuide: [
      'Calculate total days: \\(9\\text{ weeks} \\times 7\\text{ days} = 63\\text{ days}\\) of swimming.',
      'Let \\(x\\) = the number of days swam in the indoor (25m) pool.',
      'The number of days swam in the outdoor (20m) pool is \\(63 - x\\).',
      'Set up the equation balancing total distance in each pool: \\(25x = 20(63 - x)\\).'
    ]
  },
  {
    id: 6,
    type: 'word',
    difficulty: 'medium',
    category: 'Systems & Logic',
    text: 'A fruit vendor sells apples and oranges. He sells \\(3\\) kilograms more apples than oranges. The price per kilogram for apples is \\(\\$5\\) and for oranges is \\(\\$6\\). If he sells a total of \\(15\\) kilograms of fruit and collects \\(\\$81\\), how many kilograms of each fruit does he sell? Set up algebra equations.',
    answer: '6kg of oranges and 9kg of apples',
    translationGuide: [
      'Let \\(x\\) = kilograms of oranges sold.',
      'Therefore, kilograms of apples sold = \\(x + 3\\).',
      'Set up the equation for total weight sold: \\(x + x + 3 = 15\\).',
      'Solve for \\(x\\) (oranges = 6kg), then use pricing to verify: \\(6 \\times 6 + 9 \\times 5 = 36 + 45 = 81\\).'
    ]
  },
  {
    id: 7,
    type: 'word',
    difficulty: 'hard',
    category: 'Measurements & Units',
    text: 'Three consecutive even numbers are such that four times the smallest and two times the largest number exceeds three times the middle number by \\(2024\\). What is the sum of the digits of the smallest number?',
    answer: '17',
    translationGuide: [
      'Let \\(b\\) = the smallest consecutive even number.',
      'The three consecutive even numbers are represented as \\(b\\), \\(b + 2\\), and \\(b + 4\\).',
      'Translate the statement into an equation: \\(4b + 2(b + 4) - 3(b + 2) = 2024\\).',
      'Solve the equation to find \\(b = 674\\). Sum its digits: \\(6 + 7 + 4 = 17\\).'
    ]
  },
  {
    id: 8,
    type: 'word',
    difficulty: 'medium',
    category: 'Rates & Distribution',
    text: 'After tennis training, Harold collects twice as many balls as Charles and \\(5\\) more than Vic. They collect \\(35\\) balls in total. Form an equation and then solve it to show how many balls Harold collected.',
    answer: '16 balls',
    translationGuide: [
      'Let \\(h\\) = the number of tennis balls Harold collects.',
      'Charles collects half of Harold: \\(\\frac{h}{2}\\).',
      'Vic collects \\(h - 5\\).',
      'Set up the equation summing all collections: \\(h + \\frac{h}{2} + h - 5 = 35\\).'
    ]
  },
  {
    id: 9,
    type: 'word',
    difficulty: 'hard',
    category: 'Systems & Logic',
    text: 'Weighing the baby at the clinic was a problem. The baby would not keep still and caused the scales to wobble. So, I held the baby and stood on the scale while the nurse read off \\(78\\) kilogrammes. The nurse then held the baby while I read off \\(69\\) kilogrammes. Finally, I held the nurse while the baby read off \\(137\\) kilogrammes. What was the combined weight of all three of us?',
    answer: '142 kg',
    translationGuide: [
      'Set up variables: Let \\(m\\) = my weight, \\(b\\) = baby weight, \\(n\\) = nurse weight.',
      'Create three equations: \\(m + b = 78\\), \\(n + b = 69\\), and \\(m + n = 137\\).',
      'Sum all three equations: \\(2m + 2n + 2b = 78 + 69 + 137 = 284\\).',
      'Divide the sum equation by 2 to isolate the combined weight: \\(m + n + b = 142\\).'
    ]
  },
  {
    id: 10,
    type: 'word',
    difficulty: 'easy',
    category: 'Financial & Percentages',
    text: 'Calvin buys a calculator on a special at Bookstore Warehouse. The calculator cost him \\(\\$66\\), and he saw that the price had been marked down by \\(25\\%\\). What was the original price of the calculator before the markdown?',
    answer: '88',
    translationGuide: [
      'Let \\(c\\) = the original cost of the calculator.',
      'A \\(25\\%\\) markdown means the sale price is \\(75\\%\\) of the original cost.',
      'Set up the equation: \\(0.75c = 66\\) (or \\(\\frac{3}{4}c = 66\\)).',
      'Divide both sides by 0.75 to find \\(c = 88\\).'
    ]
  },
  {
    id: 11,
    type: 'word',
    difficulty: 'easy',
    category: 'Rates & Distribution',
    text: 'Angela has a fitness routine. She spends the same amount of time on each of her exercises. She has six exercises. She begins her exercises at 5.20pm and works until 6.35pm. She then has dinner, and exercises from 7.45pm to 9.00pm. Write an algebraic equation and use that to calculate the amount of time spent on each exercise in minutes.',
    answer: '25 minutes',
    translationGuide: [
      'Calculate time of the first session (5:20pm to 6:35pm) = 75 minutes.',
      'Calculate time of the second session (7:45pm to 9:00pm) = 75 minutes.',
      'Total time spent is \\(75 + 75 = 150\\) minutes.',
      'Let \\(x\\) = time spent on each exercise. Set up the equation: \\(6x = 150\\).'
    ]
  },
  {
    id: 12,
    type: 'word',
    difficulty: 'hard',
    category: 'Systems & Logic',
    text: 'Some fish, some dogs and some children are swimming in a bay. There are \\(40\\) legs in total, twice as many heads as tails, and more dogs than fish. How many fish are in the bay?',
    answer: '2',
    translationGuide: [
      'Let \\(f\\) = fish, \\(d\\) = dogs, and \\(c\\) = children. Note that fish have no legs, dogs have 4, children have 2.',
      'Equation for legs: \\(4d + 2c = 40\\), which simplifies to \\(2d + c = 20\\).',
      'Equation for heads vs tails (fish/dogs have tails, children do not): Heads = \\(f + d + c\\); Tails = \\(f + d\\). Set up: \\(f + d + c = 2(f + d)\\).',
      'Simplify the heads/tails equation: \\(c = f + d\\).',
      'Substitute \\(c\\) into the simplified leg equation: \\(2d + (f + d) = 20 \\Rightarrow 3d + f = 20\\).',
      'Since \\(d > f\\), \\(f > 0\\), and both must be integers: test values for \\(d\\). \\(d=6\\) yields \\(f=2\\), satisfying all bounds.'
    ]
  },
  {
    id: 13,
    type: 'word',
    difficulty: 'medium',
    category: 'Financial & Percentages',
    text: 'A cricket bat signed Tachin Sendulkar has increased in value by \\(30\\%\\) over the last \\(25\\) years. It is now valued at \\(\\$455\\). What was its original value?',
    answer: '350',
    translationGuide: [
      'Let \\(x\\) = the original value.',
      'A \\(30\\%\\) increase is represented by the multiplier 1.3.',
      'Set up the equation: \\(1.3x = 455\\).',
      'Rearrange to solve: \\(x = \\frac{455}{1.3}\\).'
    ]
  },
  {
    id: 14,
    type: 'word',
    difficulty: 'easy',
    category: 'Measurements & Units',
    text: 'A water container holds \\(3\\) litres of water. Small paper cups hold \\(150\\) millilitres each. How many cups can be filled with two water containers?',
    answer: '40 cups',
    translationGuide: [
      'Convert litres to millilitres: \\(3\\text{ litres} = 3000\\text{ mL}\\).',
      'Multiply by 2 for two containers: \\(3000 \\times 2 = 6000\\text{ mL}\\).',
      'Set up the division equation: \\(\\frac{6000}{150}\\) to solve for the total number of cups.'
    ]
  },
  {
    id: 15,
    type: 'word',
    difficulty: 'easy',
    category: 'Financial & Percentages',
    text: 'In a sale a shirt has been reduced from \\(\\$65\\) to \\(\\$55.25\\). What is the percentage decrease?',
    answer: '15%',
    translationGuide: [
      'Find the absolute decrease in price: \\(65 - 55.25 = 9.75\\).',
      'Set up the percentage formula: \\(\\frac{9.75}{65} \\times 100\\).'
    ]
  }
];
