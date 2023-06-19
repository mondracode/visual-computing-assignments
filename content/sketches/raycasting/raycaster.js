const degree = 0.0174533;

let observer, grid;
let pressedKeys = {};
let rays;

function setup() {
  createCanvas(512, 1024);

  observer = new Observer(200, 200);
  grid = new Grid();
  rays = new Rays(observer.x, observer.y, observer, grid);
}

function draw() {
  background(220);
  grid.draw();

  observer.draw();
  rays.draw();

  observer.move();
}

function keyPressed() {
  pressedKeys[key] = true;
}

function keyReleased() {
  delete pressedKeys[key];
}

class Observer {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.deltaX = Math.cos(this.angle);
    this.deltaY = Math.sin(this.angle);

    this.draw = () => {
      strokeWeight(5);
      point(this.x, this.y);
      line(this.x, this.y, this.x + this.deltaX * 10, this.y + this.deltaY * 10)
    }

    this.move = () => {// keypress logic - 87 for W and 83 for S

      if (pressedKeys.a) {

        this.angle -= 0.01;
        if (this.angle < 0) {
          this.angle += 2 * PI;
        }
        this.deltaX = Math.cos(this.angle);
        this.deltaY = Math.sin(this.angle);
      }
      if (pressedKeys.d) {
        this.angle += 0.01;
        if (this.angle > 2 * PI) {
          this.angle -= 2 * PI;
        }
        this.deltaX = Math.cos(this.angle);
        this.deltaY = Math.sin(this.angle);
      }
      if (pressedKeys.w) {

        this.x += this.deltaX;
        this.y += this.deltaY
      }
      if (pressedKeys.s) {

        this.x -= this.deltaX;
        this.y -= this.deltaY
      }
    }
  }
}

class Grid {
  constructor() {
    this.gridSize = 64;
    this.map =
      [
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1]
      ];
    this.mapWidth = this.map[0].length;
    this.mapHeight = this.map.length;


    this.drawCell = (x, y) => {
      fill(51);
      strokeWeight(1);
      square(x, y, this.gridSize);
    };

    this.draw = () => {
      for (let vIndex = 0; vIndex < this.mapHeight; vIndex++) {
        for (let hIndex = 0; hIndex < this.mapWidth; hIndex++) {
          if (this.map[vIndex][hIndex] === 1) {
            this.drawCell(hIndex * this.gridSize, vIndex * this.gridSize)
          }
        }
      }
    }
  }
}

class Rays {
  constructor(x, y, observer, grid) {

    this.getDistanceFromAtoB = (ax, ay, bx, by) => {
      return Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2)
    }

    this.draw = () => {
      let rayXPosition, rayYPosition, rayAngle;
      let rayX, rayY, rayXOffset, rayYOffset;

      rayAngle = observer.angle - (degree * 30)
      if (rayAngle < 0) {
        rayAngle += 2 * PI
      }
      if (rayAngle > 2 * PI) {
        rayAngle -= 2 * PI
      }

      for (let index = 0; index < 64; index++) {
        // H check
        this.drawDistance = 0;
        let finalDistance = 0;
        let hDistanceToWall = 1000000;
        let rayXIntersection = observer.x;
        let rayYIntersection = observer.y;

        let angleCot = -1.0 / Math.tan(rayAngle)

        if (rayAngle > PI) {
          rayY = ((Math.floor(observer.y) >> 6) << 6) - 0.0001;
          rayX = (observer.y - rayY) * angleCot + observer.x;
          rayYOffset = -64
          rayXOffset = -rayYOffset * angleCot
        }
        if (rayAngle < PI) {
          rayY = ((Math.floor(observer.y) >> 6) << 6) + 64;
          rayX = (observer.y - rayY) * angleCot + observer.x;
          rayYOffset = 64
          rayXOffset = -rayYOffset * angleCot
        }
        if (rayAngle === 0 || rayAngle === PI) {
          rayX = observer.x
          rayY = observer.y
          this.drawDistance = 8
        }

        while (this.drawDistance < 8) {
          rayXPosition = Math.floor(rayX) >> 6
          rayYPosition = Math.floor(rayY) >> 6

          if (rayXPosition < grid.map[0].length && rayXPosition >= 0
            && rayYPosition < grid.map.length && rayYPosition >= 0
            && grid.map[rayYPosition][rayXPosition] === 1) {

            rayXIntersection = rayX
            rayYIntersection = rayY

            hDistanceToWall = this.getDistanceFromAtoB(observer.x, observer.y, rayXIntersection, rayYIntersection);
            this.drawDistance = 8
          } else {
            rayX += rayXOffset
            rayY += rayYOffset
            this.drawDistance += 1
          }
        }

        // V check
        this.drawDistance = 0;
        let vDistanceToWall = 1000000;
        let rayVXIntersection = observer.x;
        let rayVYIntersection = observer.y;

        let angleNTan = -Math.tan(rayAngle)

        if (rayAngle > PI / 2 && rayAngle < 3 * PI / 2) {
          rayX = ((Math.floor(observer.x) >> 6) << 6) - 0.0001;
          rayY = (observer.x - rayX) * angleNTan + observer.y;
          rayXOffset = -64
          rayYOffset = -rayXOffset * angleNTan
        }
        if (rayAngle < PI / 2 || rayAngle > 3 * PI / 2) {
          rayX = ((Math.floor(observer.x) >> 6) << 6) + 64;
          rayY = (observer.x - rayX) * angleNTan + observer.y;
          rayXOffset = 64
          rayYOffset = -rayXOffset * angleNTan
        }
        if (rayAngle === 0 || rayAngle === PI) {
          rayY = observer.y
          rayX = observer.x
          this.drawDistance = 8

        }

        while (this.drawDistance < 8) {
          rayXPosition = Math.floor(rayX) >> 6
          rayYPosition = Math.floor(rayY) >> 6

          if (rayXPosition < grid.map[0].length && rayXPosition >= 0
            && rayYPosition < grid.map.length && rayYPosition >= 0
            && grid.map[rayYPosition][rayXPosition] === 1) {

            rayVXIntersection = rayX
            rayVYIntersection = rayY
            vDistanceToWall = this.getDistanceFromAtoB(observer.x, observer.y, rayVXIntersection, rayVYIntersection);

            this.drawDistance = 8
          } else {
            rayX += rayXOffset
            rayY += rayYOffset
            this.drawDistance += 1
          }
        }

        if (vDistanceToWall < hDistanceToWall) {
          fill(0, 120, 0)
          rayX = rayVXIntersection;
          rayY = rayVYIntersection;
          finalDistance = vDistanceToWall;
        } else {
          fill(0, 150, 0)
          rayX = rayXIntersection;
          rayY = rayYIntersection;
          finalDistance = hDistanceToWall;
        }

        strokeWeight(3);
        stroke(255, 0, 0)
        line(observer.x, observer.y, rayX, rayY);
        stroke(0)

        // rendering
        let angleDiff = observer.angle - rayAngle
        if (angleDiff < 0) {
          angleDiff += 2 * PI
        }
        if (angleDiff > 2 * PI) {
          angleDiff -= 2 * PI
        }
        finalDistance *= Math.cos(angleDiff);

        let lineHeight = (grid.mapWidth * 512) / finalDistance;
        if (lineHeight > 512) {
          lineHeight = 512;
        }
        let lineBaseline = 256 - lineHeight / 2;

        noStroke();
        rect(index * 8, 512 + lineBaseline, 8, lineHeight)
        stroke(0)

        rayAngle += degree
        if (rayAngle < 0) {
          rayAngle += 2 * PI
        }
        if (rayAngle > 2 * PI) {
          rayAngle -= 2 * PI
        }
      }
    }
  }
}