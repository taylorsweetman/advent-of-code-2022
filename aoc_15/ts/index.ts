import {
  logAndAssert,
  mergeAll,
  readInput,
  Coord,
  CoordPair,
} from "../../ts_lib";

type SensorInfo = {
  sensorLoc: Coord;
  beaconLoc: Coord;
  mDist: number;
};

const findMDist = (pair: CoordPair): number =>
  Math.abs(pair[0].x - pair[1].x) + Math.abs(pair[0].y - pair[1].y);

const parse = (input: string): SensorInfo[] => {
  const lines = input.split("\n");
  const coordinatePairs: CoordPair[] = lines.map((line) =>
    line.split(":").reduce(
      (acc, text, idx) => {
        const matches = (text.match(/[0-9-]+/g) ?? []) as number[];
        if (idx === 0) return [Coord.fromArr(matches), acc[1]];
        return [acc[0], Coord.fromArr(matches)];
      },
      [new Coord("-1,-1"), new Coord("-1,-1")]
    )
  );

  return coordinatePairs.map((pair) => ({
    sensorLoc: pair[0],
    beaconLoc: pair[1],
    mDist: findMDist(pair),
  }));
};

const findMinAndMaxTouchesOfRow =
  (
    yIdx: number,
    hardMin: number = Number.MIN_SAFE_INTEGER,
    hardMax: number = Number.MAX_SAFE_INTEGER
  ) =>
  (sensor: SensorInfo): Coord => {
    const { sensorLoc, mDist } = sensor;
    const { x: sensorX, y: sensorY } = sensorLoc;

    const distanceFromRow = Math.abs(yIdx - sensorY);
    const leftOver = mDist - distanceFromRow;
    if (leftOver < 0) return Coord.fromArr([0, 0]);

    const min = Math.max(sensorX - leftOver, hardMin);
    const max = Math.min(sensorX + leftOver, hardMax);
    return Coord.fromArr([min, max]);
  };

const findRowTouches =
  (
    yIdx: number,
    hardMin: number = Number.MIN_SAFE_INTEGER,
    hardMax: number = Number.MAX_SAFE_INTEGER
  ) =>
  (sensors: SensorInfo[]): Coord[] => {
    const minMaxer = findMinAndMaxTouchesOfRow(yIdx, hardMin, hardMax);
    return sensors.reduce(
      (acc, current) => {
        const minMax = minMaxer(current);
        return mergeAll(minMax, acc);
      },
      [Coord.fromArr([0, 0])]
    );
  };

const containedCount = (arrs: Coord[]) =>
  arrs.reduce((acc, current) => acc + (current.y - current.x), 0);

const main = () => {
  const sensors = parse(readInput(__dirname));

  // Part 1
  const Y = 2_000_000;

  const rowTouches = findRowTouches(Y)(sensors);
  const rowTouchesCount = containedCount(rowTouches);
  logAndAssert(rowTouchesCount, 5_040_643);

  // Part 2
  console.warn("Part 2 will take over 10 seconds to run");
  const MIN = 0;
  const MAX = 4000000;

  for (let i = MAX; i >= MIN; i--) {
    const rowTouches = findRowTouches(i, MIN, MAX)(sensors);
    if (rowTouches.length > 1) {
      const firstTouchLine =
        rowTouches[0].x < rowTouches[1].x ? rowTouches[0] : rowTouches[1];
      const tuningFreq = (firstTouchLine.y + 1) * MAX + i;
      logAndAssert(tuningFreq, 11_016_575_214_126);
      break;
    }
  }
};

main();
