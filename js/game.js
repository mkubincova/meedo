var body = document.querySelector("body");
var pagecontent = document.querySelector(".pagecontent");
var currentLvl = localStorage.getItem("currentLvl");
var currentAvatar = localStorage.getItem("avatar");
var highScore;

// get high score from local storage if there was one before
if (!localStorage.getItem("highScore")) {
    highScore = 0;
} else {
    highScore = localStorage.getItem("highScore");
}

// start playing first level
function loadLvl(lvl){
    localStorage.currentLvl = lvl;
    location.reload();
};

// update lives on screen
function printLives(){
    while(livesDiv.elt.lastElementChild){
        livesDiv.elt.lastElementChild.remove();
    }
    for (var i = 0; i < lives; i++) {
        var life = createImg("img/heart.png");
        life.class("life");
        life.parent(livesDiv);
    }
}

// state of the ship
function changeMode(){
    inCollision = false;
}

// create a button to play again and remove the current items from local storage
function gameOver(){
    playAgain = createButton("Play again");
    playAgain.class("again");
    playAgain.parent(pagecontent);
}

// switching to the right level
if (currentLvl === "lvl0") {
    body.id = "lvl0";
} else if (currentLvl === "lvl1") {
    body.id = "lvl1";
} else if (currentLvl === "lvl2") {
    body.id = "lvl2";
}

/* ------------------------------------------------------------------------------Level 0-------------------------------------------------------------------------------------- */
if (body.id == "lvl0") {
        var drawing, heading1, canvas, ctx, strokeP, strokeColor, fillP, fillColor, clearCanvasBtn, saveCanvasBth, downloadCanvasBtn;

        var gallery, heading2, imgPart, deleteAvatarBtn, downloadGalleryBtn, playBtn, selectedImage, allImages;

        function setup(){
            // left side
            drawing = createDiv("");
            drawing.class("drawing");
            drawing.parent(pagecontent);
            heading1 = createP("Create your avatar");
            heading1.parent(drawing);
            canvas = createCanvas(300, 300);
            canvas.parent(drawing);
            strokeP = createP("Stroke:");
            strokeP.parent(drawing);
            strokeColor = createInput('#000000', "color");
            strokeColor.parent(drawing);
            fillP = createP("Fill:");
            fillP.parent(drawing);
            fillColor = createInput('#ffffff', "color");
            fillColor.class("fill");
            fillColor.parent(drawing);
            clearCanvasBtn = createButton("Clear");
            clearCanvasBtn.class("clear");
            clearCanvasBtn.parent(drawing);
            saveCanvasBtn = createButton("Save image");
            saveCanvasBtn.class("save");
            saveCanvasBtn.parent(drawing);
            downloadCanvasBtn = createButton("Download");
            downloadCanvasBtn.class("download");
            downloadCanvasBtn.parent(drawing);

            // right side
            gallery = createDiv("");
            gallery.class("gallery");
            gallery.parent(pagecontent);
            heading2 = createP("Gallery");
            heading2.parent(gallery);
            imgPart = createDiv("");
            imgPart.class("imagesInGallery");
            imgPart.parent(gallery);
            deleteAvatarBtn = createButton("Delete image");
            deleteAvatarBtn.class("delete");
            deleteAvatarBtn.parent(gallery);
            playBtn = createButton("Start playing");
            playBtn.class("startPlaying");
            playBtn.parent(gallery);

            // get images from local Storage to gallery
            for (var i = 0; i < localStorage.length; i++) {
              var key = localStorage.key(i);                      //get keys of all elements in localStorage
              if (key != "currentLvl" && key != "lives" && key != "score" && key != "highScore" && key != "avatar") {  //skip level, lives and score value
                  var value = localStorage.getItem(key);          //add values according to keys
                  var img = createImg(value);                     //create new image
                  img.id(key);                                    //set key as image i
                  img.class("galleryImg");                        //add class for later selection
                  img.parent(imgPart);                            //append image to gallery section
              }
            }

            ctx = document.querySelector(".p5Canvas").getContext("2d");
            document.querySelector(".fill").addEventListener("input", changeCanvasBkg);
        }

        // drawing on canvas
        function draw() {
            strokeWeight(10)
            stroke(strokeColor.elt.value);
            if (mouseIsPressed === true) {
               line(mouseX, mouseY, pmouseX, pmouseY);
            }
        }

        // onclick functions for buttons
        function mouseClicked(event) {
            var target = event.target.className;
            if (target == "clear") {
                clear();
            } else if(target == "save") {
                saveToLocalStorage();
            } else if (target == "download") {
                saveCanvasBkg();
                saveCanvas("my_avatar", "png");
            } else if (target == "galleryImg") {
                selectImg();
            } else if (target == "delete") {
                deleteImage();
            } else if (target == "downloadGall") {
                downloadImgGall();
            } else if (target == "startPlaying") {
                goToLvl1();
            }
        }

        //changing canvas background based on fill input value
        function changeCanvasBkg(){
            document.querySelector(".p5Canvas").style.backgroundColor = fillColor.elt.value;
        }

        // saving canvas with background, code by Caleb Miller, posted on stackoverflow
        function saveCanvasBkg() {
          ctx.save();                                           //saving current state of context
          ctx.globalCompositeOperation = 'destination-over';    //set new drawign to go behind existing one
          ctx.fillStyle = fillColor.elt.value;                  //set fillstyle to current bkg color
          ctx.fillRect(0, 0, canvas.width, canvas.height);      //draw rectangle to cover canvas
          ctx.restore();                                        //restore context to previous state
        }

        // saving image to localStorage
        function saveToLocalStorage() {
            saveCanvasBkg();
            var imageAsData = document.querySelector(".p5Canvas").toDataURL("image/png");   //convert canvas to png
            var imageName = prompt("Name your creation:");                                  //ask for name(key) of image
            localStorage.setItem(imageName, imageAsData);                                   //save image to localStorage
            location.reload()
        }

        //selecting image in gallery
         function selectImg() {
                 selectedImage = event.target;                                        //save clicked image in variable
                 allImages = document.querySelector(".imagesInGallery").children;     //get all images in gallery
                 for (var i = 0; i < allImages.length; i++) {
                     allImages[i].className = "galleryImg";                           //change class so there is always only one selected image
                 }
                 selectedImage.setAttribute("class", "selectedImage")                 //select the clicked image
                };

        // //deleting inage from localStorage and gallery
        function deleteImage(){
            var confirmation = confirm("Are you sure you want to delete this image?");
            if (confirmation) {
                localStorage.removeItem(selectedImage.id);
                selectedImage.remove();
            }
        };
        function goToLvl1(){
            localStorage.setItem("avatar", selectedImage.src);
            loadLvl("lvl1");
        };



/* ------------------------------------------------------------------------------Level 1-------------------------------------------------------------------------------------- */

} else if (body.id == "lvl1") {

        //clear website
        while(pagecontent.lastElementChild){
            pagecontent.lastElementChild.remove();
        }

        var bioDiv, livesDiv, avatar, textDiv, message, score, instructionsDiv, instructions;
        var rocks, fruits, rock, fruit, boat, canvas, shark;
        var nextLvlBtn, playAgain;
        var bkgMusic, bkgShark, yumSound, crashSound;
        var lvl1End;

        var inCollision = false;
        var lives = 5;
        var score = 0;
        var playing = false;
        var start = false;
        var intro = false;

        function preload(){
            bkgMusic = loadSound("sd/lvl1.mp3");
            yumSound = loadSound('sd/yum.mp3');
            crashSound = loadSound("sd/crash.mp3");
            sharkSound = loadSound("sd/shark.mp3");
        }

        function setup() {
            bioDiv = createDiv("");
            bioDiv.class("bio");
            bioDiv.parent(pagecontent);
            livesDiv = createDiv("");
            livesDiv.class("lives");
            livesDiv.parent(bioDiv);
            printLives();
            avatar = createImg(currentAvatar);
            avatar.class("avatar");
            avatar.parent(bioDiv);
            textDiv = createDiv("");
            textDiv.class("text");
            textDiv.parent(bioDiv);
            message = createP("Hi, I'm you. Let's win this thing together!");
            message.class("message");
            message.parent(textDiv);
            scoreDiv = createP("Score: 0");
            scoreDiv.class("score");
            scoreDiv.parent(textDiv);
            highScoreDiv = createP("Highscore: " + highScore);
            highScoreDiv.parent(textDiv);

            canvas = createCanvas(600, 400);
            canvas.parent(pagecontent);
            rocks = new Group;
            fruits = new Group;

            boat = createSprite(120, 250);
            boat.velocity.x = 3;
            boat.addAnimation('normal', 'img/ship1.png', 'img/ship14.png');
            boat.addAnimation('colliding', 'img/ship-c1.png', 'img/ship-c3.png');
            boat.setCollider("rectangle", 0, 0, 90, 30);
            lvl0End = createVideo(['vid/lvl0-end.mp4']);
            lvl0End.hide();
            lvl1End = createVideo(['vid/lvl1-end.mp4']);
            lvl1End.hide();

            instructionsDiv = createDiv("");
            instructionsDiv.class("instructions");
            instructionsDiv.parent(pagecontent);
            instructions = createImg("img/instructions.png");
            instructions.parent(instructionsDiv);
        }

        function draw(){
            //fires at the very beginning
            if (!playing && !start) {
                if (frameCount === 1) {
                    playInstructions = createButton("Instructions");
                    playInstructions.class("playIntro");
                    playInstructions.parent(pagecontent);
                    skipIntro = createButton("Skip");
                    skipIntro.class("skipIntro")
                    skipIntro.parent(pagecontent);
                }
                if (intro) {
                    frameCount = 0;
                    image(lvl0End, 0, 0);
                    lvl0End.play();
                    document.querySelector(".playIntro").remove();
                    document.querySelector(".skipIntro").remove();
                    setTimeout(stopVideo, 20000);
                }
            //fires when the level is finished
            } else if (!playing && start){
                image(lvl1End, camera.position.x - 300, camera.position.y - 200);
                lvl1End.play();
                if (frameCount === 3460) {
                    lvlIsFinished()
                }
            //regular playing
            } else if (playing && start) {
                camera.position.y = boat.position.y;
                camera.position.x = boat.position.x + width/5;
                // boat animation
                if (inCollision == false) {
                    boat.changeAnimation("normal");
                    checkCollisionRock();
                } else {
                    boat.changeAnimation("colliding");
                    changeMessage("Ouch!");
                }

                //creating fruits and obstacles
                if (frameCount%70 === 0) {
                    createRock(canvas.height + 210, 0); //bottom rock
                    createRock(0 - 210, 1);             //top rock
                    createRock();                       //regular small stones
                }
                if (frameCount > 1500 && frameCount%100 === 0) {
                    createRock();
                } else if (frameCount > 2000 && frameCount%60 === 0) {
                    createShark();
                } else if (frameCount > 2500 && frameCount%100 === 0) {
                    createShark();
                }
                if(frameCount%150 === 0){
                    createFruit();
                }

                //changing speed of the game
                if(frameCount === 600 && boat.velocity.x != 0){
                    boat.velocity.x = 4
                } else if (frameCount === 1200 && boat.velocity.x != 0) {
                    boat.velocity.x = 6
                } else if (frameCount === 2000 && boat.velocity.x != 0) {
                    boat.velocity.x = 8
                    bkgMusic.stop();
                    sharkSound.loop();
                } else if (frameCount === 3100 && boat.velocity.x != 0) {
                    boat.velocity.x = 4
                } else if (frameCount === 3200 && boat.velocity.x != 0) {
                    changeMessage("We did it!");
                    playing = false;
                    sharkSound.stop();
                }

                //checking collision with apples
                for (var i = 0; i < fruits.length; i++) {
                    checkCollisionFruit(fruits.get(i))
                }

                // new frame specifications
                    background("#71d2fb");
                    drawSprites(rocks);
                    drawSprites(fruits);
                    rocks.displace(fruits);
                    drawSprite(boat);
                    shipMovement();

            }
        }

        //stops introduction video
        function stopVideo(){
            start = true;
            playing = true;
            intro = false;
            lvl0End.stop();
        }

        function playBkgMusic(){
            bkgMusic.setVolume(0.3);
            bkgMusic.play();
        }

        //keep track of button clicks
        function mouseClicked(event) {
            var target = event.target.className;
            if (target == "next") {
                loadLvl("lvl2");
            } else if (target == "again") {
                loadLvl("lvl0");
            } else if (target == "playIntro") {
                intro = true;
                setTimeout(playBkgMusic, 19000);
            } else if (target == "skipIntro") {
                start = true;
                playing = true;
                document.querySelector(".playIntro").remove();
                document.querySelector(".skipIntro").remove();
                playBkgMusic();
            }
        }

        // creating obstacles
        function createRock(y, r){
            //normal rocks
            if (!y) {
                rock = createSprite(camera.position.x + width, random(0, canvas.height));
                rock.addAnimation('normal', 'img/rock1.png', 'img/rock6.png');
                rock.setCollider('circle', 0, 0, 25);
                rocks.displace(rock);
            //top & bottom
            } else {
                rock = createSprite(camera.position.x + width, y, 800, height/2);
                if (r == 1) {
                    rock.addImage(loadImage("img/stones-up.png"));
                } else {
                    rock.addImage(loadImage("img/stones-down.png"));
                }
            }
            rocks.add(rock);
        }

        //maek a shark
        function createShark(){
            shark = createSprite(camera.position.x + width, random(0, canvas.height));
            shark.addAnimation("normal", "img/shark1.png", "img/shark2.png");
            shark.velocity.y = random(-3, 3);
            shark.velocity.x = -1;
            rocks.add(shark);
        }

        // make fruit
        function createFruit(){
            fruit = createSprite(camera.position.x + width, random(0, canvas.height));
            fruit.addAnimation('normal', 'img/fruit1.png', 'img/fruit15.png');
            fruits.add(fruit);
        }

        // check if ship is colliding with rock
        function checkCollisionRock() {
            if (boat.collide(rocks)) {
                crashSound.play();
                inCollision = true;             //stop detecting collision till mode changes
                lives --;
                printLives();
                if (lives == 0) {               //stop playing if all lives are up
                    if (score > highScore) {
                        localStorage.setItem("highScore", score);
                    }
                    sharkSound.stop();
                    boat.velocity.x = 0;
                    gameOver();
                } else {
                    score -= 2;
                    scoreDiv.elt.innerHTML = "Score: " + score;
                }
                setTimeout(changeMode, 2000);   //change ship mode to "not colling" aster 2 seconds
            }
        }

        // check if ship is colliding with fruit and change score
        function checkCollisionFruit(sprite) {
            if (sprite.overlap(boat)) {
                if (!inCollision) {
                    yumSound.play();
                    changeMessage("Yummy!");
                    score += 5;
                    scoreDiv.elt.innerHTML = "Score: " + score;
                    sprite.remove();
                }
            }
        }

        //change text from the avatar
        function changeMessage(text){
            message.elt.innerText = text;
        }

        //go to next level
        function lvlIsFinished(){
            nextLvlBtn = createButton("Next level");
            nextLvlBtn.class("next");
            nextLvlBtn.parent(pagecontent);
            localStorage.setItem("lives", lives);
            localStorage.setItem("score", score);
        }

        // ship movement detection
        function shipMovement(){
            if (keyIsDown(UP_ARROW)){
                boat.rotation = -20;
                if (boat.position.y <= 0) {
                    boat.position.y = 0;
                    boat.rotation = 0;
                } else {
                    boat.position.y -= 3;
                }
            } else if (keyIsDown(DOWN_ARROW)){
                boat.rotation = +20;
                if (boat.position.y >= canvas.height) {
                    boat.position.y = canvas.height;
                    boat.rotation = 0;
                } else {
                    boat.position.y += 3;
                }
            }
            // if nothing is pressed get ship to default appearance
             else {
                boat.rotation = 0;
            }
        }

/* ------------------------------------------------------------------------------Level 2-------------------------------------------------------------------------------------- */
} else if (body.id == "lvl2") {
    while(pagecontent.lastElementChild){
        pagecontent.lastElementChild.remove();
    }

    var bioDiv, livesDiv, avatar, textDiv, message, instructionsDiv, highScore, highScoreDiv;
    var canvas, water, obstacle, obstacles, obwidth, banana, bananas, ob1, ob2, player, pipe;
    var eatSound, waterSound, bkgMusic, theEnd, videoIsPlaying;

    // taking numbers from local storage as strings and turning into integers
    var score = parseInt(localStorage.getItem("score"));
    var lives = parseInt(localStorage.getItem("lives"));

    var ob1X = 110;
    var ob2X = 520;
    var gravity = 1;
    var lift = -15;
    var jumping = false;
    var inCollision = false;
    var playing = true;
    var winning = false;
    var obsImages = [];
    var settingTime = true;
    var fallen = false;
    var jumped = false;

    // preloading images for sprites, adding ground images to array
    function preload(){
        img = loadImage(localStorage.getItem("avatar"));
        bananaImg = loadImage("img/banana.png");
        rnd1 = loadImage("img/pipe1.png");
        obsImages.push(rnd1);
        obsImages.push(rnd1);
        obsImages.push(rnd1);
        rnd2 = loadImage("img/pipe2.png");
        obsImages.push(rnd2);
        obsImages.push(rnd2);
        rnd3 = loadImage("img/pipe3.png");
        obsImages.push(rnd3);
        pipe = loadImage("img/pipe4.png");
        bkgMusic = loadSound("sd/lvl2.mp3");
        eatSound = loadSound("sd/banana.mp3");
        waterSound = loadSound("sd/water.mp3");
    }

    function setup (){
        bioDiv = createDiv("");
        bioDiv.class("bio");
        bioDiv.parent(pagecontent);
        livesDiv = createDiv("");
        livesDiv.class("lives");
        livesDiv.parent(bioDiv);
        printLives();
        avatar = createImg(currentAvatar);
        avatar.class("avatar");
        avatar.parent(bioDiv);
        textDiv = createDiv("");
        textDiv.class("text");
        textDiv.parent(bioDiv);
        message = createP("Great job on the first one! We're almost there.");
        message.class("message");
        message.parent(textDiv);
        scoreDiv = createP("Score: " + localStorage.getItem("score"));
        scoreDiv.class("score");
        scoreDiv.parent(textDiv);
        highScoreDiv = createP("Highscore: " + highScore);
        highScoreDiv.parent(textDiv);

        canvas = createCanvas(600, 400);
        canvas.parent(pagecontent);
        obstacles = new Group;
        bananas = new Group;
        player = createSprite(100, 225);
        player.addImage(img);
        player.setCollider('rectangle', 0, 0, -50, 50);
        createWater();
        createBanana();
        createObstacle();
        drawFirst();
        theEnd = createVideo(['vid/lvl2-end.mp4']);
        theEnd.hide();

        instructionsDiv = createDiv("");
        instructionsDiv.class("instructions");
        instructionsDiv.parent(pagecontent);
        instructions = createImg("img/instructions-2.png");
        instructions.parent(instructionsDiv);

        playBkgMusic();
        document.querySelector(".p5Canvas").style.backgroundImage="url(img/BG.png)";
    }

    function draw(){
      if (playing) {
        // resizing the image from local storage to fit the player size
        img.resize(50, 50);
        clear();

        /* setting the speed for the obstacles, adding new ones and
        stopping the game after certain amount of obstacles */
        for (var i = 0; i < obstacles.length; i++) {
          gameSpeed(obstacles, i);
          if (obstacles.get(i).position.x == 600) {
            createObstacle();
          }
          if (obstacles.length == 30) {
            // checking if a new high score has been set
            if (score > highScore) {
              localStorage.setItem("highScore", score);
            }
            playing = false;
            winning = true;
          }
        }

        // keeping on creating bananas and checking if player catches them
        for (var i = 0; i < bananas.length; i++) {
          gameSpeed(bananas, i);
          checkCollisionBanana(bananas.get(i));
        }

        // draw where the player is moving
        playerMovement();
        updatePlayer();
        checkCollisionPlayer();
        drawSprites();
      } else if (winning) {
        // playing the winner video
        bkgMusic.stop();
        image(theEnd, 0, 0);
        theEnd.play();
        // setting time for the play again button to appear
        if (settingTime){
          setTimeout(gameOver, 6000);
          settingTime = false;
        }
      } else {
        bkgMusic.stop();
      }
    }

    // function for creating the first two obstacles
    function drawFirst(){
      ob1 = createSprite(ob1X,325);
      ob1.addImage(pipe);
      ob1.collide(player);
      obstacles.add(ob1);
      ob2 = createSprite(ob2X,325);
      ob2.addImage(pipe);
      ob2.collide(player);
      obstacles.add(ob2);
      ob1X = ob1X - 2;
      ob2X = ob2X - 2;
    }

    // taking back to the start of the game if play again is clicked
    function mouseClicked(event) {
      var target = event.target.className;
      if (target == "again") {
        loadLvl("lvl0");
      }
    }

    function createWater(){
      water = createSprite(300, 370);
      water.addAnimation('normal', 'img/waves1.png', 'img/waves41.png').frameDelay = 10;
    }

    // creating a banana at random place between 80 and 220 on the y axis
    function createBanana(){
      banana = createSprite(900, random(80,220));
      banana.setCollider("circle", 0, 0, 70, 60);
      banana.addImage(bananaImg);
      bananas.add(banana);
      setTimeout(createBanana, 2000);
    }

    function createObstacle(){
      obstacle = createSprite(890, 325);
      obstacle.addImage(random(obsImages));
      obstacle.collide(player);
      obstacles.add(obstacle);
    }

    // playing music throughout the level with less volume than other sounds
    function playBkgMusic(){
      bkgMusic.setVolume(0.3);
      bkgMusic.play();
    }

    /* the speed is changed by changing the x position of an array item,
    once the obstacle length reaches certain number, the speed is increased */
    function gameSpeed(group, index){
      if(obstacles.length < 5){
        group.get(index).position.x = group.get(index).position.x - 2;
      } else {
        group.get(index).position.x = group.get(index).position.x - 5;
      }
    }

    function checkCollisionPlayer() {
      if (player.overlap(obstacles)) {
        inCollision = true;
        // this makes player move together with the obstacles
        player.position.x -= 2;
        if (obstacles.length >= 5){
          player.position.x -= 3;
        }
      } else {
            inCollision = false;
            // checks if player fell or jumped in the water
            if (player.position.y == 339 || player.position.y == 325) {
                changeMessage("Oh no!");
                waterSound.play();
                lives --;
                printLives();
                    if (lives == 0) {
                      playing = false;
                      if (score > highScore) {
                        localStorage.setItem("highScore", score);
                      }
                      gameOver();
                    } else {
                      score -= 2;
                      scoreDiv.elt.innerHTML = "Score: " + score;
                    }
            }
      }
    }

    /* check if player catches a banana and increase score, change change message
    if he does */
    function checkCollisionBanana(sprite) {
      if (sprite.overlap(player)) {
        score += 5;
        scoreDiv.elt.innerHTML = "Score: " + score;
        // remove the caught banana
        sprite.remove();
        eatSound.play();
        changeMessage("Yummy!");
      }
    }

    // function to move the player
    function playerMovement(){
      // moving the player when two keys are pressed
      if (player.position.y == 375){
        return;
      }
      if (keyIsDown(LEFT_ARROW) && keyIsDown(UP_ARROW) && jumping == false){
        player.position.x -= 20;
        player.velocity.y += lift;
        jumping = true;
      } else if (keyIsDown(RIGHT_ARROW) && keyIsDown(UP_ARROW) && jumping == false){
        player.position.x += 20;
        player.velocity.y += lift;
        jumping = true;
      }
      // moving the player when one key is pressed
      else if (keyIsDown(RIGHT_ARROW)){
        player.position.x += 5;
      } else if (keyIsDown(LEFT_ARROW)){
        player.position.x -= 5;
      } else if (keyIsDown(UP_ARROW) && jumping == false){
        player.velocity.y += lift;
        jumping = true;
      }
    }

    function updatePlayer(){
      player.velocity.y += gravity;
      player.position.y += player.velocity.y;
      // don't let player fall while on the obstacle
      if (player.position.y > 225 && inCollision){
        player.position.y = 225;
        player.velocity.y = 0;
        jumping = false;
      }
      // don't allow player go out of canvas
      if (player.position.x < 25){
        player.position.x = 25;
      }
      if (player.position.x > 575){
        player.position.x = 575;
      }
      if (player.position.y > 375){
        player.velocity.y = 0;
        player.position.y = 375;
      }
    }

    function changeMessage(text){
        message.elt.innerText = text;
    }

}
