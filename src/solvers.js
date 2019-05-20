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

  for (var row = 0; row < n; row++) {
    for (var col = 0; col < n; col++) {
      board.togglePiece(row, col);
      if (board.hasAnyRooksConflicts()) {
        board.togglePiece(row, col);
      }
    }
  }

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
      if (!board._isInBounds(row, col)) {
        return;
      }
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
      var firstRowWithoutPiece = n - 1;
      for (var z = 0; z < n; z++) {
        if (!board.rows()[z].includes(1)) {
          firstRowWithoutPiece = z;
          break;
        }
      }
      for (var num = firstRowWithoutPiece; num >= 0; num--) {
        if (!board.rows()[num].includes(1)) {
          if (num === 0) {
            break;
          }
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
  var solutionCount = 0;
  var board = new Board({n: n});
  var numQueens, rowArr, colArr, majArr, minArr;
  var majCalc = board._getFirstRowColumnIndexForMajorDiagonalOn
  var minCalc = board._getFirstRowColumnIndexForMinorDiagonalOn
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

  var findSolutions = function(row, col) {
    var maj = majCalc(row, col);
    var min = minCalc(row, col);
    if (!rowArr.includes(row) && !colArr.includes(col) && !majArr.includes(maj) && !minArr.includes(min)) {
      if (!board._isInBounds(row, col)) {
        return;
      }
      addPiece(row, col, maj, min);
      findSolutions(row + 1, 0);
    }
    for (col; col < n; col++) {
      maj = majCalc(row, col);
      min = minCalc(row, col);
      if (!rowArr.includes(row) && !colArr.includes(col) && !majArr.includes(maj) && !minArr.includes(min)) {
        findSolutions(row, col);
      }
    }
  };

  var checkOtherCombinations = function () {
    var firstRowWithoutPiece = n - 1;
      for (var z = 0; z < n; z++) {
        if (!board.rows()[z].includes(1)) {
          firstRowWithoutPiece = z;
          break;
        }
      }
      for (var num = firstRowWithoutPiece; num >= 0; num--) {
        if (!board.rows()[num].includes(1)) {
          if (num === 0) {
            break;
          }
          var prevPiece = board.rows()[num - 1].indexOf(1);
          removePiece(num - 1, prevPiece);
          findSolutions(num - 1, prevPiece + 1);
<<<<<<< HEAD
          if (numQueens === n) {
            solutionCount++;
            console.log(board.rows())
          }
=======
>>>>>>> ac0e6051fbddb8b105b29b5281658a80a8812838
        }
      }
  }

  //recurive call to go back up the rows in the chess board to find if there were other possible solutions
    //pass in location of the last piece in the current board with n queens
      //remove piece from board
      //check the rest of the row to see if there are other possible pieces on row (main way to start recursing)
        //if there are other possible pieces add piece and try to build a new solution from there
          //after new board is built, if there are no more solutions recurse with location of piece that was initially set
        //else recurse using the location of the piece above
  var findOtherSolutions = function (row, col) {
    if (!board._isInBounds(row, col)) {
      return;
    }
    removePiece(row, col);
    for (var restOfRow = col + 1; restOfRow < n; restOfRow++) {
      findSolutions(row, restOfRow);
      if (numQueens === n) {
        solutionCount++;
        console.log(board.rows())
        findOtherSolutions(row - 1, board.rows()[row - 1].indexOf(1))
      } else {
        // checkOtherCombinations()
        // if (numQueens === n) {
        //   solutionCount++;
        //   console.log(board.rows());
        // }
        findOtherSolutions(row - 1, board.rows()[row - 1].indexOf(1))
      }
    }
  }

  //when we call recursive function using a for loop within a for loop to pass in different locations
  //break out of for loop if we find a board where there are n queens

  for (let col = 0; col < n; col++) {
    // if (numQueens === n) {
    //   solutionCount++;
    // }
    board = new Board({n: n});
    numQueens = 0;
    rowArr = [];
    colArr = [];
    majArr = [];
    minArr = [];
    findSolutions(0, col);
    if (numQueens !== n) {
      checkOtherCombinations()
    }
    if (numQueens === n) {
      solutionCount++;
      console.log(board.rows())
<<<<<<< HEAD
=======
      findOtherSolutions(n - 1, colArr[n - 1])
>>>>>>> ac0e6051fbddb8b105b29b5281658a80a8812838
    }
  }

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
