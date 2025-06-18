export type Player = "HUMAN" | "MACHINE";

export function invertPlayer(player: Player): Player {
  return player === "HUMAN" ? "MACHINE" : "HUMAN";
}
