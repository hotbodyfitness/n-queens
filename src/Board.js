// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      // rowIndex = row, check if it has two 1's
      // return true if more than one "1"
      var ones = 0;
      this.rows()[rowIndex].forEach(function(element) {
        if (element) {
          ones++;
        }
      });
      if (ones > 1) {
        return true;
      }
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      // get row index
      // pass row index into above function
      var numRows = this.get('n');
      for (var i = 0; i < numRows; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var ones = 0;
      this.rows().forEach(function(arr) {
        if (arr[colIndex] === 1) {
          ones++;
        }
      });
      if (ones > 1) {
        return true;
      }
      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var numCol = this.get('n');
      for (var i = 0; i < numCol; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(diagonalIndex) {
      var ones = 0;
      var num = this.get('n');
      var rowIndex = 0;
      var colIndex = 0;

      if (diagonalIndex < 0) {
        rowIndex = (-1) * diagonalIndex;
        for (var i = rowIndex; i < num; i++) {

          if (this.rows()[i][colIndex]) {
            ones++;
          }
          colIndex++;
        }
      } else if (diagonalIndex > 0) {
        colIndex = diagonalIndex;
        for (var i = colIndex; i < num; i++) {

          if (this.rows()[rowIndex][i]) {
            ones++;
          }
          rowIndex++;
        }
      } else {
        for (var i = colIndex; i < num; i++) {

          if (this.rows()[rowIndex][i]) {
            ones++;
          }
          rowIndex++;
        }
      }

      if (ones > 1) {
        return true;
      }
      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var num = this.get('n') - 2;

      for (let i = (-1) * num; i < num + 1; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(diagonalIndex) {
      var ones = 0;
      var num = this.get('n') - 1;
      // var rows = this.rows();
      // var rowStart = 0;
      // var colStart = 0;

      var rowIndex = 0;
      var colIndex = 0;

      if (diagonalIndex <= num) {
        colIndex = diagonalIndex;
        for (var i = rowIndex; i < num; i++) {
          if (this.rows()[i][colIndex]) {
            ones++;
          }
          colIndex--;
        }
      } else if (diagonalIndex > num) {
        rowIndex = diagonalIndex - num;
        colIndex = num;
        for (var i = rowIndex; i <= num; i++) {
          // console.log(i + ' ' + colIndex);
          if (this.rows()[i][colIndex]) {
            ones++;
          }
          colIndex--;
        }
      }

      // var testMinorDiagonal = function(rowIndex, colIndex) {

      //   // console.log(rowStart + ' ' + colStart);
      //   if (rows[rowIndex][colIndex]) {
      //     ones++;
      //   }
      //   rowIndex++;
      //   colIndex--;
      //   // console.log(rowIndex + ' ' + colIndex);
      //   if (rowIndex === colStart && colIndex === rowStart) {
      //     return;
      //   }
      //   testMinorDiagonal(rowIndex, colIndex);

      // };
      // if (diagonalIndex <= num) {
      //   rowStart = 0;
      //   colStart = diagonalIndex;
      //   testMinorDiagonal(rowStart, colStart);
      // } else if (diagonalIndex > num) {
      //   rowStart = diagonalIndex - num;
      //   colStart = num;
      //   testMinorDiagonal(rowStart, colStart);
      // }
      if (ones > 1) {
        return true;
      }
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var num = this.get('n');
      for (let i = 1; i <= (2 * num) - 3; i++) { // 2n * 3 = total number of cases to check
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
