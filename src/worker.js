const ret = [];
onmessage = function (event) {
  const data = event.data;
  console.log(data, "start");
  postMessage(sudoku(data));
  console.log("end");
};

function isValid(row, col, val, board) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === val || board[i][col] === val) {
      return false;
    }
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === val) return false;
    }
  }
  return true;
}

function backtracking(board) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] !== ".") continue;

      for (let k = 1; k <= 9; k++) {
        k = k.toString();
        if (isValid(i, j, k, board)) {
          board[i][j] = k;
          // if(backtracking(board)) return true;
          backtracking(board);
          board[i][j] = ".";
        }
      }
      return false;
    }
  }
  ret.push(JSON.parse(JSON.stringify(board)));
  if (ret.length > 10) self.close();
  return true;
}

function sudoku(board) {
  ret.length = 0;
  backtracking(board);
  return ret;
}
