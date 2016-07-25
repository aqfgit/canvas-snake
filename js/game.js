const GAME = (function() {
  let state = 'GAME';

  function init() {
    if( state === 'GAME' ) {
      GAME_STATE.init();
    }

    else if( state === 'GAMEOVER') {
      GAMEOVER_STATE.init();
    }
    else if( state === 'HIGHSCORES' ) {
      HIGHSCORES_STATE.init();
    }
  }

  function setState( st ) {
    state = st;
  }

  function getState() {
    return state;
  }

  function loop() {
    if( state === 'GAME' ) {
      GAME_STATE.update();
    }
     setTimeout( loop, 50 );
   }

  return {
    getState: getState,
    setState: setState,
    loop: loop,
    init: init
  };

})();

GAME.init();
GAME.loop();
