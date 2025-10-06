
'use client';

import p5 from 'p5';

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
 * Draws an arc showing the angle between vectors with optional dot product formula: v1·v2 = |v1||v2|cos(θ).
 * Links geometric angle to algebraic dot product formula.
 * @param p The p5 instance.
 * @param v1 The first vector.
 * @param v2 The second vector.
 * @param scaleFactor The scaling factor for the drawing.
 * @param color The color of the arc.
 * @param showDotProduct Whether to show the dot product formula.
 */
export const drawAngleBetweenVectors = (p: p5, v1: p5.Vector, v2: p5.Vector, scaleFactor: number, color: p5.Color, showDotProduct: boolean = true) => {
    const angle = p5.Vector.angleBetween(v1, v2);
    p.noFill(); p.stroke(color); p.strokeWeight(1.5);
    const arcSize = p.min(v1.mag(), v2.mag()) * scaleFactor * 0.5;
    p.arc(0, 0, arcSize, arcSize, p.min(v1.heading(), v2.heading()), p.max(v1.heading(), v2.heading()));

    if (showDotProduct) {
        const textPos = p5.Vector.mult(p5.Vector.add(v1, v2).normalize(), arcSize * 1.2);
        p.fill(color); p.noStroke(); p.textSize(12);
        p.text(`θ = ${p.degrees(angle).toFixed(1)}°`, textPos.x, textPos.y);
    }
};

/**
 * Renders the matrix in standard bracket notation [[a,b],[c,d]] at the specified screen position.
 * Shows the algebraic representation alongside the geometric transformation.
 * @param p The p5 instance.
 * @param matrix The matrix to draw.
 * @param position The screen position to draw at.
 * @param color The color of the text.
 */
export const drawMatrixNotation = (p: p5, matrix: {a:number,b:number,c:number,d:number}, position: p5.Vector, color: p5.Color) => {
    p.push();
    p.translate(position.x, position.y);
    p.scale(1, -1);
    p.fill(color); p.noStroke(); p.textSize(16); p.textFont('monospace');
    p.text(`[[${matrix.a.toFixed(1)}, ${matrix.b.toFixed(1)}],\n [${matrix.c.toFixed(1)}, ${matrix.d.toFixed(1)}]]`, 0, 0);
    p.pop();
};
