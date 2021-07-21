//Create variables here
var dog, happy, dogsprite;
var database;
var foodS, foodStock,foodObj;
var foodStock, lastFed;
var feed, add;
var fedTime;
var gameState ,readState;

function preload()
{
	//load images here
  dog = loadImage("images/dogImg.png");
  happy = loadImage("virtual pet images/happy dog.png");
  bedroom = loadImage("virtual pet images/Bed Room.png");
  livingroom = loadImage("virtual pet images/Living Room.png");
  washroom = loadImage("virtual pet images/Wash Room.png");
}

function setup() {
	database = firebase.database();
  createCanvas(500, 700);

  foodObj = new Food();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  
  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState-data.val();
  })

  foodStock=database.ref('Food');
  foodStock.on("value",readStock); 

  dogsprite = createSprite(750,250,25,25);
  dogsprite.addImage(dog)
  dogsprite.scale = 0.15;

  feed = createButton("Feed The Dog");
  feed.position(500,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}
 

function draw() {  
background(46,139,87)


if(gameState!="Hungry"){
  feed.hide();
  addFood.hide();
  dogsprite.remove();
}else{
  feed.show();
  addFood.show();
  dogsprite.addImage(sadDog);
}

currentTime=hour();
if(currentTime==(lastFed+1)){
  update("Playing");
  foodObj.garden();
}else if(currentTime==(lastFed+2)){
  update("Sleeping");
  foodObj.bedroom();
}else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
  update("Bathing");
  foodObj.washroom();
}else{
  update("Hungry");
  foodObj.display();
}

//new Food();

  drawSprites();
  //add styles here


}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){
  
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }
  database.ref('/').update({
    Food:x
  })
}

function feedDog(){
  dogsprite.addImage(happy);

 foodObj.updateFoodStock(foodObj.getFoodStock()-1);
 database.ref('/').update({
    Food:foodObj.getFoodStock(),
     FeedTime : hour(),
    gameState:"Hungry"
  })
}


  
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}