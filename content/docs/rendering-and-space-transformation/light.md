---
title: 1. Lights
type: docs
---

# **Lights**

## **Introduction**

With our code, you can delve into the world of computer-generated visuals and explore different types of lights to achieve stunning visual effects in your projects. You have the flexibility to switch between three main light types: "Point Light", "Directional Light", and "Ambient Light". Each light type offers a distinct way to illuminate and accentuate objects in your scene.

A standout feature of our code is the ability to precisely control the position of the light source. Through interactive sliders, you can effortlessly fine-tune the light's location in 3D space, granting you complete control over the desired lighting effect. Whether you want to emphasize a specific object or create a diffuse and ambient illumination, our code provides the means to achieve it.

This solution is particularly valuable for those aiming to create immersive visual experiences such as games, simulations, or artistic renderings. With its intuitive interface and powerful tools, you can breathe life into your ideas and evoke a range of emotions in your audience through the skillful use of lighting.

Furthermore, our code follows efficient rendering principles and techniques, ensuring optimal performance even in complex projects. You can rely on its ability to handle large numbers of polygons and objects without compromising visual quality.

In summary, our code offers complete control over lighting in 3D environments, enabling you to create visually stunning and captivating effects. Whether you are a developer seeking to enhance the graphical quality of your games or a digital artist exploring new forms of visual expression, our Spotlight-based solution is an indispensable and powerful asset in your creative arsenal.

## **Solution - a p5.js example**

The code provided is an implementation of a program that uses the p5.js library to create a visual representation of a 3D scene. In particular, the code focuses on the use of lights in the scene and allows the user to switch between different types of lights, such as point light, directional light and ambient light.

In the initial setup of the program, three buttons are created: "Point Light", "Directional Light" and "Ambient Light". These buttons allow the user to change the type of light in the scene.

In addition, variables are defined to store the position of the light on the x, y and z axes. These variables are later used to correctly position the light in the scene.

The `showHideSliders()` function is responsible for showing or hiding the sliders depending on the type of light selected. For example, if point light is selected, sliders will be created to adjust the x, y and z coordinates of the light's position. These sliders allow the user to control the position of the light in the scene.

In the `draw()` function, the canvas is set up and the background is set. Next, a series of transformations are performed on the scene to achieve a rotation effect.

Then, the `showHideSliders()` function is called to make sure that the sliders are displayed correctly according to the selected light type.

Finally, a series of conditionals are used to apply the selected light type to the scene. Depending on the type of light, a combination of functions such as `pointLight()`, `directionalLight()` and `ambientLight()` are used to illuminate the object in the scene.

The program also uses the `ambientMaterial()` function to set the object's material and `torus()` to draw a toroid in the scene.

In summary, this code shows an example of how to use different types of lights in a 3D scene and allows the user to interact with the position of the point light through sliders.

{{< p5-iframe sketch="/visual-computing-assignments/sketches/space-transformation/lights.js" width="625" height="625" >}}

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

## **Future work**

With the use of some advanced shading techniques like raytracing, the computing of lighting on dynamic entities on a 3D plane has reached new frontiers in realism and computational complexity. Applying some of these techniques can improve the objective of this assignment, and some other methods like raycasting (seen on the next example) could be used to add further functionality (by implementing e.g. a flashlight that casts rays and affects lighting locally).
