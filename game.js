(function () {


  var stage = ""; // stage do jogo
  var output; // mensagens de informação

  //variaveis globais para o mapa
  var stageWidth;
  var stageHeigth;
  //
  //código dos personagens de jogo
  const character = {
    EMPTY: -1,
    FLOOR: 0,
    WALL: 1,
    STAIRE: 2,
    STAIRS: 3,
    ICESTONE: 4,
    KEY: 5,
    STONELOCK: 6,
    DOORLOCK: 7,
    QUESTION: 8,
    BONES: 9,
    HERO: 10,
    ENEMY: 11
  }
  //
  var mapArray;
  var mapNumber = 0;
  //hero matrix stores values around the hero 3x3 array
  var heroMatrix;
  var enemyMatrix;
  //variavel para guardar onde esta a personagem
  var playerColumn;
  var playerRow;
  var enemyColumn;
  var enemyRow;
  var enemy2Column;
  var enemy2Row;
  //info panel vars
  var questNumber = 0;

  var keys = 0;
  var gameMessage = "Unlock the door";
  var bones = 0;
  //tamanho de cada celula
  const SIZE = 32;
  var COLUMNS;
  let ROWS;
  //codigo das teclas
  const teclado = {
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40,
    SPACE: 32,
    ESC: 27,
    ENTER: 13,
    LSHIFT: 16,
    RSHIFT: 16,
    LALT: 18,
    LCTRL: 17,
    KPAD_PLUS: 107,
    KPAD_MINUS: 109
  };
  //sound variables
  var soundsSRC = [
    "sounds/background.mp3",
    "sounds/death.mp3",
    "sounds/fight.mp3",
    "sounds/score.mp3",
    "sounds/success.mp3",
    "sounds/quest.mp3"
  ]
  var silenceSound = false;
  var backgroundSound;
  var deathSound;
  var fightSound;
  var scoreSound;
  var successSound;
  var questSound;

  var silenceButton;
  // function to load sounds
  function sound(src) {
    this.sound = document.createElement("audio");
    let idName = (src.slice(7)).slice(0, this.length - 4);
    this.sound.setAttribute("id", idName);
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);

    this.play = function () {
      this.sound.play();
    }
    this.stop = function () {
      this.sound.pause();
    }
  }
  function forceInstance() {
    backgroundSound = document.getElementById('background');
    backgroundSound.loop = true;
    deathSound = document.getElementById('death');
    fightSound = document.getElementById('fight');
    scoreSound = document.getElementById('score');
    successSound = document.getElementById('success');
    questSound = document.getElementById('quest');

    silenceButton = document.getElementById("gameOptions");

  }

  window.addEventListener("load", init, false);

  function init() {
    //init stage and info panel
    stage = document.querySelector("#stage");
    output = document.querySelector("#infoPanel");
    firstTime = true;
    stageWidth = stage.clientWidth;
    stageHeigth = stage.clientHeight;

    //initialize sounds
    soundsSRC.forEach(element => {
      sound(element);
    });

    forceInstance();
    backgroundSound.play();
    //  daw map array
    //initialize game variables
    constructObstacleArray();

    //initialize map
    render();

    window.addEventListener("keydown", keydownHandler);

    silenceButton.addEventListener("click", soundConfiguration);
  }

  //function that stores the map 
  //then assign it to global vars
  function findGameObjects() {
    resetVariables();
    for (let row = 0; row < ROWS; row++) {
      for (let column = 0; column < COLUMNS; column++) {
        //store Hero Position
        if (mapArray[mapNumber][row][column] === character.HERO) {
          playerColumn = column;
          playerRow = row;
        }
        if (mapArray[mapNumber][row][column] === character.ENEMY) {
          if (enemyColumn === undefined) {
            enemyColumn = column;
            enemyRow = row;
          }
          else if (enemy2Column === undefined) {
            enemy2Column = column;
            enemy2Row = row;
          }
        }
        if (mapArray[mapNumber][row][column] === character.STONELOCK) {
          stoneLockCol = column;
          stoneLockRow = row;
        }
      }
    }
    console.log(enemy2Row);
  }

  function render() {
    //removing stage objects / Reset
    while (stage.hasChildNodes()) {
      stage.removeChild(stage.firstChild);
    }
    
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        //var for the cell
        let cell = document.createElement("div");
        cell.setAttribute("class", "cell");
        stage.appendChild(cell);

        let cell2 = document.createElement("div");

        switch (mapArray[mapNumber][row][col]) {
         
          case character.HERO:
            switch (event.keyCode) {
              case teclado.DOWN: cell2.setAttribute("class", "cell actor down animated walk ");
                break;
              case teclado.RIGHT: cell2.setAttribute("class", "cell actor right animated walk ");
                break;
              case teclado.LEFT: cell2.setAttribute("class", "cell actor left animated walk ");
                break;
              default:
                cell2.setAttribute("class", "cell actor animated walk");
                break;
            }
            stage.appendChild(cell2);
            break;

          case character.QUESTION:
            cell2.setAttribute("class", "cell question animated blink");
            stage.appendChild(cell2);
            break;
          case character.KEY:
            cell2.setAttribute("class", "cell key");
            questNumber === 2 || questNumber === 1 && mapNumber === 1 ?
              stage.appendChild(cell2)
              : cell.classList.add('floor'); break;

          case character.ENEMY:
            cell2.setAttribute("class", "cell enemy animated walk");
            stage.appendChild(cell2);
            break;
          case character.FLOOR: cell.classList.add('floor'); break;
          case character.WALL: cell.classList.add('wall'); break;
          case character.STAIRE:
            cell2.setAttribute("class", "cell stairsE");
            stage.appendChild(cell2);
            break;
          case character.STAIRS:
            cell2.setAttribute("class", "cell stairsS");
            stage.appendChild(cell2);
            break;
          case character.DOORLOCK: cell.classList.add('doorLock'); break;
          case character.STONELOCK: cell.classList.add('stoneLock'); break;
          case character.ICESTONE:
            cell2.setAttribute("class", "cell iceStone");
            stage.appendChild(cell2);
            break;
          case character.BONES:
            cell2.setAttribute("class", "cell bones");
            questNumber === 1 && mapNumber === 0 || questNumber === 2 && mapNumber === 1 ?
              stage.appendChild(cell2) : cell.classList.add('floor'); break;
        }
        cell.style.top = row * SIZE + "px";
        cell.style.left = col * SIZE + "px";

        cell2.style.top = row * SIZE + "px";
        cell2.style.left = col * SIZE + "px";
      }
    }

    playerColumn != null ? updateHeroMatrix() : null;

    if (enemyRow != null && enemy2Row != null && event.keyCode != teclado.SPACE) {
      updateEnemyMatrix();
      autoMoveEnemy();
    }

    output.innerHTML = gameMessage;
    gameMessageUpdate();
  }
  function gameMessageUpdate(){
    gameMessage = "Keys : " + keys;
    gameMessage += "<br> Bones : " + bones +"</br>";
  }
  function keydownHandler(event) {
    mapArray[mapNumber][playerRow][playerColumn] = character.FLOOR;
    
    switch (event.keyCode) {
      case teclado.UP: if (heroMatrix[0][1] === character.FLOOR || heroMatrix[0][1] === character.KEY
        || heroMatrix[0][1] === character.BONES) {//validações criadas
        if (heroMatrix[0][1] === character.KEY) trade("keys");
        if (heroMatrix[0][1] === character.BONES) trade("bones");

        playerRow--;
      }
        break;
      case teclado.DOWN: if (heroMatrix[2][1] === character.FLOOR || heroMatrix[2][1] === character.KEY || heroMatrix[2][1] === character.BONES) {
        if (heroMatrix[2][1] === character.KEY) trade("keys");
        if (heroMatrix[2][1] === character.BONES) trade("bones");
        playerRow++;
      }
        break;

      case teclado.LEFT: if (heroMatrix[1][0] === character.FLOOR || heroMatrix[1][0] === character.KEY || heroMatrix[1][0] === character.BONES) {
        if (heroMatrix[1][0] === character.KEY) trade("keys");
        if (heroMatrix[1][0] === character.BONES) trade("bones");
        playerColumn--;
      }
        break;

      case teclado.RIGHT: if (heroMatrix[1][2] === character.FLOOR || heroMatrix[1][2] === character.KEY || heroMatrix[1][2] === character.BONES) {
        if (heroMatrix[1][2] === character.KEY) trade("keys");
        if (heroMatrix[1][2] === character.BONES) trade("bones");
        playerColumn++;
      }
        break;

      case teclado.SPACE: {
        verify();

        if (heroMatrix[0][1] === character.QUESTION || heroMatrix[2][1] === character.QUESTION
          || heroMatrix[1][2] === character.QUESTION || heroMatrix[1][0] === character.QUESTION)
          questPicker();

        if (heroMatrix[0][1] === character.STAIRE || heroMatrix[2][1] === character.STAIRE
          || heroMatrix[1][2] === character.STAIRE || heroMatrix[1][0] === character.STAIRE)
          stairsENavigator();

        if (heroMatrix[0][1] === character.STAIRS || heroMatrix[2][1] === character.STAIRS
          || heroMatrix[1][2] === character.STAIRS || heroMatrix[1][0] === character.STAIRS)
          nextLevel();
      }
        break;
    }
    mapArray[mapNumber][playerRow][playerColumn] = character.HERO;
    render();
  }
  function constructObstacleArray() {
    COLUMNS = Math.floor(stageWidth / SIZE);
    ROWS = Math.floor(stageHeigth / SIZE);

    //instancia 3 mapas
    mapArray = new Array(3).fill(0).map(item => new Array(ROWS).fill(0).map(item => (new Array(COLUMNS).fill(0))));
    enemyMatrix = new Array(2).fill(0).map(item => new Array(3).fill(0).map(item => (new Array(3).fill(0))));
    heroMatrix = new Array(3).fill().map(item => (new Array(3).fill(0)));
    contructMaps();
    findGameObjects();

    console.log(mapArray);
  }

  function contructMaps() {
    //map 1
    for (let rowNumb = 0; rowNumb < ROWS; rowNumb++) {// i >>
      for (let colNumb = 0; colNumb < COLUMNS; colNumb++) { //ha qualquer erro as rows estao a ser definidas pelo J e nao I
        //hero on position [0][0]
        if (rowNumb === 2 && colNumb === 2) {
          mapArray[0][rowNumb][colNumb] = character.HERO;
          mapArray[1][rowNumb][colNumb] = character.STAIRS;
        }
        //contruct position of wall
        if (rowNumb === 0 || rowNumb === ROWS - 1 || colNumb === 0 || colNumb === COLUMNS - 1) {
          mapArray[0][rowNumb][colNumb] = character.WALL;
          mapArray[1][rowNumb][colNumb] = character.WALL;
        }
        if (rowNumb === 4 && colNumb < 10
          || rowNumb > 4 && rowNumb < 7 && colNumb === 5 && colNumb < 10
          || rowNumb === 5 && colNumb > 10
          || rowNumb > 5 && colNumb == 9
          || rowNumb === 14 && colNumb < 5
          || rowNumb > 15 && colNumb == 5
          || rowNumb === 6 && colNumb < 8 && colNumb > 5
          || rowNumb > 5 && colNumb === 11
          || rowNumb > 7 && rowNumb < 15 && colNumb === 5
          || rowNumb > 5 && rowNumb < 17 && colNumb === 16
          || rowNumb > 6 && rowNumb < 19 && colNumb === 14
          || rowNumb === 13 && colNumb === 3
          || rowNumb === 12 && colNumb === 3
          || rowNumb === 2 && colNumb < 18 && colNumb > 12 && colNumb != 15
          || rowNumb === 3 && colNumb === 13
          || rowNumb === 3 && colNumb === 16
          || rowNumb === 9 && colNumb < 3 && colNumb > 0
          || rowNumb === 8 && colNumb === 4
          || rowNumb === 11 && colNumb === 3
          || rowNumb === 14 && colNumb === 6
          || rowNumb === 14 && colNumb === 8
          || rowNumb === 1 && colNumb === 4
          || rowNumb === 2 && colNumb > 3 && colNumb < 10) {
          mapArray[0][rowNumb][colNumb] = character.WALL;
          mapArray[1][rowNumb][colNumb] = character.WALL;
        }
        //setting stairsE
        if (rowNumb === 17 && colNumb === 6
          || rowNumb === 12 && colNumb === 13) {
          mapArray[0][rowNumb][colNumb] = character.STAIRE;
          mapArray[1][rowNumb][colNumb] = character.STAIRE;
        }
        //doorlock
        if (rowNumb === 7 && colNumb === 17
          || rowNumb === 14 && colNumb === 7) mapArray[0][rowNumb][colNumb] = character.DOORLOCK;

        if (rowNumb === 3 && colNumb === 4 || rowNumb === 14 && colNumb === 7) mapArray[1][rowNumb][colNumb] = character.DOORLOCK;

        //setting keys
        if (rowNumb === 15 && colNumb === 1 || rowNumb === 13 && colNumb === 1) {
          mapArray[0][rowNumb][colNumb] = character.KEY;
          mapArray[1][rowNumb][colNumb] = character.KEY;
        }
        //setting Interrogations
        if (rowNumb === 13 && colNumb === 4
          || rowNumb === 3 && colNumb === 17) {
          mapArray[0][rowNumb][colNumb] = character.QUESTION;
          mapArray[1][rowNumb][colNumb] = character.QUESTION;
        }
        //setting Ice
        if (rowNumb === 11 && colNumb === 4
          || rowNumb === 4 && colNumb === 16) {
          mapArray[0][rowNumb][colNumb] = character.ICESTONE;
          mapArray[1][rowNumb][colNumb] = character.ICESTONE;

          rowNumb === 11 ? mapArray[1][rowNumb][colNumb] = character.WALL : null;
        }
        if (rowNumb === 14 && colNumb === 4)
          mapArray[1][rowNumb][colNumb] = character.ICESTONE;
        //Setting Enemys
        if (rowNumb === 13 && colNumb === 10
          || rowNumb === 6 && colNumb === 2) {
          mapArray[0][rowNumb][colNumb] = character.ENEMY;
          mapArray[1][rowNumb][colNumb] = character.ENEMY;
        }
        //Setting Bones
        if (rowNumb === 1 && colNumb === 17) {
          mapArray[0][rowNumb][colNumb] = character.BONES;
          mapArray[1][rowNumb][colNumb] = character.BONES;
        }
        //Setting StoneLock
        if (rowNumb === 7 && colNumb === 5) {
          mapArray[0][rowNumb][colNumb] = character.STONELOCK;
          mapArray[1][rowNumb][colNumb] = character.STONELOCK;
        }
        //setting stairsS
        if (rowNumb === 6 && colNumb === 17) {
          mapArray[0][rowNumb][colNumb] = character.STAIRS;
          mapArray[1][rowNumb][colNumb] = character.HERO;
        }
      }
    }
  }

  function updateEnemyMatrix() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (i === 0) {
          if (enemyColumn != null) enemyMatrix[0][i][j] = mapArray[mapNumber][enemyRow - 1][(enemyColumn - 1) + j];
          if (enemy2Column != null) enemyMatrix[1][i][j] = mapArray[mapNumber][enemy2Row - 1][(enemy2Column - 1) + j];
        }
        if (i === 1) {
          if (enemyColumn != null) enemyMatrix[0][i][j] = mapArray[mapNumber][enemyRow][(enemyColumn - 1) + j];
          if (enemy2Column != null) enemyMatrix[1][i][j] = mapArray[mapNumber][enemy2Row][(enemy2Column - 1) + j];
        }
        if (i === 2) {
          if (enemyColumn != null) enemyMatrix[0][i][j] = mapArray[mapNumber][enemyRow + 1][(enemyColumn - 1) + j];
          if (enemy2Column != null) enemyMatrix[1][i][j] = mapArray[mapNumber][enemy2Row + 1][(enemy2Column - 1) + j];
        }
      }
    }

  }
  //function that update the hero location
  function updateHeroMatrix() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (i === 0) heroMatrix[i][j] = mapArray[mapNumber][playerRow - 1][(playerColumn - 1) + j];
        if (i === 1) heroMatrix[i][j] = mapArray[mapNumber][playerRow][(playerColumn - 1) + j];
        if (i === 2) heroMatrix[i][j] = mapArray[mapNumber][playerRow + 1][(playerColumn - 1) + j];
      }
    }
  }
  //function to move enemy if he got nerby spaces
  //AI function
  function autoMoveEnemy() {
    let autoNumb = Math.floor(Math.random() * (4 - 0) + 0);

    switch (autoNumb) {
      case 0: enemyColumn != null ? aiAutoEnemyOne() : null;
        break;
      case 1: enemy2Column != null ? aiAutoEnemyTow() : null;
        break;
      case 2: enemy2Column != null && enemyColumn != null ? aiAutoEnemyThree() : null;
        break;
      case 3: enemy2Column != null && enemyColumn != null ? defaultAiAutoLeft() : null;
        break;
    }
  checkEnemy();
  }
  function aiAutoEnemyOne() {
    mapArray[mapNumber][enemyRow][enemyColumn] = character.FLOOR;
    //check left move
    if (enemyMatrix[0][1][0] === character.FLOOR ||enemyMatrix[0][1][0] === character.HERO) {
      enemyColumn--;
    }
    //check bot move
    else if (enemyMatrix[0][2][1] === character.FLOOR ||enemyMatrix[0][2][1] === character.HERO) {
      enemyRow++;
    }
    //check right move
    else if (enemyMatrix[0][1][2] === character.FLOOR ||enemyMatrix[0][1][2] === character.HERO ) {
      enemyColumn++;
    }
    //check top move
    else if (enemyMatrix[0][0][1] === character.FLOOR ||enemyMatrix[0][0][1] === character.HERO) { /// improve both enemy moving 
      enemyRow--;
    }
    mapArray[mapNumber][enemyRow][enemyColumn] = character.ENEMY;
  }
  function aiAutoEnemyTow() {
    mapArray[mapNumber][enemy2Row][enemy2Column] = character.FLOOR;
    //check  right move
    if (enemyMatrix[1][1][2] === character.FLOOR ||enemyMatrix[1][1][2] === character.HERO) {
      enemy2Column++;
    }
    //check top move
    else if (enemyMatrix[1][0][1] === character.FLOOR ||enemyMatrix[1][0][1] === character.HERO) {
      enemy2Row--;
    }
    // check left move
    else if (enemyMatrix[1][1][0] === character.FLOOR ||enemyMatrix[1][1][0] === character.HERO) {
      enemy2Column--;
    }
    //check bot move
    else if (enemyMatrix[1][2][1] === character.FLOOR ||enemyMatrix[1][2][1] === character.HERO) {
      enemy2Row++;
    }
    mapArray[mapNumber][enemy2Row][enemy2Column] = character.ENEMY;
  }
  function aiAutoEnemyThree() {
    mapArray[mapNumber][enemyRow][enemyColumn] = character.FLOOR;
    //check  right move and top
    if (enemyMatrix[0][1][2] === character.FLOOR && enemyMatrix[0][1][0] === character.FLOOR
      ||enemyMatrix[0][1][2] === character.HERO || enemyMatrix[0][1][0] === character.HERO) {
      enemyColumn++;
    }
    //check left and top
    else if (enemyMatrix[0][1][0] === character.FLOOR && enemyMatrix[0][0][1] === character.FLOOR) {
      enemyMatrix[0][2][1] === character.FLOOR ? enemyRow++ : enemyColumn--;
    }
    mapArray[mapNumber][enemyRow][enemyColumn] = character.ENEMY;

    //enemy 2
    mapArray[mapNumber][enemy2Row][enemy2Column] = character.FLOOR;
    //check  right move and bot
    if (enemyMatrix[1][1][2] === character.FLOOR && enemyMatrix[1][2][1] === character.FLOOR
      ||enemyMatrix[1][1][2] === character.HERO || enemyMatrix[1][2][1] === character.HERO) {
      enemy2Column++;
    }
    //check left and top
    else if (enemyMatrix[1][1][0] === character.FLOOR && enemyMatrix[1][0][1] === character.FLOOR) {
      enemyMatrix[1][2][1] === character.FLOOR ? enemy2Row++ : enemy2Column--;
    }
    mapArray[mapNumber][enemy2Row][enemy2Column] = character.ENEMY;
  }
  function defaultAiAutoLeft() {
    mapArray[mapNumber][enemyRow][enemyColumn] = character.FLOOR;
    //default to chekc if is wall arround player
    if (enemyMatrix[0][0][1] != character.FLOOR && enemyMatrix[0][1][2] != character.FLOOR
      && enemyMatrix[0][2][1] != character.FLOOR) {
      enemyColumn--;
    }
    else if (enemyMatrix[0][1][0] != character.FLOOR && enemyMatrix[0][0][1] != character.FLOOR
      && enemyMatrix[0][2][1] != character.FLOOR) {
      enemyColumn++;
    }
    mapArray[mapNumber][enemyRow][enemyColumn] = character.ENEMY;
    mapArray[mapNumber][enemy2Row][enemy2Column] = character.FLOOR;
    //default to chekc if is wall arround player
    if (enemyMatrix[1][0][1] != character.FLOOR && enemyMatrix[1][1][2] != character.FLOOR
      && enemyMatrix[1][2][1] != character.FLOOR) {
      enemy2Column--;
    }
    else if (enemyMatrix[1][1][0] != character.FLOOR && enemyMatrix[1][0][1] != character.FLOOR
      && enemyMatrix[1][2][1] != character.FLOOR) {
      enemy2Column++;
    }
    mapArray[mapNumber][enemy2Row][enemy2Column] = character.ENEMY;
  }

  function verify() {

    mapArray[mapNumber][playerRow][playerColumn] = character.FLOOR;
    if (heroMatrix[0][1] === character.ICESTONE) {
      playerRow--;
    }
    else if (heroMatrix[2][1] === character.ICESTONE) {
      playerRow++;
    }
    else if (heroMatrix[1][0] === character.ICESTONE) {
      playerColumn--;
    }
    else if (heroMatrix[1][2] === character.ICESTONE) {
      playerColumn++;
    }
    else if (heroMatrix[0][1] === character.STONELOCK) {
      if (bones > 0) {
        playerRow--;
        bones = bones - 1;
      }
    }

    else if (heroMatrix[2][1] === character.STONELOCK) {
      if (bones > 0) {
        playerRow++;
        bones = bones - 1;
      }
    }
    else if (heroMatrix[1][0] === character.STONELOCK) {
      if (bones > 0) {
        playerColumn--;
        bones = bones - 1;
      }
    }
    else if (heroMatrix[2][1] === character.STONELOCK) {
      if (bones > 0) {
        playerColumn++;
        bones = bones - 1;
      }
    }
    else if (heroMatrix[0][1] === character.DOORLOCK) {
      if (keys > 0) {
        playerRow--;
        keys = keys - 1;
      }
    }
    else if (heroMatrix[2][1] === character.DOORLOCK) {
      if (keys > 0) {
        playerRow++;
        keys = keys - 1;
      }
    }
    else if (heroMatrix[1][0] === character.DOORLOCK) {
      if (keys > 0) {
        playerColumn--;
        keys = keys - 1;
      }
    }
    else if (heroMatrix[2][1] === character.DOORLOCK) {
      if (keys > 0) {
        playerColumn++;
        keys = keys - 1;
      }
    }
    questSound.play();
    mapArray[mapNumber][playerRow][playerColumn] = character.HERO;
  }

  function stairsENavigator() {
    //stairs navigator
    if (heroMatrix[0][1] === character.STAIRE
      || heroMatrix[2][1] === character.STAIRE
      || heroMatrix[1][0] === character.STAIRE
      || heroMatrix[1][2] === character.STAIRE) {
      mapArray[mapNumber][playerRow][playerColumn] = character.FLOOR;
      if (playerColumn < 10) {
        playerColumn = 13;
        playerRow = 11;
      }
      else {
        playerColumn = 6;
        playerRow = 18;
      }
      mapArray[mapNumber][playerRow][playerColumn] = character.HERO;
    }
    successSound.play();
  }
  function questPicker() {
    mapArray[mapNumber][playerRow][playerColumn] = character.FLOOR;

    heroMatrix[0][1] === character.QUESTION ? playerRow-- : null;

    heroMatrix[2][1] === character.QUESTION ? playerRow++ : null;

    heroMatrix[1][0] === character.QUESTION ? playerColumn-- : null;

    heroMatrix[1][2] === character.QUESTION ? playerColumn++ : null;

    mapArray[mapNumber][playerRow][playerColumn] = character.HERO;
    questNumber++;
    if (questNumber == 1){
      gameMessage = "<br>"+ " Search for the keys " +"</br>";
      alert(" Check The map !  Search for the keys! ");
    }

    else{
      gameMessage = "<br>"+ " Open the door!! " +"</br>";
      alert(" Now you can hundle it! ");
    }
    questSound.play();
  }

  function trade(character) {
    if (character === "keys") {
      keys++;
    }
    if (character === "bones") {
      bones++;
    }
    console.log(keys);
    scoreSound.play();
  }

  function checkEnemy() {
     if(enemy2Column === playerColumn && enemy2Row === playerRow 
      || enemyColumn === playerColumn &&  enemyRow === playerRow )
    endGame();
    
  }
  function endGame() {
    fightSound.play();
    deathSound.play();

    alert("you lose");
    window.removeEventListener("keydown", keydownHandler, false);
    resetVariables();
  }

  function nextLevel() {
    scoreSound.play();

    //next level
    if (heroMatrix[0][1] === character.STAIRS
      || heroMatrix[2][1] === character.STAIRS
      || heroMatrix[1][0] === character.STAIRS
      || heroMatrix[1][2] === character.STAIRS) {

      while (stage.hasChildNodes()) {
        stage.removeChild(stage.firstChild);
      }

      mapArray.length > mapNumber ? mapNumber++ : mapNumber;
      mapArray.length <= mapNumber ? alert("This is the end!!!") : alert(`Level ${mapNumber + 1}`);

    }

    findGameObjects();
    render();
    //  window.removeEventListener("keydown", keydownHandler, false);
  }

  function soundConfiguration() {

    if (!silenceSound) {
      silenceSound = true;
      backgroundSound.play();
    }
    else {
      silenceSound = false;
      backgroundSound.pause();
    }
  }
  function resetVariables() {
    questNumber = 0;
    enemyColumn = undefined;
    enemyRow = undefined;
    enemy2Column = undefined;
    enemy2Row = undefined;
  }
})();
