export class GameData {
  constructor(
    rowCount = 6,
    colCount = 6,
    candyCount = 6,
    level = 1,
    maxMoves,
    gameStars,
    gameTarget,
    gameTargetCandy
  ) {
    Array.prototype.map2d = function (transformFunction) {
      return this.map((row, rowIndex) => row.map(transformFunction));
    };
    this.rowCount = rowCount;
    this.colCount = colCount;
    this.candyCount = candyCount;
    this.gameName = "Your Name";
    this.gameLevel = level;
    this.gameMoves = maxMoves;
    this.gameStars = gameStars;
    this.gameTarget = gameTarget;
    this.gameTargetCandy = gameTargetCandy;
    this.gameScore = 0;
    this.start = {};
    this.end = {};
    this.grid = [];
    this.gridTemp = [];
    this.gridThree = [];
    this.gridFour = [];
    this.gridFive = [];
    this.isThree = false;
    this.isFour = false;
    this.isFive = false;
    this.isColorBallWithNormal = false;
    this.isColorBallWithStriped = false;
    this.isNormalWithStripedMove = false;
    this.gridStripedWithNormal = [];
    this.gridColorBallWithNormal = [];
    this.gridColorBallWithStriped = [];
    this.grid = this.initGridArray(this.rowCount, this.colCount);
    this.fillGridArray();

    this.setStartId("");
    this.setEndId("");
    this.size = 60;
    this.gap = 4;

    this.states = [
      "wait",
      "ready",
      "check1",
      "check2",
      "crush",
      "drop",
      "fill",
    ];
    this.state = "ready";

    this.cascadeCounter = 1;
    this.candyfallsCounter = 1;
    this.userActive = false;

    this.userData = [];
    this.currentUser = 0;
    this.laserList = [];
    Array.prototype.map2d = function (transformFunction) {
      return this.map((row) => row.map(transformFunction));
    };
  }

  getStart() {
    return {
      ...this.start,
      color: this.grid[this.start.row][this.start.col],
    };
  }
  getEnd() {
    return {
      ...this.end,
      color: this.grid[this.end.row][this.end.col],
    };
  }

  //refactor this - done
  setStartId(id) {
    let start = {
      id: "",
      row: "",
      col: "",
      color: "",
    };

    if (id === "") return start;

    try {
      if (id === "grid") {
        //do nothing
        console.log("dragged on grid instead of cell");
      } else {
        start.id = id;
        start.row = this.getRow(id);
        start.col = this.getCol(id);
        start.color = this.grid[start.row][start.col];
      }
      this.start = start;
      return start;
    } catch (e) {
      console.error("error: ", id, " typeof ", typeof id);
      throw e;
    }
  }
  //refactor this - done
  setEndId(id) {
    let end = {
      id: "",
      row: "",
      col: "",
      color: "",
    };

    if (id === "") return end;

    try {
      if (id === "grid") {
        //do nothing
        console.log("dragged on grid instead of cell");
      } else {
        end.id = id;
        end.row = this.getRow(id);
        end.col = this.getCol(id);
        end.color = this.grid[end.row][end.col];
      }
      this.end = end;
      return end;
    } catch (e) {
      console.error("error: ", id, " typeof ", typeof id);
      throw e;
    }
  }

  getRow(id) {
    //convert r1c1 to {row, col} and to "A"
    const c = id.indexOf("c");
    if (c === 1) return undefined;
    return id ? Number(id.slice(1, c)) : undefined;
  }

  getCol(id) {
    const c = id.indexOf("c");
    if (c + 1 === id.length) return undefined;
    return id ? Number(id.slice(c + 1, id.length)) : undefined;
  }

  getRandomCandy() {
    return String.fromCharCode(
      65 + Math.floor(Math.random() * this.candyCount)
    );
  }

  initGridArray(rowCount, colCount) {
    const tempGrid = [];
    for (let i = 0; i < rowCount; i++) {
      let row = [];
      for (let j = 0; j < colCount; j++) {
        row.push(" ");
      }
      tempGrid.push(row);
    }
    return tempGrid;
  }

  fillGridArray() {
    if (this.grid.length === 0) {
      this.grid = this.initGridArray(this.rowCount, this.colCount);
    }
    const grid = this.grid.map2d(
      (item, colIndex) => (item = this.getRandomCandy())
    );
    this.grid = grid;

    this.cleanOutThreeInARow();

    return grid;
  }

  cleanOutThreeInARow() {
    this.isThree = this.checkThreeInALine();
    if (!this.isThree) return this.grid;
    this.removeOnes();
    this.fillGridArrayBlanks();
    this.cleanOutThreeInARow();
  }

  removeOnes() {
    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.colCount; j++) {
        if (typeof this.gridThree[i][j] !== undefined)
        {
          if (this.gridThree[i][j] === "1") {
            this.grid[i][j] = " ";
          }  
        }
      }
    }
    return this.grid;
  }

  //refactor this - done
  getDistance(start, end) {
    //console.log(this.start, this.end);
    return Math.sqrt((start.row - end.row) ** 2 + (start.col - end.col) ** 2);
  }

  //refactor this - done
  checkValidMoveAdjacent() {
    const distance = this.getDistance(this.start, this.end);
    if (distance === 1) {
      return true;
    } else {
      return false;
    }
  }

  checkColorBallMove() {
    if (this.userActive === false)
      return {
        isColorBallWithNormal: false,
        isColorBallWithStriped: false,
        laserList: [],
      };
    let colorBall;
    let other;
    let normalColor = "";
    let stripedColor = "";
    this.isColorBallWithNormal = false;
    this.isColorBallWithStriped = false;
    this.gridColorBallWithNormal = this.initGridArray(
      this.rowCount,
      this.colCount
    );
    this.gridColorBallWithStriped = this.initGridArray(
      this.rowCount,
      this.colCount
    );

    if (this.start.color === "G") {
      colorBall = this.start;
      other = this.end;
    } else if (this.end.color === "G") {
      colorBall = end;
      other = start;
    } else {
      return {
        isColorBallWithNormal: this.isColorBallWithNormal,
        isColorBallWithStriped: this.isColorBallWithStriped,
        laserList: this.laserList,
      };
    }

    this.grid[colorBall.row][colorBall.col] = "1";
    this.grid[other.row][other.col] = "1";

    this.isColorBallWithNormal = other.color >= "A" && other.color <= "F";
    this.isColorBallWithStriped = other.color >= "H" && other.color <= "S";
    if (this.isColorBallWithNormal) {
      normalColor = other.color;
      this.assignColorBallWithNormal(normalColor, colorBall);
    } else if (this.isColorBallWithStriped) {
      stripedColor = this.stripedToNormal(other.color);
      this.assignColorBallWithStriped(stripedColor, colorBall);
    }

    return {
      isColorBallWithNormal: this.isColorBallWithNormal,
      isColorBallWithStriped: this.isColorBallWithStriped,
      laserList: this.laserList,
    };
  }

  checkNormalWithStripedMove(start, end) {
    let lineStart = {};
    let lineEnd = {};
    let list = [];
    this.isNormalWithStripedMove = false;

    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.colCount; j++) {
        if (this.gridThree[i][j] === "1") {
          if (this.grid[i][j] >= "H" && this.grid[i][j] <= "M") {
            this.horizontalLaser(i);
            lineStart = {
              row: i,
              col: 0,
            };
            lineEnd = {
              row: i,
              col: this.colCount - 1,
            };
            list.push({
              start: lineStart,
              end: lineEnd,
            });
            this.isNormalWithStripedMove = true;
          } else if (this.grid[i][j] >= "N" && this.grid[i][j] <= "S") {
            this.verticalLaser(j);
            lineStart = {
              row: 0,
              col: j,
            };
            lineEnd = {
              row: this.rowCount - 1,
              col: j,
            };
            list.push({
              start: lineStart,
              end: lineEnd,
            });
            this.isNormalWithStripedMove = true;
          }
        }
      }
    }
    
    return {
      isNormalWithStripedMove: this.isNormalWithStripedMove,
      list2: list,
    };
  }

  stripedToNormal(str) {
    return str
      .replace("H", "A")
      .replace("N", "A")
      .replace("I", "B")
      .replace("O", "B")
      .replace("J", "C")
      .replace("P", "C")
      .replace("K", "D")
      .replace("Q", "D")
      .replace("L", "E")
      .replace("R", "E")
      .replace("M", "F")
      .replace("S", "F");
  }

  checkCandyMatch() {
    this.isThree = false;
    this.isFour = false;
    this.isFive = false;
    this.isColorBallWithNormal = false;
    this.isColorBallWithStriped = false;
    this.isNormalWithStripedMove = false;
    //prioity given to the rarest
    const { isColorBallWithNormal, isColorBallWithStriped, laserList } =
      this.checkColorBallMove();

    //results in gridThree marked with 1 (normal candy)
    this.isThree = this.checkThreeInALine();
    //must be 3 in a row for normal and striped to be true
    if (this.isThree) {
      const { isNormalWithStripedMove, list2 } =
        this.checkNormalWithStripedMove(this.start, this.end);
      this.laserList = [...this.laserList, ...list2];
    } else {
      this.Four = false;
      this.Five = false;
      return {
        isColorBallWithNormal: this.isColorBallWithNormal,
        isColorBallWithStriped: this.isColorBallWithStriped,
        isThree: this.isThree,
        isFour: this.isFour,
        isFive: this.isFive,
      };
    }

    this.isFour = this.checkFourInALine();

    //results in gridFour marked with H to S (striped candy)
    if (this.isFour) {
      this.giveStripedCandy();
      //console.log(this.gridFour);
    }

    this.isFive = this.checkFiveInALine();
    //results in gridFive marked with G (color ball)
    if (this.isFive) {
      this.giveColorBall();
      //console.log(this.gridFive);
    }

    return {
      isColorBallWithNormal: this.isColorBallWithNormal,
      isColorBallWithStriped: this.isColorBallWithStriped,
      isThree: this.isThree,
      isFour: this.isFour,
      isFive: this.isFive,
    };
  }

  getRandomStripeCandy(color) {
    const n = Math.floor(Math.random() * 2); //0 or 1
    switch (color) {
      case "A":
        return n === 1 ? "H" : "N";
        break;
      case "B":
        return n === 1 ? "I" : "O";
        break;
      case "C":
        return n === 1 ? "J" : "P";
        break;
      case "D":
        return n === 1 ? "K" : "Q";
        break;
      case "E":
        return n === 1 ? "L" : "R";
        break;
      case "F":
        return n === 1 ? "M" : "S";
        break;
      default:
        console.log("getRandomStripeCandy: error", "color:", color);
        break;
    }
  }

  isPointOnLine(point, start, end) {
    if (start === undefined || end === undefined) return false;
    if (
      point.row === start.row &&
      start.col <= end.col &&
      point.col >= start.col &&
      point.col <= end.col
    ) {
      // point is on the same row and between start and end columns
      return true;
    } else if (
      point.col === start.col &&
      start.row <= end.row &&
      point.row >= start.row &&
      point.row <= end.row
    ) {
      // point is on the same column and between start and end rows
      return true;
    } else {
      // point is not on the line between start and end
      return false;
    }
  }

  //OMG!!
  giveColorBall() {
    //scan rows and if 1, match the color found in grid
    //get the start to end of every four in a row
    let list = [];

    if (!this.isFive) {
      console.log("gridFive is empty");
      return;
    }

    for (let i = 0; i < this.rowCount; i++) {
      let count = 0;
      let start = {};
      let end = {};
      for (let j = 0; j < this.colCount; j++) {
        if (this.gridFive[i][j] === "1") {
          count++;
          if (count === 1) {
            start.row = i;
            start.col = j;
          } else if (count === 5) {
            end.row = i;
            end.col = j;
            list.push({
              start,
              end,
              color: this.grid[i][j],
              gdStart: this.getStart(),
              gdEnd: this.getEnd(),
            });
            count = 0;
            start = {};
            end = {};
          }
        }
      }
    }

    for (let j = 0; j < this.colCount; j++) {
      let count = 0;
      let start = {};
      let end = {};
      for (let i = 0; i < this.rowCount; i++) {
        if (this.gridFive[i][j] === "1") {
          count++;
          if (count === 1) {
            start.row = i;
            start.col = j;
          } else if (count === 5) {
            end.row = i;
            end.col = j;
            list.push({
              start,
              end,
              color: this.grid[i][j],
              gdStart: this.getStart(),
              gdEnd: this.getEnd(),
            });
            count = 0;
            start = {};
            end = {};
          }
        }
      }
    }
    //console.log(list);
    list.forEach((item) => {
      const isStartOnLine = this.isPointOnLine(
        item.gdStart,
        item.start,
        item.end
      );
      const isEndOnLine = this.isPointOnLine(item.gdEnd, item.start, item.end);
      if (item.color === item.gdStart.color && isStartOnLine) {
        this.gridFive[this.start.row][this.start.col] = "G";
      } else if (item.color === item.gdEnd.color && isEndOnLine) {
        this.gridFive[this.end.row][this.end.col] = "G";
      } else {
        //no match, this is not user generated
        //assign randomly
        if (item.start.row === item.end.row) {
          //randomly assign along the row
          this.gridFive[item.start.row][
            this.start.col + Math.floor(Math.random() * 5)
          ] = "G";
        } else if (item.start.col === item.end.col) {
          //randomly assign along the col
          this.gridFive[item.start.row + Math.floor(Math.random() * 5)][
            item.start.col
          ] = "G";
        }
      }
    });
  }

  scanRows() {
    let list = [];
    for (let i = 0; i < this.rowCount; i++) {
      let count = 0;
      let start = {};
      let end = {};
      for (let j = 0; j < this.colCount; j++) {
        if (this.gridFour[i][j] === "1") {
          count++;
          if (count === 1) {
            start.row = i;
            start.col = j;
          } else if (count === 4) {
            end.row = i;
            end.col = j;
            list.push({
              start,
              end,
              color: this.grid[i][j],
              gdStart: this.getStart(),
              gdEnd: this.getEnd(),
            });
            count = 0;
            start = {};
            end = {};
          }
        }
      }
    }
    return list;
  }

  scanColumns() {
    let list = [];
    for (let j = 0; j < this.colCount; j++) {
      let count = 0;
      let start = {};
      let end = {};
      for (let i = 0; i < this.rowCount; i++) {
        if (this.gridFour[i][j] === "1") {
          count++;
          if (count === 1) {
            start.row = i;
            start.col = j;
          } else if (count === 4) {
            end.row = i;
            end.col = j;
            list.push({
              start,
              end,
              color: this.grid[i][j],
              gdStart: this.getStart(),
              gdEnd: this.getEnd(),
            });
            count = 0;
            start = {};
            end = {};
          }
        }
      }
    }
    return list;
  }

  assignCandy({ list, gridFour, start, end }) {
    //console.log({ ...list, gridFour, start, end });
    list.forEach((item) => {
      let stripedCandy = this.getRandomStripeCandy(item.color);
      const isStartOnLine = this.isPointOnLine(
        item.gdStart,
        item.start,
        item.end
      );
      const isEndOnLine = this.isPointOnLine(item.gdEnd, item.start, item.end);
      if (item.color === item.gdStart.color && isStartOnLine) {
        gridFour[start.row][start.col] = stripedCandy;
      } else if (item.color === item.gdEnd.color && isEndOnLine) {
        gridFour[end.row][end.col] = stripedCandy;
      } else {
        //no match, this is not user generated
        //assign randomly
        if (item.start.row === item.end.row) {
          //randomly assign along the row
          gridFour[item.start.row][start.col + Math.floor(Math.random() * 4)] =
            stripedCandy;
        } else if (item.start.col === item.end.col) {
          //randomly assign along the col
          gridFour[item.start.row + Math.floor(Math.random() * 4)][
            item.start.col
          ] = stripedCandy;
        }
      }
    });
    return gridFour;
  }

  giveStripedCandy() {
    //scan rows and if 1, match the color found in grid
    //get the start to end of every four in a row
    let list = [];
    if (!this.isFour) {
      console.log("gridFour is empty");
      return;
    } else {
      list = [...this.scanRows(), ...this.scanColumns()];
      this.gridFour = this.assignCandy({
        list,
        gridFour: this.gridFour,
        start: this.start,
        end: this.end,
      });
    }

    return this.gridFour;
  }

  markLineFive(str) {
    const regex = /([A-F])\1{4}/g;
    let numDuplicates = 0;
    const markedString = str.replace(regex, (match) => {
      numDuplicates = match.length;
      return "1".repeat(numDuplicates);
    });

    return markedString;
  }

  checkFiveInALine() {
    //check and mark rows
    let isCrushable = false;
    this.gridFive = [];
    for (let i = 0; i < this.rowCount; i++) {
      let rowText = this.grid[i].join("");
      const markedRow = this.markLineFive(rowText);
      if (markedRow.includes("1")) isCrushable = true;

      this.gridFive.push([...markedRow]);
    }

    //console.table("checkThreeOrMoreInALine: Rows Scanned", this.gridThree);

    for (let j = 0; j < this.colCount; j++) {
      let colText = "";
      for (let i = 0; i < this.rowCount; i++) {
        colText = colText + this.grid[i][j];
      }
      const markedCol = this.markLineFive(colText);
      if (markedCol.includes("1")) isCrushable = true;
      const markedColArray = [...markedCol];

      for (let i = 0; i < this.rowCount; i++) {
        if (this.gridFive[i][j] === "1") {
          ///only overwrite if not equal to '1'
        } else {
          this.gridFive[i][j] = markedColArray[i];
        }
      }
    }

    //console.table("checkThreeOrMoreInALine: Cols Scanned", this.gridThree);
    if (!isCrushable) this.gridFive = [];

    return isCrushable;
  }

  markLineFour(str) {
    const regex = /([A-F])\1{3}/g;
    let numDuplicates = 0;
    const markedString = str.replace(regex, (match) => {
      numDuplicates = match.length;
      return "1".repeat(numDuplicates);
    });

    return markedString;
  }

  checkFourInALine() {
    //check and mark rows
    let isCrushable = false;
    this.gridFour = [];
    for (let i = 0; i < this.rowCount; i++) {
      let rowText = this.grid[i].join("");
      const markedRow = this.markLineFour(rowText);
      if (markedRow.includes("1")) isCrushable = true;

      this.gridFour.push([...markedRow]);
    }

    //console.table("checkThreeOrMoreInALine: Rows Scanned", this.gridThree);

    for (let j = 0; j < this.colCount; j++) {
      let colText = "";
      for (let i = 0; i < this.rowCount; i++) {
        colText = colText + this.grid[i][j];
      }
      const markedCol = this.markLineFour(colText);
      if (markedCol.includes("1")) isCrushable = true;
      const markedColArray = [...markedCol];

      for (let i = 0; i < this.rowCount; i++) {
        if (this.gridFour[i][j] === "1") {
          ///only overwrite if not equal to '1'
        } else {
          this.gridFour[i][j] = markedColArray[i];
        }
      }
    }

    //console.table("checkThreeOrMoreInALine: Cols Scanned", this.gridThree);
    if (!isCrushable) this.gridFour = [];

    return isCrushable;
  }

  checkThreeInALine() {
    //check and mark rows
    let isCrushable = false;
    this.gridThree = [];
    for (let i = 0; i < this.rowCount; i++) {
      let rowText = this.grid[i].join("");
      const markedRow = this.markLineThree(rowText);
      if (markedRow.includes("1")) isCrushable = true;
      ////console.log(markedRow);
      this.gridThree.push([...markedRow]);
    }

    //console.table("checkThreeOrMoreInALine: Rows Scanned", this.gridThree);

    for (let j = 0; j < this.colCount; j++) {
      let colText = "";
      for (let i = 0; i < this.rowCount; i++) {
        colText = colText + this.grid[i][j];
      }
      const markedCol = this.markLineThree(colText);
      if (markedCol.includes("1")) isCrushable = true;
      const markedColArray = [...markedCol];

      for (let i = 0; i < this.rowCount; i++) {
        if (this.gridThree[i][j] === "1") {
          ///only overwrite if not equal to '1'
        } else {
          this.gridThree[i][j] = markedColArray[i];
        }
      }
    }

    //console.table("checkThreeOrMoreInALine: Cols Scanned", this.gridThree);
    if (!isCrushable) this.gridThree = [];

    return isCrushable;
  }

  markLineThree(str) {
    let newStr = str
      .replace("H", "A")
      .replace("N", "A")
      .replace("I", "B")
      .replace("O", "B")
      .replace("J", "C")
      .replace("P", "C")
      .replace("K", "D")
      .replace("Q", "D")
      .replace("L", "E")
      .replace("R", "E")
      .replace("M", "F")
      .replace("S", "F");

    const regex = /([A-Z])\1{2,}/g;
    let numDuplicates = 0;
    const markedString = newStr.replace(regex, (match) => {
      numDuplicates = match.length;
      return "1".repeat(numDuplicates);
    });

    return markedString;
  }

  horizontalLaser(row) {
    for (let j2 = 0; j2 < this.colCount; j2++) {
      //this.grid[row][j2] = "1";
      this.gridThree[row][j2] = "1";
    }
  }

  verticalLaser(col) {
    //vertical laser

    for (let i = 0; i < this.rowCount; i++) {
      //this.grid[i][col] = "1";
      this.gridThree[i][col] = "1";
    }
  }

  countTarget() {
    if (!this.isThree) return;
    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.colCount; j++) {
        if (
          this.gridThree[i][j] === "1" &&
          this.grid[i][j] === this.gameTargetCandy
        ) {
          if (this.gameTarget > 0) this.gameTarget = this.gameTarget - 1;
        }
      }
    }
  }

  countScores() {
    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.colCount; j++) {
        if (this.isThree) {
          if (this.gridThree[i][j] === "1") this.gameScore += 10;
        }
        if (this.isFour) {
          if (this.gridFour[i][j] === "1") this.gameScore += 100;
        }

        if (this.isFive) {
          if (this.gridFive[i][j] === "1") this.gameScore += 1000;
        }
      }
    }

    // this.gameLevel = level;
    // this.gameMoves = maxMoves;
    // this.gameStars = gameStars;
    // this.gameTarget = gameTarget;
    // this.gameTargetCandy =gameTargetCandy;
    // this.gameScore = 0;
  }

  assignColorBallWithStriped2() {
    if (this.isColorBallWithStripedCandy) {
      for (let i = 0; i < this.rowCount; i++) {
        for (let j = 0; j < this.colCount; j++) {
          if (
            this.gridColorBallWithStriped[i][j] >= "H" &&
            this.gridColorBallWithStriped[i][j] <= "S"
          ) {
            this.grid[i][j] = this.gridColorBallWithStriped[i][j];
          }
          if (
            this.gridColorBallWithStriped[i][j] >= "H" &&
            this.gridColorBallWithStriped[i][j] <= "M"
          ) {
            this.horizontalLaser(i);
          }
          if (
            this.gridColorBallWithStriped[i][j] >= "N" &&
            this.gridColorBallWithStriped[i][j] <= "S"
          ) {
            this.verticalLaser(j);
          }
        }
      }
      this.isColorBallWithStripedCandy = false;
    }
  }

  assignColorBallWithNormal(normalColor, colorBall) {
    //color+normal
    this.laserList = [];
    this.gridThree = this.initGridArray(this.rowCount, this.colCount);
    this.gridColorBallWithNormal = this.initGridArray(
      this.rowCount,
      this.colCount
    );
    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.colCount; j++) {
        if (this.grid[i][j] === normalColor) {
          this.grid[i][j] = "1";
          this.gridThree[i][j] = "1";
          this.laserList.push({
            start: colorBall,
            end: { row: i, col: j },
          });
        }
      }
    }
    //console.log(normalColor, this.laserList.length, this.grid);
    this.countScores();
    this.countTarget();
    this.gridThree = [];
  }

  assignColorBallWithStriped(stripedColor, colorBall) {
    //color+striped
    this.gridColorBallWithStriped = this.initGridArray(
      this.rowCount,
      this.colCount
    );
    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.colCount; j++) {
        if (this.grid[i][j] === stripedColor) {
          let thisStripe = this.getRandomStripeCandy(stripedColor);
          //randomly assign  striped candy
          this.grid[i][j] = thisStripe;
          if (thisStripe >= "H" && thisStripe <= "M") {
            this.horizontalLaser(i);
          } else {
            this.verticalLaser(j);
          }

          this.gridColorBallWithStriped[i][j] = thisStripe;
          this.laserList.push({
            start: colorBall,
            end: { row: i, col: j },
          });
        }
      }
    }
    this.countScores();
    this.countTarget();
  }

  assignNormalWithStriped() {
    //remove items, including laser zaps
    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.colCount; j++) {
        let isHorizontal = this.grid[i][j] >= "H" && this.grid[i][j] <= "M";
        let isVertical = this.grid[i][j] >= "N" && this.grid[i][j] <= "S";

        if (isHorizontal || isVertical) {

          if (this.isNormalWithStripedMove) {
            //Striped candy laser
            if (isHorizontal) {
              this.horizontalLaser(i);
            } else if (isVertical) {
              this.verticalLaser(j);
            }
          }
        }
      }
    }
  }

  giveStripedCandyAndColorBall() {
    //add striped candy AFTER the others are removed
    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.colCount; j++) {
        if (this.isFour) {
          if (this.gridFour[i][j] >= "H" && this.gridFour[i][j] <= "S") {
            //Add striped candy
            this.grid[i][j] = this.gridFour[i][j];
          }
        }

        if (this.isFive) {
          if (this.gridFive[i][j] === "G") {
            //Add color ball
            this.grid[i][j] = this.gridFive[i][j];
          }
        }
      }
    }
  }

  resetAllValues() {
    // this.start = {};
    // this.end = {};
    this.gridThree = [];
    this.gridFour = [];
    this.gridFive = [];
    this.gridColorBallWithNormal = [];
    this.gridColorBallWithStriped = [];
    this.isColorBallWithNormal = false;
    this.isColorBallWithStriped = false;
    this.isNormalWithStripedMove = false;
  }

  removeOnesAndGiveSpecialCandy() {
    this.removeOnes();
    this.assignNormalWithStriped();
    this.giveStripedCandyAndColorBall();
    this.resetAllValues();
  }

  //refactor this - done
  swapCandy() {
    const temp = this.grid[this.end.row][this.end.col];
    this.grid[this.end.row][this.end.col] =
      this.grid[this.start.row][this.start.col];
    this.grid[this.start.row][this.start.col] = temp;
  }

  //refactored wth map function and mapping function is abstracted for clarity
  fillGridArrayBlanks4() {
    const transformFunction = (item) =>
      item === " " ? this.getRandomCandy() : item;
    const result = this.grid.map((row) => row.map(transformFunction));
    this.grid = result;
    return result;
  }

  //map2d is a method of super class Array2d that extends Array class

  fillGridArrayBlanks() {
    let transformFunction = (item, colIndex) =>
      item === " " ? this.getRandomCandy() : item;
    this.grid = this.grid.map2d(transformFunction);
    return this.grid;
  }

  dropCandy() {
    for (let j = 0; j < this.colCount; j++) {
      let col = "";
      for (let i = 0; i < this.rowCount; i++) {
        col = col + this.grid[i][j];
      }
      //console.log("col", col);
      col = col.replaceAll(" ", "");
      col = " ".repeat(this.rowCount - col.length) + col; // this removes spaces between and pads left spaces
      let colArray = [...col];
      //console.log("colArray", colArray);
      for (let i = 0; i < this.rowCount; i++) {
        this.grid[i][j] = colArray[i];
      }
    }
    return this.grid;
  }
}
