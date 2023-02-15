<!DOCTYPE HTML>
<html>
<head>
<style>

</style>
<script>

</script>
</head>
<body>


    <p>
    CANDY CRUSH PLAN
    GAME UI
    1. Implement 8 x 8 grid with cells
    2. Study and implement drag and drop listeners

    Game Logic for Simplest 1 Move
    LOGIC
    3. Candy can only move to up, down, left, right
    4. Candy can only move if there is at least 3 candy matches after moving. Save a copy of the grid, revert to previous grid if invalid
    5. Check all rows and columns for 3 or more in a line.
    RENDER
    6. Remove the marked candy and render the grid.
    7. Drop the candy vertically. And fill in random candy from the top.
    RECURSIVE
    8. Repeat steps 5 to 7 recursively. (this may be challenging)

    Game Logic for Multiple Moves 
    9. Countdown the Number of Moves from 20;
    10. Countdown the number of blue candy removed from 10.
    11. Game win if blue candy = 0;
    12. Game over if number of rounds = 0;
    13. Count points per item removed. 
    14. Award 1 star for >18 moves, 2 star for >14 moves, 3 star for 10 moves

    Future Game Expansion
    1. End of game gives multiple crushes for the remaining moves.
    2. 4 in a row gives a striped candy.
    3. 5 in a row gives a coloured ball.
    4. New game board size.
    5. Proper animations

 </p> 
</body>
</html>

