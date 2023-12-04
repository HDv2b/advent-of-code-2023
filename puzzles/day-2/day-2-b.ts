import { readData } from '../../shared.ts';
import chalk from 'chalk';

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

function calculateForGame(game): number {
  const lowestCount: Partial<Record<'red' | 'green' | 'blue', number>> = {};
  const draws = game.split(': ')[1].split('; ');
  draws.forEach((draw) => {
    console.log(draw);
    const cubes = draw.split(', ');
    const count = {};
    cubes.forEach((colourCount) => {
      const [number, colour] = colourCount.split(' ');
      const thisColourCount = parseInt(number, 10);
      if (!lowestCount[colour] || lowestCount[colour] < thisColourCount) {
        lowestCount[colour] = thisColourCount;
      }
    });
  });

  const power = Object.values(lowestCount).reduce(
    (product, number) => number * product,
    1
  );

  return power;
}

export async function day2b(dataPath?: string) {
  const data = await readData(dataPath);

  return data.reduce((result, game, i) => {
    const gameResult = calculateForGame(game);

    return result + gameResult;
  }, 0);
}

const answer = await day2b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
