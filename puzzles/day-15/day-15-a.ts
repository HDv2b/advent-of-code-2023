import { readData } from '../../shared.ts';
import chalk from 'chalk';

function getScore(chars: string): number {
  let out = 0;

  chars.split('').forEach((c) => {
    const ascii = c.charCodeAt(0);
    out += ascii;
    out *= 17;
    out %= 256;
  });

  return out;
}

export async function day15a(dataPath?: string) {
  const data = await readData(dataPath);

  return data[0]
    .split(',')
    .map(getScore)
    .reduce((total: number, value: number) => value + total, 0);
}

const answer = await day15a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
