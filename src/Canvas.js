import { useEffect, useRef } from "react"
import ChangeColor from "./menuChangeColor";
// import changeColor from './menuChangeColor';

const CANVAS_SIZES = { width: 800, height: 500 };

const PLAYER_SIDE_GAP = 30;

export const PLAYER_MOVING_SPEED = 1.5;
export const SPELL_MOVING_SPEED = 3.5;
export const DEFAULT_SPELL_CASTING_RATE = 5000;

const DEFAULT_SPELL = {
  castingRate: DEFAULT_SPELL_CASTING_RATE,
  lastCastedAt: Date.now(),
  activeSpells: [],
};

const DEFAULT_PLAYER = {
  id: 0,

  // style
  radius: 20,
  color: '#0095DD',

  // position
  x: 0,
  y: 30,
  dy: PLAYER_MOVING_SPEED,
};

const Canvas = () => {
  const canvasRef = useRef(null);

  const changePlayer1Color = (color) => {
    const currentCanvas = canvasRef.current;
    if (!currentCanvas) {
      // console.log('no canvas');
    }

    const currentContext = currentCanvas.getContext('2d');
    currentContext.state = { player1Color: color };
    // console.log(currentContext.state);
  };

  const initGame = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.state = {};

    context.state.players = {
      player1: {
        ...DEFAULT_PLAYER,
        id: 1,
        x: PLAYER_SIDE_GAP,
        color: '#0095DD',
        magic: { ...DEFAULT_SPELL },
      },
      player2: {
        ...DEFAULT_PLAYER,
        id: 2,
        x: canvas.width - PLAYER_SIDE_GAP,
        color: '#f5c00f',
        magic: { ...DEFAULT_SPELL },
      },
    };

    return { canvas, context };
  };

  useEffect(() => {
    const { canvas, context } = initGame();

    // spells
    let magicradius = 10;

    // cursor
    let mouseX = 0;
    let mouseY = 0;

    // field
    const drawGameField = () => {
      context.fillStyle = '#e4cce6';
      context.fillRect(0, 0, CANVAS_SIZES.width, CANVAS_SIZES.height);
    };

    const drawPlayer = (player) => {
      context.beginPath();
      context.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      context.fillStyle = player.color;
      context.fill();
      context.closePath();
    };

    const drawSpell = ({ x, y }) => {
      context.beginPath();
      context.arc(x, y, magicradius, 0, Math.PI * 2);
      context.fillStyle = "#db7b82";
      context.fill();
      context.closePath();
    };

    let countP1 = 0
    let countP2 = 0

    const castSpell = (player) => {
      const canCastSpell = Date.now() - player.magic.castingRate >= player.magic.lastCastedAt;
      if (!canCastSpell) {
        return;
      }

      const playerKey = `player${player.id}`;
      console.log({ ...player, playerKey })

      context.state.players[playerKey].magic.lastCastedAt = Date.now();
      context.state.players[playerKey].magic.activeSpells.push({ x: player.x, y: player.y });
    };

    // start game
    const draw = () => {
      const { player1, player2 } = context.state.players;

      context.clearRect(0, 0, canvas.width, canvas.height)

      context.state.players.player1.y += player1.dy;
      context.state.players.player2.y += player2.dy;

      castSpell({ ...player1 });
      castSpell({ ...player2 });

      // TODO: remove clones
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
        context.state.players.player1.x + 20 > mouseX &&
        context.state.players.player1.x < mouseX + 10 &&
        context.state.players.player1.y + 10 > mouseY &&
        context.state.players.player1.y < mouseY + 20
      ) {
        context.state.players.player1.dy = -context.state.players.player1.dy;
      }

      // mouse collision player2
      if (
        context.state.players.player2.x + 20 > mouseX &&
        context.state.players.player2.x < mouseX + 10 &&
        context.state.players.player2.y + 10 > mouseY &&
        context.state.players.player2.y < mouseY + 20
      ) {
        context.state.players.player2.dy = -context.state.players.player2.dy;
      }

      // spell collision 
      const getIsHitBySpell = (spellX, spellY, spellRadius, playerX, playerY, playerWidth, playerHeight ) => {
        if (
          spellX >= playerX &&
          spellX <= playerX + playerWidth &&
          spellY >= playerY &&
          spellY <= playerY + playerHeight
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

      // change color
      const handleClick = (event) => {
        context.state = { test: 'abcd' };
        // const rect = ref.current.getBoundingClientRect();
        // if (mouseX === players.player1.x || mouseY === players.player2.y ) {
        // }

        //   const colorX = event.clientX - rect.left;
        //   const colorY = event.clientY - rect.top;
        //   // Проверяем, находится ли клик внутри прямоугольника
        // if (colorX >= 50 && colorX <= 150 && colorY >= 50 && colorY <= 150) {
        //   // Изменяем цвет фигуры на случайный цвет
        // }
      };

      drawGameField();
      drawPlayer(player1);
      drawPlayer(player2);

      const moveSpells = (player) => {
        const [playerKey, oponentKey] = player.id === 1 ? ['player1', 'player2'] : ['player2', 'player1'];
        context.state.players[playerKey].magic.activeSpells = context.state.players[playerKey].magic.activeSpells.reduce((acc, activeSpell) => {
          const isPlayerHitBySpell = getIsHitBySpell(
            activeSpell.x,
            activeSpell.y,
            magicradius,
            context.state.players[oponentKey].x,
            context.state.players[oponentKey].y,
            0,
            Math.PI * 2,
          );

          if (isPlayerHitBySpell) {
            countP1 += 1;
          } else {
            const newX = player.id === 1 ? activeSpell.x + SPELL_MOVING_SPEED : activeSpell.x - SPELL_MOVING_SPEED;
            acc.push({ ...activeSpell, x: newX });
            drawSpell(activeSpell);
          }

          return acc;
        }, []);
      };

      moveSpells(player1);
      moveSpells(player2);

      // TODO: possibility of a tie?
      // TODO: convert to a switch
      // winner
      if (countP1 > 2) {
        console.log(`Winner Player 1`)
      } else if (countP2 > 2) {
        console.log(`Winner Player 2`)
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
    <div>
      <div>
        <button className="p1" onClick={() => changePlayer1Color('#FFFFFF')}>player 1</button>
      </div>
      <div>
        <button className="p2" onClick={() => <ChangeColor />}>player 2</button>
      </div>
        {/* <changeColor /> */}
      <canvas 
        id='canvas'
        ref={canvasRef}
        width={CANVAS_SIZES.width}
        height={CANVAS_SIZES.height}
      />
    </div>
  )
}

export default Canvas;