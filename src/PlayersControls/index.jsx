import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';


import './styles.css';
import { DEFAULT_SPELL_CASTING_RATE, PLAYER_MOVING_SPEED } from '../Canvas';

const PlayersControls = () => {
  const [movingSpeedModifier1, setMovingSpeedModifier1] = useState(1);
  const [movingSpeedModifier2, setMovingSpeedModifier2] = useState(1);

  const [castingRateModifier1, setCastingRateModifier1] = useState(5);
  const [castingRateModifier2, setCastingRateModifier2] = useState(5);

  const { t } = useTranslation();

  const renderPlayerControl = (playerId) => {
    const handleMovingSpeedChange = (event) => {
      playerId === 1 ? setMovingSpeedModifier1(event.target.value) : setMovingSpeedModifier2(event.target.value);
      const currentCanvas = document.getElementById('canvas');

      const currentContext = currentCanvas.getContext('2d');

      const playerKey = `player${playerId}`;
      currentContext.state = {
        ...currentContext.state,
        players: {
          ...currentContext.state.players,
          [playerKey]: {
            ...currentContext.state.players[playerKey],
            dy: PLAYER_MOVING_SPEED * event.target.value,
          },
        },
      };
    };

    const handleCastingRateChange = (event) => {
      playerId === 1 ? setCastingRateModifier1(event.target.value) : setCastingRateModifier2(event.target.value);
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
              castingRate: DEFAULT_SPELL_CASTING_RATE / event.target.value,
            },
          },
        },
      };
    };

    return (
      <div className='slider'>
        <span>
          {t(`interface.players.player${playerId}`)}
        </span>
        <div>
          <input
            type="range"
            id="moving-speed"
            name="moving-speed"
            min="0"
            max="10"
            value={playerId === 1 ? movingSpeedModifier1 : movingSpeedModifier2}
            onChange={handleMovingSpeedChange}
          />
          <label htmlFor="moving-speed">{t('interface.playersControls.movingSpeed')}</label>
        </div>
        <div>
          <input
            type="range"
            id="casting-speed"
            name="casting-speed"
            min="0"
            max="10"
            value={playerId === 1 ? castingRateModifier1 : castingRateModifier2}
            onChange={handleCastingRateChange}
          />
          <label htmlFor="casting-speed">{t('interface.playersControls.castingRate')}</label>
        </div>
      </div>
    );
  };

  return (
    <div className='players-controls-container'>
      {renderPlayerControl(1)}
      {renderPlayerControl(2)}
    </div>
  );
};

export default PlayersControls;