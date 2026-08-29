import dynamic from 'next/dynamic';
const MuseumScene = dynamic(() => import('@/components/walkthrough/MuseumScene').then(module => module.MuseumScene), { ssr: false, loading: () => <div className="grid min-h-[calc(100vh-72px)] place-items-center bg-[#efe5d7] text-sm font-bold text-[#806d60]">Preparing the museum walkthrough…</div> });
export default function WalkthroughPage() { return <MuseumScene />; }
