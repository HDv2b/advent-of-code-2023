import { readData } from '../../shared.ts';
import chalk from 'chalk';

function isPalindrome(str: string): boolean {
  return (
    str.length > 1 &&
    str.length % 2 === 0 &&
    str.split('').reverse().join('') === str
  );
}

function getHorizontalReflection(map: string[]): number {
  for (let i = 1; i < map.length; i++) {
    if (map[i] === map[0]) {
      console.log('from top', i);
      let works = true,
        a: number = 1,
        b: number = i - 1;
      while (works && a < b) {
        works = map[a] === map[b];
        a++;
        b--;
      }
      if (works) {
        return a;
      }
    }
    let j = i - 1;
    if (map[j] === map.at(-1)) {
      console.log('from bottom', j, map[j], map.at(-1));
      let works = true,
        c: number = j + 1,
        d: number = map.length - 2;
      while (works && c < d) {
        works = map[c] === map[d];
        c++;
        d--;
      }
      if (works) {
        return c;
      }
    }
  }

  return 0;
}

function getVerticalReflection(map: string[]): number {
  for (let c = map[0].length; c > 1; c--) {
    if (isPalindrome(map[0].slice(0, c))) {
      console.log('from left', c, map[0].slice(0, c));
      let works = true,
        a: number = 0,
        b: number = c;
      if (
        a === b &&
        map.every((e) => {
          return isPalindrome(e.slice(a, b));
        })
      ) {
        return a;
      }
      while (works && a < b) {
        works = map.every((e) => {
          return isPalindrome(e.slice(a, b));
        });
        a++;
        b--;
      }
      if (works) {
        return a;
      }
    }

    if (isPalindrome(map[0].slice(map[0].length - c))) {
      console.log('from right', c + 1, map[0].slice(map[0].length - c));
      let works = true,
        a: number = map[0].length - c,
        b: number = map[0].length;
      while (works && a < b) {
        works = map.every((e) => isPalindrome(e.slice(a, b)));
        a++;
        b--;
      }
      if (works) {
        return a;
      }
    }
  }
}

function getMapReflection(map: string[]): number {
  return 100 * getHorizontalReflection(map) || getVerticalReflection(map) || 0;
}

export async function day13a(dataPath?: string) {
  const data: string[] = await readData(dataPath);

  let m = 0;
  const maps = [[]];

  for (let row of data) {
    if (row.length === 0) {
      m++;
      maps.push([]);
    } else {
      maps[m].push(row);
    }
  }

  return maps.reduce((total, map, i) => {
    console.log('map', i);
    const score = getMapReflection(map);
    console.log('score', score);
    return total + score;
  }, 0);
}

const answer = await day13a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
