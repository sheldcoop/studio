
'use client';

import p5 from 'p5';

/**
 * Draws a vector from the origin with an arrowhead.
 * @param p - The p5 instance.
 * @param v - The vector to draw.
 * @param scaleFactor - The scaling factor for the drawing.
 * @param color - The color of the vector.
 * @param label - Optional text label for the vector.
 * @param weight - The stroke weight of the vector.
 * @param offset - An optional offset to draw the vector from.
 */
export const drawVector = (p: p5, v: p5.Vector, scaleFactor: number, color: p5.Color, label: string | null, weight = 4, offset: p5.Vector | null = null) => {
    if (!v) return;

    const scaledVector = v.copy().mult(scaleFactor);
    if (offset) {
        scaledVector.add(offset.copy().mult(scaleFactor));
    }
    
    // Don't draw if the vector is effectively zero length
    if (v.magSq() < 1e-4) {
        p.fill(color);
        p.noStroke();
        p.ellipse(offset ? scaledVector.x : 0, offset ? scaledVector.y : 0, 8, 8);
        return;
    };

    p.push();
    if(offset) {
        p.translate(offset.x * scaleFactor, offset.y * scaleFactor);
    }
    p.stroke(color);
    p.fill(color);
    p.strokeWeight(weight);
    p.line(0, 0, v.x * scaleFactor, v.y * scaleFactor);

    // Arrowhead
    const arrowSize = 10;
    const angle = v.heading();
    p.translate(v.x * scaleFactor, v.y * scaleFactor);
    p.rotate(angle);
    p.triangle(0, 0, -arrowSize, arrowSize / 2, -arrowSize, -arrowSize / 2);
    p.pop();

    if (label) {
        p.push();
        const labelPosition = scaledVector.copy().add(v.copy().normalize().mult(20));
        p.noStroke();
        p.fill(color);
        p.textSize(18);
        p.textStyle(p.BOLD);
        p.translate(labelPosition.x, labelPosition.y);
        p.scale(1,-1); // Undo global y-flip for text
        p.text(label, 0, 0);
        p.pop();
    }
};


/**
 * Draws a dashed line between two points.
 * @param p - The p5 instance.
 * @param p1 - The starting point vector (in screen space).
 * @param p2 - The ending point vector (in screen space).
 * @param color - The color of the line.
 * @param weight - The stroke weight.
 * @param dashPattern - An array defining the dash pattern (e.g., [10, 5]).
 */
export const drawDashedLine = (p: p5, p1: p5.Vector, p2: p5.Vector, color: p5.Color, weight: number, dashPattern: number[]) => {
    p.stroke(color);
    p.strokeWeight(weight);
    if (p.drawingContext.setLineDash) {
        p.drawingContext.setLineDash(dashPattern);
    }
    p.line(p1.x, p1.y, p2.x, p2.y);
    if (p.drawingContext.setLineDash) {
        p.drawingContext.setLineDash([]); // Reset to solid
    }
};

/**
 * Draws a single point.
 * @param p - The p5 instance.
 * @param point - The vector position of the point.
 * @param scaleFactor - The scaling factor.
 * @param color - The color of the point.
 * @param size - The size of the point.
 */
export const drawPoint = (p: p5, point: p5.Vector, scaleFactor: number, color: p5.Color, size: number = 10) => {
    p.noStroke();
    p.fill(color);
    p.ellipse(point.x * scaleFactor, point.y * scaleFactor, size, size);
};

/**
 * Draws a parallelogram defined by two vectors.
 * @param p - The p5 instance.
 * @param v1 - The first vector.
 * @param v2 - The second vector.
 * @param scaleFactor - The scaling factor.
 * @param fillColor - The fill color of the parallelogram.
 * @param strokeColor - The stroke color of the parallelogram.
 */
export const drawParallelogram = (p: p5, v1: p5.Vector, v2: p5.Vector, scaleFactor: number, fillColor: p5.Color, strokeColor: p5.Color) => {
    p.fill(fillColor);
    p.stroke(strokeColor);
    p.strokeWeight(1);
    p.beginShape();
    p.vertex(0, 0);
    p.vertex(v1.x * scaleFactor, v1.y * scaleFactor);
    p.vertex((v1.x + v2.x) * scaleFactor, (v1.y + v2.y) * scaleFactor);
    p.vertex(v2.x * scaleFactor, v2.y * scaleFactor);
    p.endShape(p.CLOSE);
};

/**
 * Draws a rectangle.
 * @param p - The p5 instance.
 * @param corner - The vector position of the corner.
 * @param width - The width of the rectangle.
 * @param height - The height of the rectangle.
 * @param scaleFactor - The scaling factor.
 * @param color - The color of the rectangle.
 */
export const drawRectangle = (p: p5, corner: p5.Vector, width: number, height: number, scaleFactor: number, color: p5.Color) => {
    p.fill(color);
    p.noStroke();
    p.rect(corner.x * scaleFactor, corner.y * scaleFactor, width * scaleFactor, height * scaleFactor);
};

/**
 * Draws a polygon from a list of vertices.
 * @param p - The p5 instance.
 * @param vertices - An array of vectors representing the vertices.
 * @param scaleFactor - The scaling factor.
 * @param fillColor - The fill color.
 * @param strokeColor - The stroke color.
 */
export const drawPolygon = (p: p5, vertices: p5.Vector[], scaleFactor: number, fillColor: p5.Color, strokeColor: p5.Color) => {
    p.fill(fillColor);
    p.stroke(strokeColor);
    p.strokeWeight(1);
    p.beginShape();
    vertices.forEach(v => p.vertex(v.x * scaleFactor, v.y * scaleFactor));
    p.endShape(p.CLOSE);
};
