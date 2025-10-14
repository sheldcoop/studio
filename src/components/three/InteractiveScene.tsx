
'use client';

import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useAnimationLoop } from './useAnimationLoop';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SceneContextType {
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
}

const SceneContext = createContext<SceneContextType>({
    scene: null,
    camera: null,
    renderer: null,
});

export const useThree = () => useContext(SceneContext);

interface InteractiveSceneProps {
    children: React.ReactNode;
    cameraPosition?: THREE.Vector3;
    className?: string;
}

/**
 * A top-level React component that wraps a three.js scene.
 * It handles the setup for the renderer, camera, and provides a context
 * for child components to access the scene.
 */
export function InteractiveScene({ children, cameraPosition, className }: InteractiveSceneProps) {
    const mountRef = useRef<HTMLDivElement>(null);
    const [contextValue, setContextValue] = useState<SceneContextType>({
        scene: null, camera: null, renderer: null
    });
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (!mountRef.current || isInitialized) return;
        
        const currentMount = mountRef.current;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        if (cameraPosition) camera.position.copy(cameraPosition);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);
        
        setContextValue({ scene, camera, renderer });
        setIsInitialized(true);

        const handleResize = () => {
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (renderer.domElement.parentNode === currentMount) {
                 currentMount.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [cameraPosition, isInitialized]);
    
    return (
        <SceneContext.Provider value={contextValue}>
            <div ref={mountRef} className={cn("relative h-full w-full", className)}>
                {isInitialized ? (
                    children
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
            </div>
        </SceneContext.Provider>
    );
}

interface AnimationLoopProps {
    callback: (time: number, delta: number) => void;
}

export function AnimationLoop({ callback }: AnimationLoopProps) {
    const { renderer, scene, camera } = useThree();

    useAnimationLoop((time, delta) => {
        if (renderer && scene && camera) {
            callback(time, delta);
            renderer.render(scene, camera);
        }
    });

    return null;
}
