import { readData } from '../../shared.ts';
import chalk from 'chalk';

let W: number;
const cache: bigint[][] = [];

function moveNorth(balls: bigint[], blocks: bigint[]): bigint[] {
  const updatedBalls = [...balls];
  for (let i = 1; i < balls.length; i++) {
    for (let j = i - 1; j >= 0; j--) {
      const lineMovingUp = updatedBalls[j + 1];
      const lineMovedInto = updatedBalls[j] | blocks[j];

      const moved = lineMovingUp & ~lineMovedInto;
      const remaining = lineMovingUp & lineMovedInto;
      const updatedLineMovedInto = moved | updatedBalls[j];

      updatedBalls[j] = updatedLineMovedInto;
      updatedBalls[j + 1] = remaining;
    }
  }

  return updatedBalls;
}

function moveSouth(balls: bigint[], blocks: bigint[]): bigint[] {
  return moveNorth([...balls].reverse(), [...blocks].reverse()).reverse();
}

function moveWest(balls: bigint[], blocks: bigint[]): bigint[] {
  const updatedBalls = [...balls];

  balls.forEach((row, i) => {
    let ballsToMove = 0n;
    let updatedRow = 0n;
    let stack = 0n;
    for (let w = 0n; w < W; w++) {
      const bit = 1n << w;
      // console.log(w, bit);
      //  if bit === #
      //    convert ballsToMove to sequence of 1's prceded by number of 0's to pad space
      //  if bit === O
      //    increase ballsToMove counter

      if ((blocks[i] & bit) === bit) {
        /*         console.log(
          '#',
          { updatedrow: updatedRow, ballsToMove, w, stack },
          ballsToMove << stack
        ); */
        updatedRow = updatedRow | (ballsToMove << stack);
        ballsToMove = 0n;
        stack = w;
      }
      if ((row & bit) === bit) {
        ballsToMove = ballsToMove === 0n ? 1n : (ballsToMove << 1n) + 1n;
        // console.log({ ballsToMove });
      } else {
        stack++;
      }
    }
    if (ballsToMove) {
      // console.log('done', { W, stack });
      updatedRow = updatedRow | (ballsToMove << stack);
    }
    // console.log({ updatedrow: updatedRow }, updatedRow.toString(2));
    updatedBalls[i] = updatedRow;
  });

  return updatedBalls;
}

function moveEast(balls: bigint[], blocks: bigint[]): bigint[] {
  const updatedBalls = [...balls];

  balls.forEach((row, i) => {
    let ballsToMove = 0n;
    let updatedRow = 0n;
    let stack = 0n;
    for (let w = 0n; w < W; w++) {
      const bit = 1n << w;
      // console.log(w, bit);
      //  if bit === #
      //    convert ballsToMove to sequence of 1's prceded by number of 0's to pad space
      //  if bit === O
      //    increase ballsToMove counter

      if ((blocks[i] & bit) === bit) {
        /*         console.log(
          '#',
          { updatedrow: updatedRow, ballsToMove, w, stack },
          ballsToMove << stack
        ); */
        updatedRow = updatedRow | (ballsToMove << stack);
        ballsToMove = 0n;
        stack = w + 1n;
      }
      if ((row & bit) === bit) {
        ballsToMove = ballsToMove === 0n ? 1n : (ballsToMove << 1n) + 1n;
        // console.log({ ballsToMove });
      }
    }
    if (ballsToMove) {
      // console.log('done', { W, stack });
      updatedRow = updatedRow | (ballsToMove << stack);
    }
    // console.log({ updatedrow: updatedRow }, updatedRow.toString(2));
    updatedBalls[i] = updatedRow;
  });

  return updatedBalls;
}

function score(map: bigint[], d = false): number {
  let scoreForRow = map.length;
  let total = 0;
  map.forEach((l) => {
    if (d) {
      console.log(l.toString(2));
    }
    const ballsInRow = (l.toString(2).match(/1/g) || []).length;
    if (d) {
      console.log(ballsInRow);
    }
    total += ballsInRow * scoreForRow;
    scoreForRow--;
  });
  return total;
}

export async function day14b(dataPath?: string) {
  const data = await readData(dataPath);
  W = data[0].length;

  let balls: bigint[] = data.map((row, i) =>
    BigInt(`0b` + row.replace(/O/g, '1').replace(/[#\.]/g, '0'))
  );
  let blocks: bigint[] = data.map((row) =>
    BigInt(`0b` + row.replace(/#/g, '1').replace(/[O\.]/g, '0'))
  );

  let updatedBalls = balls;

  for (let y = 0; y < 1000000000; y++) {
    updatedBalls = moveNorth(updatedBalls, blocks);
    updatedBalls = moveWest(updatedBalls, blocks);
    updatedBalls = moveSouth(updatedBalls, blocks);
    updatedBalls = moveEast(updatedBalls, blocks);

    const found = cache.findIndex((cacheItem) =>
      cacheItem.every((i, j) => i === updatedBalls[j])
    );

    if (found > -1) {
      const firstInRange = found;
      const lastInRange = cache.length - 1;
      const range = 1 + lastInRange - firstInRange;

      const winnerIndex =
        ((1_000_000_000 - 1 - firstInRange) % range) + firstInRange;
      // think the -1 is needed to factor in the 0 - indexing
      // should pick out 117 (91286)

      return score(cache[winnerIndex]);
    } else {
      cache.push(updatedBalls);
    }
  }

  return 'oops';
}

const answer = await day14b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
