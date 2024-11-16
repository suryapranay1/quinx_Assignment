import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";

const SudokuSolver = () => {
  const [grid, setGrid] = useState(Array(9).fill().map(() => Array(9).fill('')));
  const [error, setError] = useState('');
  const [solved, setSolved] = useState(false);

  // Validate if number is valid in current position
  const isValid = (board, row, col, num) => {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num) return false;
    }

    // Check 3x3 box
    let startRow = row - (row % 3);
    let startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i + startRow][j + startCol] === num) return false;
      }
    }

    return true;
  };

  // Validate current board state
  const validateBoard = () => {
    const board = grid.map(row => row.map(cell => cell === '' ? 0 : parseInt(cell)));
    
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] !== 0) {
          const temp = board[i][j];
          board[i][j] = 0;
          if (!isValid(board, i, j, temp)) {
            setError('Invalid board configuration');
            return false;
          }
          board[i][j] = temp;
        }
      }
    }
    setError('');
    return true;
  };

  // Find empty cell
  const findEmpty = (board) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === 0) return [i, j];
      }
    }
    return null;
  };

  // Solve using backtracking
  const solve = (board) => {
    const empty = findEmpty(board);
    if (!empty) return true;

    const [row, col] = empty;

    for (let num = 1; num <= 9; num++) {
      if (isValid(board, row, col, num)) {
        board[row][col] = num;
        if (solve(board)) return true;
        board[row][col] = 0;
      }
    }

    return false;
  };

  // Handle solve button click
  const handleSolve = () => {
    if (!validateBoard()) return;

    const board = grid.map(row => row.map(cell => cell === '' ? 0 : parseInt(cell)));
    if (solve(board)) {
      setGrid(board);
      setSolved(true);
      setError('');
    } else {
      setError('No solution exists');
    }
  };

  // Handle cell input
  const handleCellChange = (row, col, value) => {
    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 9)) {
      const newGrid = [...grid];
      newGrid[row][col] = value;
      setGrid(newGrid);
      setSolved(false);
      setError('');
    }
  };

  // Get hint
  const getHint = () => {
    if (!validateBoard()) return;
    
    const board = grid.map(row => row.map(cell => cell === '' ? 0 : parseInt(cell)));
    const empty = findEmpty(board);
    
    if (empty) {
      const [row, col] = empty;
      for (let num = 1; num <= 9; num++) {
        if (isValid(board, row, col, num)) {
          const tempBoard = JSON.parse(JSON.stringify(board));
          tempBoard[row][col] = num;
          if (solve(tempBoard)) {
            const newGrid = [...grid];
            newGrid[row][col] = num;
            setGrid(newGrid);
            return;
          }
        }
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Sudoku Solver</h1>
        
        <div className="grid grid-cols-9 gap-0.5 bg-gray-200 p-0.5">
          {grid.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                value={cell}
                onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                className={`w-10 h-10 text-center border ${
                  solved ? 'bg-green-50' : 'bg-white'
                } ${
                  (rowIndex + 1) % 3 === 0 && rowIndex < 8 ? 'border-b-2' : ''
                } ${
                  (colIndex + 1) % 3 === 0 && colIndex < 8 ? 'border-r-2' : ''
                }`}
                maxLength={1}
              />
            ))
          ))}
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4 mt-4">
          <Button onClick={() => validateBoard()}>
            Validate
          </Button>
          <Button onClick={handleSolve}>
            Solve
          </Button>
          <Button onClick={getHint} variant="outline">
            <Lightbulb className="mr-2 h-4 w-4" />
            Hint
          </Button>
          <Button 
            onClick={() => {
              setGrid(Array(9).fill().map(() => Array(9).fill('')));
              setError('');
              setSolved(false);
            }}
            variant="outline"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SudokuSolver;
