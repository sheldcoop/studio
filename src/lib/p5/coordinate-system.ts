
'use client';

import p5 from 'p5';

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
            p.translate(i * scaleFactor, 20); // Adjusted offset
            p.scale(1, -1);
            p.text(i, 0, 0);
            p.pop();
        }
        
        for (let i = -yRange; i <= yRange; i += tickInterval) {
            if (i === 0) continue;
            // Y labels
            p.push();
            p.translate(-20, i * scaleFactor); // Adjusted offset
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
 * Draws a transformed grid defined by two basis vectors.
 * It ALWAYS draws a standard, numbered cartesian grid in the background first.
 * @param p - The p5 instance.
 * @param b1 - The first basis vector for the transformed grid.
 * @param b2 - The second basis vector for the transformed grid.
 * @param gridColor - The color of the transformed grid lines.
 * @param weight - The stroke weight of the transformed lines.
 * @param scaleFactor - The scaling factor for the entire drawing.
 */
export const drawGrid = (p: p5, b1: p5.Vector, b2: p5.Vector, gridColor: p5.Color, weight: number, scaleFactor: number) => {
    // Always draw the standard cartesian axes first as a reference.
    const axisColor = p.color(gridColor.levels[0], gridColor.levels[1], gridColor.levels[2], 50);
    drawAxes(p, scaleFactor, axisColor);
    
    if (b1.magSq() < 0.01 || b2.magSq() < 0.01) return;
    
    p.stroke(gridColor);
    p.strokeWeight(weight);

    const det = b1.x * b2.y - b1.y * b2.x;
    if (Math.abs(det) < 0.001) {
        // If basis is degenerate, just draw a line
        const dominantVec = b1.magSq() > b2.magSq() ? b1 : b2;
        if (dominantVec.magSq() > 0.01) {
            const p1 = dominantVec.copy().mult(-100);
            const p2 = dominantVec.copy().mult(100);
            p.line(p1.x * scaleFactor, p1.y * scaleFactor, p2.x * scaleFactor, p2.y * scaleFactor);
        }
        return;
    }
    const invDet = 1 / det;
    
    const corners = [
        p.createVector(-p.width/2, -p.height/2),
        p.createVector(p.width/2, -p.height/2),
        p.createVector(p.width/2, p.height/2),
        p.createVector(-p.width/2, p.height/2)
    ];

    const transformedCorners = corners.map(corner => {
        const x_coord = (corner.x/scaleFactor * b2.y - corner.y/scaleFactor * b2.x) * invDet;
        const y_coord = (corner.y/scaleFactor * b1.x - corner.x/scaleFactor * b1.y) * invDet;
        return {x: x_coord, y: y_coord};
    });
    
    const min_x = Math.floor(Math.min(...transformedCorners.map(c => c.x)));
    const max_x = Math.ceil(Math.max(...transformedCorners.map(c => c.x)));
    const min_y = Math.floor(Math.min(...transformedCorners.map(c => c.y)));
    const max_y = Math.ceil(Math.max(...transformedCorners.map(c => c.y)));

    for(let i = min_x; i <= max_x; i++) {
        const p1 = p5.Vector.add(b1.copy().mult(i), b2.copy().mult(min_y));
        const p2 = p5.Vector.add(b1.copy().mult(i), b2.copy().mult(max_y));
        p.line(p1.x * scaleFactor, p1.y * scaleFactor, p2.x * scaleFactor, p2.y * scaleFactor);
    }
    
    for(let j = min_y; j <= max_y; j++) {
        const p1 = p5.Vector.add(b1.copy().mult(min_x), b2.copy().mult(j));
        const p2 = p5.Vector.add(b1.copy().mult(max_x), b2.copy().mult(j));
        p.line(p1.x * scaleFactor, p1.y * scaleFactor, p2.x * scaleFactor, p2.y * scaleFactor);
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
