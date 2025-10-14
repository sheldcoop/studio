
import * as THREE from 'three';
import { createLabel } from './ui-helpers';

type AxesOptions = {
    scaleFactor?: number;
    showLabels?: boolean;
    tickInterval?: number;
    size?: number;
};

/**
 * Draws 3D Cartesian axes (X: red, Y: green, Z: blue) with numeric tick labels.
 */
export const drawAxes = (scene: THREE.Scene, options: AxesOptions = {}): THREE.Group => {
    const {
        scaleFactor = 1,
        showLabels = true,
        tickInterval = 1,
        size = 10
    } = options;

    const group = new THREE.Group();

    const axes = {
        x: { dir: new THREE.Vector3(1, 0, 0), color: 0xff0000, label: 'x' },
        y: { dir: new THREE.Vector3(0, 1, 0), color: 0x00ff00, label: 'y' },
        z: { dir: new THREE.Vector3(0, 0, 1), color: 0x0000ff, label: 'z' },
    };

    for (const [axisName, axis] of Object.entries(axes)) {
        // Main axis line
        const arrow = new THREE.ArrowHelper(axis.dir, new THREE.Vector3(0,0,0), size, axis.color, 0.5, 0.2);
        group.add(arrow);

        if (showLabels) {
            // Axis end label (x, y, z)
            const axisLabelSprite = createLabel(axis.label, axis.color, 0.5);
            axisLabelSprite.position.copy(axis.dir).multiplyScalar(size + 0.8);
            group.add(axisLabelSprite);

            // Numeric tick marks and labels
            const tickMaterial = new THREE.LineBasicMaterial({ color: axis.color });
            const tickSize = 0.2;

            for (let i = -size; i <= size; i += tickInterval) {
                if (i === 0) continue; // Skip origin

                const tickStart = axis.dir.clone().multiplyScalar(i);
                let tickEnd: THREE.Vector3;

                // Create perpendicular tick marks
                if (axisName === 'x') {
                    tickEnd = tickStart.clone().add(new THREE.Vector3(0, tickSize, 0));
                } else if (axisName === 'y') {
                    tickEnd = tickStart.clone().add(new THREE.Vector3(tickSize, 0, 0));
                } else { // z-axis
                    tickEnd = tickStart.clone().add(new THREE.Vector3(tickSize, 0, 0));
                }
                
                const tickGeometry = new THREE.BufferGeometry().setFromPoints([tickStart, tickEnd]);
                const tick = new THREE.Line(tickGeometry, tickMaterial);
                group.add(tick);

                const numLabelSprite = createLabel(i.toString(), axis.color, 0.3);
                numLabelSprite.position.copy(tickStart);
                // Offset labels slightly from the ticks
                if(axisName === 'x') numLabelSprite.position.y -= 0.4;
                else numLabelSprite.position.x -= 0.4;

                group.add(numLabelSprite);
            }
        }
    }
    group.scale.set(scaleFactor, scaleFactor, scaleFactor);
    scene.add(group);
    return group;
};

type GridOptions = {
    b1?: THREE.Vector3;
    b2?: THREE.Vector3;
    gridColor?: THREE.ColorRepresentation;
    scaleFactor?: number;
    size?: number;
};

/**
 * Draws a transformed grid defined by two basis vectors, with a standard grid underneath.
 */
export const drawGrid = (scene: THREE.Scene, options: GridOptions = {}): THREE.Group => {
    const {
        b1 = new THREE.Vector3(1, 0, 0),
        b2 = new THREE.Vector3(0, 0, 1), // Default to XZ plane
        gridColor = 0x888888,
        scaleFactor = 1,
        size = 10,
    } = options;

    const group = new THREE.Group();

    // Standard grid for reference
    const standardGrid = new THREE.GridHelper(size * 2, size * 2, 0x444444, 0x444444);
    group.add(standardGrid);

    // Transformed grid lines
    const material = new THREE.LineBasicMaterial({ color: gridColor });
    const range = Math.floor(size);

    for (let i = -range; i <= range; i++) {
        const p1 = b1.clone().multiplyScalar(i).add(b2.clone().multiplyScalar(-range));
        const p2 = b1.clone().multiplyScalar(i).add(b2.clone().multiplyScalar(range));
        const geomX = new THREE.BufferGeometry().setFromPoints([p1, p2]);
        group.add(new THREE.Line(geomX, material));

        const p3 = b2.clone().multiplyScalar(i).add(b1.clone().multiplyScalar(-range));
        const p4 = b2.clone().multiplyScalar(i).add(b1.clone().multiplyScalar(range));
        const geomY = new THREE.BufferGeometry().setFromPoints([p3, p4]);
        group.add(new THREE.Line(geomY, material));
    }

    group.scale.set(scaleFactor, scaleFactor, scaleFactor);
    scene.add(group);
    return group;
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
export const drawLine = (scene: THREE.Scene, options: LineOptions): THREE.Line => {
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
    scene.add(line);
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
export const drawGridInPlane = (scene: THREE.Scene, options: GridInPlaneOptions): THREE.Group => {
    const { plane, gridColor = 0x888888, scaleFactor = 1, size = 10 } = options;

    const group = new THREE.Group();

    // Create a helper grid
    const grid = new THREE.GridHelper(size * 2, size * 2, gridColor, gridColor);

    // Position and orient the grid to match the plane
    const coplanarPoint = new THREE.Vector3();
    plane.coplanarPoint(coplanarPoint);
    grid.position.copy(coplanarPoint);

    const focalPoint = new THREE.Vector3().copy(coplanarPoint).add(plane.normal);
    grid.lookAt(focalPoint);

    group.add(grid);
    group.scale.set(scaleFactor, scaleFactor, scaleFactor);
    scene.add(group);
    return group;
};
