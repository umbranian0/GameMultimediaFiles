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

    var floorArray ;
    var mapArray;

    //variavel para guardar onde esta a personagem
    var playerColumn;
    var playerRow;
    
    //tamanho de cada celula
    const SIZE = 32;
    var colNumber;
    let rowNumber;
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
      constructObstacleArray()
      //initialize map
      
    }

    //controi o array da stage
    function constructArray(){
        //calc nr de col e rows
        colNumber = Math.floor(stageHeigth / SIZE);
        rowNumber = Math.floor(stageWidth / SIZE);
        //init array
      floorArray = new Array(colNumber).fill(0).map(item =>(new Array(rowNumber).fill(0)));
 
      console.log("array criado:");
      console.log(floorArray);
    }
    function constructObstacleArray(){
      console.log("contructObstacleArray;");
    mapArray = new Array(colNumber).fill(0).map( item =>(new Array(rowNumber).fill(0)));
    for(let i = 0 ; i < mapArray[0].length ; i++){
      for(let j = 0 ; j < mapArray.length ; j++){
        //hero on position [0][0]
        if(i == 0 && j == 0){
          mapArray[i][j] = 10; 
        }
        //contruct position of obstacles
        if(i == j || j == 5){
          mapArray[i][j] = 1; 
        }
        
      }
    }
    
    console.log("map array");
    console.log(mapArray);
    }
   /* function constructArray(){
      //calc nr de col e rows
      colNumber = Math.floor(stageHeigth / SIZE);
      rowNumber = Math.floor(stageWidth / SIZE);
      //init array
    floorArray = new Array(colNumber).fill(0).map(item =>(new Array(rowNumber).fill(0)));
   //passa pelo array inteiro
      for(let i = 0 ; i < rowNumber ; i++) {
          for(let j = 0 ; j < colNumber ; j++ ){ 
              
              let cell = document.createElement("img");
              cell.setAttribute("class","cell");
           
              cell.style.top = j * SIZE +"px";
              cell.style.left = i * SIZE +"px";

              floorArray[i][j] =  stage.appendChild(cell);
          }
      } 
    console.log("array " + floorArray);
  }*/
})();