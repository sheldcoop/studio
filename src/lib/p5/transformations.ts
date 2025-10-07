
'use client';

import p5 from 'p5';
import { applyMatrix as applyMatrixMath, calculateDeterminant, invertMatrix, matrixMultiply, calculateSVD as calculateSVDMath } from '@/lib/math/linear-algebra';
import { drawVector, drawParallelogram, drawDashedLine } from './primitives';
import { easeInOutCubic } from './animation';
import { drawLine, drawGrid } from './coordinate-system';

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
    if (ontoMagSq < 1e-9) return;
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

export const drawSVD = (p: p5, matrix: {a:number,b:number,c:number,d:number}, progress: number, scaleFactor: number) => {
    const svdData = calculateSVDMath(matrix);
    if (!svdData) return;
    
    const t = easeInOutCubic(progress);

    const t1_end = 1/3, t2_end = 2/3;
    let b1: p5.Vector, b2: p5.Vector;

    const v1 = p.createVector(svdData.V.v1.x, svdData.V.v1.y);
    const v2 = p.createVector(svdData.V.v2.x, svdData.V.v2.y);
    const u1 = p.createVector(svdData.U.u1.x, svdData.U.u1.y);
    const u2 = p.createVector(svdData.U.u2.x, svdData.U.u2.y);

    if (t < t1_end) {
        const t1 = p.map(t, 0, t1_end, 0, 1);
        b1 = p5.Vector.lerp(p.createVector(1,0), v1, t1);
        b2 = p5.Vector.lerp(p.createVector(0,1), v2, t1);
    } else if (t < t2_end) {
        const t2 = p.map(t, t1_end, t2_end, 0, 1);
        b1 = v1.copy().mult(p.lerp(1, svdData.Sigma.s1, t2));
        b2 = v2.copy().mult(p.lerp(1, svdData.Sigma.s2, t2));
    } else {
        const t3 = p.map(t, t2_end, 1, 0, 1);
        const scaled_v1 = v1.copy().mult(svdData.Sigma.s1);
        const scaled_v2 = v2.copy().mult(svdData.Sigma.s2);
        
        const final_b1 = u1.copy().mult(svdData.Sigma.s1);
        const final_b2 = u2.copy().mult(svdData.Sigma.s2);

        b1 = p5.Vector.lerp(scaled_v1, final_b1, t3);
        b2 = p5.Vector.lerp(scaled_v2, final_b2, t3);
    }

    drawGrid(p, b1, b2, p.color(72, 144, 226, 80), 1.5, scaleFactor);
    drawVector(p, b1, scaleFactor, p.color(255,100,100), 'Av₁', 3);
    drawVector(p, b2, scaleFactor, p.color(100,255,100), 'Av₂', 3);
};

export const drawLeastSquaresProjection = (p: p5, A_col1: p5.Vector, A_col2: p5.Vector, b: p5.Vector, scaleFactor: number) => {
    // A is the matrix [A_col1 | A_col2]
    const AtA = {
        a: A_col1.dot(A_col1), // a*a + c*c
        b: A_col1.dot(A_col2), // a*b + c*d
        c: A_col2.dot(A_col1), // b*a + d*c
        d: A_col2.dot(A_col2), // b*b + d*d
    };
    
    const AtA_inv = invertMatrix(AtA);

    if (!AtA_inv) return; // If A^T A is not invertible

    const At_b = {
        x: A_col1.dot(b),
        y: A_col2.dot(b),
    };

    const x_hat = {
        x: AtA_inv.a * At_b.x + AtA_inv.b * At_b.y,
        y: AtA_inv.c * At_b.x + AtA_inv.d * At_b.y,
    };

    const proj_b = p5.Vector.add(A_col1.copy().mult(x_hat.x), A_col2.copy().mult(x_hat.y));

    // Draw the column space plane
    const spanColor = p.color(100, 150, 255, 50);
    drawSpan(p, A_col1, A_col2, scaleFactor, spanColor, false);

    // Draw the vectors
    drawVector(p, A_col1, scaleFactor, p.color(100,100,255), 'col₁', 2);
    drawVector(p, A_col2, scaleFactor, p.color(100,100,255), 'col₂', 2);
    drawVector(p, b, scaleFactor, p.color(255,100,100), 'b', 3);
    drawVector(p, proj_b, scaleFactor, p.color(255,255,0), 'p', 3);
    
    // Draw the error vector
    const error_vec = p5.Vector.sub(b, proj_b);
    drawVector(p, error_vec, scaleFactor, p.color(200), 'error', 2, proj_b);
    
    drawDashedLine(p, b.copy().mult(scaleFactor), proj_b.copy().mult(scaleFactor), p.color(255,255,255,100), 1, [5,5]);
};

export const drawGramSchmidt = (p: p5, v1: p5.Vector, v2: p5.Vector, progress: number, scaleFactor: number) => {
    if (v1.magSq() < 1e-9 || v2.magSq() < 1e-9) {
        console.warn('drawGramSchmidt: zero vector detected');
        return;
    }
    const t = easeInOutCubic(progress);

    const u1 = v1.copy();
    const proj = u1.copy().mult(v2.dot(u1) / u1.magSq());
    const u2 = p5.Vector.sub(v2, proj);

    const t_v1_fade = p.map(t, 0.2, 0.4, 1, 0, true);
    const t_v2_fade = p.map(t, 0.5, 0.7, 1, 0, true);
    const t_u1_show = p.map(t, 0.1, 0.3, 0, 1, true);
    const t_proj_show = p.map(t, 0.4, 0.6, 0, 1, true);
    const t_u2_show = p.map(t, 0.7, 0.9, 0, 1, true);

    drawVector(p, v1, scaleFactor, p.color(255,100,100, 255 * t_v1_fade), 'v₁');
    drawVector(p, v2, scaleFactor, p.color(100,100,255, 255 * t_v2_fade), 'v₂');
    
    drawVector(p, u1, scaleFactor, p.color(255,255,0, 255 * t_u1_show), 'u₁');
    drawVector(p, proj, scaleFactor, p.color(200, 255 * t_proj_show), 'proj');
    drawVector(p, u2, scaleFactor, p.color(0,255,0, 255 * t_u2_show), 'u₂');
};

export const drawChangeOfBasis = (p: p5, v_std: p5.Vector, b1: p5.Vector, b2: p5.Vector, progress: number, scaleFactor: number) => {
    const det = b1.x * b2.y - b1.y * b2.x;
    if (Math.abs(det) < 0.01) {
        p.push();
        p.scale(1, -1);
        p.fill(255, 0, 0);
        p.text('Invalid basis: vectors are parallel', 0, 0);
        p.pop();
        return;
    }
    const t = easeInOutCubic(progress);
    
    const b1_interp = p5.Vector.lerp(p.createVector(1,0), b1, t);
    const b2_interp = p5.Vector.lerp(p.createVector(0,1), b2, t);

    drawGrid(p, b1_interp, b2_interp, p.color(72,144,226, 80), 1.5, scaleFactor);
    drawVector(p, v_std, scaleFactor, p.color(255,255,0), 'v');
};

export const drawRank = (p: p5, matrix: {a:number,b:number,c:number,d:number}, scaleFactor: number) => {
    const col1 = p.createVector(matrix.a, matrix.c);
    const col2 = p.createVector(matrix.b, matrix.d);
    
    const det = matrix.a * matrix.d - matrix.b * matrix.c;
    const rank = Math.abs(det) < 0.01 ? 1 : 2;

    const spanColor = rank === 2 ? p.color(100, 150, 255, 50) : p.color(255, 100, 100, 50);
    drawSpan(p, col1, col2, scaleFactor, spanColor, false);

    drawVector(p, col1, scaleFactor, p.color(255,100,100), 'col₁');
    drawVector(p, col2, scaleFactor, p.color(100,255,100), 'col₂');
    
    p.push();
    p.scale(1, -1);
    p.fill(255);
    p.textSize(24);
    p.textAlign(p.CENTER);
    p.text(`Rank = ${rank}`, 0, -p.height/2 + 30);
    p.pop();
};

export const drawConditionNumber = (p: p5, matrix: {a:number,b:number,c:number,d:number}, scaleFactor: number) => {
    const svd = calculateSVDMath(matrix);
    if (!svd) return;

    const cond = svd.Sigma.s2 > 1e-9 ? svd.Sigma.s1 / svd.Sigma.s2 : Infinity;
    
    const b1 = p.createVector(matrix.a, matrix.c);
    const b2 = p.createVector(matrix.b, matrix.d);

    drawGrid(p, b1, b2, p.color(72,144,226, 80), 1, scaleFactor);
    drawVector(p, b1, scaleFactor, p.color(255,100,100), null, 3);
    drawVector(p, b2, scaleFactor, p.color(100,255,100), null, 3);
    
    p.push();
    p.scale(1, -1);
    p.fill(255);
    p.textSize(24);
    p.textAlign(p.CENTER);
    p.text(`Condition Number ≈ ${isFinite(cond) ? cond.toFixed(2) : '∞'}`, 0, -p.height/2 + 30);
    p.pop();
};

export const drawPCA = (p: p5, dataPoints: p5.Vector[], scaleFactor: number) => {
    if (dataPoints.length < 2) return;
    const mean = dataPoints.reduce((acc, v) => p5.Vector.add(acc, v), p.createVector(0,0)).div(dataPoints.length);
    const centered = dataPoints.map(v => p5.Vector.sub(v, mean));

    let cov_xx = 0, cov_xy = 0, cov_yy = 0;
    for (const v of centered) {
        cov_xx += v.x * v.x;
        cov_xy += v.x * v.y;
        cov_yy += v.y * v.y;
    }
    cov_xx /= (centered.length - 1);
    cov_xy /= (centered.length - 1);
    cov_yy /= (centered.length - 1);

    const trace = cov_xx + cov_yy;
    const det = cov_xx*cov_yy - cov_xy*cov_xy;
    const discriminant = Math.sqrt(Math.max(0, trace*trace - 4*det));
    const l1 = (trace + discriminant) / 2;

    const v1 = (Math.abs(cov_xy) < 0.001) ? p.createVector(1,0) : p.createVector(l1 - cov_yy, cov_xy).normalize();
    const v2 = p.createVector(-v1.y, v1.x);

    // Draw data points
    p.noStroke();
    p.fill(200, 150);
    dataPoints.forEach(pt => p.ellipse(pt.x * scaleFactor, pt.y * scaleFactor, 5, 5));
    
    // Draw PCA vectors
    drawVector(p, v1.copy().mult(Math.sqrt(l1)*2), scaleFactor, p.color(255,100,100), 'PC1', 3, mean);
    drawVector(p, v2.copy().mult(Math.sqrt(trace - l1)*2), scaleFactor, p.color(100,255,100), 'PC2', 3, mean);
};

    
    