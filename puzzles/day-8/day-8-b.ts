import { readData } from '../../shared.ts';
import chalk from 'chalk';

function gcd(a: number, b: number): number {
  return b == 0 ? a : gcd(b, a % b);
}
function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

type Instruction = 'L' | 'R';

export async function day8b(dataPath?: string) {
  const data = await readData(dataPath);

  let instructions: Instruction[] = []; // ['L','R',...]
  let map: Map<string, string[]> = new Map();
  /*
  {
    'FTD': ['QRN', 'JJC'],
    'LMR': ['KND', 'NTK'],
    ...
  }
  */

  // scrape instructions and map data from file into formats above
  for (let l = 0; l < data.length; l++) {
    const line = data[l];

    if (l === 0) {
      instructions = <Instruction[]>line.split('');
    }

    if (l > 1) {
      const wp = line.split(' = ');
      map.set(
        wp[0],
        wp[1].split(', ').map((s) => s.replace('(', '').replace(')', ''))
      );
    }
  }

  // starting steps are all that end with "A"
  let startingSteps = [...map.keys()].filter((i) => i.endsWith('A'));

  // It is known that there as as many points ending with "A" as wirh "Z"
  // So maybe there is a 1:1 relationship between pairs of A and Z points
  // Meaning hopefully that continuing past Z will return to A in a loop
  // So get the number of steps for each loop and get
  // lowest common multiple of the number of steps of each loop

  const stepCounts: number[] = startingSteps.map((startingStep) => {
    let currentStep: string = startingStep;
    let stepCount: number = 0; // total number of steps so far
    let lri: number = 0; // keep track of which L/R instruction we're at

    while (!currentStep.endsWith('Z')) {
      stepCount += 1;
      currentStep =
        instructions[lri] === 'L'
          ? map.get(currentStep)[0]
          : map.get(currentStep)[1];

      lri++;
      if (lri === instructions.length) {
        lri = 0;
      }
    }

    return stepCount;
  });

  // get lowest common multiple of all step counts
  return stepCounts.reduce((acc, stepCount) => {
    return lcm(acc, stepCount);
  }, 1);
}

const answer = await day8b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
