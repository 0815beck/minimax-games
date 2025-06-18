export type Vector2D = { row: number; column: number };

export function add(a: Vector2D, b: Vector2D): Vector2D {
  return { row: a.row + b.row, column: a.column + b.column };
}

export function subtract(x: Vector2D, y: Vector2D): Vector2D {
  return { row: x.row - y.row, column: x.column - y.column };
}

export function scale(lambda: number, a: Vector2D) {
  return { row: lambda * a.row, column: lambda * a.column };
}

export function equals(x: Vector2D, y: Vector2D) {
  return x.row === y.row && x.column === y.column;
}

export const ZERO: Vector2D = { row: 0, column: 0 };
export const NORTH_EAST: Vector2D = { row: 1, column: 1 };
export const NORTH_WEST: Vector2D = { row: 1, column: -1 };
export const SOUTH_EAST: Vector2D = { row: -1, column: 1 };
export const SOUTH_WEST: Vector2D = { row: -1, column: -1 };
