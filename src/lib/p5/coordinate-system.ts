
'use client';

import p5 from 'p5';

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
