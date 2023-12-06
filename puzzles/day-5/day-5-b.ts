import { readData } from '../../shared.ts';
import chalk from 'chalk';

const MODES = [
  'seed-to-soil',
  'soil-to-fertilizer',
  'fertilizer-to-water',
  'water-to-light',
  'light-to-temperature',
  'temperature-to-humidity',
  'humidity-to-location',
] as const;

type Mode = (typeof MODES)[number];
type Triple = [number, number, number];
type Transformer = Partial<Record<Mode, { d: number; s: number; r: number }[]>>;

const isValidMode = (mode: string): mode is Mode => {
  return MODES.includes(mode as Mode);
};

function stringToNumbersArray(line: string): Triple {
  return line.split(' ').map((n) => parseInt(n, 10)) as Triple;
}

function transform(transformer: Transformer, mode: Mode, source: number) {
  const ranges = transformer[mode];
  const applicableRange = ranges.find(
    (range) => range.s <= source && range.s + range.r - 1 >= source
  );
  if (applicableRange) {
    return source - applicableRange.s + applicableRange.d;
  }
  return source;
}

function transformE2E(transformer: Transformer, seed: number) {
  let position = seed;
  for (let mode of MODES) {
    position = transform(transformer, mode, position);
  }
  return position;
}

export async function day5b(dataPath?: string) {
  const data = await readData(dataPath);

  let seeds: number[];
  let currentMode: Mode;
  const transformer: Transformer = {};

  for (let line of data) {
    if (line.startsWith('seeds:')) {
      seeds = stringToNumbersArray(line.split(': ')[1]);
    } else {
      const mode = line.split(' map:')[0];
      if (isValidMode(mode)) {
        currentMode = mode;
      } else if (line.length) {
        const numbers = stringToNumbersArray(line);
        const [d, s, r] = numbers;

        if (!transformer[currentMode]) {
          transformer[currentMode] = [{ d, s, r }];
        } else {
          transformer[currentMode].push({ d, s, r });
        }
      }
    }
  }

  // break this down pair-by-pair as to not kill memory

  const seedRanges: [number, number][] = [];
  for (let i = 0; i < seeds.length; i += 2) {
    seedRanges.push([seeds[i], seeds[i] + seeds[i + 1] - 1]);
  }

  console.log(seedRanges);

  let lowestOfAll = Number.POSITIVE_INFINITY;
  for(let [first, last] of seedRanges) {
    for (let j = first; j <= last; j++) {
      const location = transformE2E(transformer, j);
      if (lowestOfAll > location) {
        lowestOfAll = location;
      }
    }
  }


  return lowestOfAll;
}

const answer = await day5b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
