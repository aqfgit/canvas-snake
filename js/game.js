const GAME = (function() {
  let state = 'GAME';

  const fps = {
    framesToSkip: 2,
    counter: 0
  };

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
    if ( fps.counter < fps.framesToSkip ) {
        fps.counter++;
        requestAnimationFrame( loop );
        return;
    }

    if( state === 'GAME' ) {
      GAME_STATE.update();
    }

    fps.counter = 0;
    requestAnimationFrame( loop );
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
