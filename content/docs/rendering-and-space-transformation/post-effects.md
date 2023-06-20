---
title: 3. Post Effects
type: docs
---

## **Introduction**

For post effects we show the depth of field using WebGL shaders. The depth of field is a post effect that simulates the focus of a camera. The focus is set to the center of the screen and the depth of field is calculated using the distance of the objects to the camera. This effect is achieved in P5.js using a shader that blurs the objects in the scene. For the shader we have: the vertex shader (`vert`) performs the necessary calculations to transform the vertices of a 3D model from object space to clip space. The uniforms `uModelViewMatrix`, `uProjectionMatrix`, and `uNormalMatrix` are used for the transformations. The resulting position in clip space is stored in `gl_Position`, and the vertex texture coordinates are passed to the fragment shader through `vVertTexCoord`.

The main function then applies the focal blur effect by sampling neighboring pixels and blending them based on their depth values. It iterates over a maximum number of samples (`MAX_NUM_SAMPLES`) but stops if the number of samples exceeds `uNumSamples`. Each sample is offset based on its position around the center pixel, and the corresponding depth value is obtained from the depth texture. The sample's blur amount is calculated using `calcBlur`.

A weight value is determined based on whether the sampled depth is greater than or equal to the original depth, or if the sample's blur amount is greater than the calculated blur amount for the center pixel. This weight determines the contribution of the sample to the final color. The color is accumulated by blending the sampled color with the weight, and the total weight is accumulated as well.

<div style="display: flex; justify-content: center;">
  {{< p5-iframe sketch="/visual-computing-assignments/sketches/post-effects/floating.js" width="350" height="350" >}}
</div>

## **Code**

```javascript
const vert = `attribute vec3 aPosition;
  attribute vec3 aNormal;
  attribute vec2 aTexCoord;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform mat3 uNormalMatrix;

  varying highp vec2 vVertTexCoord;

  void main(void) {
    vec4 positionVec4 = vec4(aPosition, 1.0);
    gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
    vVertTexCoord = aTexCoord;
  }
`;
```

```javascript
const vert = `attribute vec3 aPosition;
  attribute vec3 aNormal;
  attribute vec2 aTexCoord;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform mat3 uNormalMatrix;

  varying highp vec2 vVertTexCoord;

  void main(void) {
    vec4 positionVec4 = vec4(aPosition, 1.0);
    gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
    vVertTexCoord = aTexCoord;
  }
`;
```

```javascript
const frag = `precision mediump float;
  varying highp vec2 vVertTexCoord;

  uniform sampler2D uImg;
  uniform sampler2D uDepth;
  uniform vec2 uSize;
  uniform float uIntensity;
  uniform int uNumSamples;
  uniform float uTargetZ;
  uniform float uNear;
  uniform float uFar;

  const int MAX_NUM_SAMPLES = 20;

  float depthToZ(float depth) {
    float depthNormalized = 2.0 * depth - 1.0;
    return 2.0 * uNear * uFar / (uFar + uNear - depthNormalized * (uFar - uNear));
  }

  float calcBlur(float z, float pixelScale) {
    return clamp(abs(z - uTargetZ), 0.0, 0.5*pixelScale);
  }

  void main() {
    float pixelScale = max(uSize.x, uSize.y);
    float total = 1.0;
    vec4 color = texture2D(uImg, vVertTexCoord);
    float origZ = depthToZ(texture2D(uDepth, vVertTexCoord).x);
    float blurAmt = calcBlur(origZ, pixelScale);
    for (int i = 0; i < MAX_NUM_SAMPLES; i++) {
      if (i >= uNumSamples) break;
      float z = depthToZ(texture2D(uDepth, vVertTexCoord + offset).x);
      float sampleBlur = calcBlur(z, pixelScale);
      float weight = float((z >= origZ) || (sampleBlur >= blurAmt*radius + 0.));
      vec4 sample = texture2D(uImg, vVertTexCoord + offset);
      color += weight * sample;
      total += weight;
    }
    color /= total;
    gl_FragColor = color;
  }
  `;
```

```javascript
/*

A ball floating the water

*/
var bg;
const stepTime = 2500; // ms
const stepSeparation = 150;
const holeRadius = 100;
const holeDepth = 500;

let fbo;
let blurShader;
let ballZ = -1000; // Initial ball Z position

function setup() {
  createCanvas(350, 325, WEBGL);
  pixelDensity(1);
  bg = loadImage("water.jpg");
  fbo = new Framebuffer(window);
  blurShader = createShader(vert, frag);
}

function draw() {
  const eyeZ = height / 2 / tan(PI / 6);
  const near = eyeZ / 10;
  const far = eyeZ * 10;
  perspective(PI / 3, width / height, near, far);

  const linearStepProgress = (millis() % stepTime) / stepTime;
  const stepProgress = Ease.easeInOutCubic(linearStepProgress);
  const stepSide = millis() % (2 * stepTime) >= stepTime ? -1 : 1;

  const targetDepth = holeDepth;
  const blurIntensity =
    0.02 + 0.01 * sin(((millis() % (5 * stepTime)) / (5 * stepTime)) * TWO_PI);

  fbo.draw(() => {
    clear();
    push();

    background(0, 100); // Adjust the background brightness
    image(bg, -200, -200);
    noStroke();

    // Point up at the light
    rotateX(PI * 0.35);

    // Sway from side to side each step
    rotateZ(sin((0.5 + linearStepProgress) * PI) * stepSide * PI * 0.008);

    rotateZ(
      sin((Ease.easeInOutQuad(linearStepProgress) + 0.5) * TWO_PI) *
        stepSide *
        PI *
        0.0025
    );

    // Extra motion
    const fiveStep = (millis() % (5 * stepTime)) / (5 * stepTime);
    const fourStep = (millis() % (4 * stepTime)) / (4 * stepTime);
    translate(
      10 * sin(fiveStep * TWO_PI),
      20 * cos(fourStep * TWO_PI),
      30 * sin(fiveStep * TWO_PI + 300)
    );

    noLights();
    push();
    fill(255, 165, 0); // Orange color
    sphere(100);
    pop();

    pointLight(255, 255, 255, 0, -900, -400);

    // (Anchor shape)
    push();
    fill(180);

    // Vertical bar
    push();
    translate(0, -900, 0);
    cylinder(15, 3000);
    pop();

    pop();

    pop();
  });

  clear();

  push();

  noStroke();
  rectMode(CENTER);
  shader(blurShader);
  _renderer
    .getTexture(fbo.depth)
    .setInterpolation(_renderer.GL.NEAREST, _renderer.GL.NEAREST);
  blurShader.setUniform("uImg", fbo.color);
  blurShader.setUniform("uDepth", fbo.depth);
  blurShader.setUniform("uSize", [width, height]);
  blurShader.setUniform("uIntensity", blurIntensity);
  blurShader.setUniform("uNumSamples", 15);
  blurShader.setUniform("uTargetZ", targetDepth);
  blurShader.setUniform("uNear", near);
  blurShader.setUniform("uFar", far);

  rect(0, 0, width, -height);

  pop();

  // Update the ball position
  if (ballZ < holeDepth + holeRadius) {
    const fallSpeed = 0.5;
    ballZ += fallSpeed;
  }
}
```

## Conclusion

Thanks to P5JS providing us the texture and depth buffer, we can easily implement the depth of field effect. The shader allows us to render the scene precisely and efficiently. The depth of field effect is a very useful effect in the 3D scene. It can help us to focus on the object we want to see and blur the background. It is also a very common effect in movies. The depth of field effect can make the scene more realistic and more comfortable to watch. However implementing this effect can get tricky, given teh usage of buffers and the use of easing functions to create the effect.
