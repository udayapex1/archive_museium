'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Compass,
  ArrowUpRight,
  ChevronDown,
  BookOpen,
  Globe2,
  Box,
  MapPin,
  Clock
} from 'lucide-react';
import { Reveal } from '@/components/ui/Motion';

export interface Milestone {
  id: string;
  yearDisplay: string;
  numericYear: number;
  title: string;
  categoryLabel: string;
  description: string;
  locationName: string;
  source: {
    title: string;
    citation: string;
  };
  relatedExhibit?: {
    id: string;
    title: string;
    image: string;
    has3D: boolean;
    shortDescription: string;
  };
}

export interface TimelineEra {
  id: string;
  atlasPeriodId: string;
  name: string;
  epochLabel: string;
  timeSpan: string;
  startYear: number;
  endYear: number;
  representativeImage: string;
  headline: string;
  curatorNarrative: string;
  colorTheme: string;
  globalContemporaries: Array<{
    region: string;
    description: string;
  }>;
  milestones: Milestone[];
}

export const TIMELINE_ERAS: TimelineEra[] = [
  {
    id: 'indus-valley',
    atlasPeriodId: 'period-indus',
    name: 'Bronze Age & Harappan Urbanism',
    epochLabel: 'ANCIENT INDIA · INDUS VALLEY',
    timeSpan: 'c. 2600 – 1900 BCE',
    startYear: -2600,
    endYear: -1900,
    representativeImage: 'https://res.cloudinary.com/dwemivxbp/image/upload/v1788026985/indusValleyGreatBath_ybouih.jpg',
    headline: 'Sophisticated grid-planned brick cities, hydraulic drainage systems, standardized weights, and extensive maritime trade.',
    curatorNarrative: 'Flourishing across the vast alluvial basins of the Indus, Ghaggar-Hakra, and coastal Saurashtra, Harappan civilization pioneered modular kiln-fired brick architecture, orthogonal street planning, and civic sanitation centuries ahead of contemporary societies.',
    colorTheme: '#8c5a36',
    globalContemporaries: [
      {
        region: 'Old Kingdom Egypt',
        description: 'Pharaohs of the 4th Dynasty construct the monumental Pyramid complex at Giza.',
      },
      {
        region: 'Early Dynastic Sumer',
        description: 'Mesopotamian city-states (Ur, Lagash, Uruk) formalize cuneiform administrative tablets and ziggurats.',
      },
    ],
    milestones: [
      {
        id: 'ms-great-bath',
        yearDisplay: 'c. 2500 BCE',
        numericYear: -2500,
        title: 'Construction of the Great Bath at Mohenjo-daro',
        categoryLabel: 'Civic Engineering',
        description: 'Civic engineers on the Western Citadel mound construct a 12-by-7 metre baked brick tank sealed with natural bitumen. Designed with descending stairways, surrounding colonnades, and dedicated drainage conduits, it represents humanity’s earliest known public ritual water structure.',
        locationName: 'Mohenjo-daro (Sindh, Pakistan)',
        source: {
          title: 'Excavations at Mohenjo-daro',
          citation: 'Mackay, E.J.H. (1938), Government of India ASI Excavations',
        },
        relatedExhibit: {
          id: 'great-bath-mohenjo-daro',
          title: 'The Great Bath',
          image: 'https://res.cloudinary.com/dwemivxbp/image/upload/v1788026985/indusValleyGreatBath_ybouih.jpg',
          has3D: true,
          shortDescription: 'Interactive 3D model of the Bronze Age citadel bath complex with bitumen sealing.',
        },
      },
      {
        id: 'ms-lothal-dockyard',
        yearDisplay: 'c. 2200 BCE',
        numericYear: -2200,
        title: 'Tidal Dockyard & Carnelian Bead Ateliers of Lothal',
        categoryLabel: 'Maritime Commerce',
        description: 'Harappan engineers construct a trapezoidal brick tidal basin connected to the Gulf of Khambhat via river channels. The settlement becomes a world centre for precision-drilled carnelian beads and stone seals exported across the Persian Gulf to Dilmun and Magan.',
        locationName: 'Lothal (Gujarat, India)',
        source: {
          title: 'Lothal: A Harappan Port Town (1955–62)',
          citation: 'Rao, S.R. (1979), Memoirs of the Archaeological Survey of India',
        },
      },
    ],
  },
  {
    id: 'mauryan-empire',
    atlasPeriodId: 'period-maurya',
    name: 'Pan-Subcontinental Unification & Dhamma',
    epochLabel: 'CLASSICAL ANTIQUITY · MAURYAN EMPIRE',
    timeSpan: 'c. 322 – 185 BCE',
    startYear: -322,
    endYear: -185,
    representativeImage: '/images/ashoka.svg',
    headline: 'First imperial unification spanning from the Hindu Kush to the Karnataka plateau, pioneering moral governance and edicts on stone pillars.',
    curatorNarrative: 'Founded in Magadha by Chandragupta Maurya and codified philosophically through Chanakya’s Arthashastra, the empire expanded across nearly the entire subcontinent before undergoing an unprecedented moral turn under Ashoka the Great.',
    colorTheme: '#8c2d19',
    globalContemporaries: [
      {
        region: 'Hellenistic Kingdoms',
        description: 'Seleucid and Ptolemaic realms partition Alexander’s empire; Ambassador Megasthenes records his Indika at Pataliputra.',
      },
      {
        region: 'Qin Dynasty China',
        description: 'Qin Shi Huang unifies the warring states, standardizes script and measures, and connects northern frontier walls.',
      },
    ],
    milestones: [
      {
        id: 'ms-kalinga-war',
        yearDisplay: 'c. 261 BCE',
        numericYear: -261,
        title: 'The Kalinga War & Renunciation of Armed Conquest',
        categoryLabel: 'Moral Turning Point',
        description: 'Witnessing the tragic human destruction of the Kalinga conquest on the eastern seaboard, Emperor Ashoka undergoes profound remorse. He formally abjures military expansion (Digvijaya) and inaugurates a policy of conquest through moral virtue (Dhammavijaya).',
        locationName: 'Dhauli (Odisha, India)',
        source: {
          title: 'Major Rock Edict XIII',
          citation: 'Hultzsch, E. (1925), Inscriptions of Asoka, ASI Epigraphia Indica',
        },
      },
      {
        id: 'ms-ashokan-edicts',
        yearDisplay: 'c. 250 BCE',
        numericYear: -250,
        title: 'Proclamation of Ashoka’s Moral Edicts & Lion Capitals',
        categoryLabel: 'Public Epigraphy',
        description: 'Ashoka commissions master stonecutters to erect monolithic Chunar sandstone pillars crowned with quadruplicate lions. Inscribed in vernacular Prakrit, the edicts guarantee medical treatment for humans and animals, environmental protection, and interfaith harmony.',
        locationName: 'Sarnath & Pataliputra (Bihar & UP)',
        source: {
          title: 'The Inscriptions of Asoka',
          citation: 'Sen, Amartya (2005), The Argumentative Indian; ASI Records',
        },
        relatedExhibit: {
          id: 'ashoka-pillar',
          title: 'The Ashokan Pillars & Edicts',
          image: '/images/ashoka.svg',
          has3D: false,
          shortDescription: 'Monolithic polished pillars proclaiming moral governance and non-violence across the realm.',
        },
      },
    ],
  },
  {
    id: 'gupta-empire',
    atlasPeriodId: 'period-gupta',
    name: 'Classical Golden Age & Intellectual Flourishing',
    epochLabel: 'CLASSICAL ZENITH · GUPTA EMPIRE',
    timeSpan: 'c. 319 – 550 CE',
    startYear: 319,
    endYear: 550,
    representativeImage: '/images/nalanda.svg',
    headline: 'Classical zenith of Sanskrit literature, mathematical treatises (decimal zero), and the founding of Nalanda University.',
    curatorNarrative: 'Under sovereigns such as Chandragupta II Vikramaditya and Kumaragupta, the subcontinent experienced multi-generational peace and economic prosperity that nurtured foundational advances in astronomy, classical drama, logic, and sculptural arts.',
    colorTheme: '#7d4817',
    globalContemporaries: [
      {
        region: 'Eastern Roman (Byzantine) Empire',
        description: 'Constantinople thrives under Justinian; Roman legal jurisprudence is compiled into the Corpus Juris Civilis.',
      },
      {
        region: 'Sasanian Empire of Persia',
        description: 'King Khosrow I presides over a cultural golden age, exchanging philosophical texts and chess with Indian royal courts.',
      },
    ],
    milestones: [
      {
        id: 'ms-nalanda-foundation',
        yearDisplay: 'c. 450 CE',
        numericYear: 450,
        title: 'Foundation of Nalanda Mahavihara',
        categoryLabel: 'Cosmopolitan Learning',
        description: 'Patronized by Kumaragupta I, Nalanda became the ancient world’s premier residential university. It housed over ten thousand scholars and teachers from China, Korea, Tibet, and Central Asia, preserving extensive libraries in philosophy, logic, mathematics, and linguistics.',
        locationName: 'Nalanda (Bihar, India)',
        source: {
          title: 'The University of Nalanda',
          citation: 'Sankalia, H.D. (1934); Records of Xuanzang (645 CE)',
        },
        relatedExhibit: {
          id: 'nalanda-university',
          title: 'Nalanda Mahavihara',
          image: '/images/nalanda.svg',
          has3D: false,
          shortDescription: 'The ancient residential university that anchored Asian intellectual exchange for seven centuries.',
        },
      },
      {
        id: 'ms-aryabhata-treatise',
        yearDisplay: 'c. 499 CE',
        numericYear: 499,
        title: 'Aryabhata’s Astronomical & Mathematical Breakthroughs',
        categoryLabel: 'Scientific Zenith',
        description: 'At Kusumapura (Pataliputra), 23-year-old mathematician Aryabhata compiles the Aryabhatiya. He formalizes place-value decimals, computes Pi accurately to four decimal digits (3.1416), and deduces that the Earth rotates daily on its axis.',
        locationName: 'Kusumapura (Patna, Bihar)',
        source: {
          title: 'The Aryabhatiya of Aryabhata',
          citation: 'Shukla, K.S. (1976), Indian National Science Academy (INSA)',
        },
      },
    ],
  },
  {
    id: 'mughal-empire',
    atlasPeriodId: 'period-mughal',
    name: 'Imperial Synthesis & Architectural Grandeur',
    epochLabel: 'MUGHAL ERA · ARCHITECTURE & ART',
    timeSpan: '1526 – 1707 CE',
    startYear: 1526,
    endYear: 1707,
    representativeImage: 'https://res.cloudinary.com/dwemivxbp/image/upload/v1788026201/tajmahal_a8xbwi.jpg',
    headline: 'Indo-Persian architectural synthesis, agrarian revenue reforms, flourishing trade in textiles and spices, and monumental capital cities.',
    curatorNarrative: 'From Babur’s victory at Panipat through Akbar’s institutionalization of religious dialogue (Sulh-i Kul) and Shah Jahan’s marble renaissance, the Mughal court unified subcontinental revenue administration while cultivating unique idioms in painting, music, and poetry.',
    colorTheme: '#8f4b1e',
    globalContemporaries: [
      {
        region: 'Ottoman Empire',
        description: 'Suleiman the Magnificent expands imperial borders and commissions Mimar Sinan’s masterwork mosques across Istanbul.',
      },
      {
        region: 'Safavid Empire of Persia',
        description: 'Shah Abbas transforms Isfahan into one of the world’s most magnificent capitals, exchanging artisans with the Mughal court.',
      },
    ],
    milestones: [
      {
        id: 'ms-akbar-ibadat-khana',
        yearDisplay: '1575–1580 CE',
        numericYear: 1575,
        title: 'The Ibadat Khana & Flowering of Mughal Ateliers',
        categoryLabel: 'Philosophical Pluralism',
        description: 'Emperor Akbar convenes interfaith philosophical debates at the Ibadat Khana in Fatehpur Sikri, inviting Hindu pandits, Jain acharyas, Zoroastrian mobeds, and Jesuit missionaries. Simultaneously, imperial ateliers synthesize Persian fine-line miniature technique with Indian vibrant color palettes.',
        locationName: 'Fatehpur Sikri (Uttar Pradesh, India)',
        source: {
          title: 'Ain-i-Akbari & Akbarnama',
          citation: 'Abu’l-Fazl (trans. H. Blochmann & H. Beveridge, Asiatic Society)',
        },
        relatedExhibit: {
          id: 'akbar-the-great',
          title: 'Akbar & The Pluralist Court',
          image: '/images/akbar.svg',
          has3D: false,
          shortDescription: 'Administrative innovation and interfaith dialogue in the Mughal sixteenth century.',
        },
      },
      {
        id: 'ms-taj-mahal',
        yearDisplay: '1632 CE',
        numericYear: 1632,
        title: 'Commencement of the Taj Mahal at Agra',
        categoryLabel: 'Monumental Architecture',
        description: 'Emperor Shah Jahan initiates the white Makrana marble mausoleum for Empress Mumtaz Mahal along the Yamuna River. Uniting bilateral symmetry, calligraphy, and pietra dura gemstone inlays within a paradise garden (charbagh), it marks the aesthetic pinnacle of Indo-Islamic architecture.',
        locationName: 'Agra (Uttar Pradesh, India)',
        source: {
          title: 'Padshahnama',
          citation: 'Abdul Hamid Lahori (ASI archival translations)',
        },
        relatedExhibit: {
          id: 'taj-mahal',
          title: 'The Taj Mahal',
          image: 'https://res.cloudinary.com/dwemivxbp/image/upload/v1788026201/tajmahal_a8xbwi.jpg',
          has3D: true,
          shortDescription: 'Interactive 3D architectural model of the world heritage marble mausoleum.',
        },
      },
      {
        id: 'ms-red-fort',
        yearDisplay: '1639 CE',
        numericYear: 1639,
        title: 'Foundation of the Red Fort in Shahjahanabad',
        categoryLabel: 'Imperial Citadel',
        description: 'Shah Jahan lays the foundation stones of the massive red sandstone fortress anchoring his newly designed capital city of Shahjahanabad. Housing the Diwan-i Khas, stream of paradise (Nahr-i Bihisht), and monumental Lahori Gate, it remains central to Indian national memory.',
        locationName: 'Shahjahanabad / Old Delhi',
        source: {
          title: 'Shahjahanabad: The Sovereign City in Mughal India',
          citation: 'Blake, Stephen P. (1991), Cambridge University Press',
        },
        relatedExhibit: {
          id: 'red-fort',
          title: 'The Red Fort of Shahjahanabad',
          image: 'https://res.cloudinary.com/dwemivxbp/image/upload/v1788026242/redfort_wglz5s.jpg',
          has3D: true,
          shortDescription: 'Interactive 3D model of the red sandstone citadel and seat of power.',
        },
      },
    ],
  },
  {
    id: 'british-colonial',
    atlasPeriodId: 'period-british',
    name: 'Colonial Horizon & The Freedom Struggle',
    epochLabel: 'FREEDOM STRUGGLE · COLONIAL HORIZON',
    timeSpan: '1858 – 1947 CE',
    startYear: 1858,
    endYear: 1947,
    representativeImage: '/images/dandi.svg',
    headline: 'Direct Crown administration alongside rising constitutional mobilization, Satyagraha, and the national movement for freedom.',
    curatorNarrative: 'Following the 1857 war of independence and the dissolution of the East India Company, direct Crown rule altered economic and legal landscapes. In response, a unified national consciousness took root, combining constitutional advocacy, revolutionary sacrifice, and non-violent mass defiance.',
    colorTheme: '#4a5d4e',
    globalContemporaries: [
      {
        region: 'Global Industrial Expansion',
        description: 'Steam engines, telegraph cables, and maritime canal links accelerate the speed of global trade and imperial competition.',
      },
      {
        region: 'Anti-Colonial Solidarity',
        description: 'Decolonization movements gain momentum across Ireland, Egypt, South Africa, and Vietnam, inspired by Indian civil resistance.',
      },
    ],
    milestones: [
      {
        id: 'ms-gandhi-satyagraha',
        yearDisplay: '1915–1917 CE',
        numericYear: 1915,
        title: 'Return of Gandhi & The Champaran Satyagraha',
        categoryLabel: 'Mass Mobilization',
        description: 'Returning from South Africa, Mohandas K. Gandhi transforms the anti-colonial struggle into an active mass movement. Intervening on behalf of oppressed indigo farmers in Champaran (1917), he establishes Satyagraha (truth-force) as a viable strategy of civil resistance against British authorities.',
        locationName: 'Champaran (Bihar, India)',
        source: {
          title: 'My Experiments with Truth',
          citation: 'Gandhi, M.K. (1927), Navajivan Publishing House',
        },
        relatedExhibit: {
          id: 'mahatma-gandhi',
          title: 'Mahatma Gandhi & Satyagraha',
          image: '/images/gandhi.svg',
          has3D: false,
          shortDescription: 'The philosophical framework of truth, non-violence, and mass civic action.',
        },
      },
      {
        id: 'ms-dandi-march',
        yearDisplay: '1930 CE',
        numericYear: 1930,
        title: 'The Salt Satyagraha Reaches the Arabian Sea at Dandi',
        categoryLabel: 'Civil Disobedience',
        description: 'Over 24 days, Gandhi leads 78 companions on a 390-kilometre march on foot from Sabarmati Ashram to the coastal village of Dandi. By breaking the colonial salt tax monopoly on 6 April, he ignites nationwide civil disobedience and makes a simple crystal of salt the universal emblem of freedom.',
        locationName: 'Dandi (Gujarat, India)',
        source: {
          title: 'Collected Works of Mahatma Gandhi (Vol. 43)',
          citation: 'Publications Division, Ministry of Information & Broadcasting',
        },
        relatedExhibit: {
          id: 'dandi-march',
          title: 'The Dandi Salt March',
          image: '/images/dandi.svg',
          has3D: false,
          shortDescription: 'The 390-km trek that shattered the moral authority of the colonial salt monopoly.',
        },
      },
      {
        id: 'ms-bhagat-singh',
        yearDisplay: '1931 CE',
        numericYear: 1931,
        title: 'Bhagat Singh’s Courtroom Statements & Revolutionary Legacy',
        categoryLabel: 'Revolutionary Idealism',
        description: 'Bhagat Singh, alongside Sukhdev and Rajguru, uses his trial in Lahore to articulate a vision of liberation that transcends mere political transfer of power, demanding an end to imperial and class exploitation. Their sacrifice electrifies youth across the subcontinent.',
        locationName: 'Lahore (Punjab, Pakistan)',
        source: {
          title: 'Why I am an Atheist & Courtroom Statements',
          citation: 'Singh, Bhagat (1930); National Archives of India',
        },
        relatedExhibit: {
          id: 'bhagat-singh',
          title: 'Bhagat Singh & The Revolutionary Path',
          image: '/images/bhagat.svg',
          has3D: false,
          shortDescription: 'Youth resistance, secular anti-imperialism, and political conviction.',
        },
      },
    ],
  },
  {
    id: 'modern-republic',
    atlasPeriodId: 'period-modern',
    name: 'The Democratic Republic & Scientific Horizons',
    epochLabel: 'MODERN INDIA · SOVEREIGN DEMOCRACY',
    timeSpan: '1947 – Present',
    startYear: 1947,
    endYear: 2024,
    representativeImage: 'https://res.cloudinary.com/dwemivxbp/image/upload/v1788026711/vikarmLanderChandrayan_fh1y7z.jpg',
    headline: 'Sovereign constitutional democracy undertaking democratic nation-building, green revolutions, and pioneering planetary space exploration.',
    curatorNarrative: 'Emerging from the partition of August 1947, independent India established the world’s largest democracy with a progressive written constitution, building world-class institutions in atomic energy, space research, and information technology.',
    colorTheme: '#2b4c6f',
    globalContemporaries: [
      {
        region: 'The Non-Aligned Movement',
        description: 'India co-founds the NAM at Bandung and Belgrade, charting an autonomous path during the Cold War.',
      },
      {
        region: 'Global Digital & Space Age',
        description: 'Planetary satellite communication, multinational semiconductor supply chains, and lunar science collaboration.',
      },
    ],
    milestones: [
      {
        id: 'ms-constitution-enacted',
        yearDisplay: '1950 CE',
        numericYear: 1950,
        title: 'Enactment of the Constitution of India',
        categoryLabel: 'Constitutional Republic',
        description: 'Drafted under the leadership of Dr. B.R. Ambedkar over nearly three years, the Constitution of India takes effect on 26 January 1950. As the world’s longest written constitution, it guarantees universal adult franchise, fundamental civil liberties, and an independent judiciary.',
        locationName: 'Constitution Hall, New Delhi',
        source: {
          title: 'Constituent Assembly Debates (1946–1949)',
          citation: 'Lok Sabha Secretariat, Parliament of India',
        },
        relatedExhibit: {
          id: 'constitution-of-india',
          title: 'The Constitution of India',
          image: '/images/constitution.svg',
          has3D: false,
          shortDescription: 'The foundational legal document guaranteeing justice, liberty, equality, and fraternity.',
        },
      },
      {
        id: 'ms-isro-foundation',
        yearDisplay: '1969 CE',
        numericYear: 1969,
        title: 'Establishment of the Indian Space Research Organisation (ISRO)',
        categoryLabel: 'Scientific Vision',
        description: 'Visionary physicist Dr. Vikram Sarabhai establishes ISRO under the Department of Atomic Energy, dedicating space science to national development, satellite weather monitoring, rural tele-education, and indigenous rocketry.',
        locationName: 'Bengaluru & Thumba (Karnataka & Kerala)',
        source: {
          title: 'Management for Development',
          citation: 'Sarabhai, Vikram (1969); ISRO Golden Jubilee Annals',
        },
        relatedExhibit: {
          id: 'isro-foundation',
          title: 'Foundation of ISRO',
          image: '/images/isro.svg',
          has3D: false,
          shortDescription: 'Pioneering space research dedicated to societal development and technological self-reliance.',
        },
      },
      {
        id: 'ms-chandrayaan-3',
        yearDisplay: '2023 CE',
        numericYear: 2023,
        title: 'Chandrayaan-3 Touches Down at Lunar South Pole',
        categoryLabel: 'Planetary Exploration',
        description: 'At 18:04 IST on 23 August 2023, the Vikram lander accomplishes a flawless soft-landing near the Moon’s southern polar region at Shiv Shakti Point. India becomes the first nation to touch down in the lunar polar highlands, deploying the Pragyan rover to perform in-situ elemental spectroscopy.',
        locationName: 'Sriharikota & Lunar South Pole',
        source: {
          title: 'Chandrayaan-3 Mission Landing Telemetry',
          citation: 'Indian Space Research Organisation (ISRO, August 2023)',
        },
        relatedExhibit: {
          id: 'chandrayaan-missions',
          title: 'Chandrayaan-3 Lander & Rover',
          image: 'https://res.cloudinary.com/dwemivxbp/image/upload/v1788026711/vikarmLanderChandrayan_fh1y7z.jpg',
          has3D: true,
          shortDescription: 'Interactive 3D model of the Vikram lunar lander that made history at the lunar south pole.',
        },
      },
    ],
  },
];

export function TimelineView() {
  // Epochs expanded state: default to the first epoch expanded
  const [expandedEpochs, setExpandedEpochs] = useState<Record<string, boolean>>({
    'indus-valley': true,
  });

  const toggleEpoch = (epochId: string) => {
    setExpandedEpochs(prev => ({
      ...prev,
      [epochId]: !prev[epochId],
    }));
  };

  return (
    <div className="min-h-screen bg-[#f7f1e8] text-[#2f211b] grain selection:bg-[#f4cf75] selection:text-[#2f211b]">
      <Reveal>
        <div className="mx-auto max-w-6xl px-5 pt-28 pb-20 md:px-8 md:pt-32">
          {/* Eyebrow & Main Title matching original museum layout */}
          <p className="eyebrow text-xs font-bold uppercase tracking-[.25em] text-[#a16a4d]">
            A living chronology · Five Millennia
          </p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-tight md:text-7xl">
            The long view.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#766459] md:text-lg">
            From planned Bronze Age cities to lunar polar landings, an interconnected constellation of historical epochs, imperial frontiers, and transformative turning points. Click any epoch to explore its events.
          </p>

          {/* Clean Vertical Timeline Spine matching Image 1 layout */}
          <div className="mt-16 space-y-0 border-l-2 border-[#ddcdbb] pl-7 md:pl-12">
            {TIMELINE_ERAS.map(era => {
              const isExpanded = !!expandedEpochs[era.id];

              return (
                <div key={era.id} className="relative pb-12 last:pb-4">
                  {/* Timeline Bullet Dot */}
                  <span
                    className="absolute -left-[37px] md:-left-[57px] top-1.5 h-4 w-4 rounded-full border-4 border-[#f7f1e8] shadow-sm transition-transform hover:scale-125"
                    style={{ backgroundColor: era.colorTheme }}
                  />

                  {/* Year / Era Span above Card */}
                  <p
                    className="text-sm font-bold tracking-wide"
                    style={{ color: era.colorTheme }}
                  >
                    {era.timeSpan}
                  </p>

                  {/* Collapsible Epoch Card */}
                  <div className="mt-3 max-w-3xl overflow-hidden rounded-2xl border border-[#e5d9ca] bg-white shadow-sm transition-all hover:shadow-museum">
                    {/* Primary Header Button to Toggle Events */}
                    <button
                      type="button"
                      onClick={() => toggleEpoch(era.id)}
                      className="group flex w-full items-center gap-4 p-3.5 text-left md:p-4 transition-colors hover:bg-[#faf7f2]"
                    >
                      <div className="relative h-20 w-24 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-[#ebdccb]">
                        <Image
                          src={era.representativeImage}
                          alt={era.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>

                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#998577]">
                          {era.epochLabel}
                        </p>
                        <h2 className="mt-0.5 text-lg font-bold text-[#2f211b] group-hover:text-[#7d302b] md:text-xl transition-colors truncate">
                          {era.name}
                        </h2>
                        <p className="mt-1 text-xs text-[#766459] line-clamp-1">
                          {era.headline}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-[#8c7867]">
                          <span>{era.milestones.length} Turning Points</span>
                          <span>·</span>
                          <span className="text-[#a16a4d]">
                            {isExpanded ? 'Click to collapse' : 'Click to expand events'}
                          </span>
                        </div>
                      </div>

                      {/* Expand / Collapse Chevron Indicator */}
                      <div className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f7f1e8] text-[#7d302b] transition-transform">
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : 'rotate-0'
                          }`}
                        />
                      </div>
                    </button>

                    {/* Collapsible Events Section (Shown when expanded!) */}
                    {isExpanded && (
                      <div className="border-t border-[#f0e4d5] bg-[#fbf9f5] p-4 sm:p-6 transition-all">
                        {/* Epoch Summary & Narrative */}
                        <div className="rounded-xl border border-[#ebdccb] bg-white p-4">
                          <p className="text-xs md:text-sm leading-relaxed text-[#5c4a3f]">
                            {era.curatorNarrative}
                          </p>

                          {/* Quick link to Historical Atlas at this year */}
                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#f2e7d7] pt-3">
                            <Link
                              href={`/atlas?year=${era.startYear}`}
                              className="inline-flex items-center gap-2 rounded-full bg-[#2f211b] px-4 py-2 text-xs font-bold text-[#f7f1e8] transition-all hover:bg-[#433129]"
                            >
                              <Compass className="h-3.5 w-3.5 text-[#f4cf75]" />
                              <span>View this epoch in Historical Atlas</span>
                              <ArrowUpRight className="h-3 w-3" />
                            </Link>

                            <span className="text-[11px] text-[#8c7867]">
                              Active Horizons: {era.timeSpan}
                            </span>
                          </div>
                        </div>

                        {/* Synchronous World Context */}
                        {era.globalContemporaries.length > 0 && (
                          <div className="mt-4 rounded-xl border border-[#e8dccb] bg-[#f5ede1]/80 p-3.5 text-xs">
                            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#7d302b]">
                              <Globe2 className="h-3.5 w-3.5" />
                              <span>Meanwhile in World History</span>
                            </div>
                            <div className="mt-2 grid gap-2 sm:grid-cols-2">
                              {era.globalContemporaries.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="rounded-lg border border-[#ebdccb] bg-white p-2.5"
                                >
                                  <p className="font-bold text-[#2f211b] text-xs">
                                    {item.region}
                                  </p>
                                  <p className="mt-0.5 text-[11px] leading-relaxed text-[#736054]">
                                    {item.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Nested Milestones / Events */}
                        <div className="mt-6 space-y-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-[#8c7867]">
                            Key Historical Events & Discoveries:
                          </p>

                          {era.milestones.map(ms => (
                            <div
                              key={ms.id}
                              className="rounded-xl border border-[#ebdccb] bg-white p-4 shadow-sm"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f4ece1] pb-2.5">
                                <div className="flex items-center gap-2">
                                  <span className="rounded bg-[#f7efe4] px-2 py-0.5 font-mono text-xs font-bold text-[#7d302b]">
                                    {ms.yearDisplay}
                                  </span>
                                  <span className="rounded-full bg-[#f2e7d7] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#69564a]">
                                    {ms.categoryLabel}
                                  </span>
                                </div>

                                <span className="flex items-center gap-1 text-[11px] text-[#8c7867]">
                                  <MapPin className="h-3 w-3" />
                                  {ms.locationName}
                                </span>
                              </div>

                              <h3 className="mt-2.5 text-base font-bold text-[#2f211b]">
                                {ms.title}
                              </h3>

                              <p className="mt-1.5 text-xs md:text-sm leading-relaxed text-[#5c4a3f]">
                                {ms.description}
                              </p>

                              {/* Primary citation */}
                              {ms.source && (
                                <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-[#8c7867]">
                                  <BookOpen className="h-3 w-3 mt-0.5 shrink-0 text-[#a16a4d]" />
                                  <span>
                                    <strong className="font-semibold text-[#665346]">Source:</strong> {ms.source.title} ({ms.source.citation})
                                  </span>
                                </div>
                              )}

                              {/* Connected 3D Museum Exhibit Anchor */}
                              {ms.relatedExhibit && (
                                <div className="mt-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-[#e2d3be] bg-[#f9f5ed] p-3">
                                  <div className="flex items-center gap-3">
                                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-[#ebdccb]">
                                      <Image
                                        src={ms.relatedExhibit.image}
                                        alt={ms.relatedExhibit.title}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#a16a4d]">
                                        Museum Artifact {ms.relatedExhibit.has3D && '· 3D Model'}
                                      </p>
                                      <p className="text-xs font-bold text-[#2f211b]">
                                        {ms.relatedExhibit.title}
                                      </p>
                                    </div>
                                  </div>

                                  <Link
                                    href={`/exhibits/${ms.relatedExhibit.id}`}
                                    className="inline-flex items-center gap-1 rounded-full bg-[#7d302b] px-3.5 py-1.5 text-xs font-bold text-white transition-transform hover:scale-105 shrink-0"
                                  >
                                    <span>Inspect 3D Object</span>
                                    <ArrowUpRight size={14} />
                                  </Link>
                                </div>
                              )}

                              {/* Direct Atlas Link */}
                              <div className="mt-3 flex justify-end">
                                <Link
                                  href={`/atlas?year=${ms.numericYear}`}
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7d302b] hover:underline"
                                >
                                  <span>Explore territory at this year in Atlas</span>
                                  <ArrowUpRight size={12} />
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
