import { component$, useSignal, $ } from "@builder.io/qwik";
import styles from "./main-container.module.css";

// PUBLIC_INTERFACE
/**
 * MainContainer - The primary UI container for the TicTacToe Duo game.
 * Features:
 *   - 3x3 grid game board
 *   - Turn indicator (Player X / O)
 *   - Win/draw detection and display
 *   - Restart button
 *   - Clean, minimal light-themed layout (primary: #fff, secondary: #00147a, accent: #4caf50)
 */
export const MainContainer = component$(() => {
  // Board state: array of 9 strings: '', 'X', or 'O'
  const board = useSignal(Array(9).fill(""));
  // Current turn: 'X' or 'O'
  const xIsNext = useSignal(true);
  // Winner: 'X', 'O', or null
  const winner = useSignal<string | null>(null);
  // Draw flag
  const draw = useSignal(false);

  // Handle square click
  const handleClick = $((idx: number) => {
    if (board.value[idx] || winner.value || draw.value) return;
    const squares = [...board.value];
    squares[idx] = xIsNext.value ? "X" : "O";
    board.value = squares;

    // Inline winner calculation logic
    const lines = [
      [0,1,2],[3,4,5],[6,7,8], // Rows
      [0,3,6],[1,4,7],[2,5,8], // Cols
      [0,4,8],[2,4,6] // Diagonals
    ];
    let win: string | null = null;
    for (const [a,b,c] of lines) {
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        win = squares[a];
        break;
      }
    }

    if (win) {
      winner.value = win;
    } else if (!squares.includes("")) {
      draw.value = true;
    } else {
      xIsNext.value = !xIsNext.value;
    }
  });

  // Restart game
  const handleRestart = $(() => {
    board.value = Array(9).fill("");
    xIsNext.value = true;
    winner.value = null;
    draw.value = false;
  });

  // Render status
  let status = "";
  if (winner.value) {
    status = `Winner: ${winner.value}`;
  } else if (draw.value) {
    status = "It's a draw!";
  } else {
    status = `Turn: ${xIsNext.value ? "X" : "O"}`;
  }

  // Cell rendering utility
  const renderCell = (idx: number) => (
    <button
      class={[
        styles.cell,
        board.value[idx] === "X" && styles.x,
        board.value[idx] === "O" && styles.o,
      ]}
      type="button"
      onClick$={() => handleClick(idx)}
      disabled={!!board.value[idx] || !!winner.value || draw.value}
      aria-label={`cell ${idx + 1} ${board.value[idx] ? board.value[idx] : ""}`}
    >
      {board.value[idx]}
    </button>
  );

  return (
    <div class={styles.container}>
      <h2 class={styles.heading}>TicTacToe Duo</h2>
      <div class={styles.status} tabIndex={0}>{status}</div>
      <div class={styles.board} role="grid" aria-label="Tic Tac Toe Board">
        {Array.from({length: 9}, (_, idx) => (
          <div key={idx} class={styles.cellWrapper} role="gridcell">
            {renderCell(idx)}
          </div>
        ))}
      </div>
      <button
        type="button"
        class={styles.restartBtn}
        onClick$={handleRestart}
        aria-label="Restart Game"
      >
        Restart
      </button>
    </div>
  );
});

export default MainContainer;
