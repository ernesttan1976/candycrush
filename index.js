function CandyCrush() {
  //Declare game data with empty values
  class GameData {
    constructor(rowCount, colCount, candyCount) {
      this.rowCount = rowCount || 6;
      this.colCount = colCount || 6;
      this.candyCount = candyCount || 6;
      this.start = {};
      this.end = {};
      this.grid = [];
      this.gridToCrush = [];
      this.gridTemp = [];
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
    }

    setStartId(id) {
      try {
        if (id === "") {
          this.start.id = "";
          this.start.row = "";
          this.start.col = "";
          this.start.value = "";
        } else if (id === "grid") {
          //do nothing
        } else {
          this.start.id = id;
          this.start.row = this.getRow(id);
          this.start.col = this.getCol(id);
          this.start.value = this.grid[this.start.row][this.start.col];
        }
      } catch (e) {
        //console.log("error: ", id, " typeof ", typeof id);
      }
    }

    setEndId(id) {
      try {
        if (id === "") {
          this.end.id = "";
          this.end.row = "";
          this.end.col = "";
          this.end.value = "";
        } else if (id === "grid") {
          //do nothing
        } else {
          this.end.id = id;
          this.end.row = this.getRow(id);
          this.end.col = this.getCol(id);
          this.end.value = this.grid[this.end.row][this.end.col];
        }
      } catch (e) {
        //console.log("error: ", id, " typeof ", typeof id);
      }
    }

    getRow(id) {
      //convert r1c1 to {row, col} and to "A"
      const c = id.indexOf("c");
      return id ? Number(id.slice(1, c)) : "";
    }

    getCol(id) {
      const c = id.indexOf("c");
      return id ? Number(id.slice(c + 1, id.length)) : "";
    }

    getRandomCandy() {
      return String.fromCharCode(
        65 + Math.floor(Math.random() * this.candyCount)
      );
    }

    fillGridArray() {
      //String.fromCharCode(65) => 'A'
      //A = 65, F = 70, Z = 90
      this.grid = [];
      this.gridTemp = [];
      for (let i = 0; i < this.rowCount; i++) {
        let row = [];
        for (let j = 0; j < this.colCount; j++) {
          row.push(this.getRandomCandy());
        }
        this.grid.push(row);
        this.gridTemp.push(row);
      }
    }

    fillGridArrayBlanks() {
      for (let i = 0; i < this.rowCount; i++) {
        for (let j = 0; j < this.colCount; j++) {
          if (this.grid[i][j] === " ") {
            this.grid[i][j] = this.getRandomCandy();
          }
        }
      }
    }

    dropCandy() {
      for (let j = 0; j < this.colCount; j++) {
        let col = "";
        for (let i = 0; i < this.rowCount; i++) {
          col = col + this.grid[i][j];
        }
        //console.log("col", col);
        col = col.replaceAll(" ", "");
        col = " ".repeat(gd.rowCount - col.length) + col; // this removes spaces between and pads left spaces
        let colArray = [...col];
        //console.log("colArray", colArray);
        for (let i = 0; i < this.rowCount; i++) {
          this.grid[i][j] = colArray[i];
        }
      }
    }

    compareAndRemoveOnesFromGridArray() {
      for (let i = 0; i < this.rowCount; i++) {
        for (let j = 0; j < this.colCount; j++) {
          if (this.gridToCrush[i][j] === "1") {
            this.grid[i][j] = " ";
          }
        }
      }
      this.gridToCrush = [];
    }

    swapCandy() {
      ////console.log("SwapCandy: gd:", gd);
      const temp = this.grid[this.end.row][this.end.col];
      this.grid[this.end.row][this.end.col] =
        this.grid[this.start.row][this.start.col];
      this.grid[this.start.row][this.start.col] = temp;

      //this.grid[this.start.row][this.start.col] = this.end.value;
      //this.grid[this.end.row][this.end.col] = this.start.value;
    }

    checkThreeOrMoreInALine() {
      //check and mark rows
      let isCrushable = false;
      this.gridToCrush = [];
      for (let i = 0; i < this.rowCount; i++) {
        let rowText = this.grid[i].join("");
        const markedRow = markLine(rowText);
        if (markedRow.includes("1")) isCrushable = true;
        ////console.log(markedRow);
        this.gridToCrush.push([...markedRow]);
      }

      //console.table("checkThreeOrMoreInALine: Rows Scanned", this.gridToCrush);

      for (let j = 0; j < this.colCount; j++) {
        let colText = "";
        for (let i = 0; i < this.rowCount; i++) {
          colText = colText + this.grid[i][j];
        }
        const markedCol = markLine(colText);
        if (markedCol.includes("1")) isCrushable = true;
        const markedColArray = [...markedCol];

        for (let i = 0; i < this.rowCount; i++) {
          if (this.gridToCrush[i][j] === "1") {
            ///only overwrite if not equal to '1'
          } else {
            this.gridToCrush[i][j] = markedColArray[i];
          }
        }
      }

      //console.table("checkThreeOrMoreInALine: Cols Scanned", this.gridToCrush);
      if (!isCrushable) this.gridToCrush = [];

      return isCrushable;
    }

    getDistance() {
      //console.log(this.start, this.end);
      return Math.sqrt(
        (this.start.row - this.end.row) ** 2 +
          (this.start.col - this.end.col) ** 2
      );
    }

    checkValidMoveAdjacent() {
      const distance = this.getDistance();
      if (distance === 0) {
        //console.log("distance = 0 : invalid");
        return false;
      } else if (distance > 1) {
        //console.log("distance > 1 : invalid");
        return false;
      }
      if (distance === 1) {
        //console.log("distance valid");
        return true;
      }
    }
  }

  class Sound {
    constructor() {
      this.volume = 0.4;
      this.switch = new Audio("./sounds/switch.ogg");
      this.negativeswitch = new Audio("./sounds/negativeswitch.ogg");
      //this.loadgame = new Audio("./sounds/loadgame.ogg");
      this.candyfalls1 = new Audio("./sounds/candyfalls1.ogg");
      this.candyfalls2 = new Audio("./sounds/candyfalls2.ogg");
      this.candyfalls3 = new Audio("./sounds/candyfalls3.ogg");
      this.candyfalls4 = new Audio("./sounds/candyfalls4.ogg");

      this.cascade1 = new Audio("./sounds/cascade1.ogg");
      this.cascade2 = new Audio("./sounds/cascade2.ogg");
      this.cascade3 = new Audio("./sounds/cascade3.ogg");
      this.cascade4 = new Audio("./sounds/cascade4.ogg");
      this.cascade5 = new Audio("./sounds/cascade5.ogg");
      this.cascade6 = new Audio("./sounds/cascade6.ogg");
      this.cascade7 = new Audio("./sounds/cascade7.ogg");
      this.cascade8 = new Audio("./sounds/cascade8.ogg");
      this.cascade9 = new Audio("./sounds/cascade9.ogg");
      this.cascade10 = new Audio("./sounds/cascade10.ogg");
      this.cascade11 = new Audio("./sounds/cascade11.ogg");
      this.cascade12 = new Audio("./sounds/cascade12.ogg");
      this.music = new Audio("./sounds/music.ogg");
      this.music2 = new Audio("./sounds/music2.ogg");
      this.setVolume(0.4);
    }

    setVolume(volume) {
      this.volume = volume;
      Object.keys(this).forEach((key) => {
        if (key !== "volume") {
          this[key].volume = volume;
        }
      });
      //console.log(this);
    }

    candyfallplayrandom() {
      this[`candyfalls${gd.candyfallsCounter}`].play();
      gd.candyfallsCounter++;
      gd.candyfallsCounter = (gd.candyfallsCounter % 4) + 1;
    }

    candydropplayrandom() {
      this[`cascade${gd.cascadeCounter}`].play();
      gd.cascadeCounter++;
      gd.cascadeCounter = (gd.cascadeCounter % 12) + 1;
    }
  }

  let sound = new Sound();

  function routerNext() {
    switch (gd.state) {
      case "wait":
        //console.log("wait");
        //do nothing
        break;
      case "ready":
        //console.log("swapping candy");
        // state = 0 "ready": listening for game events
        // -> change 0 to 1 when drag and drop event handler is called
        gd.cascadeCounter = 1;
        gd.userActive = true;
        gd.swapCandy();
        sound.switch.play();
        gd.state = "check1";
        routerNext();
        break;
      case "check1":
        if (!gd.checkValidMoveAdjacent()) {
          // -> change 1 to 0 when check is failed (failed also means all candy is crushed)
          //console.log("end check (not valid adjacent move)");
          gd.swapCandy(); //swap it back
          //sound.negativeswitch.play();
          renderGrid();
          gd.state = "ready";
          return;
        }
        renderGrid();

        gd.state = "check2";
        routerNext();

        break;
      case "check2":
        //console.log("start check2");
        // state = 1 "check": checking for correct move, 3 or more in a line

        if (!gd.checkThreeOrMoreInALine()) {
          // -> change 1 to 2 when check is passed
          //console.log("end check2 (not 3 or more in a line)");
          //gd.swapCandy(); //swap it back
          if (gd.userActive) {
            gd.swapCandy();
            renderGrid();
            sound.negativeswitch.play();
          } else {
            //final cascade
            gd.cascadeCounter = 1;
          }
          renderGrid();
          gd.state = "ready";
          return;
        }

        renderGrid();

        gd.state = "crush";
        gd.userActive = false;
        routerNext();

        break;

      case "crush":
        //console.log("start crush");
        gd.compareAndRemoveOnesFromGridArray();
        sound.candyfallplayrandom();
        setTimeout(() => {
          //console.log("end crush, when setTimeout of 2s ended");
          renderGrid();
          gd.state = "drop";
          routerNext();
        }, 200);
        gd.state = "wait"; //set to wait, so as not to trigger

        break;
      case "drop":
        //console.log("start drop");
        gd.dropCandy();
        sound.candydropplayrandom();
        //console.log("dropped grid:", gd.grid);
        setTimeout(() => {
          //console.log("end drop, when setTimeout of 2s ended");
          renderGrid();
          gd.state = "fill";
          routerNext();
        }, 200);

        gd.state = "wait"; //set to wait, so as not to trigger
        break;
      case "fill":
        //console.log("start fill");
        gd.fillGridArrayBlanks();
        //console.log("After filling:", gd.grid);
        setTimeout(() => {
          //console.log("end fill, when setTimeout of 2s ended");
          renderGrid();
          gd.state = "check2"; // check2 because not moved by user
          routerNext();
        }, 200);
        gd.state = "wait"; //set to wait, so as not to trigger
        break;
      default:
        //console.log("state invalid");
        break;
    }
    return;
  }


  function loadLevel(level) {
    let levelArray = [
      {
        rowCount: 6,
        colCount: 6,
        candyCount: 4,
      },
      {
        rowCount: 7,
        colCount: 6,
        candyCount: 4,
      },
      {
        rowCount: 8,
        colCount: 7,
        candyCount: 5,
      },
      {
        rowCount: 8,
        colCount: 10,
        candyCount: 5,
      },
      {
        rowCount: 8,
        colCount: 14,
        candyCount: 6,
      },
      {
        rowCount: 8,
        colCount: 16,
        candyCount: 6,
      },
      {
        rowCount: 8,
        colCount: 18,
        candyCount: 6,
      },
      {
        rowCount: 8,
        colCount: 20,
        candyCount: 6,
      },
      {
        rowCount: 8,
        colCount: 22,
        candyCount: 6,
      },
    ];

    //console.log(window.innerWidth, window.innerHeight);
    if (window.innerWidth < window.innerHeight) {
      levelArray = [
        {
          rowCount: 6,
          colCount: 6,
          candyCount: 4,
        },
        {
          rowCount: 6,
          colCount: 7,
          candyCount: 4,
        },
        {
          rowCount: 8,
          colCount: 8,
          candyCount: 5,
        },
        {
          rowCount: 8,
          colCount: 8,
          candyCount: 5,
        },
        {
          rowCount: 8,
          colCount: 8,
          candyCount: 6,
        },
        {
          rowCount: 9,
          colCount: 8,
          candyCount: 6,
        },
        {
          rowCount: 9,
          colCount: 8,
          candyCount: 6,
        },
        {
          rowCount: 10,
          colCount: 8,
          candyCount: 6,
        },
        {
          rowCount: 10,
          colCount: 8,
          candyCount: 6,
        },
      ];
      console.log(levelArray);
    }

    const { rowCount, colCount, candyCount } = levelArray[level - 1];
    //console.log(rowCount, colCount, candyCount);
    let gdNew = new GameData(rowCount, colCount, candyCount);

    return gdNew;
  }

  //Fill array with 6 rows, 6 cols, 6 types of candy (represented by A to F)
  //let gd = new GameData(6, 6, 3);
  let gd = loadLevel(1);

  //console.log("GameData object created:", gd);

  //Cache the game elements
  const gridContainer = document.querySelector("#grid");
  const cells = document.querySelectorAll(".cell");

  const levelContainer = document.querySelector("#level-container");
  
  const startPage = document.querySelector("#start-page");
  const gamePage = document.querySelector("#game-page");
  const levelPage = document.querySelector("#level-page");
  const settingPage = document.querySelector("#setting-page");

  const playButton = document.querySelector("#play-button");
  const levelButton = document.querySelector("#level-button");
  const settingButton = document.querySelector("#setting-button");
  const backButton = document.querySelector("#back-button");
  const backButton2 = document.querySelector("#back-button2");
  
  const rangeSound = document.querySelector("#range-sound");
  const audio = document.querySelector("#music");
  
  
  const gameName = document.querySelector("#game-name");
  const gameLevel = document.querySelector("#game-level");
  const gameMoves = document.querySelector("#game-moves");
  const gameStars = document.querySelector("#game-stars");
  const gameTarget = document.querySelector("#game-target");
  const gameScore = document.querySelector("#game-score");
  const inputName = document.querySelector("#name");
  
  
  //Event listeners
  gridContainer.addEventListener("dragover", onDragOverHandler);
  gridContainer.addEventListener("drop", onDropHandler);
  gridContainer.addEventListener("dragstart", onDragStartHandler);
  playButton.addEventListener("click", playButtonHandler);
  levelButton.addEventListener("click", levelButtonHandler);
  settingButton.addEventListener("click", settingButtonHandler);
  backButton.addEventListener("click", backButtonHandler);
  backButton2.addEventListener("click", backButtonHandler);
  rangeSound.addEventListener("change", rangeChangeHandler);
  levelContainer.addEventListener("click", levelChangeButtonHandler);

  function levelChangeButtonHandler(ev) {
    const str = "" + ev.target.id;
    const level = str[5];
    //console.log(ev.target.id, level);
    gd = loadLevel(level);
    setActivePage("game");
    applyStyleToGridContainer(gridContainer);
    renderGrid();
  }

  function playButtonHandler(ev) {
    //console.log(ev.target);
    setActivePage("game");
  }

  function levelButtonHandler(ev) {
    setActivePage("level");
  }

  function settingButtonHandler(ev) {
    setActivePage("setting");
  }

  function backButtonHandler(ev) {
    setActivePage("game");
  }

  function rangeChangeHandler(ev) {
    //console.log("range", ev.target.value)
    sound.setVolume(ev.target.value / 100);
    //console.log(sound);
  }

  function onDragStartHandler(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    gd.setStartId(ev.target.id);
    //console.log("onDragStartHandler: start object", gd.start);
  }

  function onDragOverHandler(ev) {
    ev.preventDefault();
    ////console.log("onDragOverHandler");
  }

  function onDropHandler(ev) {
    ev.preventDefault();
    gd.setEndId(ev.target.id);
    //console.log("onDragStartHandler: start object", gd.start);
    routerNext();
  }

  function setActivePage(page) {
    switch (page) {
      case "start":
        startPage.style.display = "flex";
        gamePage.style.display = "none";
        levelPage.style.width = "0";
        levelPage.style.display = "none";
        settingPage.style.width = "0";
        settingPage.style.display = "none";
        break;
      case "game":
        startPage.style.display = "none";
        gamePage.style.display = "grid";
        levelPage.style.width = "0";
        levelPage.style.display = "none";
        settingPage.style.width = "0";
        settingPage.style.display = "none";
        break;
      case "level":
        startPage.style.display = "none";
        gamePage.style.display = "grid";
        levelPage.style.width = "100vw";
        levelPage.style.display = "flex";
        settingPage.style.width = "0";
        settingPage.style.display = "none";
        break;
      case "setting":
        startPage.style.display = "none";
        gamePage.style.display = "grid";
        levelPage.style.width = "0";
        levelPage.style.display = "none";
        settingPage.style.width = "100vw";
        settingPage.style.display = "flex";
        break;
    }
  }

  function markLine(str) {
    const regex = /([A-Z])\1{2,}/g;
    let numDuplicates = 0;
    const markedString = str.replace(regex, (match) => {
      numDuplicates = match.length;
      return "1".repeat(numDuplicates);
    });

    ////console.log("markedString: ", markedString);

    return markedString;
  }

  //Tests for markLine
  // const test = "AAAABBCCCDDEEEEEEFF";
  // const countObj = countInLine(test);
  // //console.log("countObj: ",countObj);
  // const filteredObj = filterCount(countObj);
  // //console.log("filteredObj",filteredObj);
  // const markedString = markString(filteredObj,test);
  // //console.log("markedString: ", markedString);
  // //console.log(test, markLine(test));

  function max(n1, n2) {
    return n1 > n2 ? n1 : n2;
  }

  function min(n1, n2) {
    return n1 < n2 ? n1 : n2;
  }

  function setCellSizeResponsive() {
    const maxSize = max(gd.rowCount, gd.columnCount);
    const sizeBasedOnRowHeight =  ((window.innerHeight * 0.7 - gd.gap * (gd.rowCount - 1)) / gd.rowCount);
    const sizeBasedOnColWidth = ((window.innerWidth * 0.7 - gd.gap * (gd.colCount - 1)) / gd.colCount);
      if (window.innerWidth < 768 || window.innerWidth < window.innerHeight) {
      gd.size = min(sizeBasedOnColWidth,sizeBasedOnRowHeight);
      //console.log("min: ", sizeBasedOnColWidth,sizeBasedOnRowHeight);
    } else {
      gd.size = min(80,max(sizeBasedOnColWidth,sizeBasedOnRowHeight));
      //console.log("max: ", sizeBasedOnColWidth,sizeBasedOnRowHeight);
    }
  }

  function applyStyleToGridContainer() {
    if (!gridContainer) {
      //console.log("gridContainer not defined");
      return;
    } else {
      setCellSizeResponsive();
      gridContainer.style.cssText += `grid-template-columns: repeat(${gd.colCount}, ${gd.size}px)`;
      gridContainer.style.cssText += `grid-template-rows: repeat(${gd.rowCount}, ${gd.size}px)`;
      gridContainer.style.cssText += `width: ${
        (gd.size * gd.colCount + gd.gap * (gd.colCount - 1))*1.1
      }px`;
      gridContainer.style.cssText += `height: ${
        (gd.size * gd.rowCount + gd.gap * (gd.rowCount - 1))*1.1
      }px`;
    }
  }

  function renderGrid() {
    gridContainer.innerHTML = "";
    for (let i = 0; i < gd.rowCount; i++) {
      for (let j = 0; j < gd.colCount; j++) {
        const item = document.createElement("img");
        item.id = `r${i}c${j}`;
        item.classList.add("cell");
        item.setAttribute("draggable", "true");
        item.width = gd.size;
        item.height = gd.size;
        if (gd.grid[i][j] === " ") {
          item.src = "";
          item.style.visibility = "hidden";
        } else {
          item.src = `./images/candy${gd.grid[i][j]}.png`;
          item.style.visibility = "visible";
        }
        gridContainer.appendChild(item);
      }
    }
  }

  function init() {
    //NOTE must declare gridContainer before instantiation of gd
    applyStyleToGridContainer(gridContainer);
    renderGrid();
    //document.addEventListener('contextmenu', event => event.preventDefault());
    //sound.music2.play();

    audio.volume = 0.3;
  }

  init();
}

CandyCrush();
