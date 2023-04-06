---
title: 4. A joint example of depth perception
type: docs
---

# **Joint example of depth perception**

## **Introduction**

In this example we aim for a combined representation of the three visual illusions presented previously. Used correctly, the union of techniques of depth of field, linear perspective and parallax can lead to a very convincing 2D representation of a 3D space.

## **Antecedents and previous work**

The examples and theoretical development of each of the techniques used

- [Depth of field](/visual-computing-assignments/docs/visual-illusions/depth-of-field)
- [Linear perspective](/visual-computing-assignments/docs/visual-illusions/linear-perspective)
- [Parallax](/visual-computing-assignments/docs/visual-illusions/parallax)

## **Solution - a p5.js example**

{{< p5-iframe sketch="/visual-computing-assignments/sketches/visual-illusions/union.js" width="530" height="530" >}}

We use a diverse set of tools and techniques to achieve the example showed above. First, the depth of field is represented in the blur of the different screen elements shown in the p5.js canvas. Depending on the distance of the elements, a different amount of blur is rendered across the screen.

Then, a couple of examples of linear perspective is used. The perspective used for the example is a bottom-up view, which shows the skyscrapers pointing towards the center of the screen as its height increases. If we were to extend each vertical line of the buildings, we could see them converge into a hypothetical horizon representing infinity on the center of the canvas. There is also the endlessly falling man. It appears from infinity (or that's what the illusion wants you to assume) and falls towards the observer in an endlsess cycle. As he approaches the viewer, his size grows in a way compatible with the theoretical concept that linear perspective offers.

Last but not least, we have the application of parallax. The observer looks up at the sky and sees multiple elements or layers: the skyscrapers, the falling man, and most importantly for this case, a few bird flocks flying across the sky, a plane which passes by once and some clouds moving slowly on the background. If you look closely, you can see that the existence of the birds, plane and clouds varies in size and speed, giving the sensation of depth as some elements seem to be closer to the observer than others. Combined with the other two effects, it gives a nice sensation of three-dimensionality and overall depth completely fabricated inside a 2D space.

## **Code**

In order to create the **depth of field effect**, it was necessary to create different version of the same image, given that it was expensive computationally to blur the whole image. The solution was to create a set of images with different levels of blur, and then use the distance of the elements to the observer to choose which image to render. The code for this is as follows:

{{< highlight js >}}
// Load blurred images
blurredSkyscrapers = [];
for (let i = 0; i < numberOfIntervals; i++) {
blurredSkyscrapers.push(
loadImage(`${hostURL}/assets/skyscrapers_blur_00${i}.png`)
);

{{< /highlight >}}

{{< highlight js >}}
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
}


{{< /highlight >}}

{{< highlight js >}}
  // Setup the blurred plane
  blurredPlaneFactory = new BlurredPlaneFactory(
    intervalLowerBound,
    intervalUpperBound,
    numberOfIntervals
  );
  blurredPlaneIntervals = blurredPlaneFactory.generateIntervals();

{{< /highlight >}}

So as to create the **Parallax** effect we designed a set of layers with different components. These components are the **birds**, the **plane**, the **clouds** and the buildings. Each of these components has a different speed and size, which is used to create the illusion of depth. The code for this is as follows:

{{< highlight js >}}
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
{{< /highlight >}}

{{< highlight js >}}
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

{{< /highlight >}}

{{< highlight js >}}

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

{{< /highlight >}}

Finally, so as to create the **linear perspective** effect, we added a falling man in the sketch. This man looks as if he was falling in a 3D plain, however this is produced by the effect. The code for this:

{{< highlight js >}}
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


{{< /highlight >}}

{{< highlight js >}}
  // draw falling man
  fallingMan.draw();
{{< /highlight >}}  

## **Conclusions**

The illusion of depth is achieved by a combination of clever visual illusions to trick a viewer into seeing a three-dimension space on a flat surface. The creation and development of said techniques shaped the history of western art and are still widely used today. By using these concepts correctly and creatively, artists around the world have found a way to represent real environments more accurately, improving the artistical intent of the creators and opening completely new doors to new frontiers of creativity and technical expertise.

## **Future work**

As seen on other examples, the visual illusions here depicted can be showed more transparently and intuitively with the help of a 3D engine of some type. As screens are flat surfaces, 3D engines can be a more efficient way to show these effects since they are done naturally by its calculations and not by geometrical tricks or workarounds. The 2D simulation can also use some improvements. For example, the features of the blur and the amount of elements shown on parallax could be completely controlled by the user, but its implementation is computationally costly and ends up being out of scope for the purpose of this project.
