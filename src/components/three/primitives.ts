
import * as THREE from 'three';
import { createLabel } from './ui-helpers';

type BaseOptions = {
    color?: THREE.ColorRepresentation;
    scaleFactor?: number;
    label?: string;
};

type PlaneOptions = BaseOptions & {
    size?: number;
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
};

/**
 * Draws a plane. Returns a THREE.Group containing the plane and an optional label.
 */
export const drawPlane = (scene: THREE.Scene, options: PlaneOptions = {}): THREE.Group => {
    const {
        color = 0x1565c0,
        scaleFactor = 1,
        label,
        size = 2,
        position = new THREE.Vector3(0, 0, 0),
        rotation = new THREE.Euler(0, 0, 0)
    } = options;
    
    const group = new THREE.Group();
    group.position.copy(position);
    group.rotation.copy(rotation);
    
    const geometry = new THREE.PlaneGeometry(size * scaleFactor, size * scaleFactor);
    const material = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
    });
    const plane = new THREE.Mesh(geometry, material);
    group.add(plane);

    if (label) {
        const labelSprite = createLabel(label, color, scaleFactor * 0.5);
        if (labelSprite) {
            // Position label slightly above the plane
            labelSprite.position.set(0, 0.1 * scaleFactor, 0);
            group.add(labelSprite);
        }
    }
    
    scene.add(group);
    return group;
};


type CircleOptions = BaseOptions & {
    radius?: number;
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
};

/**
 * Draws a circle. Returns a THREE.Group containing the circle and an optional label.
 */
export const drawCircle = (scene: THREE.Scene, options: CircleOptions = {}): THREE.Group => {
    const {
        color = 0xffffff,
        scaleFactor = 1,
        label,
        radius = 1,
        position = new THREE.Vector3(0, 0, 0),
        rotation = new THREE.Euler(0, 0, 0)
    } = options;

    const group = new THREE.Group();
    group.position.copy(position);
    group.rotation.copy(rotation);
    
    const geometry = new THREE.CircleGeometry(radius * scaleFactor, 32);
    const material = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
    const circle = new THREE.Mesh(geometry, material);
    group.add(circle);
    
    if (label) {
        const labelSprite = createLabel(label, color, scaleFactor * 0.5);
        if (labelSprite) {
            labelSprite.position.set(0, (radius + 0.2) * scaleFactor, 0);
            group.add(labelSprite);
        }
    }
    
    scene.add(group);
    return group;
};


type ArrowOptions = BaseOptions & {
    origin: THREE.Vector3;
    destination: THREE.Vector3;
    headLength?: number;
    headWidth?: number;
};

/**
 * Draws a standalone arrow. Returns a THREE.Group containing the arrow and an optional label.
 */
export const drawArrow = (scene: THREE.Scene, options: ArrowOptions): THREE.Group => {
    const {
        color = 0xffffff,
        scaleFactor = 1,
        label,
        origin,
        destination,
    } = options;

    const group = new THREE.Group();

    const dir = new THREE.Vector3().subVectors(destination, origin);
    const length = dir.length();
    dir.normalize();

    // The head length and width should also be scaled
    const headLength = (options.headLength || 0.2) * scaleFactor;
    const headWidth = (options.headWidth || 0.1) * scaleFactor;

    const arrowHelper = new THREE.ArrowHelper(dir, origin, length, color, headLength, headWidth);
    group.add(arrowHelper);

    if (label) {
        const labelSprite = createLabel(label, color, scaleFactor * 0.4);
        if (labelSprite) {
            // Position label near the arrow's tip
            labelSprite.position.copy(destination).add(new THREE.Vector3(0, headWidth * 1.5, 0));
            group.add(labelSprite);
        }
    }

    scene.add(group);
    return group;
};

/**
 * A more specific version of drawArrow for drawing vectors.
 * This is an alias for drawArrow to make code more readable.
 */
export const drawVector = drawArrow;

export class Vector extends THREE.ArrowHelper {
    private label?: THREE.Sprite;

    constructor(dir: THREE.Vector3, origin: THREE.Vector3, length: number, color?: THREE.ColorRepresentation, headLength?: number, headWidth?: number, labelText?: string) {
        super(dir, origin, length, color, headLength, headWidth);

        if (labelText) {
            this.label = createLabel(labelText, color, 0.4);
            if (this.label) {
                this.add(this.label); // Add label as a child of the ArrowHelper group
                this.updateLabelPosition();
            }
        }
    }

    private updateLabelPosition() {
        if (this.label) {
            // Position label at the tip of the arrow
            const tipPosition = this.position.clone().add(this.getDirection(new THREE.Vector3()).multiplyScalar(this.scale.y));
             this.label.position.copy(tipPosition).add(new THREE.Vector3(0, this.head.scale.y * 1.5, 0));
        }
    }

    setDirection(dir: THREE.Vector3) {
        super.setDirection(dir);
        this.updateLabelPosition();
    }

    setLength(length: number, headLength?: number, headWidth?: number) {
        super.setLength(length, headLength, headWidth);
        this.updateLabelPosition();
    }
}

type ParallelopipedOptions = BaseOptions & {
    v1: THREE.Vector3;
    v2: THREE.Vector3;
    v3: THREE.Vector3;
    origin?: THREE.Vector3;
};

/**
 * Draws a 3D parallelopiped wireframe. Returns a THREE.Group containing the lines and an optional label.
 */
export const drawParallelopiped = (scene: THREE.Scene, options: ParallelopipedOptions): THREE.Group => {
    const {
        color = 0xffffff,
        scaleFactor = 1,
        label,
        v1, v2, v3,
        origin = new THREE.Vector3(0, 0, 0)
    } = options;

    const group = new THREE.Group();
    const material = new THREE.LineBasicMaterial({ color });

    const sV1 = v1.clone().multiplyScalar(scaleFactor);
    const sV2 = v2.clone().multiplyScalar(scaleFactor);
    const sV3 = v3.clone().multiplyScalar(scaleFactor);

    const points = [
        origin,
        origin.clone().add(sV1),
        origin.clone().add(sV2),
        origin.clone().add(sV3),
        origin.clone().add(sV1).add(sV2),
        origin.clone().add(sV1).add(sV3),
        origin.clone().add(sV2).add(sV3),
        origin.clone().add(sV1).add(sV2).add(sV3)
    ];

    const edges = [
        [points[0], points[1]], [points[0], points[2]], [points[0], points[3]],
        [points[1], points[4]], [points[1], points[5]],
        [points[2], points[4]], [points[2], points[6]],
        [points[3], points[5]], [points[3], points[6]],
        [points[4], points[7]], [points[5], points[7]], [points[6], points[7]]
    ];

    edges.forEach(edge => {
        const geometry = new THREE.BufferGeometry().setFromPoints(edge);
        const line = new THREE.Line(geometry, material);
        group.add(line);
    });

    if (label) {
        const labelSprite = createLabel(label, color, scaleFactor * 0.5);
        if (labelSprite) {
            // Position label at the furthest point
            labelSprite.position.copy(points[7]).add(new THREE.Vector3(0.2, 0.2, 0.2).multiplyScalar(scaleFactor));
            group.add(labelSprite);
        }
    }

    scene.add(group);
    return group;
};

type ShadingOptions = BaseOptions & {
    points: THREE.Vector2[];
};

/**
 * Draws a 2D shaded region (a filled polygon) on the XY plane.
 * Returns a THREE.Mesh.
 */
export const drawShading = (scene: THREE.Scene, options: ShadingOptions): THREE.Mesh => {
    const {
        points,
        color = 0xffffff,
    } = options;

    if (points.length < 3) return new THREE.Mesh();

    const shape = new THREE.Shape(points);
    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
    });

    const mesh = new THREE.Mesh(geometry, material);
    
    scene.add(mesh);
    return mesh;
};
