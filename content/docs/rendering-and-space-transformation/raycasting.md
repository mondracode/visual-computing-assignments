---
title: 2. Raycasting
type: docs
---

# **Raycasting**

## **Introduction**

## **Solution - a p5.js example**

This code is a simplified implementation of a raycasting algorithm in JavaScript. The algorithm is used to render a 2D grid map consisting of with walls and an observer that can move within the scene.

The code is divided into its main components:

### Constants and Variables:

- `degree = 0.0174533` This constant represents the conversion factor from degrees to radians. It's useful to keep this conversion factor as JS
  only works with radians by default.

- `observer`, `grid`: These variables are used to store instances of the Observer and Grid classes, respectively.

- `pressedKeys`: This object stores the state of keys that are currently being pressed. It is used to handle keyboard input for moving the observer.

- `rays`: This variable stores an instance of the Rays class, which is responsible for drawing the rays and calculating the intersections with walls.

### Classes

Observer: This class represents the observer in the scene. It has properties for position (`x` and `y`), `angle`, and direction (`deltaX` and `deltaY`). It also has methods that control the movement and rotation of the observer inside the grid world.

Grid: The grid of the scene. It has properties for the size of each cell (`gridSize`), the map layout (`map`), and the `width` and `height` of the map. It has a method for drawing the `grid` and cells.

Rays: The rays cast by the observer. It has a method for drawing the rays and calculating their intersections with walls. It uses the `getDistanceFromAtoB()` function to calculate the distance between two points, and `draw()` for drawing the rays and calculating their intersections with walls.

The variable `rayAngle` is initialized as the observer's angle minus 30 degrees in radians. Then it casts 64 rays arying by one degree each.

Inside the loop that creates each ray, the method calculates the horizontal (`hDistanceToWall`) and vertical (`vDistanceToWall`) distances to the nearest wall by incrementing the ray's position and checking for intersections with walls in each direction. The method then compares the distances and determines whether the ray hits a horizontal or vertical wall. It updates the `rayX` and `rayY` coordinates accordingly. After determining the final position of the ray, it is drawn on the canvas using line(). The method also calculates the distance from the observer to the intersection point and adjusts it based on the angle difference between the observer's angle and the ray's angle. This distance is used to fix the weird 'fish-eye' effect that comes from raycasting walls based purely on distance.

Finally, the wall slice is drawn on the canvas using rect() based on the calculated height. Each slice is 8 pixels wide and the canvas is 512 \* 1024, split in a 2D and 3D section.

{{< p5-iframe sketch="/visual-computing-assignments/sketches/raycasting/raycaster.js" width="532" height="1044" >}}

## **Code**

```js
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
      line(this.x, this.y, this.x + this.deltaX * 10, this.y + this.deltaY * 10);
    };

    this.move = () => {
      // keypress logic - 87 for W and 83 for S

      if (pressedKeys.a) {
        this.angle -= 0.03;
        if (this.angle < 0) {
          this.angle += 2 * PI;
        }
        this.deltaX = Math.cos(this.angle);
        this.deltaY = Math.sin(this.angle);
      }
      if (pressedKeys.d) {
        this.angle += 0.03;
        if (this.angle > 2 * PI) {
          this.angle -= 2 * PI;
        }
        this.deltaX = Math.cos(this.angle);
        this.deltaY = Math.sin(this.angle);
      }
      if (pressedKeys.w) {
        this.x += this.deltaX;
        this.y += this.deltaY;
      }
      if (pressedKeys.s) {
        this.x -= this.deltaX;
        this.y -= this.deltaY;
      }
    };
  }
}

class Grid {
  constructor() {
    this.gridSize = 64;
    this.map = [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
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
            this.drawCell(hIndex * this.gridSize, vIndex * this.gridSize);
          }
        }
      }
    };
  }
}

class Rays {
  constructor(x, y, observer, grid) {
    this.getDistanceFromAtoB = (ax, ay, bx, by) => {
      return Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2);
    };

    this.draw = () => {
      let rayXPosition, rayYPosition, rayAngle;
      let rayX, rayY, rayXOffset, rayYOffset;

      rayAngle = observer.angle - degree * 30;
      if (rayAngle < 0) {
        rayAngle += 2 * PI;
      }
      if (rayAngle > 2 * PI) {
        rayAngle -= 2 * PI;
      }

      for (let index = 0; index < 64; index++) {
        // H check
        this.drawDistance = 0;
        let finalDistance = 0;
        let hDistanceToWall = 1000000;
        let rayXIntersection = observer.x;
        let rayYIntersection = observer.y;

        let angleCot = -1.0 / Math.tan(rayAngle);

        if (rayAngle > PI) {
          rayY = ((Math.floor(observer.y) >> 6) << 6) - 0.0001;
          rayX = (observer.y - rayY) * angleCot + observer.x;
          rayYOffset = -64;
          rayXOffset = -rayYOffset * angleCot;
        }
        if (rayAngle < PI) {
          rayY = ((Math.floor(observer.y) >> 6) << 6) + 64;
          rayX = (observer.y - rayY) * angleCot + observer.x;
          rayYOffset = 64;
          rayXOffset = -rayYOffset * angleCot;
        }
        if (rayAngle === 0 || rayAngle === PI) {
          rayX = observer.x;
          rayY = observer.y;
          this.drawDistance = 8;
        }

        while (this.drawDistance < 8) {
          rayXPosition = Math.floor(rayX) >> 6;
          rayYPosition = Math.floor(rayY) >> 6;

          if (
            rayXPosition < grid.map[0].length &&
            rayXPosition >= 0 &&
            rayYPosition < grid.map.length &&
            rayYPosition >= 0 &&
            grid.map[rayYPosition][rayXPosition] === 1
          ) {
            rayXIntersection = rayX;
            rayYIntersection = rayY;

            hDistanceToWall = this.getDistanceFromAtoB(observer.x, observer.y, rayXIntersection, rayYIntersection);
            this.drawDistance = 8;
          } else {
            rayX += rayXOffset;
            rayY += rayYOffset;
            this.drawDistance += 1;
          }
        }

        // V check
        this.drawDistance = 0;
        let vDistanceToWall = 1000000;
        let rayVXIntersection = observer.x;
        let rayVYIntersection = observer.y;

        let angleNTan = -Math.tan(rayAngle);

        if (rayAngle > PI / 2 && rayAngle < (3 * PI) / 2) {
          rayX = ((Math.floor(observer.x) >> 6) << 6) - 0.0001;
          rayY = (observer.x - rayX) * angleNTan + observer.y;
          rayXOffset = -64;
          rayYOffset = -rayXOffset * angleNTan;
        }
        if (rayAngle < PI / 2 || rayAngle > (3 * PI) / 2) {
          rayX = ((Math.floor(observer.x) >> 6) << 6) + 64;
          rayY = (observer.x - rayX) * angleNTan + observer.y;
          rayXOffset = 64;
          rayYOffset = -rayXOffset * angleNTan;
        }
        if (rayAngle === 0 || rayAngle === PI) {
          rayY = observer.y;
          rayX = observer.x;
          this.drawDistance = 8;
        }

        while (this.drawDistance < 8) {
          rayXPosition = Math.floor(rayX) >> 6;
          rayYPosition = Math.floor(rayY) >> 6;

          if (
            rayXPosition < grid.map[0].length &&
            rayXPosition >= 0 &&
            rayYPosition < grid.map.length &&
            rayYPosition >= 0 &&
            grid.map[rayYPosition][rayXPosition] === 1
          ) {
            rayVXIntersection = rayX;
            rayVYIntersection = rayY;
            vDistanceToWall = this.getDistanceFromAtoB(observer.x, observer.y, rayVXIntersection, rayVYIntersection);

            this.drawDistance = 8;
          } else {
            rayX += rayXOffset;
            rayY += rayYOffset;
            this.drawDistance += 1;
          }
        }

        if (vDistanceToWall < hDistanceToWall) {
          fill(0, 120, 0);
          rayX = rayVXIntersection;
          rayY = rayVYIntersection;
          finalDistance = vDistanceToWall;
        } else {
          fill(0, 150, 0);
          rayX = rayXIntersection;
          rayY = rayYIntersection;
          finalDistance = hDistanceToWall;
        }

        strokeWeight(3);
        stroke(255, 0, 0);
        line(observer.x, observer.y, rayX, rayY);
        stroke(0);

        // rendering
        let angleDiff = observer.angle - rayAngle;
        if (angleDiff < 0) {
          angleDiff += 2 * PI;
        }
        if (angleDiff > 2 * PI) {
          angleDiff -= 2 * PI;
        }
        finalDistance *= Math.cos(angleDiff);

        let lineHeight = (grid.mapWidth * 512) / finalDistance;
        if (lineHeight > 512) {
          lineHeight = 512;
        }
        let lineBaseline = 256 - lineHeight / 2;

        noStroke();
        rect(index * 8, 512 + lineBaseline, 8, lineHeight);
        stroke(0);

        rayAngle += degree;
        if (rayAngle < 0) {
          rayAngle += 2 * PI;
        }
        if (rayAngle > 2 * PI) {
          rayAngle -= 2 * PI;
        }
      }
    };
  }
}
```

## **Conclusions**

The ability to control different types of lights, adjust their position and play with lighting effects offers endless possibilities to create atmospheres, highlight specific objects and convey emotions through the right combination of lights and shadows.

Visual computing is an exciting and constantly evolving field that combines programming with visual expression. Through the exploration of lighting, 3D modeling and rendering techniques, professionals can open new doors of creativity and deliver stunning visual experiences in various industries and disciplines.
