import { readData } from '../../shared.ts';
import chalk from 'chalk';

function solveQuadratic(a: number, b: number, c: number): [number, number] {
  const sqrtPart = Math.sqrt(b * b - 4 * a * c);
  return [(-b - sqrtPart) / (2 * a), (-b + sqrtPart) / (2 * a)];
}

export async function day6b(dataPath?: string) {
  const data = await readData(dataPath);

  const time: number = parseInt(data[0].split(':')[1].replace(/\s/g, ''), 10);
  const distance: number = parseInt(
    data[1].split(':')[1].replace(/\s/g, ''),
    10
  );

  // where D is distance to beat
  // where T is max time
  // where H is button holding time
  // where R is resulting distance of letting go (fn(H))
  // find min and max H for which R > D
  // H is also equal to speed, which increases by 1mm/ms for every 1mm pressed

  // distance reached = speed * time, where time has holding time deducted
  //
  // R = H * (T - H) = HT - HH
  // proof:
  // eg H = 7ms, T = 7ms: : R = 7 * 7 - 7 * 7 = 0mm
  // eg H = 5ms, T = 7ms: : R = 5 * 7 - 5 * 5 = 10mm
  // eg H = 3ms, T = 7ms: : R = 3 * 7 - 3 * 3 = 12mm

  // .'. need to find intersects where:
  // HT - HH = D
  // Solve using quadratic formula:
  // H = (--T ± sqrt((-T)^2 - 4 * 1 * D)) / 2 * 1

  const h = solveQuadratic(1, -time, distance);

  let minH = Math.ceil(h[0]);
  let maxH = Math.floor(h[1]);

  // need to be excluding bounds (R - D > 0, not ===)
  if (minH === h[0]) {
    minH++;
  }
  if (maxH === h[1]) {
    maxH--;
  }

  return maxH - minH + 1;
}

const answer = await day6b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
