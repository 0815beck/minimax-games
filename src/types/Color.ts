export type Color = "PINK" | "BLUE";

export function invertColor(color: Color): Color {
  return color === "PINK" ? "BLUE" : "PINK";
}
