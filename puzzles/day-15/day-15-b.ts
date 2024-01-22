import { readData } from '../../shared.ts';
import chalk from 'chalk';

const rgx = /([a-z]*)(=|-)(\d*)/;

function getBoxLabel(chars: string): number {
  let out = 0;

  chars.split('').forEach((c) => {
    const ascii = c.charCodeAt(0);
    out += ascii;
    out *= 17;
    out %= 256;
  });

  return out;
}

function boxToString(
  box: { lensLabel: string; focalLength: string }[]
): string {
  return box.map((lens) => `${lens.lensLabel} ${lens.focalLength}`).join(' - ');
}

function boxToScore(
  box: { lensLabel: string; focalLength: string }[],
  boxId
): number {
  return box.reduce(
    (total, lens, i) =>
      total + (boxId + 1) * (i + 1) * parseInt(lens.focalLength, 10),
    0
  );
}

export async function day15b(dataPath?: string) {
  const data = await readData(dataPath);
  return (
    data[0]
      .split(',')
      .reduce(
        (
          boxes: { lensLabel: string; focalLength: string }[][],
          chars: string
        ) => {
          const [_, lensLabel, split, focalLength] = chars.match(rgx);

          const boxLabel = getBoxLabel(lensLabel);

          // console.log({ lensLabel, split, focalLength, boxLabel });
          const lensI = boxes[boxLabel]
            ? boxes[boxLabel].findIndex((lens) => lens.lensLabel === lensLabel)
            : -1;

          if (split === '-') {
            if (lensI > -1) {
              boxes[boxLabel].splice(lensI, 1);
            }
          } else {
            if (lensI > -1) {
              boxes[boxLabel][lensI].focalLength = focalLength;
            } else {
              if (!boxes[boxLabel]) {
                boxes[boxLabel] = [];
              }
              boxes[boxLabel].push({ lensLabel, focalLength });
            }
          }

          return boxes;
        },
        new Array(256)
      )
      // .map(boxToString)
      // .join('\n');
      .map(boxToScore)
      .reduce((total, score) => total + score, 0)
  );
}

const answer = await day15b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
