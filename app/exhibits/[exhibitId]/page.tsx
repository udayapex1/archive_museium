import { notFound } from 'next/navigation';
import { exhibits, getExhibit } from '@/lib/getExhibits';
import galleries from '@/data/galleries.json';
import { MediaSwitch } from '@/components/exhibit/MediaSwitch';
import { AudioNarration } from '@/components/exhibit/AudioNarration';
import { ExhibitCard } from '@/components/gallery/ExhibitCard';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Motion';

export function generateStaticParams() { return exhibits.map(e => ({ exhibitId: e.id })); }

const exhibitEditorial: Record<string, { label: string; milestones: string[]; quote: string }> = {
  'great-bath-mohenjo-daro': { label: 'Harappan site · c. 2500 BCE', milestones: ['MATURE HARAPPAN · c. 2500 BCE', 'MOHENJO-DARO · SINDH', 'CIVIC ENGINEERING'], quote: 'A carefully sealed pool that reveals how ancient cities made water, space and community part of one civic idea.' },
  'taj-mahal': { label: 'Mughal monument · 1632—1653', milestones: ['FOUNDATION · 1632', 'AGRA · YAMUNA RIVER', 'MARBLE INLAY'], quote: 'A monument to memory, where architecture, garden and light are composed as one continuous poem.' },
  'red-fort': { label: 'Mughal citadel · 1639—1648', milestones: ['FOUNDATION · 1639', 'SHAHJAHANABAD · DELHI', 'RED SANDSTONE'], quote: 'A palace-fort designed to make imperial power visible through walls, water, geometry and ceremony.' },
  'chandrayaan-missions': { label: 'Lunar mission · 2008—2023', milestones: ['CHANDRAYAAN-1 · 2008', 'CHANDRAYAAN-2 · 2019', 'CHANDRAYAAN-3 · 2023'], quote: '“Shiva Shakti” — the landing site where India touched the Moon’s south polar region.' }
};

export default function ExhibitPage({ params }: { params: { exhibitId: string } }) {
  const exhibit = getExhibit(params.exhibitId);
  if (!exhibit) notFound();
  const gallery = galleries.find(x => x.id === exhibit!.gallery)!;
  const paragraphs = exhibit!.description.split('. ').map(text => text.endsWith('.') ? text : `${text}.`);
  const editorial = exhibitEditorial[exhibit!.id];
  return <Reveal><article className="mx-auto max-w-6xl px-5 pt-28 pb-14 md:pb-20">
    <Link href={`/galleries/${exhibit!.gallery}`} className="eyebrow hover:text-maroon">← Back to {gallery.name}</Link>
    <div className="mt-10 grid gap-12 lg:grid-cols-[.92fr_1.08fr] lg:items-start">
      <div className="lg:sticky lg:top-28"><div className="relative"><MediaSwitch exhibit={exhibit!} /><div className="pointer-events-none absolute left-5 top-5 rounded-full border border-white/50 bg-[#2f211b]/75 px-3 py-2 text-[10px] font-bold uppercase tracking-[.18em] text-white">{editorial.label}</div></div><p className="mt-4 text-xs text-[#998577]">Interactive visual record · Drag the model to inspect it</p></div>
      <div>
        <p className="eyebrow" style={{ color: gallery.colorTheme }}>{gallery.name} · {exhibit!.timelineYear}</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-[.94] md:text-7xl">{exhibit!.title}</h1>
        <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold">{editorial.milestones.map(milestone => <span key={milestone} className="rounded-full bg-[#efe5d7] px-3 py-2">{milestone}</span>)}</div>
        <div className="mt-8 space-y-5 text-lg leading-8 text-[#66554b]">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        <blockquote className="mt-8 border-l-4 border-maroon bg-[#efe5d7] px-6 py-5 font-display text-2xl italic leading-tight text-maroon">{editorial.quote}</blockquote>
        {exhibit!.hasAudio && <div className="mt-8"><AudioNarration exhibit={exhibit!} /></div>}
        <div className="mt-10 border-t border-[#e5d9ca] pt-8"><h2 className="text-xl font-bold">Key discoveries</h2><ul className="mt-5 grid gap-4 sm:grid-cols-2">{exhibit!.keyFacts.map(fact => <li key={fact} className="flex gap-3 text-sm leading-6 text-[#766459]"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-saffron" />{fact}</li>)}</ul></div>
      </div>
    </div>
    <section className="mt-24"><p className="eyebrow">Keep exploring</p><h2 className="mt-2 text-3xl font-bold">More from {gallery.name}</h2><div className="mt-6 grid gap-5 sm:grid-cols-3">{exhibits.filter(x => x.gallery === exhibit!.gallery && x.id !== exhibit!.id).slice(0, 3).map(x => <ExhibitCard key={x.id} exhibit={x} />)}</div></section>
  </article></Reveal>;
}
