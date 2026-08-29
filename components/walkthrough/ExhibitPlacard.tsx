import { Html } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Exhibit } from '@/lib/types';

export function ExhibitPlacard({ exhibit, position, rotationY, onSelect }: { exhibit: Exhibit; position: [number, number, number]; rotationY: number; onSelect: (e: Exhibit) => void }) {
  const texture = useLoader(TextureLoader, exhibit.image);
  return <group position={position} rotation={[0, rotationY, 0]} onClick={(event) => { event.stopPropagation(); onSelect(exhibit) }}>
    <mesh><boxGeometry args={[3.8, 2.3, .12]} /><meshStandardMaterial color="#2f211b" /></mesh>
    <mesh position={[0, 0, .08]}><planeGeometry args={[3.45, 1.95]} /><meshBasicMaterial map={texture} /></mesh>
    <Html position={[0, -1.45, .1]} center distanceFactor={8}><div className="pointer-events-none w-48 rounded bg-[#f7f1e8] px-2 py-1 text-center text-[11px] font-bold text-[#2f211b] shadow">{exhibit.title}</div></Html>
  </group>;
}
