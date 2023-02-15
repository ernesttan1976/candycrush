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
      this.fillGridArray();
      this.setStartId("");
      this.setEndId("");

      this.stateOf = { ready: 0, check: 1, crush: 2, drop: 3 };
      this.state = this.stateOf["ready"];
      console.log(this.state);
    }

    setStartId(id) {
      if (id === "") {
        this.start.id = "";
        this.start.row = "";
        this.start.col = "";
        this.start.value = "";
      } else {
        this.start.id = id;
        this.start.row = this.getRow(id);
        this.start.col = this.getCol(id);
        this.start.value = this.grid[this.start.row][this.start.col];
      }
    }

    setEndId(id) {
      if (id === "") {
        this.end.id = "";
        this.end.row = "";
        this.end.col = "";
        this.end.value = "";
      } else {
        this.end.id = id;
        this.end.row = this.getRow(id);
        this.end.col = this.getCol(id);
        this.end.value = this.grid[this.end.row][this.end.col];
      }
    }

    getRow(id) {
      //convert r1c1 to {row, col} and to "A"
      return id ? Number(id.slice(1, 2)) : "";
    }

    getCol(id) {
      return id ? Number(id.slice(3, 4)) : "";
    }

    getRandomCandy() {
      return String.fromCharCode(
        65 + Math.floor(Math.random() * this.candyCount)
      );
    }

    //Fill game grid with values
    fillGridArray() {
      //String.fromCharCode(65) => 'A'
      //A = 65, F = 70, Z = 90
      this.grid = [];
      for (let i = 0; i < this.rowCount; i++) {
        let gridRow = [];
        for (let j = 0; j < this.colCount; j++) {
          gridRow.push(this.getRandomCandy());
        }
        this.grid.push(gridRow);
      }
    }

    compareAndRemoveOnesFromGridArray(){
      for (let i = 0; i < this.rowCount; i++) {
        for (let j = 0; j < this.colCount; j++) {
          if (gd.gridToCrushing[i][j]===1) {
              gd.grid[i][j]="";
          }
        }
      }
    }

    swapCandy() {
      //console.log("SwapCandy: gd:", gd);
      this.grid[this.start.row][this.start.col] = this.end.value;
      this.grid[this.end.row][this.end.col] = this.start.value;
    }

    checkThreeOrMoreInALine() {
      //check and mark rows
      let isCrushable = false;
      this.gridToCrush = [];
      for (let i = 0; i < gd.rowCount; i++) {
        let rowText = this.grid[i].join("");
        const markedRow = markLine(rowText);
        if (markedRow.includes("1")) isCrushable = true;
        //console.log(markedRow);
        this.gridToCrush.push([...markedRow]);
      }

      console.table("checkThreeOrMoreInALine: ", this.gridToCrush);

      for (let j = 0; j < gd.colCount; j++) {
        let colText = "";
        for (let i = 0; i < gd.rowCount; i++) {
          colText += this.grid[i][j];
        }
        const markedCol = markLine(colText);
        if (markedCol.includes("1")) isCrushable = true;
        const markedColArray = [...markedCol];

        for (let i = 0; i < gd.rowCount; i++) {
          if (this.gridToCrush[i][j] === "1") {
            ///only overwrite if not equal to '1'
          } else {
            this.gridToCrush[i][j] = markedColArray[i];
          }
        }
      }

      console.table("checkThreeOrMoreInALine: ", this.gridToCrush);
      if (!isCrushable) gd.gridToCrush = [];

      return isCrushable;
    }

    getDistance() {
      return Math.sqrt(
        (this.start.row - this.end.row) ** 2 + (this.start.col - this.end.col) ** 2
      );
    }

    checkValidMoveAdjacent() {
      const distance = this.getDistance();
      if (distance === 0) {
        console.log("distance = 0 : invalid");
        return false;
      } else if (distance > 1) {
        console.log("distance > 1 : invalid");
        return false;
      }
      if (distance === 1) {
        console.log("distance valid");
        return true;
      }
    }
  }

  function routerNext() {
    console.log(`state = ${gd.state}`);
    switch (gd.state) {
      case 0:
        console.log("state ready->check");
        // state = 0 "ready": listening for game events
        // -> change 0 to 1 when drag and drop event handler is called
        gd.state = gd.stateOf["check"];
        routerNext();
        break;
      case 1:
        console.log("state check");
        // state = 1 "check": checking for correct move, 3 or more in a line
        if (!gd.checkValidMoveAdjacent()) {
          // -> change 1 to 0 when check is failed (failed also means all candy is crushed)
          console.log("state check->ready (not valid adjacent move)");
          gd.state = gd.stateOf["ready"];
          routerNext();
        }

        if (!gd.checkThreeOrMoreInALine()) {
          // -> change 1 to 2 when check is passed
          console.log("state check->ready (not 3 or more in a line)");
          gd.state = gd.stateOf["ready"];
          routerNext();
        }

        gd.swapCandy();
        renderGrid();

        gd.state = gd.stateOf["crush"];
        routerNext();

        break;
      case 2:
        console.log("state crush");
        // state = 2 "crush" : animating the candy crush(es), assign "crush" class to candy
        // -> change 2 to 3 when setTimeout of "500ms" is ended (assume the animation takes 500ms)
        
        
        setTimeout(() => {
          console.log("state crush->drop, when setTimeout of 2s ended");
          compareAndRemoveOnesFromGridArray();
          renderGrid();
          gd.state = gd.stateOf["drop"];
          routerNext();
        }, 2000);

        break;
      case 3:
        console.log("state drop");
        // state = 3 "drop": define drop candy, animating the drop(s), remove "crush" class, assign "drop" class
        // -> change 3 to 1 when setTimeout of "500ms" is ended (assume the animation takes 500ms)
        setTimeout(() => {
          console.log("state drop->check, when setTimeout of 2s ended");
          renderGrid();
          gd.state = gd.stateOf["check"];
          routerNext();
        }, 2000);

        break;
      default:
        console.log("state invalid");
        break;
    }
    return;
  }

  //Fill array with 6 rows, 6 cols, 6 types of candy (represented by A to F)
  let gd = new GameData(6, 6, 6);
  console.log("GameData object created:", gd);

  //Cache the game elements
  gridContainer = document.querySelector("#grid");

  //Event listeners
  gridContainer.addEventListener("dragover", onDragOverHandler);
  gridContainer.addEventListener("drop", onDropHandler);
  gridContainer.addEventListener("dragstart", onDragStartHandler);

  function onDragStartHandler(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    gd.setStartId(ev.target.id);
    console.log("onDragStartHandler: start object", gd.start);
  }

  function onDragOverHandler(ev) {
    ev.preventDefault();
    //console.log("onDragOverHandler");
  }

  function onDropHandler(ev) {
    ev.preventDefault();
    gd.setEndId(ev.target.id);
    console.log("onDragStartHandler: start object", gd.start);
    routerNext();
  }

  function markLine(str) {
    const countObj = countInLine(str);
    //console.log("countObj: ",countObj);
    const filteredObj = filterCount(countObj);
    //console.log("filteredObj",filteredObj);
    const markedString = markString(filteredObj, str);
    //console.log("markedString: ", markedString);

    function countInLine(str) {
      let hash = {};
      const arr = [...str];
      arr.forEach((el, index) => {
        if (!hash[el]) {
          hash[el] = {};
          hash[el].count = 1;
          hash[el].start = index;
        } else {
          hash[el].count++;
          hash[el].end = index;
        }
      });
      return hash;
    }

    function filterCount(countObj) {
      const keys = Object.keys(countObj);
      const filteredObj = {};

      keys.forEach((key) => {
        if (
          countObj[key].count >= 3 &&
          countObj[key].count === countObj[key].end - countObj[key].start + 1
        ) {
          filteredObj[key] = { ...countObj[key] }; //copying object
        }
      });
      return filteredObj;
    }

    function markString(filteredObj, str) {
      let markedString = "" + str;
      const keys = Object.keys(filteredObj);

      keys.forEach((key) => {
        markedString = markedString.replaceAll(key, "1");
      });

      return markedString;
    }

    return markedString;
  }

  //Tests for markLine
  // const test = "AAAABBCCCDDEEEEEEFF";
  // const countObj = countInLine(test);
  // console.log("countObj: ",countObj);
  // const filteredObj = filterCount(countObj);
  // console.log("filteredObj",filteredObj);
  // const markedString = markString(filteredObj,test);
  // console.log("markedString: ", markedString);
  //console.log(test, markLine(test));

  function applyStyleToGridContainer() {
    if (!gridContainer) {
      console.log("gridContainer not defined");
      return;
    } else {
      const size = 80;
      gridContainer.style.cssText += `grid-template-columns: repeat(${gd.colCount}, ${size}px)`;
      gridContainer.style.cssText += `grid-template-rows: repeat(${gd.rowCount}, ${size}px)`;
      gridContainer.style.cssText += `width: ${
        size * gd.colCount + 5 * (gd.colCount - 1)
      }px`;
      gridContainer.style.cssText += `height: ${
        size * gd.colCount + 5 * (gd.colCount - 1)
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
        if (gd.grid[i][j]!=="") {
          item.src = `./images/candy${gd.grid[i][j]}.png`;
        } else {
          item.src = `./images/candy.png`;  
        }
        gridContainer.appendChild(item);
      }
    }
  }

  function init() {
    //NOTE must declare gridContainer before instantiation of gd
    applyStyleToGridContainer(gridContainer);
    renderGrid();
  }

  init();
}

CandyCrush();
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// This below section is some widgets for experimentation, not part of this game

function experimental() {
  const preview = document.querySelector("#preview");
  const box = document.querySelector("#div1");
  //console.log("box: " + box);
  box.addEventListener("dragover", onDragOverHandler2);
  box.addEventListener("drop", onDropHandler2);

  const item = document.querySelector("#img1");
  //console.log(`item: ${item}`);
  item.addEventListener("dragstart", onDragStartHandler2);
  //ITEM
  //on drag, save the element data , in this case it is the id
  function onDragStartHandler2(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    console.log("onDragStartHandler: setData", ev.target.id);
  }

  //BOX
  //ondragover, prevent the default
  function onDragOverHandler2(ev) {
    ev.preventDefault();
    console.log("onDragOverHandler");
  }

  //BOX
  function onDropHandler2(ev) {
    ev.preventDefault();
    console.dir(ev.dataTransfer);
    console.log(`types: ${ev.dataTransfer.types}`);
    console.dir(ev.dataTransfer.types[0]);
    console.dir(ev.dataTransfer.getData(ev.dataTransfer.types[0]));
    //   console.dir(ev.dataTransfer.getData("text"));
    //   console.dir(ev.dataTransfer.getData("Files"));

    if (ev.dataTransfer.types[0].includes("text")) {
      var data = ev.dataTransfer.getData("text");
      console.log("data:", data);

      ev.target.appendChild(document.getElementById(data));
      console.log(`drop: data:${data} ev.target ${ev.target}`);
    } else if (ev.dataTransfer.types[0].includes("Files")) {
      console.log("files");

      if (ev.dataTransfer.items) {
        //either it is a mixture of items or it is files
        console.log("items detected");
        handleImages(ev.dataTransfer.files, preview);
        [...ev.dataTransfer.items].forEach((file, i) => {
          console.log(`file no. ${i}, webkitRelativePath ${file.webkitRelativePath}
            file.name ${file.name}, file.type ${file.type}, file.size ${file.size}`);
          console.dir(file);
          console.log(file.getAsFile());
        });
      } else {
        //it is files
        //convert collection to array
        console.log("files detected");
      }
    }
  }

  function handleImages(files, preview) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith("image/")) {
        continue;
      }

      const img = document.createElement("img");
      img.classList.add("obj");
      img.file = file;
      preview.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.

      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  console.log("started");
}

//experimental();
