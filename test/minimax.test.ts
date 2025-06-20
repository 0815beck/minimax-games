import { expect, test } from "vitest";
import { minimax, Node } from "../src/minimax/minimax";
import * as TicTacToe from "../src/minimax/tictactoe";

/**
 * This class encodes a finite game tree, which will be used for
 * testing purposes.
 */
class FiniteTreeNode implements Node<FiniteTreeNode> {
  public value: Value;
  constructor(value: Value) {
    this.value = value;
  }

  isLeaf(): boolean {
    return (
      this.value === "D" ||
      this.value === "F" ||
      this.value === "G" ||
      this.value === "H" ||
      this.value === "C"
    );
  }

  *[Symbol.iterator](): Iterator<FiniteTreeNode> {
    switch (this.value) {
      case "A":
        yield new FiniteTreeNode("B");
        yield new FiniteTreeNode("C");
        break;
      case "B":
        yield new FiniteTreeNode("D");
        yield new FiniteTreeNode("E");
        break;
      case "E":
        yield new FiniteTreeNode("F");
        yield new FiniteTreeNode("G");
        yield new FiniteTreeNode("H");
        break;
    }
  }
}

type Value = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

test("finite game tree test 1", () => {
  const evaluation: (node: FiniteTreeNode) => number = (
    node: FiniteTreeNode
  ) => {
    switch (node.value) {
      case "A":
        return 0;
      case "B":
        return 3;
      case "C":
        return -1;
      case "D":
        return 2;
      case "E":
        return 5;
      case "F":
        return -1;
      case "G":
        return 1;
      case "H":
        return 50;
    }
  };

  const evaluation2 = (node: FiniteTreeNode) => {
    if (node.value === "C") return 20;
    if (node.value === "D") return 30;
    return evaluation(node);
  };

  const evaluation3 = (node: FiniteTreeNode) => {
    if (node.value === "C") return -10;
    if (node.value === "E") return -1;
    return evaluation(node);
  };

  const nodeF = new FiniteTreeNode("F");
  expect(nodeF.isLeaf()).toBe(true);
  const scoreF = minimax<FiniteTreeNode>(nodeF, evaluation, 2, true);
  expect(scoreF).toBe(evaluation(nodeF));
  const nodeB = new FiniteTreeNode("B");
  const scoreB = minimax<FiniteTreeNode>(nodeB, evaluation, 2, false);
  expect(scoreB).toBe(2);
  const scoreBMaximizing = minimax<FiniteTreeNode>(nodeB, evaluation, 2, true);
  expect(scoreBMaximizing).toBe(2);
  const nodeA = new FiniteTreeNode("A");
  const scoreAMinimizig = minimax<FiniteTreeNode>(nodeA, evaluation, 3, false);
  const scoreAMaximizing = minimax<FiniteTreeNode>(nodeA, evaluation, 3, true);
  expect(scoreAMaximizing).toBe(2);
  expect(scoreAMinimizig).toBe(-1);
  const newScoreA = minimax<FiniteTreeNode>(nodeA, evaluation2, 3, true);
  expect(newScoreA).toBe(30);
  const scoreAdepth2 = minimax<FiniteTreeNode>(nodeA, evaluation3, 2, true);
  expect(scoreAdepth2).toBe(-1);
});

test("tic tac toe test 1", () => {
  const board1 = new TicTacToe.Board([
    ["O", "O", null],
    ["X", "X", null],
    ["X", "O", "X"],
  ]);
  const state1 = new TicTacToe.State(board1, "O", "MACHINE");
  const score1 = minimax<TicTacToe.State>(
    state1,
    TicTacToe.evaluation,
    1,
    true
  );
  expect(score1).greaterThanOrEqual(1);
});
