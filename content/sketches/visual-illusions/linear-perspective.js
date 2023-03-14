function setup() {
  createCanvas(400, 400);
  background(220);
  depth = 75
}

function draw() {
  // wall
  fill(220, 220, 220, 100)
  stroke(0, 0, 0, 0);
  rect(0, 0, 400, 200);

  //sky
  fill(130, 200, 255, 200);
  rect(0, 0, 400, 200 - 2 * depth);

  // road lines
  stroke(0, 0, 0, 0);
  fill(0, 0, 0, 200);
  triangle(200 - depth, 200, 200 - depth, 400, 50, 400)
  triangle(200 + depth, 200, 200 + depth, 400, 350, 400)
  rect(200 - depth, 200, depth * 2, 200)

  // ground
  stroke(0, 0, 0, 0);
  fill(255, 178, 0, 200);
  rect(0, 200, 400, 400);

  //shape one
  stroke(0, 0, 0, 150)
  fill(230, 0, 0, 200)
  ellipse(200 + 2 * depth, 205 + 3 * depth, 2 * depth, 2 * depth)

  //shape two
  fill(0, 200, 0, 200)
  rect(185 - 2.5 * depth, 200 + 0.1 * depth, 0.4 * depth, 0.4 * depth)

  // tunnel
  fill(0, 0, 0, 200)
  rect(200 - depth, 200, 2 * depth, -depth)

  // keypress logic
  if (keyCode === UP_ARROW && keyIsPressed === true && depth < 75) {
    depth += 0.35;
  } else if (keyCode === DOWN_ARROW && keyIsPressed === true && depth > 1) {
    depth -= 0.35;
  }

  text('depth: ' + Math.floor(depth), 10, 30);
}