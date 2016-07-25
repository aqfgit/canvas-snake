const GAMEOVER_STATE = (function() {
  let restartBtn = document.getElementById('restart'),
    gameOverScreen = document.querySelector('.gameover-screen'),
    finalScoreLabel = document.querySelector('.final-score'),
    playerNameInput = document.querySelector('.player-name'),
    highscoreBoardBtn = document.getElementById('highscores-btn');

  function init() {
    bindEvents();
    gameOverScreen.style.display = 'block';
    finalScoreLabel.innerHTML = 'Your score: ' + GAME_STATE.getPlayer().points;
  }

  function dispose() {
    gameOverScreen.style.display = 'none';
    savePlayerToStorage();
    unbindEvents();
    GAME.init();
  }

  let savePlayerToStorage = function() {
    if( GAME_STATE.getPlayer().isSaved === false ) {
      GAME_STATE.getPlayer().isSaved = true;
      GAME_STATE.getPlayer().name = playerNameInput.value;
      let highscores = [];
      if( localStorage.getItem('highscores') ) {
        highscores = highscores.concat( JSON.parse( localStorage.getItem('highscores') ) );
      }
      highscores.push({ name: GAME_STATE.getPlayer().name, score: GAME_STATE.getPlayer().points });
      localStorage.setItem( 'highscores', JSON.stringify(highscores) );
    }
  };

  function bindEvents() {
    restartBtn.addEventListener( 'click', restartGame, false );
    highscoreBoardBtn.addEventListener('click', showHighscores, false );
  }

  function unbindEvents() {
    restartBtn.removeEventListener( 'click', restartGame, false );
    highscoreBoardBtn.removeEventListener('click', showHighscores, false );
  }

  function restartGame() {
    GAME.setState('GAME');
    dispose();
  }

  function showHighscores() {
    GAME.setState('HIGHSCORES');
    dispose();
  }

  return {
    init: init
  };
})();
