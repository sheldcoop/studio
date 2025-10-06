
'use client';

import p5 from 'p5';

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
 * Draws a grid that has been transformed by the given matrix, showing how the transformation warps space.
 * Helps students see how matrices affect the entire coordinate system, not just individual points.
 * @param p - The p5 instance.
 * @param matrix - The 2x2 transformation matrix.
 * @param scaleFactor - The scaling factor for the drawing.
 * @param color - The color of the grid lines.
 */
export const drawTransformedGrid = (p: p5, matrix: { a: number, b: number, c: number, d: number }, scaleFactor: number, color: p5.Color) => {
    const transformedBasis1 = p.createVector(matrix.a, matrix.c);
    const transformedBasis2 = p.createVector(matrix.b, matrix.d);
    drawGrid(p, transformedBasis1, transformedBasis2, color, 1, scaleFactor);
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
 * Draws a vector with special styling (e.g., dashed line, different thickness) to indicate it's an eigenvector.
 * Includes a label showing the eigenvalue, useful for teaching matrix eigenspaces.
 * @param p - The p5 instance.
 * @param vector - The eigenvector.
 * @param eigenvalue - The corresponding eigenvalue.
 * @param scaleFactor - The scaling factor for the drawing.
 * @param color - The color of the eigenvector.
 */
export const drawEigenvector = (p: p5, vector: p5.Vector, eigenvalue: number, scaleFactor: number, color: p5.Color) => {
    p.stroke(color);
    p.strokeWeight(1);
    if (p.drawingContext.setLineDash) {
        p.drawingContext.setLineDash([5, 5]);
    }
    const extendedStart = p5.Vector.mult(vector, -100);
    const extendedEnd = p5.Vector.mult(vector, 100);
    p.line(extendedStart.x * scaleFactor, extendedStart.y * scaleFactor, extendedEnd.x * scaleFactor, extendedEnd.y * scaleFactor);
    if (p.drawingContext.setLineDash) {
        p.drawingContext.setLineDash([]);
    }
    
    const scaledVector = p5.Vector.mult(vector, eigenvalue);
    drawVector(p, scaledVector, scaleFactor, color, `λ=${eigenvalue.toFixed(2)}`, 3);
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
    const labelOffset = p5.Vector.mult(v.copy().normalize(), 20);
    const labelPos = p5.Vector.add(v, labelOffset);
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

/**
 * Draws a transformed unit circle based on a transformation function.
 * @param p - The p5 instance.
 * @param transform - A function that takes x, y and returns the transformed coordinates.
 * @param scaleFactor - The scaling factor for the drawing.
 * @param color - The color of the circle.
 */
export const drawTransformedCircle = (p: p5, transform: (x: number, y: number) => { x: number; y: number }, scaleFactor: number, color: p5.Color) => {
    p.noFill(); p.stroke(color); p.strokeWeight(3);
    p.beginShape();
    for (let i = 0; i <= 64; i++) {
        const angle = p.map(i, 0, 64, 0, p.TWO_PI);
        const { x, y } = transform(p.cos(angle), p.sin(angle));
        p.vertex(x * scaleFactor, y * scaleFactor);
    }
    p.endShape(p.CLOSE);
};

/**
 * Draws a line representing a null space.
 * @param p - The p5 instance.
 * @param v - The vector defining the null space.
 * @param s - The scaling factor.
 */
export const drawNullSpace = (p: p5, v: p5.Vector, s: number) => {
    p.stroke(239, 68, 68, 150);
    p.strokeWeight(3);
    const p1 = p5.Vector.mult(v, -p.width);
    const p2 = p5.Vector.mult(v, p.width);
    p.line(p1.x * s, p1.y * s, p2.x * s, p2.y * s);
};


/**
 * Draws a parallelogram defined by two vectors from the origin, showing the area they span.
 * Perfect for visualizing vector addition, linear combinations, and determinants (area = |det|).
 * @param p - The p5 instance.
 * @param v1 - The first basis vector.
 * @param v2 - The second basis vector.
 * @param scaleFactor - The scaling factor for the drawing.
 * @param fillColor - The color to fill the parallelogram.
 * @param strokeColor - The color of the parallelogram's border.
 */
export const drawParallelogram = (p: p5, v1: p5.Vector, v2: p5.Vector, scaleFactor: number, fillColor: p5.Color, strokeColor: p5.Color) => {
    p.push();
    p.fill(fillColor);
    p.stroke(strokeColor);
    p.strokeWeight(2);
    p.beginShape();
    p.vertex(0, 0);
    p.vertex(v1.x * scaleFactor, v1.y * scaleFactor);
    const v3 = p5.Vector.add(v1, v2);
    p.vertex(v3.x * scaleFactor, v3.y * scaleFactor);
    p.vertex(v2.x * scaleFactor, v2.y * scaleFactor);
    p.endShape(p.CLOSE);
    p.pop();
};


/**
 * Draws an axis-aligned rectangle at the given corner position with specified dimensions.
 * Useful for showing areas, bounds, and how rectangles transform under matrices.
 * @param p - The p5 instance.
 * @param corner - The vector representing the top-left corner.
 * @param width - The width of the rectangle.
 * @param height - The height of the rectangle.
 * @param scaleFactor - The scaling factor for the drawing.
 * @param color - The color of the rectangle.
 */
export const drawRectangle = (p: p5, corner: p5.Vector, width: number, height: number, scaleFactor: number, color: p5.Color) => {
    p.push();
    p.fill(color);
    p.noStroke();
    p.rect(corner.x * scaleFactor, corner.y * scaleFactor, width * scaleFactor, height * scaleFactor);
    p.pop();
};

/**
 * Draws a closed polygon connecting the given array of vertex positions.
 * Flexible shape primitive that can be used to show how any shape transforms under linear transformations.
 * @param p - The p5 instance.
 * @param vertices - An array of p5.Vector objects.
 * @param scaleFactor - The scaling factor for the drawing.
 * @param fillColor - The color to fill the polygon.
 * @param strokeColor - The color of the polygon's border.
 */
export const drawPolygon = (p: p5, vertices: p5.Vector[], scaleFactor: number, fillColor: p5.Color, strokeColor: p5.Color) => {
    p.push();
    p.fill(fillColor);
    p.stroke(strokeColor);
    p.strokeWeight(2);
    p.beginShape();
    for (const v of vertices) {
        p.vertex(v.x * scaleFactor, v.y * scaleFactor);
    }
    p.endShape(p.CLOSE);
    p.pop();
};

/**
 * Takes an array of vertices and a transformation matrix, draws the shape after applying the transformation.
 * Shows students exactly how matrices affect shapes, making abstract linear algebra concrete.
 * @param p - The p5 instance.
 * @param vertices - An array of p5.Vector objects representing the original shape.
 * @param matrix - The transformation matrix.
 * @param scaleFactor - The scaling factor for the drawing.
 * @param color - The color of the transformed shape.
 */
export const drawTransformedShape = (p: p5, vertices: p5.Vector[], matrix: { a: number, b: number, c: number, d: number }, scaleFactor: number, color: p5.Color) => {
    const transformedVertices = vertices.map(v => {
        const tx = matrix.a * v.x + matrix.b * v.y;
        const ty = matrix.c * v.x + matrix.d * v.y;
        return p.createVector(tx, ty);
    });
    drawPolygon(p, transformedVertices, scaleFactor, color, color);
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

/**
 * Returns an interpolated matrix between two transformation matrices based on progress (0 to 1).
 * Use with for smooth animations showing how one transformation morphs into another.
 * @param p - The p5 instance.
 * @param fromMatrix - The starting matrix.
 * @param toMatrix - The ending matrix.
 * @param progress - The progress of the animation (0 to 1).
 * @returns The interpolated matrix.
 */
export const animateTransformation = (p: p5, fromMatrix: {a: number, b: number, c: number, d: number}, toMatrix: {a: number, b: number, c: number, d: number}, progress: number): {a: number, b: number, c: number, d: number} => {
    const t = easeInOutCubic(progress);
    return {
        a: p.lerp(fromMatrix.a, toMatrix.a, t),
        b: p.lerp(fromMatrix.b, toMatrix.b, t),
        c: p.lerp(fromMatrix.c, toMatrix.c, t),
        d: p.lerp(fromMatrix.d, toMatrix.d, t)
    };
};

// #endregion
