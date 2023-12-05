import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day4b(dataPath?: string) {
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
      return score;
    });

  const instances = gamesScore.map(() => 1);
  for (let i = 0; i < instances.length; i++) {
    const score = gamesScore[i];
    for (let j = i + 1; j <= i + score; j++) {
      instances[j] += instances[i];
    }
  }

  return instances.reduce((total, n) => total+n, 0);
}

const answer = await day4b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
