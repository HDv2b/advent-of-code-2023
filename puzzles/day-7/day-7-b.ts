import { readData } from '../../shared.ts';
import chalk from 'chalk';

type Hand = [number, number, number, number, number];
type CalculatedHand = [number, ...Hand];

function calculateHand(hand: Hand): CalculatedHand {
  const sortedHand = <Hand>[...hand].sort((a, b) => b - a);
  const woJokers = sortedHand.filter((n) => n !== 1);
  // 5 of a kind
  if (woJokers.every((card) => card === woJokers[0])) {
    return [6, ...hand];
  }
  // 4 of a kind
  if (
    (woJokers.length === 5 &&
      (woJokers[0] === woJokers[3] || woJokers[1] === woJokers[4])) ||
    (woJokers.length === 4 &&
      (woJokers[0] === woJokers[2] || woJokers[1] === woJokers[3])) ||
    (woJokers.length === 3 &&
      (woJokers[0] === woJokers[1] || woJokers[1] === woJokers[2])) ||
    woJokers.length <= 2
  ) {
    return [5, ...hand];
  }
  // full house
  if (
    // [BBBAA]
    (sortedHand[0] === sortedHand[2] && sortedHand[3] === sortedHand[4]) ||
    // [BBAAA]
    (sortedHand[0] === sortedHand[1] && sortedHand[2] === sortedHand[4]) ||
    // [BBAA*]
    (woJokers.length === 4 &&
      woJokers[0] === woJokers[1] &&
      woJokers[2] === woJokers[3]) ||
    // [BBA**] or [BAA**]
    (woJokers.length === 3 &&
      woJokers[0] === woJokers[1] &&
      woJokers[1] === woJokers[2]) ||
    // [BB***] or [BA***]
    woJokers.length === 2
  ) {
    return [4, ...hand];
  }
  // 3 of a kind
  if (
    woJokers.length < 4 || // [A] or [BA] or [CBA]
    (woJokers.length === 4 &&
      (woJokers[0] === woJokers[1] ||
        woJokers[1] === woJokers[2] ||
        woJokers[2] === woJokers[3])) || // [CCBA] or [CBBA] or [CBAA]
    (woJokers.length === 5 &&
      (woJokers[0] === woJokers[2] ||
        woJokers[1] === woJokers[3] ||
        woJokers[2] === woJokers[4])) // [CCCBA] or [CBBBA] or [CBAAA]
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
  pairs += 5 - woJokers.length;
  return [pairs, ...hand];
}
export async function day7b(dataPath?: string) {
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
              case 'T':
                return 10;
              // J is now Joker, the weakest card
              case 'J':
                return 1;
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

const answer = await day7b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
