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

  const [colorSpell, setColoreSpell] = useState('#ec4176')

  const inputRef = useRef(null);

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
      <div className='modal' style={{
        position: 'absolute', ...portalPosition, display: "flex", justify: "center"
      }
      }>
        <label className='conteiner' value={colorSpell} ref={inputRef} onChange={(e) => setColoreSpell(e.target.value)}>
          {/* <label className='conteiner'> */}
          <input value='#f2f2eb' id="1" name="player1" type="color" />
          <div className="circle"></div>
        </label>
        <p>change the color of your spells</p>
        <label className='conteiner'>
          <input value="#ec4176" id="2" name="player2" type="color" />
          <div className="circle"></div>
        </label>
      </div >,
      portalContainer,
    );
  };
  // console.log(damageCounter)
  const pauseGame = () => {
    // console.log('PAUSE!!!')
    const currentCanvas = document.getElementById('canvas');
    if (!currentCanvas) {
      // console.log('no canvas');
    }

    const currentContext = currentCanvas.getContext('2d');
    currentContext.state = { ...currentContext.state, isPaused: true };
    // console.log(currentContext.state);
  };

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
  if (damageCounterPlayer1 >= 3 || damageCounterPlayer2 >= 3) {
    // alert('Congratulations!')
  }
  const isPaused = damageCounterPlayer1 >= 3 || damageCounterPlayer2 >= 3
  // const currentCanvas = document.getElementById('canvas');
  // const currentContext = currentCanvas.getContext('2d');
  // if (damageCounterPlayer1 >= 3) {
  //   // console.log('no canvas');
  //   currentContext.state.players.player1.isWinner = true
  // } else if (damageCounterPlayer2 >= 3) {
  //   currentContext.state.players.player2.isWinner = true
  // }

  return (
    <>
      <div>
        {/* <ChangeColor /> */}
        <div>{`${damageCounterPlayer1}/${damageCounterPlayer2}`}</div>
        <button className="btn" onClick={(event) => {
          // console.log(event.target.getBoundingClientRect())
          setPortalPosition({ top: event.target.getBoundingClientRect().top + 25, left: event.target.getBoundingClientRect().left + 50 });
          setIsPortalVisible(previousValue => {
            return !previousValue;
          });

          isPortalVisible ? resumeGame() : pauseGame();
        }}>color spell</button>
        <Canvas
          setDamageCounterPlayer1={setDamageCounterPlayer1}
          setDamageCounterPlayer2={setDamageCounterPlayer2}
          colorSpell={colorSpell}
        // gameOver={gameOver}
        />
        <PlayersControls />
      </div>
      {renderPortal()}
    </>
  );
}

export default App;