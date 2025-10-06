
'use client';

import p5 from 'p5';
import { applyMatrix as applyMatrixMath } from '../math/linear-algebra';

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
    // Implementation to draw both original and transformed grids
};

/**
 * Draws a transformed shape from a list of vertices.
 * @param p - The p5 instance.
 * @param vertices - An array of vectors for the original shape.
 * @param matrix - The transformation matrix.
 * @param scaleFactor - The scaling factor.
 * @param color - The color of the transformed shape.
 */
export const drawTransformedShape = (p: p5, vertices: p5.Vector[], matrix: {a:number, b:number, c:number, d:number}, scaleFactor: number, color: p5.Color) => {
    const transformedVertices = vertices.map(v => applyMatrix(p, matrix, v));
    p.fill(color);
    p.noStroke();
    p.beginShape();
    transformedVertices.forEach(v => p.vertex(v.x * scaleFactor, v.y * scaleFactor));
    p.endShape(p.CLOSE);
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
    // Implementation to visualize matrix multiplication
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
    // Implementation to draw a shape, its transformation, and its return to origin via the inverse
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
    // ... Implementation to shade the span
};
