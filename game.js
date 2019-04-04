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

  var mapArray;

  //hero matrix stores values around the hero 3x3 array
  var heroMatrix;
  var firstTime;
  //variavel para guardar onde esta a personagem
  var playerColumn;
  var playerRow;

  //info panel vars
  var keys = 0;
  var gameMessage = "Unlock the door";
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

  window.addEventListener("load", init, false);

  function init() {
    //init stage and info panel
    stage = document.querySelector("#stage");
    output = document.querySelector("#infoPanel");
    firstTime = true;
    stageWidth = document.getElementById('stage').clientWidth;
    stageHeigth = document.getElementById('stage').clientHeight;
    console.log("Stage width and heigth " + stageWidth + "  ," + stageHeigth);
    firstTime = false;
    //contrução de um array para o mapa, de modo a inserir bonecos 
    //  daw map array
    //initialize game variables
    constructObstacleArray();

    //initialize map
    render();

    window.addEventListener("keydown", keydownHandler);
  }
  //function that stores the map 
  //then assign it to global vars
  function findGameObjects() {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        //store Hero Position
        if (mapArray[row][col] === character.HERO) {
          playerColumn = col;
          console.log(`playercol ${playerColumn}`);
          playerRow = row;
        }
        if (mapArray[row][col] === character.KEY) {
          keyCol = col;
          keyRow = row;
        }
        if (mapArray[row][col] === character.DOORLOCK) {
          doorCol = col;
          doorRow = row;
        }
        //...
      }
    }

  }
  function render() {
    //removing stage objects / Reset
    while (stage.hasChildNodes()) {
      stage.removeChild(stage.firstChild);
    }

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        //var for the cell
        let cell = document.createElement("img");
        cell.setAttribute("class", "cell");
        stage.appendChild(cell);

        switch (mapArray[row][col]) {
          case character.HERO: cell.className += ' actor'; break;
          case character.QUESTION: cell.className += ' question'; break;
          case character.KEY: cell.className += ' key'; break;
          case character.ENEMY: cell.className += ' enemy'; break;
          case character.floor: cell.className += ' floor'; break;
          case character.WALL: cell.className += ' wall'; break;
          case character.STAIRE: cell.className += ' stairsE'; break;
          case character.STAIRE: cell.className += ' stairsE'; break;
          case character.STAIRS: cell.className += ' stairsS'; break;
          case character.DOORLOCK: cell.className += ' doorLock'; break;
          case character.STONELOCK: cell.className += ' stoneLock'; break;
          case character.ICESTONE: cell.className += ' iceStone'; break;

        }
        cell.style.top = row * SIZE + "px";
        cell.style.left = col * SIZE + "px";
      }

    }
    updateHeroMatrix();

    output.innerHTML = gameMessage;
    gameMessage = "Keys : " + keys;
  }


  function constructObstacleArray() {
    console.log("contructObstacleArray;");
    COLUMNS = Math.floor(stageWidth / SIZE);
    ROWS = Math.floor(stageHeigth / SIZE);
    mapArray = new Array(ROWS).fill(0).map(item => (new Array(COLUMNS).fill(0)));

    for (let rowNumb = 0; rowNumb < ROWS; rowNumb++) {// i >>
      for (let colNumb = 0; colNumb < COLUMNS; colNumb++) { //ha qualquer erro as rows estao a ser definidas pelo J e nao I
        //hero on position [0][0]
        if (rowNumb === 2 && colNumb === 1) {
          mapArray[rowNumb][colNumb] = 10;
        }
        //contruct position of walls
        if (rowNumb === 0 || rowNumb === mapArray[0].length || colNumb === 0 || colNumb === COLUMNS - 1) {
          mapArray[rowNumb][colNumb] = 1;
        }
        if (rowNumb === 4 && colNumb < 10
          || rowNumb > 4 && rowNumb < 7 && colNumb === 5 && colNumb < 10
          || rowNumb === 5 && colNumb > 10
          || rowNumb > 5 && colNumb == 9
          || rowNumb === 14 && colNumb < 5
          || rowNumb > 15 && colNumb == 5
          || rowNumb === 6 && colNumb < 8 && colNumb > 5
          || colNumb === 11 && rowNumb > 5 && rowNumb < ROWS - 2
          || rowNumb > 7 && rowNumb < 15 && colNumb === 5
          || colNumb === 16  && rowNumb > 5 && rowNumb < 17
          || colNumb === 14  && rowNumb > 6 && rowNumb < 19 ) {
          mapArray[rowNumb][colNumb] = 1;
        }
        //setting stairs
        if (rowNumb === 5 && colNumb === 6
          || rowNumb === 6 && colNumb === 17) {
          mapArray[rowNumb][colNumb] = 3;
        }
        //doorlock
        if (rowNumb === 7 && colNumb === 17) {
          mapArray[rowNumb][colNumb] = 7;
        }

        //setting keys
        if (rowNumb === 15 && colNumb === 1 || rowNumb === 3 && colNumb === 9) {
          mapArray[rowNumb][colNumb] = 5;
        }
        //setting stairs


      }

    }
    findGameObjects();
    console.log("map array");
    console.log(mapArray);
  }
  //function that update the hero localization
  function updateHeroMatrix() {
    heroMatrix = new Array(3).fill().map(item => (new Array(3).fill(0)));

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {

        if (i === 0) {
          heroMatrix[i][j] = mapArray[playerRow - 1][(playerColumn - 1) + j];
        }
        if (i === 1) {
          heroMatrix[i][j] = mapArray[playerRow][(playerColumn - 1) + j];
        }
        if (i === 2) {
          heroMatrix[i][j] = mapArray[playerRow + 1][(playerColumn - 1) + j];
        }
      }
    }
    console.log(heroMatrix);
  }

  function keydownHandler(event) {
    switch (event.keyCode) {
      case teclado.UP: if (heroMatrix[0][1] === character.FLOOR || heroMatrix[0][1] === character.KEY) {//validações criadas
        if(heroMatrix[0][1] === character.KEY){
          keys++;
        }
        mapArray[playerRow][playerColumn] = character.FLOOR;
        playerRow--;
        mapArray[playerRow][playerColumn] = character.HERO;
        render();
      } break;
      case teclado.DOWN: if (heroMatrix[2][1] === character.FLOOR || heroMatrix[2][1] === character.KEY) {
        if(heroMatrix[2][1] === character.KEY){
          keys++;
        }
        mapArray[playerRow][playerColumn] = character.FLOOR;
        playerRow++;
        mapArray[playerRow][playerColumn] = character.HERO;
        render();
      } break;
      case teclado.LEFT: if (heroMatrix[1][0] === character.FLOOR || heroMatrix[1][0] === character.KEY) {
        if(heroMatrix[1][0] === character.KEY){
          keys++;
        }
        mapArray[playerRow][playerColumn] = character.FLOOR;
        playerColumn--;
        mapArray[playerRow][playerColumn] = character.HERO;
        render();
      } break;
      case teclado.RIGHT: if (heroMatrix[1][2] === character.FLOOR || heroMatrix[1][2] === character.KEY) {
        if(heroMatrix[1][2] === character.KEY){
          keys++;
        }
        mapArray[playerRow][playerColumn] = character.FLOOR;
        playerColumn++;
        mapArray[playerRow][playerColumn] = character.HERO;
        render();
      } break;
      

    }
    switch (mapArray[playerRow][playerColumn]) {
      case character.ENEMY: fight();
        break;
      case character.KEY: trade();
        break;
      case character.DOORLOCK: endGame();
        break;

    }
    
  }

  function endGame() {
    /*completar*/
    // 1 - verificar se se atingiu o objectivo (castelo)
    // 1.1 - se sim, calcular a pontua��o: comida +ouro + experiencia
    // 1.2 - se n�o, ent�o verificar se foi encontrou o monstro: enviar uma mensagem, e reproduzir o som do monstro e do 
    //         afundamento do navio
    // 1.3 - Se n�o, enviar mensagem com a causa da morte

    //Remove the keyboard listener to end the game
    window.removeEventListener("keydown", keydownHandler, false);
  }

  function trade(){
    keys++;
  }
})();