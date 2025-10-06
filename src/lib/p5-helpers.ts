
'use client';

import type p5 from 'p5';

// #region --- Drawing Primitives ---

/**
 * Draws a grid on the canvas based on a given basis.
 * Can optionally fill the area spanned by the basis vectors.
 * @param p - The p5 instance.
 * @param b1 - The first basis vector.
 * @param b2 - The second basis vector.
 * @param color - The color of the grid lines.
 * @param weight - The stroke weight of the grid lines.
 * @param scaleFactor - The scaling factor for the grid.
 * @param fillColor - Optional: The color to fill the spanned area.
 */
export const drawGrid = (p: p5, b1: p5.Vector, b2: p5.Vector, color: p5.Color, weight: number, scaleFactor: number, fillColor?: p5.Color) => {
    if (b1.magSq() < 0.01 || b2.magSq() < 0.01) return;

    if (fillColor) {
        p.noStroke();
        p.fill(fillColor);
        const r = 8;
        p.beginShape();
        const p1 = p5.Vector.add(p5.Vector.mult(b1, -r), p5.Vector.mult(b2, -r));
        const p2 = p5.Vector.add(p5.Vector.mult(b1, r), p5.Vector.mult(b2, -r));
        const p3 = p5.Vector.add(p5.Vector.mult(b1, r), p5.Vector.mult(b2, r));
        const p4 = p5.Vector.add(p5.Vector.mult(b1, -r), p5.Vector.mult(b2, r));
        p.vertex(p1.x * scaleFactor, p1.y * scaleFactor);
        p.vertex(p2.x * scaleFactor, p2.y * scaleFactor);
        p.vertex(p3.x * scaleFactor, p3.y * scaleFactor);
        p.vertex(p4.x * scaleFactor, p4.y * scaleFactor);
        p.endShape(p.CLOSE);
    }

    p.stroke(color);
    p.strokeWeight(weight);
    p.noFill();
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
 * Draws a simple point on the canvas.
 * @param p The p5 instance.
 * @param pt The vector representing the point's position in world coordinates.
 * @param s The scaling factor.
 * @param col The color of the point.
 */
export const drawPoint = (p: p5, pt: p5.Vector, s: number, col: p5.Color) => {
    p.fill(col);
    p.noStroke();
    p.ellipse(pt.x * s, pt.y * s, 12, 12);
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

/**
 * Draws a line representing the equation ax + by = c.
 * @param p - The p5 instance.
 * @param a - The coefficient of x.
 * @param b - The coefficient of y.
 * @param c - The constant term.
 * @param scaleFactor - The scaling factor for the drawing.
 * @param color - The color of the line.
 */
export const drawLine = (p: p5, a: number, b: number, c: number, scaleFactor: number, color: p5.Color) => {
    p.push();
    p.stroke(color); p.strokeWeight(3);
    let x1, y1, x2, y2;
    const limit = p.max(p.width, p.height) * 2;
    if (Math.abs(b) > 1e-9) {
        x1 = -limit; y1 = (c - a * x1) / b;
        x2 = limit; y2 = (c - a * x2) / b;
    } else {
        if (Math.abs(a) < 1e-9) return;
        x1 = c / a; y1 = -limit;
        x2 = c / a; y2 = limit;
    }
    p.line(x1 * scaleFactor, y1 * scaleFactor, x2 * scaleFactor, y2 * scaleFactor);
    p.pop();
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


/**
 * Linearly interpolates between two matrices.
 * @param p - The p5 instance.
 * @param m1 - The starting matrix.
 * @param m2 - The ending matrix.
 * @param t - The progress of the interpolation (0 to 1).
 * @returns The interpolated matrix.
 */
export const lerpMatrix = (p: p5, m1: any, m2: any, t: number) => {
    const res: { [key: string]: number } = {};
    for (const key in m1) {
        res[key] = p.lerp(m1[key], m2[key], t);
    }
    return res as any;
};

// #endregion
