import dynamic from 'next/dynamic';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Historical Atlas | Archive Museum',
  description: 'Explore five thousand years of history through spatial geography, civilizational extents, and synchronous global milestones.',
};

const AtlasView = dynamic(
  () => import('@/components/atlas/AtlasView').then((m) => m.AtlasView),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-[calc(100vh-72px)] place-items-center bg-[#efe5d7] pt-20 text-center">
        <div>
          <p className="eyebrow">Spatial Geography</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">
            Unrolling the Historical Atlas…
          </h1>
          <p className="mt-2 text-xs text-[#806d60]">
            Mapping civilizational horizons, river courses and ancient cities
          </p>
        </div>
      </div>
    ),
  }
);

export default function AtlasPage() {
  return <AtlasView />;
}
