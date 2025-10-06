'use client';

import p5 from 'p5';

/**
 * Draws a transformed grid defined by two basis vectors.
 * The grid dynamically adjusts to fill the entire canvas.
 * @param p - The p5 instance.
 * @param b1 - The first basis vector.
 * @param b2 - The second basis vector.
 * @param c - The color of the grid lines.
 * @param w - The stroke weight of the lines.
 * @param s - The scaling factor.
 * @param fillColor - Optional color to fill the grid area.
 */
export const drawGrid = (p: p5, b1: p5.Vector, b2: p5.Vector, c: p5.Color, w: number, s: number, fillColor?: p5.Color) => {
    if (b1.magSq() < 0.01 || b2.magSq() < 0.01) return;
    
    p.stroke(c);
    p.strokeWeight(w);

    // Dynamically calculate the range based on canvas size and scale
    const xRange = Math.ceil(p.width / (2 * s));
    const yRange = Math.ceil(p.height / (2 * s));
    const range = Math.max(xRange, yRange) * 1.5; // Add a buffer
    
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
        const r = range;
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
 * Draws standard Cartesian axes with correct label orientation, arrowheads, and ticks.
 * The axes and labels dynamically adjust to fill the entire canvas.
 * @param p - The p5 instance.
 * @param scaleFactor - The scaling factor.
 * @param color - The color of the axes.
 * @param showLabels - Whether to show numeric labels and ticks.
 * @param tickInterval - The interval for tick marks.
 */
export const drawAxes = (p: p5, scaleFactor: number, color: p5.Color, showLabels: boolean = true, tickInterval: number = 1) => {
    const tickSize = 5;
    
    p.stroke(color);
    p.strokeWeight(1.5);
    // X-axis with arrowhead
    p.line(-p.width / 2, 0, p.width / 2, 0);
    p.push();
    p.translate(p.width / 2, 0);
    p.fill(color);
    p.triangle(0, 0, -10, -5, -10, 5);
    p.pop();

    // Y-axis with arrowhead
    p.line(0, -p.height / 2, 0, p.height / 2);
     p.push();
    p.translate(0, p.height / 2);
    p.fill(color);
    p.triangle(0, 0, -5, -10, 5, -10);
    p.pop();


    if (showLabels) {
        // Dynamically calculate range based on canvas size
        const xRange = Math.floor(p.width / (2 * scaleFactor));
        const yRange = Math.floor(p.height / (2 * scaleFactor));

        // Draw Ticks
        p.strokeWeight(1);
        for (let i = -xRange; i <= xRange; i += tickInterval) {
            if (i === 0) continue;
            // X-ticks
            p.line(i * scaleFactor, -tickSize, i * scaleFactor, tickSize);
        }
         for (let i = -yRange; i <= yRange; i += tickInterval) {
            if (i === 0) continue;
            // Y-ticks
            p.line(-tickSize, i * scaleFactor, tickSize, i * scaleFactor);
        }
        
        // Draw Labels with correct orientation
        p.noStroke();
        p.fill(color);
        p.textSize(14);
        p.textAlign(p.CENTER, p.CENTER);
        
        for (let i = -xRange; i <= xRange; i += tickInterval) {
            if (i === 0) continue;
            // X labels
            p.push();
            p.translate(i * scaleFactor, 15);
            p.scale(1, -1);
            p.text(i, 0, 0);
            p.pop();
        }
        
        for (let i = -yRange; i <= yRange; i += tickInterval) {
            if (i === 0) continue;
            // Y labels
            p.push();
            p.translate(-20, i * scaleFactor);
            p.scale(1, -1);
            p.text(i, 0, 0);
            p.pop();
        }

        // "x" and "y" axis labels
        p.push();
        p.translate(p.width / 2 - 20, 20);
        p.scale(1, -1);
        p.text('x', 0, 0);
        p.pop();

        p.push();
        p.translate(-20, p.height / 2 - 20);
        p.scale(1, -1);
        p.text('y', 0, 0);
        p.pop();
    }
};

/**
 * Converts screen coordinates (pixels) to world coordinates (mathematical).
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
 * Converts world coordinates (mathematical) to screen coordinates (pixels).
 * @param p - The p5 instance.
 * @param worldX - The world x-coordinate.
 * @param worldY - The world y-coordinate.
 * @param scaleFactor - The scaling factor for the drawing.
 * @returns A p5.Vector with the screen coordinates.
 */
export const worldToScreen = (p: p5, worldX: number, worldY: number, scaleFactor: number): p5.Vector => {
    const screenX = worldX * scaleFactor + p.width / 2;
    const screenY = p.height / 2 - worldY * scaleFactor;
    return p.createVector(screenX, screenY);
};


/**
 * Draws two lines representing a 2x2 system of equations.
 * @param p - The p5 instance.
 * @param a - Coefficient a of the line ax + by = c.
 * @param b - Coefficient b of the line ax + by = c.
 * @param c - Coefficient c of the line ax + by = c.
 * @param scaleFactor - The scaling factor.
 * @param color - The color of the line.
 */
export const drawLine = (p: p5, a: number, b: number, c: number, scaleFactor: number, color: p5.Color) => {
    p.stroke(color);
    p.strokeWeight(2);
    const xRange = p.width / (2 * scaleFactor);
    if (Math.abs(b) > 0.01) {
        const x1 = -xRange, y1 = (c - a * x1) / b;
        const x2 = xRange, y2 = (c - a * x2) / b;
        p.line(x1 * scaleFactor, y1 * scaleFactor, x2 * scaleFactor, y2 * scaleFactor);
    } else if (Math.abs(a) > 0.01) {
        const x = c / a;
        const yRange = p.height / (2 * scaleFactor);
        p.line(x * scaleFactor, -yRange * scaleFactor, x * scaleFactor, yRange * scaleFactor);
    }
};
