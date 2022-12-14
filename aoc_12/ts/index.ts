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
  endCondition: "idx" | "height";
  endConditionValue: string;
};

type VisitorFunc = (current: Node, toVisit: Node) => boolean;

const INF = Number.MAX_SAFE_INTEGER;

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

const canVisitOneHigher = (current: Node, toVisit: Node) =>
  toVisit.height.charCodeAt(0) - current.height.charCodeAt(0) <= 1;

const canVisitOneLower = (current: Node, toVisit: Node) =>
  current.height.charCodeAt(0) - toVisit.height.charCodeAt(0) <= 1;

const findTraversableNs =
  (visitor: VisitorFunc) =>
  (current: Node, nodeMap: Record<string, Node>): string[] => {
    const result: string[] = [];

    const upNode = nodeMap[getUpIdx(current.idx)];
    const downNode = nodeMap[getDownIdx(current.idx)];
    const rightNode = nodeMap[getRightIdx(current.idx)];
    const leftNode = nodeMap[getLeftIdx(current.idx)];

    if (upNode && visitor(current, upNode)) result.push(upNode.idx);
    if (downNode && visitor(current, downNode)) result.push(downNode.idx);
    if (rightNode && visitor(current, rightNode)) result.push(rightNode.idx);
    if (leftNode && visitor(current, leftNode)) result.push(leftNode.idx);

    return result;
  };

const parse =
  (visitor: VisitorFunc, endCondition: "idx" | "height") =>
  (input: string): State => {
    const nodeMap: Record<string, Node> = {};
    let currentIdx = "";
    let destIdx = "";

    const lines = input.split("\n");
    lines.forEach((line, xIdx) =>
      line.split("").forEach((char, yIdx) => {
        const nodeIdx = `${xIdx}|${yIdx}`;
        const start =
          (endCondition === "idx" && char === "S") ||
          (endCondition === "height" && char === "E");
        const dest = endCondition === "idx" && char === "E";

        let height = "";
        if (start && endCondition === "idx") {
          height = "a";
        } else if (start && endCondition) {
          height = "z";
        } else if (dest && endCondition === "idx") {
          height = "z";
        } else {
          height = char;
        }

        const distanceFromStart = start ? 0 : INF;
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
      const traversableNs = findTraversableNs(visitor)(node, nodeMap);
      const updatedNode = { ...node, traversableNs };
      return { ...acc, [idx]: updatedNode };
    }, {} as Record<string, Node>);

    return {
      unvisited: finalMap,
      currentNode: finalMap[currentIdx],
      endCondition,
      endConditionValue: endCondition === "idx" ? destIdx : "a",
    };
  };

const findNearestUnvisited = (unvisited: Record<string, Node>): Node =>
  (_.minBy(
    Object.entries(unvisited),
    ([_, node]) => node.distanceFromStart
  ) ?? ["", {} as Node])[1];

const findShortestPath = (currentState: State): number => {
  const { endCondition, endConditionValue, unvisited } = currentState;

  let shortest = INF;

  while (Object.keys(unvisited).length > 1) {
    const { currentNode } = currentState;

    // base case, we've found the shortest path to the destination
    if (endCondition === "idx" && currentNode.idx === endConditionValue)
      return currentNode.distanceFromStart;

    if (
      endCondition === "height" &&
      currentNode.height === endConditionValue &&
      currentNode.distanceFromStart < shortest
    ) {
      shortest = currentNode.distanceFromStart;
    }

    // find adjacent, unvisited nodes. mark current node as visited
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
    if (closestNewNode.distanceFromStart === INF) {
      currentState.currentNode = findNearestUnvisited(currentState.unvisited);
      continue;
    }

    newNodes.forEach((node) => {
      currentState.unvisited[node.idx] = node;
    });
    currentState.currentNode = closestNewNode;
  }

  return shortest || INF;
};

const main = () => {
  // Part 1
  const partOneStatingState = parse(
    canVisitOneHigher,
    "idx"
  )(readInput(__dirname));

  const dist = findShortestPath(partOneStatingState);
  logAndAssert(dist, 423);

  // Part 2
  const partTwoStatingState = parse(
    canVisitOneLower,
    "height"
  )(readInput(__dirname));

  const distTwo = findShortestPath(partTwoStatingState);
  logAndAssert(distTwo, 416);
};

main();
