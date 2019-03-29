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

  var gameOBjects;
  var mapArray;

  //variavel para guardar onde esta a personagem
  var playerColumn;
  var playerRow;
  var keyCol;
  var keyRow;
  var doorCol;
  var doorRow;
  //info panel vars
  var keys;
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

    stageWidth = document.getElementById('stage').clientWidth;
    stageHeigth = document.getElementById('stage').clientHeight;
    console.log("Stage width and heigth " + stageWidth + "  ," + stageHeigth);
    //contrução de um array para o mapa, de modo a inserir bonecos 
    //  daw map array
    constructArray();
    //initialize game variables
    findGameObjects();
    //initialize map
    render();
  }
  //function that stores the map 
  //then assign it to global vars
  function findGameObjects() {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        //store Hero Position
        if (mapArray[row][col] === character.HERO) {
          playerColumn = col;
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
          case character.floor: cell.className += ' floor'; break;
          case character.WALL: cell.className += ' wall'; break;
          case character.FLOOR: cell.className += ' floor'; break;
          case character.ICESTONE: cell.className += ' iceStone'; break;
          case character.STAIRE: cell.className += ' stairsE'; break;
          case character.STAIRS: cell.className += ' stairsS'; break;
          case character.STONELOCK: cell.className += ' stoneLock'; break;
          case character.HERO: cell.className += ' actor'; break;
          case character.QUESTION: cell.className += ' question'; break;
          case character.KEY: cell.className += ' key'; break;
          case character.ENEMY: cell.className += ' enemy'; break;
          case character.DOORLOCK: cell.className += ' doorLock'; break;
        }

        cell.style.top = col * SIZE + "px";
        cell.style.left = row * SIZE + "px";
      }
    }

    output.innerHTML = gameMessage;
    gameMessage = "Kyes : " + keys;
  }
  //controi o array da stage
  function constructArray() {
    //calc nr de col e rows
    COLUMNS = Math.floor(stageHeigth / SIZE);
    ROWS = Math.floor(stageWidth / SIZE);
    //init array
    gameOBjects = new Array(COLUMNS).fill(0).map(item => (new Array(ROWS).fill(0)));

    console.log("array criado:");
    console.log(gameOBjects);
    constructObstacleArray();
  }

  function constructObstacleArray() {
    console.log("contructObstacleArray;");
    mapArray = new Array(COLUMNS).fill(0).map(item => (new Array(ROWS).fill(0)));
    for (let i = 0; i < mapArray[0].length; i++) {
      for (let j = 0; j < mapArray.length; j++) {
        //hero on position [0][0]
        if (i === 0 && j === 0) {
          mapArray[i][j] = 10;
        }
        //contruct position of obstacles
        if (i <= 6 && j === 5) {
          mapArray[i][j] = 1;
        }

        if (i <= 10 && j === 3) {
          mapArray[i][j] = 3;
        }

        if (i === mapArray[0].length - 1 && j === mapArray.length - 1) {
          mapArray[i][j] = 7;
        }


      }
    }

    console.log("map array");
    console.log(mapArray);
  }

})();