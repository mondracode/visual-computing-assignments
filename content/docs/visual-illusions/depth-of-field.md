---
title: Depth of Field
type: docs
---

# **Depth of field**

## Introduction

This effect describes the distance between the nearest and farthest objects in a scene that appear acceptably sharp in an image.  The depth of field is affected by the focal length of the lens, the aperture of the lens, and the distance between the subject and the camera.

## Understanding the effect

The depth of field is affected by the focal length of the lens, the aperture of the lens, the distance between the subject and the camera, and the acceptable circle of confusion. The acceptable circle of confusion is the smallest circle of confusion that is acceptable for the image. The circle of confusion is the smallest circle that can be distinguished from a point of light. The circle of confusion is affected by the resolution of the image, the size of the image, and the distance between the subject and the camera. Below is the formula for the depth of field.

{{< katex display >}}
f(x) = \dfrac{2u^2Nc}{f^2}
{{< /katex >}}

In the next diagram, one can visualize the effect of the depth of field. In the picture a subject lies within the **DOF** so it is in focus, on the other hand the background is out of focus and so are the items closer to the camera.

![Depth of field, person in range](http://localhost:1313/visual-computing-assignments/dof-01.png)

This effect can be understood as the light rays that are coming from the subject are focused on the sensor, while the light rays that are coming from the background are not focused on the sensor. This is why the background is out of focus, same goes for the items closer to the camera.

![Depth of field, light rays](http://localhost:1313/visual-computing-assignments/dof-02.png)

## Solution

The idea behind this example is to recreate the illusion of Depth of field using Processing. The sketch is composed of a set of cards that move in the Z-axis, two selectors and a background. The selectors are used to select the range that will determine the depth of field, the cards will be either out of focus or in focus depending on their position in the Z-axis.

## Code Example

{{< p5-iframe sketch="/visual-computing-assignments/sketches/visual-illusions/depth-of-field.js" width="500" height="400" >}}

{{< button relref="/" >}}Get Home{{< /button >}}
{{< button href="https://github.com/alex-shpak/hugo-book" >}}Contribute{{< /button >}}
