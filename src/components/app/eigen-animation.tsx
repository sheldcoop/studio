
'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface EigenAnimationProps {
  className?: string;
}

export function EigenAnimation({ className }: EigenAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!mountRef.current) return;

    let frameId: number;
    const currentMount = mountRef.current;
    
    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      currentMount.clientWidth / -50, currentMount.clientWidth / 50,
      currentMount.clientHeight / 50, currentMount.clientHeight / -50,
      1, 1000
    );
    camera.position.z = 10;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // --- Colors & Materials ---
    const computedStyle = getComputedStyle(document.documentElement);
    const blueColor = new THREE.Color(computedStyle.getPropertyValue('--chart-1').trim());
    const pinkColor = new THREE.Color(computedStyle.getPropertyValue('--chart-2').trim());
    const greenColor = new THREE.Color(computedStyle.getPropertyValue('--chart-3').trim());
    const brightGreenColor = new THREE.Color(computedStyle.getPropertyValue('--chart-4').trim());
    const gridColor = new THREE.Color(computedStyle.getPropertyValue('--muted-foreground').trim());

    // --- Grid ---
    const gridHelper = new THREE.GridHelper(20, 20, gridColor, gridColor);
    gridHelper.material.opacity = 0.25;
    gridHelper.material.transparent = true;
    gridHelper.rotation.x = Math.PI / 2;
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(10);
    (axesHelper.material as THREE.Material).transparent = true;
    (axesHelper.material as THREE.Material).opacity = 0.4;
    scene.add(axesHelper);

    // --- Transformation Matrix and Eigenvectors ---
    const matrix = new THREE.Matrix3().fromArray([2, 1, 0, 1, 2, 0, 0, 0, 1]);
    const eigen = {
        vec1: new THREE.Vector2(1, 1).normalize(),
        val1: 3,
        vec2: new THREE.Vector2(-1, 1).normalize(),
        val2: 1
    };

    // --- Vector Objects ---
    const origin = new THREE.Vector3(0, 0, 0);
    const userVec2D = new THREE.Vector2(2, 1); // Default position (100, 50) on a 500px canvas is (2,1) in a +/-5 world
    
    const userArrow = new THREE.ArrowHelper(new THREE.Vector3(userVec2D.x, userVec2D.y, 0).normalize(), origin, userVec2D.length(), blueColor.getHex(), 0.5, 0.3);
    const transformedArrow = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), origin, 1, pinkColor.getHex(), 0.5, 0.3);
    
    const eigenArrow1Before = new THREE.ArrowHelper(new THREE.Vector3(eigen.vec1.x, eigen.vec1.y, 0), origin, 3, greenColor.getHex(), 0.4, 0.2);
    const eigenArrow1After = new THREE.ArrowHelper(new THREE.Vector3(eigen.vec1.x, eigen.vec1.y, 0), origin, 3 * eigen.val1, brightGreenColor.getHex(), 0.4, 0.2);
    
    // Make before arrow dashed
    const dashedMaterial = new THREE.LineDashedMaterial({ color: greenColor.getHex(), dashSize: 0.2, gapSize: 0.2 });
    (eigenArrow1Before.line.material as THREE.Material).dispose();
    eigenArrow1Before.line.material = dashedMaterial;
    eigenArrow1Before.line.computeLineDistances();

    scene.add(userArrow, transformedArrow, eigenArrow1Before, eigenArrow1After);

    const updateVectors = () => {
        const transformedVec2D = userVec2D.clone().applyMatrix3(matrix);
        
        userArrow.setDirection(new THREE.Vector3(userVec2D.x, userVec2D.y, 0).normalize());
        userArrow.setLength(userVec2D.length(), 0.5, 0.3);

        transformedArrow.setDirection(new THREE.Vector3(transformedVec2D.x, transformedVec2D.y, 0).normalize());
        transformedArrow.setLength(transformedVec2D.length(), 0.5, 0.3);
    };

    updateVectors();

    // --- Interaction ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    
    const onPointerMove = (event: PointerEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        if (isDragging) {
            raycaster.setFromCamera(mouse, camera);
            const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
            const intersectPoint = new THREE.Vector3();
            raycaster.ray.intersectPlane(plane, intersectPoint);
            userVec2D.set(intersectPoint.x, intersectPoint.y);
            updateVectors();
        }
    };
    
    const onPointerDown = (event: PointerEvent) => {
        onPointerMove(event); // Update mouse position
        raycaster.setFromCamera(mouse, camera);
        
        const userArrowTip = new THREE.Vector3(userVec2D.x, userVec2D.y, 0);
        const mouseWorldPos = new THREE.Vector3();
        raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), mouseWorldPos);

        if (mouseWorldPos.distanceTo(userArrowTip) < 0.5) {
            isDragging = true;
            currentMount.style.cursor = 'grabbing';
        }
    };

    const onPointerUp = () => {
        isDragging = false;
        currentMount.style.cursor = 'default';
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointerleave', onPointerUp);


    // --- Animate & Resize ---
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const { clientWidth, clientHeight } = currentMount;
      renderer.setSize(clientWidth, clientHeight);
      camera.left = clientWidth / -50;
      camera.right = clientWidth / 50;
      camera.top = clientHeight / 50;
      camera.bottom = clientHeight / -50;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointerleave', onPointerUp);

      cancelAnimationFrame(frameId);
      currentMount.removeChild(renderer.domElement);
      
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
    };
  }, [theme]);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
