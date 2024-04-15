// Variables

// Board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// Oiseau

let oiseauWidth = 51; // 408px x 288px <=> 17px x 12px
let oiseauHeight = 36;
let oiseauX = boardWidth/8;
let oiseauY = boardHeight/2;
let oiseauImg;

let oiseau = { // 'oiseau' object
    x : oiseauX,
    y : oiseauY,
    width : oiseauWidth,
    height : oiseauHeight
}

// Baguettes

let baguetteArray = [];
let baguetteWidth = 64; // 384px x 3072px <=> 1px x 8px
let baguetteHeight = 512;
let baguetteX = boardWidth; // initially out of frame
let baguetteY = 0;

let topBaguetteImg;
let bottomBaguetteImg;

// Game physics

let velocityX = -2; // 'baguettes' horizontal speed
let velocityY = 0; // 'oiseau' vertical speed
let gravity = 0.4; // RIP Sir Isaac Newton (1642 - 1726)

// Game

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d'); // used for drawing on the board


    // Drawing a rectangle to view the position of the 'oiseau'

    // context.fillStyle = 'green';
    // context.fillRect(oiseau.x , oiseau.y , oiseau.width , oiseau.height);

    // 'oiseau' image

    oiseauImg = new Image();
    oiseauImg.src = './flappy-oiseau-images/flappy-oiseau-pigeon-v2.png';
    oiseauImg.onload = function() {
        context.drawImage(oiseauImg , oiseau.x , oiseau.y , oiseau.width , oiseau.height);
    }

    // 'baguette' images

    topBaguetteImg = new Image();
    topBaguetteImg.src = './flappy-oiseau-images/flappy-oiseau-top-baguette.png';

    bottomBaguetteImg = new Image();
    bottomBaguetteImg.src = './flappy-oiseau-images/flappy-oiseau-bottom-baguette.png';

    requestAnimationFrame(update);
    setInterval(placeBaguettes, 1500);
    document.addEventListener("keydown", moveOiseau);
}

// update function (image refresh)

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0 , 0 , board.width , board.height); // 0,0 top left corner of the canvas ; + range

    // 'oiseau'

    velocityY += gravity;
    // oiseau.y += velocityY; // change velocity BEFORE drawing 'oiseau'
    oiseau.y = Math.max(oiseau.y + velocityY , 0); // to contain 'oiseau' in the canvas
    context.drawImage(oiseauImg , oiseau.x , oiseau.y , oiseau.width , oiseau.height);

    if (oiseau.y > board.height) {
        gameOver = true;
    }

    // 'baguettes'

    for (let i = 0 ; i < baguetteArray.length ; i++) {
        let baguette = baguetteArray[i];
        baguette.x += velocityX; // 2px to the left shift
        context.drawImage(baguette.img , baguette.x , baguette.y , baguette.width , baguette.height);

        // score update

        if (!baguette.passed && oiseau.x > baguette.x + baguette.width) {
            score += 0.5; // 0,5 points per 'baguette'
            baguette.passed = true;
        }

        //collsion

        if (detectCollision(oiseau , baguette)) {
            gameOver = true;
        }
    }

    // clear 'baguettes' to avoid a huge array and memory issues

    while (baguetteArray.length > 0 && baguetteArray[0].x + baguetteWidth < 0) {
        baguetteArray.shift(); // removes first element of the array
    }

    // score

    let scoreFormatted = score.toString().padStart(2, '0');

    context.fillStyle = 'white';
    context.font = '80px VT323';
    //context.fillText(scoreFormatted, 157, 180); // -3 ; 299
    var txt = scoreFormatted;
    var x = 148;
    var y = 180;
    context.strokeStyle = 'black';
    context.miterLimit = 2;
    context.lineJoin = 'circle';
    context.lineWidth = 7;
    context.strokeText(txt, x, y);
    context.lineWidth = 1;
    context.fillText(txt, x, y);

    // game over text

    if (gameOver) {
        context.font = '35px VT323';
        //context.fillText('OUI OUI BAGUETTE', 69, 240); // -1 ; 138
        var txt = 'OUI OUI BAGUETTE';
        var x = 69;
        var y = 240;
        context.strokeStyle = 'black';
        context.miterLimit = 2;
        context.lineJoin = 'circle';
        context.lineWidth = 7;
        context.strokeText(txt, x, y);
        context.lineWidth = 1;
        context.fillText(txt, x, y);
    }

    if (gameOver) {
      context.font = '20px VT323';
      // context.fillText('PRESS R TO PLAY ENCORE', 93, 260); // -1 ; 185
      var txt = 'PRESS R TO PLAY ENCORE';
      var x = 93;
      var y = 265;
      context.strokeStyle = 'black';
      context.miterLimit = 2;
      context.lineJoin = 'circle';
      context.lineWidth = 7;
      context.strokeText(txt, x, y);
      context.lineWidth = 1;
      context.fillText(txt, x, y);
  }
}

// placeBaguettes function

function placeBaguettes() {

    if (gameOver) {
        return;
    }

    let randomBaguetteY = baguetteY - baguetteHeight/4 - Math.random()*(baguetteHeight/2);
    let openingSpace = board.height/4;

    let topBaguette = {
        img : topBaguetteImg,
        x : baguetteX,
        y : randomBaguetteY,
        width : baguetteWidth,
        height : baguetteHeight,
        passed : false
    }

    baguetteArray.push(topBaguette);

    let bottomBaguette = {
        img : bottomBaguetteImg,
        x : baguetteX,
        y : randomBaguetteY + baguetteHeight + openingSpace,
        width : baguetteWidth,
        height : baguetteHeight,
        passed : false
    }

    baguetteArray.push(bottomBaguette);
}

// moveOiseau function

function moveOiseau(e) {
    if (e.code === '' || e.code === 'Space' || e.code === 'ArrowUp') {
        velocityY = -6;

    }
    if (gameOver) {
        oiseau.y = oiseauY;
        baguetteArray = [];
        score = 0;
        gameOver = false;
    }
}

// detectCollision function

function detectCollision(a,b) {
    return a.x < b.x + b.width - 30 &&
        a.x + a.width - 30 > b.x &&
        a.y < b.y + b.height - 5 &&
        a.y + a.height - 5 > b.y;
}
