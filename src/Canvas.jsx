import { useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';

const CANVAS_STYLE = {
  width: 800, height: 500, display: "block", marginLeft: "auto",
  margin: "100%",
};

const PLAYER_SIDE_GAP = 30;
const DEFAULT_PLAYER_HITS = 0;

export const DEFAULT_PLAYER_COLOR = '#434343';
export const DEFAULT_SPALL_COLOR = '#d0d5ce';
export const PLAYER_MOVING_SPEED = 1.5;
export const SPELL_MOVING_SPEED = 3.5;
export const DEFAULT_SPELL_CASTING_RATE = 5000;

const DEFAULT_SPELL = {
  castingRate: DEFAULT_SPELL_CASTING_RATE,
  lastCastedAt: Date.now(),
  activeSpells: [],
  color: DEFAULT_SPALL_COLOR,
};

const DEFAULT_PLAYER = {
  id: 0,

  // style
  radius: 20,

  // position
  x: 0,
  y: 30,
  dy: PLAYER_MOVING_SPEED,
};

const Canvas = ({ setDamageCounterPlayer1, setDamageCounterPlayer2 }) => {
  const canvasRef = useRef(null);
  const { t } = useTranslation();

  const initGame = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.state = {};

    context.state.players = {
      player1: {
        ...DEFAULT_PLAYER,
        id: 1,
        x: PLAYER_SIDE_GAP,
        color: DEFAULT_PLAYER_COLOR,
        magic: { ...DEFAULT_SPELL },
        hits: DEFAULT_PLAYER_HITS,
      },
      player2: {
        ...DEFAULT_PLAYER,
        id: 2,
        x: canvas.width - PLAYER_SIDE_GAP,
        color: DEFAULT_PLAYER_COLOR,
        magic: { ...DEFAULT_SPELL },
        hits: DEFAULT_PLAYER_HITS,
      },
    };

    return { canvas, context };
  };

  useEffect(() => {
    const { canvas, context } = initGame();

    // spells
    let spellRadius = 10;

    // cursor
    let mouseX = 0;
    let mouseY = 0;

    // field
    const drawGameField = () => {
      context.fillStyle = '#f2f2eb';
      context.fillRect(0, 0, CANVAS_STYLE.width, CANVAS_STYLE.height);
    };

    const drawPlayer = (player) => {
      context.beginPath();
      context.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      context.fillStyle = player.color;
      context.fill();
      context.closePath();
    };

    const drawSpell = ({ x, y }, color) => {
      context.beginPath();
      context.arc(x, y, spellRadius, 0, Math.PI * 2);
      context.fillStyle = color;
      context.fill();
      context.closePath();
    };


    const castSpell = (player) => {
      const canCastSpell = Date.now() - player.magic.castingRate >= player.magic.lastCastedAt;
      if (!canCastSpell) {
        return;
      }

      const playerKey = `player${player.id}`;

      context.state.players[playerKey].magic.lastCastedAt = Date.now();
      context.state.players[playerKey].magic.activeSpells.push({ x: player.x, y: player.y });
    };

    // start game
    const draw = () => {
      const { player1, player2 } = context.state.players;

      context.clearRect(0, 0, canvas.width, canvas.height);

      context.state.players.player1.y += player1.dy;
      context.state.players.player2.y += player2.dy;

      castSpell({ ...player1 });
      castSpell({ ...player2 });

      // edge collision player1
      if (player1.y >= 480 || player1.y <= 20) {
        context.state.players.player1.dy = -player1.dy;
      }

      // edge collision player2
      if (player2.y >= 480 || player2.y <= 20) {
        context.state.players.player2.dy = -player2.dy;
      }

      // mouse collision player1
      if (
        (context.state.players.player1.x + 20 > mouseX) &&
        (context.state.players.player1.x < mouseX + 10) &&
        (context.state.players.player1.y + 10 > mouseY) &&
        (context.state.players.player1.y < mouseY + 20)
      ) {
        context.state.players.player1.dy = -context.state.players.player1.dy;
      }

      // mouse collision player2
      if (
        (context.state.players.player2.x + 20 > mouseX) &&
        (context.state.players.player2.x < mouseX + 10) &&
        (context.state.players.player2.y + 10 > mouseY) &&
        (context.state.players.player2.y < mouseY + 20)
      ) {
        context.state.players.player2.dy = -context.state.players.player2.dy;
      }

      const getIsHitBySpell = (spellX, spellY, spellRadius, playerX, playerY, playerWidth, playerHeight) => {
        if (
          (spellX >= playerX) &&
          (spellX <= playerX + playerWidth) &&
          (spellY >= playerY) &&
          (spellY <= playerY + playerHeight)
        ) {
          return true;
        }

        const closestX = Math.max(playerX, Math.min(spellX, playerX + playerWidth));
        const closestY = Math.max(playerY, Math.min(spellY, playerY + playerHeight));
        const distance = Math.sqrt(
          Math.pow(closestX - spellX, 2) + Math.pow(closestY - spellY, 2),
        );

        return distance <= spellRadius;
      };

      const moveSpells = (player) => {
        const [playerKey, oponentKey] = player.id === 1 ? ['player1', 'player2'] : ['player2', 'player1'];
        context.state.players[playerKey].magic.activeSpells = context.state.players[playerKey].magic.activeSpells.reduce((acc, activeSpell) => {
          const isPlayerHitBySpell = getIsHitBySpell(
            activeSpell.x,
            activeSpell.y,
            spellRadius,
            context.state.players[oponentKey].x,
            context.state.players[oponentKey].y,
            0,
            Math.PI * 2,
          );

          if (isPlayerHitBySpell) {
            oponentKey === 'player1' ?
              setDamageCounterPlayer1((prevCount) => prevCount + 1) :
              setDamageCounterPlayer2((prevCount) => prevCount + 1)
            context.state.players[oponentKey].hits += 1;
          } else {
            const newColor = player.id === 1 ?
              context.state.players.player1.magic.color :
              context.state.players.player2.magic.color
            const newX = player.id === 1 ?
              activeSpell.x + SPELL_MOVING_SPEED :
              activeSpell.x - SPELL_MOVING_SPEED;
            acc.push({ ...activeSpell, x: newX });
            drawSpell(activeSpell, newColor);
          }

          return acc;
        }, []);
      };

      drawGameField();
      drawPlayer(player1);
      drawPlayer(player2);
      moveSpells(player1);
      moveSpells(player2);

      if (context.state.players.player1.hits >= 3) {
        alert(t('messagesForGameOver.winnerPlayer2'));
      } else if (context.state.players.player2.hits >= 3) {
        alert(t('messagesForGameOver.winnerPlayer1'));
      } else if (context.state.players.player1.hits >= 3 || context.state.players.player2.hits >= 3) {
        alert(t('messagesForGameOver.gameDraw'));
      } else {
        requestAnimationFrame(draw);
      }
    }

    canvas.addEventListener('mousemove', (event) => {
      mouseX = event.offsetX;
      mouseY = event.offsetY;
    });

    draw()
  }, []);

  return (
    <canvas
      id='canvas'
      ref={canvasRef}
      width={CANVAS_STYLE.width}
      height={CANVAS_STYLE.height}
    />
  )
}

export default Canvas;