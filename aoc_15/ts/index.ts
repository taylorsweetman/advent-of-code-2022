import { readInput } from "../../ts_lib";

type SensorInfo = {
  sensorLoc: [number, number];
  beaconLoc: [number, number];
  mDist: number;
};

type CoordPair = [[number, number], [number, number]];

const findMDist = (pair: CoordPair): number =>
  Math.abs(pair[0][0] - pair[1][0]) + Math.abs(pair[0][1] - pair[1][1]);

const parse = (input: string): SensorInfo[] => {
  const lines = input.split("\n");
  const coordinatePairs: CoordPair[] = lines.map((line) =>
    line.split(":").reduce(
      (acc, text, idx) => {
        const matches = text.match(/[0-9-]+/g) ?? [];
        if (idx === 0)
          return [
            [parseInt(matches[0] ?? "-1"), parseInt(matches[1] ?? "-1")],
            [-1, -1],
          ];
        return [
          acc[0],
          [parseInt(matches[0] ?? "-1"), parseInt(matches[1] ?? "-1")],
        ];
      },
      [
        [-1, -1],
        [-1, -1],
      ]
    )
  );

  return coordinatePairs.map((pair) => ({
    sensorLoc: pair[0],
    beaconLoc: pair[1],
    mDist: findMDist(pair),
  }));
};

const main = () => {
  const sensors = parse(readInput(__dirname));
  console.log(sensors);
};

main();
