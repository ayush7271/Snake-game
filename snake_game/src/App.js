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
const CELL_SIZE = 10;
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

  useEffect(() => {
    const handleTouchStart = (event) => {
      const touch = event.touches[0];
      const { clientX, clientY } = touch;
      const { left, top } = gameRef.current.getBoundingClientRect();
      const offsetX = clientX - left;
      const offsetY = clientY - top;
      handleTouch(offsetX, offsetY);
    };

    const handleTouch = (offsetX, offsetY) => {
      const col = Math.floor(offsetX / CELL_SIZE);
      const row = Math.floor(offsetY / CELL_SIZE);
      const head = snake[0];
      const nextDirection = getTouchDirection(head.x, head.y, col, row);
      if (nextDirection) {
        setDirection(nextDirection);
      }
    };

    gameRef.current.addEventListener("touchstart", handleTouchStart);

    return () => {
      gameRef.current.removeEventListener("touchstart", handleTouchStart);
    };
  }, [snake]);

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

  const getTouchDirection = (startX, startY, endX, endY) => {
    const dx = endX - startX;
    const dy = endY - startY;

    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? "RIGHT" : "LEFT";
    } else {
      return dy > 0 ? "DOWN" : "UP";
    }
  };

  const renderCell = (row, col) => {
    const isSnake = snake.some(
      (segment) => segment.x === col && segment.y === row
    );
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
    <>
      <img
        className="progress"
        src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTEhIVFRUWGBgXFhgYFxUZGBsZGBYWGBgXFxcYHSggGBomGxYYITIhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0mICUtLy8vLS0tLi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALgBEwMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAABQIDBAYHAQj/xABHEAABAwIEAwUFBQQHBgcAAAABAAIDBBEFEiExBkFREyJhcZEHMoGhsRRCUsHwIzPR4WJygqLC0vEVJFNUkrIWFzRjc6PD/8QAGwEBAAIDAQEAAAAAAAAAAAAAAAIDAQQFBgf/xAA5EQABAwIEAggEBAUFAAAAAAABAAIRAyEEEjFBBVEiYXGBocHR8BMykbEUI2LxQlJy0uEGFTNDov/aAAwDAQACEQMRAD8A7iiIiIvCV6rMjhzsB4/zRFeRR1RjlLH+8qYGf1pY2/UrFfxVRiMzfaI3RDeRpzsFjY3cy4GqG2qKbRaxh3HlBUF7aeczOYAXBkcpsDe2paAduRUXRe1PD5pxTxGV0hJABYI+8Pu/tXN73huqzWpguBcOjc30HXyWYK3tFzTHPa7T0s5p5qWoY8Eav7MMyk6SAsc4ub5AnQi1xZW+L/ajLRCN4oWywygFkzajuEkXy/ut7a+I22NoDE0iWjMOl8vX2HQplN+pdPRcmxX2k1ZohW0EUE0Yv2wcJM8RFr5mBwuBzN9rHUajHwb2i1lfSvNI+BlbGLugcw5XN/FE4vPhvsdDuCq/x1DJnm05TY9E/qES0dZAGnNS+G6YXYUXDeG/aLUVZfST1j6epJLYpBDEGZh9xzHNuDcEWJF9tDa8ZBxrXUlW+mxaWZ0bxl7RjnRlgNwJWdlbM3rpcW02scuxbWlzQCXNEwIlw5tvcePfAIMNjt71X0Ki+bMYxKuwyqZLJUyV1I/3DJK+RjmGxy6khsgFiDz32JC7N7OK6GakL6ckxGV5be9xmyvc032s57hbbppZZpYltUjIJaRIdtrBadwR5HcLBbGq21ERbKiiIiIiIiIi8BXjnLyNEVaIiIiIiIiIiIiIqSeiIqkVObqqkRERERERW3O9ERcR4vo5pxJU0VTUSOge+Kpg7aVxDoiWuLGF25sNNQRqBfQwFXV0+I0xZI+OlrIW6PIDIpgbXa6wy5r6XHPUaXAy+MRVYXXyVsDc0Ms8pdvbvSOL4pByue8Hcr6dFrZqRJeRos15c4DoHOJA+AK5dOi6rIDzDScrgbgg9Jjp1FtwZG5tFpdG3d5qR4axtktM6gxRj3QgfsZg0ufGWghoGUEm3IgHobtOmHwris2HzvYz/eKR5s9pGUPadM7WSWyvtoQdDa3QizdVNaTewJtqbAmw6m2yvPDsOc7Y6L9W/wAM/wAw3B7D3So/FdY8t0rgIKwVOGOfE298slgBc6ss0nNGeh/msji+WOseydkP2eo07VzXXY4ge8BYEOB59N0Zhk50EMp7ub3He7+LbbxV6lwSokiM0cLnRi93C3Lewvd1vAHZBToMc2qX9JtsxdBM7OMgGdp5W3SXGQB4fZMYxV9XSsgqmMklj9yo1Eg8xs640PXQ7i6x8Lr5YaZ9IXMlgf8AclbmDb6ksIcMuuvgdRY3vI4XwvU1EYliY0sNwLvaCS0kEAHxC9wnhiadnaNLGgSiIh2bMHEtBJAGwzfIqojAU6bqZy5Q641h3ZeNLAdal+YSD1eCiMBmkpHOdTyvYXjK4d1zXDldrgQSOR5XPUqulhbFIx8RMbic2dhym5JBADbANGoy2srk9FkqDAXg2k7MuA0vmDSQD0/JbOzhAPqJaXtTnhiDmENAD82oBFzaznW8VfUr4dhL3xLmyTEy2QL2v8wEawe1RDXG3L7qKxjDon55XtzSbl7rlxIFhcnfYBYD4nkZpgXNI3ecxvyy3JIN/wA1M4rh7KZzMz5HMMMcrQ8/ekL7gAAbZR5XWu1lWZHXPwHRW0HsqU2vZptaOru02UXAgwVk4Lj8ELn0dZGHUdRYvIHejf7okFtdg3bUWuOYPYPZJgv2OCeASCVhm7WJ4N7xyRR5Tppe7Dtod+a4/g2G0tWZKWd4jmlDTTSEbPbnuwno7M3u87aa2XRvYZBUQGtpKkODoDDkBNxlf22rDzYS0n4rUZkGMeGkgxJadHWEPHYeiedp0CmZyCf26l1hERdFVoiIiIqXORxVG6IllcAQBeoiIiIiIiIiIiIipelkcF4SiL2/JGIB6KpERERERUBirREXA+MuIHUWL1cNTGZKGpLC9hBI1hjDns8QdwOg52Wp1kMUcj2U788Id+zde92Gzm6+ANvguj+0aqpZK5+HVoDWzsjlhm5xykGOxJ2B7MeGpB6jmVXg0lHI+nlsXMOhGzmu1a4dLg7LnUMgxTxGVxGmzhaHjrHyu8easdOQb+XUgN1tHs7l/wB5fEdpYZGfHQ/TMtRzKSwHEuwqI5rE5CSQN3AtLSPOx+P1vxtE1sO+mNSDHbqPFYpmHArr00fdzc200jHeeWJwH1UVwbNeloTyIljPwLz/APmtZm9oBvPlgu2UC15LFv7MMJ0ab7A8lGYHxhLTQiIRxvDSXRl17sLgQdt/ePTcrzjeEYr8O9mUBxLTqNCx4O+xePotr47MwM+5B8luvBbmtp8rgf2VY9jbciTlF/Dvn1XvBTuzNayQgltWSSBYXeQAQOQuue0PEtRExzGZbPmExJbc5wWuvva12jSy8PENQDMRJlM5Bls1upHTTunystypwitVdVzEQ8g6mfmB5bjN4KDa7QG9XoveIoXQVczTu2RzgeoJztPoQuiSSFuMEt+/RXHie10+TVyyvr5Jnl8zy9xABJtsNhoFTJXyFwc6V5cBYOL3EgdASb28Fu4nh1TEMYCYIYWmBMk5dNLS2fDrVTKoYTA3n7+q3L2mTCQ0srTdskV2+V2uH/etJzL2Jj36Na5xA2ALrDyHJWrrcwtD4FIUpmJv2knmezXZQe7M6VlQ8PS1mZsB/axsMrG7F9nNBaDydqCP0V1H2J8Ty1TpIKgHtoIw0vOjnND7APB1zNNwTzv1vfkf2ueJzZacuD4jnu25s0A5iRzbY630sTdde9lONUtZUmpY0RVboXMqIxs+zoyJWjmNCL7i9jfQmmpmGJaXNzN2I1Y6CDP6XDfnA5ESHymD/ldaREW8q0VLnAalVLXcUxDMbA90fPxWti8SzD087lZTpl5gLIrsU1tGdBubfRY7cQf+I/JR7SrrSvD4vjWLfUJa8gbALosoMaIhTVHiF9H+tvqpIFazG5SNDVZdD7p+S7vCeNfHAp1defv35a1bDxdqlkRF6RaaIiIiIiIiLwheoiIiIiIiIiIiIiLkPtb4airaoMDxHV/Z2uguSBIGPmzx9Li7TfcX6XtyTt5i4sqc3axWiIf7wDRoDfe3XpZdb9uWCVEr6aopic9OyR9m3z2a6PvMtuRfZctxfiT7aY5HsDZmxhkrgAA8gktfpzsSCPDToNFhf+JMEObvzYcoNv0ut396mYy9f3WNmWzO4Pl+zioEsRvD24YC7MWZQ4kXGpAcPiQtSzrpFXjLYMMpZOzzvfA6nac1g0OaA64+9+6Hp4qHEK2IpmmKGrnRtynfqB9djKk1pnNsFHU3Bfa07JW1I7SSIzNj7M6gBpLS/NuC8C9ueyucN8Iw1FNHJJK9r5y8R5cmVuTN7wIufcJ3H5rY+E5c9FSN/GyWLMPeGXN7p5XEfyHRWOBbupYGggup6iUSai4BZNqfH9oPmuNXx+JFOqC+7XxsLfmDloS1utzvYq9tJki2o9P8qE4awKl7B01WdpjCT2mRkdhbMTprc89tFe4QwWmk+0h0banspg2NwebOjJsHDIbHQE3WRwnXxkVcYkiGWtMwzkZTCZG53C+/da7XxCsRYzDFUYplnjaHsa6Fwe2zniNxswg6nMQNOalUr4l7qwlwPRIEkQM1Ow0Is68a6m4EYDWjKbb8uR9FkYFhMDayvibDHOI2tdC14a4B1iSwF17d4gX8FXwSbfa4wyJtUJy4xEj93cXja6x7o7wuAQLjqsVvEVIzE55e2b2MtOGl7Q4/tAWi3dF75QdVE4Fi9DTyzsLpHxkxuhqCy8oLbFwNwHC5021F7o+jVrsfma4kspm4cZIDQ4dd5LhGbUgyIOQ5rSII1Pv6blTnB9e1s1XB3aWd84exjrbA5jBfQEbjTk+42WmcVCQVc3asax5dctabt1AN2k7g7/FTLeM4ftVXI6GR0NQGN7paJBkblDhc21156WCgeKsbFXUumDCwENaATc2aLXNua6GDoVGYo1CyA5jZJMwYbYHXWQQZIiQbqp5BYBMwfVWsKxo0szJw0PyEhzDs5rgWOb6O9bLpns7wWnGIRV9A8GmnZKx8emaKQtz5Lch3duWlrghcpwswmaMVP7kvaJd9GE2J01Fr306LfeDMFqMNxemYx5fSVLnZHixY8dlIWB1tA8XvcbjbS4WxXyjFMLXZXkb/ACvbN2/1C7m7yeRtATkM6fY+i+gERF0FWsDF58rLc3afDn+vFaxLc68gpnHZO8B0H1UHNMMoA+K8nxqqHVSxxsB9T+66OGbDQVUx6vMcsFr1kxOXlHhbRUgyI2vyVUblXTTDLYqzcDUraqtZRNOpRdci9xY2VckzKnKCS7bcxp/D9eCy1FYdJZ1r6EKVX0PB1fiUWlcyq2HEIiItpVoiIiIiIiIiIiIiIiIiIiLlvtvr56ZtHVU5IdFI8O0JaWPa27Xj8JLQPO1tbLk/Es9JUBlZSjs3ylwqYdO5ILEOb/Rdd2uxtyNwu2+1/FPstLDMY2yx9uGSxuFw+OSKVrm/T0XDeJ+HY4mitoiZaKX4uhcT+7k5gX0BPkeRdz6hY3FMLpBIgO2dr0D1izm8zYcjYJyn33+qh8yyZsUlfEyF0hMUZuxlm2aTfUWF/vHc81kYfgEs9NJUwOjl7L95C0u7Zo175YW2IsL6E8+YIV/hXAm1rZGxztZVNGZkLm6PAF+7Jm3+GnzF78ThwHOc4QwwbE5T9DH9WkbwohjjYbrBbiUzGhjZpAG3sA9wDb3vlAOhNzr4lYwmOup131Ovn1Ulwzh0ElQ+mrpJaZ98rCAzKJNssgeNNbW1HzuqjhraKu7DE43Oi/FGXNu0nSVpGrm9W778xZR/F0mvNNvzRmAAHSBvLdnambpkJE7KJJzef1/n9fPenMp7iHBPsVRHLHkrKR5zRjMTmba5Y8s1BA2d4X6hZ3FuE0s0TKzD3hpNu0pXH9oDtdrHXJN9xqDuLrDcfTdkInK/QxYHTKdwZ5iOtZ+Gb9Xu3NakXKntR1Hqul1HBslfQtf9gdSVkY0DYSyKYWuNALNv42sfDaY4f4Srp6R1FidC7K0fsZmvp+0aRoB797jkeYuConF1cmb4TpBhw37W2h/cQe9ZyCYn35LkYhfkMmR/Zjd+V2Te3v2tvpur2GYbNU5vs8UkuSxdkF7Xva/ofRdZ4J4BxSjc+J5p5KSS4fFJIdjpmDQxwBI3bcg7dCqqD2RVNPV/aaSqZTgG7Wd+UZT7zHEhmZngddtbi6mamIl7Q0c2uJ6J6iLOB+o3WIbAM9q5DhNA+qmFPFbtHXADiG+fvWuRqbDXQrd+BMfqKCsjwytYXMM0QivrkcZG5HMJ3jN/h6hb3xD7Io6qcVH2jsJN3mKM95w1D7l/dd4jfzU9U8BRzfZzUTOkkpnseyUNa15LCHWcdQQSBcW9FU5lWuWGowZdSJGZrgZBBFiPpY9oGZDZg38CtzREXRGqrWlZXEX11c469C4kD0VDKLqVzzjzG67DsQfEyVz4CGyMa6x7jr6B1r6ODhrfYLyv4lqI6eKU1Li+RtwAGAXJ+93dANB+rrydfgNV7pDxPXPoY96rpNxLeS6Q2larzYgFxCn4vxDt2iWqkax3eblZEbgEjQhpuLtIuOimncRzZhfEXN11ZljsNfdc7LvbS4+a0j/pvFbvb/6/tUhiGn2F1hoVckWZpHVcLxTiqu+05IauUg/duwa690GwvtvdZMXElTJTmoZPO4wEPe0vkyuadNRfa5HzU2/6ZqAS547p9PJROIHJdxjYVsS4J7HqipxCuMtRUPMdM3OI87rF77tboTdzRYnUnWy72vRcM4eMG0tnWPCezny2WpWqZyEREXTVCIiIiIiIiIiIiIiIiIi8JRFB8WcPR10HYS+7mDtr7Bw5Ea964N9wFrPDfsqgow9ramd7JW5ZI3CIxuG2rSw62XQPimyrfSZUBa8SDsbi3Ube+xZBIWkYD7LaGjk7WAzh9iL9qdju0gAAjbe+wO4WbT+zjDWTdu2lAlzZ8/aTXzXvmAz2ab9AFtqKWRubNAmIneOXZ1JOygp+EqF7i+SjgkebXdJG2RxtoLueCVINwuAaiCIEbWY0fks1FkACwWFjVMI7N7QAAWuFgOoIXHo7ZT5fku1LiNQz32DQ3I58rjktTF3ievyW7gzGbu812LCH5oInb3jYf7oWYofhJxNFT33EbR/0i35KYW224C03CCQioLtQLL1zlQ3dZWFdRERERFRLIGi5RFqntD4diq4GhzR2ocBG/mASMw8QRfQ87Fc/x7goxQsYx2Z7WOOU2Ic3MLgX5jMF1KoLnuzHkbgeW/xsta4yc8ta9nIOAPKxGvxVDnSbLZY2BBXFHydmCGi0j3EEgd4Aabnbb9WVtsAy5O8bjc5bna+4see+915T073yWsS8nTUct/pf1K2Sow5jImMDmmSSzyTtYNuwDo3XN43aTporAokrVY32tG/X8DjuDyBPMH1C6JwDwy2WlnbKNJRltoDlF7a+d/RaFUuue9G24JDrXab9W30HXZdj4IidHSsLtS5vd/q6kade9qoOUmwpP2e8AR4c+WUP7QyBrYyRYtYbOc08iS62v9ELelHYZW5gGusHDTwNlIq1pBFlruBBuiIiysIiIiIiIiLwleNNx0VBcq2bIiqREREVDtwq14QiLy9l4EvyVQCIgC9RERERERFxjFBlnmHSV4/vldnXHOKGZaycf+4T62P5rVxfyjtW5g/mPYui8DvvRReGcekj7fKynHOWsez6T/dLfhkePWzv8S2QBXUrsHYtesIqO7UsrgCAL1WKtERERFHYmCS0Dl3vyUisCqf3/gL/ABuoP0U2aqzHote4np3FrjCRmtd0bvceNvgRpqPBbK4Df9fBQuMtOUke95+e/qqVeCuX4hw45jszYsjXkPmtrnaNTCy/uhxABPO45DWAwqmmmmlmewu7zwXcgQ623QWsuvxYlHcdrbRpAFuZ3Py+agMXqJIw9tI2MNJuSWkk5tXW1Avz13v6zzWWIWtYNw19qLJD3mDvWvob7AkcjofgunwU2UAEgnS5AsNBsByCw8Flp4YI4mOaA1obvY6CyypatpcBcaDqov0WWq/JMW6j9a6LZ4nXaD1AK1Z9jr6LZKB142HTYbKVJV1dlkoig8b4iip2k+8fDX6bq0kDVVtaXGAsrGsZhpYnSzPDWtF+rj0DW7uJ5Ba7wxxz9rmawQBjH3yuMgL9GlwDmAaE2dpfTKVpFbXCreJ3NY8v1bmbs25DbB2wt9T1WZhFqeaN7GsYcwDi0N2JF9h0XLfxRjahbBsY2Xap8EqOpB8iSJGvb7suvq0TdeuK9a3muquGjG81WiIiIiIiIiIiKnMEJtqVzyixp7qtz2HR7uexF7NB/sgKitiG0i0H+Ix78Ft4XBuxAeWn5RPvluuioiK9aiIiIiLknHDLV0vjkP8A9bfzBXW1zD2ii1X5xtPzePyWtih0O9bOEP5ncp72avvBK08pb+rG/wAFe4jp6p8o7CXI0NAID3NJdcknTwI9FH+zB/8A6hvjGfUPH5KrFK2sbPJ2cRLM1mnsy4WFhuPJU1HMFAZ80fp1/ZbmGp1DiXGnlkD+LTbTW6neGo5mtc2d+c5rtJcXGxGxJHUfNTi1bhyqqXSuEzCG5DY5MveuOu+l1tK2MO5ppjLMC3S1WpjWObWOeJMHo6aeCIiK9aqKCqJv2zvO3oB+d1LVc4YwuPLbxPILXN8xJ1P13+qrqFW0husx9Vby+iwKpwkBsRb/AF5/FeVt8oeDY8+hWGaxjTrZhPXY+RVQVyoGHPvflqqnUfIgHxUnBOHD+a9LW26qYUVCyUYP1v8AzVs0luZ01GqlpJWt3AF+pHRR1RiTCQGd83scvj47BYMLIlX4WE8zbZTOG1BZcC9uh2+HRa3JUztA7KMOPM9B0aOZ8VlUMtQ+7XQyNPXKVkIRa6l63EnO0vYeH61WLTYC2e5kBync6gm/IH81nYZguzpb+R/Popid2VjiB7rSQB4DYBSDZuVWXx0WqEp6VjAGMYAxujRbQAbDVZHYjk0egXN46+ZpNpJG+GZw+V1lS4jOW6yyf9bv4rlt41SI+U+C7r+B1A6M/gV1OHUA+AV1QnCUhdSx3vcZhr4ONvkptdWm/wCIwPG4B+q4FamaVRzDsSPoUREU1WiIiIiIiIoXius7KlkI3cMjfN2h+Vz8FzKKK4uDry/itq9o9brHCOQL3eZ0b8gfVagyReZ4rWDq8fyiPM+S9hwbDuZhQRq4z3aD7SO1dA4Sqp3MJldmYDlbf3tOebpy9Vs7JQdj8OaiMNh7ONjPwtF/Pn87rXuKqoulZExxBFjobHOdG7dB/wBy7Rf+Fw4LpJEb3JO3vkuF8IYzFODYaDOgsAN467d5W+ooGXFPs8TTKXPAytvu4nmfHYlStFVNlY2Rhu1wuNCPkVsh4zZd9YWg6k9rc8dGYB2KyVzf2nttPE7rHb0cf8y6QtA9qUWsDvCQf9hUMR/xlTwx/MCsezBwEs/9JjXehI/xLb4zz6rn3CdSI3TOuBenkaPF12FoHzWHTYnM3RssgHQPcB9VoPx7cM1ocCZldWlw12JL3AxEbTt72XVIjZw/W6kFyf8A2jIJI3Oe91nNOridiDzK6jBVMffI9rrb2INvNbWFxbcRmgRC08bgXYYNJMzO2ke+pX0RYtfLljcfh6/yW0VzwJsofEpnyHT3Bew6+PmsNkl9RuNx/BXJzmFr2KhKyZzDcjXqD+vVUkHVbTY0WzMia5tiLgharxBh4L8pBN9AAbaW/wBVPYJWBzG63/koXjRjhJTvBIHaWcfAtdv8bKIWVh0vD7QO6948A51lVNh040jmePHQ2+LgVO0cWVodmvcLDr8SA0zWuenyUoWAsGDDbNu9xkd1cSfS+yzcIwvPJ3G+Z5D+O68+1AtHjt4+AHJSWBVbWSRsuLuJabdSCfqFkALBJhbLSUbIxZo+PNZKIrlrEyisVbrMd5fXRX1gYpO1rQHOAzGwubX52+SEwpNBJACxWxg7tB8wCqxC0bNaPgF5GrqzBUyVkUR0I8VlKOo525yzMM1r2uL6He3xUisKDhBRERFFERERERERaHj+AzvqDKWhzS42sR7tgALb7BZsvD9NYWhkuLXLTa5HOxutusvVrDB0QSS2Zve633cSxBa1rXZcoi0jsm6hQ4fhkH9m6hH4G81fb5rtzZrFrwdB3eVtwFuqKyrRZVjPsZHaFr0cTUozkOog22P27lpHEtFPKY2xRktF83LU2HPw+q26igDI2MGzWgeg3WSiw2g1tR1STJjujks1MS59JtIgANnTeed/oi0z2lR3jhd0c4erb/4Vua1jj+LNTt8JAf7jx+alWEsKhRMVAucs0Hw6K22a2xspHD8PMr2R5i3MS2/Q7g735fNbD/5eH/mD6O/zLg4jB1qrg6m2bcwPuQvTYPH4ejTyVHQZnQn7A8lqBnvu6/qtt4IrT2obckPBG1hoMw38vmrg9np/5g+jv86k8H4U7CRknah2W/3TfVpG5cbbqWDweJpVQ5zfEH7FYxvEMHVoOYHg2MWdrtq3mtlnlytLui1XEa6R7rONm8gNtvnutpqYszS3qtZxCLa7SLdQf1yXbqSvN0oWJX1GVtxsomTEmuBY7Q8rqTxNoLD4en8lqAhJJYelxbfdYlWAKXwivEc2Xk/Uf1huPT6KZ4oi7WnOX3hZzbdR/EXHxXOJHyRkSdoC1jmkX3PO2m+g5rpkjwWNLdQQCoPtdSC1qi4hDWgOHmMw1321/WqpqMegMjLbi9xYk2/1IURimGymUsZG3L+IgnfpZX6LCpox3n6nQDKPhvdTCwVdr8Wc/wDdlkYsQNLnU31A15eCvYC7JNC98pP7RhIJH4hsOQub2UXNRZTyzE6ch52ClKSACNzswJA72mgRF2BFYimGRrnEC4B103HikNSxxIa9riNwHAkedtlctRX1pftGl7sTepcT/dA+pUhxZiboOzyOLb5r2A1tltv5laLjeJvnLS52bKLDb8ly+I4lgpOp7ld3hGBeajMQflv5js1WJDM4e653wJH0Wb9qeW6vcfNxKjYXDmbeqy2ytAtmv5Arz7C4b27fJelqtk6KY4Hmy1dvxBw+V/yXS1xvDqkxyB7dCNQVvPDmNukkyvfmDgbaDQjXcDpddrhFdgpfCOsrz/GcI97/AIw0Db90+S2tERdpedRERERERERUOPReucrYF0RYVearMzsOwLPvmQyB39kNFtuq8vV9Kf1kUoiLMqNvV9IPV6h+JJKoQg3DBnGsXaF+xsNOV/yW1IoVGZ2ls6q2jV+HUD4mD75rm0lRXBuj6oj/AOJ31vdQtVXSPIbNJJe+z3SaeeYWC7GrM0LXaOaHDxAP1XPfw4u/7Hd9/uurT4wGGfhDuIHkuSGVrDYW82vB+YK2PhaundMwAyOYb5sxcWgWPXTey3RlDGPdjYPJrR9Ar/0WaXD8jw8O+n7+SYni7azC3JqIkunviPNe5gqlYkc77rWnzdb6Aqm0nVg+Dj+YXSXEWSrU8Ie0tdsVRlk/Ew/2XD/EVqvtO4jloqVrobB8kgjzWvlGVznEDm6zTa6wdFkCSqMVj7G8bnDXVu17eIWvNw3PPG1j253XADiQ3QX0IudrrkU9fPK8yPkc4vsbtuCHa2+Otra6rtXAnB1Q0RTVryHR2LGXGbfMDIeXLTfRUgXstjMALqErvZhiEshtUU8cfIHtHne5+6Fm/wC2WQujozKztWXiNgfeibqQOhtp5hdXWtYxwPRVMvbSxESXuXMe5pJsBcgGxNhvZTcwFVtqEG60Gnx2KR0BMrWOmcIrkaB5cBlNvHS9uZW0Y9wbUTMaGVDQ5rg4aFo05k638llYd7OaCGRsgjc9zCHMzuJDXBwcHAC2twN9PUrZ6isDCAWvNxfusc4fGw0RrAFh1QnRcnqcFlhMbZLdoy4de4a6+xBO41Vxz3tJ0jcDvbQHkbAnVdLlxaMavztH9Jjx9Wq0+tpza7C++n7lx/woafWpCr1LjXF1PLKMz3lzRuwO5W30K1bAXd7LC58cze8HNdYHf724NuvRfSUuA0j9XU0J8423+mijo+BaBr3PbBlLjdwa+QNd/WaHWKBiwaglaHw0a+ujJeO2jj7jXuc25J1IDrAPAsNbncanlIP4PquUQH9tn8V0yngaxoaxoa0bAAAD4BXVrV8BTrOzPJ7o9Ct7D8WrUGBjA2O/18ly3/wdVf8ADH/Uz/Mg4Qq/+F/eZ/FdSRUf7Rh+bvqPRbH+/Yn+Vv0P9y5cOEKvnH/fZ/FSWGYDUxvYRGG2cDcvbyOuy34lUj1U6fDKNMy0nw9Psq6nGsQ8QQ36H+5VXXqpsvQV0VyF6iIiIqSfVeIiKkBXAEREXqIiIiIiIiIiIioHNERF6boAiIiqWFimGxVEZimYHsO4P1HQ+KIiKJw/gmghc17KZhew3Y593uaRtlLr2WxoiwiIiLKLwlYk1OHG5c63QOIGl9dNV4iIqoKGNuoY0Hra59TqsoBERF6iIiIiIiIiIiKl6IiIvLKoBERF6iIiL//Z"
      />
      <h2 className="update">we soon update for mobile </h2>
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
    </>
  );
};

export default App;
