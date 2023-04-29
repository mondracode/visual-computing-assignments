---
title: 1. Depth of Field
type: docs
---

# **Depth of field**

## Introduction

This effect describes the distance between the nearest and farthest objects in a scene that appear acceptably sharp in an image. The depth of field is affected by the focal length of the lens, the aperture of the lens, and the distance between the subject and the camera.

## Antecedents

The depth of field is affected by the focal length of the lens, the aperture of the lens, the distance between the subject and the camera, and the acceptable circle of confusion. The acceptable circle of confusion is the smallest circle of confusion that is acceptable for the image. The circle of confusion is the smallest circle that can be distinguished from a point of light. The circle of confusion is affected by the resolution of the image, the size of the image, and the distance between the subject and the camera. Below is the formula for the depth of field.

{{< katex display >}}
f(x) = \dfrac{2u^2Nc}{f^2}
{{< /katex >}}

In the next diagram, one can visualize the effect of the depth of field. In the picture a subject lies within the **DOF** so it is in focus, on the other hand the background is out of focus and so are the items closer to the camera.

![Depth of field, person in range](https://mondracode.com/visual-computing-assignments/dof-01.png)

This effect can be understood as the light rays that are coming from the subject are focused on the sensor, while the light rays that are coming from the background are not focused on the sensor. This is why the background is out of focus, same goes for the items closer to the camera.

![Depth of field, light rays](https://mondracode.com/visual-computing-assignments/dof-02.png)

## Solution

The idea behind this example is to recreate the illusion of Depth of field using Processing. The sketch is composed of a set of cards that move in the Z-axis, two selectors and a background. The selectors are used to select the range that will determine the depth of field, the cards will be either out of focus or in focus depending on their position in the Z-axis.

## Code snippets

The code below uses the **filter()** function to blur the image. The **filter()** function is used to apply a filter to the image. The **BLUR** filter is used to blur the image. The **4** parameter is used to set the blur amount. The higher the value the more the image will be blurred.

{{< highlight js >}}
imgCardBlur.filter(BLUR, 4);
{{< /highlight >}}

Once we have the blurred image we can use the **image()** function to display it on the canvas. Some rectangles will be used for the cards, the **drawCardWithImageBlur()** function is used to draw the cards.

{{< highlight js >}}
function drawCardWithImageBlur(img, x, y, width, height) {
fill(255);
strokeWeight(0.5);
rectMode(CENTER);
rect(x, y, width, height);
// draw the image within the rectangle
if (img) {
imageMode(CENTER);
image(img, x, y, width, height);
}
}
{{< /highlight >}}

Once we have the cards and the blurred image. The cards will be drawn in the Z-axis, to achieve this we will use the **translate()** function. The **translate()** function is used to move the canvas in the X, Y and Z-axis. The **translate()** function will be used to move the canvas in the Z-axis. The **drawCardWithImageBlur()** function will be used to draw the cards.

{{< highlight js >}}
// Cards moving backwards
push(); // save the current drawing state
translate(x, y, z); // move the rectangle in the z-axis
drawCardWithImageBlur(imgCard, x, y, rectWidth, rectHeight);
drawCardWithImageBlur(imgCard, x - 50, y, rectWidth, rectHeight);
drawCardWithImageBlur(imgCard, x + 50, y, rectWidth, rectHeight);
pop(); // restore the previous drawing state
{{< /highlight >}}

The **push()** and **pop()** functions are used to save and restore the current drawing state. The **push()** function is used to save the current drawing state, the **pop()** function is used to restore the previous drawing state. The **push()** and **pop()** functions are used to avoid the effect of the **translate()** function to be applied to the other elements in the sketch.

The cards are moving, however we need them to return, so as to make them come back we will use some ranges and conditionals within the **draw()** function. The **draw()** function is used to draw the elements on the canvas. The **draw()** function is called continuously, so the elements will be drawn continuously. The **draw()** function is called 60 times per second.

{{< highlight js >}}
// check if the ellipse has reached the end of the z-axis
if (z > zRangeFront) {
z = zRangeFront;
zSpeedVec \*= -1;
}

if (z <= zRangeBack) {
z = zRangeBack;
zSpeedVec \*= -1;
}

if (z < zRangeFront - focalRangeInit && z > zRangeFront - focalRangeEnd) {
imgCard = imgCardOriginal;
} else {
imgCard = imgCardBlur;
}

{{< /highlight >}}

## Code Example

In this example we find two selectors, these define a range that will determine the depth of field. The selector on the upper part defines the beginning of the range, the selector on the lower part defines the end of the range. As the cards move in the Z-axis, the cards that are within the range will be in focus, the cards that are out of the range will be out of focus.

{{< p5-iframe sketch="/visual-computing-assignments/sketches/visual-illusions/depth-of-field.js" width="500" height="400" >}}

# Future work

In a near future this kind of illusion maybe implemented using shaders. This will allow to create more complex effects and to have more control over the image. That is way more efficient than using the **filter()** function to blur the image within the draw loop.

{{< button relref="/" >}}Get Home{{< /button >}}
{{< button href="https://github.com/alex-shpak/hugo-book" >}}Contribute{{< /button >}}
