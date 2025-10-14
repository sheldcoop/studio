
import * as THREE from 'three';
import { createLabel } from './ui-helpers';

type ParentObject = THREE.Scene | THREE.Group;

type AxesOptions = {
    scaleFactor?: number;
    showLabels?: boolean;
    tickInterval?: number;
    size?: number;
    showZ?: boolean; // New option to control Z-axis visibility
};

/**
 * Draws 3D Cartesian axes (X: red, Y: green, Z: blue) with numeric tick labels.
 */
export const drawAxes = (parent: ParentObject, options: AxesOptions = {}): THREE.Group => {
    const {
        showLabels = true,
        tickInterval = 1,
        size = 10,
        showZ = false, // Default to false for 2D focus
    } = options;

    const group = new THREE.Group();

    const axesConfig = {
        x: { dir: new THREE.Vector3(1, 0, 0), color: 0xff3333, label: 'î' },
        y: { dir: new THREE.Vector3(0, 1, 0), color: 0x33ff33, label: 'ĵ' },
        ...(showZ && { z: { dir: new THREE.Vector3(0, 0, 1), color: 0x0000ff, label: 'k' } }),
    };

    for (const [axisName, axis] of Object.entries(axesConfig)) {
        // Main axis line
        const endPoint = axis.dir.clone().multiplyScalar(size);
        const startPoint = axis.dir.clone().multiplyScalar(-size);
        const lineGeom = new THREE.BufferGeometry().setFromPoints([startPoint, endPoint]);
        const lineMat = new THREE.LineBasicMaterial({ color: axis.color, transparent: true, opacity: 0.3 });
        const line = new THREE.Line(lineGeom, lineMat);
        group.add(line);


        if (showLabels) {
            const axisLabelSprite = createLabel(axis.label, axis.color, 0.5);
            axisLabelSprite.position.copy(axis.dir).multiplyScalar(1.2); // Position label at the end of the unit vector
            group.add(axisLabelSprite);
        }
    }
    parent.add(group);
    return group;
};

type GridOptions = {
    gridColor?: THREE.ColorRepresentation;
    size?: number;
};

/**
 * Draws a standard grid on the XY plane.
 */
export const drawGrid = (parent: ParentObject, options: GridOptions = {}): THREE.GridHelper => {
    const {
        gridColor = 0x888888,
        size = 50,
    } = options;

    const grid = new THREE.GridHelper(size, size, gridColor, gridColor);
    grid.rotation.x = Math.PI / 2;
    parent.add(grid);
    return grid;
};

/**
 * Converts screen coordinates (pixels) to world coordinates (3D).
 */
export const screenToWorld = (
    screenPos: THREE.Vector2,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer
): THREE.Vector3 => {
    const ndc = new THREE.Vector2(
        (screenPos.x / renderer.domElement.clientWidth) * 2 - 1,
        -(screenPos.y / renderer.domElement.clientHeight) * 2 + 1
    );
    const vector = new THREE.Vector3(ndc.x, ndc.y, 0.5);
    vector.unproject(camera);
    return vector;
};

/**
 * Converts world coordinates (3D) to screen coordinates (pixels).
 */
export const worldToScreen = (
    worldPos: THREE.Vector3,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer
): THREE.Vector2 => {
    const vector = worldPos.clone().project(camera);
    const screenX = ((vector.x + 1) / 2) * renderer.domElement.clientWidth;
    const screenY = ((-vector.y + 1) / 2) * renderer.domElement.clientHeight;
    return new THREE.Vector2(screenX, screenY);
};

type LineOptions = {
    a: number; b: number; c: number;
    scaleFactor?: number;
    color?: THREE.ColorRepresentation;
    size?: number;
};

/**
 * Draws a line for the equation ax + by = c across the specified size.
 */
export const drawLine = (parent: ParentObject, options: LineOptions): THREE.Line => {
    const { a, b, c, scaleFactor = 1, color = 0xffffff, size = 10 } = options;

    const points = [];
    if (Math.abs(b) > 0.01) { // Not a vertical line
        const x1 = -size; 
        const y1 = (c - a * x1) / b;
        points.push(new THREE.Vector3(x1, y1, 0));
        
        const x2 = size;
        const y2 = (c - a * x2) / b;
        points.push(new THREE.Vector3(x2, y2, 0));
    } else if (Math.abs(a) > 0.01) { // Vertical line
        const x = c / a;
        points.push(new THREE.Vector3(x, -size, 0));
        points.push(new THREE.Vector3(x, size, 0));
    } else {
        return new THREE.Line(); // No line to draw if a and b are both zero
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color });
    const line = new THREE.Line(geometry, material);
    
    line.scale.set(scaleFactor, scaleFactor, scaleFactor);
    parent.add(line);
    return line;
};

type GridInPlaneOptions = {
    plane: THREE.Plane;
    gridColor?: THREE.ColorRepresentation;
    scaleFactor?: number;
    size?: number;
};

/**
 * Draws a grid on an arbitrary plane in 3D space.
 */
export const drawGridInPlane = (parent: ParentObject, options: GridInPlaneOptions): THREE.Group => {
    const { plane, gridColor = 0x888888, scaleFactor = 1, size = 10 } = options;

    const group = new THREE.Group();

    const grid = new THREE.GridHelper(size * 2, size * 2, gridColor, gridColor);

    const coplanarPoint = new THREE.Vector3();
    plane.coplanarPoint(coplanarPoint);
    grid.position.copy(coplanarPoint);

    const focalPoint = new THREE.Vector3().copy(coplanarPoint).add(plane.normal);
    grid.lookAt(focalPoint);

    group.add(grid);
    group.scale.set(scaleFactor, scaleFactor, scaleFactor);
    parent.add(group);
    return group;
};
