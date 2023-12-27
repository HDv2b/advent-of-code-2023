import { readData } from '../../shared.ts';
import chalk from 'chalk';

let W: number;

function moveNorth(balls: bigint[], blocks: bigint[]): bigint[] {
  const updatedBalls = [...balls];
  for (let i = 1; i < balls.length; i++) {
    for (let j = i - 1; j >= 0; j--) {
      const lineMovingUp = updatedBalls[j + 1];
      const lineMovedInto = updatedBalls[j] | blocks[j];

      /*       console.log({ i, j }, updatedBalls[j], blocks[j], {
        lineMovedInto,
        lineMovingUp,
      });

      console.log('------');
      console.log(lineMovedInto.toString(2));
      console.log(lineMovingUp.toString(2), '^');
      console.log('------'); */

      const moved = lineMovingUp & ~lineMovedInto;
      const remaining = lineMovingUp & lineMovedInto;
      const updatedLineMovedInto = moved | updatedBalls[j];

      /*       console.log({
        moved: moved.toString(2).padStart(10, '0'),
        remaining: remaining.toString(2).padStart(10, '0'),
        updatedLineMovedInto: updatedLineMovedInto
          .toString(2)
          .padStart(10, '0'),
      }); */

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

export async function day14b(dataPath?: string) {
  const data = await readData(dataPath);
  W = data[0].length;

  let balls: bigint[] = data.map((row) =>
    BigInt(parseInt(row.replace(/O/g, '1').replace(/[#\.]/g, '0'), 2))
  );
  let blocks: bigint[] = data.map((row) =>
    BigInt(parseInt(row.replace(/#/g, '1').replace(/[O\.]/g, '0'), 2))
  );

  /*   console.log(
    balls
      .map((x) => x.toString(2).padStart(data[0].length, '0'))
      .join('\n')
  );
  console.log('--------------------------------------------------');
  console.log(
    blocks
      .map((x) => x.toString(2).padStart(data[0].length, '0'))
      .join('\n')
  ); */

  let updatedBalls = balls;

  for (let y = 0; y < 1000000000; y++) {
    const cache = [...updatedBalls];
    updatedBalls = moveNorth(updatedBalls, blocks);
    updatedBalls = moveWest(updatedBalls, blocks);
    updatedBalls = moveSouth(updatedBalls, blocks);
    updatedBalls = moveEast(updatedBalls, blocks);

    if (cache.every((x, i) => x === updatedBalls[i])) {
      console.log('DONE');
      console.log(updatedBalls);
      process.exit(0);
    }
  }

  console.log(
    updatedBalls
      .map((x) =>
        x.toString(2).padStart(data[0].length, '0').replace(/0/g, '.')
      )
      .join('\n')
  );

  return 0;
}

const answer = await day14b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
