import { readData } from '../../shared.ts';
import chalk from 'chalk';

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

export async function day2a(dataPath?: string) {
  const data = await readData(dataPath);

  return data.reduce((result, game, i) => {
    const gameNumber = i + 1;

    const draws = game.split(': ')[1].split('; ');
    const validGame = draws.every((draw) => {
      const cubes = draw.split(', ');
      const count = {};
      cubes.forEach((colourCount) => {
        const [number, colour] = colourCount.split(' ');
        count[colour] = parseInt(number, 10);
      });

      return (
        (!count['red'] || count['red'] <= MAX_RED) &&
        (!count['blue'] || count['blue'] <= MAX_BLUE) &&
        (!count['green'] || count['green'] <= MAX_GREEN)
      );
    });

    if (validGame) {
      return result + gameNumber;
    }

    return result;
  }, 0);
}

const answer = await day2a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
