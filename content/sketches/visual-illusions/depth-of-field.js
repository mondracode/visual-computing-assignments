let x = 0; // initial x position
let y = 0; // initial y position
let z = 200; // initial z position
let rectWidth = 40;
let rectHeight = 50;
let zSpeedMag = 0.4;
let zSpeedVec = zSpeedMag;
let zRangeFront = 240;
let zRangeBack = 50;
let focalRangeInit = 0;
let focalRangeEnd = 20;

const canvasWidth = 500;
const canvasHeight = 400;

function preload() {
  imgCardOriginal = loadImage(
    "https://paul-moros-visual-computing.s3.us-east-2.amazonaws.com/poker-dogs.jpg"
  );
  imgCardBlur = loadImage(
    "https://paul-moros-visual-computing.s3.us-east-2.amazonaws.com/poker-dogs.jpg"
  );
  imgBg = loadImage(
    "https://paul-moros-visual-computing.s3.us-east-2.amazonaws.com/poker-bg2.jpg"
  );
}

function setup() {
  createCanvas(canvasWidth, canvasHeight, WEBGL);
  sliderFocalRangeInit = createSlider(-50, 200, -50); // create a slider with minimum value of 0, maximum value of 100, and starting value of 50
  sliderFocalRangeInit.position(10, 10); // set the position of the slider
  sliderFocalRangeInit.style("width", "80px"); // set the width of the slider\

  sliderFocalRangeEnd = createSlider(-50, 200, 200); // create a slider with minimum value of 0, maximum value of 100, and starting value of 50
  sliderFocalRangeEnd.position(10, 40); // set the position of the slider
  sliderFocalRangeEnd.style("width", "80px"); // set the width of the slider

  imgCardBlur.filter(BLUR, 4);
}

let blur = false;
function draw() {
  background(255);
  drawCardWithImageBlur(imgBg, 0, 0, 0, width, height);

  focalRangeInit = sliderFocalRangeInit.value();
  focalRangeEnd = sliderFocalRangeEnd.value();

  let imgCard = imgCardOriginal;
  // move the rectangle in the z-axis
  z += zSpeedVec;

  // check if the ellipse has reached the end of the z-axis
  if (z > zRangeFront) {
    z = zRangeFront;
    zSpeedVec *= -1;
  }

  if (z <= zRangeBack) {
    z = zRangeBack;
    zSpeedVec *= -1;
  }

  if (z < zRangeFront - focalRangeInit && z > zRangeFront - focalRangeEnd) {
    imgCard = imgCardOriginal;
  } else {
    imgCard = imgCardBlur;
  }

  // Cards moving backwards
  push(); // save the current drawing state
  translate(x, y, z); // move the rectangle in the z-axis
  drawCardWithImageBlur(imgCard, x, y, rectWidth, rectHeight);
  drawCardWithImageBlur(imgCard, x - 50, y, rectWidth, rectHeight);
  drawCardWithImageBlur(imgCard, x + 50, y, rectWidth, rectHeight);
  pop(); // restore the previous drawing state
}

function drawCardWithImageBlur(img, x, y, width, height) {
  fill(255);
  strokeWeight(0.5);
  rectMode(CENTER);
  rect(x, y, width, height);
  // draw the image within the rectangle
  if (img) {
    imageMode(CENTER);
    image(img, x, y, width, height);
  }
}
