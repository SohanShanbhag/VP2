var dog, database, foodS, foodStock;
var fedTime, lastFed;
var feed, addFood;
var foodObj, input;

function preload()
{
  dogImg = loadImage('dogImg.png');
  happyDogImg = loadImage('dogImg1.png');
}

function setup() {
  database = firebase.database();

  createCanvas(500, 500);
  
  dog = createSprite(250, 400);
  dog.addImage(dogImg);  
  dog.scale = 0.2;

  input = createInput('');
  input.position(400, 200);

  foodStock = database.ref('Food');
  foodStock.on('value', readStock);

  foodObj = new Food();

  addFood = createButton("Add Food");
  addFood.position(700, 250);
  addFood.mousePressed(addFoods);

  feed = createButton("Feed " + input.value());
  feed.position(700, 300);
  feed.mousePressed(feedDog);
}


function draw() {
  background("green");  

  fill("white");
  textSize(18);
  text("Name your dog in the box below", 10, 140);


  if(foodS !== undefined){
    textSize(30);
    fill("white")
    text("Stock remaining : " + foodS, 100  , 30);
  }

  foodObj.display()

  fedTime = database.ref("FeedTime");
  fedTime.on('value', function(data){
    this.lastFed = data.val();
  })

  fill(255,255,254);
  textSize(20); 
  if(lastFed>=12){
    text("Last Feed for "+ input.value() +" : " +  lastFed%12 + " PM", 150,80);
   }else if(lastFed==0){
     text("Last Feed for "+ input.value() +" : 12 AM",150,80);
   }else{
     text("Last Feed for "+ input.value() +" : " +  lastFed + " AM", 150,80);
  }

  if(foodS === 0){
    feed.hide();
  }else{
    feed.show();
  }

  drawSprites();
  //add styles here

}

function readStock(data){
  foodS = data.val();
}

function feedDog(){
  dog.addImage(happyDogImg);

  if(foodS > 0){
    foodS = foodS-1
  }

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1)
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })

}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

async function getTime(){ 
}