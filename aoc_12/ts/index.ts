import { logAndAssert, readInput } from "../../ts_lib";
import _ from "lodash";

type Node = {
  idx: string;
  height: string;
  distanceFromStart: number;
  traversableNs: string[];
};

type State = {
  currentNode: Node;
  unvisited: Record<string, Node>;
  destIdx: string;
};

const getUpIdx = (idx: string) =>
  idx.split("|").reduce((acc, current, i) => {
    if (i === 0) return String(parseInt(current) - 1);
    return `${acc}|${current}`;
  }, "");

const getDownIdx = (idx: string) =>
  idx.split("|").reduce((acc, current, i) => {
    if (i === 0) return String(parseInt(current) + 1);
    return `${acc}|${current}`;
  }, "");

const getRightIdx = (idx: string) =>
  idx.split("|").reduce((acc, current, i) => {
    if (i === 0) return current;
    return `${acc}|${parseInt(current) + 1}`;
  }, "");

const getLeftIdx = (idx: string) =>
  idx.split("|").reduce((acc, current, i) => {
    if (i === 0) return current;
    return `${acc}|${parseInt(current) - 1}`;
  }, "");

const canVisit = (current: Node, toVisit: Node) =>
  toVisit.height.charCodeAt(0) - current.height.charCodeAt(0) <= 1;

const findTraversableNs = (
  current: Node,
  nodeMap: Record<string, Node>
): string[] => {
  const result: string[] = [];

  const upNode = nodeMap[getUpIdx(current.idx)];
  const downNode = nodeMap[getDownIdx(current.idx)];
  const rightNode = nodeMap[getRightIdx(current.idx)];
  const leftNode = nodeMap[getLeftIdx(current.idx)];

  if (upNode && canVisit(current, upNode)) result.push(upNode.idx);
  if (downNode && canVisit(current, downNode)) result.push(downNode.idx);
  if (rightNode && canVisit(current, rightNode)) result.push(rightNode.idx);
  if (leftNode && canVisit(current, leftNode)) result.push(leftNode.idx);

  return result;
};

const parse = (input: string): State => {
  const nodeMap: Record<string, Node> = {};
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
        idx: nodeIdx,
        traversableNs: [],
      };

      nodeMap[nodeIdx] = node;
      if (start) currentIdx = nodeIdx;
      if (dest) destIdx = nodeIdx;
    })
  );

  const finalMap = Object.entries(nodeMap).reduce((acc, [idx, node]) => {
    const traversableNs = findTraversableNs(node, nodeMap);
    const updatedNode = { ...node, traversableNs };
    return { ...acc, [idx]: updatedNode };
  }, {} as Record<string, Node>);

  return {
    unvisited: finalMap,
    currentNode: finalMap[currentIdx],
    destIdx,
  };
};

const findNearestUnvisited = (unvisited: Record<string, Node>): Node =>
  (_.minBy(
    Object.entries(unvisited),
    ([_, node]) => node.distanceFromStart
  ) ?? ["", {} as Node])[1];

const runPathfinder = (currentState: State): number => {
  const { destIdx, unvisited } = currentState;

  while (destIdx in unvisited) {
    const { currentNode } = currentState;
    if (currentNode.idx === destIdx) return currentNode.distanceFromStart;

    const nodesToCompare = currentNode.traversableNs
      .filter((nodeIdx) => nodeIdx in unvisited)
      .map((nodeIdx) => unvisited[nodeIdx]);

    delete currentState.unvisited[currentNode.idx];

    // no traversable nodes which have not been visited already
    if (!nodesToCompare.length) {
      currentState.currentNode = findNearestUnvisited(currentState.unvisited);
      continue;
    }

    const newDist = currentNode.distanceFromStart + 1;
    const newNodes: Node[] = nodesToCompare.map((node) => ({
      ...node,
      distanceFromStart:
        newDist < node.distanceFromStart ? newDist : node.distanceFromStart,
    }));

    const closestNewNode = newNodes.reduce(
      (acc, current) => {
        if (current.distanceFromStart <= acc.distanceFromStart) return current;
        return acc;
      },
      { distanceFromStart: newDist } as Node
    );
    if (closestNewNode.distanceFromStart === Number.MAX_SAFE_INTEGER) {
      currentState.currentNode = findNearestUnvisited(currentState.unvisited);
      continue;
    }

    newNodes.forEach((node) => {
      currentState.unvisited[node.idx] = node;
    });
    currentState.currentNode = closestNewNode;
  }
  return -1;
};

const main = () => {
  let currentState = parse(readInput(__dirname));
  const dist = runPathfinder(currentState);
  logAndAssert(dist, 423);
};

main();
