type Player = "HUMAN" | "MACHINE";

function invertPlayer(player: Player): Player {
  return player === "HUMAN" ? "MACHINE" : "HUMAN";
}

type Symbol = "X" | "O";

function invertSymbol(symbol: Symbol): Symbol {
  return symbol === "X" ? "O" : "X";
}

type Position = { row: number; column: number };

export type { Player, Symbol, Position };
export { invertPlayer, invertSymbol };
