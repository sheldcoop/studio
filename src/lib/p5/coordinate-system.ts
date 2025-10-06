
'use client';

import p5 from 'p5';

/**
 * Draws a transformed grid.
 * @param p - The p5 instance.
 * @param b1 - The first basis vector.
 * @param b2 - The second basis vector.
 * @param c - The color of the grid lines.
 * @param w - The stroke weight of the grid lines.
 * @param s - The scaling factor.
 * @param fillColor - Optional fill color for the unit parallelogram.
 */
export const drawGrid = (p: p5, b1: p5.Vector, b2: p5.Vector, c: p5.Color, w: number, s: number, fillColor?: p5.Color) => {
    if (b1.magSq() < 0.01 || b2.magSq() < 0.01) return;
    
    p.stroke(c);
    p.strokeWeight(w);
    const range = 10;
    
    for(let i = -range; i <= range; i++) {
        const p1 = p5.Vector.add(b1.copy().mult(i), b2.copy().mult(-range));
        const p2 = p5.Vector.add(b1.copy().mult(i), b2.copy().mult(range));
        p.line(p1.x * s, p1.y * s, p2.x * s, p2.y * s);

        const p3 = p5.Vector.add(b1.copy().mult(-range), b2.copy().mult(i));
        const p4 = p5.Vector.add(b1.copy().mult(range), b2.copy().mult(i));
        p.line(p3.x * s, p3.y * s, p4.x * s, p4.y * s);
    }
    
    if (fillColor) {
        p.noStroke();
        p.fill(fillColor);
        p.beginShape();
        const r = 8;
        const p1_fill = b1.copy().mult(-r);
        const p2_fill = b1.copy().mult(r);
        const p3_fill = b2.copy().mult(-r);
        const p4_fill = b2.copy().mult(r);

        const v1 = p5.Vector.add(p1_fill, p3_fill);
        const v2 = p5.Vector.add(p2_fill, p3_fill);
        const v3 = p5.Vector.add(p2_fill, p4_fill);
        const v4 = p5.Vector.add(p1_fill, p4_fill);
        p.vertex(v1.x * s, v1.y * s);
        p.vertex(v2.x * s, v2.y * s);
        p.vertex(v3.x * s, v3.y * s);
        p.vertex(v4.x * s, v4.y * s);
        p.endShape(p.CLOSE);
    }
};

/**
 * Draws two basis vectors.
 * @param p - The p5 instance.
 * @param b1 - The first basis vector.
 * @param b2 - The second basis vector.
 * @param scaleFactor - The scaling factor.
 * @param color1 - The color of the first vector.
 * @param color2 - The color of the second vector.
 * @param labels - Whether to show labels.
 */
export const drawBasisVectors = (p: p5, b1: p5.Vector, b2: p5.Vector, scaleFactor: number, color1: p5.Color, color2: p5.Color, labels: boolean = true) => {
    // This is essentially two calls to drawVector, so it can be implemented with it.
};

/**
 * Draws two orthogonal basis vectors.
 * @param p - The p5 instance.
 * @param v1 - The first vector.
 * @param v2 - The second vector.
 * @param scaleFactor - The scaling factor.
 * @param color - The color of the vectors.
 * @param showRightAngle - Whether to show a right angle marker.
 */
export const drawOrthogonalBasis = (p: p5, v1: p5.Vector, v2: p5.Vector, scaleFactor: number, color: p5.Color, showRightAngle: boolean = true) => {
    // Draw v1 and v2 using drawVector
    if (showRightAngle) {
        const size = 15;
        const n1 = v1.copy().normalize();
        const n2 = v2.copy().normalize();
        p.noFill(); p.stroke(color); p.strokeWeight(1);
        p.beginShape();
        const p1 = n1.copy().mult(size);
        const p2 = p5.Vector.add(n1, n2).mult(size);
        const p3 = n2.copy().mult(size);
        p.vertex(p1.x, p1.y);
        p.vertex(p2.x, p2.y);
        p.vertex(p3.x, p3.y);
        p.endShape();
    }
};

/**
 * Draws standard Cartesian axes.
 * @param p - The p5 instance.
 * @param scaleFactor - The scaling factor.
 * @param color - The color of the axes.
 * @param showLabels - Whether to show labels.
 * @param tickInterval - The interval for tick marks.
 */
export const drawAxes = (p: p5, scaleFactor: number, color: p5.Color, showLabels: boolean = true, tickInterval: number = 1) => {
    p.stroke(color);
    p.strokeWeight(1.5);
    p.line(-p.width, 0, p.width, 0); // X-axis
    p.line(0, -p.height, 0, p.height); // Y-axis

    if (showLabels) {
        p.noStroke();
        p.fill(color);
        p.textSize(14);
        const tickSize = 5;
        for (let i = -10; i <= 10; i += tickInterval) {
            if (i === 0) continue;
            // X-ticks
            p.line(i * scaleFactor, -tickSize, i * scaleFactor, tickSize);
            p.text(i, i * scaleFactor - 4, tickSize + 14);
            // Y-ticks
            p.line(-tickSize, i * scaleFactor, tickSize, i * scaleFactor);
            p.text(i, tickSize + 4, -i * scaleFactor + 5);
        }
    }
};

/**
 * Converts screen coordinates to world coordinates.
 * @param p - The p5 instance.
 * @param mx - The mouse x-coordinate.
 * @param my - The mouse y-coordinate.
 * @param scaleFactor - The scaling factor.
 * @returns A p5.Vector with the world coordinates.
 */
export const screenToWorld = (p: p5, mx: number, my: number, scaleFactor: number): p5.Vector => {
    const worldX = (mx - p.width / 2) / scaleFactor;
    const worldY = (p.height / 2 - my) / scaleFactor; // Y is inverted
    return p.createVector(worldX, worldY);
};

/**
 * Draws two lines representing a 2x2 system of equations.
 * @param p - The p5 instance.
 * @param a1, b1, c1 - Coefficients for the first line (a1*x + b1*y = c1).
 * @param a2, b2, c2 - Coefficients for the second line (a2*x + b2*y = c2).
 * @param scaleFactor - The scaling factor.
 * @param line1Color - The color of the first line.
 * @param line2Color - The color of the second line.
 */
export const drawLine = (p: p5, a: number, b: number, c: number, scaleFactor: number, color: p5.Color) => {
    p.stroke(color);
    p.strokeWeight(2);
    if (Math.abs(b) > 0.01) {
        const x1 = -10, y1 = (c - a * x1) / b;
        const x2 = 10, y2 = (c - a * x2) / b;
        p.line(x1 * scaleFactor, y1 * scaleFactor, x2 * scaleFactor, y2 * scaleFactor);
    } else if (Math.abs(a) > 0.01) {
        const x = c / a;
        p.line(x * scaleFactor, -10 * scaleFactor, x * scaleFactor, 10 * scaleFactor);
    }
};
