import { logAndAssert, readInput, sum } from "../../ts_lib";
import { Node } from "../../ts_lib/types";

type NodeMap = Record<string, Node<string, number>>;

const TWO_CAPITAL_LETTERS = /[A-Z]{2}/g;
const ANY_NUMBERS = /\d+/;

const findShortestPath =
  (nodeMap: NodeMap) =>
  (start: string, end: string): string[] => {
    const queue: string[][] = [[start]];
    const visited = new Set<string>();

    while (queue.length) {
      const path = queue.shift() ?? [];
      const lastNodeId = path[path.length - 1];

      if (lastNodeId === end) {
        return path;
      }

      if (visited.has(lastNodeId)) {
        continue;
      }

      visited.add(lastNodeId);

      const lastNodeConnections =
        nodeMap[lastNodeId]?.weightedConnections ?? [];

      lastNodeConnections.forEach(({ id }) => {
        queue.push([...path, id]);
      });
    }

    return [];
  };

const parse = (input: string): [NodeMap, Record<string, string[]>] => {
  const lines = input.split("\n");
  const lineHalves = lines.map((line) => line.split(";"));
  const initialNodes = lineHalves.map(([left, right]) => {
    const id = left.match(TWO_CAPITAL_LETTERS)?.[0] ?? "";
    const value = parseInt(left.match(ANY_NUMBERS)?.[0] ?? "0");
    const weightedConnections = (right.match(TWO_CAPITAL_LETTERS) ?? []).map(
      (connId) => ({
        weight: 1,
        id: connId,
      })
    );
    return { id, value, weightedConnections };
  });
  const initialNodeMap = initialNodes.reduce(
    (acc, node) => ({ ...acc, [node.id]: node }),
    {}
  );

  const valvesWithPressure = initialNodes.filter((node) => node.value > 0);
  const shortestPathsMap = initialNodes.reduce((acc, c) => {
    const paths = valvesWithPressure.map((v) =>
      findShortestPath(initialNodeMap)(c.id, v.id)
    );

    paths.forEach(
      (path) => (acc[path[0] + "->" + path[path.length - 1]] = path)
    );

    return acc;
  }, {} as Record<string, string[]>);

  const allPathsNodes = initialNodes.map((startNode) => {
    const weightedConnections = valvesWithPressure.map((endNode) => ({
      id: endNode.id,
      weight: shortestPathsMap[startNode.id + "->" + endNode.id].length - 1,
    }));
    return {
      ...startNode,
      weightedConnections: weightedConnections.filter(
        (node) => node.id !== startNode.id
      ),
    };
  });
  return [
    allPathsNodes.reduce((acc, node) => ({ ...acc, [node.id]: node }), {}),
    shortestPathsMap,
  ];
};

const pressureReleasedFromPath = (nodeMap: NodeMap) => (path: string[]) => {
  const openedValveVals: number[] = [];
  let pressure = 0;

  for (let i = 0; i < path.length; i++) {
    pressure += sum(openedValveVals);
    const node = path[i];
    if (node === "OPEN") {
      if (!path[i - 1] || path[i - 1] === "OPEN" || path[i - 1] === "STAY")
        throw Error(`Illegal path -- path: ${path}; idx: ${i}`);
      const lastNode = nodeMap[path[i - 1]];
      openedValveVals.push(lastNode.value);
    }
  }

  return pressure;
};

const valveIsOpen = (nodeId: string, path: string[]) => {
  for (let i = 0; i < path.length; i++) {
    if (path[i] === nodeId && path[i + 1] === "OPEN") {
      return true;
    }
  }

  return false;
};

const findPathPotential = (time: number, nodeMap: NodeMap, path: string[]) => {
  const remainingTime = time - (path.length - 1);

  const currentPressure = pressureReleasedFromPath(nodeMap)([
    ...path,
    ...Array(remainingTime).fill("STAY"),
  ]);
  const unopenedValves = Object.entries(nodeMap)
    .filter(([id]) => !valveIsOpen(id, path))
    .map(([_, node]) => node);
  const potentialPressure = sum(unopenedValves.map((node) => node.value));
  return currentPressure + potentialPressure;
};

const bfs =
  (
    time: number,
    nodeMap: NodeMap,
    shortestPathsMap: Record<string, string[]>,
    possiblePaths: Record<string, number> = {}
  ) =>
  (queue: string[][]): Record<string, number> => {
    const bestPaths: Record<number, number> = {};

    while (queue.length) {
      const path = queue.shift() ?? [];
      if (path.length - 1 === time) {
        const releasedPressure = pressureReleasedFromPath(nodeMap)(path);
        const pathStr = path.join(",");
        possiblePaths[pathStr] = releasedPressure;
        continue;
      }

      const currentPotential = findPathPotential(time, nodeMap, path);
      if ((bestPaths[path.length] ?? -1) > currentPotential) {
        continue;
      } else {
        bestPaths[path.length] = currentPotential;
      }

      const lastNodeId = path[path.length - 1];
      if (
        lastNodeId !== "OPEN" &&
        lastNodeId !== "STAY" &&
        !valveIsOpen(lastNodeId, path)
      ) {
        queue.push([...path, "OPEN"]);
      }

      if (lastNodeId === "STAY") {
        queue.push([...path, "STAY"]);
        continue;
      }

      const lastNodeIdToUse =
        lastNodeId === "OPEN" ? path[path.length - 2] : lastNodeId;

      const lastNodeConnections =
        nodeMap[lastNodeIdToUse]?.weightedConnections ?? [];

      const reachableNodes = lastNodeConnections.filter((node) => {
        const remainingTime = time - (path.length - 1);
        return node.weight < remainingTime && !valveIsOpen(node.id, path);
      });

      if (!reachableNodes.length) {
        queue.push([...path, "STAY"]);
      }

      reachableNodes.forEach(({ id }) => {
        queue.push([
          ...path,
          ...shortestPathsMap[`${lastNodeIdToUse}->${id}`].slice(1),
        ]);
      });
    }

    return possiblePaths;
  };

const main = () => {
  const [nodeMap, shortestPathsMap] = parse(readInput(__dirname));

  // Part 1
  const possiblePaths = bfs(30, nodeMap, shortestPathsMap)([["AA"]]);
  const maxPressure = Math.max(...Object.values(possiblePaths));
  logAndAssert(maxPressure, 1_651);

  // Part 2
  // logAndAssert(1, 1);
};

main();
