import { readFileSync } from "fs";
import { logAndAssert } from "../../ts_lib";
import _ from "lodash";

// ~~~ I don't even wanna think about the big O time-complexity of the mess below ~~~

const parse = (input: string): number[][] =>
  input.split("\n").map((line) => line.split("").map(Number));

const transpose = (matrix: number[][]): number[][] =>
  _.zip(...matrix) as number[][];

const lTr = (arr: number[], outterIdx: number): [number, number][] => {
  return arr.reduce((acc, current, i) => {
    return current > (_.max(arr.slice(0, i)) ?? -1)
      ? [...acc, [outterIdx, i]]
      : acc;
  }, [] as [number, number][]);
};

const rTl = (arr: number[], outterIdx: number): [number, number][] => {
  return lTr(_.reverse([...arr]), outterIdx).map(([x, y]) => [
    x,
    arr.length - 1 - y,
  ]);
};

const tTb = (arr: number[], outterIdx: number): [number, number][] => {
  return lTr(arr, outterIdx).map(([x, y]) => [y, x]);
};

const bTt = (arr: number[], outterIdx: number): [number, number][] => {
  return rTl(arr, outterIdx).map(([x, y]) => [y, x]);
};

const rVis = (x: number, arr: number[]) => {
  let result = [] as { coord: string; vis: number }[];
  for (let i = 1; i < arr.length - 1; i++) {
    let vis = 0;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] >= arr[i]) {
        vis++;
        break;
      }
      vis++;
    }
    result.push({ coord: `${x}-${i}`, vis });
  }

  return result;
};

const lVis = (x: number, arr: number[]) => {
  let result = [] as { coord: string; vis: number }[];
  for (let i = arr.length - 2; i >= 1; i--) {
    let vis = 0;
    for (let j = i - 1; j >= 0; j--) {
      if (arr[j] >= arr[i]) {
        vis++;
        break;
      }
      vis++;
    }
    result.push({ coord: `${x}-${i}`, vis });
  }

  return result;
};

const uVis = (x: number, arr: number[]): { coord: string; vis: number }[] => {
  return lVis(x, arr).map(({ coord, vis }) => {
    const [x, y] = coord.split("-");
    return { coord: `${y}-${x}`, vis };
  });
};

const dVis = (x: number, arr: number[]): { coord: string; vis: number }[] => {
  return rVis(x, arr).map(({ coord, vis }) => {
    const [x, y] = coord.split("-");
    return { coord: `${y}-${x}`, vis };
  });
};

const main = () => {
  const input = readFileSync("../input.txt", "utf8");
  const matrix = parse(input);
  const matrixT = transpose(matrix);

  // Part 1
  const leftToRight = matrix.flatMap((arr, i) => lTr(arr, i));
  const rightToLeft = matrix.flatMap((arr, i) => rTl(arr, i));
  const topToBottom = matrixT.flatMap((arr, i) => tTb(arr, i));
  const bottomToTop = matrixT.flatMap((arr, i) => bTt(arr, i));

  const visibles = _.uniqWith(
    [...leftToRight, ...rightToLeft, ...topToBottom, ...bottomToTop],
    _.isEqual
  );
  logAndAssert(visibles.length, 1_816);

  // Part 2
  const rightVis = matrix.flatMap((row, i) => rVis(i, row));
  const leftVis = matrix.flatMap((row, i) => lVis(i, row));
  const upVis = matrixT.flatMap((row, i) => uVis(i, row));
  const downVis = matrixT.flatMap((row, i) => dVis(i, row));
  const visMap = [...rightVis, ...leftVis, ...upVis, ...downVis].reduce(
    (acc, current) => {
      return acc[current.coord]
        ? { ...acc, [current.coord]: acc[current.coord] * current.vis }
        : { ...acc, [current.coord]: current.vis };
    },
    {} as Record<string, number>
  );
  logAndAssert(_.max(Object.values(visMap)), 383_520);
};

main();
