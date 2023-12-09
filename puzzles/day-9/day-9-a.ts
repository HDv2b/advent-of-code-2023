import { readData } from '../../shared.ts';
import chalk from 'chalk';

function getNextNumber(numbers: number[], previousRows: number[][]): number {
  const differences: number[] = [];
  for (let i = 0; i < numbers.length - 1; i++) {
    differences[i] = numbers[i + 1] - numbers[i];
  }

  previousRows.push(differences);

  // save a recursion by simply checking if all are the same, instead of if all are 0
  // no need to go all the way down to 0
  // the number that fills this array is the difference
  return differences.every((n) => n === differences[0])
    ? finalAnalysis(previousRows)
    : getNextNumber(differences, previousRows);
}

function finalAnalysis(numberRows: number[][]): number {
  // just need add up the last number of each row
  return numberRows.reduce((total, row) => {
    return total + row.at(-1);
  }, 0);
}

export async function day9a(dataPath?: string) {
  const data = await readData(dataPath);

  const lines: number[][] = data.map((line: string) =>
    line.split(' ').map((n: string): number => parseInt(n, 10))
  );

  return lines
    .map((line) => getNextNumber(line, [line]))
    .reduce((sum, n) => n + sum, 0);
}

const answer = await day9a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
