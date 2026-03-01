export type Operation = "multiply" | "add" | "divide";

export const calculator = (a: number, b: number, op: Operation): number => {
  switch (op) {
    case "add":
      return a + b;
    case "multiply":
      return a * b;
    case "divide":
      return a / b;
    default:
      throw new Error("Unknown operation");
  }
};
