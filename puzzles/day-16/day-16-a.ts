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

export async function day16a(dataPath?: string) {
  console.log('starting');
  const map: MapCell[][] = (await readData(dataPath)).filter(row => row.length).map(row => row.split('') as MapCell[]);
  const energised = structuredClone(map).map(row => row.map(() => false));

  // seed queue of routes with opening route
  const queue: Start[] = [{coords: [0,0], direction: 'r'}];
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

  console.log(energised.map(row => row.map(c => c ? '#' : ' ').join('')).join('\n'));

  return energised.reduce((sum, row) => {
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

const answer = await day16a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
