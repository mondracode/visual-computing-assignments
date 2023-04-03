let img;

const clouds = [];
const birds = [];
const airplanes = [];
const border = 50;
const intervalLowerBound = 100;
const intervalUpperBound = 260;
const numberOfIntervals = 4;
const NUMBER_OF_CLOUD_LAYERS = 2;
const NUMBER_OF_BIRD_LAYERS = 3;
var depthOfField = 0;

function preload() {
  // Carga la imagen antes de que el sketch se ejecute
  let hostURL = "https://mondracode.github.io/visual-computing-assignments";
  // let hostURL = "http://localhost:1313/visual-computing-assignments";

  bgImg = loadImage(`${hostURL}/assets/cielo_background.jpg`);
  cloudImg = loadImage(`${hostURL}/assets/cloud.webp`);
  birdsGif = loadImage(`${hostURL}/assets/birds.gif`);
  airplaneImg = loadImage(`${hostURL}/assets/plane.png`);
  skyscrapers = loadImage(`${hostURL}/assets/skyscrapers.png`);
  manGif = loadImage(`${hostURL}/assets/fallingman.gif`);

  // Load blurred images
  blurredSkyscrapers = [];
  for (let i = 0; i < numberOfIntervals; i++) {
    blurredSkyscrapers.push(
      loadImage(`${hostURL}/assets/skyscrapers_blur_00${i}.png`)
    );
  }
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

  // Setup skyscrapers
  skyscrapersLayer = new Skyscrapers(1);

  // Setup man
  fallingMan = new Man(3);

  // Setup the blurred plane
  blurredPlaneFactory = new BlurredPlaneFactory(
    intervalLowerBound,
    intervalUpperBound,
    numberOfIntervals
  );
  blurredPlaneIntervals = blurredPlaneFactory.generateIntervals();
}

function draw() {
  // get the interval for the current depth
  let interval = blurredPlaneFactory.getDiscreteIntervalForDepth(depthOfField);
  console.log(interval);
  // set the blurred plane
  let blurredSkyscraper =
    blurredPlaneFactory.getBlurredPlaneForQuantizedInterval(
      interval,
      "skyscrapers"
    );

  // Use the background image on canva
  background(bgImg);

  // print the different clouds
  for (const cloud of clouds) {
    cloud.draw();
  }

  // print the airplane
  for (const airplane of airplanes) {
    airplane.draw();
  }

  // draw linear perspective skyscrapers
  skyscrapersLayer.draw(blurredSkyscraper);

  // draw falling man
  fallingMan.draw();

  // print the different birds
  for (const bird of birds) {
    bird.draw();
  }

  // draw blurred plane
}

class BlurredPlaneFactory {
  constructor(rangeInit, rangeEnd, n) {
    this.a = rangeInit;
    this.b = rangeEnd;
    this.n = n;
  }

  generateIntervals() {
    const intervalDelta = (this.b - this.a) / this.n;
    const intervals = Array.from(
      { length: this.n },
      (_, i) => this.a + (i + 1) * intervalDelta
    );

    this.intervals = intervals;

    return this.intervals;
  }

  getDiscreteIntervalForDepth(depth) {
    let interval = 0;
    for (let i = 0; i < this.n; i++) {
      if (depth > this.intervals[i]) {
        interval = i;
      }
    }
    return interval;
  }

  getBlurredPlaneForQuantizedInterval(interval, category) {
    switch (category) {
      case "skyscrapers":
        return blurredSkyscrapers[interval];
      default:
        return blurredSkyscrapers[interval];
    }
  }
}

class Birds {
  constructor(layer) {
    this.layer = layer;
    this.x = random(-border, width + border);
    this.y = random(-border, height + border);
  }

  draw() {
    let deltaX = 0;
    deltaX = this.layer;
    this.x -= deltaX * 0.6;

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
  constructor(layer) {
    this.layer = layer;
    this.x = random(-border, width + border);
    this.y = random(-border, height + border);
  }

  draw() {
    let deltaX = 0;
    deltaX = this.layer;
    this.x += deltaX * 0.3;

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
    this.x = -this.layer * 250 * 1.5;
    this.y = height - this.layer * 250 * 1;
  }

  draw() {
    let deltaX = 0;
    let deltaY = 0;
    deltaX = this.layer;
    deltaY = this.layer * 0.5;
    this.x += deltaX;
    this.y -= deltaY;

    image(
      airplaneImg,
      this.x,
      this.y,
      this.layer * 250 * 1.5,
      this.layer * 250 * 1
    );
  }
}

class Skyscrapers {
  constructor(layer) {
    this.layer = layer;
    this.x = 0;
    this.y = 0;
  }

  draw(imageToDraw) {
    image(imageToDraw, this.x, this.y, 500, 500);
  }
}

class Man {
  constructor(layer) {
    this.layer = layer;
    this.x = width / 2;
    this.y = height / 2;
    this.sizeMultiplier = 0;
    this.deltaX = 0;
    this.deltaY = 0;
  }

  draw() {
    this.sizeMultiplier += 0.002;
    this.deltaX -= 0.5;
    this.deltaY += 1;

    if (this.deltaX < 140 && this.deltaY > 225) {
      this.deltaX = 0;
      this.deltaY = 0;
      this.sizeMultiplier = 0.002;
    }

    image(
      manGif,
      this.x + this.deltaX,
      this.y + this.deltaY,
      507 * (this.sizeMultiplier % 1),
      358 * (this.sizeMultiplier % 1)
    );

    depthOfField = this.x + this.deltaX;

    text("depth: " + depthOfField, 10, 30);
  }
}
