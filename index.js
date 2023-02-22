"use strict";
Array.prototype.map2d = function (conditionalFunction) {
  return this.map((row) => row.map(conditionalFunction));
};

import { min, max } from "./utils.js";
import {GameData} from "./GameData.js";


  //added this function map2d to Array as a generic function for 2d mapping

  

  //DOM dependency
  class User {
        //move, this affects the DOM
        loadUserData() {
          if (localStorage.getItem("userData")) {
            this.userData = JSON.parse(localStorage.getItem("userData"));
          } else {
            this.userData = [
              {
                name: "Random Kid",
                highestlevel: 1,
                highScore: 0,
                musicLevel: 0.2,
                soundLevel: 0.2,
                gameHistory: [
                  {
                    level: 1,
                    highScore: 0,
                    stars: 0,
                  },
                ],
              },
              {
                name: "Unicorn Girl",
                highestlevel: 9,
                highScore: 10000,
                musicLevel: 0.2,
                soundLevel: 0.2,
                gameHistory: [
                  {
                    level: 1,
                    highScore: 10000,
                    stars: 2,
                  },
                  {
                    level: 2,
                    highScore: 10000,
                    stars: 2,
                  },
                  {
                    level: 3,
                    highScore: 10000,
                    stars: 2,
                  },
                  {
                    level: 4,
                    highScore: 10000,
                    stars: 2,
                  },
                  {
                    level: 5,
                    highScore: 10000,
                    stars: 2,
                  },
                  {
                    level: 6,
                    highScore: 10000,
                    stars: 2,
                  },
                  {
                    level: 7,
                    highScore: 10000,
                    stars: 2,
                  },
                  {
                    level: 8,
                    highScore: 10000,
                    stars: 2,
                  },
                  {
                    level: 9,
                    highScore: 10000,
                    stars: 2,
                  },
                ],
              },
            ];
            this.saveUserData();
          }
          //console.log(this.userData);
        }
    
        saveUserData() {
          localStorage.setItem("userData", JSON.stringify(this.userData));
        }
  }

  let user = new User();

  //DOM dependency
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

      this.stripedcandycreated = new Audio("./sounds/stripedcandycreated.ogg");
      this.stripedcandyblast = new Audio("./sounds/stripedcandyblast.ogg");

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
      this.setVolume(this.volume);
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

        const {
          isThree,
          isFour,
          isFive,
          isColorBallWithNormal,
          isColorBallWithStriped,
        } = gd.checkCandyMatch();
        if (
          !isThree &&
          !isFour &&
          !isFive &&
          !isColorBallWithNormal &&
          !isColorBallWithStriped
        ) {
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
        gd.removeOnesAndGiveSpecialCandy();
        sound.candyfallplayrandom();
        renderGrid();
        setTimeout(() => {
          //console.log("end crush, when setTimeout of 2s ended");
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
        renderGrid();
        setTimeout(() => {
          //console.log("end drop, when setTimeout of 2s ended");
          gd.state = "fill";
          routerNext();
        }, 200);

        gd.state = "wait"; //set to wait, so as not to trigger
        break;
      case "fill":
        //console.log("start fill");
        gd.fillGridArrayBlanks();
        //console.log("After filling:", gd.grid);
        renderGrid();
        setTimeout(() => {
          //console.log("end fill, when setTimeout of 2s ended");
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
        candyCount: 6,
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
      //console.log(levelArray);
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
  const addUser = document.querySelector("#add-user");

  const rangeSound = document.querySelector("#range-sound");
  const audio = document.querySelector("#music");

  const gameName = document.querySelector("#game-name");
  const gameLevel = document.querySelector("#game-level");
  const gameMoves = document.querySelector("#game-moves");
  const gameStars = document.querySelector("#game-stars");
  const gameTarget = document.querySelector("#game-target");
  const gameScore = document.querySelector("#game-score");
  const inputName = document.querySelector("#name");
  const selectUser = document.querySelector("#select-user");

  //Event listeners
  window.onresize = applyStyleToGridContainer;
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
  inputName.addEventListener("blur", inputNameHandler);
  selectUser.addEventListener("change", selectUserHandler);
  addUser.addEventListener("click", addUserHandler);

  function inputNameHandler(ev) {
    //console.log(inputName.value);
    user.saveUserData();
  }

  function addUserHandler(ev) {
    if (inputName.value !== "") {
      gd.userData = [
        ...gd.userData,
        {
          name: inputName.value,
          highestlevel: 1,
          highScore: 0,
          musicLevel: 0.2,
          soundLevel: 0.2,
          gameHistory: [
            {
              level: 1,
              highScore: 0,
              stars: 0,
            },
          ],
        },
      ];
    }
    user.saveUserData();
    selectUserHandler(); //refresh the select with new user name
    selectUser.value = inputName.value;
    inputName.value = "";
  }

  function selectUserHandler(ev) {
    //console.log(selectUser.value);
  }

  function loadUserList(ev) {
    selectUser.innerHTML = "";
    gd.userData.forEach((user) => {
      const optionEl = document.createElement("option");
      optionEl.textContent = user.name;
      optionEl.value = user.name;
      selectUser.appendChild(optionEl);
    });

    // {
    //   name: "Random Kid",
    //   highestlevel: 1,
    //   highScore: 0,
    //   musicLevel: 0.2,
    //   soundLevel: 0.2,
    //   gameHistory: [
    //     {
    //       level: 1,
    //       highScore: 0,
    //       stars: 0,
    //     },
    //   ],
    // }
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
        //load user list
        loadUserList();
        break;
    }
  }

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
    const volume = ev.target.value / 100;
    sound.setVolume(volume);
    gd.userData.soundLevel = volume;
    user.saveUserData();
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



  function setCellSizeResponsive() {
    const maxSize = max(gd.rowCount, gd.columnCount);
    const sizeBasedOnRowHeight =
      (window.innerHeight * 0.7 - gd.gap * (gd.rowCount - 1)) / gd.rowCount;
    const sizeBasedOnColWidth =
      (window.innerWidth * 0.7 - gd.gap * (gd.colCount - 1)) / gd.colCount;
    if (window.innerWidth < 768 || window.innerWidth < window.innerHeight) {
      gd.size = min(sizeBasedOnColWidth, sizeBasedOnRowHeight);
      //console.log("min: ", sizeBasedOnColWidth,sizeBasedOnRowHeight);
    } else {
      gd.size = min(80, max(sizeBasedOnColWidth, sizeBasedOnRowHeight));
      //console.log("max: ", sizeBasedOnColWidth,sizeBasedOnRowHeight);
    }
  }

  function applyStyleToGridContainer() {
    if (!gridContainer) {
      //console.log("gridContainer not defined");
      return;
    } else {
      setCellSizeResponsive();
      gridContainer.style.gridTemplateColumns = `repeat(${gd.colCount}, ${gd.size}px)`;
      gridContainer.style.gridTemplateRows = `repeat(${gd.rowCount}, ${gd.size}px)`;
      gridContainer.style.width = `${gd.size * gd.colCount}px`;
      gridContainer.style.height = `${gd.size * gd.rowCount}px`;
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
    // let from={row:0,col:0};
    // let to={row:0,col:gd.colCount-1};

    // renderLaser(from,to);

    // from={row:0,col:0};
    // to={row:gd.rowCount-1,col:gd.colCount-1};

    // renderLaser(from,to);

    // from={row:gd.rowCount-1,col:0};
    // to={row:0,col:gd.colCount-1};

    // renderLaser(from,to);

    // from={row:1,col:0};
    // to={row:1,col:gd.colCount-1};

    // renderLaser(from,to);

    // from={row:2,col:0};
    // to={row:2,col:gd.colCount-1};

    // renderLaser(from,to);

    // from={row:3,col:0};
    // to={row:3,col:gd.colCount-1};

    // renderLaser(from,to);

    // from={row:gd.rowCount-1,col:0};
    // to={row:gd.rowCount-1,col:gd.colCount-1};

    // renderLaser(from,to);

    // from={row:0,col:0};
    // to={row:gd.rowCount-1,col:0};

    // renderLaser(from,to);

    // from={row:0,col:gd.colCount-1};
    // to={row:gd.rowCount-1,col:gd.colCount-1};

    // renderLaser(from,to);
  }

  // function findLength(from, to){
  //   if (from.row===to.row){
  //     return Math.abs(from.col-to.col);
  //   } else if (from.col ===to.col){
  //     return Math.abs(from.row-to.row);
  //   } else {
  //     return Math.sqrt((to.row-from.row)**2+(to.col-from.col)**2);
  //   }
  // }

  // function findAngle(from, to){
  //   if (from.row===to.row){
  //     return 0;
  //   } else if (from.col ===to.col){
  //     return 3.1415/2;
  //   } else {
  //     return angle = 180/3.1415*Math.atan2((to.row-from.row),-(to.col-from.col));
  //   }
  // }

  // function midPoint(from,to){
  //   if (from.row===to.row){
  //     return {x:(from.col+to.col)/2, y:from.row};
  //   } else if (from.col ===to.col){
  //     return {x: from.col, y: (from.row+to.row)/2};
  //   } else {
  //     return {
  //       y: (from.row+to.row)/2,
  //       x: (from.col+to.col)/2,
  //     }
  //   }

  // }

  // function renderLaser(from, to){

  //   let laser = document.createElement("div");
  //   laser.style.position = "absolute";
  //   const gridWidth = (gd.size * gd.colCount);
  //   const gridHeight = (gd.size * gd.rowCount);

  //   const midpoint = midPoint(from, to);

  //   const length = findLength(from, to);
  //   console.log(length);
  //   const angle = 180/3.1415*Math.atan2((to.row-from.row),(to.col-from.col));
  //   console.log(angle);

  //   const top = window.innerHeight/2 - gridHeight/2 + (midpoint.y)*gd.size;
  //   const left = window.innerWidth/2 - gridWidth/2 + (midpoint.x)*gd.size;
  //   laser.style.top = `${top}px`;
  //   laser.style.left = `${left}px`;
  //   laser.style.height=`${gd.size*0.05}px`;
  //   laser.style.width=`${(length*gd.size*1.2)}px`;
  //   laser.style.backgroundColor="#fdff90c5";
  //   laser.style.boxShadow=`#fdff90c5 0px 1px 10px 10px`;
  //   laser.style.transform=`rotate(${angle}deg)`;
  //   gridContainer.appendChild(laser);
  // }
  

  function init() {
    //NOTE must declare gridContainer before instantiation of gd
    user.loadUserData(gd.currentUser);
    applyStyleToGridContainer(gridContainer);
    renderGrid();
    //document.addEventListener('contextmenu', event => event.preventDefault());
    //sound.music2.play();

    audio.volume = 0.3;

  }

  init();


//CandyCrush();

