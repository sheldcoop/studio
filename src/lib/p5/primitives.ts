'use client';

import p5 from 'p5';
import { calculateEigen } from '../math/linear-algebra';

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

/**
 * Draws a transformed circle based on two basis vectors.
 * @param p - The p5 instance.
 * @param transformFn - A function that takes x,y coords and returns transformed coords.
 * @param s - The scaling factor.
 * @param c - The color of the circle.
 */
export const drawTransformedCircle = (p: p5, transformFn: (x: number, y: number) => {x:number, y:number}, s: number, c: p5.Color) => {
    p.noFill();
    p.stroke(c);
    p.strokeWeight(3);
    p.beginShape();
    for (let i = 0; i <= 64; i++) {
        const angle = p.map(i, 0, 64, 0, p.TWO_PI);
        const x = p.cos(angle);
        const y = p.sin(angle);
        const transformed = transformFn(x, y);
        p.vertex(transformed.x * s, transformed.y * s);
    }
    p.endShape(p.CLOSE);
};

// Moved from coordinate-system.ts
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

export const drawBasisVectors = (p: p5, b1: p5.Vector, b2: p5.Vector, scaleFactor: number, color1: p5.Color, color2: p5.Color, labels: boolean = true) => {
    drawVector(p, b1, scaleFactor, color1, labels ? 'b₁' : null);
    drawVector(p, b2, scaleFactor, color2, labels ? 'b₂' : null);
};

export const drawOrthogonalBasis = (p: p5, v1: p5.Vector, v2: p5.Vector, scaleFactor: number, color: p5.Color, showRightAngle: boolean = true) => {
    drawVector(p, v1, scaleFactor, color, null);
    drawVector(p, v2, scaleFactor, color, null);
    
    if (showRightAngle) {
        const size = 15;
        const n1 = v1.copy().normalize();
        const n2 = v2.copy().normalize();
        p.noFill(); 
        p.stroke(color); 
        p.strokeWeight(1);
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
 * Draws a line representing the null space of a matrix.
 * @param p - The p5 instance.
 * @param v - A vector that defines the direction of the null space.
 * @param s - The scaling factor.
 */
export const drawNullSpace = (p: p5, v: p5.Vector, s: number) => {
    p.stroke(239, 68, 68, 150); // Red
    p.strokeWeight(3);
    const p1 = v.copy().mult(-p.width);
    const p2 = v.copy().mult(p.width);
    p.line(p1.x * s, p1.y * s, p2.x * s, p2.y * s);
};


/**
 * Draws a basic ellipse.
 * @param p - The p5 instance.
 * @param x - The x-coordinate of the center.
 * @param y - The y-coordinate of the center.
 * @param w - The width of the ellipse.
 * @param h - The height of the ellipse.
 * @param color - The fill color of the ellipse.
 */
export const drawBasicEllipse = (p: p5, x: number, y: number, w: number, h: number, color: p5.Color) => {
    p.fill(color);
    p.noStroke();
    p.ellipse(x, y, w, h);
};


/**
 * Draws an ellipse representing the standard deviation contours of a 2D Gaussian distribution
 * defined by a covariance matrix.
 * @param p The p5 instance.
 * @param center The center of the ellipse.
 * @param covMatrix The 2x2 covariance matrix {a, b, c, d}.
 * @param scaleFactor The scaling factor for drawing.
 * @param color The color of the ellipse.
 * @param stdDevs The number of standard deviations the ellipse should represent.
 */
export const drawCovarianceEllipse = (p: p5, center: p5.Vector, covMatrix: {a:number,b:number,c:number,d:number}, scaleFactor: number, color: p5.Color, stdDevs: number = 2) => {
    const eigen = calculateEigen(covMatrix.a, covMatrix.b, covMatrix.c, covMatrix.d);
    if (!eigen) return;

    const { lambda1, lambda2, v1, v2 } = eigen;

    // Eigenvalues are variances, so radii are std devs * sqrt(eigenvalue)
    const radius1 = stdDevs * Math.sqrt(Math.max(0, lambda1));
    const radius2 = stdDevs * Math.sqrt(Math.max(0, lambda2));

    const angle = Math.atan2(v1.y, v1.x);

    p.push();
    p.translate(center.x * scaleFactor, center.y * scaleFactor);
    p.rotate(angle);
    p.noFill();
    p.stroke(color);
    p.strokeWeight(2);
    p.ellipse(0, 0, radius1 * 2 * scaleFactor, radius2 * 2 * scaleFactor);
    p.pop();
};


/**
 * Draws the convex hull of a set of points using the Graham Scan algorithm.
 * @param p The p5 instance.
 * @param points An array of p5.Vector points.
 * @param scaleFactor The scaling factor for drawing.
 * @param color The color of the hull.
 */
export const drawConvexHull = (p: p5, points: p5.Vector[], scaleFactor: number, color: p5.Color) => {
    if (points.length < 3) return;

    // Graham Scan implementation
    const crossProduct = (p1: p5.Vector, p2: p5.Vector, p3: p5.Vector) => {
        return (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
    };

    // Find the point with the lowest y-coordinate
    let startPoint = points[0];
    for (let i = 1; i < points.length; i++) {
        if (points[i].y < startPoint.y || (points[i].y === startPoint.y && points[i].x < startPoint.x)) {
            startPoint = points[i];
        }
    }

    // Sort points by polar angle with respect to the start point
    const sortedPoints = points.slice().sort((a, b) => {
        const order = crossProduct(startPoint, a, b);
        if (order === 0) {
            // Collinear: closer point comes first
            return p5.Vector.dist(startPoint, a) - p5.Vector.dist(startPoint, b);
        }
        return -order; // Sort in counter-clockwise order
    });

    const hull: p5.Vector[] = [];
    for (const point of sortedPoints) {
        while (hull.length > 1 && crossProduct(hull[hull.length - 2], hull[hull.length - 1], point) <= 0) {
            hull.pop();
        }
        hull.push(point);
    }
    
    p.stroke(color);
    p.noFill();
    p.strokeWeight(2);
    p.beginShape();
    hull.forEach(pt => {
        p.vertex(pt.x * scaleFactor, pt.y * scaleFactor);
    });
    p.endShape(p.CLOSE);
};


/**
 * Draws a gradient field, representing the direction of change at various points.
 * @param p The p5 instance.
 * @param gradientFn A function that returns the gradient vector at a given (x,y) point.
 * @param scaleFactor The scaling factor for drawing.
 * @param color The color of the arrows.
 */
export const drawGradientField = (p: p5, gradientFn: (x: number, y: number) => {x: number, y: number}, scaleFactor: number, color: p5.Color) => {
    const range = 8;
    for (let i = -range; i <= range; i++) {
        for (let j = -range; j <= range; j++) {
            const gradData = gradientFn(i, j);
            const grad = p.createVector(gradData.x, gradData.y).normalize().mult(0.3);
            drawVector(p, grad, scaleFactor, color, null, 1, p.createVector(i, j));
        }
    }
};
