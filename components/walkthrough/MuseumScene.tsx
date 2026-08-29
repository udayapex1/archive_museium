'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import galleries from '@/data/galleries.json';
import { exhibits } from '@/lib/getExhibits';
import { Exhibit, Gallery } from '@/lib/types';
import { roomLayouts } from '@/lib/walkthroughLayout';
import { ExhibitPedestal } from './ExhibitPedestal';
import { ExhibitPlacard } from './ExhibitPlacard';
import { FirstPersonController } from './FirstPersonController';
import { Minimap } from './Minimap';
import { RoomBuilder } from './RoomBuilder';
import { WalkthroughHUD } from './WalkthroughHUD';

export function MuseumScene() {
  const [position, setPosition] = useState<[number, number, number]>([0, 1.7, 5]);
  const [selected, setSelected] = useState<Exhibit | null>(null);
  const [touch, setTouch] = useState(false);

  useEffect(() => setTouch(navigator.maxTouchPoints > 0), []);

  if (touch) {
    return (
      <div className="grid min-h-[calc(100vh-72px)] place-items-center bg-[#efe5d7] px-6 text-center">
        <div>
          <p className="eyebrow">Desktop experience</p>
          <h1 className="mt-3 text-4xl font-bold">The walkthrough is best on a larger screen.</h1>
          <p className="mx-auto mt-4 max-w-md leading-7 text-[#766459]">
            Use the gallery view on this device, or open this experience on a laptop for mouse-look and keyboard navigation.
          </p>
          <Link href="/galleries/ancient-india" className="mt-7 inline-block rounded-full bg-maroon px-5 py-3 text-sm font-bold text-white">
            Explore galleries
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-72px)] min-h-[620px] overflow-hidden bg-[#d9cdbf]">
      <Canvas
        shadows
        camera={{ position: [0, 1.7, 5], fov: 72 }}
        onCreated={({ camera }) => {
          camera.rotation.y = -Math.PI / 2;
        }}
      >
        <color attach="background" args={['#d9cdbf']} />
        <fog attach="fog" args={['#d9cdbf', 18, 105]} />
        <ambientLight intensity={1.6} />
        <Suspense fallback={null}>
          <FirstPersonController onMove={setPosition} />
          {roomLayouts.map((room, i) => (
            <group key={room.galleryId}>
              <RoomBuilder room={room} gallery={galleries[i] as Gallery} index={i} />
              {room.exhibitSlots.map((slot) => {
                const exhibit = exhibits.find((item) => item.id === slot.exhibitId)!;

                return exhibit.has3D ? (
                  <ExhibitPedestal key={exhibit.id} exhibit={exhibit} position={slot.position} onSelect={setSelected} />
                ) : (
                  <ExhibitPlacard key={exhibit.id} exhibit={exhibit} position={slot.position} rotationY={slot.rotationY} onSelect={setSelected} />
                );
              })}
            </group>
          ))}
        </Suspense>
      </Canvas>

      {selected && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-black/45 p-5">
          <div className="max-w-lg rounded-2xl bg-parchment p-7 shadow-2xl">
            <p className="eyebrow">Exhibit found</p>
            <h2 className="mt-2 text-3xl font-bold">{selected.title}</h2>
            <p className="mt-4 leading-7 text-[#766459]">{selected.shortDescription}</p>
            <div className="mt-6 flex gap-3">
              <Link href={`/exhibits/${selected.id}`} className="rounded-full bg-maroon px-5 py-3 text-sm font-bold text-white">Open full exhibit</Link>
              <button onClick={() => setSelected(null)} className="rounded-full border border-[#cbb8a5] px-5 py-3 text-sm font-bold">Resume walk</button>
            </div>
          </div>
        </div>
      )}

      <WalkthroughHUD selected={selected?.title || null} onClose={() => setSelected(null)} />
      <Minimap position={position} />
    </div>
  );
}
