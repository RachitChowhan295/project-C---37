var database;
var happydog,dog;
var foods,foodstock;
var food;

var feed,addfood;
var fedTime,lastFed;

var gameState;
var currenttime;

var bg = "white";

function preload(){
    dogimj = loadImage("Dog.png");
    happydogimj = loadImage("happydog.png");

    gardenimj = loadImage("Garden.png");
    hungrydog = loadImage("hungrydog.png");
    washroomdog = loadImage("WashRoom.png");
    bedroomimj = loadImage("BedRoom.png");
}


function setup(){
createCanvas(500,500);

database = firebase.database();

writeStock(21)

food = new Food();

dog = createSprite(250,250,20,20);
dog.addImage("dogimj",dogimj);
dog.scale = 0.1;

feed = createButton("Feed the dog");
feed.position(700,95);
feed.mousePressed(feedDog);

addfood= createButton("Add Food");
addfood.position(800,95);
addfood.mousePressed(addFoods)

foodstock = database.ref('Food');
foodstock.on("value",readStock)

}


function draw(){

    background(bg);

/*
    if(keyWentDown(UP_ARROW)){
       // database.ref('Food').set({
      //      Food : foodstock - 1
      //foods = foods - 1;
      writeStock(foods);
     //   })
     dog.addImage(happydogimj);
    }
*/

    food.display();

    //print = database.ref('Food');
   // print.on("value",readStock)
    //console.log(print);

    lastFed = database.ref("FeedTime");
    lastFed.on("value",readlastFed)


    hour();

    fill(255,255,254);
    textSize(15);
    if(lastFed >= 12){
        text("Last Feed : " + lastFed % 12 + " PM",350,30);
    }else if (lastFed === 0){
        text ("last Feed : 12 AM",350,30);
    }else{
        text ("lastFeed : " + lastFed + "AM", 350,30);
    }


    readState = database.ref('gameState');
    readState.on("value",function(data){
        gameState = data.val();
    });


    if (currenttime = lastFed + 1){

        updatestate("playing");
        garden();
    }  else if (currenttime = lastFed  + 2){

        updatestate("sleeping");
        bedroom();
    }else if (currenttime < lastFed + 5){

        updatestate("bathing");
        washroom();
    }else if (currenttime > lastFed + 4){
        updatestate("hungry");
    }

    if (gameState != "hungry"){

        feed.hide();
        addfood.hide();
        dog.remove();
    }else{
        feed.show();
        addfood.show();
        dog.addImage(hungrydog)
    }


    //console.log(gameState);
    drawSprites();
   
    fill ("red");
    text("Food Left = " + foods,200,50,textSize(20));
}

function readStock (data){
    foods = data.val();
}

function writeStock(x){

    if (x<=0){
        x = 0;
    }else{
        x = x - 1;
    }

    database.ref('/').update({
        'Food' : x
    })
}

function feedDog(){

    dog.addImage("happydogimj",happydogimj);

    //food.updateFoodStock(food.getFoodStock() - 1);
    database.ref('/').update({

        'Food' : food.getFoodStock(),
        'FeedTime' : hour()

    })

}

function addFoods(){

    foods ++;
    database.ref('/').update({

        'Food' : foods

    })

}

async function hour(){

    var information = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata")
    var informationJSON = await information.json();

    var dt = informationJSON.datetime;
    var hour = dt.slice(11,13);

    currenttime = hour;

    database.ref('/').update({

        'FeedTime' : hour
    })
    

}

function readlastFed(data){

    lastFed = data.val()

}


function updatestate(state){

    database.ref('/').update({

        'gameState' : state
    })

}

function garden(){
    bg = gardenimj
}

function bedroom(){
    bg = bedroomimj
}

function washroom(){
    bg = washroomdog
}