import { describe, it, expect } from "vitest";
import { min, max } from "./utils.js";


describe("math functions", () => {

  it("max() gives the maximum of 2 numbers", () => {
    expect(max(10, 20)).toBe(20);
    expect(max(-10, -20)).toBe(-10);
  });
  

  it("min() gives the minimum of 2 numbers", () => {
    expect(min(10,20)).toBe(10);
    expect(min(-10,-20)).toBe(-20);
  });

});


