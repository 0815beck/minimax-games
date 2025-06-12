type Player = "HUMAN" | "MACHINE";
type Symbol = "X" | "O";
type Position = { row: number; column: number };
type Difficulty = "EASY" | "HARD";

function invertPlayer(player: Player): Player {
  return player === "HUMAN" ? "MACHINE" : "HUMAN";
}

function invertSymbol(symbol: Symbol): Symbol {
  return symbol === "X" ? "O" : "X";
}

export type { Difficulty, Player, Symbol, Position };
export { invertPlayer, invertSymbol };
