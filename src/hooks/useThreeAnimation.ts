
'use client';

import { useEffect, useRef } from 'react';
import { Scene, PerspectiveCamera, WebGLRenderer, Color } from 'three';

interface UseThreeAnimationOptions {
  onSetup: (params: {
    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    primaryColor: Color;
    opacityValue: number;
  }) => {
    animate: () => void;
    cleanup: () => void;
    materials?: any[]; // For theme updates
  };
  theme?: string;
}

export function useThreeAnimation(
  mountRef: React.RefObject<HTMLDivElement>,
  options: UseThreeAnimationOptions
) {
  const isVisible = useRef(true);
  const materialsRef = useRef<any[]>([]);
  const setupRef = useRef<{
    animate: () => void;
    cleanup: () => void;
  } | null>(null);

  // Intersection Observer for visibility
  useEffect(() => {
    if (!mountRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
      },
      { threshold: 0, rootMargin: '50px' }
    );
    
    observer.observe(mountRef.current);
    return () => observer.disconnect();
  }, [mountRef]);

  // Main setup effect
  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    let frameId: number;

    const init = () => {
      const computedStyle = getComputedStyle(currentMount);
      const primaryColorValue = computedStyle
        .getPropertyValue('--animation-primary-color')
        .trim();
      const opacityValue = parseFloat(
        computedStyle.getPropertyValue('--animation-opacity').trim() || '1'
      );
      const primaryColor = new Color(primaryColorValue);

      const scene = new Scene();
      const camera = new PerspectiveCamera(
        75,
        currentMount.clientWidth / currentMount.clientHeight,
        0.1,
        1000
      );

      const isMobile = window.innerWidth < 768;
      const renderer = new WebGLRenderer({ 
        antialias: !isMobile, // Disable AA on mobile
        alpha: true,
        powerPreference: 'high-performance'
      });
      
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
      currentMount.appendChild(renderer.domElement);

      const setup = options.onSetup({
        scene,
        camera,
        renderer,
        primaryColor,
        opacityValue,
      });

      if (setup.materials) {
        materialsRef.current = setup.materials;
      }

      const wrappedAnimate = () => {
        frameId = requestAnimationFrame(wrappedAnimate);
        
        // Skip rendering if not visible
        if (!isVisible.current) return;
        
        setup.animate();
      };

      wrappedAnimate();
      setupRef.current = setup;

      const handleResize = () => {
        if (currentMount) {
          camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        }
      };
      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener('resize', handleResize);
        setup.cleanup();
        if (currentMount && renderer.domElement.parentElement === currentMount) {
          currentMount.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    };

    const cleanup = init();
    return cleanup;
  }, []); // Removed theme from deps

  // Theme update effect - only updates colors without recreating scene
  useEffect(() => {
    if (!mountRef.current || materialsRef.current.length === 0) return;
    
    const computedStyle = getComputedStyle(mountRef.current);
    const newColorValue = computedStyle
      .getPropertyValue('--animation-primary-color')
      .trim();
    const newColor = new Color(newColorValue);
    
    materialsRef.current.forEach((material) => {
      if (material.color) {
        material.color.set(newColor);
      }
      if (material.emissive) {
        material.emissive.set(newColor);
      }
    });
  }, [options.theme]);

  return { isVisible };
}
