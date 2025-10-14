
import * as THREE from 'three';
import { drawArrow, drawShading, drawPlane } from './primitives'; 

// --- HELPER FUNCTIONS ---

/**
 * Creates a THREE.Matrix4 from a 2D matrix object for transformations on the XY plane.
 * The matrix {a, b, c, d} corresponds to the new basis vectors as columns:
 * b1 = [a, c], b2 = [b, d]
 */
const matrix4From2D = (m: { a: number; b: number; c: number; d: number }) => {
    const mat4 = new THREE.Matrix4();
    mat4.set(
        m.a, m.b, 0, 0,
        m.c, m.d, 0, 0,
        0,   0,   1, 0,
        0,   0,   0, 1
    );
    return mat4;
};


// --- TRANSFORMATION FUNCTIONS ---

type TransformedGridOptions = {
    matrix: { a: number; b: number; c: number; d: number };
    gridColor?: THREE.ColorRepresentation;
    size?: number;
    divisions?: number;
};

/**
 * Visualizes a skewed grid based on a transformation matrix.
 * Returns a THREE.Group containing the transformed grid.
 */
export const drawTransformedGrid = (parent: THREE.Group, options: TransformedGridOptions): void => {
    const {
        matrix,
        gridColor = 0x888888,
        size = 50,
        divisions = 25,
    } = options;

    const material = new THREE.LineBasicMaterial({ color: gridColor, transparent: true, opacity: 0.5 });
    const m4 = matrix4From2D(matrix);
    const step = size / divisions;

    for (let i = -divisions; i <= divisions; i++) {
        // Create lines parallel to the original Y-axis and transform them
        const startX = new THREE.Vector3(i * step / (size / divisions), -size/2, 0);
        const endX = new THREE.Vector3(i * step / (size / divisions), size/2, 0);
        startX.applyMatrix4(m4);
        endX.applyMatrix4(m4);
        const geomX = new THREE.BufferGeometry().setFromPoints([startX, endX]);
        const lineX = new THREE.Line(geomX, material);
        parent.add(lineX);

        // Create lines parallel to the original X-axis and transform them
        const startY = new THREE.Vector3(-size/2, i * step / (size / divisions), 0);
        const endY = new THREE.Vector3(size/2, i * step / (size / divisions), 0);
        startY.applyMatrix4(m4);
        endY.applyMatrix4(m4);
        const geomY = new THREE.BufferGeometry().setFromPoints([startY, endY]);
        const lineY = new THREE.Line(geomY, material);
        parent.add(lineY);
    }
};


type ColumnSpaceOptions = {
    matrix: { a: number; b: number; c: number; d: number };
    scaleFactor?: number;
    color?: THREE.ColorRepresentation;
};

/**
 * Visualizes the column space of a 2D matrix.
 * Returns a THREE.Group containing the visualization.
 */
export const drawColumnSpace = (scene: THREE.Scene, options: ColumnSpaceOptions): THREE.Group => {
    const {
        matrix,
        scaleFactor = 1,
        color = 0x81c784
    } = options;

    const group = new THREE.Group();
    const col1 = new THREE.Vector3(matrix.a, matrix.c, 0);
    const col2 = new THREE.Vector3(matrix.b, matrix.d, 0);

    const det = matrix.a * matrix.d - matrix.b * matrix.c;

    if (Math.abs(det) < 0.01) { // It's a line
        const dir = col1.length() > col2.length() ? col1 : col2;
        const line = drawArrow(scene, { origin: dir.clone().multiplyScalar(-10), destination: dir.clone().multiplyScalar(10), color: 0xffffff, headLength: 0, headWidth: 0});
        group.add(line);
    } else { // It's a plane/area
        const points = [
            new THREE.Vector2(0,0),
            new THREE.Vector2(col1.x, col1.y),
            new THREE.Vector2(col1.x + col2.x, col1.y + col2.y),
            new THREE.Vector2(col2.x, col2.y),
        ];
        const shading = drawShading(scene, { points, color });
        group.add(shading);
    }

    // Draw column vectors
    group.add(drawArrow(scene, { origin: new THREE.Vector3(), destination: col1, color: 0xff8a65, label: 'col₁' }));
    group.add(drawArrow(scene, { origin: new THREE.Vector3(), destination: col2, color: 0x4fc3f7, label: 'col₂' }));
    
    group.scale.set(scaleFactor, scaleFactor, scaleFactor);
    scene.add(group);
    return group;
};


type ProjectionOptions = {
    vector: THREE.Vector3;
    onto: THREE.Vector3;
    scaleFactor?: number;
    vectorColor?: THREE.ColorRepresentation;
    projectionColor?: THREE.ColorRepresentation;
};

/**
 * Visualizes the projection of one vector onto another.
 */
export const drawProjection = (scene: THREE.Scene, options: ProjectionOptions): THREE.Group => {
    const { vector, onto, scaleFactor = 1, vectorColor = 0xffffff, projectionColor = 0xffeb3b } = options;

    if (onto.lengthSq() < 1e-9) return new THREE.Group();

    const group = new THREE.Group();

    const proj = onto.clone().multiplyScalar(vector.dot(onto) / onto.lengthSq());

    group.add(drawArrow(scene, { origin: new THREE.Vector3(), destination: vector, color: vectorColor, label: 'v' }));
    group.add(drawArrow(scene, { origin: new THREE.Vector3(), destination: onto.clone().normalize().multiplyScalar(3), color: 0x9e9e9e, label: 'u'}));
    group.add(drawArrow(scene, { origin: new THREE.Vector3(), destination: proj, color: projectionColor, label: 'proj' }));

    // Dashed line from v to its projection
    const dashedMaterial = new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.1, gapSize: 0.1, transparent: true, opacity: 0.7 });
    const dashedGeom = new THREE.BufferGeometry().setFromPoints([vector, proj]);
    const dashedLine = new THREE.Line(dashedGeom, dashedMaterial);
    dashedLine.computeLineDistances();
    group.add(dashedLine);
    
    group.scale.set(scaleFactor, scaleFactor, scaleFactor);
    scene.add(group);
    return group;
};

// --- MATH VISUALIZATION FUNCTIONS ---

type EigenspaceOptions = {
    eigenvector: THREE.Vector3;
    eigenvalue: number;
    scaleFactor?: number;
    color?: THREE.ColorRepresentation;
    showScaling?: boolean;
};

/**
 * Visualizes an eigenvector and its corresponding eigenspace (a line).
 */
export const drawEigenspace = (scene: THREE.Scene, options: EigenspaceOptions): THREE.Group => {
    const {
        eigenvector,
        eigenvalue,
        scaleFactor = 1,
        color = 0xfbc02d,
        showScaling = true
    } = options;

    const group = new THREE.Group();

    // Draw the eigenspace line
    const dir = eigenvector.clone().normalize();
    const lineMaterial = new THREE.LineDashedMaterial({ color, dashSize: 0.2, gapSize: 0.1 });
    const lineGeom = new THREE.BufferGeometry().setFromPoints([
        dir.clone().multiplyScalar(-100),
        dir.clone().multiplyScalar(100)
    ]);
    const eigenspaceLine = new THREE.Line(lineGeom, lineMaterial);
    eigenspaceLine.computeLineDistances();
    group.add(eigenspaceLine);

    // Draw the eigenvector
    group.add(drawArrow(scene, {
        origin: new THREE.Vector3(),
        destination: eigenvector,
        color,
        label: 'v'
    }));

    if (showScaling) {
        // Draw the scaled eigenvector
        const scaledVector = eigenvector.clone().multiplyScalar(eigenvalue);
        group.add(drawArrow(scene, {
            origin: new THREE.Vector3(),
            destination: scaledVector,
            color,
            label: `λv (λ=${eigenvalue.toFixed(2)})`
        }));
    }
    
    group.scale.set(scaleFactor, scaleFactor, scaleFactor);
    scene.add(group);
    return group;
};

type SubspaceOptions = {
    basis: THREE.Vector3[];
    scaleFactor?: number;
    color?: THREE.ColorRepresentation;
    label?: string;
};

/**
 * Visualizes a subspace (line or plane) defined by a set of basis vectors.
 */
export const drawSubspace = (scene: THREE.Scene, options: SubspaceOptions): THREE.Group => {
    const { basis, scaleFactor = 1, color = 0x64b5f6, label } = options;
    const group = new THREE.Group();

    if (basis.length === 0) return group;

    if (basis.length === 1) { // Line
        const dir = basis[0].clone().normalize();
        const line = drawArrow(scene, {
            origin: dir.clone().multiplyScalar(-10),
            destination: dir.clone().multiplyScalar(10),
            color,
            headLength: 0,
            headWidth: 0,
            label
        });
        group.add(line);
    } else { // Plane
        const normal = new THREE.Vector3().crossVectors(basis[0], basis[1]).normalize();
        const rotation = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal));
        
        const plane = drawPlane(scene, {
            size: 20,
            color,
            rotation,
            label
        });
        group.add(plane);
    }
    
    group.scale.set(scaleFactor, scaleFactor, scaleFactor);
    scene.add(group);
    return group;
};


type FourSubspacesOptions = {
    matrix: { a: number; b: number; c: number; d: number }; // 2D matrix
    scaleFactor?: number;
};

/**
 * Visualizes the four fundamental subspaces of a 2D matrix.
 * C(A): Column Space, N(A^T): Left Null Space
 * C(A^T): Row Space, N(A): Null Space
 */
export const drawFourSubspaces = (scene: THREE.Scene, options: FourSubspacesOptions): THREE.Group => {
    const { matrix, scaleFactor = 1 } = options;
    const group = new THREE.Group();

    // C(A) - Column Space (in the codomain)
    const col1 = new THREE.Vector3(matrix.a, matrix.c, 0);
    const col2 = new THREE.Vector3(matrix.b, matrix.d, 0);
    const colSpace = drawSubspace(scene, { basis: [col1, col2], color: 0xef5350, label: 'C(A)' });
    colSpace.position.x = 7; // Shift to the right to separate domain and codomain
    group.add(colSpace);

    // C(A^T) - Row Space (in the domain)
    const row1 = new THREE.Vector3(matrix.a, matrix.b, 0);
    const row2 = new THREE.Vector3(matrix.c, matrix.d, 0);
    const rowSpace = drawSubspace(scene, { basis: [row1, row2], color: 0x42a5f5, label: 'C(Aᵀ)' });
    rowSpace.position.x = -7; // Shift to the left
    group.add(rowSpace);

    // N(A) - Null Space (in the domain)
    // For a 2x2 matrix, N(A) is orthogonal to the row space.
    // If rank is 2, N(A) is just the origin.
    const det = matrix.a * matrix.d - matrix.b * matrix.c;
    if (Math.abs(det) < 0.01) {
        // N(A) is a line orthogonal to the row vectors
        const nullSpaceDir = new THREE.Vector3(-row1.y, row1.x, 0);
        const nullSpace = drawSubspace(scene, { basis: [nullSpaceDir], color: 0x66bb6a, label: 'N(A)'});
        nullSpace.position.x = -7;
        group.add(nullSpace);
    }
    
    // N(A^T) - Left Null Space (in the codomain)
    // Orthogonal to the column space.
    if (Math.abs(det) < 0.01) {
        const leftNullSpaceDir = new THREE.Vector3(-col1.y, col1.x, 0);
        const leftNullSpace = drawSubspace(scene, { basis: [leftNullSpaceDir], color: 0xffa726, label: 'N(Aᵀ)' });
        leftNullSpace.position.x = 7;
        group.add(leftNullSpace);
    }

    // Add labels for Domain and Codomain
    // This part requires a text solution, which is complex in WebGL.
    // Primitives file has a basic text-sprite helper that could be used.

    group.scale.set(scaleFactor, scaleFactor, scaleFactor);
    scene.add(group);
    return group;
};
