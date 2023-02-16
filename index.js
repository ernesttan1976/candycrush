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

      this.states = ["wait", "ready", "check", "crush", "drop", "fill"];
      this.state = "ready";
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
        console.log("error: ",id," typeof ", typeof id);
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
        console.log("error: ",id," typeof ", typeof id);

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
      //console.log("SwapCandy: gd:", gd);
      this.grid[this.start.row][this.start.col] = this.end.value;
      this.grid[this.end.row][this.end.col] = this.start.value;
    }

    checkThreeOrMoreInALine() {
      //check and mark rows
      let isCrushable = false;
      this.gridToCrush = [];
      for (let i = 0; i < this.rowCount; i++) {
        let rowText = this.grid[i].join("");
        const markedRow = markLine(rowText);
        if (markedRow.includes("1")) isCrushable = true;
        //console.log(markedRow);
        this.gridToCrush.push([...markedRow]);
      }

      console.table("checkThreeOrMoreInALine: Rows Scanned", this.gridToCrush);

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

      console.table("checkThreeOrMoreInALine: Cols Scanned", this.gridToCrush);
      if (!isCrushable) this.gridToCrush = [];

      return isCrushable;
    }

    getDistance() {
      return Math.sqrt(
        (this.start.row - this.end.row) ** 2 +
          (this.start.col - this.end.col) ** 2
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
    switch (gd.state) {
      case "wait":
        console.log("wait");
        //do nothing
        break;
      case "ready":
        console.log("swapping candy");
        // state = 0 "ready": listening for game events
        // -> change 0 to 1 when drag and drop event handler is called
        gd.swapCandy();
        gd.state = "check";
        routerNext();
        break;
      case "check":
        console.log("start check");
        // state = 1 "check": checking for correct move, 3 or more in a line
        if (!gd.checkValidMoveAdjacent()) {
          // -> change 1 to 0 when check is failed (failed also means all candy is crushed)
          console.log("end check (not valid adjacent move)");
          gd.swapCandy(); //swap it back
          renderGrid();
          gd.state = "ready";
          routerNext();
        }

        if (!gd.checkThreeOrMoreInALine()) {
          // -> change 1 to 2 when check is passed
          console.log("end check (not 3 or more in a line)");
          gd.swapCandy(); //swap it back
          renderGrid();
          gd.state = "ready";
          routerNext();
        }

        renderGrid();

        gd.state = "crush";
        routerNext();

        break;
      case "crush":
        console.log("start crush");
        setTimeout(() => {
          console.log("end crush, when setTimeout of 2s ended");
          gd.compareAndRemoveOnesFromGridArray();
          renderGrid();
          gd.state = "drop";
          routerNext();
        }, 500);
        gd.state = "wait"; //set to wait, so as not to trigger

        break;
      case "drop":
        console.log("start drop");
        setTimeout(() => {
          console.log("end drop, when setTimeout of 2s ended");
          renderGrid();
          gd.state = "fill";
          routerNext();
        }, 500);
        break;
        gd.state = "wait"; //set to wait, so as not to trigger
      case "fill":
        console.log("start fill");
        setTimeout(() => {
          console.log("end fill, when setTimeout of 2s ended");
          renderGrid();
          gd.state = "ready";
          // routerNext();
        }, 500);
        gd.state = "wait"; //set to wait, so as not to trigger

        break;
      default:
        console.log("state invalid");
        break;
    }
    return;
  }

  //Fill array with 6 rows, 6 cols, 6 types of candy (represented by A to F)
  let gd = new GameData(8, 8, 6);
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
    const regex = /([A-Z])\1{2,}/g;
    let numDuplicates=0;
    const markedString = str.replace(regex, (match) => {
      numDuplicates = match.length;
      return '1'.repeat(numDuplicates);
    });

    //console.log("markedString: ", markedString);

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
