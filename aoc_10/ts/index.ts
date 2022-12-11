import { logAndAssert, readInput, sum } from "../../ts_lib";
import _ from "lodash";

type Operation = { name: string; V?: number };
type State = { valDuring: number; valAfter: number; cycle: number };

const CYCLES_TO_TRACK = new Set([20, 60, 100, 140, 180, 220]);
const ROW_LEN = 40;

const parse = (input: string): Operation[] => {
  return input
    .split("\n")
    .map((line) => line.split(" "))
    .map((arr) => ({ name: arr[0], V: arr[1] ? parseInt(arr[1]) : undefined }));
};

const performOp = (stateHistory: State[], op: Operation): State[] => {
  const lastState = _.last(stateHistory);
  const valAfterLastCycle = lastState?.valAfter ?? 1;
  const lastCycle = lastState?.cycle ?? 0;

  if (op.name === "noop") {
    return [
      ...stateHistory,
      {
        valDuring: valAfterLastCycle,
        valAfter: valAfterLastCycle,
        cycle: lastCycle + 1,
      },
    ];
  }

  return [
    ...stateHistory,
    {
      valDuring: valAfterLastCycle,
      valAfter: valAfterLastCycle,
      cycle: lastCycle + 1,
    },
    {
      valDuring: valAfterLastCycle,
      valAfter: valAfterLastCycle + (op.V ?? 0),
      cycle: lastCycle + 2,
    },
  ];
};

const renderImg = (stateHistory: State[]) =>
  stateHistory.reduce((acc, current, i) => {
    const spiteLocs = new Set([
      current.valDuring - 1,
      current.valDuring,
      current.valDuring + 1,
    ]);
    const rowIdx = i % ROW_LEN;

    if (rowIdx === 0 && !spiteLocs.has(rowIdx)) return acc + "\n.";
    if (rowIdx === 0 && spiteLocs.has(rowIdx)) return acc + "\n#";
    if (spiteLocs.has(rowIdx)) return acc + "#";
    return acc + ".";
  }, "");

const main = () => {
  const operations = parse(readInput(__dirname));
  const stateHistory = operations.reduce(performOp, []);

  // Part 1
  const cycleSum = sum(
    stateHistory
      .filter((state) => CYCLES_TO_TRACK.has(state.cycle))
      .map((state) => state.cycle * state.valDuring)
  );
  logAndAssert(cycleSum, 13_060);

  // Part 2
  const image = renderImg(stateHistory);
  logAndAssert(
    image,
    `
####...##.#..#.###..#..#.#....###..####.
#.......#.#..#.#..#.#..#.#....#..#....#.
###.....#.#..#.###..#..#.#....#..#...#..
#.......#.#..#.#..#.#..#.#....###...#...
#....#..#.#..#.#..#.#..#.#....#.#..#....
#.....##...##..###...##..####.#..#.####.`
  );
};

main();
