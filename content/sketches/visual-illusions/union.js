let img;

const clouds = [];
const birds = [];
const airplanes = [];
const border = 50;
const NUMBER_OF_CLOUD_LAYERS = 2;
const NUMBER_OF_BIRD_LAYERS = 3;

function preload() {
  // Carga la imagen antes de que el sketch se ejecute
  let hostURL = "https://mondracode.github.io/visual-computing-assignments/";

  bgImg = loadImage(`${hostURL}/assets/cielo_background.jpg`);
  cloudImg = loadImage(`${hostURL}/assets/cloud.webp`);
  birdsGif = loadImage(`${hostURL}/assets/birds.gif`);
  airplaneImg = loadImage(`${hostURL}/assets/plane.png`);
}

function setup() {
  createCanvas(500, 500);
  
  // Setup the cloud layers and span the diferent clouds
  for (let layer = 1; layer <= NUMBER_OF_CLOUD_LAYERS; layer++) {
    for (let i = 0; i < 5; i++) {
      clouds.push(new Cloud(layer));
    }
  }
  
  // Setup the birds layers and span the diferent birds
  for (let layer = 1; layer <= NUMBER_OF_BIRD_LAYERS; layer++) {
    for (let i = 0; i < 2; i++) {
      birds.push(new Birds(layer));
    }
  }
  
  // Setup the airplane
  airplanes.push(new Airplane(1));
}

function draw() {
  // Use the background image on canva
  background(bgImg);
  
  // print the different clouds
  for (const cloud of clouds) {
    cloud.draw();
  }
  
  // print the different birds
  for (const bird of birds){
    bird.draw();
  }
  
  // print the airplane
  for (const airplane of airplanes){
    airplane.draw();
  }
}

class Birds {
  constructor(layer){
    this.layer = layer;
    this.x = random(-border, width + border);
    this.y = random(-border, height + border);
  }
  
  draw(){
    let deltaX = 0;    
    deltaX = this.layer;
    this.x -= deltaX;
    
    // out of screen control
    if (this.x < -(this.layer * 30 * 1.5)) {
      this.x = width + border;
      this.y = random(0, height);
    } else if (this.x > width + border) {
      this.x = -border;
      this.y = random(0, height);
    }
    
    image(birdsGif, this.x, this.y, this.layer * 30 * 1.5, this.layer * 30 * 1);
  }
}

class Cloud {
  constructor(layer){
    this.layer = layer;
    this.x = random(-border, width + border);
    this.y = random(-border, height + border);
  }
  
  draw(){
    let deltaX = 0;    
    deltaX = this.layer;
    this.x += deltaX;
    
    // out of screen control
    if (this.x < -border) {
      this.x = border;
      this.y = random(0, height);
    } else if (this.x > width + border) {
      this.x = -border;
      this.y = random(0, height);
    }
    
    image(cloudImg, this.x, this.y, this.layer * 20 * 1.5, this.layer * 20 * 1);
  }
}

class Airplane {
  constructor(layer) {
    this.layer = layer;
    this.x = - this.layer * 250 * 1.5;
    this.y = height - this.layer * 250 * 1;
  }
  
  draw() {
    let deltaX = 0;
    let deltaY = 0;
    deltaX = this.layer;
    deltaY = this.layer * 0.5;
    this.x += deltaX;
    this.y -= deltaY;
    
    image(airplaneImg, this.x, this.y, this.layer * 250 * 1.5, this.layer * 250 * 1); 
  }
}