import { logAndAssert, readInput, sum } from "../../ts_lib";

type Packet = number | Packet[];
type Pair = [Packet[], Packet[]];

const parse = (input: string): Pair[] =>
  input.split("\n\n").map((linePairs) => {
    const [left, right] = linePairs.split("\n");
    return [JSON.parse(left), JSON.parse(right)] as Pair;
  });

const isArr = (x: any): x is Packet[] => Array.isArray(x);
const isNum = (x: any): x is number => !isArr(x) && !isNaN(x);

const inCorrectOrder = (
  [left, right]: Pair,
  currentArray: Pair = [left, right]
): boolean => {
  for (let i = 0; i < left.length; i++) {
    const leftAtI = left[i];
    const rightAtI = right[i];

    if (isNum(leftAtI) && isNum(rightAtI) && leftAtI === rightAtI) {
      continue;
    } else if (isNum(leftAtI) && isNum(rightAtI) && leftAtI < rightAtI) {
      return true;
    } else if (isNum(leftAtI) && isNum(rightAtI) && leftAtI > rightAtI) {
      return false;
    }
    // right ran out of elements first
    else if (rightAtI === undefined) {
      return false;
    } else if (isArr(leftAtI) && isArr(rightAtI)) {
      return inCorrectOrder([leftAtI, rightAtI], [left, right]);
    } else if (isArr(leftAtI) && !isArr(rightAtI)) {
      return inCorrectOrder([leftAtI, [rightAtI]]);
    } else if (isArr(rightAtI) && !isArr(leftAtI)) {
      return inCorrectOrder([[leftAtI], rightAtI]);
    }
  }

  // left ran out of elements first
  if (left.length !== right.length) {
    return true;
  }

  // both arrays; no decision yet
  return inCorrectOrder([currentArray[0].slice(1), currentArray[1].slice(1)]);
};

const main = () => {
  const packetPairs = parse(readInput(__dirname));

  // Part 1
  const correctOrderPacketIdxs = packetPairs.reduce(
    (acc, pair, idx) => (inCorrectOrder(pair) ? [...acc, idx + 1] : acc),
    [] as number[]
  );
  logAndAssert(sum(correctOrderPacketIdxs), 6070);
};

main();
