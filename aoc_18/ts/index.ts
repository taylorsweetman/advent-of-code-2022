import { logAndAssert, readInput, sum } from "../../ts_lib";

const getAdjacents = (coord: string): string[] => {
  const [X, Y, Z] = coord.split(",").map((n) => parseInt(n));

  return [
    `${X - 1},${Y},${Z}`,
    `${X + 1},${Y},${Z}`,
    `${X},${Y - 1},${Z}`,
    `${X},${Y + 1},${Z}`,
    `${X},${Y},${Z - 1}`,
    `${X},${Y},${Z + 1}`,
  ];
};

const parseCubes = (input: string): Set<string> =>
  input.split("\n").reduce((acc, c) => acc.add(c), new Set<string>());

const main = () => {
  const cubes = parseCubes(readInput(__dirname));

  const uncoveredSides = [...cubes].map((cube) =>
    getAdjacents(cube).reduce((acc, c) => (cubes.has(c) ? acc - 1 : acc), 6)
  );

  logAndAssert(sum(uncoveredSides), 3_610);
};

main();
