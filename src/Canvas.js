import { useEffect, useRef, useState } from "react"
import ChangeColor from "./menuChangeColor";
// import changeColor from './menuChangeColor';


const Canvas = props => {
  // pused gamea
  const ref = useRef(null);

  const changePlayer1Color = (color) => {
    const currentCanvas = ref.current;
    if (!currentCanvas) {
      // console.log('no canvas');
    }

    const currentContext = currentCanvas.getContext('2d');
    currentContext.state = { player1Color: color };
    // console.log(currentContext.state);
  };

  useEffect(() => {
    const canvas = ref.current
    const context = canvas.getContext('2d')

    // duelists 
    const players = {
      player1: {
        x: 24,
        y: 26,
        dx: 0,
        dy: 5,
        ballRadius: 20,
      },
      player2: {
        x: canvas.width - 24,
        y: 26,
        dx: 0,
        dy: 5,
        ballRadius: 20,
      }
    }

    // spells
    let magicBallRadius = 10
    let spellsP1 = []; // [{ x: number, y: number }, ...]
    let spellsP2 = []
    let spellCastingSpeedP1 = 500;
    let spellCastingSpeedP2 = 500;
    let lastSpellCastedAtP1 = Date.now();
    let lastSpellCastedAtP2 = Date.now();

    // cursor
    let mouseX = 0;
    let mouseY = 0;

    // field
    const field = () => {
      context.fillStyle = '#e4cce6'
      context.fillRect(0, 0, 1000, 1000)
    }

    // duelistFirst
    const duelistFirst = () => {
      context.beginPath();
      context.arc(players.player1.x, players.player1.y, players.player1.ballRadius, 0, Math.PI * 2);
      context.fillStyle = context.state && context.state.player1Color ? context.state.player1Color : "#0095DD";
      context.fill();
      context.closePath();
    }
  
    // duelistSecond
    const duelistSecond = () => {
      context.beginPath();
      context.arc(players.player2.x, players.player2.y, players.player2.ballRadius, 0, Math.PI * 2);
      context.fillStyle = '#f5c00f' // "#0095DD";
      context.fill();
      context.closePath();
    }

    // magic
    const magic = ({ x, y }) => {
      context.beginPath();
      context.arc(x, y, magicBallRadius, 0, Math.PI * 2);
      context.fillStyle = "#db7b82";
      context.fill();
      context.closePath();
    }

    let countP1 = 0
    let countP2 = 0

    const getCanCastSpellP1 = () => Date.now() - spellCastingSpeedP1 >= lastSpellCastedAtP1;
    const getCanCastSpellP2 = () => Date.now() - spellCastingSpeedP2 >= lastSpellCastedAtP2;

    // start game
    const draw = () => {
      // console.log('isPaused', context.state?.isPaused);

      context.clearRect(0, 0, canvas.width, canvas.height)

      // edge collision player1
      players.player1.y += players.player1.dy;
      if (getCanCastSpellP1()) {
        // console.log('getCanCastSpellP1');
        lastSpellCastedAtP1 = Date.now();
        spellsP1.push({ x: players.player1.x, y: players.player1.y });
      }

      if (players.player1.y + 50 >= 535 || players.player1.y <= 30) {
        players.player1.dy = -players.player1.dy;
      }
      // edge collision player2
      players.player2.y += players.player2.dy;
      if (getCanCastSpellP2()) {
        lastSpellCastedAtP2 = Date.now();
        spellsP2.push({ x: players.player2.x, y: players.player2.y });
      }

      if (players.player2.y + 50 >= 535 || players.player2.y <= 30) {
        players.player2.dy = -players.player2.dy;
      }
      // mouse collision player1
      if (
        players.player1.x + 20 > mouseX &&
        players.player1.x < mouseX + 10 &&
        players.player1.y + 10 > mouseY &&
        players.player1.y < mouseY + 20
      ) {
        players.player1.dy = -players.player1.dy;
      }
      // mouse collision player2
      if (
        players.player2.x + 20 > mouseX &&
        players.player2.x < mouseX + 10 &&
        players.player2.y + 10 > mouseY &&
        players.player2.y < mouseY + 20
      ) {
        players.player2.dy = -players.player2.dy;
      }

      // spell collision 
      const isSpellCollision = (spellX, spellY, spellRadius, playerX, playerY, playerWidth, playerHeight ) => {
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
            Math.pow(closestX - spellX, 2) + Math.pow(closestY - spellY, 2)
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

      field()
      duelistFirst()
      duelistSecond()
      spellsP1 = spellsP1.map(spell => ({ ...spell, x: spell.x + 5 }));
      spellsP1.forEach((spell) => {
        if (isSpellCollision(spell.x, spell.y, magicBallRadius, players.player2.x, players.player2.y, 0, Math.PI * 2)) {
          spell.x = 0
          spell.y = 0
          countP1 += 1
          
          console.log('p1', countP1)
        } else {
          magic(spell)
        }
      }); // TODO: combine with spells.map(...)
      spellsP2 = spellsP2.map(spell => ({ ...spell, x: spell.x - 5 }));
      spellsP2.forEach((spell) => {
        if (isSpellCollision(spell.x, spell.y, magicBallRadius, players.player1.x, players.player1.y, 0, Math.PI * 2)) {
          spell.x = 0
          spell.y = 0
          countP2 += 1

          console.log('p2', countP2)
        } else {
          magic(spell)
        }
      });
      // winner
      if (countP1 > 2) {
        console.log(`Winner Player 1`)
      } else if (countP2 > 2) {
        console.log(`Winner Player 2`)
      } else {
        requestAnimationFrame(draw);
      }
      // if (!context.state?.isPaused) {
      // }
      // canvas.addEventListener('click', handleClick);
    
    }
    canvas.addEventListener('mousemove', (event) => {
      mouseX = event.offsetX;
      mouseY = event.offsetY;
      // console.log('mouseX', event.offsetX)
      // console.log('mouseY', event.offsetY)
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
      <canvas id='canvas' ref={ref} {...props} />
    </div>
  )
}

export default Canvas