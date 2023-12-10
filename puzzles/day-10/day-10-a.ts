import { readData } from '../../shared.ts';
import chalk from 'chalk';

type Coords = { l: number; c: number };

function getNext(map: string[][], steps: Coords[]): Coords {
  const currentStep = steps.at(-1);
  const lastStep = steps.at(-2);

  switch (map[currentStep.l][currentStep.c]) {
    case '-':
      return lastStep.c === currentStep.c - 1
        ? { ...currentStep, c: currentStep.c + 1 }
        : { ...currentStep, c: currentStep.c - 1 };
    case '|':
      return lastStep.l === currentStep.l - 1
        ? { ...currentStep, l: currentStep.l + 1 }
        : { ...currentStep, l: currentStep.l - 1 };
    case '7':
      return lastStep.c === currentStep.c - 1
        ? { ...currentStep, l: currentStep.l + 1 }
        : { ...currentStep, c: currentStep.c - 1 };
    case 'J':
      return lastStep.c === currentStep.c - 1
        ? { ...currentStep, l: currentStep.l - 1 }
        : { ...currentStep, c: currentStep.c - 1 };
    case 'L':
      return lastStep.c === currentStep.c + 1
        ? { ...currentStep, l: currentStep.l - 1 }
        : { ...currentStep, c: currentStep.c + 1 };
    case 'F':
      return lastStep.c === currentStep.c + 1
        ? { ...currentStep, l: currentStep.l + 1 }
        : { ...currentStep, c: currentStep.c + 1 };
  }
}

export async function day10a(dataPath?: string) {
  const data = await readData(dataPath);

  const map: string[][] = data.map((line) => line.split(''));

  const lines = map.length;
  const cols = map[0].length;

  let coords: Coords;

  for (let l = 0; l < lines; l++) {
    for (let c = 0; c < cols; c++) {
      if (map[l][c] === 'S') {
        coords = { l, c };
      }
    }
  }

  let routeA: Coords[] = [coords];
  let routeB: Coords[] = [coords];

  if (coords.l > 0 && ['F', '7', '|'].includes(map[coords.l - 1][coords.c])) {
    routeA.push({ ...coords, l: coords.l - 1 });
  }

  if (
    coords.l < lines &&
    ['J', 'L', '|'].includes(map[coords.l + 1][coords.c])
  ) {
    if (routeA.length === 1) {
      routeA.push({ ...coords, l: coords.l + 1 });
    } else {
      routeB.push({ ...coords, l: coords.l + 1 });
    }
  }

  if (coords.c > 0 && ['F', 'L', '-'].includes(map[coords.l][coords.c - 1])) {
    if (routeA.length === 1) {
      routeA.push({ ...coords, c: coords.c - 1 });
    } else {
      routeB.push({ ...coords, c: coords.c - 1 });
    }
  }

  if (
    coords.c < cols &&
    ['J', '7', '-'].includes(map[coords.l][coords.c + 1])
  ) {
    routeB.push({ ...coords, c: coords.c + 1 });
  }

  while (
    routeA.at(-1).l !== routeB.at(-1).l ||
    routeA.at(-1).c !== routeB.at(-1).c
  ) {
    routeA.push(getNext(map, routeA));
    routeB.push(getNext(map, routeB));
  }

  return routeA.length - 1;
}

const answer = await day10a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
