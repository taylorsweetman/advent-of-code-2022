import { logAndAssert, readInput } from "../../ts_lib";
import { Node } from "../../ts_lib/types";

const TWO_CAPITAL_LETTERS = /[A-Z]{2}/g;
const ANY_NUMBERS = /\d+/;

const parse = (input: string): Record<string, Node<string>> => {
  const lines = input.split("\n");
  const lineHalves = lines.map((line) => line.split(";"));
  const nodes: Node<string>[] = lineHalves.map(([left, right]) => {
    const value = left.match(TWO_CAPITAL_LETTERS)?.[0] ?? "";
    const weight = parseInt(left.match(ANY_NUMBERS)?.[0] ?? "0");
    const weightedConnections = (right.match(TWO_CAPITAL_LETTERS) ?? []).map(
      (value) => ({
        weight,
        value,
      })
    );
    return { value, weightedConnections };
  });
  return nodes.reduce((acc, node) => ({ ...acc, [node.value]: node }), {});
};

const main = () => {
  const nodeMap = parse(readInput(__dirname));
  console.log(nodeMap);

  // Part 1
  logAndAssert(1, 1);

  // Part 2
  logAndAssert(1, 1);
};

main();
