import { readData } from '../../shared.ts';
import chalk from 'chalk';

type MapCell = '.' | '/' | '\\' | '|' | '-';
type Direction = 'u' | 'd' | 'l' | 'r';
type Start = {coords: [number, number], direction: Direction}
type StartHash = `${number}-${number}-${Direction}`;

function hashOfStart(start: Start): StartHash {
  return `${start.coords[0]}-${start.coords[1]}-${start.direction}`;
}

const directionSwitch: Record<
  Direction, Record<
  MapCell, [Direction] | [Direction, Direction]
>
> = {
  'u': {
    '.': ['u'],
    '/': ['r'],
    '\\': ['l'],
    '|': ['u'],
    '-': ['r', 'l'],
  },
  'd': {
    '.': ['d'],
    '/': ['l'],
    '\\': ['r'],
    '|': ['d'],
    '-': ['r', 'l'],
  },
  'l': {
    '.': ['l'],
    '/': ['d'],
    '\\': ['u'],
    '|': ['u', 'd'],
    '-': ['l'],
  },
  'r': {
    '.': ['r'],
    '/': ['u'],
    '\\': ['d'],
    '|': ['u', 'd'],
    '-': ['r'],
  }
} as const

export async function day16b(dataPath?: string) {
  console.log('starting');
  const map: MapCell[][] = (await readData(dataPath)).filter(row => row.length).map(row => row.split('') as MapCell[]);

  let best = 0;

  for(let r = 0; r < map.length; r++) {
    const totalFromL = calcFromStart({coords: [r,0], direction: 'r'}, map);

    if (totalFromL > best) {
      best = totalFromL;
    }

    const totalFromR = calcFromStart({coords: [r,map[0].length - 1], direction: 'l'}, map);

    if (totalFromR > best) {
      best = totalFromR;
    }
  }

  for(let c = 0; c < map[0].length; c++) {
    const totalFromT = calcFromStart({coords: [0, c], direction: 'd'}, map);

    if (totalFromT > best) {
      best = totalFromT;
    }

    const totalFromB = calcFromStart({coords: [map.length - 1, c], direction: 'u'}, map);

    if (totalFromB > best) {
      best = totalFromB;
    }
  }

  return best;
}

function calcFromStart(start: Start, map: MapCell[][]) {
  const energised = structuredClone(map).map(row => row.map(() => false));
  // seed queue of routes with opening route
  const queue: Start[] = [start];
  const blacklist: StartHash[] = [];

  // while queue has items
  while (queue.length > 0) {
    // console.log('new iteration');
    // console.log('queue');
    // console.log(queue);
    // take one (doesn't matter which)
    const start = queue.shift();
    // add starting point to blacklist
    blacklist.push(hashOfStart(start));

    // analyse route up until split
    const route = follow(start, map);

    // for each point along route, add to list of traversed points
    route.path.forEach(([r,c]) => {
      energised[r][c] = true;
    })

    // console.log('last route result');
    // console.log(route);

    // when split is reached, add up to 2 new routes to the queue, ignoring starting points already blacklisted
    if (route.next) {
      //console.log({blacklist})
      route.next.forEach(nextRoute => {
        //console.log(hashOfStart(nextRoute))

        if(!blacklist.includes(hashOfStart(nextRoute))) {
          queue.push(nextRoute);
        }
      })
    }
  }

  return  energised.reduce((sum, row) => {
    return sum + row.reduce((rowSum, n) => {
      return n ? rowSum + 1 : rowSum;
    }, 0)
  }, 0);
}

function follow(start: Start , map: MapCell[][]): {path: [number, number][], next?: Start[]} {
  const path:[number, number][] = [];

  let {coords: [row, col], direction} = start;

  while (row >= 0 && row < map.length && col >= 0 && col < map.length) {
    path.push([row, col]);
    let cell = map[row][col]
    const newDirection = directionSwitch[direction][cell];
    if (newDirection.length === 1) {
      direction = newDirection[0];

      if (direction === 'u') {
        row = row - 1;
      }
      if (direction === 'd') {
        row = row + 1;
      }
      if (direction === 'l') {
        col = col - 1;
      }
      if (direction === 'r') {
        col = col + 1;
      }
    } else {
      if (['r', 'l'].includes(newDirection[0])) {
        return {
          path,
          next: [
            {coords: [row, col], direction: 'r'},
            {coords: [row, col], direction: 'l'}
          ]
        }
      }
      if (['u', 'd'].includes(newDirection[0])) {
        return {
          path,
          next: [
            {coords: [row, col], direction: 'u'},
            {coords: [row, col], direction: 'd'}
          ]
        }
      }
    }
  }

  return {path};
}

const answer = await day16b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
