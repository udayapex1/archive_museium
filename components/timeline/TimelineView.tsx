'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Compass,
  ArrowUpRight,
  Sparkles,
  Layers,
  Clock,
  BookOpen,
  Calendar,
  Globe2,
  Box,
  ChevronRight,
  Landmark,
  CheckCircle2
} from 'lucide-react';
import { Reveal, MotionItem } from '@/components/ui/Motion';

export interface Milestone {
  id: string;
  yearDisplay: string;
  numericYear: number;
  title: string;
  category: 'monument-foundation' | 'cultural-turning-point' | 'scientific-milestone' | 'political-milestone';
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
  headline: string;
  curatorNarrative: string;
  colorTheme: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
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
    epochLabel: 'EPOCH 01 · BRONZE AGE',
    timeSpan: 'c. 2600 – 1900 BCE',
    startYear: -2600,
    endYear: -1900,
    headline: 'Sophisticated grid-planned brick cities, hydraulic drainage systems, standardized weights, and extensive maritime trade with the Persian Gulf and Mesopotamia.',
    curatorNarrative: 'Flourishing across the vast alluvial basins of the Indus, Ghaggar-Hakra, and coastal Saurashtra, Harappan civilization pioneered modular kiln-fired brick architecture, orthogonal street planning, and civic sanitation centuries ahead of contemporary societies.',
    colorTheme: '#8c5a36',
    badgeBg: 'bg-[#8c5a36]/10',
    badgeBorder: 'border-[#8c5a36]/25',
    badgeText: 'text-[#8c5a36]',
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
        category: 'monument-foundation',
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
          image: '/images/greatbath.jpg',
          has3D: true,
          shortDescription: 'Interactive 3D model of the Bronze Age citadel bath complex with bitumen sealing.',
        },
      },
      {
        id: 'ms-lothal-dockyard',
        yearDisplay: 'c. 2200 BCE',
        numericYear: -2200,
        title: 'Tidal Dockyard & Carnelian Bead Ateliers of Lothal',
        category: 'cultural-turning-point',
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
    epochLabel: 'EPOCH 02 · CLASSICAL ANTIQUITY',
    timeSpan: 'c. 322 – 185 BCE',
    startYear: -322,
    endYear: -185,
    headline: 'First imperial unification spanning from the Hindu Kush to the Karnataka plateau, pioneering moral governance, edicts inscribed on monolithic stone pillars, and continental trade networks.',
    curatorNarrative: 'Founded in Magadha by Chandragupta Maurya and codified philosophically through Chanakya’s Arthashastra, the empire expanded across nearly the entire subcontinent before undergoing an unprecedented moral turn under Ashoka the Great.',
    colorTheme: '#8c2d19',
    badgeBg: 'bg-[#8c2d19]/10',
    badgeBorder: 'border-[#8c2d19]/25',
    badgeText: 'text-[#8c2d19]',
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
        category: 'political-milestone',
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
        category: 'cultural-turning-point',
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
          image: '/images/pillar.svg',
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
    epochLabel: 'EPOCH 03 · CLASSICAL ZENITH',
    timeSpan: 'c. 319 – 550 CE',
    startYear: 319,
    endYear: 550,
    headline: 'Classical zenith of Sanskrit literature, mathematical treatises (formalization of decimal zero and trigonometry), stone rock-cut architecture, and the founding of Nalanda University.',
    curatorNarrative: 'Under sovereigns such as Chandragupta II Vikramaditya and Kumaragupta, the subcontinent experienced multi-generational peace and economic prosperity that nurtured foundational advances in astronomy, classical drama, logic, and sculptural arts.',
    colorTheme: '#7d4817',
    badgeBg: 'bg-[#7d4817]/10',
    badgeBorder: 'border-[#7d4817]/25',
    badgeText: 'text-[#7d4817]',
    globalContemporaries: [
      {
        region: 'Eastern Roman (Byzantine) Empire',
        description: 'Constantinople thrives under Justinian; Roman legal jurisprudence is compiled into the Corpus Juris Civilis.',
      },
      {
        region: 'Sasanian Empire of Persia',
        description: 'King Khosrow I presides over a cultural golden age, welcoming scholars from Athens and translating Indian fables (Panchatantra).',
      },
    ],
    milestones: [
      {
        id: 'ms-nalanda-foundation',
        yearDisplay: 'c. 450 CE',
        numericYear: 450,
        title: 'Foundation of Nalanda Mahavihara',
        category: 'cultural-turning-point',
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
        category: 'scientific-milestone',
        categoryLabel: 'Scientific Zenith',
        description: 'At Kusumapura (Pataliputra), 23-year-old mathematician Aryabhata compiles the Aryabhatiya. He formalizes place-value decimals, computes Pi accurately to four decimal digits (3.1416), formulates trigonometric sine tables, and correctly deduces that day and night stem from the Earth’s diurnal rotation on its axis.',
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
    epochLabel: 'EPOCH 04 · EARLY MODERN',
    timeSpan: '1526 – 1707 CE',
    startYear: 1526,
    endYear: 1707,
    headline: 'Subcontinental empire renowned for Persian-Indian architectural synthesis, agrarian revenue reforms, flourishing trade in textiles and spices, and monumental capital cities.',
    curatorNarrative: 'From Babur’s victory at Panipat through Akbar’s institutionalization of religious dialogue (Sulh-i Kul) and Shah Jahan’s marble renaissance, the Mughal state combined centralized administration with unmatched artisanal and architectural patronage.',
    colorTheme: '#8f4b1e',
    badgeBg: 'bg-[#8f4b1e]/10',
    badgeBorder: 'border-[#8f4b1e]/25',
    badgeText: 'text-[#8f4b1e]',
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
        category: 'cultural-turning-point',
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
        category: 'monument-foundation',
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
        title: 'Foundation of the Red Fort (Qila-i Mubarak) in Shahjahanabad',
        category: 'monument-foundation',
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
    epochLabel: 'EPOCH 05 · COLONIAL HORIZON & RESISTANCE',
    timeSpan: '1858 – 1947 CE',
    startYear: 1858,
    endYear: 1947,
    headline: 'Direct Crown administration overseeing railways, canal networks, and economic extraction alongside rising constitutional mobilization, Satyagraha, and the national movement for freedom.',
    curatorNarrative: 'Following the 1857 war of independence and the dissolution of the East India Company, direct Crown rule altered economic and legal landscapes. In response, a unified national consciousness took root, combining constitutional advocacy, revolutionary sacrifice, and non-violent mass defiance.',
    colorTheme: '#4a5d4e',
    badgeBg: 'bg-[#4a5d4e]/10',
    badgeBorder: 'border-[#4a5d4e]/25',
    badgeText: 'text-[#4a5d4e]',
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
        category: 'political-milestone',
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
        category: 'cultural-turning-point',
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
        category: 'political-milestone',
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
    epochLabel: 'EPOCH 06 · SOVEREIGN DEMOCRACY',
    timeSpan: '1947 – Present',
    startYear: 1947,
    endYear: 2024,
    headline: 'Sovereign constitutional democracy undertaking democratic nation-building, green revolutions, industrial infrastructure, and pioneering planetary space exploration.',
    curatorNarrative: 'Emerging from the partition of August 1947, independent India established the world’s largest democracy with a progressive written constitution, building world-class institutions in atomic energy, space research, and information technology.',
    colorTheme: '#2b4c6f',
    badgeBg: 'bg-[#2b4c6f]/10',
    badgeBorder: 'border-[#2b4c6f]/25',
    badgeText: 'text-[#2b4c6f]',
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
        category: 'political-milestone',
        categoryLabel: 'Constitutional Republic',
        description: 'Drafted under the leadership of Dr. B.R. Ambedkar over nearly three years, the Constitution of India takes effect on 26 January 1950. As the world’s longest written constitution, it guarantees universal adult franchise, fundamental civil liberties, and an independent judiciary for over 350 million citizens at its inception.',
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
        category: 'scientific-milestone',
        categoryLabel: 'Scientific Vision',
        description: 'Visionary physicist Dr. Vikram Sarabhai establishes ISRO under the Department of Atomic Energy, articulating a philosophy that space technologies must serve real societal needs—from rural tele-education and agricultural weather forecasting to satellite communication.',
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
        category: 'scientific-milestone',
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
  const [activeEraId, setActiveEraId] = useState<string>('all');

  const filteredEras = useMemo(() => {
    if (activeEraId === 'all') return TIMELINE_ERAS;
    return TIMELINE_ERAS.filter(e => e.id === activeEraId);
  }, [activeEraId]);

  return (
    <div className="min-h-screen bg-[#f7f1e8] text-[#2f211b] grain selection:bg-[#f4cf75] selection:text-[#2f211b]">
      {/* Editorial Museum Header */}
      <section className="relative border-b border-[#e3d7c7] bg-[#f2e7d7]/60 px-5 pt-28 pb-14 md:px-8 md:pt-32 md:pb-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#a16a4d]/30 bg-[#a16a4d]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[#7d302b]">
                <Clock className="h-3.5 w-3.5" />
                ROOM 03 · CHRONOLOGICAL HORIZONS
              </span>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#8c7867]">
                <span className="h-2 w-2 rounded-full bg-[#3b7a57]" />
                Interactive Chronology · 5,000 Years
              </div>
            </div>

            <h1 className="font-display mt-5 text-4xl font-extrabold tracking-tight text-[#2f211b] md:text-6xl lg:text-7xl">
              The Historical <span className="font-serif italic font-normal text-[#7d302b]">Timeline</span>
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#6d5b50] md:text-lg">
              A curated chronological passage through five millennia of Indian civilization. Explore how imperial frontiers expanded, intellectual treatises emerged, and turning points transformed the subcontinent from Bronze Age planned cities to lunar polar exploration.
            </p>

            {/* Curatorial Stats Bar */}
            <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-6 border-t border-[#e2d5c3] pt-6 text-xs text-[#7d695b]">
              <div className="flex items-center gap-2">
                <strong className="text-sm font-extrabold text-[#2f211b]">06</strong>
                <span>Civilizational Epochs</span>
              </div>
              <span className="text-[#c8b7a4]">·</span>
              <div className="flex items-center gap-2">
                <strong className="text-sm font-extrabold text-[#2f211b]">14</strong>
                <span>Pivotal Turning Points</span>
              </div>
              <span className="text-[#c8b7a4]">·</span>
              <div className="flex items-center gap-2">
                <strong className="text-sm font-extrabold text-[#2f211b]">04</strong>
                <span>Interactive 3D Artifacts</span>
              </div>
              <span className="text-[#c8b7a4]">·</span>
              <Link
                href="/atlas"
                className="ml-auto inline-flex items-center gap-1.5 font-bold text-[#7d302b] hover:underline"
              >
                <Compass className="h-4 w-4" />
                Cross-reference with Historical Atlas →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Epoch Filter Sticky Navigation Bar */}
      <div className="sticky top-[64px] z-30 border-b border-[#e2d5c3] bg-[#f7f1e8]/95 px-5 py-3.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c7867] shrink-0 mr-1 hidden sm:inline">
            Jump to Epoch:
          </span>
          <button
            onClick={() => setActiveEraId('all')}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all shrink-0 ${
              activeEraId === 'all'
                ? 'bg-[#2f211b] text-white shadow-sm'
                : 'border border-[#dfd2c0] bg-white/70 text-[#604f44] hover:bg-white'
            }`}
          >
            All Millennia
          </button>
          {TIMELINE_ERAS.map(era => {
            const isActive = activeEraId === era.id;
            return (
              <button
                key={era.id}
                onClick={() => setActiveEraId(era.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#2f211b] text-white shadow-sm'
                    : 'border border-[#dfd2c0] bg-white/70 text-[#604f44] hover:bg-white'
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: era.colorTheme }}
                />
                <span>{era.name.split('&')[0].trim()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Timeline Section */}
      <main className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <div className="space-y-20 md:space-y-24">
          {filteredEras.map((era, eraIndex) => (
            <Reveal key={era.id} delay={eraIndex * 0.05}>
              <article
                id={era.id}
                className="relative rounded-3xl border border-[#e5d9ca] bg-[#fbf8f2] p-6 shadow-[0_8px_32px_-8px_rgba(47,33,27,0.06)] md:p-10"
              >
                {/* Era Chapter Header */}
                <div className="border-b border-[#ebdccb] pb-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${era.badgeBg} ${era.badgeText} border ${era.badgeBorder}`}
                      >
                        {era.epochLabel}
                      </span>
                      <span className="font-mono text-xs font-semibold text-[#8c7867]">
                        {era.timeSpan}
                      </span>
                    </div>

                    {/* Link to Historical Atlas with exact year! */}
                    <Link
                      href={`/atlas?year=${era.startYear}`}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-[#cbbca7] bg-[#f2e7d7] px-4 py-1.5 text-xs font-bold text-[#2f211b] transition-all hover:bg-[#2f211b] hover:text-white hover:border-[#2f211b]"
                    >
                      <Compass className="h-3.5 w-3.5 text-[#7d302b] group-hover:text-[#f4cf75]" />
                      <span>View in Historical Atlas</span>
                      <ArrowUpRight className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                    </Link>
                  </div>

                  <h2 className="font-display mt-4 text-2xl font-extrabold text-[#2f211b] md:text-3xl lg:text-4xl">
                    {era.name}
                  </h2>

                  <p className="mt-2 text-sm md:text-base font-medium leading-relaxed text-[#5a483e]">
                    {era.headline}
                  </p>

                  <p className="mt-3 text-xs md:text-sm leading-relaxed text-[#7a675b]">
                    {era.curatorNarrative}
                  </p>

                  {/* Synchronous World History Context Callout */}
                  {era.globalContemporaries.length > 0 && (
                    <div className="mt-6 rounded-2xl border border-[#e8dccb] bg-[#f5ede1] p-4 text-xs">
                      <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#7d302b]">
                        <Globe2 className="h-3.5 w-3.5" />
                        <span>Synchronous World Context (What else was happening?)</span>
                      </div>
                      <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
                        {era.globalContemporaries.map((item, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-[#ebdccb] bg-[#fcfaf6] p-3 text-[#5e4d42]"
                          >
                            <p className="font-bold text-[#2f211b]">{item.region}</p>
                            <p className="mt-1 leading-normal text-[11px] text-[#736054]">
                              {item.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Milestone Nodes along Chronological Spine */}
                <div className="relative mt-10 pt-2 pl-4 sm:pl-8">
                  {/* Timeline Brass Spine */}
                  <div
                    className="absolute top-2 bottom-4 left-3 sm:left-6 w-0.5"
                    style={{ backgroundColor: era.colorTheme, opacity: 0.3 }}
                  />

                  <div className="space-y-12">
                    {era.milestones.map((ms, msIdx) => (
                      <MotionItem
                        key={ms.id}
                        index={msIdx}
                        className="relative pl-6 sm:pl-8 group"
                      >
                        {/* Spine Node Marker */}
                        <div
                          className="absolute -left-[18px] sm:-left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-125"
                          style={{ backgroundColor: era.colorTheme }}
                        />

                        {/* Milestone Card */}
                        <div className="rounded-2xl border border-[#ebdccb] bg-white/90 p-5 shadow-sm transition-all hover:shadow-md hover:border-[#dbcbb8] md:p-6">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f0e4d5] pb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#7d302b] bg-[#f7efe4] px-2.5 py-0.5 rounded-md">
                                {ms.yearDisplay}
                              </span>
                              <span className="rounded-full bg-[#f2e7d7] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#69564a]">
                                {ms.categoryLabel}
                              </span>
                            </div>

                            <span className="text-[11px] font-medium text-[#8c7867]">
                              📍 {ms.locationName}
                            </span>
                          </div>

                          <h3 className="mt-3 text-lg font-bold text-[#2f211b] md:text-xl group-hover:text-[#7d302b] transition-colors">
                            {ms.title}
                          </h3>

                          <p className="mt-2 text-xs md:text-sm leading-relaxed text-[#5c4a3f]">
                            {ms.description}
                          </p>

                          {/* Historical Source Citation */}
                          {ms.source && (
                            <div className="mt-3.5 flex items-start gap-1.5 text-[11px] text-[#8c7867]">
                              <BookOpen className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[#a16a4d]" />
                              <span>
                                <strong className="font-semibold text-[#665346]">Primary Source:</strong> {ms.source.title} ({ms.source.citation})
                              </span>
                            </div>
                          )}

                          {/* Connected 3D Museum Exhibit Anchor */}
                          {ms.relatedExhibit && (
                            <div className="mt-5 rounded-2xl border border-[#e2d3be] bg-[#f9f5ed] p-3.5 md:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                              <div className="relative h-16 w-24 sm:h-20 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-[#ebdccb]">
                                <Image
                                  src={ms.relatedExhibit.image}
                                  alt={ms.relatedExhibit.title}
                                  fill
                                  className="object-cover"
                                />
                                {ms.relatedExhibit.has3D && (
                                  <span className="absolute bottom-1 right-1 rounded-md bg-[#2f211b]/90 px-1.5 py-0.5 text-[9px] font-bold text-[#f4cf75] uppercase flex items-center gap-1">
                                    <Box className="h-2.5 w-2.5" /> 3D
                                  </span>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#a16a4d]">
                                    Museum Room Exhibit
                                  </span>
                                  {ms.relatedExhibit.has3D && (
                                    <span className="text-[10px] font-semibold text-[#3b7a57]">
                                      · Real 3D Model Available
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-sm font-bold text-[#2f211b] truncate mt-0.5">
                                  {ms.relatedExhibit.title}
                                </h4>
                                <p className="text-xs text-[#6e5c51] line-clamp-1 mt-0.5">
                                  {ms.relatedExhibit.shortDescription}
                                </p>
                              </div>

                              <Link
                                href={`/exhibits/${ms.relatedExhibit.id}`}
                                className="inline-flex items-center gap-1.5 rounded-full bg-[#7d302b] px-4 py-2 text-xs font-bold text-white transition-transform hover:scale-105 shrink-0 shadow-sm"
                              >
                                <span>Inspect 3D Object</span>
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          )}

                          {/* Quick Atlas Map Locator Link */}
                          <div className="mt-4 flex items-center justify-end">
                            <Link
                              href={`/atlas?year=${ms.numericYear}`}
                              className="text-xs font-bold text-[#7d302b] hover:text-[#2f211b] flex items-center gap-1"
                            >
                              <span>Explore territory at this year in Atlas</span>
                              <ChevronRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      </MotionItem>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </main>

      {/* Footer Navigation Call to Action */}
      <section className="border-t border-[#e2d5c3] bg-[#efe3d3]/70 px-5 py-16 md:py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#a16a4d]">
              Cross-Gallery Synthesis
            </span>
            <h2 className="font-display mt-3 text-3xl font-bold text-[#2f211b] md:text-4xl">
              From Chronology to Cartography
            </h2>
            <p className="mt-3 text-sm md:text-base leading-relaxed text-[#685549]">
              Every era explored on this timeline has a spatial reality on our interactive Natural Earth map. Trace five millennia of shifting civilizational frontiers, rivers, and settlements.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/atlas"
                className="inline-flex items-center gap-2 rounded-full bg-[#2f211b] px-6 py-3.5 text-sm font-bold text-[#f7f1e8] shadow-md transition-all hover:bg-[#433129] hover:scale-105"
              >
                <Compass className="h-4 w-4 text-[#f4cf75]" />
                <span>Open The Historical Atlas</span>
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-full border border-[#cbbca7] bg-white/80 px-6 py-3.5 text-sm font-bold text-[#2f211b] shadow-sm transition-all hover:bg-white hover:scale-105"
              >
                <BookOpen className="h-4 w-4 text-[#7d302b]" />
                <span>Search All Artifacts</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
