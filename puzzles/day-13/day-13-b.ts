import { readData } from '../../shared.ts';
import chalk from 'chalk';

function sameButOne(a: number, b: number): boolean {
  //console.log(a ^ b);

  return [
    1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768,
    65536, 131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608,
  ].includes(a ^ b);
}

function same(a: number, b: number): boolean {
  return (a ^ b) === 0;
}

function getHorizontalReflection(map: number[]): number {
  const mapRows = map.length;
  for (let i = 1; i < map.length; i++) {
    let fromTopSmudgeUsed = false;
    let fromBottomSmudgeUsed = false;

    let fromTopMatch = false;
    if (i % 2 === 1 && sameButOne(map[i], map[0])) {
      fromTopMatch = true;
      fromTopSmudgeUsed = true;
    } else if (i % 2 === 1 && same(map[i], map[0])) {
      fromTopMatch = true;
    }
    if (fromTopMatch) {
      let works = true,
        a: number = 1,
        b: number = i - 1;
      while (works && a < b) {
        if (!fromTopSmudgeUsed && sameButOne(map[a], map[b])) {
          works = true;
          fromTopSmudgeUsed = true;
        } else if (same(map[a], map[b])) {
          works = true;
        } else {
          works = false;
        }
        a++;
        b--;
      }
      if (works && fromTopSmudgeUsed) {
        return a;
      }
    }
    let j = map.length - i - 1;
    let fromBottomMatch = false;
    if ((mapRows - j) % 2 === 0 && sameButOne(map[j], map.at(-1))) {
      fromBottomMatch = true;
      fromBottomSmudgeUsed = true;
    } else if ((mapRows - j) % 2 === 0 && same(map[j], map.at(-1))) {
      fromBottomMatch = true;
    }
    if (fromBottomMatch) {

      let works = true,
        c: number = j + 1,
        d: number = map.length - 2;
      while (works && c < d && (d - c) % 2 === 1) {
        if (!fromBottomSmudgeUsed && sameButOne(map[c], map[d])) {
          works = true;
          fromBottomSmudgeUsed = true;
        } else if (same(map[c], map[d])) {
          works = true;
        } else {
          works = false;
        }
        c++;
        d--;
      }
      if (works && fromBottomSmudgeUsed) {
        return c;
      }
    }
  }

  return 0;
}

function getMapReflection(map: number[], rotatedMap: number[]): number {
  return (
    100 * getHorizontalReflection(map) ||
    getHorizontalReflection(rotatedMap) ||
    0
  );
}

export async function day13b(dataPath?: string) {
  const data: string[] = await readData(dataPath);

  let m = 0;
  const maps: [number[]] = [[]];
  const mapsRotatedString: [string[][]] = [[]];

  for (let row of data) {
    if (row.length === 0) {
      m++;
      maps.push([]);
      mapsRotatedString.push([]);
    } else {
      maps[m].push(parseInt(row.replace(/#/g, '1').replace(/\./g, '0'), 2));

      if (!mapsRotatedString[m].length) {
        mapsRotatedString[m] = row.split('').map((_x) => []);
      }
      row.split('').forEach((char, i) => {
        mapsRotatedString[m][i].unshift(char);
      });
    }
  }

  const mapsRotated: number[][] = mapsRotatedString.map((m) =>
    m
      .map((r) => r.join(''))
      .map((r) => parseInt(r.replace(/#/g, '1').replace(/\./g, '0'), 2))
  );

  return maps.reduce((total, map, i) => {
    console.log('map', i);
    // console.log(map.map((n) => n.toString(2).padStart(9, '0')).join('\n'));
    // console.log('-------------------------');
    // console.log(
    //   mapsRotated[i]
    //     .map(
    //       (n, l) =>
    //         `${l.toString(10).padStart(2, '0')} : ${n
    //           .toString(2)
    //           .padStart(map.length, '0')}`
    //     )
    //     .join('\n')
    //     .replace(/1/g, '#')
    //     .replace(/0/g, '.')
    // );
    // console.log('-------------------------');
    const score = getMapReflection(map, mapsRotated[i]);
    console.log('score', score);
    return total + score;
  }, 0);
}

const answer = await day13b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
