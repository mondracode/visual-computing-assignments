---
title: 2. Raycasting
type: docs
---

# **Raycasting**

## **Introduction**

## **Solution - a p5.js example**

{{< p5-iframe sketch="/visual-computing-assignments/sketches/raycasting/raycaster.js" width="532" height="1044" >}}

## **Code**

```js
let lightType = 'point';
let lightPosX = 140;
let lightPosY = 160;
let lightPosZ = 144;

// Variables para almacenar los sliders y las etiquetas
let sliders = [];
let labels = [];

function setup() {
  createCanvas(600, 600, WEBGL);

  // Crea un botón para cambiar el tipo de luz a pointLight
  let pointButton = createButton('Point Light');
  pointButton.position(10, 10);
  pointButton.mousePressed(() => {
    lightType = 'point';
  });

  // Crea un botón para cambiar el tipo de luz a directionalLight
  let directionalButton = createButton('Directional Light');
  directionalButton.position(120, 10);
  directionalButton.mousePressed(() => {
    lightType = 'directional';
  });

  // Crea un botón para cambiar el tipo de luz a ambientLight
  let ambientButton = createButton('Ambient Light');
  ambientButton.position(260, 10);
  ambientButton.mousePressed(() => {
    lightType = 'ambient';
  });
}

// Función para mostrar u ocultar los deslizadores según el tipo de luz seleccionado
function showHideSliders() {
  // Eliminar los sliders y las etiquetas existentes
  sliders.forEach((slider) => slider.remove());
  labels.forEach((label) => label.remove());
  sliders = [];
  labels = [];

  if (lightType === 'point') {
    // Crear los nuevos sliders y etiquetas
    let yLabel = createP('y:');
    yLabel.position(10, 70);
    labels.push(yLabel);

    let ySlider = createSlider(-height / 2, height / 2, lightPosY);
    ySlider.position(40, yLabel.y + yLabel.height + 5);
    ySlider.input(() => {
      lightPosY = ySlider.value();
    });
    sliders.push(ySlider);

    let xLabel = createP('x:');
    xLabel.position(10, ySlider.y + ySlider.height + 5);
    labels.push(xLabel);

    let xSlider = createSlider(-width / 2, width / 2, lightPosX);
    xSlider.position(40, xLabel.y + xLabel.height + 5);
    xSlider.input(() => {
      lightPosX = xSlider.value();
    });
    sliders.push(xSlider);

    let zLabel = createP('z:');
    zLabel.position(10, xSlider.y + xSlider.height + 5);
    labels.push(zLabel);

    let zSlider = createSlider(-width, width, lightPosZ);
    zSlider.position(40, zLabel.y + zLabel.height + 5);
    zSlider.input(() => {
      lightPosZ = zSlider.value();
    });
    sliders.push(zSlider);
  }
}

function draw() {
  background(220);

  let dx = mouseX - width / 2;
  let dy = mouseY - height / 2;

  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);

  showHideSliders();

  if (lightType === 'point') {
    pointLight(0, 255, 255, lightPosX, lightPosY, lightPosZ);
  } else if (lightType === 'directional') {
    directionalLight(51, 102, 126, -dx, -dy, -1);
  } else if (lightType === 'ambient') {
    ambientLight(255, 255, 200);
  }

  ambientMaterial(0, 0, 255);
  torus(100, 60);
}
```

## **Conclusions**

The ability to control different types of lights, adjust their position and play with lighting effects offers endless possibilities to create atmospheres, highlight specific objects and convey emotions through the right combination of lights and shadows.

Visual computing is an exciting and constantly evolving field that combines programming with visual expression. Through the exploration of lighting, 3D modeling and rendering techniques, professionals can open new doors of creativity and deliver stunning visual experiences in various industries and disciplines.
