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

export async function day10b(dataPath?: string) {
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

  const fullRoute = [...routeA, ...routeB];

  // scan each row of the map.
  // for each row, if a column is found to exist in our route, we have a boundary.
  // keep track of if that boundary is entering or leaving the inside area.
  // for each step inside, increase the counter

  // for corners, need to sometimes keep track of the previous character to determine 
  // if the boundary is being crossed or followed

  let insideCount = 0;
  let thisAction: string;
  let lastAction: string;
  for (let line = 0; line < lines; line++) {
    let inside = false;
    lastAction = null;
    for (let col = 0; col < cols; col++) {
      if (fullRoute.find((p) => p.l === line && p.c === col)) {
        thisAction = map[line][col];

        // console.log(
        //   { line, col, inside, insideCount, lastAction },
        //   map[line][col]
        // );

        switch (thisAction) {
          case '-':
            break;
          case '7':
            /*

            7 can follow S L F

            ...S--------7..... S opens, 7 closes
            ...|        |....
            ...L-----7  |....  L opens, 7 stays open
            .........|  L--7.  L closes, 7 stays closed
            .........|     |.

            ...F--------7....  F opens, 7 closes
            ...|   F-7  |....  F closes, 7 opens    


            | |.|   S--------7      S closes, 7 opens
            | |.|   |........|
            | |.|   L-----7..|      L closes, 7 stays closed
            | |.|         |..L--7   L opens, 7 stays open
            | |.|         |.....|

            | |.|   F--------7      F closes, 7 opens
            | |.|   |...F-7..|      F opens, 7 closes    

            */
            // after L, do nothing
            // after F or S, switch
            if (['F', 'S'].includes(lastAction)) {
              inside = !inside;
            }
            break;
          case 'F':
            /*
            F can follow S J 7

            .---7       F---- 7 opens, f closes
            ....|       L---7
            ....|           |
            ....S       F---J S opens, f closes
            .F--J       L--7  
            .|             |
            .L--7          |
            ....J       F--J  J opens, f closes


            | |.|   L--7.......F--J   |. 7 closes, f opens
            | |.|      |.......L---7  |.
            | |.|      |...........|  |.
            | |.|      S.......F---J  |. S closes, f opens
            | |.|   F--J.......L--7   |. 
            | |.|   |.............|   |.
            | |.|   L--7..........|   |.
            | |.|   F--J.......F--J   |. F opens, J closes, F Opens

            */

            inside = !inside;
            break;
          case 'L':
            // L can follow S 7 J

            /*
              .| S.......L---   S closes, L opens
              ---S       L---   S opens, L closes
              ---7.......L---   7 closes, L opens
              ---7       L---   7 opens, L closes
              ---J.......L---   7 closes, L opens
              ---J       L---   7 opens, L closes
            */
            inside = !inside;
            break;
          case 'J':
            // J can follow S (only if S is opener) L F
            /*
              .| |.......|  |
              .| S-------J  |    S closes, J opens
              .|            |

              ...........|  |
              ...S-------J  |    S opens, J stays open
              ...|          |

              ...|       |...
              ...L-------J...   L opens, J closes
              ...............

              .| |.......|  |.
              .| L-------J  |.   L closes, J opens
              .|            |.

              .........|  |. 
              ...F-----J  |.    F opens, J stays open
              ...|        |.

              .|         |..
              .| F-------J..    F closes, J stays closed
              .| |..........
            */

            // S: always open
            // L: switch
            // F: do nothing
            if (['S'].includes(lastAction)) {
              inside = true;
            }
            if (['L'].includes(lastAction)) {
              inside = !inside;
            }
            break;
          default:
            inside = !inside;
            break;
        }

        if (thisAction !== '-') {
          lastAction = thisAction;
        }
      } else if (inside) {
        insideCount++;
      }
    }
  }

  return insideCount;
}

const answer = await day10b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
