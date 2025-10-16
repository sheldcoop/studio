
import * as THREE from 'three';
import { createLabel } from './ui-helpers';

type BaseOptions = {
    color?: THREE.ColorRepresentation;
    scaleFactor?: number;
    label?: string;
};

type ParentObject = THREE.Scene | THREE.Group;

type PlaneOptions = BaseOptions & {
    size?: number;
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
};

/**
 * A wrapper class for THREE.ArrowHelper to make it easier to update its
 * length, direction, and labels after creation.
 */
export class Vector extends THREE.Group {
    public labelSprite: THREE.Sprite | null = null;
    public coordLabelSprite: THREE.Sprite | null = null;
    public lengthLabelSprite: THREE.Sprite | null = null;
    public arrow: THREE.ArrowHelper;
    public line: THREE.Line;
    public cone: THREE.Mesh;

    constructor(
        dir: THREE.Vector3,
        length: number,
        color: THREE.ColorRepresentation,
        headLength?: number,
        headWidth?: number,
        label?: string,
        origin: THREE.Vector3 = new THREE.Vector3(0,0,0)
    ) {
        super();
        this.arrow = new THREE.ArrowHelper(dir, origin, length, color, headLength, headWidth);
        this.add(this.arrow);
        this.line = this.arrow.line;
        this.cone = this.arrow.cone;

        if (label) {
            this.setLabel(label, color);
        }
    }

    setLabel(text: string, color: THREE.ColorRepresentation, scale: number = 0.4) {
        if (this.labelSprite) this.remove(this.labelSprite);
        this.labelSprite = createLabel(text, color, scale);
        this.add(this.labelSprite);
        this.updateLabelPosition();
    }
    
    setCoordsLabel(coords: THREE.Vector3 | null, color: THREE.ColorRepresentation) {
        if (this.coordLabelSprite) this.remove(this.coordLabelSprite);
        if (coords) {
            const text = `(${coords.x.toFixed(2)}, ${coords.y.toFixed(2)})`;
            this.coordLabelSprite = createLabel(text, color, 0.35);
            this.add(this.coordLabelSprite);
        } else {
            this.coordLabelSprite = null;
        }
        this.updateLabelPosition();
    }
    
    setLengthLabel(length: number | null, color: THREE.ColorRepresentation) {
        if (this.lengthLabelSprite) this.remove(this.lengthLabelSprite);
        if (length !== null) {
            const text = `len: ${length.toFixed(2)}`;
            this.lengthLabelSprite = createLabel(text, color, 0.3);
            this.add(this.lengthLabelSprite);
        } else {
            this.lengthLabelSprite = null;
        }
        this.updateLabelPosition();
    }

    updateLabelPosition() {
        const dir = new THREE.Vector3();
        this.arrow.line.getWorldDirection(dir);
        if(dir.lengthSq() < 0.001) dir.set(0, 1, 0); // Default upward if direction is zero

        const length = this.arrow.line.scale.y;

        // Base offset from the arrowhead
        const baseOffset = dir.clone().multiplyScalar(length + 0.3);
        const baseLabelPosition = this.arrow.line.position.clone().add(baseOffset);

        // Vertical stacking offset
        const perpendicularOffset = new THREE.Vector3(0, 1, 0).cross(dir).normalize().multiplyScalar(0.1);
        if(Math.abs(dir.y) > 0.95) perpendicularOffset.set(1, 0, 0); // Handle vertical vectors


        let stackHeight = 0;
        const spacing = 0.45;

        // Position symbolic label
        if (this.labelSprite) {
            this.labelSprite.position.copy(baseLabelPosition).add(perpendicularOffset.clone().multiplyScalar(stackHeight));
            stackHeight += spacing;
        }

        // Position coordinate label below the symbol
        if (this.coordLabelSprite) {
            this.coordLabelSprite.position.copy(baseLabelPosition).add(perpendicularOffset.clone().multiplyScalar(stackHeight));
             stackHeight += spacing;
        }
        
        // Position length label at the bottom
        if (this.lengthLabelSprite) {
            this.lengthLabelSprite.position.copy(baseLabelPosition).add(perpendicularOffset.clone().multiplyScalar(stackHeight));
        }
    }
    
    setDirectionAndLength(dir: THREE.Vector3, length: number) {
        const isVisible = length > 0.1;

        // Toggle visibility of all parts
        this.visible = isVisible;

        if (!isVisible) {
            // Hide everything and exit if vector is too short
            this.arrow.setLength(0, 0, 0);
            return;
        }
        
        this.arrow.setDirection(dir);
        this.arrow.setLength(length, 0.3, 0.2); // Adjust head size dynamically if needed
        this.updateLabelPosition();
    }
}


/**
 * Draws a plane. Returns a THREE.Group containing the plane and an optional label.
 */
export const drawPlane = (parent: ParentObject, options: PlaneOptions = {}): THREE.Group => {
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
    
    parent.add(group);
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
export const drawCircle = (parent: ParentObject, options: CircleOptions = {}): THREE.Group => {
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
    
    parent.add(group);
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
export const drawArrow = (parent: ParentObject, options: ArrowOptions): THREE.Group => {
    const {
        color = 0xffffff,
        label,
        origin,
        destination,
    } = options;

    const group = new THREE.Group();

    const dir = new THREE.Vector3().subVectors(destination, origin);
    const length = dir.length();
    dir.normalize();

    const headLength = (options.headLength || 0.2);
    const headWidth = (options.headWidth || 0.1);

    const arrowHelper = new THREE.ArrowHelper(dir, origin, length, color, headLength, headWidth);
    group.add(arrowHelper);

    if (label) {
        const labelSprite = createLabel(label, color, 0.4);
        if (labelSprite) {
            labelSprite.position.copy(destination).add(new THREE.Vector3(0.3, 0.3, 0));
            group.add(labelSprite);
        }
    }

    parent.add(group);
    return group;
};

/**
 * A more specific version of drawArrow for drawing vectors.
 * This is an alias for drawArrow to make code more readable.
 */
export const drawVector = drawArrow;

type ParallelopipedOptions = BaseOptions & {
    v1: THREE.Vector3;
    v2: THREE.Vector3;
    v3: THREE.Vector3;
    origin?: THREE.Vector3;
};

/**
 * Draws a 3D parallelopiped wireframe. Returns a THREE.Group containing the lines and an optional label.
 */
export const drawParallelopiped = (parent: ParentObject, options: ParallelopipedOptions): THREE.Group => {
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

    parent.add(group);
    return group;
};

type ShadingOptions = BaseOptions & {
    points: THREE.Vector2[];
};

/**
 * Draws a 2D shaded region (a filled polygon) on the XY plane.
 * Returns a THREE.Mesh.
 */
export const drawShading = (parent: ParentObject, options: ShadingOptions): THREE.Mesh => {
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
    
    parent.add(mesh);
    return mesh;
};
