import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import Canvas from './Canvas';
import './App.css';
import PlayersControls from './PlayersControls';
import { DEFAULT_SPALL_COLOR } from './Canvas';
import en from './locales/en';

const App = () => {
  const [isPortalVisible, setIsPortalVisible] = useState(false)

  const [portalPosition, setPortalPosition] = useState({ top: 0, left: 0 });

  const [damageCounterPlayer1, setDamageCounterPlayer1] = useState(0);
  const [damageCounterPlayer2, setDamageCounterPlayer2] = useState(0);

  const [colorSpellPlayer1, setColorSpellPlayer1] = useState(DEFAULT_SPALL_COLOR);
  const [colorSpellPlayer2, setColorSpellPlayer2] = useState(DEFAULT_SPALL_COLOR);

  const inputRef = useRef(null);
  const i18n = i18next.createInstance();

  i18n
    .use(initReactI18next)
    .init({
      lng: 'en',
      debug: false,
      resources: {
        en,
      },
    });

  const { t } = useTranslation();

  const renderColorMenu = () => {
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

  return (
    <>
      <I18nextProvider i18n={i18n}>
        <button text={`${damageCounterPlayer1}/${damageCounterPlayer2}`}
          hover-text={t('interface.colorSpellsChangeMenu.messageOutsideTheMenu')}
          className="btn"
          onClick={(event) => {
            setPortalPosition({
              top: event.target.getBoundingClientRect().top + 25, left: event.target.getBoundingClientRect().left + 50
            });
            setIsPortalVisible(previousValue => {
              return !previousValue;
            });
          }}></button>
        <Canvas
          setDamageCounterPlayer1={setDamageCounterPlayer1}
          setDamageCounterPlayer2={setDamageCounterPlayer2}
        />
        <PlayersControls />
        {renderColorMenu()}
      </I18nextProvider>
    </>
  )
};


export default App;