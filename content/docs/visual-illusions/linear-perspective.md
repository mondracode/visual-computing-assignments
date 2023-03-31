---
title: 2. Linear Perspective
type: docs
---

# **Linear perspective**

## **Introduction**

Linear perspective is a visual illusion which objective is to create an illusion of depth on a flat surface. All parallel lines (orthogonals) in a painting or drawing using this system converge in a single vanishing point on the composition’s horizon line.

![Leonardo da Vinci: Adoration of the Magi](https://cdn.britannica.com/62/9662-050-BD0D8230/perspective-study-bistre-silverpoint-pen-ground-Adoration.jpg 'Leonardo da Vinci: Adoration of the Magi')

##### Leonardo da Vinci's Adoration of the Magi, one of the earliest depictions of linear perspective

## **Antecedents and previous work**

### **From Encyclopedia Britannica** [Source](https://www.britannica.com/art/linear-perspective)

{{< hint info >}}
**Origin of linear perspective**  
Linear perspective is thought to have been devised about 1415 by Italian Renaissance architect Filippo Brunelleschi and later documented by architect and writer Leon Battista Alberti in 1435 (Della Pittura). Linear perspective was likely evident to artists and architects in the ancient Greek and Roman periods, but no records exist from that time, and the practice was thus lost until the 15th century.

The three components essential to the linear perspective system are orthogonals (parallel lines), the horizon line, and a vanishing point. So as to appear farther from the viewer, objects in the compositions are rendered increasingly smaller as they near the vanishing point. Early examples of Brunelleschi’s system can be seen in Donatello’s relief St. George Killing the Dragon (c. 1416–17) and Masaccio’s painting The Holy Trinity (1425–27), a dramatic illusionistic crucifixion. Andrea Mantegna (who also mastered the technique of foreshortening), Leonardo da Vinci, and German artist Albrecht Dürer are considered some of the early masters of linear perspective. As the limitations of linear perspective became apparent, artists invented additional devices (e.g., foreshortening and anamorphosis) to achieve the most-convincing illusion of space and distance.
{{< /hint >}}

## **Solution - a p5.js example**

In this example we depict an observer moving on a road in the middle of a desert. In front of him, there's a tunnel and two shapes laying on each side of the road. By pressing the up and down arrows, the observer can move away or towards the tunnel.

The important part of this example comes when getting as far as possible from the tunnel. Because of the linear perspective effect, the tunnel, the wall and the road (which is composed of two parallel lines) all converge into a center line or horizon. This gives the observer the effect of depth and works as a visual illusion of moving inside a three-dimensional space.

Click on the frame and press W and S to move forward or backwards respectively.

{{< p5-iframe sketch="/visual-computing-assignments/sketches/visual-illusions/linear-perspective.js" width="430" height="430" >}}

## **Code**

```js
function setup() {
  createCanvas(400, 400);
  background(220);
  depth = 75;
}

function draw() {
  // wall
  fill(220, 220, 220, 100);
  stroke(0, 0, 0, 0);
  rect(0, 0, 400, 200);

  //sky
  fill(130, 200, 255, 200);
  rect(0, 0, 400, 200 - 2 * depth);

  // road lines
  stroke(0, 0, 0, 0);
  fill(0, 0, 0, 200);
  triangle(200 - depth, 200, 200 - depth, 400, 50, 400);
  triangle(200 + depth, 200, 200 + depth, 400, 350, 400);
  rect(200 - depth, 200, depth * 2, 200);

  // ground
  stroke(0, 0, 0, 0);
  fill(255, 178, 0, 200);
  rect(0, 200, 400, 400);

  //shape one
  stroke(0, 0, 0, 150);
  fill(230, 0, 0, 200);
  ellipse(200 + 2 * depth, 205 + 3 * depth, 2 * depth, 2 * depth);

  //shape two
  fill(0, 200, 0, 200);
  rect(185 - 2.5 * depth, 200 + 0.1 * depth, 0.4 * depth, 0.4 * depth);

  // tunnel
  fill(0, 0, 0, 200);
  rect(200 - depth, 200, 2 * depth, -depth);

  // keypress logic - 87 for W and 83 for S
  if (keyCode === 87 && keyIsPressed === true && depth < 75) {
    depth += 0.35;
  } else if (keyCode === 83 && keyIsPressed === true && depth > 1) {
    depth -= 0.35;
  }

  text('depth: ' + Math.floor(depth), 10, 30);
}
```

## **Conclusions**

The development of linear perspective is considered to be one of the most significant advancements in the history of Western art. Prior to the discovery of linear perspective in the 15th century, art was often depicted in a more decorative, stylized manner that did not accurately represent the natural world. It fundamentally shaped the way art was developed on later eras and made way for developments inside 2D and 3D visual computing.

## **Future work**

This example could be expanded by giving the option to move on a bigger 2D space. Also, it could be better explained by developing a 3D space in which a camera moves. By showing the same situation in various angles, the viewer can visualize the root of the illusion of horizon convergence in a more transparent way.
