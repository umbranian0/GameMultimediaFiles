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

  //hero matrix stores values around the hero 3x3 array
  var heroMatrix;
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
    //initialize game variables
    constructArray();
 
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

        cell.style.top = row * SIZE + "px";
        cell.style.left = col * SIZE + "px";
      }
      
    }
    updateHeroMatrix();
    output.innerHTML = gameMessage;
    gameMessage = "Keys : " + keys;
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
    console.log(mapArray.length);
    console.log(mapArray[0].length);
  }

  function constructObstacleArray() {
    console.log("contructObstacleArray;");
    mapArray = new Array(COLUMNS).fill(0).map(item => (new Array(ROWS).fill(0)));
    for (let i = 0; i < mapArray[0].length; i++) {
      for (let j = 0; j < mapArray.length; j++) {
        //hero on position [0][0]
        if (i === 1 && j === 1) {
          mapArray[i][j] = 10;
        }
        //contruct position of obstacles
        if (i === 0 || i === mapArray[0].length - 2 || j === 0 || j === mapArray.length - 1) {
          mapArray[i][j] = 1;
        }

        if (i === 2 && j === 3) {
          mapArray[i][j] = 3;
        }

        if (i === mapArray[0].length - 3 && j === mapArray.length - 2) {
          mapArray[i][j] = 7;
        }


      }
    }
    findGameObjects();
    console.log("map array");
    console.log(mapArray);
  }
  //function that update the hero localization
	function updateHeroMatrix(){
    heroMatrix = new Array(3).fill().map(item => (new Array(3).fill(0)));

		for(let i = 0 ; i < 3 ; i ++){
		  for(let j = 0 ; j < 3 ; j++){
    
      if(i === 0){
        heroMatrix[i][j] = mapArray[playerRow - 1][playerColumn + j];
      }
      if(i === 1){
        heroMatrix[i][j] = mapArray[playerRow][playerColumn - 1 + j];
      }
      if(i === 2 ){
        heroMatrix[i][j] = mapArray[playerRow + 1][playerColumn - 1 + j]; 
      }
		  }
		}
	  console.log(heroMatrix);
  }
    
  function keydownHandler(event) {
    switch (event.keyCode) {
      case teclado.UP: if (playerRow > 0) {
        mapArray[playerRow][playerColumn] = character.FLOOR;
        playerRow--;
        mapArray[playerRow][playerColumn] = character.HERO;
      } break;
      case teclado.DOWN: if (playerRow < ROWS - 1) {
        mapArray[playerRow][playerColumn] = character.FLOOR;
        playerRow++;
        mapArray[playerRow][playerColumn] = character.HERO;
      } break;
      case teclado.LEFT: if (playerColumn > 0) {
        mapArray[playerRow][playerColumn] = character.FLOOR;
        playerColumn--;
        mapArray[playerRow][playerColumn] = character.HERO;
      } break;
      case teclado.RIGHT: if (playerColumn < COLUMNS - 1) {
        mapArray[playerRow][playerColumn] = character.FLOOR;
        playerColumn++;
        mapArray[playerRow][playerColumn] = character.HERO;
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
    render();
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
})();