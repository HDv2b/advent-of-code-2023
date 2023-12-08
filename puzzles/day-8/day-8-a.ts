import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day8a(dataPath?: string) {
  const data = await readData(dataPath);

  let instructions = [];
  let map: Record<string, string[]> = {};

  for (let l = 0; l < data.length; l++) {
    const line = data[l];

    if (l === 0) {
      instructions = line.split('');
    }

    if (l > 1) {
      const wp = line.split(' = ');
      map[wp[0]] = wp[1]
        .split(', ')
        .map((s) => s.replace('(', '').replace(')', ''));
    }
  }

  let steps = 0;
  let s = 0;
  let currentStep = 'AAA';

  while (currentStep !== 'ZZZ') {
    steps += 1;
    currentStep =
      instructions[s] === 'L' ? map[currentStep][0] : map[currentStep][1];
    s++;
    if (s === instructions.length) {
      s = 0
    }
  }

  return steps;
}

const answer = await day8a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
