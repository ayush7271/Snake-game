import React, { useState, useEffect, useRef } from "react";

const ROWS = 20;
const COLS = 70;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 9 },
  { x: 10, y: 8 },
];
const INITIAL_DIRECTION = "RIGHT";
const INITIAL_APPLE = { x: 5, y: 5 };
const CELL_SIZE = 20;
const MOVE_INTERVAL = 200;

const App = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [apple, setApple] = useState(INITIAL_APPLE);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameRef = useRef();

  useEffect(() => {
    gameRef.current.focus();
  }, []);

  useEffect(() => {
    const interval = setInterval(moveSnake, MOVE_INTERVAL);
    return () => clearInterval(interval);
  }, [snake, gameOver]);

  const handleKeyDown = (event) => {
    const { key } = event;
    if (key === "ArrowUp" && direction !== "DOWN") {
      setDirection("UP");
    } else if (key === "ArrowDown" && direction !== "UP") {
      setDirection("DOWN");
    } else if (key === "ArrowLeft" && direction !== "RIGHT") {
      setDirection("LEFT");
    } else if (key === "ArrowRight" && direction !== "LEFT") {
      setDirection("RIGHT");
    }
  };

  const moveSnake = () => {
    if (gameOver) return;

    const head = { ...snake[0] };
    switch (direction) {
      case "UP":
        head.y = (head.y - 1 + ROWS) % ROWS;
        break;
      case "DOWN":
        head.y = (head.y + 1) % ROWS;
        break;
      case "LEFT":
        head.x = (head.x - 1 + COLS) % COLS;
        break;
      case "RIGHT":
        head.x = (head.x + 1) % COLS;
        break;
      default:
        break;
    }

    const newSnake = [head, ...snake];
    if (head.x === apple.x && head.y === apple.y) {
      setScore((prevScore) => prevScore + 1);
      setApple(getRandomApplePosition());
    } else {
      newSnake.pop();
    }

    if (isCollision(head) || isSnakeOverlap(newSnake)) {
      setGameOver(true);
    }

    setSnake(newSnake);
  };

  const isCollision = (head) => {
    return snake.some((segment, index) => {
      if (index === 0) return false;
      return segment.x === head.x && segment.y === head.y;
    });
  };

  const isSnakeOverlap = (newSnake) => {
    return (
      newSnake.length !==
      new Set(newSnake.map((segment) => `${segment.x}-${segment.y}`)).size
    );
  };

  const getRandomApplePosition = () => {
    const x = Math.floor(Math.random() * COLS);
    const y = Math.floor(Math.random() * ROWS);
    return { x, y };
  };

  // const renderCell = (row, col) => {
  //   const isSnake = snake.some(
  //     (segment) => segment.x === col && segment.y === row
  //   );
  //   const isApple = apple.x === col && apple.y === row;
  //   let cellClass = "cell";
  //   if (isSnake) {
  //     cellClass += " snake";
  //     if (isSnake && snake[0].x === col && snake[0].y === row) {
  //       cellClass += " head";
  //     }
  //   }
  //   if (isApple) cellClass += " apple";

  //   if (isSnake && snake[0].x === col && snake[0].y === row) {
  //     return (
  //       <div key={`${row}-${col}`} className={cellClass}>
  //         <div className="eye"></div>
  //         <div className="eye"></div>
  //       </div>
  //     );
  //   }

  //   return <div key={`${row}-${col}`} className={cellClass}></div>;
  // };
  const renderCell = (row, col) => {
    const isSnake = snake.some((segment) => segment.x === col && segment.y === row);
    const isApple = apple.x === col && apple.y === row;
    let cellClass = "cell";
  
    if (isSnake) {
      cellClass += " snake";
      if (isSnake && snake[0].x === col && snake[0].y === row) {
        cellClass += " head";
      }
    }
  
    if (isApple) cellClass += " apple";
  
    if (isSnake && snake[0].x === col && snake[0].y === row) {
      return (
        <div key={`${row}-${col}`} className={cellClass}>
          <div className="eye left-eye"></div>
          <div className="eye1 right-eye"></div>
        </div>
      );
    }
  
    return <div key={`${row}-${col}`} className={cellClass}></div>;
  };
  

  return (
    <div
      className="game-container"
      tabIndex="0"
      ref={gameRef}
      onKeyDown={handleKeyDown}
    >
      <h1 style={{ color: "white" }}>Snake Game</h1>
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)` }}
      >
        {Array.from({ length: ROWS }).map((_, row) =>
          Array.from({ length: COLS }).map((_, col) => renderCell(row, col))
        )}
      </div>
      {gameOver && <div className="game-over">Game Over! Score: {score}</div>}
      {!gameOver && (
        <div style={{ color: "white" }} className="score">
          Score: {score}
        </div>
      )}
    </div>
  );
};

export default App;
