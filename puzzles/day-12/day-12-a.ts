import { readData } from '../../shared.ts';
import chalk from 'chalk';

/**
 * generates list of pairs of numbers which will add up to total
 * can be optionally constrained by minimum values
 *
 * @param total eg 10
 * @param minLeft eg 3
 * @param minRight eg 2
 * @returns eg [[3,7], [4,6], [5,5], [6,4], [7,3], 8,2]
 */
function getPossibleGapPairs(
  total: number,
  minLeft: number = 0,
  minRight: number = 0
): [number, number][] {
  const out: [number, number][] = [];
  let lastOut: [number, number] = [total - minRight, minRight];
  while (lastOut[0] >= minLeft) {
    out.push([...lastOut]);
    lastOut[0]--;
    lastOut[1]++;
  }

  return out;
}

// eg [5, 3]
// gapsRemaining === 4; 3 -> N/A (Error)
// gapsRemaining === 3; 3 -> [1,2] 2 -> [1,1] 1 -> [1,0]
// gapsRemaining === 2; 3 -> [1,2] 2 -> [2,0]
//                                      [1,1]
//                           [2,1] 1 -> [1,0]
// gapsRemaining === 1; 3 -> [1,2]
//                           [2,1]
//                           [3,0]
// gapsRemaining === 0; Error
function splitLastGap(gapsSoFar: number[], gapsRemaining: number): number[][] {
  if (gapsRemaining < 1) {
    throw Error(`gapsRemaining (${gapsRemaining}) < 1`);
  }
  const minLeft = 1;
  const minRight = gapsRemaining - 1;

  const [seed] = gapsSoFar.splice(-1, 1);

  const possibilities = getPossibleGapPairs(seed, minLeft, minRight).map(
    (res) => [...gapsSoFar, ...res]
  );

  return possibilities;
}

// ????.######..#####. 1,6,5
// gap groups = 4 (2 spaces betweem 3 items, + 1 before and after)
// string length = 20
// .'. gap chars total = 20 - (1+6+5) = 8
// [0,8] -> ... -> [0,1,1,6]
// [6,2] -> ... -> [6,1,1,0]

// ?#?#?#?#?#?#?#? 1,3,1,6
// gap groups= 5
// string length = 15
// .'. gap chars total = 15 - (1+3+1+6) = 4
// [0,4] -> ... -> [0,1,1,1,1] / [0,2,1,1,0] / [0,1,2,1,0] / [0,1,1,2,0]
// [1,3] -> ... -> [1,1,1,1,0]

// ???.### 1,1,3
// gap groups = 4
// string langth = 7
// .'. gap chars total = 7 - (1+1+3) = 2
// [0,1,1,0]

/**
 *
 * @param groupLength eg '13'
 * @param constraint eg [1,1,3]
 * @returns all possible gap lengths that can fit inside groupLength while leaving 
 *  room for blocks of size given in the constraint, eg:
 *  [
      [ 7, 1, 1, 0 ], [ 6, 2, 1, 0 ], [ 6, 1, 2, 0 ], [ 6, 1, 1, 1 ],
      [ 5, 3, 1, 0 ], [ 5, 2, 2, 0 ], [ 5, 2, 1, 1 ], [ 5, 1, 3, 0 ],
      ...
    ]

    [ 7, 1, 1, 0 ] would allow eg: .......#.#.###
    [ 5, 1, 3, 0 ] would allow eg: .....#.#...###

 */
function generateGapChains(
  groupLength: number,
  constraint: number[]
): number[][] {
  let remainingGapGroups: number = constraint.length + 1;
  const gapCharCount = groupLength - constraint.reduce((sum, n) => sum + n, 0);

  const firstTwo = getPossibleGapPairs(gapCharCount, 0, remainingGapGroups - 2);

  // first two have been filled
  remainingGapGroups -= 2;

  // split the 2nd to possible combinations of 2nd and 3rd
  let splitted = firstTwo.reduce((acc, chain) => {
    acc.push(...splitLastGap(chain, remainingGapGroups));
    return acc;
  }, []);

  remainingGapGroups--;

  while (remainingGapGroups > 0) {
    splitted = splitted.reduce((acc, chain) => {
      acc.push(...splitLastGap(chain, remainingGapGroups)); // 0

      return acc;
    }, []);

    remainingGapGroups--;
  }

  return splitted;
}

/**
 *
 * @param line
 * @returns
 */
function getPossibleArrangements(line: string): number {
  const parts = line.split(' ');
  const springs: string = parts[0];
  const numbers: number[] = parts[1].split(',').map((n) => parseInt(n, 10));

  // work out possibe gaps between blocks
  const gapChains = generateGapChains(springs.length, numbers);
  const possibleCombinations = gapChains.map((chain) =>
    chainToInt(chain, numbers)
  );

  // "???.###"" becomes "0000111"
  const mustBes = springs.replace(/([\?\.])/g, '0').replace(/([#])/g, '1');
  // "???.###"" becomes "1110111"
  const canBes = springs.replace(/([\.])/g, '0').replace(/([#\?])/g, '1');

  const mustBesBin = parseInt(mustBes, 2);
  const canBesBin = parseInt(canBes, 2);

  let possibles = 0;
  // valid numbers can only be in range of mustBes - canBes, eg 0000111 to 1110111
  for (let c of possibleCombinations) {
    // eg Candidate = 1010111:
    if (
      (mustBesBin & c) === mustBesBin && // 0000111 & 1010111 === 0000111
      (canBesBin & c) === c // 1110111 & 1010111 === 1010111
    ) {
      possibles++;
    }
  }

  return possibles;
}

/**
 * Alternates between gaps and blocks, inserting that number of 0s or 1s respectively
 * @param gaps eg [0,2,1,1,0]
 * @param blocks eg [1,3,1,6]
 * @returns eg 10011101010111111 (5035 in base 10)
 */
function chainToInt(gaps: number[], blocks: number[]): number {
  let out = 0;

  // don't care about first gap
  for (let g = 1; g < gaps.length; g++) {
    const block = blocks[g - 1];
    const gap = gaps[g];
    // add block by making space and then ORing it
    out = (out << block) | (Math.pow(2, block) - 1);
    // add gap by making space
    out = out << gap;
  }

  return out;
}

export async function day12a(dataPath?: string) {
  const data = await readData(dataPath);

  return data.reduce((total: number, line: string) => {
    return total + getPossibleArrangements(line);
  }, 0);
}

const answer = await day12a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
