(function() {
   

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
      //contruct array of obstacles
      
      //initialize map
      
    }
    //function that stores the map 
    //then assign it to global vars
    function findGameObjects(){
      for(let row = 0 ; row < ROWS ; row++){
        for(let col = 0; col < COLUMNS ; col ++){
          //store Hero Position
          if(mapArray[row][col] === character.HERO){
            playerColumn = col;
            playerRow = row;
          }
          if(mapArray[row][col] === character.KEY){
            keyCol = col;
            keyRow = row;
          }
          if(mapArray[row][col] === character.DOORLOCK){
            doorCol = col;
            doorRow = row;
          }
          //...
        }
      }
    }
    function render(){

    }
    //controi o array da stage
    function constructArray(){
        //calc nr de col e rows
        COLUMNS = Math.floor(stageHeigth / SIZE);
        ROWS = Math.floor(stageWidth / SIZE);
        //init array
      gameOBjects = new Array(COLUMNS).fill(0).map(item =>(new Array(ROWS).fill(0)));
 
      console.log("array criado:");
      console.log(gameOBjects);
      constructObstacleArray();
    }
    
    function constructObstacleArray(){
      console.log("contructObstacleArray;");
    mapArray = new Array(COLUMNS).fill(0).map( item =>(new Array(ROWS).fill(0)));
    for(let i = 0 ; i < mapArray[0].length ; i++){
      for(let j = 0 ; j < mapArray.length ; j++){
        //hero on position [0][0]
        if(i === 0 && j === 0){
          mapArray[i][j] = 10; 
        }
        //contruct position of obstacles
        if(i <= 6 && j === 5){
          mapArray[i][j] = 1; 
        }
        
      }
    }
    
    console.log("map array");
    console.log(mapArray);
    }
 
})();