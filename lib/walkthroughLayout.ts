import galleries from '@/data/galleries.json';
import { exhibits } from './getExhibits';
import { Era, Gallery } from './types';

export interface RoomLayout { galleryId: Era; center: [number, number, number]; size: [number, number]; doorwayTo?: Era; exhibitSlots: Array<{ exhibitId: string; position: [number, number, number]; rotationY: number }> }

// Rooms are deliberately arranged as a straight, sightline-friendly sequence.
const museumGalleries = galleries as Gallery[];
export const roomLayouts: RoomLayout[] = museumGalleries.map((gallery, roomIndex) => {
  const roomExhibits = exhibits.filter(exhibit => exhibit.gallery === gallery.id);
  const x = roomIndex * 24;
  const slots = roomExhibits.map((exhibit, index) => {
    const isFlagship = exhibit.has3D;
    const wall = index % 2 === 0 ? -1 : 1;
    const position: [number, number, number] = isFlagship
      ? [x, 0, 0]
      : [x + (index === 1 ? -5 : 5), 2.3, wall * 9.65];
    return { exhibitId: exhibit.id, position, rotationY: wall === 1 ? Math.PI : 0 };
  });
  return { galleryId: gallery.id, center: [x, 0, 0], size: [20, 20], doorwayTo: museumGalleries[roomIndex + 1]?.id as Era | undefined, exhibitSlots: slots };
});

export function getRoomForPosition(x: number, z: number) {
  return roomLayouts.reduce((closest, room) => Math.abs(room.center[0] - x) < Math.abs(closest.center[0] - x) ? room : closest, roomLayouts[0]);
}
