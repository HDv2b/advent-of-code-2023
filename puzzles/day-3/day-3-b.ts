import { readData } from '../../shared.ts';
import chalk from 'chalk';

function generateNumbersIndex(data: string[]): (false | number)[][] {
  const falseGrid: (false | number)[][] = data.map((row) =>
    row.split('').map(() => false)
  );

  return data.reduce((output, row, rowI) => {
    const newGrid = output;

    const numbersInRow = row.matchAll(/(\d+)/g);

    for (const number of numbersInRow) {
      for (let x = number.index; x < number.index + number[0].length; x++) {
        newGrid[rowI][x] = parseInt(number[0], 10);
      }
    }

    return newGrid;
  }, falseGrid);
}

// this wouldn't work if any of the gears had two identical numbers!
function getNumbersForGear(
  data: (false | number)[][],
  row: number,
  col: number
): number[] {
  let foundNumbers = [];
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < data.length && c >= 0 && c < data[r].length) {
        if (data[r][c] && !foundNumbers.includes(data[r][c])) {
          foundNumbers.push(data[r][c]);
        }
      }
    }
  }
  return foundNumbers;
}

export async function day3b(dataPath?: string) {
  const data: string[] = await readData(dataPath);
  const numbersIndex = generateNumbersIndex(data);
  let total: number = 0;

  data.forEach((row, rowI) => {
    const gears = row.matchAll(/(\*)/g);
    for (const gear of gears) {
      const numbers = getNumbersForGear(numbersIndex, rowI, gear.index);
      if (numbers.length === 2) {
        total += numbers[0] * numbers[1];
      }
    }
  });

  return total;
}

const answer = await day3b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
