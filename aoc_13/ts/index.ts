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
): boolean | null => {
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
      return inCorrectOrder([leftAtI, [rightAtI]], [left, right]);
    } else if (isArr(rightAtI) && !isArr(leftAtI)) {
      return inCorrectOrder([[leftAtI], rightAtI], [left, right]);
    }
  }

  // left ran out of elements first
  if (left.length !== right.length) {
    return true;
  }

  if (currentArray[0].length === 0 && currentArray[1].length === 0) {
    return null;
  }

  // both arrays; no decision yet
  return inCorrectOrder([currentArray[0].slice(1), currentArray[1].slice(1)]);
};

const comparator = (a: Packet[], b: Packet[]) =>
  inCorrectOrder([a, b]) === null ? 0 : inCorrectOrder([a, b]) ? -1 : 1;

const main = () => {
  const packetPairs = parse(readInput(__dirname));

  // Part 1
  const correctOrderPacketIdxs = packetPairs.reduce(
    (acc, pair, idx) => (inCorrectOrder(pair) ? [...acc, idx + 1] : acc),
    [] as number[]
  );
  logAndAssert(sum(correctOrderPacketIdxs), 6_070);

  // Part 2
  const dividorPackets: Pair = [[[2]], [[6]]];
  const allPackets: Packet[][] = [
    ...packetPairs.flatMap(([left, right]) => [left, right]),
    ...dividorPackets,
  ];
  allPackets.sort(comparator);

  const decoderKey = allPackets.reduce((acc, current, idx) => {
    if (dividorPackets.includes(current)) {
      return acc * (idx + 1);
    }

    return acc;
  }, 1);
  logAndAssert(decoderKey, 20_758);
};

main();
