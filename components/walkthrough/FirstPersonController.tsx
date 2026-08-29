'use client';
import { PointerLockControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { roomLayouts } from '@/lib/walkthroughLayout';

export function FirstPersonController({ onMove }: { onMove: (position: [number, number, number]) => void }) {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  useEffect(() => { const down = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true }; const up = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false }; window.addEventListener('keydown', down); window.addEventListener('keyup', up); return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) } }, []);
  useFrame((_, delta) => {
    const forward = Number(keys.current.w || keys.current.arrowup) - Number(keys.current.s || keys.current.arrowdown);
    const strafe = Number(keys.current.d || keys.current.arrowright) - Number(keys.current.a || keys.current.arrowleft);
    if (!forward && !strafe) return;
    const speed = (keys.current.shift ? 6 : 3.8) * Math.min(delta, .05);
    const direction = new THREE.Vector3(); camera.getWorldDirection(direction); direction.y = 0; direction.normalize();
    const side = new THREE.Vector3().crossVectors(direction, camera.up).normalize();
    const next = camera.position.clone().addScaledVector(direction, forward * speed).addScaledVector(side, strafe * speed);
    // Rooms are connected along X; the corridor gaps are intentionally open.
    next.x = THREE.MathUtils.clamp(next.x, -9.3, 81.3); next.z = THREE.MathUtils.clamp(next.z, -9.3, 9.3); next.y = 1.7;
    camera.position.copy(next); onMove([next.x, next.y, next.z]);
  });
  return <PointerLockControls />;
}
