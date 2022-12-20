import _ from "lodash";
import { logAndAssert, readInput } from "../../ts_lib";

type SensorInfo = {
  sensorLoc: Coord;
  beaconLoc: Coord;
  mDist: number;
};
type Coord = { x: number; y: number };
type CoordPair = [Coord, Coord];

const findMDist = (pair: CoordPair): number =>
  Math.abs(pair[0].x - pair[1].x) + Math.abs(pair[0].y - pair[1].y);

const parse = (input: string): SensorInfo[] => {
  const lines = input.split("\n");
  const coordinatePairs: CoordPair[] = lines.map((line) =>
    line.split(":").reduce(
      (acc, text, idx) => {
        const matches = text.match(/[0-9-]+/g) ?? [];
        if (idx === 0)
          return [
            {
              x: parseInt(matches[0] ?? "-1"),
              y: parseInt(matches[1] ?? "-1"),
            },
            { x: -1, y: -1 },
          ];
        return [
          acc[0],
          { x: parseInt(matches[0] ?? "-1"), y: parseInt(matches[1] ?? "-1") },
        ];
      },
      [
        { x: -1, y: -1 },
        { x: -1, y: -1 },
      ]
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
    if (leftOver < 0) return [hardMax, hardMin];

    const min = Math.max(sensorX - leftOver, hardMin);
    const max = Math.min(sensorX + leftOver, hardMax);
    return [min, max];
  };

const main = () => {
  const sensors = parse(readInput(__dirname));
  const y = 2_000_000;
  const findMinAndMaxAt2Mil = findMinAndMaxTouchesOfRow(y);

  const rowMinAndMax = sensors.reduce(
    (acc, current) => {
      const [currentMin, currentMax] = findMinAndMaxAt2Mil(current);
      return [Math.min(acc[0], currentMin), Math.max(acc[1], currentMax)];
    },
    [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
  );
  logAndAssert(rowMinAndMax[1] - rowMinAndMax[0], 5_040_643);
};

main();
