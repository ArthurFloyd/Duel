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

  const [colorSpellPlayer1, setColoreSpellPlayer1] = useState('#d0d5ce')
  const [colorSpellPlayer2, setColoreSpellPlayer2] = useState('#d0d5ce')

  const inputRef = useRef(null);
  // console.log('app', colorSpell)

  // const gameOver = {
  //   winner: '',
  //   isPaused: false,
  // }

  const renderPortal = () => {
    const portalContainer = document.getElementById('portal');
    if (!(portalContainer && isPortalVisible)) {
      return null;
    }

    const handleColorSpellChange = (event) => {
      let playerId = event.target.id

      console.log('testp1', colorSpellPlayer1)
      console.log('testp2', colorSpellPlayer2)
      playerId === '1' ? setColoreSpellPlayer1(event.target.value) : setColoreSpellPlayer2(event.target.value);
      const currentCanvas = document.getElementById('canvas');
      const currentContext = currentCanvas.getContext('2d');
      const playerKey = `player${playerId}`;
      currentContext.state = {
        ...currentContext.state,
        players: {
          ...currentContext.state.players,
          [playerKey]: {
            ...currentContext.state.players[playerKey],
            magic: {
              ...currentContext.state.players[playerKey].magic,
              color: event.target.value,
            }
          }
        }
      }
    }


    return ReactDOM.createPortal(
      <div className='modal' style={{
        position: 'absolute', ...portalPosition, display: "flex", justify: "center"
      }
      }>
        <label className='conteiner'>
          <input
            id="1"
            name="player1"
            type="color"
            value={colorSpellPlayer1}
            ref={inputRef}
            onChange={handleColorSpellChange}
          />
          <div className="circle"></div>
        </label>
        <p>change the color of your spells</p>
        <label className='conteiner'>
          <input id="2"
            name="player2"
            type="color"
            value={colorSpellPlayer2}
            ref={inputRef}
            onChange={handleColorSpellChange}
          />
          <div className="circle"></div>
        </label>
      </div >,
      portalContainer,
    )
  };
  // const handleScore = (event) => {
  //   let playerId = event.target.id

  //   playerId === '1' ? setColoreSpellPlayer1(event.target.value) : setColoreSpellPlayer2(event.target.value);
  //   const currentCanvas = document.getElementById('canvas');
  //   const currentContext = currentCanvas.getContext('2d');
  //   const playerKey = `player${playerId}`;
  //   if (damageCounterPlayer1 >= 3) {
  //     currentContext.state = {
  //       ...currentContext.state,
  //       players: {
  //         ...currentContext.state.players,
  //         [playerKey]: {
  //           ...currentContext.state.players[playerKey],
  //           isWinner: true,
  //         }
  //       }
  //     }
  //   }
  //   if (damageCounterPlayer2 >= 3) {
  //     currentContext.state = {
  //       ...currentContext.state,
  //       players: {
  //         ...currentContext.state.players,
  //         [playerKey]: {
  //           ...currentContext.state.players[playerKey],
  //           isWinner: true,
  //         }
  //       }
  //     }
  //   }

  //   return (
  //     <div>{`${damageCounterPlayer1}/${damageCounterPlayer2}`}</div>
  //   )
  // };




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
  // if (damageCounterPlayer1 >= 3 || damageCounterPlayer2 >= 3) {
  //   // alert('Congratulations!')
  // }
  // const isPaused = damageCounterPlayer1 >= 3 || damageCounterPlayer2 >= 3
  // const currentCanvas = document.getElementById('canvas');
  // const currentContext = currentCanvas.getContext('2d');
  // if (damageCounterPlayer1 >= 3) {
  //   // console.log('no canvas');
  //   currentContext.state.players.player1.isWinner = true
  // } else if (damageCounterPlayer2 >= 3) {
  //   currentContext.state.players.player2.isWinner = true
  // }
  // const currentCanvas = document.getElementById('canvas');
  // const currentContext = currentCanvas.getContext('2d');
  // if (damageCounterPlayer1 >= 3) {
  //   currentContext.state = {
  //     ...currentContext.state,
  //     players: {
  //       ...currentContext.state.players,
  //       player1: {
  //         ...currentContext.state.players.player1,
  //         isWinner: true,
  //       }
  //     }
  //   }
  // } else if (damageCounterPlayer2 >= 3) {
  //   currentContext.state = {
  //     ...currentContext.state,
  //     players: {
  //       ...currentContext.state.players,
  //       player2: {
  //         ...currentContext.state.players.player2,
  //         isWinner: true,
  //       }
  //     }
  //   }
  // }

  return (
    <>
      <div>
        {/* {handleScore} */}
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
        // colorSpellPlayer1={colorSpellPlayer1}
        // colorSpellPlayer2={colorSpellPlayer2}
        // gameOver={gameOver}
        />
        <PlayersControls />
      </div>
      {renderPortal()}
    </>
  )
};


export default App;