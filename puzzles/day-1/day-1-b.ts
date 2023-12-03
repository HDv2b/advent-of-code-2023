import { readData } from '../../shared.ts';
import chalk from 'chalk';

const firstAndLastNumberRegex =
  /(?<first>\d|one|two|three|four|five|six|seven|eight|nine).*(?<last>\d|one|two|three|four|five|six|seven|eight|nine)|(?<alone>\d|one|two|three|four|five|six|seven|eight|nine)/;

function toNumber(s: string): number {
  switch (s) {
    case 'one':
      return 1;
    case 'two':
      return 2;
    case 'three':
      return 3;
    case 'four':
      return 4;
    case 'five':
      return 5;
    case 'six':
      return 6;
    case 'seven':
      return 7;
    case 'eight':
      return 8;
    case 'nine':
      return 9;
    default:
      return parseInt(s, 10);
  }
}

export async function day1b(dataPath?: string) {
  const data = await readData(dataPath);

  return data.reduce((total: number, line: string) => {
    const { first, last, alone } = line.match(firstAndLastNumberRegex).groups;

    const lineValue = alone
      ? toNumber(alone) * 11
      : toNumber(first) * 10 + toNumber(last);

    return total + lineValue;
  }, 0);
}

const answer = await day1b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
