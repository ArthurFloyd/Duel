import React, { useState } from 'react';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next, useTranslation } from 'react-i18next';

import Canvas from './Canvas';
import './App.css';
import PlayersControls from './PlayersControls';
import en from './locales/en';
import ColorMenu from './ColorMenu'

const App = () => {
  const [isPortalVisible, setIsPortalVisible] = useState(false)

  const [portalPosition, setPortalPosition] = useState({ top: 0, left: 0 });

  const [damageCounterPlayer1, setDamageCounterPlayer1] = useState(0);
  const [damageCounterPlayer2, setDamageCounterPlayer2] = useState(0);

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
        {ColorMenu(
          isPortalVisible,
          portalPosition,
        )}
      </I18nextProvider>
    </>
  )
};


export default App;