import { Html } from '@react-three/drei';
import { Exhibit } from '@/lib/types';

export function ExhibitPedestal({ exhibit, position, onSelect }: { exhibit: Exhibit; position: [number, number, number]; onSelect: (e: Exhibit) => void }) {
  const kind = exhibit.id === 'taj-mahal' ? 'taj' : exhibit.id === 'chandrayaan-missions' ? 'chandrayaan' : 'ashoka';
  return <group position={position} onClick={(event) => { event.stopPropagation(); onSelect(exhibit) }}>
    <mesh position={[0, .4, 0]}><cylinderGeometry args={[1.5, 1.7, .8, 24]} /><meshStandardMaterial color="#8b6b55" /></mesh>
    {kind === 'taj' ? <><mesh position={[0, 1.4, 0]}><boxGeometry args={[1.5, .14, 1.5]} /><meshStandardMaterial color="#e6ddca" /></mesh><mesh position={[0, 2.1, 0]}><sphereGeometry args={[.65, 20, 12]} /><meshStandardMaterial color="#e6ddca" /></mesh><mesh position={[0, 2.65, 0]}><coneGeometry args={[.2, .45, 20]} /><meshStandardMaterial color="#b49a6b" /></mesh></> : kind === 'chandrayaan' ? <><mesh position={[0, 1.7, 0]}><sphereGeometry args={[.75, 20, 12]} /><meshStandardMaterial color="#d5d0c5" metalness={.5} /></mesh><mesh position={[1.3, 1.7, 0]}><boxGeometry args={[1.5, .08, .08]} /><meshStandardMaterial color="#31556b" /></mesh><mesh position={[-1.3, 1.7, 0]}><boxGeometry args={[1.5, .08, .08]} /><meshStandardMaterial color="#31556b" /></mesh></> : <><mesh position={[0, 1.7, 0]}><cylinderGeometry args={[.28, .4, 2.2, 20]} /><meshStandardMaterial color="#b88b60" /></mesh><mesh position={[0, 2.9, 0]}><sphereGeometry args={[.5, 16, 8]} /><meshStandardMaterial color="#b88b60" /></mesh></>}
    <Html position={[0, 3.5, 0]} center distanceFactor={8}><div className="pointer-events-none w-52 rounded bg-[#f7f1e8] px-2 py-1 text-center text-[11px] font-bold text-[#2f211b] shadow">{exhibit.title} · 3D</div></Html>
  </group>;
}
