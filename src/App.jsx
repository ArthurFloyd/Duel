import Canvas from './Canvas';
// import ChangeColor from './menuChangeColor';
import './App.css'
import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom'
import PlayersControls from './PlayersControls';

function App() {
  const [isPortalVisible, setIsPortalVisible] = useState(false);
  const [portalPosition, setPortalPosition] = useState({ top: 0, left: 0 });

  const [damageCounterPlayer1, setDamageCounterPlayer1] = useState(0);
  const [damageCounterPlayer2, setDamageCounterPlayer2] = useState(0);

  // const gameOver = {
  //   winner: '',
  //   isPaused: false,
  // }

  const renderPortal = () => {
    const portalContainer = document.getElementById('portal');
    if (!(portalContainer && isPortalVisible)) {
      return null;
    }

    return ReactDOM.createPortal(
      <div style={{ position: 'absolute', ...portalPosition, border: '2px solid red' }}>
        choose color modal (aka menu)
      </div>,
      portalContainer,
    );
  };
  // console.log(damageCounter)
  const pauseGame = () => {
    // console.log('PAUSE!!!')
    const currentCanvas = document.getElementById('canvas');
    const currentContext = currentCanvas.getContext('2d');
    if (damageCounterPlayer1 >= 3 || damageCounterPlayer2 >= 3) {
      currentContext.state = { ...currentContext.state, isPaused: true };
      // console.log('no canvas');
    }
  };

  // console.log(currentContext.state);

  const resumeGame = () => {
    // console.log('RESUME!!!')
    const currentCanvas = document.getElementById('canvas');
    if (!currentCanvas) {
      // console.log('no canvas');
    }

    const currentContext = currentCanvas.getContext('2d');
    currentContext.state = { ...currentContext.state, isPaused: false };
    // console.log(currentContext.state);
  };

  const isPaused = damageCounterPlayer1 >= 3 || damageCounterPlayer2 >= 3
  // if (damageCounterPlayer1 >= 3) {
  //   gameOver.winner = 'Player 1'
  //   gameOver.isPaused = true
  // } else if (damageCounterPlayer2 >= 3) {
  //   gameOver.winner = 'Player 2'
  //   gameOver.isPaused = true
  // }
  // console.log(gameOver)


  return (
    <>
      <div>
        {/* <ChangeColor /> */}
        <div>{`${damageCounterPlayer1}/${damageCounterPlayer2}`}</div>
        <button onClick={(event) => {
          // console.log(event.target.getBoundingClientRect())
          setPortalPosition({ top: event.target.getBoundingClientRect().top + 25, left: event.target.getBoundingClientRect().left + 50 });
          setIsPortalVisible(previousValue => {
            return !previousValue;
          });

          isPortalVisible ? resumeGame() : pauseGame();
        }}>avatar</button>
        <Canvas
          setDamageCounterPlayer1={setDamageCounterPlayer1}
          setDamageCounterPlayer2={setDamageCounterPlayer2}
          // gameOver={gameOver}
          isPaused={isPaused}
        />
        <PlayersControls />
      </div>
      {renderPortal()}
    </>
  );
}

export default App;