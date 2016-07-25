const GAME_STATE = (function() {
  const canvas = document.getElementById('gameboard');
  const scoreBoard = document.querySelector('.scoreboard');
  const highscoreLabel = document.querySelector('.highscore');

  canvas.width = 800;
  canvas.height = 600;

  const ctx = canvas.getContext('2d');
  const gameBoardHeight = canvas.height;
  const gameBoardWidth = canvas.width;
  let player;
  let snake;
  let snakeHead;
  let apple;

  function init() {
    definePlayerProperties();
    defineSnakeProperties();
    defineAppleProperties();
    update();
    displayGameboard();
    bindEvents();
  }

  function dispose() {
    unbindEvents();
    canvas.style.display = 'none';
    GAME.init();
  }

  function displayGameboard() {
    canvas.style.display = 'block';
  }

  function definePlayerProperties() {
    player = {
      points: 0,
      name: '',
      isSaved: false
    };
  }

  function defineSnakeProperties() {
   snake = {
      body: [{
        x: 60,
        y: 60,
        color:'red',
        lastPosX: null,
        lastPosY: null
      }],
      direction: 'right',
      blockSize: 20
    };
    snakeHead = snake.body[0];

    for( let i = 0; i < 10; i++ ) {
      snake.body.push({ color:'blue' });
    }
  }

  function defineAppleProperties() {
    apple = {
      x: Math.floor( Math.random() * gameBoardWidth ),
      y: Math.floor( Math.random() * gameBoardHeight ),
      color: 'red',
      isReachable: false,
      isOutsideSnakeBody: function() {
        snake.body.forEach( (bodySegment) => {
          if( ( bodySegment.x === this.x ) && ( bodySegment.y === this.y ) ) {
            return false;
          }
        });
        return true;
      },
      setValidPosition: function() {
        while( this.isReachable === false ){
          if( (( this.x % snake.blockSize === 0 ) && ( this.y % snake.blockSize === 0 )) && this.isOutsideSnakeBody() ) {
            this.isReachable = true;
          }
          else {
            this.x =  Math.floor( Math.random() * gameBoardWidth );
            this.y = Math.floor( Math.random() * gameBoardHeight );
          }
        }
      }
    };
    apple.setValidPosition();
  }

  function handleInput( event ) {
    if(snake.direction === 'right' && event.keyCode === 37) {
      return;
    }
    else if(snake.direction === 'left' && event.keyCode === 39) {
      return;
    }
    else if(snake.direction === 'up' && event.keyCode === 40) {
      return;
    }
    else if(snake.direction === 'down' && event.keyCode === 38) {
      return;
    }

    switch ( event.keyCode ) {
      case 38:  /* Up arrow was pressed */
        snake.direction = 'up';
      break;
      case 40:  /* Down arrow was pressed */
        snake.direction = 'down';
      break;
      case 37:  /* Left arrow was pressed */
        snake.direction = 'left';
      break;
      case 39:  /* Right arrow was pressed */
        snake.direction = 'right';
      break;
      }
  }

  function update() {
    calculateSnakePosition();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.body.forEach( draw );
    draw(apple);
    drawGrid();
    displayScore();
    move();
    checkForCollisions();
  }

  function draw( o ) {
    if( o.x != undefined || o.x != null ) {
      ctx.beginPath();
      ctx.fillStyle = o.color;
      ctx.fillRect( o.x, o.y, snake.blockSize, snake.blockSize );
      ctx.closePath();
    }
  }

  function drawGrid() {
  for( let y = snake.blockSize; y < 600; y += snake.blockSize ) {
      ctx.beginPath();
      ctx.moveTo( 0, y );
      ctx.lineTo( 800, y );
      ctx.stroke();
    }
    for( let x = snake.blockSize; x < 800; x += snake.blockSize ) {
      ctx.beginPath();
      ctx.moveTo( x, 0 );
      ctx.lineTo( x, 600 );
      ctx.stroke();
    }
  }

  function move() {
    switch ( snake.direction ) {
      case 'left':
        snakeHead.x -= snake.blockSize;
        break;
      case 'right':
        snakeHead.x += snake.blockSize;
        break;
      case 'down':
        snakeHead.y += snake.blockSize;
        break;
      case 'up':
        snakeHead.y -= snake.blockSize;
        break;
    }
  }


  function displayScore() {
    scoreBoard.innerHTML = 'Points: ' + player.points;

    if( localStorage.getItem('highscores') ) {
      let storageHighscoresItemsArr = [ ];
      let storageHighscoresItems = JSON.parse(localStorage.getItem('highscores'));
      storageHighscoresItems.forEach( ( item ) => {
        storageHighscoresItemsArr.push( item.score );
      });

      let highscore = Math.max( ...storageHighscoresItemsArr );
      highscoreLabel.innerHTML = 'Highscore: ' + highscore;
    }
  }

  function calculateSnakePosition() {
    for(let i = 1; i < snake.body.length; i++) {
      snake.body[i].x = snake.body[i - 1].lastPosX;
      snake.body[i].y = snake.body[i - 1].lastPosY;

      snake.body[i - 1].lastPosX = snake.body[i - 1].x;
      snake.body[i - 1].lastPosY = snake.body[i - 1].y;
    }
  }

  function checkForCollisions() {
    if( snakeHead.x >= gameBoardWidth ) {
      snakeHead.x = 0;
    }
    else if( snakeHead.x <= -10 ) {
      snakeHead.x = gameBoardWidth;
    }
    else if( snakeHead.y <= -10 ) {
      snakeHead.y = gameBoardHeight;
    }
    else if( snakeHead.y >= gameBoardHeight ) {
      snakeHead.y = 0;
    }

    if(( snakeHead.x === apple.x ) && ( snakeHead.y === apple.y )) {
        player.points += 10;
        defineAppleProperties();
        snake.body.push( {color:'blue' });
    }

    for( let i = 1; i < snake.body.length; i++ ) {
    if(( snakeHead.x === snake.body[i].x ) && ( snakeHead.y === snake.body[i].y )) {
      GAME.setState('GAMEOVER');
      dispose();
    }
  }
  }

  function bindEvents() {
    addEventListener( 'keydown', event => handleInput( event ), true );
  }

  function unbindEvents() {
    removeEventListener( 'keydown', handleInput, true );
  }

  function getPlayer() {
    return player;
  }

  return {
    init: init,
    update: update,
    getPlayer: getPlayer
  };
})();
