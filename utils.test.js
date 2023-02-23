import { describe, it, expect } from "vitest";
import { min, max, findLength, findAngle, midPoint } from "./utils.js";


describe("math functions", () => {

  it("max() gives the maximum of 2 numbers", () => {
    expect(max(10, 20)).toBe(20);
    expect(max(-10, -20)).toBe(-10);
  });
  

  it("min() gives the minimum of 2 numbers", () => {
    expect(min(10,20)).toBe(10);
    expect(min(-10,-20)).toBe(-20);
  });

  it("findLength(from,to) gives the length between 2 points",()=>{
    let from = {row:0, col: 0};
    let to = {row:3, col: 4};
    expect(findLength(from, to)).toBe(5);
  })

  it("findAngle(from,to) gives the angle with horizontal",()=>{
    let from = {row:0, col: 0};
    let to = {row:1, col: 1};
    let result = findAngle(from, to);
    expect(findAngle(from, to)).toBe(45);
  })


});


