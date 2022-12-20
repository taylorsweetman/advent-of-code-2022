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

const findRowTouches =
  (yIdx: number) =>
  (sensor: SensorInfo): number[] => {
    const { sensorLoc, mDist } = sensor;
    const { x: sensorX, y: sensorY } = sensorLoc;

    const distanceFromRow = Math.abs(yIdx - sensorY);
    const leftOver = mDist - distanceFromRow;
    if (leftOver < 0) return [];

    const min = sensorX - leftOver;
    const max = sensorX + leftOver;
    return _.range(min, max + 1);
  };

const main = () => {
  const sensors = parse(readInput(__dirname));
  const y = 2_000_000;
  const findTouchesOfRow = findRowTouches(y);

  const uniqTouches = new Set(
    sensors.flatMap((sensor) => findTouchesOfRow(sensor))
  );
  const beaconTouches = new Set(
    sensors
      .filter(({ beaconLoc }) => beaconLoc.y === y)
      .map(({ beaconLoc }) => beaconLoc.x)
  );

  const noBeacon = [...uniqTouches].filter((y) => !beaconTouches.has(y));
  logAndAssert(noBeacon.length, 5_040_643);
};

main();
