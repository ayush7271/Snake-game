import React, { useState, useEffect } from 'react';

const App = () => {
  const [div1Position, setDiv1Position] = useState({ x: 0, y: 0 });
  const [touchCount, setTouchCount] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;
      let updatedPosition = { ...div1Position };

      switch (key) {
        case 'ArrowUp':
          updatedPosition.y -= 10;
          break;
        case 'ArrowDown':
          updatedPosition.y += 10;
          break;
        case 'ArrowLeft':
          updatedPosition.x -= 10;
          break;
        case 'ArrowRight':
          updatedPosition.x += 10;
          break;
        default:
          break;
      }

      setDiv1Position(updatedPosition);
      checkCollision(updatedPosition);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [div1Position]);

  const checkCollision = (position) => {
    const rect1 = document.getElementById('div1').getBoundingClientRect();
    const rect2 = document.getElementById('div2').getBoundingClientRect();

    if (
      rect1.left < rect2.right &&
      rect1.right > rect2.left &&
      rect1.top < rect2.bottom &&
      rect1.bottom > rect2.top
    ) {
      console.log('Divs are touching!');
      setTouchCount((prevCount) => prevCount + 1);
      // Add your logic here for when the divs touch
    }
  };

  const getSnakeSize = () => {
    return 30 + touchCount * 10; // Adjust the size increment as desired
  };

  return (
    <div>
      <div
        id="div1"
        style={{
          position: 'absolute',
          width: `${getSnakeSize()}px`,
          height: `${getSnakeSize()}px`,
          backgroundColor: 'green',
          borderRadius: '50%',
          top: div1Position.y,
          left: div1Position.x,
          transition: 'top 0.2s, left 0.2s',
          animation: 'snake 5s linear infinite',
        }}
      ></div>

      <div
        id="div2"
        style={{
          position: 'absolute',
          width: '100px',
          height: '100px',
          backgroundColor: 'blue',
          top: '200px',
          left: '200px',
        }}
      ></div>
    </div>
  );
};

export default App;
