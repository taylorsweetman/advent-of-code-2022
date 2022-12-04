import { readFileSync } from "fs";
import { logAndAssert, sum } from "../../ts_lib";

type Selection = "rock" | "paper" | "scissors";
type OppInput = "A" | "B" | "C";
type UserInput = "X" | "Y" | "Z";

const OPPONENT_MAP: { [x: string]: Selection } = {
  A: "rock",
  B: "paper",
  C: "scissors",
};

const getRoundScore = (them: Selection, you: Selection) => {
  const WINNER_PTS_MAP = {
    rock_paper: 6,
    rock_scissors: 0,
    rock_rock: 3,
    paper_rock: 0,
    paper_scissors: 6,
    paper_paper: 3,
    scissors_rock: 6,
    scissors_paper: 0,
    scissors_scissors: 3,
  };

  const SELECTION_PTS_MAP = {
    rock: 1,
    paper: 2,
    scissors: 3,
  };

  return WINNER_PTS_MAP[`${them}_${you}`] + SELECTION_PTS_MAP[you];
};

const roundOneSelector = (
  them: OppInput,
  you: UserInput
): [Selection, Selection] => {
  const ENCRYPTION_MAP_1: { [x: string]: Selection } = {
    X: "rock",
    Y: "paper",
    Z: "scissors",
  };
  return [OPPONENT_MAP[them], ENCRYPTION_MAP_1[you]];
};

const roundTwoSelector = (
  them: OppInput,
  you: UserInput
): [Selection, Selection] => {
  const ENCRYPTION_MAP_2 = {
    X: 0,
    Y: 3,
    Z: 6,
  };

  const roundResult = ENCRYPTION_MAP_2[you];
  const theirSelection = OPPONENT_MAP[them];

  if (roundResult === 3) {
    return [theirSelection, theirSelection];
  }

  if (roundResult === 0) {
    if (theirSelection === "rock") {
      return [theirSelection, "scissors"];
    }
    if (theirSelection === "paper") {
      return [theirSelection, "rock"];
    }
    return [theirSelection, "paper"];
  }

  if (theirSelection === "rock") {
    return [theirSelection, "paper"];
  }
  if (theirSelection === "paper") {
    return [theirSelection, "scissors"];
  }
  return [theirSelection, "rock"];
};

const rawSelectionsToTotalScore =
  (rawInput: [OppInput, UserInput][]) =>
  (scoreCalc: (them: Selection, you: Selection) => number) =>
  (
    selectionFinder: (them: OppInput, you: UserInput) => [Selection, Selection]
  ) => {
    return sum(
      rawInput
        .map(([them, you]) => selectionFinder(them, you))
        .map(([them, you]) => scoreCalc(them, you))
    );
  };

const main = () => {
  const input = readFileSync("../input.txt", "utf8");
  const rawSelections = input.split("\n").map((line) => line.split(" ")) as [
    OppInput,
    UserInput
  ][];
  const scoreFromSelections =
    rawSelectionsToTotalScore(rawSelections)(getRoundScore);

  // part 1
  const roundOneTotal = scoreFromSelections(roundOneSelector);
  logAndAssert(roundOneTotal, 15);

  // part 2
  const roundTwoTotal = scoreFromSelections(roundTwoSelector);
  logAndAssert(roundTwoTotal, 12);
};

main();
