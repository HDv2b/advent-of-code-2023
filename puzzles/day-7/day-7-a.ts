import { readData } from '../../shared.ts';
import chalk from 'chalk';

type Hand = [number, number, number, number, number];
type CalculatedHand = [number, ...Hand];

function calculateHand(hand: Hand): CalculatedHand {
  const sortedHand = [...hand].sort((a, b) => b - a);
  // 5 of a kind
  if (sortedHand.every((card) => card === hand[0])) {
    return [6, ...hand];
  }
  // 4 of a kind
  //  [BAAAA]                         || [BBBBA]
  if (sortedHand[0] === sortedHand[3] || sortedHand[1] === sortedHand[4]) {
    return [5, ...hand];
  }
  // full house
  if (
    // [BBBAA]
    (sortedHand[0] === sortedHand[2] && sortedHand[3] === sortedHand[4]) ||
    // [BBAAA]
    (sortedHand[0] === sortedHand[1] && sortedHand[2] === sortedHand[4])
  ) {
    return [4, ...hand];
  }
  // 3 of a kind
  if (
    sortedHand[0] === sortedHand[2] || // [CCCBA]
    sortedHand[1] === sortedHand[3] || // [CBBBA]
    sortedHand[2] === sortedHand[4] // [CBAAA]
  ) {
    return [3, ...hand];
  }
  // 2, 1 and 0 pairs
  let pairs = 0;
  for (let i = 0; i <= 3; i++) {
    if (sortedHand[i] === sortedHand[i + 1]) {
      pairs += 1;
      i += 1;
    }
  }
  return [pairs, ...hand];
}

export async function day7a(dataPath?: string) {
  const data = await readData(dataPath);

  const games = data
    .map((line): { hand: CalculatedHand; bid: number } => {
      const [hand, bid] = line.split(' ');
      return {
        hand: calculateHand(
          <Hand>hand.split('').map((n) => {
            switch (n) {
              case 'A':
                return 14;
              case 'K':
                return 13;
              case 'Q':
                return 12;
              case 'J':
                return 11;
              case 'T':
                return 10;
              default:
                return parseInt(n, 10);
            }
          })
        ),
        bid: parseInt(bid, 10),
      };
    })
    .sort((a, b) => {
      const handA = a.hand;
      const handB = b.hand;

      return (
        handA[0] - handB[0] ||
        handA[1] - handB[1] ||
        handA[2] - handB[2] ||
        handA[3] - handB[3] ||
        handA[4] - handB[4] ||
        handA[5] - handB[5]
      );
    });

  return games.reduce((sum, game, i) => {
    return sum + game.bid * (i + 1);
  }, 0);
}

const answer = await day7a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
