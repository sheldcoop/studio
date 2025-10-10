
import * as THREE from 'three';

/**
 * Creates a text label as a sprite. Handles multiline text.
 */
export const createLabel = (
    text: string,
    color: THREE.ColorRepresentation = 0xffffff,
    scale: number = 0.5,
    font: string = 'Arial',
    fontSize: number = 64
): THREE.Sprite => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return new THREE.Sprite();

    const fontStyle = `bold ${fontSize}px ${font}`;
    context.font = fontStyle;
    
    const lines = text.split('\n');
    const widths = lines.map(line => context.measureText(line).width);
    canvas.width = Math.max(...widths);
    canvas.height = (fontSize * 1.2) * lines.length;

    // Re-set font after canvas resize
    context.font = fontStyle;
    context.fillStyle = new THREE.Color(color).getStyle();
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    lines.forEach((line, index) => {
        context.fillText(line, canvas.width / 2, (canvas.height / lines.length) * (index + 0.5));
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set((canvas.width / 100) * scale, (canvas.height / 100) * scale, 1);
    return sprite;
};

type LabelOptions = {
    position: THREE.Vector3;
    text: string;
    color?: THREE.ColorRepresentation;
    offset?: THREE.Vector3;
    scale?: number;
};

/**
 * Draws a label in 3D space, typically for a vector or point.
 */
export const drawLabel = (scene: THREE.Scene, options: LabelOptions): THREE.Sprite => {
    const { position, text, color = 0xffffff, offset = new THREE.Vector3(0.5, 0.5, 0), scale = 0.4 } = options;

    const labelSprite = createLabel(text, color, scale);
    labelSprite.position.copy(position).add(offset);
    
    scene.add(labelSprite);
    return labelSprite;
};

type AngleOptions = {
    v1: THREE.Vector3;
    v2: THREE.Vector3;
    color?: THREE.ColorRepresentation;
    showAngleText?: boolean;
    radius?: number;
};

/**
 * Draws an arc showing the angle between two vectors in 3D space.
 */
export const drawAngleBetweenVectors = (scene: THREE.Scene, options: AngleOptions): THREE.Group => {
    const { v1, v2, color = 0xffffff, showAngleText = true } = options;
    const group = new THREE.Group();

    const angle = v1.angleTo(v2);

    // Don't draw if vectors are collinear
    if (angle < 1e-4 || Math.abs(angle - Math.PI) < 1e-4) {
        return group;
    }

    const radius = options.radius ?? Math.min(v1.length(), v2.length()) * 0.4;
    
    const normal = new THREE.Vector3().crossVectors(v1, v2).normalize();
    
    const curve = new THREE.ArcCurve(0, 0, radius, 0, angle, false);
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color });

    const arc = new THREE.Line(geometry, material);

    const xAxis = v1.clone().normalize();
    const zAxis = normal;
    const yAxis = new THREE.Vector3().crossVectors(zAxis, xAxis).normalize();

    const matrix = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
    arc.applyMatrix4(matrix);

    group.add(arc);

    if (showAngleText) {
        const textPos = v1.clone().normalize().add(v2.clone().normalize()).normalize().multiplyScalar(radius * 1.3);
        const angleInDegrees = THREE.MathUtils.radToDeg(angle);
        const label = createLabel(`θ = ${angleInDegrees.toFixed(1)}°`, color, 0.3);
        label.position.copy(textPos);
        label.applyMatrix4(matrix);
        group.add(label);
    }
    
    scene.add(group);
    return group;
};


type MatrixNotationOptions = {
    matrix: { a: number; b: number; c: number; d: number };
    position: THREE.Vector3;
    color?: THREE.ColorRepresentation;
    scale?: number;
};

/**
 * Renders a 2D matrix in standard bracket notation as a sprite in 3D space.
 */
export const drawMatrixNotation = (scene: THREE.Scene, options: MatrixNotationOptions): THREE.Sprite => {
    const { matrix, position, color = 0xffffff, scale = 0.5 } = options;
    const text = `[[${matrix.a.toFixed(1)}, ${matrix.b.toFixed(1)}]\n [${matrix.c.toFixed(1)}, ${matrix.d.toFixed(1)}]]`;
    
    const label = createLabel(text, color, scale, 'monospace');
    label.position.copy(position);

    scene.add(label);
    return label;
};
