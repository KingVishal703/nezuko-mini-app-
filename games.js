// 🐍 Snake Game
function startSnakeGame() {
  const gameArea = document.getElementById("gameArea");
  gameArea.innerHTML = `<canvas id="snake" width="300" height="300"></canvas>`;

  const canvas = document.getElementById("snake");
  const ctx = canvas.getContext("2d");

  let snake = [{x:150,y:150}];
  let food = {x:100,y:100};
  let dx = 10, dy = 0;

  document.onkeydown = e => {
    if(e.key=="ArrowUp"){dx=0;dy=-10;}
    if(e.key=="ArrowDown"){dx=0;dy=10;}
    if(e.key=="ArrowLeft"){dx=-10;dy=0;}
    if(e.key=="ArrowRight"){dx=10;dy=0;}
  };

  function draw(){
    ctx.clearRect(0,0,300,300);

    snake.unshift({x:snake[0].x+dx,y:snake[0].y+dy});

    if(snake[0].x==food.x && snake[0].y==food.y){
      food.x=Math.floor(Math.random()*30)*10;
      food.y=Math.floor(Math.random()*30)*10;
      addMoney(CONFIG.earnings.gameWin);
    } else {
      snake.pop();
    }

    ctx.fillStyle="green";
    snake.forEach(s=>ctx.fillRect(s.x,s.y,10,10));

    ctx.fillStyle="red";
    ctx.fillRect(food.x,food.y,10,10);
  }

  setInterval(draw,100);
}

// 🧠 Memory Game
function startMemoryGame(){
  const gameArea = document.getElementById("gameArea");

  let nums = [1,2,3,4];
  nums.sort(()=>Math.random()-0.5);

  gameArea.innerHTML = nums.map(n=>`<button onclick="check(${n})">${n}</button>`).join("");

  let correct = 1;

  window.check = (n)=>{
    if(n==correct){
      correct++;
      if(correct>4){
        alert("Win!");
        addMoney(CONFIG.earnings.gameWin);
      }
    } else {
      alert("Wrong!");
    }
  };
}
