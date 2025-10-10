# Visualization Library Documentation

This document provides a comprehensive overview of the custom Three.js visualization library. It is designed to be a guide for developers, explaining the purpose of each module and the functions within it.

## Guiding Principles

- **Modularity:** Each file has a specific responsibility (e.g., drawing shapes, handling transformations, managing animations).
- **Ease of Use:** Functions are designed to be high-level and declarative. You specify *what* you want to draw, not *how* to draw it.
- **Scene-Based:** Most functions take a `THREE.Scene` object as the first argument and automatically add the created objects to it.

---

## `src/components/three/primitives.ts`

This module contains the fundamental building blocks for all visualizations. These are the basic shapes and objects you can add to a scene.

| Function | Description | When to Use |
|---|---|---|
| `drawPlane(...)` | Draws a flat, 2D plane. | For creating floors, walls, or representing a 2D subspace in 3D. |
| `drawCircle(...)` | Draws a filled 2D circle. | To highlight a specific point or as a decorative element. |
| `drawArrow(...)` | Draws a directional arrow from an origin to a destination. | **Essential for visualizing vectors.** |
| `drawParallelopiped(...)` | Draws a 3D wireframe box defined by three vectors. | To visualize the volume affected by a 3D transformation or the determinant of a 3x3 matrix. |
| `drawShading(...)` | Draws a filled, 2D polygon from a set of points. | To visualize the area of a transformed 2D space (the column space). |

---

## `src/components/three/coordinate-system.ts`

This module provides functions for drawing the foundational context of your scene, such as axes and grids.

| Function | Description | When to Use |
|---|---|---|
| `drawAxes(...)` | Draws the standard X (red), Y (green), and Z (blue) Cartesian axes. | In almost every scene to provide a clear frame of reference for all other objects. |
| `drawGrid(...)` | Draws a 2D grid on the XZ plane. | To provide a sense of scale and position on the "floor" of the scene. |
| `drawGridInPlane(...)`| Draws a 2D grid on an arbitrary 3D plane. | To visualize a specific subspace, such as the plane defined by two basis vectors. |

---

## `src/components/three/transformation.ts`

This is the core module for visualizing the concepts of linear algebra. It contains functions that apply matrix transformations to objects or visualize the properties of a matrix.

| Function | Description | When to Use |
|---|---|---|
| `drawTransformedGrid(...)` | Applies a 2D matrix transformation to a standard grid. | To show how a matrix warps, shears, or rotates the entire 2D space. |
| `drawColumnSpace(...)` | Visualizes the column space of a 2D matrix. | To show the "output" space of a transformation. It draws the basis vectors (columns) and the area they span. |
| `drawProjection(...)` | Visualizes the projection of one vector onto another. | To geometrically explain the concept of vector projection. |
| `drawEigenspace(...)` | Visualizes an eigenvector and its corresponding eigenspace. | To show the special vectors that are only scaled (not rotated) by a transformation. |
| `drawSubspace(...)` | Visualizes a subspace (a line or plane) defined by a set of basis vectors. | To represent concepts like the null space, row space, or any other vector subspace. |
| `drawFourSubspaces(...)`| Visualizes the four fundamental subspaces of a 2D matrix. | As a master visualization to show the relationship between C(A), N(A), C(Aᵀ), and N(Aᵀ). |

---

## `src/components/three/animation.ts`

This module contains functions for creating smooth, time-based animations and transitions.

| Function | Description | When to Use |
|---|---|---|
| **Easing Functions** | A collection of functions (`easeInOutCubic`, `linear`, etc.) that control the timing of an animation. | To make animations feel more natural (e.g., starting slow, speeding up, and ending slow). |
| `lerpVector(...)` | **L**inear **interp**olation between two vectors. | To smoothly move an object from one position to another. |
| `slerpQuaternion(...)` | **S**pherical **l**inear **interp**olation between two rotations. | **The correct way to smoothly rotate an object.** Avoids issues like gimbal lock. |
| `fadeIn(...)` / `fadeOut(...)` | Smoothly animates an object's opacity to show or hide it. | To introduce or remove elements from the scene gracefully. |
| `pulseEffect(...)` | Creates a continuous, looping scaling effect on an object. | To draw attention to a specific object, like an important vector. |
| `sequenceAnimations(...)`| Orchestrates a series of animation clips, running them one after another. | For creating complex, multi-step explanations and narrative-driven visualizations. |

---

## `src/components/three/ui-helpers.ts`

This module provides tools for adding text labels and other annotations to your scene to make it more informative.

| Function | Description | When to Use |
|---|---|---|
| `createLabel(...)` | The base function for creating a text label as a sprite. | Used by other helper functions, or if you need custom label behavior. |
| `drawLabel(...)` | Draws a text label at a specific position in 3D space. | To label vectors, points, or other objects. |
| `drawAngleBetweenVectors(...)`| Draws an arc and a text label to show the angle between two vectors. | To visually explain the dot product and the geometric relationship between vectors. |
| `drawMatrixNotation(...)` | Renders a 2D matrix in standard bracket notation. | To display the algebraic form of a matrix alongside its geometric transformation. |

---

## `src/components/three/interactivity.ts`

This module is the bridge between the user and the 3D scene, enabling direct manipulation and real-time feedback. It's the key to turning a static visualization into an interactive playground.

| Function | Description | When to Use |
|---|---|---|
| `mouseToWorld(...)` | Converts the 2D mouse cursor position into a 3D coordinate on a specific plane. | The fundamental building block for any mouse-based interaction in the 3D scene. |
| `makeObjectsDraggable(...)` | Makes one or more `THREE.Object3D` instances draggable with the mouse. | To allow users to directly grab and manipulate objects like vectors or control points, providing immediate and intuitive feedback on how their actions affect the system. |
