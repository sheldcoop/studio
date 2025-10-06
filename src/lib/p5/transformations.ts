'use client';

import p5 from 'p5';
import { applyMatrix as applyMatrixMath, calculateDeterminant, invertMatrix, matrixMultiply, createProjectionMatrix } from '@/lib/math/linear-algebra';
import { drawGrid, drawVector, drawParallelogram, drawDashedLine } from './primitives';
import { drawLine } from './coordinate-system';

/**
 * Applies a matrix transformation to a p5 vector.
 * @param p - The p5 instance.
 * @param matrix - The transformation matrix.
 * @param vector - The vector to transform.
 * @returns A new p5.Vector with the result.
 */
export const applyMatrix = (p: p5, matrix: { a: number, b: number, c: number, d: number }, vector: p5.Vector): p5.Vector => {
    const result = applyMatrixMath(vector, matrix);
    return p.createVector(result.x, result.y);
};


/**
 * Draws a transformed grid.
 * @param p - The p5 instance.
 * @param matrix - The transformation matrix.
 * @param scaleFactor - The scaling factor.
 * @param originalColor - The color of the original grid.
 * @param transformedColor - The color of the transformed grid.
 */
export const drawTransformedGrid = (p: p5, matrix: { a: number, b: number, c: number, d: number }, scaleFactor: number, originalColor: p5.Color, transformedColor: p5.Color) => {
    // Draw original grid
    const originalBasis1 = p.createVector(1, 0);
    const originalBasis2 = p.createVector(0, 1);
    drawGrid(p, originalBasis1, originalBasis2, originalColor, 1, scaleFactor);
    
    // Draw transformed grid
    const transformedBasis1 = p.createVector(matrix.a, matrix.c);
    const transformedBasis2 = p.createVector(matrix.b, matrix.d);
    drawGrid(p, transformedBasis1, transformedBasis2, transformedColor, 2, scaleFactor);
};

/**
 * Visualizes the composition of two matrix transformations.
 * @param p - The p5 instance.
 * @param m1 - The first matrix.
 * @param m2 - The second matrix.
 * @param scaleFactor - The scaling factor.
 * @param showSteps - If true, shows intermediate transformations.
 */
export const drawMatrixMultiplication = (p: p5, m1: {a: number,b: number,c: number,d: number}, m2: {a: number,b: number,c: number,d: number}, scaleFactor: number, showSteps: boolean = true) => {
    const result = matrixMultiply(m1, m2);
    
    if (showSteps) {
        // Show original, m1 applied, then m2 applied
        const originalBasis1 = p.createVector(1, 0);
        const originalBasis2 = p.createVector(0, 1);
        drawGrid(p, originalBasis1, originalBasis2, p.color(200, 200, 200, 100), 1, scaleFactor);
        
        const afterM1_b1 = p.createVector(m1.a, m1.c);
        const afterM1_b2 = p.createVector(m1.b, m1.d);
        drawGrid(p, afterM1_b1, afterM1_b2, p.color(100, 150, 255, 100), 1.5, scaleFactor);
    }
    
    // Final result
    const finalBasis1 = p.createVector(result.a, result.c);
    const finalBasis2 = p.createVector(result.b, result.d);
    drawGrid(p, finalBasis1, finalBasis2, p.color(255, 100, 100), 2, scaleFactor);
};

/**
 * Visualizes a transformation and its inverse.
 * @param p - The p5 instance.
 * @param matrix - The original matrix.
 * @param scaleFactor - The scaling factor.
 * @param originalColor - The color for the original transformation.
 * @param inverseColor - The color for the inverse transformation.
 */
export const drawInverse = (p: p5, matrix: {a: number,b: number,c: number,d: number}, scaleFactor: number, originalColor: p5.Color, inverseColor: p5.Color) => {
    const inv = invertMatrix(matrix);
    if (!inv) return; // Not invertible
    
    // Draw original transformation
    const transformedBasis1 = p.createVector(matrix.a, matrix.c);
    const transformedBasis2 = p.createVector(matrix.b, matrix.d);
    drawGrid(p, transformedBasis1, transformedBasis2, originalColor, 2, scaleFactor);
    
    // Draw inverse transformation
    const inverseBasis1 = p.createVector(inv.a, inv.c);
    const inverseBasis2 = p.createVector(inv.b, inv.d);
    drawGrid(p, inverseBasis1, inverseBasis2, inverseColor, 1.5, scaleFactor);
};

/**
 * Draws a visual representation of the column space of a matrix.
 * @param p - The p5 instance.
 * @param matrix - The matrix.
 * @param scaleFactor - The scaling factor.
 * @param color - The color for the column space representation.
 */
export const drawColumnSpace = (p: p5, matrix: {a: number,b: number,c: number,d: number}, scaleFactor: number, color: p5.Color) => {
    const col1 = p.createVector(matrix.a, matrix.c);
    const col2 = p.createVector(matrix.b, matrix.d);
    
    // Draw the span as a shaded parallelogram
    p.fill(color);
    p.noStroke();
    p.beginShape();
    p.vertex(0, 0);
    p.vertex(col1.x * scaleFactor * 10, col1.y * scaleFactor * 10);
    const combined = p5.Vector.add(col1.copy().mult(10), col2.copy().mult(10));
    p.vertex(combined.x * scaleFactor, combined.y * scaleFactor);
    p.vertex(col2.x * scaleFactor * 10, col2.y * scaleFactor * 10);
    p.endShape(p.CLOSE);
    
    // Draw the column vectors
    drawVector(p, col1, scaleFactor, p.color(255, 0, 0), 'col₁', 3);
    drawVector(p, col2, scaleFactor, p.color(0, 255, 0), 'col₂', 3);
};


export const drawEigenvector = (p: p5, vector: p5.Vector, eigenvalue: number, scaleFactor: number, color: p5.Color, showScaling: boolean = true) => {
    // Draw the eigenspace as a dashed line through the origin
    p.stroke(color);
    p.strokeWeight(1);
    if (p.drawingContext.setLineDash) {
        p.drawingContext.setLineDash([5, 5]);
    }
    const extended1 = vector.copy().mult(-100);
    const extended2 = vector.copy().mult(100);
    p.line(extended1.x * scaleFactor, extended1.y * scaleFactor, extended2.x * scaleFactor, extended2.y * scaleFactor);
    if (p.drawingContext.setLineDash) {
        p.drawingContext.setLineDash([]);
    }
    
    // Draw the eigenvector and its scaled version
    drawVector(p, vector, scaleFactor, color, null, 3);
    if (showScaling) {
        const scaled = vector.copy().mult(eigenvalue);
        drawVector(p, scaled, scaleFactor, color, `λ=${eigenvalue.toFixed(2)}`, 3);
    }
};

export const drawLinearCombination = (p: p5, v1: p5.Vector, v2: p5.Vector, scalar1: number, scalar2: number, scaleFactor: number, showComponents: boolean = true) => {
    const c1 = v1.copy().mult(scalar1);
    const c2 = v2.copy().mult(scalar2);
    const result = p5.Vector.add(c1, c2);

    if (showComponents) {
        // Draw component vectors
        drawVector(p, c1, scaleFactor, p.color(255, 100, 100, 150), `${scalar1.toFixed(1)}v₁`, 3);
        drawVector(p, c2, scaleFactor, p.color(100, 255, 100, 150), `${scalar2.toFixed(1)}v₂`, 3, c1);
    }
    
    // Draw result
    drawVector(p, result, scaleFactor, p.color(255, 255, 0), 'result', 4);
};

export const drawSpan = (p: p5, v1: p5.Vector, v2: p5.Vector, scaleFactor: number, fillColor: p5.Color, showVectors: boolean = true) => {
    // Check if vectors are linearly dependent
    const cross = v1.x * v2.y - v1.y * v2.x;
    
    if (Math.abs(cross) < 0.01) {
        // Vectors are parallel - draw a line
        p.stroke(fillColor);
        p.strokeWeight(10);
        const extended = v1.copy().normalize().mult(1000);
        p.line(-extended.x * scaleFactor, -extended.y * scaleFactor, extended.x * scaleFactor, extended.y * scaleFactor);
    } else {
        // Vectors span a plane - draw large parallelogram
        drawParallelogram(p, v1.copy().mult(10), v2.copy().mult(10), scaleFactor, fillColor, p.color(0, 0));
    }
    
    if (showVectors) {
        drawVector(p, v1, scaleFactor, p.color(255, 0, 0), 'v₁', 3);
        drawVector(p, v2, scaleFactor, p.color(0, 255, 0), 'v₂', 3);
    }
};

export const drawDeterminantParallelogram = (p: p5, v1: p5.Vector, v2: p5.Vector, scaleFactor: number, fillColor: p5.Color, showArea: boolean = true) => {
    drawParallelogram(p, v1, v2, scaleFactor, fillColor, p.color(255));
    
    if (showArea) {
        const area = Math.abs(calculateDeterminant({ a: v1.x, b: v2.x, c: v1.y, d: v2.y }));
        const center = p5.Vector.add(v1, v2).div(2);
        
        p.push();
        p.fill(255);
        p.stroke(0);
        p.strokeWeight(1);
        p.textSize(20);
        p.textStyle(p.BOLD);
        p.translate(center.x * scaleFactor, center.y * scaleFactor);
        p.scale(1, -1);
        p.text(`Area = ${area.toFixed(2)}`, 0, 0);
        p.pop();
    }
};

export const drawProjection = (p: p5, vector: p5.Vector, onto: p5.Vector, scaleFactor: number, vectorColor: p5.Color, projectionColor: p5.Color) => {
    // Calculate projection: proj = (v·u / |u|²) * u
    const dot = vector.dot(onto);
    const ontoMagSq = onto.magSq();
    const proj = onto.copy().mult(dot / ontoMagSq);
    
    // Draw the vector being projected
    drawVector(p, vector, scaleFactor, vectorColor, 'v', 3);
    
    // Draw the vector we're projecting onto
    drawVector(p, onto.copy().normalize().mult(3), scaleFactor, p.color(200), 'u', 2);
    
    // Draw the projection
    drawVector(p, proj, scaleFactor, projectionColor, 'proj', 3);
    
    // Draw perpendicular line from v to proj
    drawDashedLine(p, vector.copy().mult(scaleFactor), proj.copy().mult(scaleFactor), vectorColor, 1, [3,3]);
};

export const drawLinearSystem = (p: p5, a1: number, b1: number, c1: number, a2: number, b2: number, c2: number, scaleFactor: number, line1Color: p5.Color, line2Color: p5.Color) => {
    // Draw both lines
    drawLine(p, a1, b1, c1, scaleFactor, line1Color);
    drawLine(p, a2, b2, c2, scaleFactor, line2Color);
    
    // Calculate and draw intersection point
    const det = a1 * b2 - a2 * b1;
    if (Math.abs(det) > 1e-9) {
        const x = (c1 * b2 - c2 * b1) / det;
        const y = (a1 * c2 - a2 * c1) / det;
        
        p.fill(255, 255, 0);
        p.stroke(0);
        p.strokeWeight(2);
        p.ellipse(x * scaleFactor, y * scaleFactor, 12, 12);
        
        // Label the solution
        p.push();
        p.noStroke();
        p.fill(255);
        p.textSize(16);
        p.translate(x * scaleFactor + 15, y * scaleFactor - 15);
        p.scale(1, -1);
        p.text(`(${x.toFixed(2)}, ${y.toFixed(2)})`, 0, 0);
        p.pop();
    }
};

export const drawSVD = (p: p5, matrix: {a:number,b:number,c:number,d:number}, svdData: any, progress: number, scaleFactor: number) => {
    if (!svdData) return;
    const t = easeInOutCubic(progress);

    const t1_end = 1/3, t2_end = 2/3;
    let b1: p5.Vector, b2: p5.Vector;

    if (t < t1_end) {
        const t1 = p.map(t, 0, t1_end, 0, 1);
        b1 = p5.Vector.lerp(p.createVector(1,0), p.createVector(svdData.V.v1.x, svdData.V.v1.y), t1);
        b2 = p5.Vector.lerp(p.createVector(0,1), p.createVector(svdData.V.v2.x, svdData.V.v2.y), t1);
    } else if (t < t2_end) {
        const t2 = p.map(t, t1_end, t2_end, 0, 1);
        const v1_scaled = p.createVector(svdData.V.v1.x, svdData.V.v1.y).mult(p.lerp(1, svdData.Sigma.s1, t2));
        const v2_scaled = p.createVector(svdData.V.v2.x, svdData.V.v2.y).mult(p.lerp(1, svdData.Sigma.s2, t2));
        b1 = v1_scaled;
        b2 = v2_scaled;
    } else {
        const t3 = p.map(t, t2_end, 1, 0, 1);
        const v1_final = p.createVector(svdData.V.v1.x * svdData.Sigma.s1, svdData.V.v1.y * svdData.Sigma.s1);
        const v2_final = p.createVector(svdData.V.v2.x * svdData.Sigma.s2, svdData.V.v2.y * svdData.Sigma.s2);
        
        const U = svdData.U;
        const b1_target = p.createVector(U.u1.x * v1_final.mag(), U.u1.y * v1_final.mag());
        const b2_target = p.createVector(U.u2.x * v2_final.mag(), U.u2.y * v2_final.mag());

        b1 = p5.Vector.lerp(v1_final, b1_target, t3);
        b2 = p5.Vector.lerp(v2_final, b2_target, t3);
    }

    drawGrid(p, b1, b2, p.color(72, 144, 226, 80), 1.5, scaleFactor);
    drawVector(p, b1, scaleFactor, p.color(255,100,100), 'Av₁', 3);
    drawVector(p, b2, scaleFactor, p.color(100,255,100), 'Av₂', 3);
};

export const drawLeastSquaresProjection = (p: p5, a: p5.Vector, b: p5.Vector, dataPoint: p5.Vector, scaleFactor: number) => {
    // Project dataPoint onto the column space of A = [a,b]
    const A = [a, b];
    const At = [[a.x, a.y], [b.x, b.y]];
    const AtA = [[At[0][0]*A[0].x + At[0][1]*A[1].x, At[0][0]*A[0].y + At[0][1]*A[1].y], 
                 [At[1][0]*A[0].x + At[1][1]*A[1].x, At[1][0]*A[0].y + At[1][1]*A[1].y]];
    
    const AtA_inv = invertMatrix({a: AtA[0][0], b: AtA[0][1], c: AtA[1][0], d: AtA[1][1]});
    
    if (AtA_inv) {
        const P = createProjectionMatrix({x: a.x, y: b.x}); // Needs to be adapted for 2 vectors
        const proj = applyMatrixMath(dataPoint, P);
        drawVector(p, p.createVector(proj.x, proj.y), scaleFactor, p.color(255,255,0), 'proj');
        drawDashedLine(p, dataPoint.copy().mult(scaleFactor), p.createVector(proj.x, proj.y).mult(scaleFactor), p.color(255), 1, [5,5]);
    }
    
    drawVector(p, a, scaleFactor, p.color(100,100,255), 'a');
    drawVector(p, b, scaleFactor, p.color(100,100,255), 'b');
    drawVector(p, dataPoint, scaleFactor, p.color(255,100,100), 'data');
};
