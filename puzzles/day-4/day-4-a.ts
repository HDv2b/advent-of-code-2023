import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day4a(dataPath?: string) {
  const data = await readData(dataPath);

  const gamesScore = data
    .map((row) => row.split(': ')[1].split('|'))
    .map(([winningNumbers, givenNumbers]) => [
      winningNumbers
        .split(' ')
        .filter(Boolean)
        .map((n) => parseInt(n, 10)),
      givenNumbers
        .split(' ')
        .filter(Boolean)
        .map((n) => parseInt(n, 10)),
    ])
    .map(([winningNumbers, givenNumbers]) => {
      let score = 0;
      givenNumbers.forEach((g) => {
        if (winningNumbers.includes(g)) {
          score++;
        }
      });
      if (score > 0) {
        return Math.pow(2, score - 1);
      }
      return 0;
    })
    .reduce((total, score) => total + score, 0);

  return gamesScore;
}

const answer = await day4a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
