import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day3a(dataPath?: string) {
  const data = await readData(dataPath);

  const connectedNodes: Boolean[][] = data.reduce(
    (coords, row, rowI) => {
      const newCoords = coords;
      const symbolsInRow = row.matchAll(/([^\.\d])/g);

      for (const symbol of symbolsInRow) {
        const colI = symbol.index;
        for (let r = rowI - 1; r <= rowI + 1; r++) {
          for (let c = colI - 1; c <= colI + 1; c++) {
            if (r > -1 && r < data.length && c > -1 && c < row.length) {
              newCoords[r][c] = true;
            }
          }
        }
      }

      return newCoords;
    },
    data.map((row) => row.split('').map(() => false))
  );

  const connectedNumbers = [];

  data.forEach((row, rowI) => {
    const numbersInRow = row.matchAll(/(\d+)/g);
    for (const number of numbersInRow) {
      let skip = false;
      const c1 = number.index;
      const c2 = c1 + number[0].length - 1;
      for (let c = c1; c <= c2; c++) {
        if (!skip) {
          if (connectedNodes[rowI][c]) {
            skip = true;
            connectedNumbers.push(parseInt(number[0], 10));
          }
        }
      }
    }
  });

  return connectedNumbers.reduce((sum, n) => n + sum, 0);
}

const answer = await day3a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
