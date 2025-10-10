
import * as THREE from 'three';

/**
 * Converts mouse coordinates (from a mouse event) to a 3D point on a specified plane in the scene.
 * @param event The mouse event.
 * @param camera The scene's camera.
 * @param targetElement The HTML element that the renderer is attached to.
 * @param plane A THREE.Plane to intersect with. Defaults to the XY plane.
 * @returns A THREE.Vector3 representing the point of intersection, or null if there is no intersection.
 */
export const mouseToWorld = (
    event: MouseEvent,
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
    targetElement: HTMLElement,
    plane: THREE.Plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
): THREE.Vector3 | null => {
    const rect = targetElement.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersectPoint = new THREE.Vector3();
    const didIntersect = raycaster.ray.intersectPlane(plane, intersectPoint);

    return didIntersect ? intersectPoint : null;
};

type DraggableOptions = {
    onDragStart?: (object: THREE.Object3D) => void;
    onDrag?: (object: THREE.Object3D, position: THREE.Vector3) => void;
    onDragEnd?: (object: THREE.Object3D) => void;
    plane?: THREE.Plane; // The plane on which the object will be dragged
};

/**
 * Makes a THREE.Object3D draggable using the mouse.
 * This function sets up the necessary event listeners on the provided DOM element.
 * @param objectsToDrag The THREE.Object3D or an array of them to make draggable.
 * @param camera The scene's camera.
 * @param domElement The renderer's DOM element to attach event listeners to.
 * @param options Optional callbacks for drag events and the plane of interaction.
 * @returns A cleanup function to remove the event listeners.
 */
export const makeObjectsDraggable = (
    objectsToDrag: THREE.Object3D | THREE.Object3D[],
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
    domElement: HTMLElement,
    options: DraggableOptions = {}
): (() => void) => {
    const { 
        onDragStart, 
        onDrag, 
        onDragEnd, 
        plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0) 
    } = options;

    const raycaster = new THREE.Raycaster();
    let isDragging = false;
    let selectedObject: THREE.Object3D | null = null;

    const onMouseDown = (event: MouseEvent) => {
        const mouse = new THREE.Vector2();
        const rect = domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        
        const draggableItems = Array.isArray(objectsToDrag) ? objectsToDrag : [objectsToDrag];
        const intersects = raycaster.intersectObjects(draggableItems, true);

        if (intersects.length > 0) {
            isDragging = true;
            selectedObject = intersects[0].object;
            
            // Find the top-level group if the intersected object is a child
            while (selectedObject.parent && draggableItems.includes(selectedObject.parent)) {
                selectedObject = selectedObject.parent;
            }

            // Attempt to disable camera controls for a better drag experience
            if (camera.parent && 'enabled' in camera.parent) {
                (camera.parent as any).enabled = false;
            }

            onDragStart?.(selectedObject);
        }
    };

    const onMouseMove = (event: MouseEvent) => {
        if (isDragging && selectedObject) {
            const worldPos = mouseToWorld(event, camera, domElement, plane);
            if (worldPos) {
                onDrag?.(selectedObject, worldPos);
            }
        }
    };

    const onMouseUp = (event: MouseEvent) => {
        if (isDragging && selectedObject) {
            if (camera.parent && 'enabled' in camera.parent) {
                (camera.parent as any).enabled = true;
            }
            onDragEnd?.(selectedObject);
        }
        isDragging = false;
        selectedObject = null;
    };

    domElement.addEventListener('mousedown', onMouseDown);
    domElement.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Return a cleanup function
    return () => {
        domElement.removeEventListener('mousedown', onMouseDown);
        domElement.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    };
};
