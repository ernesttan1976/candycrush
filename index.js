function CandyCrush() {
  let grid = [];
  let gridMarked = [];
  let gridFly=[];
  let gameData = {
    startID: "",
    endID: "",
    rowCount: 6,
    colCount: 6,
    candyCount: 6,
    isCrushable: false,
  };

  function fillGrid(rowCount, colCount, candyCount) {
    //String.fromCharCode(65) => 'A'
    //A = 65, F = 70, Z = 90

    for (let i = 0; i < rowCount; i++) {
      const row = [];
      for (j = 0; j < colCount; j++) {
        row.push(
          String.fromCharCode(65 + Math.floor(Math.random() * candyCount))
        );
      }
      grid.push(row);
    }
  }

  fillGrid(6, 6, 6);
  console.log(grid);

  const gridContainer = document.querySelector("#grid");
  gridContainer.addEventListener("dragover", onDragOverHandler);
  gridContainer.addEventListener("drop", onDropHandler);
  gridContainer.addEventListener("dragstart", onDragStartHandler);

  function initGrid() {
    const rowCount = gameData.rowCount;
    const colCount = gameData.colCount;
    const size = 80;
    gridContainer.style.cssText += `grid-template-columns: repeat(${colCount}, ${size}px)`;
    gridContainer.style.cssText += `grid-template-rows: repeat(${rowCount}, ${size}px)`;
    gridContainer.style.cssText += `width: ${
      size * colCount + 5 * (colCount - 1)
    }px`;
    gridContainer.style.cssText += `height: ${
      size * colCount + 5 * (colCount - 1)
    }px`;
  }

  function onDragStartHandler(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    gameData.startID = ev.target.id;
    console.log("onDragStartHandler: startID", ev.target.id);
  }

  function onDragOverHandler(ev) {
    ev.preventDefault();
    //console.log("onDragOverHandler");
  }

  function onDropHandler(ev) {
    ev.preventDefault();
    gameData.endID = ev.target.id;
    //console.log("endID", ev.target.id);
    swapCandy(gameData);
    checkCandyCrushable();

      renderGrid();
      renderFly();
  
  }

  function convert(id) {
    //convert r1c1 to {row, col} and to "A"
    const row = Number(id.slice(1, id.indexOf("c")));
    const col = Number(id.slice(id.indexOf("c") + 1, id.length));
    const value = grid[row][col];
    console.log("convert:", id, { row, col, value });
    return { row: row, col: col, value: value };
  }

  function deepCopy(arr) {
    let arrCopy = [];
    arr.forEach((row) => {
      const rowCopy = [];
      row.forEach((item) => {
        rowCopy.push(item);
      });
      arrCopy.push(rowCopy);
    });
    console.log("DeepCopy:", arr, arrCopy);
    return arrCopy;
  }

  function swapCandy(gameData) {
    console.log("gamedata:", gameData);

    const start = convert(gameData.startID);
    const end = convert(gameData.endID);
    console.log({ ...start }, { ...end });
    grid[start.row][start.col] = end.value;
    grid[end.row][end.col] = start.value;

    const result = checkValidMoveAdjacent(start, end);
    
    gameData.isCrushable = checkCandyCrushable();
    if (result === false || gameData.isCrushable === false ) {
      //revert to previous values
      grid[start.row][start.col] = start.value;
      grid[end.row][end.col] = end.value;
      return;
    }


    
    //Check if valid, otherwise swap it back.
    //1. Candy can only move to up, down, left, right
    //2. Candy can only move if there is at least 3 candy matches after moving.
    //Save a copy of the grid, revert to previous grid if invalid
    //3. Check all rows and columns for 3 or more in a line. Make a grid of marked candy + missing candy.

    //4. Animate the marked candy flying to the right in a swimming pattern.
    //5. Refresh the grid with missing candy.
    //6. Candy drops by gravity to fill the missing holes. Random candy comes in from the top.
    //   This must be done step by step. For each step, run 3,4,5 recursively.
  }




  function checkCandyCrushable() {
    //check and mark rows
    let isCrushable=false;
    gridMarked = [];
    for (let i = 0; i < gameData.rowCount; i++) {
      let rowText = grid[i].join("");
      const markedRow = markLine(rowText);
      if (markedRow.includes('1')) isCrushable = true;
      //console.log(markedRow);      
      gridMarked.push([...markedRow]);
    }

    console.table(gridMarked);

    for (let j = 0; j < gameData.colCount; j++) {
      let colText = "";
      for (let i = 0; i < gameData.rowCount; i++) {
        colText += grid[i][j];
      }
      const markedCol = markLine(colText);
      if (markedCol.includes('1')) isCrushable = true;
      const markedColArray = [...markedCol];

      for (let i = 0; i < gameData.rowCount; i++) {
          
        if (gridMarked[i][j] === '1') {
          ///only overwrite if not equal to '1'
        } else {
          gridMarked[i][j] = markedColArray[i];
        }
      }
    }

    gridFly=[];
    for (let i=0; i<gameData.rowCount;i++){
      for (let j=0;j<gameData.colCount;j++){
          if (gridMarked[i][j]==='1')
          { 
            gridFly.push({
              row: i,
              col:j,
            })
          }
      }
    }

    console.log("gridFly:",gridFly);

    console.log("isCrushable",isCrushable);
    console.table(gridMarked);
    return isCrushable;
  }

  function removeFromGrid(){
    gridFly.forEach(item=>{
      grid[item.row][item.col]="";
    })
  }

  function fillGrid(){
    gridFly.forEach(item=>{
      grid[item.row][item.col]=String.fromCharCode(65 + Math.floor(Math.random() * candyCount));
    })

  }

  function markLine(str){
      const countObj = countInLine(str);
      //console.log("countObj: ",countObj);
      const filteredObj = filterCount(countObj);
      //console.log("filteredObj",filteredObj);
      const markedString = markString(filteredObj,str);
      //console.log("markedString: ", markedString);
      return markedString;    
  }

  //Unit Tests for markLine
  // const test = "AAAABBCCCDDEEEEEEFF";
  // const countObj = countInLine(test);
  // console.log("countObj: ",countObj);
  // const filteredObj = filterCount(countObj);
  // console.log("filteredObj",filteredObj);
  // const markedString = markString(filteredObj,test);
  // console.log("markedString: ", markedString);
  //console.log(test, markLine(test));
    

  function countInLine(str) {
    let hash = {};
    const arr = [...str];
    arr.forEach((el,index) => {
      if (!hash[el]) {
        hash[el]={};
        hash[el].count=1;
        hash[el].start=index;
      } else {
        hash[el].count++;
        hash[el].end=index;
      }
    })
    return hash;
  }

  function filterCount(countObj){
    const keys = Object.keys(countObj);
    const filteredObj={};

    keys.forEach(key=>{
      if (countObj[key].count>=3 && (countObj[key].count===countObj[key].end-countObj[key].start+1))
      {
          filteredObj[key]={...countObj[key]}; //copying object
      }
    })
    return filteredObj;
  }

  function markString(filteredObj, str){
    let markedString=""+str;
    const keys = Object.keys(filteredObj);

    keys.forEach(key=>{
      markedString=markedString.replaceAll(key,"1");
    });

    return markedString;
  }





  function checkValidMoveAdjacent(start, end) {
    const distance = Math.sqrt(
      (start.row - end.row) ** 2 + (start.col - end.col) ** 2
    );
    console.log({ distance, start, end });
    if (distance === 0 || distance > 1) {
      console.log("distance invalid");
      return false;
    }
    if (distance === 1) {
      console.log("distance valid");
      return true;
    }
  }

  function renderGrid() {
    const rowCount = gameData.rowCount;
    const colCount = gameData.colCount;

    gridContainer.innerHTML = "";
    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < colCount; j++) {
        const item = document.createElement("img");
        item.id = `r${i}c${j}`;
        item.classList.add("cell");
        item.setAttribute("draggable", "true");
        if (grid[i][j]) item.src = `./images/candy${grid[i][j]}.png`;
        gridContainer.appendChild(item);
      }
    }

  }

  function renderFly(){
    gridFly.forEach(item=>{
      const flyEl = document.getElementById(`r${item.row}c${item.col}`);
      flyEl.classList.add("fly");
    })
  }



  function crushCandy() {}

  initGrid();
  renderGrid();
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
