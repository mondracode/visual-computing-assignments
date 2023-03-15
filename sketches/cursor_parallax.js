// instance mode of: 
// https://p5js.org/examples/color-relativity.html

const dots = [];
const BORDER = 100;
const NUMBER_OF_LAYERS = 6
const WIDTH = 625
const HEIGHT = 625

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

new p5((p) => {


  p.setup = function () {
    p.createCanvas(WIDTH, HEIGHT);

    for (let layer = 1; layer <= NUMBER_OF_LAYERS; layer++) {
      for (let i = 0; i < 200 / layer; i++) {
        dots.push(new Dot(layer));
      }
    }
  }

  p.draw = function () {
    p.background('#EDEDED');
    for (const dot of dots) {
      dot.draw();
    }
  }

  class Dot {
    constructor(layer) {
      this.layer = layer;
      this.x = getRandomArbitrary(-BORDER, p.width + BORDER);
      this.y = getRandomArbitrary(-BORDER, p.height + BORDER);

      this.r = getRandomArbitrary(0, 256);
      this.g = getRandomArbitrary(0, 256);
      this.b = getRandomArbitrary(0, 256);
    }

    draw() {
      let deltaX = 0;
      let deltaY = 0;

      // Esta condicional determina la velocidad delta en X y Y.
      if (p.mouseX != 0 && p.mouseY != 0) {
        deltaX = -this.layer * p.map(p.mouseX - p.width / 2, 0, p.width, 0, 2);
        deltaY = -this.layer * p.map(p.mouseY - p.height / 2, 0, p.height, 0, 2);
      }

      this.x += deltaX;
      this.y += deltaY;

      // Si el punto sale del viewport en x, vuelve a aparecer en el otro borde en x, con una posicion en y aleatoria
      if (this.x < -BORDER) {
        this.x = p.width + getRandomArbitrary(0, BORDER);
        this.y = getRandomArbitrary(0, p.height);
      } else if (this.x > p.width + BORDER) {
        this.x = 0 - getRandomArbitrary(0, BORDER);
        this.y = getRandomArbitrary(0, p.height);
      }

      // Si el punto sale del viewport en y, vuelve a aparecer en el otro borde en y, con una posicion en x aleatoria
      if (this.y < -BORDER) {
        this.y = p.height + getRandomArbitrary(0, BORDER);
        this.x = getRandomArbitrary(0, p.width);
      } else if (this.y > p.height + BORDER) {
        this.y = 0 - getRandomArbitrary(0, BORDER);
        this.x = getRandomArbitrary(0, p.width);
      }

      // se pinta el punto, pero el tamaño se define dependiendo del layer en que se encuentre. (el primero layer es el del fondo y el ultimo el de alfrente).
      p.fill(p.color(this.r, this.g, this.b));
      p.circle(this.x, this.y, 60 / ((NUMBER_OF_LAYERS + 1) - this.layer));
    }
  }
}, "cursor_parallax");