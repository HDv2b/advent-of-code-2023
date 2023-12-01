import { readData } from '../../shared.ts';
import chalk from 'chalk';

const firstAndLastNumberRegex = /(?<first>\d).*(?<last>\d)|(?<alone>\d)/;

export async function day1a(dataPath?: string) {
  const data = await readData(dataPath);

  return data.reduce((total: number, line: string) => {
    const { first, last, alone } = line.match(firstAndLastNumberRegex).groups;

    const lineValue = alone
      ? parseInt(alone, 10) * 11
      : parseInt(first, 10) * 10 + parseInt(last, 10);
      
    return total + lineValue;
  }, 0);
}

const answer = await day1a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
