import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day14a(dataPath?: string) {
  const data = await readData(dataPath);

  const tally = data[0].split('').map(() => 0);

  const highestScore = data.length;
  const nextScore = data[0].split('').map(() => highestScore);

  // console.log(tally);
  // console.log(nextScore);

  data.forEach((row, rowI) => {
    row.split('').forEach((col, i) => {
      if (col === 'O') {
        tally[i] += nextScore[i];
        nextScore[i]--;
      } else if (col === '#') {
        nextScore[i] = highestScore - rowI - 1;
      }
    });
    // console.log({ tally });
    // console.log({ nextScore });
  });

  return tally.reduce((sum, n) => n + sum, 0);
}

const answer = await day14a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
