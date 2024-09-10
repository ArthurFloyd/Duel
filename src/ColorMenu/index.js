import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactDOM from 'react-dom';

import { DEFAULT_SPALL_COLOR } from '../Canvas';

const ColorMenu = (isPortalVisible, portalPosition) => {
  const [colorSpellPlayer1, setColorSpellPlayer1] = useState(DEFAULT_SPALL_COLOR);
  const [colorSpellPlayer2, setColorSpellPlayer2] = useState(DEFAULT_SPALL_COLOR);

  const inputRef = useRef(null);
  const { t } = useTranslation();

  const portalContainer = document.getElementById('portal');
  if (!(portalContainer && isPortalVisible)) {
    return null;
  }

  const handleColorSpellChange = (event) => {
    let playerId = event.target.id

    playerId === '1' ?
      setColorSpellPlayer1(event.target.value) :
      setColorSpellPlayer2(event.target.value);
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
  };


  return ReactDOM.createPortal(
    <div className='modal' style={{
      position: 'absolute', ...portalPosition, display: "flex", justify: "center"
    }
    }>
      <label className='container'>
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
      <p>{t('interface.colorSpellsChangeMenu.messageInsideTheMenu')}</p>
      <label className='container'>
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

export default ColorMenu;