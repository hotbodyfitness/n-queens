/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {

  var board = new Board({n: n});

  // board.togglePiece(0, 0);
  for (var row = 0; row < n; row++) {
    for (var col = 0; col < n; col++) {
      board.togglePiece(row, col);
      if (board.hasAnyRooksConflicts()) {
        board.togglePiece(row, col);
      }
    }
  }
  // var recursive = function (row, col) {};
  // pass row and col index into recursive
  // for each passed in value

  // recursive(0, 0);
  var solution = board.rows();
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
// pass in every combo of row, col
// make coordinate array from solution boards
  var solutionCount = 1;
  if (n > 1) {
    for (var i = 2; i <= n; i++) {
      solutionCount *= i;
    }
  }
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var board = new Board({n: n});
  var numQueens, rowArr, colArr, majArr, minArr;
  var addPiece = function (x, y, ma, mi) {
    board.togglePiece(x, y);
    numQueens++;
    rowArr.push(x);
    colArr.push(y);
    majArr.push(ma);
    minArr.push(mi);
  };
  var removePiece = function(x, y) {
    board.togglePiece(x, y);
    numQueens--;
    rowArr.pop();
    colArr.pop();
    majArr.pop();
    minArr.pop();
  };

  // recursive function passing in starting location
    // if there is a piece at row col M&M that is passed in then skip
    // dead space will be starting location row col major and minor diagonals
      //each time we toggle a new piece it add new row col major and minor diagonals

  var findSolution = function(row, col) {
    var maj = board._getFirstRowColumnIndexForMajorDiagonalOn(row, col);
    var min = board._getFirstRowColumnIndexForMinorDiagonalOn(row, col);
    if (!rowArr.includes(row) && !colArr.includes(col) && !majArr.includes(maj) && !minArr.includes(min)) {
      if (n === 6 && board.rows()[0][3] === 1) {debugger;}
      addPiece(row, col, maj, min);
      findSolution(row + 1, 0);
    }
    for (col; col < n; col++) {
      maj = board._getFirstRowColumnIndexForMajorDiagonalOn(row, col);
      min = board._getFirstRowColumnIndexForMinorDiagonalOn(row, col);
      if (!rowArr.includes(row) && !colArr.includes(col) && !majArr.includes(maj) && !minArr.includes(min)) {
        findSolution(row, col);
      }
    }
  };

  //when we call recursive function using a for loop within a for loop to pass in different locations
    //break out of for loop if we find a board where there are n queens

  for (let col = 0; col < n; col++) {
    if (numQueens === n) {
      break;
    }
    board = new Board({n: n});
    numQueens = 0;
    rowArr = [];
    colArr = [];
    majArr = [];
    minArr = [];
    findSolution(0, col);
    if (numQueens !== n) {
      var zeros = n - 1;
      for (var z = 0; z < n; z++) {
        if (!board.rows()[z].includes(1)) {
          zeros = z;
          break;
        }
      }
      for (var num = zeros; num >= 0; num--) {
        if(!board.rows()[num].includes(1)) {
          var prevPiece = board.rows()[num - 1].indexOf(1);
          removePiece(num - 1, prevPiece);
          findSolution(num - 1, prevPiece + 1);
          if (numQueens === n) {
            break;
          }
        }
      }
    }
  }


  var solution = board.rows();

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
