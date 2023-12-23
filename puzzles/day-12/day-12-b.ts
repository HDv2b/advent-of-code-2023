import { readData } from '../../shared.ts';
import chalk from 'chalk';

function proposeGapAndBlockFit(
  lineSection: string[],
  gapLength: number,
  blockLength: number
) {
  const gapSprings = lineSection.slice(0, gapLength);
  const blockSprings = lineSection.slice(gapLength, gapLength + blockLength);

  // console.log(
  //   'try',
  //   gapSprings,
  //   blockSprings,
  //   gapSprings.every((c) => c !== '#') && blockSprings.every((c) => c !== '.')
  // );

  return (
    gapSprings.every((c) => c !== '#') && blockSprings.every((c) => c !== '.')
  );
}

function noHashRemains(lineSection: string[]) {
  // console.log('checking', lineSection);
  return lineSection.every((c) => c !== '#');
}

function chain(
  remainingSprings: string[], // includes leading gap
  remainingNumbers: number[],
  chainSoFar: number[],
  cache
): number {
  const cacheKey = `${remainingSprings.join('s')}-${remainingNumbers.join(
    'n'
  )}`;
  const cacheFetch = cache.get(cacheKey);
  if (cacheFetch) {
    return cacheFetch;
  }
  // console.log(remainingSprings, remainingNumbers, chainSoFar);

  const sumOfRemainingBlocks = remainingNumbers.reduce((sum, n) => sum + n, 0);
  const remainingSpringsLength = remainingSprings.length;
  const remainingGaps = remainingNumbers.length - 1;
  const thisBlock = remainingNumbers[0];
  const thisGapMaxLength =
    remainingSpringsLength - (sumOfRemainingBlocks + remainingGaps);

  let possibilities = 0;

  // console.log({
  //   remainingSpringsLength,
  //   sumOfRemainingBlocks,
  //   remainingGaps,
  //   thisGapMaxLength,
  // });
  // console.log(chainSoFar.length === 0 ? 0 : 1);

  for (
    let maybeGapLength = chainSoFar.length === 0 ? 0 : 1;
    maybeGapLength <= thisGapMaxLength;
    maybeGapLength++
  ) {
    // console.log({
    //   maybeGapLength,
    //   thisGapMaxLength,
    //   remainingSprings,
    //   thisBlock,
    // });
    if (proposeGapAndBlockFit(remainingSprings, maybeGapLength, thisBlock)) {
      const updatedChain = [...chainSoFar, maybeGapLength, thisBlock];
      // console.log({ remainingSprings, maybeGapLength });
      if (
        remainingNumbers.length - 1 &&
        remainingSprings.length - maybeGapLength
      ) {
        // console.log('pass');
        possibilities += chain(
          remainingSprings.slice(maybeGapLength + thisBlock),
          remainingNumbers.slice(1),
          updatedChain,
          cache
        );
      } else if (
        noHashRemains(remainingSprings.slice(maybeGapLength + thisBlock))
      ) {
        // console.log('yay', updatedChain);
        possibilities++;
      }
    }
  }

  cache.set(cacheKey, possibilities);

  return possibilities;
}

function getPossibleArrangements(line: string): number {
  const parts = line.split(' ');
  const springs: string[] = parts[0].split('');
  const numbers: number[] = parts[1].split(',').map((n) => parseInt(n, 10));

  const cache = new Map();

  const moreSprings = [
    ...springs,
    '?',
    ...springs,
    '?',
    ...springs,
    '?',
    ...springs,
    '?',
    ...springs,
  ];
  /*   .reduce(
    (acc, char) => {
      if (char !== '.') {
        acc[acc.length - 1]++;
      } else if (acc[acc.length - 1] !== 0) {
        acc.push(0);
      }
      return acc;
    },
    [0]
  ); */

  //console.log(moreSprings);

  const moreNumbers = [
    ...numbers,
    ...numbers,
    ...numbers,
    ...numbers,
    ...numbers,
  ];

  let possibilities = chain(moreSprings, moreNumbers, [], cache);

  return possibilities;
}

export async function day12b(dataPath?: string) {
  const data = await readData(dataPath);

  let progress = 1;
  return data.reduce((total: number, line: string) => {
    const possibilities = getPossibleArrangements(line);
    console.log(progress, possibilities);
    progress++;
    return total + possibilities;
  }, 0);
}

const answer = await day12b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
