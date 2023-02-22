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

  it("stripedToNormal(str) should convert H and N to A, I and O to B, J and P to C, K and Q to D, L and R to E, M and S to F", () => {
    let gd = new GameData();
    expect(gd.stripedToNormal("HNIOJPKQLRMS")).toBe("AABBCCDDEEFF");
  });

  it("getRandomStripeCandy(color) should convert A to H or N, B to I or O, C t J or P, D to K or Q, E to L or R, F to M or S randomly", () => {
    let gd = new GameData();
    expect(gd.getRandomStripeCandy("A")).toMatch(/[H|N]/);
    expect(gd.getRandomStripeCandy("B")).toMatch(/[I|O]/);
    expect(gd.getRandomStripeCandy("C")).toMatch(/[J|P]/);
    expect(gd.getRandomStripeCandy("D")).toMatch(/[K|Q]/);
    expect(gd.getRandomStripeCandy("E")).toMatch(/[L|R]/);
    expect(gd.getRandomStripeCandy("F")).toMatch(/[M|S]/);
    expect(gd.getRandomStripeCandy("")).toBeUndefined;
  });

  it("isPointOnLine(point,start,end) returns true if the point is on the line, otherwise returns false", () => {
    let gd = new GameData();
    let point = { row: 5, col: 1 };
    let start = { row: 1, col: 1 };
    let end = { row: 10, col: 1 };
    expect(gd.isPointOnLine(point, start, end)).toBe(true);
    point = { row: 1, col: 5 };
    start = { row: 1, col: 1 };
    end = { row: 1, col: 10 };
    expect(gd.isPointOnLine(point, start, end)).toBe(true);
    point = { row: 4, col: 4 };
    start = { row: 0, col: 0 };
    end = { row: 9, col: 9 };
    expect(gd.isPointOnLine(point, start, end)).toBe(false);
    point = { row: 11, col: 1 };
    start = { row: 1, col: 1 };
    end = { row: 10, col: 1 };
    expect(gd.isPointOnLine(point, start, end)).toBe(false);
  });

  it("markLineFive(str) replace a string, all letters between A and F with a 1", () => {
    let gd = new GameData();
    expect(gd.markLineFive("AAAAABBCCDDEEFF")).toBe("11111BBCCDDEEFF");
    expect(gd.markLineFive("AAAAAABBCCDDEEFF")).toBe("11111ABBCCDDEEFF");
    expect(gd.markLineFive("BBAAAAACCDDEEFF")).toBe("BB11111CCDDEEFF");
    expect(gd.markLineFive("BBAAABAACCDDEEFF")).toBe("BBAAABAACCDDEEFF");
    expect(gd.markLineFive("BBAAAAA  DDEEFF")).toBe("BB11111  DDEEFF");
  });

  it("checkFiveInALine() finds 5 in a line and returns gridFive with 1 for each item", () => {
    let gd = new GameData();
    gd.grid = [
      [..."BCDEFA"],
      [..."AAAAAB"],
      [..."BCDEFA"],
      [..."CDEFAB"],
      [..."BCDEFA"],
      [..."CDEFAB"],
    ];
    let output = [
      [..."BCDEFA"],
      [..."11111B"],
      [..."BCDEFA"],
      [..."CDEFAB"],
      [..."BCDEFA"],
      [..."CDEFAB"],
    ];
    console.log(gd.grid, output, gd.gridFive);
    let result = gd.checkFiveInALine();
    expect(result).toBe(true);
    gd.gridFive.map((row, rowIndex) => {
      row.map((item, colIndex) =>
        expect(item).toEqual(output[rowIndex][colIndex])
      );
    });
    gd.grid = [
      [..."BCDEFA"],
      [..."DEFEBC"],
      [..."BCDEFA"],
      [..."CDEEAB"],
      [..."BCDEFA"],
      [..."CDEFAB"],
    ];
    output = [
      [..."BCD1FA"],
      [..."DEF1BC"],
      [..."BCD1FA"],
      [..."CDE1AB"],
      [..."BCD1FA"],
      [..."CDEFAB"],
    ];
    console.log(gd.grid, output, gd.gridFive);
    result = gd.checkFiveInALine();
    expect(result).toBe(true);
    gd.gridFive.map((row, rowIndex) => {
      row.map((item, colIndex) =>
        expect(item).toEqual(output[rowIndex][colIndex])
      );
    });
    gd.grid = [
      [..."BCDEFA"],
      [..."DEFABC"],
      [..."BCDEFA"],
      [..."CDEFAB"],
      [..."BCDEFA"],
      [..."CDEFAB"],
    ];
    output = [
      [..."BCDEFA"],
      [..."DEFABC"],
      [..."BCDEFA"],
      [..."CDEFAB"],
      [..."BCDEFA"],
      [..."CDEFAB"],
    ];
    console.log(gd.grid, output, gd.gridFive);
    result = gd.checkFiveInALine();
    expect(result).toBe(false);
    gd.gridFive.map((row, rowIndex) => {
      row.map((item, colIndex) =>
        expect(item).toEqual(output[rowIndex][colIndex])
      );
    });
  });

  it("markLineFour(str) replaces a string, all letters between A and F with a 1", () => {
    let gd = new GameData();
    expect(gd.markLineFour("AAAABBCCDDEEFF")).toBe("1111BBCCDDEEFF");
    expect(gd.markLineFour("AAAAABBCCDDEEFF")).toBe("1111ABBCCDDEEFF");
    expect(gd.markLineFour("BBAAAACCDDEEFF")).toBe("BB1111CCDDEEFF");
    expect(gd.markLineFour("BBAABAACCDDEEFF")).toBe("BBAABAACCDDEEFF");
    expect(gd.markLineFour("BBAAAA  DDEEFF")).toBe("BB1111  DDEEFF");
  });

  it("checkFourInALine() finds 4 in a line and returns gridFour with a 1 for each item", () => {
    let gd = new GameData();
    gd.grid = [
      [..."BCDEFA"],
      [..."AAAABB"],
      [..."BCDEFA"],
      [..."CDEFAB"],
      [..."BCDEFA"],
      [..."CDEFAB"],
    ];
    let output = [
      [..."BCDEFA"],
      [..."1111BB"],
      [..."BCDEFA"],
      [..."CDEFAB"],
      [..."BCDEFA"],
      [..."CDEFAB"],
    ];
    console.log(gd.grid, output, gd.gridFour);
    let result = gd.checkFourInALine();
    expect(result).toBe(true);
    gd.gridFour.map((row, rowIndex) => {
      row.map((item, colIndex) =>
        expect(item).toEqual(output[rowIndex][colIndex])
      );
    });

    gd.grid = [
        [..."BCDEFA"],
        [..."AAAEBB"],
        [..."BCDEFA"],
        [..."CDEEAB"],
        [..."BCDFFA"],
        [..."CDEFAB"],
      ];
      output = [
        [..."BCD1FA"],
        [..."AAA1BB"],
        [..."BCD1FA"],
        [..."CDE1AB"],
        [..."BCDFFA"],
        [..."CDEFAB"],
      ];
      console.log(gd.grid, output, gd.gridFour);
      result = gd.checkFourInALine();
      expect(result).toBe(true);
      gd.gridFour.map((row, rowIndex) => {
        row.map((item, colIndex) =>
          expect(item).toEqual(output[rowIndex][colIndex])
        );
      });
      gd.grid = [
        [..."BCDEFA"],
        [..."DEFABC"],
        [..."BCDEFA"],
        [..."CDEFAB"],
        [..."BCDEFA"],
        [..."CDEFAB"],
      ];
      output = [
        [..."BCDEFA"],
        [..."DEFABC"],
        [..."BCDEFA"],
        [..."CDEFAB"],
        [..."BCDEFA"],
        [..."CDEFAB"],
      ];
      console.log(gd.grid, output, gd.gridFour);
      result = gd.checkFourInALine();
      expect(result).toBe(false);
      gd.gridFour.map((row, rowIndex) => {
        row.map((item, colIndex) =>
          expect(item).toEqual(output[rowIndex][colIndex])
        );
      });
  });

  it("fillGridArrayBlanks()", ()=>{
    let gd = new GameData();
    gd.grid = [
        [..." BCDEF"],
        [..."ABCDEF"],
        [..."   BCD"],
        [..."CDEFAB"],
        [..."     B"],
        [..."  CDEF"],
      ];
    console.log(gd.grid);
    gd.fillGridArrayBlanks();
    console.log(gd.grid);
    expect(gd.grid[0].join("")).toMatch(/[A-F]{1}BCDEF/);
    expect(gd.grid[1].join("")).toMatch(/ABCDEF/);
    expect(gd.grid[2].join("")).toMatch(/[A-F]{1}[A-F]{1}[A-F]{1}BCD/);
    expect(gd.grid[3].join("")).toMatch(/CDEFAB/);
    expect(gd.grid[4].join("")).toMatch(/[A-F]{1}[A-F]{1}[A-F]{1}[A-F]{1}[A-F]{1}B/);
    expect(gd.grid[5].join("")).toMatch(/[A-F]{1}[A-F]{1}CDEF/);
  });
});
