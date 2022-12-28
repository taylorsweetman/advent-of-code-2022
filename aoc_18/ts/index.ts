import { ascending, Coord, logAndAssert, readInput, sum } from "../../ts_lib";

type CubeMap = Map<string, Coord>;
type MinMax = { min: Coord; max: Coord };

const parseCubes = (input: string): CubeMap =>
  input
    .split("\n")
    .reduce((acc, c) => acc.set(c, new Coord(c)), new Map<string, Coord>());

const findMinMaxes = (cubes: CubeMap): MinMax => {
  const [X, Y, Z]: [number[], number[], number[]] = [...cubes].reduce(
    (acc, [_, coord]) => {
      return [
        [...acc[0], coord.x],
        [...acc[1], coord.y],
        [...acc[2], coord.z],
      ];
    },
    [[], [], []] as [number[], number[], number[]]
  );
  X.sort(ascending);
  Y.sort(ascending);
  Z.sort(ascending);

  return {
    min: new Coord(`${X[0] - 1},${Y[0] - 1},${Z[0] - 1}`),
    max: new Coord(
      `${X[X.length - 1] + 1},${Y[Y.length - 1] + 1},${Z[Z.length - 1] + 1}`
    ),
  };
};

const floodFill = (solidCubes: CubeMap, { min, max }: MinMax): CubeMap => {
  const stack: Coord[] = [min];
  const airCubes: CubeMap = new Map<string, Coord>();

  while (stack.length > 0) {
    const currentCube = stack.pop()!;
    if (
      !solidCubes.has(currentCube.id) &&
      !airCubes.has(currentCube.id) &&
      !currentCube.isPastMin(min) &&
      !currentCube.isPastMax(max)
    ) {
      airCubes.set(currentCube.id, currentCube);

      stack.push(currentCube.xMinusOne());
      stack.push(currentCube.xPlusOne());
      stack.push(currentCube.yMinusOne());
      stack.push(currentCube.yPlusOne());
      stack.push(currentCube.zPlusOne());
      stack.push(currentCube.zMinusOne());
    }
  }

  return airCubes;
};

const main = () => {
  const cubes = parseCubes(readInput(__dirname));

  // Part 1
  const uncoveredSides = [...cubes].map(([id, coord]) =>
    coord
      .adjacentCords()
      .reduce((acc, c) => (cubes.has(c.id) ? acc - 1 : acc), 6)
  );
  logAndAssert(sum(uncoveredSides), 3_610);

  // Part 2
  const { min, max } = findMinMaxes(cubes);
  const surfaceAir = floodFill(cubes, { min, max });

  const surfaceSides = [...surfaceAir].reduce((acc, [_, coord]) => {
    const intersectingCubes = coord
      .adjacentCords()
      .filter((c) => cubes.has(c.id));

    return acc + intersectingCubes.length;
  }, 0);
  logAndAssert(surfaceSides, 2_082);
};

main();
