
'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface ConfidenceIntervalAnimationProps {
  className?: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

// Helper to create a Gaussian curve shape
const createGaussianCurve = (width: number, height: number, segments: number) => {
    const shape = new THREE.Shape();
    const gaussian = (x: number, mu: number, sigma: number) => height * Math.exp(-(((x - mu) / sigma) ** 2) / 2);
  
    shape.moveTo(-width / 2, 0);
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width - width / 2;
      const y = gaussian(x, 0, width / 6);
      shape.lineTo(x, y);
    }
    shape.lineTo(width / 2, 0);
    shape.lineTo(-width / 2, 0);
    return new THREE.ShapeGeometry(shape);
};

export function ConfidenceIntervalAnimation({
  className,
  onPointerEnter,
  onPointerLeave,
}: ConfidenceIntervalAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const isMouseOver = useRef(false);
  
  const nullMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: 0x2563eb, wireframe: true, transparent: true }), []);
  const altMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: 0x22c55e, wireframe: true, transparent: true }), []);
  const pValueMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.7 }), []);
  const statisticMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xfacc15 }), []);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    let frameId: number;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 3, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // --- Distributions ---
    const nullDistro = new THREE.Mesh(createGaussianCurve(15, 6, 100), nullMaterial);
    nullDistro.position.x = -4;
    scene.add(nullDistro);

    const altDistro = new THREE.Mesh(createGaussianCurve(15, 5, 100), altMaterial);
    altDistro.position.x = 4;
    scene.add(altDistro);
    
    // --- P-value area ---
    const pValueShape = new THREE.Shape();
    const pValueGeometry = new THREE.ShapeGeometry(pValueShape);
    const pValueMesh = new THREE.Mesh(pValueGeometry, pValueMaterial);
    pValueMesh.position.x = -4;
    pValueMesh.visible = false;
    scene.add(pValueMesh);
    
    // --- Test Statistic ---
    const statistic = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), statisticMaterial);
    statistic.visible = false;
    scene.add(statistic);

    let statisticState = { visible: false, x: 0, y: 10, targetX: 0, speed: 0 };
    let shatterState = { active: false, particles: [] as any[], timer: 0 };

    const resetNullDistro = () => {
        nullDistro.visible = true;
        shatterState.active = false;
        shatterState.particles.forEach(p => scene.remove(p.mesh));
        shatterState.particles = [];
    }

    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (isMouseOver.current) {
        if (!statisticState.visible) {
            statisticState.visible = true;
            statistic.visible = true;
            statisticState.y = 10;
            statisticState.x = 0;
            statisticState.speed = 0;
            pValueMesh.visible = true;
            if (shatterState.active) {
                resetNullDistro();
            }
        }
        statisticState.targetX = (mouse.current.x - 0.5) * 20;

      } else if (statisticState.visible) {
          statisticState.visible = false;
          pValueMesh.visible = false;
          setTimeout(() => {
            statistic.visible = false;
            if (shatterState.active) resetNullDistro();
          }, 500)
      }
      
      if(statisticState.visible) {
        // Animate statistic dropping
        statisticState.speed += 0.98 * delta; // gravity
        statisticState.y -= statisticState.speed;
        statisticState.x += (statisticState.targetX - statisticState.x) * 0.1;
        
        if (statisticState.y < 0) {
            statisticState.y = 0;
        }
        statistic.position.set(statisticState.x, statisticState.y, 0);

        // Update P-value area
        const pValueStart = statisticState.x + 4; // adjust for distro position
        const curveWidth = 15;
        const curveSegments = 100;
        const newPValueShape = new THREE.Shape();
        newPValueShape.moveTo(pValueStart, 0);
        for(let i = Math.floor((pValueStart + curveWidth/2) / (curveWidth/curveSegments)); i<= curveSegments; i++){
            const x_ = (i / curveSegments) * curveWidth - curveWidth / 2;
            const y_ = 6 * Math.exp(-(((x_ / (curveWidth / 6)) ** 2) / 2));
            newPValueShape.lineTo(x_, y_);
        }
        newPValueShape.lineTo(curveWidth/2, 0);
        newPValueShape.lineTo(pValueStart, 0);
        pValueMesh.geometry.dispose();
        pValueMesh.geometry = new THREE.ShapeGeometry(newPValueShape);

        // Shatter logic
        const pValue = 1 - (statisticState.x + 4 + curveWidth/2) / curveWidth;
        if(statisticState.y === 0 && pValue < 0.05 && !shatterState.active) {
            shatterState.active = true;
            nullDistro.visible = false;
            const positions = nullDistro.geometry.getAttribute('position');
            for(let i = 0; i < positions.count; i++) {
                const particle = {
                    mesh: new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), nullMaterial),
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: Math.random() * 0.3,
                    vz: (Math.random() - 0.5) * 0.2,
                    life: 1.0,
                }
                particle.mesh.position.set(positions.getX(i) - 4, positions.getY(i), positions.getZ(i));
                shatterState.particles.push(particle);
                scene.add(particle.mesh);
            }
        }
      }

      if(shatterState.active) {
        shatterState.particles.forEach(p => {
            p.mesh.position.x += p.vx;
            p.mesh.position.y += p.vy;
            p.mesh.position.z += p.vz;
            p.vy -= 0.01;
            p.life -= delta;
            (p.mesh.material as THREE.MeshBasicMaterial).opacity = p.life;
            if(p.life <= 0) scene.remove(p.mesh);
        });
        shatterState.particles = shatterState.particles.filter(p => p.life > 0);
      }


      scene.rotation.y += (-mouse.current.x * 0.1 + scene.rotation.y) * 0.05;
      renderer.render(scene, camera);
    };

    animate();

    // --- Event Listeners ---
    const handleMouseMove = (event: MouseEvent) => {
      if (currentMount) {
        const rect = currentMount.getBoundingClientRect();
        mouse.current.x = (event.clientX - rect.left) / rect.width;
        mouse.current.y = (event.clientY - rect.top) / rect.height;
      }
    };
    const handleMouseEnter = () => { isMouseOver.current = true; onPointerEnter(); };
    const handleMouseLeave = () => { isMouseOver.current = false; onPointerLeave(); };

    currentMount.addEventListener('mousemove', handleMouseMove);
    currentMount.addEventListener('mouseenter', handleMouseEnter);
    currentMount.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeEventListener('mousemove', handleMouseMove);
        currentMount.removeEventListener('mouseenter', handleMouseEnter);
        currentMount.removeEventListener('mouseleave', handleMouseLeave);
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      nullMaterial.dispose();
      altMaterial.dispose();
      pValueMaterial.dispose();
      statisticMaterial.dispose();
      nullDistro.geometry.dispose();
      altDistro.geometry.dispose();
      pValueMesh.geometry.dispose();
      statistic.geometry.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
