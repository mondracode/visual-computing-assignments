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

## **Conclusions**

The illusion of depth is achieved by a combination of clever visual illusions to trick a viewer into seeing a three-dimension space on a flat surface. The creation and development of said techniques shaped the history of western art and are still widely used today. By using these concepts correctly and creatively, artists around the world have found a way to represent real environments more accurately, improving the artistical intent of the creators and opening completely new doors to new frontiers of creativity and technical expertise.

## **Future work**

As seen on other examples, the visual illusions here depicted can be showed more transparently and intuitively with the help of a 3D engine of some type. As screens are flat surfaces, 3D engines can be a more efficient way to show these effects since they are done naturally by its calculations and not by geometrical tricks or workarounds. The 2D simulation can also use some improvements. For example, the features of the blur and the amount of elements shown on parallax could be completely controlled by the user, but its implementation is computationally costly and ends up being put of scope for the purpose of this project.
