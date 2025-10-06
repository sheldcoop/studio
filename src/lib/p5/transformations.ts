
'use client';

import p5 from 'p5';
import { applyMatrix as applyMatrixMath, calculateDeterminant, invertMatrix, matrixMultiply } from '@/lib/math/linear-algebra';
import { drawGrid } from './primitives';
import { drawVector } from './primitives';

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
