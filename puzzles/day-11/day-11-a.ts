import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day11a(dataPath?: string) {
  const data = await readData(dataPath);

  let colNumbers: number[] = [...data[0].split('').keys()];

  console.log({ colNumbers });

  let linesToAdd = 0;
  let galaxies: { line: number; col: number }[] = data.reduce(
    (list, line, lineI) => {
      const gsInLine = [...line.matchAll(/(\#)/g)];

      if (!gsInLine.length) {
        linesToAdd++;
        console.log({ linesToAdd });
      }

      gsInLine.forEach(({ index }) => {
        colNumbers = colNumbers.filter((n) => n !== index);
        list.push({ line: lineI + linesToAdd, col: index });
      });

      return list;
    },
    []
  );

  // console.log({ lineNumbers, colNumbers });

  const galaxiesWithSpaces = galaxies.map((g) => {
    let colsToAdd = colNumbers.findIndex((n) => n > g.col);
    if (colsToAdd === -1) {
      colsToAdd = colNumbers.length;
    }

    return { ...g, col: g.col + colsToAdd };
  });

  //console.log(galaxiesWithSpaces);

  const distances = galaxiesWithSpaces.map((galaxy, i) => {
    let distance = 0;
    for (let go = 0; go < i; go++) {
        distance += Math.abs(galaxy.line - galaxiesWithSpaces[go].line);
        distance += Math.abs(galaxy.col - galaxiesWithSpaces[go].col);
    }
    return distance;
  });

  console.log(distances);

  return distances.reduce((sum, n) => sum + n, 0);
}

const answer = await day11a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
