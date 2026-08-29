import { Gallery } from '@/lib/types';
import { RoomLayout } from '@/lib/walkthroughLayout';

export function RoomBuilder({ room, gallery, index }: { room: RoomLayout; gallery: Gallery; index: number }) {
  const [width, depth] = room.size;
  const x = room.center[0];
  return <group>
    <mesh position={[x, -.15, 0]} receiveShadow><boxGeometry args={[width, .3, depth]} /><meshStandardMaterial color="#cbb39b" /></mesh>
    <mesh position={[x, 3.7, 0]}><boxGeometry args={[width, .2, depth]} /><meshStandardMaterial color="#eee3d4" transparent opacity={.25} /></mesh>
    <mesh position={[x, 3, -depth / 2]}><boxGeometry args={[width, 6, .3]} /><meshStandardMaterial color={gallery.colorTheme} transparent opacity={.45} /></mesh>
    <mesh position={[x, 3, depth / 2]}><boxGeometry args={[width, 6, .3]} /><meshStandardMaterial color={gallery.colorTheme} transparent opacity={.45} /></mesh>
    <mesh position={[x - width / 2, 3, 0]}><boxGeometry args={[.3, 6, depth]} /><meshStandardMaterial color={gallery.colorTheme} transparent opacity={.5} /></mesh>
    {index === 3 && <mesh position={[x + width / 2, 3, 0]}><boxGeometry args={[.3, 6, depth]} /><meshStandardMaterial color={gallery.colorTheme} transparent opacity={.5} /></mesh>}
    <pointLight position={[x, 3.4, 0]} color={gallery.colorTheme} intensity={8} distance={24} />
    <mesh position={[x, 2.9, -depth / 2 + .2]}><boxGeometry args={[5, .9, .08]} /><meshStandardMaterial color="#2f211b" /></mesh>
  </group>;
}
