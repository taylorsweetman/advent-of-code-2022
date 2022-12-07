import { readFileSync } from "fs";
import { logAndAssert, sum } from "../../ts_lib";
import _ from "lodash";

// ~~~ WARNING: This one ain't pretty ~~~

const updateDirSizes = (
  fileSize: number,
  currentPath: string,
  pathMap: [string, number][]
) => {
  const matchingPaths = pathMap.filter(([path, size]) =>
    currentPath.startsWith(path)
  );
  matchingPaths.forEach(([path, size]) => {
    _.remove(pathMap, ([innerPath, innerSize]) => path === innerPath);
    pathMap.push([path, size + fileSize]);
  });
};

const parse = (input: string): [string, number][] => {
  let currentPath = "/";
  let pathMap = [["/", 0]] as [string, number][];

  const lines = input.split("\n");

  lines.forEach((line) => {
    if (line === "$ cd /" || line === "$ ls") {
      // noop
    } else if (line === "$ cd ..") {
      currentPath =
        (currentPath.match(/\//g) || []).length === 1
          ? "/"
          : currentPath.substring(0, currentPath.lastIndexOf("/"));
    } else if (line.startsWith("$ cd ")) {
      const name = line.substring(5);
      currentPath = currentPath === "/" ? `/${name}` : `${currentPath}/${name}`;
    } else {
      const [left, right] = line.split(" ");
      if (left === "dir") {
        currentPath === "/"
          ? pathMap.push([`/${right}`, 0])
          : pathMap.push([`${currentPath}/${right}`, 0]);
      } else {
        const fileSize = parseInt(left);
        updateDirSizes(fileSize, currentPath, pathMap);
      }
    }
  });

  return pathMap;
};

const main = () => {
  const input = readFileSync("../input.txt", "utf8");
  const pathMap = parse(input);

  // Part 1
  const qualifyingPathsOne = pathMap
    .filter(([dir, size]) => size <= 100_000)
    .map(([dir, size]) => size);
  logAndAssert(sum(qualifyingPathsOne), 1_141_028);

  // Part 2
  const totalSpace = 70_000_000;
  const requiedSpace = 30_000_000;
  const usedSpace = pathMap.filter(([dir, size]) => dir === "/")[0][1];
  const currentFreeSpace = totalSpace - usedSpace;
  const spaceToFree = requiedSpace - currentFreeSpace;

  const qualifyingPathsTwo = pathMap.filter(
    ([path, size]) => size >= spaceToFree
  );
  const pathSizeToFree = qualifyingPathsTwo.reduce(
    (acc, [path, size]) => (acc > size ? size : acc),
    Number.MAX_SAFE_INTEGER
  );
  logAndAssert(pathSizeToFree, 8_278_005);
};

main();
