import { useEffect, useRef, useState } from "react"

const Canvas = props => {
  const ref = useRef();

  const [color, setColor] = useState('#0095DD');

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
      }
    }
    // let x = 24;
    // let y = 26;
    // let dx = 0;
    // let dy = 5;
    // let playerBallRadius = 20
    
    // spells
    let magicBallRadius = 10
    let spells = []; // [{ x: number, y: number }, ...]
    let spellCastingSpeed = 1500;
    let lastSpellCastedAt = Date.now();

    // cursor
    let mouseX = 0;
    let mouseY = 0;

    // field
    const field = () =>  {
      context.fillStyle = '#e4cce6'
      context.fillRect(0,0,1000,1000)
    }

    // ball
    const ball = () => {
      context.beginPath();
      context.arc(players.player1.x, players.player1.y, players.player1.ballRadius, 0, Math.PI*2);
      context.fillStyle = color // "#0095DD";
      context.fill();
      context.closePath();
    }
    
    // magic
    const magic = ({ x, y }) => {
      context.beginPath();
      context.arc(x, y, magicBallRadius, 0, Math.PI*2);
      context.fillStyle = "#db7b82";
      context.fill();
      context.closePath();
    }

    const getCanCastSpell = () => Date.now() - spellCastingSpeed >= lastSpellCastedAt;

    // start game
    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)

      // edge collision
      players.player1.y += players.player1.dy;
      if (getCanCastSpell()) {
        lastSpellCastedAt = Date.now();
        spells.push({ x: players.player1.x, y: players.player1.y });
      }

      if (players.player1.y + 50 >= 535 || players.player1.y <= 30) {
        players.player1.dy = -players.player1.dy; 
      }
      // mouse collision
      if (
        players.player1.x + 20 > mouseX &&
        players.player1.x < mouseX + 10 &&
        players.player1.y + 10 > mouseY &&
        players.player1.y < mouseY + 20
      ) {
        players.player1.dy = -players.player1.dy;
      }
      // magic move
      
      field()
      ball()
      spells = spells.map(spell => ({ ...spell, x: spell.x + 5 }));
      spells.forEach(magic); // TODO: combine with spells.map(...)
        
      requestAnimationFrame(draw);
    }
    
    canvas.addEventListener('mousemove', (event) => {
      mouseX = event.offsetX;
      mouseY = event.offsetY;
      // console.log('mouseX', event.offsetX)
      // console.log('mouseY', event.offsetY)
    });

    draw()
  }, [color])

  return (
    <div>
      <div>
        <input type="color" id="head" name="head" value="#0095DD" />
        <label for="head">  count</label>
        <button onClick={() => setColor('#FFFFFF')}> cccc</button>
      </div>
      <div>
        <input type="color" id="body" name="body" value="#f6b73c" />
        <label for="body">  count</label>
      </div>
      <canvas ref={ref} {...props} />
    </div>
  )
}

export default Canvas