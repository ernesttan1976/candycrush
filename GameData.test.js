import { describe, it, expect } from "vitest";
import { GameData } from "GameData.js";

describe("GameData class", () => {
  it("initGridArray() returns array of 6 x 6 blanks", () => {
    let gd = new GameData();
    gd.initGridArray();
    const testGrid = [
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
    ];
    console.log(testGrid);
    console.log(gd.grid);
    gd.grid.map((row, rowIndex) => {
      row.map((item, colIndex) =>
        expect(item).toBe(testGrid[rowIndex][colIndex])
      );
    });
  });

  it("fillGridArray() returns array of 6 x 6 letters from A to F", () => {
    let gd = new GameData();
    gd.initGridArray();
    gd.fillGridArray();
    console.log(gd.grid);
    gd.grid.map((row, rowIndex) => {
      row.map((item, colIndex) => expect(item).toMatch(/[A-G]/));
    });
  });

  it("getRow(id) gets row number from 'r1c1'", () => {
    let gd = new GameData();
    let testId = "r10c10";
    let result = gd.getRow(testId);
    console.log(testId, "getRow:", result);
    expect(result).toBe(10);

    testId = "rc10";
    result = gd.getRow(testId);
    console.log(testId, "getRow:", result);
    expect(result).toBeUndefined();

    testId = "";
    result = gd.getRow(testId);
    console.log("''", "getRow:", result);
    expect(result).toBeUndefined();
  });

  it("getCol(id) gets column number from 'r1c1'", () => {
    let gd = new GameData();
    let testId = "r10c10";
    let result = gd.getCol(testId);
    console.log(testId, "getCol:", result);
    expect(result).toBe(10);

    testId = "r10c";
    result = gd.getCol(testId);
    console.log(testId, "getCol:", result);
    expect(result).toBeUndefined();

    testId = "";
    result = gd.getCol(testId);
    console.log("''", "getCol:", result);
    expect(result).toBeUndefined();
  });

  it("getRandomCandy(): returns a letter from 'A' to'F'", () => {
    let gd = new GameData();
    let result = gd.getRandomCandy();
    expect(result).toMatch(/[A-G]/);
  });

  it("getDistance(start,end): returns distance between 2 points by Pythagoras Theorem", () => {
    let gd = new GameData();
    let start = { row: 0, col: 0 };
    let end = { row: 3, col: 4 };
    let result = gd.getDistance(start, end);
    expect(result).toBe(5);

    start = { row: 3, col: 2 };
    end = { row: 6, col: 6 };
    result = gd.getDistance(start, end);
    expect(result).toBe(5);

    start = { row: 0, col: 0 };
    end = { row: 1, col: 1 };
    result = gd.getDistance(start, end);
    expect(result).toBe(Math.sqrt(2));

    start = { row: 1, col: 0 };
    end = { row: 0, col: 0 };
    result = gd.getDistance(start, end);
    expect(result).toBe(1);
  });

  it("checkValidMoveAdjacent(): return true if distance is 1, return false otherwise", () => {
    let gd = new GameData();
    gd.start = { row: 1, col: 1 };
    gd.end = { row: 2, col: 1 };
    let result = gd.checkValidMoveAdjacent(gd.start, gd.end);
    expect(result).toBe(true);
    gd.start = { row: 1, col: 1 };
    gd.end = { row: 2, col: 2 };
    result = gd.checkValidMoveAdjacent(gd.start, gd.end);
    expect(result).toBe(false);
    gd.start = { row: 2, col: 2 };
    gd.end = { row: 2, col: 2 };
    result = gd.checkValidMoveAdjacent(gd.start, gd.end);
    expect(result).toBe(false);
  });

  it("stripedToNormal(str) should convert H and N to A, I and O to B, J and P to C, K and Q to D, L and R to E, M and S to F", ()=>{
    let gd = new GameData();
    expect(gd.stripedToNormal("HNIOJPKQLRMS")).toBe("AABBCCDDEEFF");
  })

  it("getRandomStripeCandy(color) should convert A to H or N, B to I or O, C t J or P, D to K or Q, E to L or R, F to M or S randomly",()=>{
    let gd = new GameData();
    expect(gd.getRandomStripeCandy("A")).toMatch(/[H|N]/);
    expect(gd.getRandomStripeCandy("B")).toMatch(/[I|O]/);
    expect(gd.getRandomStripeCandy("C")).toMatch(/[J|P]/);
    expect(gd.getRandomStripeCandy("D")).toMatch(/[K|Q]/);
    expect(gd.getRandomStripeCandy("E")).toMatch(/[L|R]/);
    expect(gd.getRandomStripeCandy("F")).toMatch(/[M|S]/);
    expect(gd.getRandomStripeCandy("")).toBeUndefined;
  })

  it("isPointOnLine(point,start,end) returns true if the point is on the line, otherwise returns false",()=>{
    let gd = new GameData();
    let point = { row: 5, col: 1 };
    let start = { row: 1, col: 1 };
    let end = { row: 10, col: 1 };
    expect(gd.isPointOnLine(point,start,end)).toBe(true);
    point = { row: 1, col: 5 };
    start = { row: 1, col: 1 };
    end = { row: 1, col: 10 };
    expect(gd.isPointOnLine(point,start,end)).toBe(true);
    point = { row: 4, col: 4 };
    start = { row: 0, col: 0 };
    end = { row: 9, col: 9 };
    expect(gd.isPointOnLine(point,start,end)).toBe(false);
    point = { row: 11, col: 1 };
    start = { row: 1, col: 1 };
    end = { row: 10, col: 1 };
    expect(gd.isPointOnLine(point,start,end)).toBe(false);
  });

});
