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
Javascript - event handlers, regex
HTML - Audio element
CSS - shake animation, background gradient animation

### USER STORIES / FEATURES ###
#### Main ###
- [x] 1.Player swipes candy to match 3 tiles. resulting in candy being removed, and refilled from the top.
- [x] 2.Game to have sound effects and background music. This will give a great experience.
- [ ] 3.Player wins the round when Player matches "X" number of "Y" colour candy in "Z" number of moves. Player loses the round when "Z" number of moves is zero.
- [ ] 4.Score is calculated based on 3's, 4's and 5's, number of cascades. Resulting in grading of 1 star, 2 star, 3 star.
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
- [ ] 9. Countdown the Number of Moves;
- [ ] 10. Countdown the number of blue candy removed from 10.
- [ ] 11. Game win if blue candy = 0;
- [ ] 12. Game over if number of rounds = 0;
- [ ] 13. Count points per item removed. 
- [ ] 14. Award 1 star for >18 moves, 2 star for >14 moves, 3 star for 10 moves

### Future Game Expansion ###
- [ ] 1. End of game gives multiple crushes for the remaining moves.
- [ ] 2. 4 in a row gives a striped candy.
- [ ] 3. 5 in a row gives a coloured ball.
- [ ] 4. New game board size.
- [ ] 5. Proper animations

### Code Refactoring ###
The below code is easily understood.
However it is tedious to type 2 for loops.
```
//original function
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

