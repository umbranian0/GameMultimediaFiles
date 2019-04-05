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
  var enemyMatrix;
  //variavel para guardar onde esta a personagem
  var playerColumn;
  var playerRow;
  var enemyCol;
  var enemyRow;
  var enemy2Col;
  var enemy2Row;
  var stoneLockCol;
  var stoneLockRow;
  //info panel vars
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

  window.addEventListener("load", init, false);

  function init() {
    //init stage and info panel
    stage = document.querySelector("#stage");
    output = document.querySelector("#infoPanel");
    firstTime = true;
    stageWidth = document.getElementById('stage').clientWidth;
    stageHeigth = document.getElementById('stage').clientHeight;
    console.log("Stage width and heigth " + stageWidth + "  ," + stageHeigth);

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
        if (mapArray[row][col] === character.ENEMY) {
          if(enemyCol === undefined){
            enemyCol = col;
            enemyRow = row;
            console.log(enemyCol);
          }
          else if(enemy2Col === undefined){
            enemy2Col = col;
            enemy2Row = row;
            console.log(enemy2Col);
          }
          
        }
        if (mapArray[row][col] === character.STONELOCK) {
          stoneLockCol = col;
          stoneLockRow = row;
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
          case character.HERO: cell.classList.add('actor'); break;
          case character.QUESTION: cell.classList.add('question'); break;
          case character.KEY: cell.classList.add('key'); break;
          case character.ENEMY: cell.classList.add('enemy'); break;
          case character.floor: cell.classList.add('floor'); break;
          case character.WALL: cell.classList.add('wall'); break;
          case character.STAIRE: cell.classList.add('stairsE'); break;
          case character.STAIRE: cell.classList.add('stairsE'); break;
          case character.STAIRS: cell.classList.add('stairsS'); break;
          case character.DOORLOCK: cell.classList.add('doorLock'); break;
          case character.STONELOCK: cell.classList.add('stoneLock'); break;
          case character.ICESTONE: cell.classList.add('iceStone'); break;
          case character.BONES: cell.classList.add('bones'); break;
        }
        cell.style.top = row * SIZE + "px";
        cell.style.left = col * SIZE + "px";
      }

    }
    
    playerColumn != null ? updateHeroMatrix(): null;

   if(enemyRow != null && enemy2Row != null){
      updateEnemyMatrix();
      autoMoveEnemy();
    }

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
        if (rowNumb === 2 && colNumb === 2) {
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
          || colNumb === 14  && rowNumb > 6 && rowNumb < 19 
          || rowNumb === 13 && colNumb === 3
          || rowNumb === 12 && colNumb === 3 
          || rowNumb === 2 && colNumb < 18 && colNumb > 12
          || rowNumb === 3 && colNumb === 13
          || rowNumb === 3 && colNumb === 16
          || rowNumb === 9 && colNumb < 3 && colNumb > 0
          || rowNumb === 8 && colNumb === 4
          || rowNumb === 11 && colNumb === 3
          || rowNumb === 14 && colNumb === 6
          || rowNumb === 14 && colNumb === 8
          || rowNumb === 1 && colNumb === 4
          || rowNumb === 2 && colNumb > 3 && colNumb < 10) {
          mapArray[rowNumb][colNumb] = 1;
        }
        //setting stairsE
        if (rowNumb === 17 && colNumb === 6
          || rowNumb === 12 && colNumb === 13) {
          mapArray[rowNumb][colNumb] = 2;
        }
        //doorlock
        if (rowNumb === 7 && colNumb === 17
          || rowNumb === 14 && colNumb === 7) {
          mapArray[rowNumb][colNumb] = 7;
        }

        //setting keys
        if (rowNumb === 15 && colNumb === 1 || rowNumb === 13 && colNumb === 1) {
          mapArray[rowNumb][colNumb] = 5;
        }

        //setting Interrogations
        if (rowNumb === 13 && colNumb === 4 
          || rowNumb === 3 && colNumb === 17) {
          mapArray[rowNumb][colNumb] = 8;
        }

        //setting Ice
        if (rowNumb === 11 && colNumb === 4
          || rowNumb === 4 && colNumb === 16) {
          mapArray[rowNumb][colNumb] = 4;
        }

        //Setting Enemys
        if (rowNumb === 13 && colNumb === 10
          ||rowNumb === 6 && colNumb === 2){
          mapArray[rowNumb][colNumb] = 11;
        }

        //Setting Bones
        if (rowNumb === 1 && colNumb === 17){
          mapArray[rowNumb][colNumb] = 9;
        }

        //Setting StoneLock
        if (rowNumb === 7 && colNumb === 5){
          mapArray[rowNumb][colNumb] = 6;
        }

        //setting stairsS
        if (rowNumb === 6 && colNumb === 17){
          mapArray[rowNumb][colNumb] = 3;
        }

      }

    }
    findGameObjects();
    console.log("map array");
    console.log(mapArray);
  }
  function updateEnemyMatrix() {
    enemyMatrix = new Array(2).fill(0).map(item => new Array(3).fill(0).map(item => (new Array(3).fill(0))));


    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {

        if (i === 0) {
          enemyMatrix[0][i][j] = mapArray[enemyRow - 1][(enemyCol - 1) + j];
          enemyMatrix[1][i][j] = mapArray[enemy2Row - 1][(enemy2Col - 1) + j];
        }
        if (i === 1) {
          enemyMatrix[0][i][j] = mapArray[enemyRow][(enemyCol - 1) + j];
          enemyMatrix[1][i][j] = mapArray[enemy2Row][(enemy2Col - 1) + j];
        }
        if (i === 2) {
          enemyMatrix[0][i][j] = mapArray[enemyRow + 1][(enemyCol - 1) + j];
          enemyMatrix[1][i][j] = mapArray[enemy2Row + 1][(enemy2Col - 1) + j];
        }
      }
    }
    console.log("enemy Matrix");
    console.log(enemyMatrix);
  }

  
  //function to move enemy if he got nerby spaces
  //AI function
  function autoMoveEnemy(){
    let autoNumb = Math.floor(Math.random() * (4 - 0) + 0);
    console.log(autoNumb);
    switch(autoNumb){
    case 0: aiAutoEnemyThree();
    break;
     case 1: aiAutoEnemyOne();
     break;
     case 2: aiAutoEnemyTow();
     break;
     case 3 : aiAutoEnemyFour();
     break;
    }  
  }
  function aiAutoEnemyOne(){
    //check left move
    if(enemyMatrix[0][1][0] === character.FLOOR ){
      mapArray[enemyRow][enemyCol] = character.FLOOR;
      enemyCol--;
      mapArray[enemyRow][enemyCol] = character.ENEMY;  
    }
    //check bot move
    else if(enemyMatrix[0][2][1] === character.FLOOR ){
      mapArray[enemyRow][enemyCol] = character.FLOOR;
      enemyRow++;
      mapArray[enemyRow][enemyCol] = character.ENEMY; 
    }
    //check right move
     else if(enemyMatrix[0][1][2]=== character.FLOOR){
      mapArray[enemyRow][enemyCol] = character.FLOOR;
      enemyCol++;
      mapArray[enemyRow][enemyCol] = character.ENEMY;
    }
    //check top move
    else if(enemyMatrix[0][0][1] === character.FLOOR){ /// improve both enemy moving 
      mapArray[enemyRow][enemyCol] = character.FLOOR;
      enemyRow--;
      mapArray[enemyRow][enemyCol] = character.ENEMY;
    }

  }
  function aiAutoEnemyTow(){
  //check  right move
  if( enemyMatrix[1][1][2]=== character.FLOOR){
    mapArray[enemy2Row][enemy2Col] = character.FLOOR;
    enemy2Col++;
    mapArray[enemy2Row][enemy2Col] = character.ENEMY;
  } 
    //check top move
  else if(enemyMatrix[1][0][1]=== character.FLOOR){
      mapArray[enemy2Row][enemy2Col] = character.FLOOR;
      enemy2Row--;
      mapArray[enemy2Row][enemy2Col] = character.ENEMY;
  } 
     // check left move
  else if(enemyMatrix[1][1][0]=== character.FLOOR){
    mapArray[enemy2Row][enemy2Col] = character.FLOOR;
    enemy2Col--;
    mapArray[enemy2Row][enemy2Col] = character.ENEMY;
  } 
  //check bot move
  else if(enemyMatrix[1][2][1]=== character.FLOOR){
    mapArray[enemy2Row][enemy2Col] = character.FLOOR;
    enemy2Row++;
    mapArray[enemy2Row][enemy2Col] = character.ENEMY;
  } 

  }
  function aiAutoEnemyThree(){

      //check  right move and top
  if( enemyMatrix[0][1][2]=== character.FLOOR && enemyMatrix[0][1][0]=== character.FLOOR){
    mapArray[enemyRow][enemyCol] = character.FLOOR;

    enemyMatrix[0][2][1]=== character.FLOOR ? enemyCol++ : enemyRow --;

    mapArray[enemyRow][enemyCol] = character.ENEMY;
  } 
    //check left and top
  else if(enemyMatrix[0][1][0]=== character.FLOOR && enemyMatrix[0][0][1]=== character.FLOOR){
    mapArray[enemyRow][enemyCol] = character.FLOOR;
    enemyMatrix[0][2][1]=== character.FLOOR ? enemyCol-- : enemyRow--;
    mapArray[enemyRow][enemyCol] = character.ENEMY;
  }
  //check  right move and bot
  if( enemyMatrix[1][1][2]=== character.FLOOR && enemyMatrix[1][2][1]=== character.FLOOR){
    mapArray[enemy2Row][enemy2Col] = character.FLOOR;
    enemyMatrix[1][0][1]=== character.FLOOR ? enemy2Col++ : enemy2Row++;
    mapArray[enemy2Row][enemy2Col] = character.ENEMY;
  } 
  //check left and top
  else if(enemyMatrix[1][1][0]=== character.FLOOR && enemyMatrix[1][0][1]=== character.FLOOR){
    mapArray[enemy2Row][enemy2Col] = character.FLOOR;
    enemyMatrix[1][2][1]=== character.FLOOR ? enemy2Col-- : enemy2Row--;
    mapArray[enemy2Row][enemy2Col] = character.ENEMY;
  }
 
  }
  function aiAutoEnemyFour(){
          //check  top
  if( enemyMatrix[0][0][1]=== character.FLOOR ){
    mapArray[enemyRow][enemyCol] = character.FLOOR;
    enemyMatrix[0][2][1]=== character.FLOOR ? enemyRow++ : enemyRow --;
    mapArray[enemyRow][enemyCol] = character.ENEMY;
  } 
  //check  bot
  else if( enemyMatrix[0][2][1]=== character.FLOOR ){
    mapArray[enemyRow][enemyCol] = character.FLOOR;
    enemyMatrix[0][1][0]=== character.FLOOR ? enemyRow++ : enemyCol --;
    mapArray[enemyRow][enemyCol] = character.ENEMY;
  } 
  //check top 
  if( enemyMatrix[1][0][1]=== character.FLOOR ){
    mapArray[enemy2Row][enemy2Col] = character.FLOOR;
    enemyMatrix[1][2][1]=== character.FLOOR ? enemy2Row++ : enemy2Row --;
    mapArray[enemy2Row][enemy2Col] = character.ENEMY;
  } 
  else if( enemyMatrix[1][2][1]=== character.FLOOR ){
    mapArray[enemy2Row][enemy2Col] = character.FLOOR;
    enemyMatrix[1][1][0]=== character.FLOOR ? enemy2Row++ : enemy2Col --;
    mapArray[enemy2Row][enemy2Col] = character.ENEMY;
  } 
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
      case teclado.UP: if (heroMatrix[0][1] === character.FLOOR || heroMatrix[0][1] === character.KEY || heroMatrix[0][1] === character.BONES) {//validações criadas
        if (heroMatrix[0][1] === character.KEY) {
          trade("keys");
        }
        if (heroMatrix[0][1] === character.BONES) {
          trade("bones");
        }
        mapArray[playerRow][playerColumn] = character.FLOOR;
        playerRow--;
        mapArray[playerRow][playerColumn] = character.HERO;
        render();
      } 
      break;

      case teclado.DOWN: if (heroMatrix[2][1] === character.FLOOR || heroMatrix[2][1] === character.KEY || heroMatrix[2][1] === character.BONES) {
        if (heroMatrix[2][1] === character.KEY) {
          trade("keys");
        }
        if (heroMatrix[2][1] === character.BONES) {
          trade("bones");
        }
        mapArray[playerRow][playerColumn] = character.FLOOR;
        playerRow++;
        mapArray[playerRow][playerColumn] = character.HERO;
        render();
      } 
      break;

      case teclado.LEFT: if (heroMatrix[1][0] === character.FLOOR || heroMatrix[1][0] === character.KEY || heroMatrix[1][0] === character.BONES) {
        if (heroMatrix[1][0] === character.KEY) {
          trade("keys");
        }
        if (heroMatrix[1][0] === character.BONES) {
          trade("bones");
        }
        mapArray[playerRow][playerColumn] = character.FLOOR;
        playerColumn--;
        mapArray[playerRow][playerColumn] = character.HERO;
        render();
      } 
      break;

            case teclado.RIGHT: if (heroMatrix[1][2] === character.FLOOR || heroMatrix[1][2] === character.KEY || heroMatrix[1][2] === character.BONES) {
        if (heroMatrix[1][2] === character.KEY) {
          trade("keys");
        }
        if (heroMatrix[1][2] === character.BONES) {
          trade("bones");
        }
        mapArray[playerRow][playerColumn] = character.FLOOR;
        playerColumn++;
        mapArray[playerRow][playerColumn] = character.HERO;
        render();
      }
      break;
      
      case teclado.SPACE: {
      verify();  
      render();
    } break;
    }    
  }

  function verify(){
    if (heroMatrix[0][1] === character.ICESTONE) {
      mapArray[playerRow][playerColumn] = character.FLOOR;
      playerRow--;
      mapArray[playerRow][playerColumn] = character.HERO;
    }
    else if (heroMatrix[2][1] === character.ICESTONE) {
      mapArray[playerRow][playerColumn] = character.FLOOR;
      playerRow++;
      mapArray[playerRow][playerColumn] = character.HERO;
      

    }
    else if (heroMatrix[1][0] === character.ICESTONE) {
      mapArray[playerRow][playerColumn] = character.FLOOR;
      playerColumn--;
      mapArray[playerRow][playerColumn] = character.HERO;
      

    }
    else if (heroMatrix[1][2] === character.ICESTONE) {
      mapArray[playerRow][playerColumn] = character.FLOOR;
      playerColumn++;
      mapArray[playerRow][playerColumn] = character.HERO;


    }
    else if (heroMatrix[0][1] === character.STONELOCK) {
      if (bones > 0) {
        mapArray[playerRow][playerColumn] = character.FLOOR;
        playerRow--;
        mapArray[playerRow][playerColumn] = character.HERO;
        bones = bones - 1;
      }
    }

    else if (heroMatrix[2][1] === character.STONELOCK) {
      if (bones > 0) {
        mapArray[playerRow][playerColumn] = character.FLOOR;
        playerRow++;
        mapArray[playerRow][playerColumn] = character.HERO;
        bones = bones - 1;
      }
    }
    else if (heroMatrix[1][0] === character.STONELOCK) {
      if (bones > 0) {
        mapArray[playerRow][playerColumn] = character.FLOOR;
        playerColumn--;
        mapArray[playerRow][playerColumn] = character.HERO;
        bones = bones - 1;
      }
    }
    else if (heroMatrix[2][1] === character.STONELOCK) {
      if (bones > 0) {
        mapArray[playerRow][playerColumn] = character.FLOOR;
        playerColumn++;
        mapArray[playerRow][playerColumn] = character.HERO;
        bones = bones - 1;
      }
    }
    else if (heroMatrix[0][1] === character.DOORLOCK) {
      if (keys > 0) {
        mapArray[playerRow][playerColumn] = character.FLOOR;
        playerRow--;
        mapArray[playerRow][playerColumn] = character.HERO;
        keys = keys - 1;
      }
    }

    else if (heroMatrix[2][1] === character.DOORLOCK) {
      if (keys > 0) {
        mapArray[playerRow][playerColumn] = character.FLOOR;
        playerRow++;
        mapArray[playerRow][playerColumn] = character.HERO;
        keys = keys - 1;
      }
    }
    else if (heroMatrix[1][0] === character.DOORLOCK) {
      if (keys > 0) {
        mapArray[playerRow][playerColumn] = character.FLOOR;
        playerColumn--;
        mapArray[playerRow][playerColumn] = character.HERO;
        keys = keys - 1;
      }
    }
    else if (heroMatrix[2][1] === character.DOORLOCK) {
      if (keys > 0) {
        mapArray[playerRow][playerColumn] = character.FLOOR;
        playerColumn++;
        mapArray[playerRow][playerColumn] = character.HERO;
        keys = keys - 1;
      }
    }
  }
  //not working
  /*to do*/
  function checkObjects(col,row){

        switch (heroMatrix) {

          case heroMatrix[col][row] === character.ENEMY  : fight();
            break;
          case heroMatrix[col][row] === character.KEY: trade();
            break;
          case heroMatrix[col][row] === character.DOORLOCK: endGame();
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

  function trade(character) {
    if (character === "keys") {
      keys++;
    }
    if (character === "bones") {
      bones++;
    }
    console.log(keys);
  }
})();