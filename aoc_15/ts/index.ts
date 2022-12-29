import {
  containedCount,
  logAndAssert,
  mergeAll,
  readInput,
  Coord,
} from "../../ts_lib";

type SensorInfo = {
  sensorLoc: Coord;
  beaconLoc: Coord;
  mDist: number;
};
type CoordPair = [Coord, Coord];

const findMDist = (pair: CoordPair): number =>
  Math.abs(pair[0].x - pair[1].x) + Math.abs(pair[0].y - pair[1].y);

const parse = (input: string): SensorInfo[] => {
  const lines = input.split("\n");
  const coordinatePairs: CoordPair[] = lines.map((line) =>
    line.split(":").reduce(
      (acc, text, idx) => {
        const matches = text.match(/[0-9-]+/g) ?? [];
        if (idx === 0) return [new Coord(matches.join(",")), acc[1]];
        return [acc[0], new Coord(matches.join(","))];
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
  (sensor: SensorInfo): [number, number] => {
    const { sensorLoc, mDist } = sensor;
    const { x: sensorX, y: sensorY } = sensorLoc;

    const distanceFromRow = Math.abs(yIdx - sensorY);
    const leftOver = mDist - distanceFromRow;
    if (leftOver < 0) return [0, 0];

    const min = Math.max(sensorX - leftOver, hardMin);
    const max = Math.min(sensorX + leftOver, hardMax);
    return [min, max];
  };

const findRowTouches =
  (
    yIdx: number,
    hardMin: number = Number.MIN_SAFE_INTEGER,
    hardMax: number = Number.MAX_SAFE_INTEGER
  ) =>
  (sensors: SensorInfo[]): [number, number][] => {
    const minMaxer = findMinAndMaxTouchesOfRow(yIdx, hardMin, hardMax);
    return sensors.reduce((acc, current) => mergeAll(minMaxer(current), acc), [
      [0, 0],
    ] as [number, number][]);
  };

const main = () => {
  const sensors = parse(readInput(__dirname));

  // Part 1
  const y = 2_000_000;

  const rowTouches = findRowTouches(y)(sensors);
  const rowTouchesCount = containedCount(rowTouches);
  logAndAssert(rowTouchesCount, 5_040_643);
};

main();
