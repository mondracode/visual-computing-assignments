---
title: Parallax
type: docs
---

# **Parallax**

Parallax is one of the foundations of spatial perception, by moving our point of view changes the relative position of observable objects.

We perceive this every day, but it is a feature that is not taken into account because it is very familiar to our eyes, my example of approach is for example the transmilenio that goes along Avenida 30, in which through the window we can see the hills of Bogota in the distance, moving in a relatively slow way, with respect to how it is moving the facades of houses, buildings and other structures near this avenue.

Another example, perhaps more visual, can be seen in the following video, proposed as a montage by Dave Dugdale as a perspective given from photography [(Konova Slider Montage Film)](https://www.youtube.com/watch?v=gmsOaziTL7g&t=29s)

{{< video src="https://www.youtube.com/embed/gmsOaziTL7g" preload="auto" >}}

## Understanding the effect

Parallax is a phenomenon that occurs when you view an object from two different positions, and the object appears to shift its position. In astronomy, scientists use parallax to measure the distance to stars and other celestial objects.

To measure parallax, astronomers observe an object from two different positions, such as opposite sides of the Earth's orbit around the Sun. The angle of parallax, denoted by the symbol θ, is half the angle between the two lines of sight from the two observers to the object.

Astronomers use trigonometry to calculate the distance to the object using the formula: distance = 1/parallax angle. They can measure the parallax angle by observing the object at different times of the year when the Earth is at opposite sides of its orbit around the Sun.

## p5js example
For this example, our point of view moves with respect to the direction of the mouse, we have several layers of paint, being the first layers the background and the last ones the "closest" to the user.

{{< katex display >}}
Dimension = \frac{maxDimensionOfCicles}{(numberOfLayers + 1) - this.layer}
{{< /katex >}}


{{< katex display >}}
CircleSpeed = -this.layer * (mousePosition - \frac{canvaWidth}{2})
{{< /katex >}}

the code base of the example was obtained from the following [embedded page](https://happycoding.io/tutorials/p5js/creating-classes/parallax-dots)

{{< p5-iframe sketch="/visual-computing-assignments/sketches/cursor_parallax.js" width="650" height="650" >}}

