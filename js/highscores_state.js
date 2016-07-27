const HIGHSCORES_STATE = (function() {
  const highscoresBoard = document.querySelector('.highscores-board');
  const highscoresList = document.querySelector('.highscores-list');
  const  highscoresReturnBtn = document.getElementById('return-from-highscores');

  function init() {
    highscoresBoard.style.display = 'flex';
    highscoresList.innerHTML = '';
    bindEvents();
    showHighscoresList();
  }

  function dispose() {
    highscoresBoard.style.display = 'none';
    unbindEvents();
    GAME.init();
  }

  function showHighscoresList() {
    let storageHighscoresItems = JSON.parse( localStorage.getItem('highscores') );
    let storageHighscoresItemsArr = [];
    for ( item of storageHighscoresItems ) {
      storageHighscoresItemsArr.push( item );
    }

    storageHighscoresItemsArr.sort(function ( a, b ) {
      if (a.score > b.score) {
        return 1;
      }
      if (a.score < b.score) {
        return -1;
      }
      return 0;
    });
    storageHighscoresItemsArr.reverse();

      for( let i = 0; i < 10; i++ ) {
          if( storageHighscoresItemsArr[i] ) {
            let li = document.createElement('li');
            highscoresList.appendChild( li );
            li.innerHTML = ( storageHighscoresItemsArr[i].name || 'Noname' ) +
             ' - ' + storageHighscoresItemsArr[i].score;
        }
      }
  }

  function bindEvents() {
    highscoresReturnBtn.addEventListener( 'click', goBack, false );
  }

  function unbindEvents() {
    highscoresReturnBtn.removeEventListener( 'click', goBack, false );
  }

  function goBack() {
    GAME.setState('GAMEOVER');
    dispose();
  }

  return {
    init: init
  };

})();
