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

  float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }

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
      float t = (float(i + 1) / float(uNumSamples));
      float angle = (t*4.0) * ${2 * Math.PI};
      float radius = 1.0 - (t*t*t); // Sample more on the outer edge
      angle += 1.*rand(gl_FragCoord.xy);
      vec2 offset = (vec2(cos(angle),sin(angle)) * radius * uIntensity * blurAmt)/pixelScale;
      float z = depthToZ(texture2D(uDepth, vVertTexCoord + offset).x);
      float sampleBlur = calcBlur(z, pixelScale);

      //float weight = float(z >= origZ);
      float weight = float((z >= origZ) || (sampleBlur >= blurAmt*radius + 0.));
      vec4 sample = texture2D(uImg, vVertTexCoord + offset);
      color += weight * sample;
      total += weight;
    }
    color /= total;
    gl_FragColor = color;
  }
  `;

class RawTextureWrapper extends p5.Texture {
  constructor(renderer, obj, w, h) {
    super(renderer, obj);
    this.width = w;
    this.height = h;
    return this;
  }

  _getTextureDataFromSource() {
    return this.src;
  }

  init(tex) {
    const gl = this._renderer.GL;
    this.glTex = tex;

    this.glWrapS = this._renderer.textureWrapX;
    this.glWrapT = this._renderer.textureWrapY;

    this.setWrapMode(this.glWrapS, this.glWrapT);
    this.setInterpolation(this.glMinFilter, this.glMagFilter);
  }

  update() {
    return false;
  }
}

class Framebuffer {
  constructor(canvas) {
    this._renderer = canvas._renderer;

    const gl = this._renderer.GL;
    const ext = gl.getExtension("WEBGL_depth_texture");

    const width = this._renderer.width;
    const height = this._renderer.height;
    const density = this._renderer._pInst._pixelDensity;

    const colorTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, colorTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width * density,
      height * density,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );

    // Create the depth texture
    const depthTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.DEPTH_COMPONENT,
      width * density,
      height * density,
      0,
      gl.DEPTH_COMPONENT,
      gl.UNSIGNED_SHORT,
      null
    );

    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      colorTexture,
      0
    );
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.TEXTURE_2D,
      depthTexture,
      0
    );

    const depthP5Texture = new RawTextureWrapper(
      this._renderer,
      depthTexture,
      width * density,
      height * density
    );
    this._renderer.textures.push(depthP5Texture);

    const colorP5Texture = new RawTextureWrapper(
      this._renderer,
      colorTexture,
      width * density,
      height * density
    );
    this._renderer.textures.push(colorP5Texture);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.framebuffer = framebuffer;
    this.depth = depthTexture;
    this.color = colorTexture;
  }

  draw(cb) {
    this._renderer.GL.bindFramebuffer(
      this._renderer.GL.FRAMEBUFFER,
      this.framebuffer
    );
    cb();
    this._renderer.GL.bindFramebuffer(this._renderer.GL.FRAMEBUFFER, null);
  }
}

window.Ease = {
  // no easing, no acceleration
  linear: (t) => t,
  // accelerating from zero velocity
  easeInQuad: (t) => t * t,
  // decelerating to zero velocity
  easeOutQuad: (t) => t * (2 - t),
  // acceleration until halfway, then deceleration
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  // accelerating from zero velocity
  easeInCubic: (t) => t * t * t,
  // decelerating to zero velocity
  easeOutCubic: (t) => --t * t * t + 1,
  // acceleration until halfway, then deceleration
  easeInOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  // accelerating from zero velocity
  easeInQuart: (t) => t * t * t * t,
  // decelerating to zero velocity
  easeOutQuart: (t) => 1 - --t * t * t * t,
  // acceleration until halfway, then deceleration
  easeInOutQuart: (t) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  // accelerating from zero velocity
  easeInQuint: (t) => t * t * t * t * t,
  // decelerating to zero velocity
  easeOutQuint: (t) => 1 + --t * t * t * t * t,
  // acceleration until halfway, then deceleration
  easeInOutQuint: (t) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
  easeInElastic: (t) => {
    const c4 = (2 * Math.PI) / 3;

    return t === 0
      ? 0
      : t === 1
      ? 1
      : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  },
  easeOutElastic: (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },

  easeInOutElastic: (t) => {
    var s = 2 * t - 1; // remap: [0,0.5] -> [-1,0]
    var k = ((80 * s - 9) * Math.PI) / 18; // and    [0.5,1] -> [0,+1]
    if (s < 0) return -0.5 * Math.pow(2, 10 * s) * Math.sin(k);
    else return 1 + 0.5 * Math.pow(2, -10 * s) * Math.sin(k);
  },
};

function setup() {
  createCanvas(350, 325, WEBGL);
  pixelDensity(1);
  let hostURL = "https://mondracode.com/visual-computing-assignments/";
  bg = loadImage(hostURL + "assets/water.jpg");
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

    // Jerk a bit at each footstep
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
    fill(255, 165, 0); // Orange color    translate(0, ballZ, 0); // Position the ball
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
