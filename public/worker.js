const ret = [];
let layout, layoutMap;
onmessage = function (event) {
  const {data, layout} = event.data;
  sudoku(data, layout);
  this.postMessage(-1);
};

function isValid(row, col, val, board) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === val || board[i][col] === val) {
      return false;
    }
  }

  const k = layout[row][col]
  const points = layoutMap[k]
  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i]
    if (board[x][y] === val) return false;
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
  const _d = JSON.parse(JSON.stringify(board));
  ret.push(_d);
  postMessage(_d);
  return true;
}

function sudoku(board, _layout) {
  ret.length = 0;
  layoutMap = {}
  layout = _layout

  for(let i=0;i<_layout.length;i++){
    for(let j=0;j<_layout.length;j++){
      const k = _layout[i][j]
      if (!layoutMap[k]) layoutMap[k] = []
      layoutMap[k].push([i, j])
    }
  }

  backtracking(board);
  return ret;
}
