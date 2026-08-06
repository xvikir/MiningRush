const fs = require('fs/promises');
const path = require('path');
const Question = require('../models/Question');

const questions = [];
const seen = new Set();

function factorial(n) {
  return Array.from({ length: n }, (_, index) => index + 1).reduce((result, value) => result * value, 1);
}

function permutation(n, r) {
  let result = 1;
  for (let value = n - r + 1; value <= n; value += 1) result *= value;
  return result;
}

function combination(n, r) {
  return permutation(n, r) / factorial(r);
}

function add(level, topic, difficulty, question, answer) {
  if (!Number.isInteger(answer)) throw new Error(`Non-integer answer: ${question}`);
  if (seen.has(question)) throw new Error(`Duplicate question: ${question}`);
  seen.add(question);
  questions.push({ question, answer, level, topic, difficulty });
}

function generateLevel1() {
  for (let k = 0; k < 50; k += 1) {
    add(1, 'basic arithmetic', 'easy', `${12 + k} × ${3 + (k % 7)} + ${5 + (k % 9)} = ?`, (12 + k) * (3 + (k % 7)) + 5 + (k % 9));
    add(1, 'basic arithmetic', 'easy', `${100 + k} - ${27 + (k * 2)} + ${8 + (k % 6)} = ?`, 100 + k - 27 - (k * 2) + 8 + (k % 6));
    const divisor = 2 + (k % 5);
    const quotient = 12 + k;
    const multiplier = 2 + (k % 4);
    add(1, 'fast mental math', 'easy', `${divisor * quotient} ÷ ${divisor} × ${multiplier} = ?`, quotient * multiplier);
    add(1, 'fast mental math', 'easy', `${25 + k} + ${36 + (k * 2)} - ${18 + (k % 8)} = ?`, 25 + k + 36 + (k * 2) - 18 - (k % 8));
    add(1, 'basic arithmetic', 'easy', `${9 + k} × ${4 + (k % 6)} - ${10 + (k % 10)} = ?`, (9 + k) * (4 + (k % 6)) - 10 - (k % 10));
  }
}

function generateLevel2() {
  for (let k = 0; k < 50; k += 1) {
    const base = 2 + (k % 8);
    const exponent = 2 + (k % 3);
    add(2, 'powers and exponents', 'medium', `${base}^${exponent} + ${k + 3} = ?`, (base ** exponent) + k + 3);

    const root = 5 + k;
    add(2, 'square roots', 'medium', `√${root * root} + ${k % 12} = ?`, root + (k % 12));

    const n = 3 + (k % 7);
    add(2, 'factorials', 'medium', `${n}! ÷ ${(n - 1)}! + ${k} = ?`, n + k);

    const powerBase = 2 + (k % 3);
    const high = 3 + (k % 4);
    const low = 1 + (k % 2);
    add(2, 'powers and exponents', 'medium', `${powerBase}^${high} ÷ ${powerBase}^${low} + ${k % 7} = ?`, (powerBase ** (high - low)) + (k % 7));

    const square = 6 + (k % 20);
    const adjustment = Math.floor(k / 20);
    add(2, 'powers and roots', 'medium', `${square}² - ${square * 2} + ${adjustment} = ?`, (square * square) - (square * 2) + adjustment);
  }
}

function generateLevel3() {
  for (let k = 0; k < 50; k += 1) {
    const coefficient = 2 + (k % 7);
    const x = 2 + (k % 15);
    const constant = 3 + k;
    add(3, 'linear equations', 'medium', `${coefficient}x + ${constant} = ${(coefficient * x) + constant}\nFind x`, x);

    const left = 3 + (k % 6);
    const right = 1 + (k % 2);
    const target = 3 + (k % 12);
    const offset = 5 + k;
    add(3, 'algebra', 'medium', `${left}x + ${offset} = ${right}x + ${(left - right) * target + offset}\nFind x`, target);

    const a = 2 + (k % 5);
    const b = 3 + (k % 6);
    const answer = 1 + (k % 14);
    const y = 2 + (k % 9);
    add(3, 'simultaneous equations', 'medium', `${a}x + ${b}y = ${(a * answer) + (b * y)}, y = ${y}\nFind x`, answer);

    const divisor = 2 + (k % 7);
    const result = divisor * (2 + (k % 12));
    add(3, 'linear equations', 'medium', `x/${divisor} + ${k % 8} = ${(result / divisor) + (k % 8)}\nFind x`, result);

    const multiplier = 2 + (k % 5);
    const solution = 2 + (k % 13);
    add(3, 'algebra', 'medium', `${multiplier}(x + ${k % 9}) = ${multiplier * (solution + (k % 9))}\nFind x`, solution);
  }
}

function generateLevel4() {
  for (let k = 0; k < 100; k += 1) {
    const smallerRoot = 1 + (k % 10);
    const largerRoot = smallerRoot + 1 + Math.floor(k / 10);
    add(4, 'quadratic equations', 'hard', `x² - ${smallerRoot + largerRoot}x + ${smallerRoot * largerRoot} = 0\nFind larger root`, largerRoot);
  }

  for (let n = 6; n <= 30; n += 1) {
    for (let r = 2; r <= 4; r += 1) {
      add(4, 'permutations', 'hard', `Find ${n}P${r}`, permutation(n, r));
      add(4, 'combinations', 'hard', `Find ${n}C${r}`, combination(n, r));
    }
  }
}

function generateLevel5() {
  for (let k = 0; k < 50; k += 1) {
    const coefficient = 2 + (k % 10);
    const constant = Math.floor(k / 10);
    add(5, 'definite integrals', 'hard', `∫(${coefficient}x + ${constant}) dx\nfrom 0 to 4 = ?`, (coefficient * 8) + (constant * 4));

    const a = 1 + (k % 10);
    const b = Math.floor(k / 10);
    add(5, 'definite integrals', 'hard', `∫(${a}x² + ${b}) dx\nfrom 0 to 3 = ?`, (a * 9) + (b * 3));

    const sum = 3 + k;
    add(5, 'advanced algebra', 'hard', `x + 1/x = ${sum}, x ≠ 0\nFind x² + 1/x²`, (sum * sum) - 2);

    const first = 2 + (k % 10);
    const second = 20 + Math.floor(k / 10);
    add(5, 'mathematical reasoning', 'hard', `a + b = ${first + second}, ab = ${first * second}\nFind a² + b²`, (first * first) + (second * second));

    const difference = 1 + k;
    add(5, 'advanced algebra', 'hard', `x - 1/x = ${difference}, x ≠ 0\nFind x² + 1/x²`, (difference * difference) + 2);
  }
}

async function validateAndWrite() {
  generateLevel1();
  generateLevel2();
  generateLevel3();
  generateLevel4();
  generateLevel5();

  for (let level = 1; level <= 5; level += 1) {
    const count = questions.filter((question) => question.level === level).length;
    if (count !== 250) throw new Error(`Level ${level} has ${count} questions instead of 250.`);
  }
  if (questions.length !== 1250) throw new Error(`Generated ${questions.length} questions instead of 1250.`);

  await Promise.all(questions.map((question) => new Question(question).validate()));
  const destination = path.resolve(__dirname, '../data/questions.json');
  await fs.writeFile(destination, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
  console.log(`Validated and wrote ${questions.length} unique questions to ${destination}.`);
}

validateAndWrite().catch((error) => {
  console.error(`Question generation failed: ${error.message}`);
  process.exitCode = 1;
});
