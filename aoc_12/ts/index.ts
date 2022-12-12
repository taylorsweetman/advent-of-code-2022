import { logAndAssert, readInput } from "../../ts_lib";
import _, { cloneDeep } from "lodash";

type Node = {
  height: string;
  distanceFromStart: number;
};
type State = {
  unvisited: Set<string>;
  nodeMap: Record<string, Node>;
  path: string[];
  startIdx: string;
  destIdx: string;
};

const parse = (input: string): State => {
  const nodeMap: Record<string, Node> = {};
  const unvisited: Set<string> = new Set();
  let currentIdx = "";
  let destIdx = "";

  const lines = input.split("\n");
  lines.forEach((line, xIdx) =>
    line.split("").forEach((char, yIdx) => {
      const nodeIdx = `${xIdx}|${yIdx}`;
      const start = char === "S";
      const dest = char === "E";

      const height = start ? "a" : dest ? "z" : char;
      const distanceFromStart = start ? 0 : Number.MAX_SAFE_INTEGER;
      const node: Node = {
        height,
        distanceFromStart,
      };

      nodeMap[nodeIdx] = node;
      unvisited.add(nodeIdx);
      if (start) currentIdx = nodeIdx;
      if (dest) destIdx = nodeIdx;
    })
  );

  return {
    unvisited,
    nodeMap,
    path: [currentIdx],
    startIdx: currentIdx,
    destIdx,
  };
};

const getUpIdx = (current: string) =>
  current.split("|").reduce((acc, current, i) => {
    if (i === 0) return String(parseInt(current) - 1);
    return `${acc}|${current}`;
  }, "");

const getDownIdx = (current: string) =>
  current.split("|").reduce((acc, current, i) => {
    if (i === 0) return String(parseInt(current) + 1);
    return `${acc}|${current}`;
  }, "");

const getRightIdx = (current: string) =>
  current.split("|").reduce((acc, current, i) => {
    if (i === 0) return current;
    return `${acc}|${parseInt(current) + 1}`;
  }, "");

const getLeftIdx = (current: string) =>
  current.split("|").reduce((acc, current, i) => {
    if (i === 0) return current;
    return `${acc}|${parseInt(current) - 1}`;
  }, "");

const canVisit = (current: Node, toVisit: Node) =>
  toVisit.height.charCodeAt(0) - current.height.charCodeAt(0) <= 1;

const runPathfinder = (currentState: State): State => {
  // TODO: worry about an unreachable destination?
  const { path, nodeMap, unvisited } = currentState;
  const currentIdx = _.last(path) ?? currentState.startIdx;
  const currentNode = nodeMap[currentIdx];

  const upIdx = getUpIdx(currentIdx);
  const downIdx = getDownIdx(currentIdx);
  const rightIdx = getRightIdx(currentIdx);
  const leftIdx = getLeftIdx(currentIdx);

  const canGoUp =
    upIdx in nodeMap &&
    canVisit(currentNode, nodeMap[upIdx]) &&
    unvisited.has(upIdx);
  const canGoDown =
    downIdx in nodeMap &&
    canVisit(currentNode, nodeMap[downIdx]) &&
    unvisited.has(downIdx);
  const canGoRight =
    rightIdx in nodeMap &&
    canVisit(currentNode, nodeMap[rightIdx]) &&
    unvisited.has(rightIdx);
  const canGoLeft =
    leftIdx in nodeMap &&
    canVisit(currentNode, nodeMap[leftIdx]) &&
    unvisited.has(leftIdx);

  if (!(canGoUp || canGoDown || canGoLeft || canGoRight)) {
    const newState = cloneDeep(currentState);
    newState.unvisited.delete(currentIdx);
    newState.path.pop();
    return newState;
  }

  const newDist = currentNode.distanceFromStart + 1;
  const upNode: Node = canGoUp
    ? {
        ...nodeMap[upIdx],
        distanceFromStart: Math.min(newDist, nodeMap[upIdx].distanceFromStart),
      }
    : nodeMap[upIdx];
  const downNode: Node = canGoDown
    ? {
        ...nodeMap[downIdx],
        distanceFromStart: Math.min(
          newDist,
          nodeMap[downIdx].distanceFromStart
        ),
      }
    : nodeMap[downIdx];
  const leftNode: Node = canGoLeft
    ? {
        ...nodeMap[leftIdx],
        distanceFromStart: Math.min(
          newDist,
          nodeMap[leftIdx].distanceFromStart
        ),
      }
    : nodeMap[leftIdx];
  const rightNode: Node = canGoRight
    ? {
        ...nodeMap[rightIdx],
        distanceFromStart: Math.min(
          newDist,
          nodeMap[rightIdx].distanceFromStart
        ),
      }
    : nodeMap[rightIdx];

  const closestNodeIdx = _.orderBy(
    [
      [upNode, upIdx],
      [downNode, downIdx],
      [leftNode, leftIdx],
      [rightNode, rightIdx],
    ] as [Node | undefined, string][],
    ([node, _]) => {
      if (!node) return Number.MAX_SAFE_INTEGER;
      return node.distanceFromStart;
    }
  ).filter(([_, idx]) => unvisited.has(idx))[0][1];

  const newState = cloneDeep(currentState);
  if (upNode) newState.nodeMap[upIdx] = upNode;
  if (downNode) newState.nodeMap[downIdx] = downNode;
  if (leftNode) newState.nodeMap[leftIdx] = leftNode;
  if (rightNode) newState.nodeMap[rightIdx] = rightNode;

  newState.unvisited.delete(currentIdx);
  newState.path.push(closestNodeIdx);

  return newState;
};

const main = () => {
  let currentState = parse(readInput(__dirname));
  while (currentState.unvisited.has(currentState.destIdx)) {
    currentState = runPathfinder(currentState);
    console.log(`current unvisited size: ${currentState.unvisited.size}`);
  }
  logAndAssert(
    currentState.nodeMap[currentState.destIdx].distanceFromStart,
    31
  );
  console.log(currentState.path.length);
};

main();

// 491 is too high
