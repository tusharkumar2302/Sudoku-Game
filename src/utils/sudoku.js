// utils/sudoku.js
export const generateSudoku = (difficulty = 'Medium') => {
  // Create an empty board
  const emptyBoard = Array(9)
    .fill()
    .map(() =>
      Array(9)
        .fill()
        .map(() => ({value: 0, fixed: false, isCorrect: true})),
    );

  // Generate a solved board
  const solvedBoard = solveSudoku(emptyBoard);

  // Create a puzzle by removing numbers based on difficulty
  let cellsToRemove;
  switch (difficulty) {
    case 'Easy':
      cellsToRemove = 40;
      break;
    case 'Medium':
      cellsToRemove = 50;
      break;
    case 'Hard':
      cellsToRemove = 55;
      break;
    case 'Expert':
      cellsToRemove = 60;
      break;
    default:
      cellsToRemove = 50;
  }

  const puzzle = JSON.parse(JSON.stringify(solvedBoard));
  let removedCells = 0;

  while (removedCells < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzle[row][col].value !== 0) {
      puzzle[row][col].value = 0;
      puzzle[row][col].fixed = false;
      removedCells++;
    }
  }

  // Mark the remaining cells as fixed
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (puzzle[row][col].value !== 0) {
        puzzle[row][col].fixed = true;
      }
    }
  }

  return {puzzle, solution: solvedBoard};
};

export const solveSudoku = board => {
  const newBoard = JSON.parse(JSON.stringify(board));

  const solve = () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (newBoard[row][col].value === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isSafe(newBoard, row, col, num)) {
              newBoard[row][col].value = num;
              if (solve()) {
                return true;
              }
              newBoard[row][col].value = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  solve();
  return newBoard;
};

export const isSafe = (board, row, col, num) => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x].value === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col].value === num) return false;
  }

  // Check 3x3 box
  const boxRowStart = row - (row % 3);
  const boxColStart = col - (col % 3);
  for (let r = boxRowStart; r < boxRowStart + 3; r++) {
    for (let c = boxColStart; c < boxColStart + 3; c++) {
      if (board[r][c].value === num) return false;
    }
  }

  return true;
};
