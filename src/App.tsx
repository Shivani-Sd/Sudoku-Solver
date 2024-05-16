/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState } from "react";

import SideBar from "./components/actionBar";
import "./App.css";

function App() {
  let initialBoard = [
    [0, 0, 9, 0, 4, 0, 0, 0, 6],
    [6, 3, 0, 0, 2, 0, 7, 0, 0],
    [0, 0, 8, 0, 0, 3, 0, 0, 0],
    [0, 0, 3, 0, 0, 0, 0, 0, 0],
    [4, 1, 0, 0, 0, 2, 0, 0, 8],
    [0, 0, 0, 0, 7, 0, 0, 5, 0],
    [0, 0, 0, 4, 0, 0, 8, 0, 0],
    [2, 6, 0, 0, 0, 1, 0, 0, 4],
    [9, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const [userBoard, setUserBoard] = useState<number[][]>(initialBoard);
  const [userInputError, setUserInputError] = useState<string>("");
  const [livesLeft, setLivesLeft] = useState<number>(5);
  const [gameWon, setGameWon] = useState<boolean>(false);

  const checkIfValid = (
    board: number[][],
    value: number,
    row: number,
    column: number
  ) => {
    if (board[row].some((item) => item === value)) return false;

    for (let i = 0; i < 9; i++) {
      if (board[i][column] === value) return false;
    }

    const innerMatrixRowStart = row - (row % 3);
    const innerMatrixColumnStart = column - (column % 3);
    const innerMatrixRowEnd = row + (3 - (row % 3)) - 1;
    const innerMatrixColumnEnd = column + (3 - (column % 3)) - 1;

    for (let i = innerMatrixRowStart; i <= innerMatrixRowEnd; i++) {
      for (let j = innerMatrixColumnStart; j <= innerMatrixColumnEnd; j++) {
        if (board[i][j] === value) return false;
      }
    }

    return true;
  };

  const backtrack: any = (
    board: number[][],
    { newRow, newColumn }: { newRow: number; newColumn: number }
  ) => {
    let row = newColumn ? newRow : newRow - 1;
    let column = newColumn ? newColumn - 1 : 8;

    while (initialBoard[row][column]) {
      if (column > 0) column--;
      else {
        column = 8;
        row--;
      }
    }

    for (let value = board[row][column] + 1; value <= 9; value++) {
      if (checkIfValid(board, value, row, column)) {
        board[row][column] = value;

        return { newRow: row, newColumn: column };
      }
    }

    board[row][column] = 0;

    return backtrack(board, { newRow: row, newColumn: column });
  };

  const checkGameBoardFull = () =>
    !userBoard.some((row) => row.some((input) => !input));

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: number,
    column: number
  ) => {
    setUserInputError("");
    if (e.target.value) {
      if (Number(e.target.value) === solvedBoard.current[row][column]) {
        let tempBoard = userBoard;

        tempBoard[row][column] = Number(e.target.value);
        setUserBoard(tempBoard);
        if (checkGameBoardFull() && livesLeft > 0) setGameWon(true);

        return;
      }
      setUserInputError(e.target.id);
      setLivesLeft((prev) => prev - 1);
    }
  };

  const solvedBoard = useRef(
    (() => {
      let board = [
        [0, 0, 9, 0, 4, 0, 0, 0, 6],
        [6, 3, 0, 0, 2, 0, 7, 0, 0],
        [0, 0, 8, 0, 0, 3, 0, 0, 0],
        [0, 0, 3, 0, 0, 0, 0, 0, 0],
        [4, 1, 0, 0, 0, 2, 0, 0, 8],
        [0, 0, 0, 0, 7, 0, 0, 5, 0],
        [0, 0, 0, 4, 0, 0, 8, 0, 0],
        [2, 6, 0, 0, 0, 1, 0, 0, 4],
        [9, 0, 0, 0, 0, 0, 0, 0, 0],
      ];

      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (!board[i][j]) {
            for (let value = 1; value <= 9; value++) {
              if (checkIfValid(board, value, i, j)) {
                board[i][j] = value;
                break;
              }
            }
            if (!board[i][j]) {
              let { newRow, newColumn } = backtrack(board, {
                newRow: i,
                newColumn: j,
              });
              i = newRow;
              j = newColumn;
            }
          }
        }
      }

      return board;
    })()
  );

  const backgroundColors = useRef(
    (() => {
      const rows = [0, 1, 2, 6, 7, 8];
      const columns = [3, 4, 5];

      let list = [];

      for (let i = 0; i < 9; i++) {
        list.push(Array(9).fill("#ffffff"));
      }

      for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
          if (
            (rows.includes(row) && columns.includes(column)) ||
            (!rows.includes(row) && !columns.includes(column))
          ) {
            list[row][column] = "#0000ff4a";
          }
        }
      }

      return list;
    })()
  );

  return (
    <div className="App">
      <div id="container">
        {Array(9)
          .fill(0)
          .map((_, rowIndex) => (
            <div>
              {Array(9)
                .fill(0)
                .map((_, columnIndex) =>
                  !initialBoard[rowIndex][columnIndex] ? (
                    <div
                      key={`[${rowIndex}][${columnIndex}]`}
                      className={`input-cell${
                        `[${rowIndex}][${columnIndex}]` === userInputError
                          ? " error"
                          : ""
                      }`}
                      style={{
                        backgroundColor:
                          backgroundColors.current[rowIndex][columnIndex],
                      }}
                    >
                      <input
                        id={`[${rowIndex}][${columnIndex}]`}
                        onChange={(e) => handleInput(e, rowIndex, columnIndex)}
                        disabled={!livesLeft || gameWon}
                      />
                    </div>
                  ) : (
                    <div
                      key={`[${rowIndex}][${columnIndex}]`}
                      id={`[${rowIndex}][${columnIndex}]`}
                      className="input-cell"
                      style={{
                        backgroundColor:
                          backgroundColors.current[rowIndex][columnIndex],
                      }}
                    >
                      {initialBoard[rowIndex][columnIndex]}
                    </div>
                  )
                )}
            </div>
          ))}
      </div>
      <SideBar livesLeft={livesLeft} gameWon={gameWon} />
    </div>
  );
}

export default App;
