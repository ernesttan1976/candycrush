# [CANDY CRUSH](https://ernesttan1976.github.io/candycrush/) #

## GA SEI BOOTCAMP PROJECT ##
To demonstrate my proficiency in vanilla Javascript, HTML and CSS.  
Candy Crush is a single player, 3 tile-matching game which is well loved.

## BACKGROUND ###

Candy Crush Saga has today turned 10, and one of the world's most popular casual games  
is celebrating it with new in-game content. The developer of Candy Crush Saga, King,  
is promising celebratory features and updated, which include newly added audio tracks.  
Even after 10 years since its release, Candy Crush Saga is still among the most downloaded  
games in 2022 and cracks the top10 most downloaded mobile games regularly.

### TECHNOLOGIES USED ###
- Javascript
    + event handlers, including drap and drop
    + regex
- HTML
    + audio element
- CSS
    + flex and grid
    + shake animation
    + background gradient animation
- vitest
    + unit tests of functions and classes

### USER STORIES / FEATURES ###
#### PLANS ####
![Plan1](/planning1.jpg =600x400)
![Plan2](/planning2.jpg =600x400)
![Start Page](/startpage.jpg =600x400)
![Game Page](/gamepage.jpg =600x400)

#### Main ####
- [x] 1.Player swipes candy to match 3 tiles. resulting in candy being removed, and refilled from the top.
- [x] 2.Game to have sound effects and background music. This will give a great experience.
- [x] 3.Player wins the round when Player matches "X" number of "Y" colour candy in "Z" number of moves. Player loses the round when "Z" number of moves is zero.
- [x] 4.Score is calculated based on 3's, 4's and 5's, number of cascades. Resulting in grading of 1 star, 2 star, 3 star.
- [x] 5.Game to have start screen(x), game screen(x). Toggle menus for settings and level selection.
- [x] 6.Player can progress to level 2 to 9. Levels get harder with blocker tiles, more colours, larger board size, increase "X", decrease "Z".
- [ ] 7.Make the app mobile responsive. Vary the layout of the elements

#### OPTIONAL ####
- [x] 1.Four(4) in a line yields a striped candy. This will wipe out one line or column.
- [x] 2.Five(5) in a line yields a colour bomb. This will wipe out all of the same colour.
- [ ] 3.CSS Animation for the candy pop, candy fill, wiping laser effects.

## IMPLEMENT / HOW TO DO IT ##

### GAME UI ###
- [x] 1. Implement 8 x 8 grid with cells
- [x] 2. Study and implement drag and drop listeners
### Game Logic for Simplest 1 Move ###
#### LOGIC ####
- [x] 3. Candy can only move to up, down, left, right
- [x] 4. Candy can only move if there is at least 3 candy matches after moving. Save a copy of the grid, revert to previous grid if invalid
- [x] 5. Check all rows and columns for 3 or more in a line.
#### RENDER ####
- [x] 6. Remove the marked candy and render the grid.
- [x] 7. Drop the candy vertically. And fill in random candy from the top.
#### RECURSIVE ####
- [x] 8. Repeat steps 5 to 7 recursively. (this may be challenging)

### Game Logic for Multiple Moves ###
- [x] 9. Countdown the Number of Moves;
- [x] 10. Countdown the number of blue candy removed from 10.
- [x] 11. Game win if blue candy = 0;
- [x] 12. Game over if number of rounds = 0;
- [x] 13. Count points per item removed. 
- [] 14. Award 1 star for >18 moves, 2 star for >14 moves, 3 star for 10 moves

## EXTRACT OF THE CODE ##

### USE OF REGEX TO DETECT CONSECUTIVE LETTERS IN A STRING ###
```
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
```

### CODE REFACTORING ###
The below code is easily understood.
However it is tedious to type 2 for loops.
```
#### original function  ####
fillGridArrayBlanks() {
  for (let i = 0; i < this.rowCount; i++) {
    for (let j = 0; j < this.colCount; j++) {
      if (this.grid[i][j] === " ") {
        this.grid[i][j] = this.getRandomCandy();
      }
    }
  }
}
```

#### refactored with reduce ####
I refactored it to have 2 reduce functions. It worked, but REDUCE is hard to understand. So I scrapped it!
```
//refactored with reduce function
fillGridArrayBlanks2() {
  const result = this.grid.reduce((prevRows, currRow) => {
    const resultRow = currRow.reduce((prevItem, currItem) => {
      if (currItem === " ") {
        prevItem.push(this.getRandomCandy());
      } else {
        prevItem.push(currItem);
      }
      return prevItem;
    }, []);
    prevRows.push(resultRow);
    return prevRows;
  }, []);
  this.grid = result;
  return result;
}
```

#### Map 2 times ####
For this 3rd version I use the map function 2 times. And I put the conditional function separately so it is modular.
It is cleaner and more extendable. Different conditionals can be passed into the generic 2D array mapping function.
What do you think?
```
//refactored wth map function and conditional function is abstracted for clarity
    fillGridArrayBlanks3() {
      const conditionalFunction = (item) =>
        (item === " " ? this.getRandomCandy() : item);
      const result = this.grid.map((row) => row.map(conditionalFunction));
      this.grid = result;
      return result;
    }
```

#### Conclusion ####
Actually it is preferred to use nested for loop since it is easier to be understood.
It is more obvious I'm changing the row or the column.

## UNIT TEST WITH VITEST ##

### EXTRACT OF UNIT TEST CODE ###
```
import { describe, it, expect } from "vitest";
import { GameData } from "GameData.js";

describe("GameData class", () => {
  it("initGridArray() returns array of 6 x 6 blanks", () => {
    let gd = new GameData();
    gd.grid = gd.initGridArray(6,6);
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

```


```

PS C:\Users\ernes\Coding2\SEI\Projects\candycrush> npm run test

> test
> vitest --run --reporter verbose --globals


 RUN  v0.28.5 C:/Users/ernes/Coding2/SEI/Projects/candycrush

 ✓ utils.test.js (4)
   ✓ math functions (4)
     ✓ max() gives the maximum of 2 numbers
     ✓ min() gives the minimum of 2 numbers
     ✓ findLength(from,to) gives the length between 2 points
     ✓ findAngle(from,to) gives the angle with horizontal
 · GameData.test.js (23)
   · GameData class (23)
stdout | GameData.test.js > GameData class > initGridArray() returns array of 6 x 6 blanks
[
  [ ' ', ' ', ' ', ' ', ' ', ' ' ],
  [ ' ', ' ', ' ', ' ', ' ', ' ' ],
  [ ' ', ' ', ' ', ' ', ' ', ' ' ],
  [ ' ', ' ', ' ', ' ', ' ', ' ' ],
  [ ' ', ' ', ' ', ' ', ' ', ' ' ],
  [ ' ', ' ', ' ', ' ', ' ', ' ' ]
]
[
  [ ' ', ' ', ' ', ' ', ' ', ' ' ],
  [ ' ', ' ', ' ', ' ', ' ', ' ' ],
  [ ' ', ' ', ' ', ' ', ' ', ' ' ],
  [ ' ', ' ', ' ', ' ', ' ', ' ' ],
  [ ' ', ' ', ' ', ' ', ' ', ' ' ],
  [ ' ', ' ', ' ', ' ', ' ', ' ' ]
]

stdout | GameData.test.js > GameData class > fillGridArray() returns array of 6 x 6 letters from A to F
[
  [ 'B', 'F', 'C', 'B', 'F', 'F' ],
  [ 'C', 'D', 'E', 'E', 'E', 'E' ],
  [ 'E', 'C', 'A', 'C', 'E', 'D' ],
  [ 'D', 'A', 'A', 'B', 'E', 'B' ],
  [ 'B', 'E', 'C', 'A', 'E', 'C' ],
  [ 'E', 'F', 'C', 'F', 'D', 'C' ]
]

stdout | GameData.test.js > GameData class > getRow(id) gets row number from 'r1c1'
r10c10 getRow: 10
rc10 getRow: undefined
'' getRow: undefined

stdout | GameData.test.js > GameData class > getCol(id) gets column number from 'r1c1'
r10c10 getCol: 10
r10c getCol: undefined
'' getCol: undefined

stdout | GameData.test.js > GameData class > getRandomStripeCandy(color) should convert A to H or N, B to I or O, C t J or P, D to K or Q, E to L or R, F to M or S randomly
getRandomStripeCandy: error

stdout | GameData.test.js > GameData class > checkFiveInALine() finds 5 in a line and returns gridFive with 1 for each item
[
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'A', 'A', 'A', 'A', 'A', 'B' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ]
] [
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ '1', '1', '1', '1', '1', 'B' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ]
] []
[
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'D', 'E', 'F', 'E', 'B', 'C' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'E', 'A', 'B' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ]
] [
  [ 'B', 'C', 'D', '1', 'F', 'A' ],
  [ 'D', 'E', 'F', '1', 'B', 'C' ],
  [ 'B', 'C', 'D', '1', 'F', 'A' ],
  [ 'C', 'D', 'E', '1', 'A', 'B' ],
  [ 'B', 'C', 'D', '1', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ]
] [
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ '1', '1', '1', '1', '1', 'B' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ]
]
[
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'D', 'E', 'F', 'A', 'B', 'C' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ]
] [
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'D', 'E', 'F', 'A', 'B', 'C' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ]
] [
  [ 'B', 'C', 'D', '1', 'F', 'A' ],
  [ 'D', 'E', 'F', '1', 'B', 'C' ],
  [ 'B', 'C', 'D', '1', 'F', 'A' ],
  [ 'C', 'D', 'E', '1', 'A', 'B' ],
  [ 'B', 'C', 'D', '1', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ]
]

stdout | GameData.test.js > GameData class > checkFourInALine() finds 4 in a line and returns gridFour with a 1 for each item
[
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'A', 'A', 'A', 'A', 'B', 'B' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ]
] [
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ '1', '1', '1', '1', 'B', 'B' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ]
] []
[
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'A', 'A', 'A', 'E', 'B', 'B' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'E', 'A', 'B' ],
  [ 'B', 'C', 'D', 'F', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ]
] [
  [ 'B', 'C', 'D', '1', 'F', 'A' ],
  [ 'A', 'A', 'A', '1', 'B', 'B' ],
  [ 'B', 'C', 'D', '1', 'F', 'A' ],
  [ 'C', 'D', 'E', '1', 'A', 'B' ],
  [ 'B', 'C', 'D', 'F', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ]
] [
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ '1', '1', '1', '1', 'B', 'B' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ]
]
[
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'D', 'E', 'F', 'A', 'B', 'C' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ]
] [
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'D', 'E', 'F', 'A', 'B', 'C' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ]
] [
  [ 'B', 'C', 'D', '1', 'F', 'A' ],
  [ 'A', 'A', 'A', '1', 'B', 'B' ],
  [ 'B', 'C', 'D', '1', 'F', 'A' ],
  [ 'C', 'D', 'E', '1', 'A', 'B' ],
  [ 'B', 'C', 'D', 'F', 'F', 'A' ],
  [ 'C', 'D', 'E', 'F', 'A', 'B' ]
]

stdout | GameData.test.js > GameData class > fillGridArrayBlanks() fills in the spaces with random letters from A to F
[
  [ ' ', ' ', ' ', ' ', ' ', ' ' ],
  [ 'A', 'B', ' ', 'D', 'E', ' ' ],
  [ 'A', 'B', 'C', 'E', 'F', ' ' ],
  [ 'B', 'C', 'C', 'D', 'E', 'F' ],
  [ 'A', 'B', 'C', 'D', 'E', 'A' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ]
]
[
  [ 'E', 'D', 'B', 'A', 'E', 'A' ],
  [ 'A', 'B', 'F', 'D', 'E', 'D' ],
  [ 'A', 'B', 'C', 'E', 'F', 'B' ],
  [ 'B', 'C', 'C', 'D', 'E', 'F' ],
  [ 'A', 'B', 'C', 'D', 'E', 'A' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ]
]

stdout | GameData.test.js > GameData class > dropCandy() shifts all characters in the column towards the bottom
[
  [ 'A', 'B', 'C', 'D', 'E', 'F' ],
  [ ' ', ' ', ' ', 'E', 'F', 'A' ],
  [ 'A', 'B', 'C', 'D', 'E', ' ' ],
  [ 'B', 'C', ' ', ' ', ' ', ' ' ],
  [ 'A', 'B', 'C', 'D', 'E', ' ' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ]
]
[
  [ ' ', ' ', ' ', ' ', ' ', ' ' ],
  [ 'A', 'B', ' ', 'D', 'E', ' ' ],
  [ 'A', 'B', 'C', 'E', 'F', ' ' ],
  [ 'B', 'C', 'C', 'D', 'E', 'F' ],
  [ 'A', 'B', 'C', 'D', 'E', 'A' ],
  [ 'B', 'C', 'D', 'E', 'F', 'A' ]
]

stdout | GameData.test.js > GameData class > scanRows(list) returns list of {start(line),end(line),color,gdStart(user move), gdEnd(user move)}
{
  start: { row: 1, col: 0 },
  end: { row: 1, col: 3 },
  color: 'C',
  gdStart: { row: 1, col: 4, color: 'F' },
  gdEnd: { row: 1, col: 3, color: 'C' }
} {
  start: { row: 1, col: 0 },
  end: { row: 1, col: 3 },
  color: 'C',
  gdStart: { row: 1, col: 4, color: 'F' },
  gdEnd: { row: 1, col: 3, color: 'C' }
}

stdout | GameData.test.js > GameData class > scanColumns(list) returns list of {start(line),end(line),color,gdStart(user move), gdEnd(user move)}
{
  start: { row: 1, col: 3 },
  end: { row: 4, col: 3 },
  color: 'B',
  gdStart: { row: 1, col: 4, color: 'F' },
  gdEnd: { row: 1, col: 3, color: 'B' }
} {
  start: { row: 1, col: 3 },
  end: { row: 4, col: 3 },
  color: 'B',
  gdStart: { row: 1, col: 4, color: 'F' },
  gdEnd: { row: 1, col: 3, color: 'B' }
}

 ✓ utils.test.js (4)
   ✓ math functions (4)
     ✓ max() gives the maximum of 2 numbers
     ✓ min() gives the minimum of 2 numbers
     ✓ findLength(from,to) gives the length between 2 points
     ✓ findAngle(from,to) gives the angle with horizontal
 ✓ GameData.test.js (23)
   ✓ GameData class (23)
     ✓ initGridArray() returns array of 6 x 6 blanks
     ✓ fillGridArray() returns array of 6 x 6 letters from A to F
     ✓ setStartId returns {id, row, col, color}
     ✓ setEndId returns {id, row, col, color}
     ✓ getRow(id) gets row number from 'r1c1'
     ✓ getCol(id) gets column number from 'r1c1'
     ✓ getRandomCandy(): returns a letter from 'A' to'F'
     ✓ getDistance(start,end): returns distance between 2 points by Pythagoras Theorem
     ✓ checkValidMoveAdjacent(): return true if distance is 1, return false otherwise
     ✓ stripedToNormal(str) should convert H and N to A, I and O to B, J and P to C, K and Q to D, L and R to E, M and S to F
     ✓ getRandomStripeCandy(color) should convert A to H or N, B to I or O, C t J or P, D to K or Q, E to L or R, F to M or S randomly      
     ✓ isPointOnLine(point,start,end) returns true if the point is on the line, otherwise returns false
     ✓ markLineFive(str) replace a string, all letters between A and F with a 1
     ✓ checkFiveInALine() finds 5 in a line and returns gridFive with 1 for each item
     ✓ markLineFour(str) replaces a string, all letters between A and F with a 1
     ✓ checkFourInALine() finds 4 in a line and returns gridFour with a 1 for each item
     ✓ fillGridArrayBlanks() fills in the spaces with random letters from A to F
     ✓ dropCandy() shifts all characters in the column towards the bottom
     ✓ scanRows(list) returns list of {start(line),end(line),color,gdStart(user move), gdEnd(user move)}
     ✓ scanColumns(list) returns list of {start(line),end(line),color,gdStart(user move), gdEnd(user move)}
     ✓ assignCandy({list, gridFour, start, end}) returns gridFour with 'H to M'(horizontal) or 'N to S'(vertical)
     ✓ giveStripedCandy() scans gridFour for 1 and assigns striped candy returns gridFour with 'H to M'(horizontal) or 'N to S'(vertical)   
     ✓ checkNormalWithStripedMove(start,end) returns true if start.color === end.color

 Test Files  2 passed (2)
      Tests  27 passed (27)
   Start at  09:37:20
   Duration  1.24s (transform 223ms, setup 0ms, collect 251ms, tests 71ms)

```

