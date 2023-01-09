import { logAndAssert, readInput, Coord } from "../../ts_lib";

type Dir = "L" | "R";

type ShapeName = "-" | "I" | "+" | "L" | "#";

type Shape = {
  positions: Coord[];
  name: ShapeName;
};

type State = {
  map: Record<string, Coord>;
  windIdx: number;
  highestY: number;
};

const SHAPE_ORDER: ShapeName[] = ["-", "+", "L", "I", "#"];

const parse = (input: string): Dir[] =>
  input.split("").map((c) => (c === "<" ? "L" : "R"));

const draw = (coords: Coord[], xMin = 0, xMax = 6) => {
  const cYMax = coords.reduce(
    (acc, c) => (c.y < acc ? c.y : acc),
    Number.MAX_SAFE_INTEGER
  );

  let representation = "";
  for (let i = cYMax; i <= 0; i++) {
    for (let j = xMin; j <= xMax; j++) {
      const present = coords.some((pos) => pos.x === j && pos.y === i);
      if (present) representation += "#";
      else representation += ".";
    }
    representation += "\n";
  }

  console.log(representation);
};

const getDash = (bottomIdx: number): Shape => ({
  positions: [
    Coord.fromArr([2, bottomIdx]),
    Coord.fromArr([3, bottomIdx]),
    Coord.fromArr([4, bottomIdx]),
    Coord.fromArr([5, bottomIdx]),
  ],
  name: "-",
});

const getI = (bottomIdx: number): Shape => ({
  positions: [
    Coord.fromArr([2, bottomIdx - 3]),
    Coord.fromArr([2, bottomIdx - 2]),
    Coord.fromArr([2, bottomIdx - 1]),
    Coord.fromArr([2, bottomIdx]),
  ],
  name: "I",
});

const getPlus = (bottomIdx: number): Shape => ({
  positions: [
    Coord.fromArr([3, bottomIdx - 2]),
    Coord.fromArr([2, bottomIdx - 1]),
    Coord.fromArr([3, bottomIdx - 1]),
    Coord.fromArr([4, bottomIdx - 1]),
    Coord.fromArr([3, bottomIdx]),
  ],
  name: "+",
});

const getL = (bottomIdx: number): Shape => ({
  positions: [
    Coord.fromArr([4, bottomIdx - 2]),
    Coord.fromArr([4, bottomIdx - 1]),
    Coord.fromArr([2, bottomIdx]),
    Coord.fromArr([3, bottomIdx]),
    Coord.fromArr([4, bottomIdx]),
  ],
  name: "L",
});

const getBlock = (bottomIdx: number): Shape => ({
  positions: [
    Coord.fromArr([2, bottomIdx - 1]),
    Coord.fromArr([3, bottomIdx - 1]),
    Coord.fromArr([2, bottomIdx]),
    Coord.fromArr([3, bottomIdx]),
  ],
  name: "#",
});

const getShape = (name: ShapeName, bottomIdx: number): Shape => {
  if (name === "#") return getBlock(bottomIdx);
  if (name === "I") return getI(bottomIdx);
  if (name === "L") return getL(bottomIdx);
  if (name === "-") return getDash(bottomIdx);
  return getPlus(bottomIdx);
};

const runWind = (
  shape: Shape,
  windDir: Dir,
  map: Record<string, Coord>
): Shape => {
  const xMin = 0;
  const xMax = 6;

  const shapeAgainstWall = shape.positions.some((c) =>
    windDir === "L" ? c.xMinusOne().x < xMin : c.xPlusOne().x > xMax
  );

  const posToCheck =
    windDir === "L"
      ? shape.positions.map((pos) => pos.xMinusOne().id)
      : shape.positions.map((pos) => pos.xPlusOne().id);

  const shapeAgainstRock = posToCheck.some((id) => id in map);
  const shapeCannotMove = shapeAgainstWall || shapeAgainstRock;

  return shapeCannotMove
    ? shape
    : {
        ...shape,
        positions: shape.positions.map((pos) =>
          windDir === "L" ? pos.xMinusOne() : pos.xPlusOne()
        ),
      };
};

const runGravity = (
  shape: Shape,
  map: Record<string, Coord>
): [boolean, Shape] => {
  const stoppedOnGround = shape.positions.some((c) => c.y === 0);

  const posToCheck = shape.positions.map((pos) => pos.yPlusOne().id);
  const stoppedOnRock = posToCheck.some((id) => id in map);
  const cannotMove = stoppedOnRock || stoppedOnGround;

  return [
    cannotMove,
    cannotMove
      ? shape
      : { ...shape, positions: shape.positions.map((c) => c.yPlusOne()) },
  ];
};

const getNextFromArr =
  (oneBasedIdx: number) =>
  <T>(arr: T[]): T =>
    arr[(oneBasedIdx - 1) % arr.length];

const runShape = (
  shape: Shape,
  map: Record<string, Coord>,
  windDirections: Dir[],
  windIdx: number
): [Shape, number] => {
  let atRest = false;
  let lastShape = shape;
  let newWindIdx = windIdx;

  while (!atRest) {
    const windDir = getNextFromArr(newWindIdx)(windDirections);
    [atRest, lastShape] = runGravity(runWind(lastShape, windDir, map), map);
    newWindIdx++;
  }

  return [lastShape, newWindIdx];
};

const runRound =
  (shapeOrder: ShapeName[], windDirections: Dir[]) =>
  (turn: number, state: State): State => {
    const { map, windIdx, highestY } = state;

    const fallingShape = getShape(
      getNextFromArr(turn)(shapeOrder),
      highestY - 4
    );
    const [shapeAtRest, newWindIdx] = runShape(
      fallingShape,
      map,
      windDirections,
      windIdx
    );

    const newMap = {
      ...map,
      ...shapeAtRest.positions.reduce((acc, c) => ({ ...acc, [c.id]: c }), {}),
    };

    return {
      map: newMap,
      windIdx: newWindIdx,
      highestY: Math.min(
        shapeAtRest.positions.reduce(
          (acc, c) => (c.y < acc ? c.y : acc),
          Number.MAX_SAFE_INTEGER
        ),
        highestY
      ),
    };
  };

const runSimulation = (rounds: number, windDirections: Dir[]) => {
  let lastResult: State = { map: {}, windIdx: 1, highestY: 1 };
  for (let i = 1; i <= rounds; i++) {
    lastResult = runRound(SHAPE_ORDER, windDirections)(i, lastResult);
    const percentDone = (i / rounds) * 100;
    i % 200 === 0 && console.log(`progress: ${Math.round(percentDone)} %`);
  }

  return lastResult.highestY * -1 + 1;
};

const main = () => {
  const windDirections = parse(readInput(__dirname));

  // Part 1
  const round1Rounds = 2_022;
  console.log("Starting Round 1...");
  console.time("Round 1");
  const round1Result = runSimulation(round1Rounds, windDirections);
  console.timeEnd("Round 1");

  logAndAssert(round1Result, 3068);

  // Part 2
  console.log("Starting Round 2...");
  console.time("Round 2");
  console.timeEnd("Round 2");
  logAndAssert(1, 1);
};

main();
