

'use client';

import type p5 from 'p5';

// #region --- Drawing Primitives ---

/**
 * Draws a grid on the canvas based on a given basis.
 * @param p - The p5 instance.
 * @param b1 - The first basis vector.
 * @param b2 - The second basis vector.
 * @param color - The color of the grid lines.
 * @param weight - The stroke weight of the grid lines.
 * @param scaleFactor - The scaling factor for the grid.
 */
export const drawGrid = (p: p5, b1: p5.Vector, b2: p5.Vector, color: p5.Color, weight: number, scaleFactor: number) => {
    if (b1.magSq() < 0.01 || b2.magSq() < 0.01) return;
    p.stroke(color);
    p.strokeWeight(weight);
    const range = 10;
    for (let i = -range; i <= range; i++) {
        const p1 = p5.Vector.add(p5.Vector.mult(b1, i), p5.Vector.mult(b2, -range));
        const p2 = p5.Vector.add(p5.Vector.mult(b1, i), p5.Vector.mult(b2, range));
        p.line(p1.x * scaleFactor, p1.y * scaleFactor, p2.x * scaleFactor, p2.y * scaleFactor);

        const p3 = p5.Vector.add(p5.Vector.mult(b1, -range), p5.Vector.mult(b2, i));
        const p4 = p5.Vector.add(p5.Vector.mult(b1, range), p5.Vector.mult(b2, i));
        p.line(p3.x * scaleFactor, p3.y * scaleFactor, p4.x * scaleFactor, p4.y * scaleFactor);
    }
};

/**
 * Draws a vector with an arrowhead and an optional label.
 * @param p - The p5 instance.
 * @param v - The vector to draw.
 * @param scaleFactor - The scaling factor for the drawing.
 * @param color - The color of the vector.
 * @param label - An optional label for the vector.
 * @param weight - The stroke weight of the vector.
 * @param offset - An optional offset from the origin.
 */
export const drawVector = (p: p5, v: p5.Vector, scaleFactor: number, color: p5.Color, label: string | null, weight = 4, offset: p5.Vector | null = null) => {
    if (!v) return;
    const scaledV = p5.Vector.mult(v, scaleFactor);
    if (offset) {
        scaledV.add(p5.Vector.mult(offset, scaleFactor));
    }
    if (v.magSq() < 1e-4) {
        p.fill(color);
        p.noStroke();
        p.ellipse(offset ? scaledV.x : 0, offset ? scaledV.y : 0, 8, 8);
        return;
    };
    p.push();
    if (offset) {
        p.translate(offset.x * scaleFactor, offset.y * scaleFactor);
    }
    p.stroke(color);
    p.fill(color);
    p.strokeWeight(weight);
    p.line(0, 0, v.x * scaleFactor, v.y * scaleFactor);

    const headSize = 10;
    const angle = v.heading();
    p.translate(v.x * scaleFactor, v.y * scaleFactor);
    p.rotate(angle);
    p.triangle(0, 0, -headSize, headSize / 2, -headSize, -headSize / 2);
    p.pop();

    if (label) {
        drawLabel(p, scaledV, color, label);
    }
};


/**
 * Draws a label for a vector.
 * @param p - The p5 instance.
 * @param v - The screen-space vector where the label should be placed.
 * @param color - The color of the label.
 * @param label - The text content of the label.
 */
export const drawLabel = (p: p5, v: p5.Vector, color: p5.Color, label: string) => {
    p.push();
    const labelOffset = v.copy().normalize().mult(20);
    const labelPos = v.copy().add(labelOffset);
    p.noStroke();
    p.fill(color);
    p.textSize(18);
    p.textStyle(p.BOLD);
    p.translate(labelPos.x, labelPos.y);
    p.scale(1,-1); // Undo the global y-flip for text
    p.text(label, 0, 0);
    p.pop();
};


/**
 * Draws a transformed circle on the canvas.
 * @param p - The p5 instance.
 * @param transform - A function that transforms a 2D point.
 * @param scaleFactor - The scaling factor for the drawing.
 * @param color - The color of the circle.
 */
export const drawTransformedCircle = (p: p5, transform: (x: number, y: number) => { x: number; y: number }, scaleFactor: number, color: p5.Color) => {
    p.noFill();
    p.stroke(color);
    p.strokeWeight(3);
    p.beginShape();
    for (let i = 0; i <= 64; i++) {
        const angle = p.map(i, 0, 64, 0, p.TWO_PI);
        const { x, y } = transform(p.cos(angle), p.sin(angle));
        p.vertex(x * scaleFactor, y * scaleFactor);
    }
    p.endShape(p.CLOSE);
};

/**
 * Draws a dashed line between two points.
 * @param p - The p5 instance.
 * @param v1 - The starting vector.
 * @param v2 - The ending vector.
 * @param color - The color of the line.
 * @param weight - The stroke weight.
 * @param dashPattern - An array describing the dash pattern (e.g., [5, 10]).
 */
export const drawDashedLine = (p: p5, v1: p5.Vector, v2: p5.Vector, color: p5.Color, weight: number, dashPattern: number[]) => {
    p.stroke(color);
    p.strokeWeight(weight);
    if (p.drawingContext.setLineDash) {
        p.drawingContext.setLineDash(dashPattern);
    }
    p.line(v1.x, v1.y, v2.x, v2.y);
    if (p.drawingContext.setLineDash) {
        p.drawingContext.setLineDash([]);
    }
};

// #endregion

// #region --- Coordinate System ---

/**
 * Converts screen coordinates (pixels) to world coordinates (math units).
 * @param p - The p5 instance.
 * @param mx - The mouse X position in pixels.
 * @param my - The mouse Y position in pixels.
 * @param scaleFactor - The scaling factor of the visualization.
 * @returns A p5.Vector representing the world coordinates.
 */
export const screenToWorld = (p: p5, mx: number, my: number, scaleFactor: number): p5.Vector => {
    const x = (mx - p.width / 2) / scaleFactor;
    const y = (p.height / 2 - my) / scaleFactor;
    return p.createVector(x, y);
};

// #endregion

// #region --- Animation ---

/**
 * A cubic easing function that speeds up and then slows down.
 * @param t - The progress of the animation (0 to 1).
 * @returns The eased progress.
 */
export const easeInOutCubic = (t: number): number => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;


// #endregion
