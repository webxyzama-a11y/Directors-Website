import { Project, ShowreelMetadata, WorkCategory } from "../types";

export const WORK_CATEGORIES: WorkCategory[] = [
  "ALL",
  "TELEVISION",
  "DOCUMENTARY",
  "WEB SERIES",
  "BRANDED CONTENT",
  "ADS",
  "MUSIC VIDEO",
  "MICRODRAMA"
];

export const PROJECTS_DATA: Project[] = [
  {
    id: "first-copy",
    title: "First Copy",
    year: "2025",
    category: "WEB SERIES",
    role: "Writer, Director & Producer",
    client: "Amazon MX Player / Salt Media",
    format: "Crime-Thriller Series (4K UHD)",
    aspectRatio: "2.39:1 Anamorphic",
    logline: "Set in the notorious 1990s Mumbai film piracy underworld, where reels were smuggled before dawn and fortunes changed overnight.",
    synopsis: "Farhan P. Zamma wrote, directed, and produced this binge-worthy period crime-thriller. Featuring Munawar Faruqui in his acting debut alongside veteran legends Raza Murad, Gulshan Grover, Krystle D'Souza, and Inamulhaq, First Copy became a sensational hit across Amazon miniTV and MX Player, praised for its visceral period staging, authentic street slang, and edge-of-the-seat tension.",
    youtubeId: "MEohgRcmIFM",
    teaserYoutubeId: "qC8uF9Y552o",
    posterUrl: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=1600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=80",
    stats: {
      episodes: "10 Episodes",
      views: "150M+ Streaming Minutes",
      rating: "8.6 / 10"
    },
    credits: [
      { role: "Director & Showrunner", name: "Farhan P. Zamma" },
      { role: "Writer", name: "Farhan P. Zamma" },
      { role: "Cast", name: "Munawar Faruqui, Gulshan Grover, Raza Murad, Inamulhaq, Krystle D'Souza" },
      { role: "Production House", name: "Salt Media" },
      { role: "Platform", name: "Amazon MX Player" }
    ],
    behindTheScenes: [
      "Recreated 1990s Mumbai VHS cassette manufacturing dens with authentic vintage magnetic tape equipment.",
      "Custom anamorphic lens kit tuned for authentic vintage film grain and chromatic aberration.",
      "Recorded over 40 hours of primary source interviews with retired police officers and former cinema operators."
    ]
  },
  {
    id: "amma",
    title: "Amma",
    year: "2016",
    category: "TELEVISION",
    role: "Creator & Producer",
    client: "Zee TV",
    format: "52-Episode Finite Period Epic",
    aspectRatio: "16:9 Cinema Grade",
    logline: "The 5-decade saga of Zeenat Sheikh, rising from an abandoned wife to the undisputed matriarch of Mumbai's underworld.",
    synopsis: "Marking the landmark television debut of legendary five-time National Award-winning actress Shabana Azmi, 'Amma' was Farhan Zamma's tour de force that established him as one of India's youngest television producers. Chronicling five decades of Mumbai history from post-partition riots to underworld rule, the series shattered TV production standards with cinematic sets, multi-camera choreography, and period-authentic costume design.",
    youtubeId: "qC8uF9Y552o",
    externalUrl: "https://www.zee5.com/tv-shows/details/amma/0-6-177",
    posterUrl: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1800&q=80",
    stats: {
      episodes: "80+ Episodes",
      reach: "75M+ Viewers Nationwide",
      milestone: "Shabana Azmi's TV Debut"
    },
    credits: [
      { role: "Creator & Producer", name: "Farhan P. Zamma" },
      { role: "Starring", name: "Shabana Azmi, Urvashi Sharma, Aman Verma, Ashmit Patel" },
      { role: "Network", name: "Zee TV" },
      { role: "Broadcast", name: "Prime Time National" }
    ],
    behindTheScenes: [
      "Constructed a 5-acre replica of 1960s Mumbai docks and chawls in Ramoji Film City.",
      "Shabana Azmi praised Farhan's youthful vision and unflinching dedication to historical nuance.",
      "Set a benchmark for finite series format in Indian prime-time television."
    ]
  },
  {
    id: "inside-the-burning",
    title: "Inside the Burning (Assam Gas Blowout)",
    year: "2021",
    category: "DOCUMENTARY",
    role: "Director",
    client: "Discovery Channel / Discovery+",
    format: "2-Part Investigative Feature",
    aspectRatio: "2.39:1 Anamorphic",
    logline: "Unprecedented, high-risk investigative access into the inferno of the Baghjan blowout—India's most devastating industrial environmental crisis.",
    synopsis: "Farhan P. Zamma helmed this gripping, critically acclaimed two-part Discovery Channel special. Heading a documentary crew right into the hazardous ground zero of the Assam Baghjan oil well blowout, Farhan documented the international blowout specialists, the ecological toll on the Maguri-Motapung wetland, and the resilient villagers caught in the crossfire of towering 1,000-degree flames.",
    youtubeId: "MEohgRcmIFM",
    posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=1800&q=80",
    stats: {
      parts: "2-Part Special",
      network: "Discovery Channel & Discovery+",
      nomination: "Best Investigative Doc"
    },
    credits: [
      { role: "Director", name: "Farhan P. Zamma" },
      { role: "Network", name: "Discovery Channel / Discovery+" },
      { role: "Genre", name: "Investigative Environmental Doc" },
      { role: "Cinematography", name: "Extreme Conditions Field Unit" }
    ],
    behindTheScenes: [
      "Filmed with heat-shielded specialized camera rigs less than 150 meters from the core blaze.",
      "Embedded with Singaporean and American blowout response experts Alert Disaster Control.",
      "Captured emotional testimonies of the indigenous community displaced by the toxic fumes."
    ]
  },
  {
    id: "maruti-flip-the-journey",
    title: "Maruti — Flip The Journey",
    year: "2024",
    category: "BRANDED CONTENT",
    role: "Director & Producer",
    client: "Maruti Suzuki e-VITARA × NEXA × RVCJ",
    format: "Branded Digital Series (5 Episodes + Final Promo)",
    aspectRatio: "16:9 Full Dynamic",
    logline: "A coin toss decides every twist, detour, and destination across India in Maruti Suzuki's flagship creator travel campaign.",
    synopsis: "A high-octane travel series directed by Farhan P. Zamma for Maruti Suzuki e-VITARA and NEXA Journeys in partnership with RVCJ Media. Influencers take to the highway with zero predefined itineraries—every crossroad and adventure hinges on a coin flip. From the foothills of Rishikesh to the misty peaks of Meghalaya and historic Pune-Hyderabad passes, Farhan blended cinematic road-movie visuals with viral digital pacing.",
    youtubeId: "qC8uF9Y552o",
    posterUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1800&q=80",
    stats: {
      episodes: "5 Episodes + Finale",
      views: "45M+ Organic Impressions",
      engagement: "3.2M+ Interactions"
    },
    credits: [
      { role: "Director & Producer", name: "Farhan P. Zamma" },
      { role: "Brand", name: "Maruti Suzuki e-VITARA / NEXA" },
      { role: "Agency Partner", name: "RVCJ Media" },
      { role: "Episodes", name: "Delhi-Rishikesh, Pune-Hyderabad, Jorhat-Meghalaya, Finale" }
    ],
    behindTheScenes: [
      "Chased unpredictable weather conditions across 4 states with specialized gimbal car rigs.",
      "Real-time spontaneous storytelling driven by live coin tosses on location."
    ]
  },
  {
    id: "spark-go-5g-gulshan-grover",
    title: "Bad Man Ka Good Phone",
    year: "2024",
    category: "ADS",
    role: "Director & Concept",
    client: "TECNO Mobile India",
    format: "Commercial Campaign / Spark Go 5G",
    aspectRatio: "16:9 / 9:16 Social Cut",
    logline: "Bollywood's legendary villain Gulshan Grover proclaims: 'Bad man bhi deserve karta hai ek good phone.'",
    synopsis: "An award-winning commercial directed by Farhan P. Zamma for the nationwide launch of TECNO Spark Go 5G. Featuring Bollywood icon Gulshan Grover in his quintessential 'Bad Man' persona, the film turned conventional smartphone advertising on its head with sharp comedic timing, stylized retro-gangster lighting, and viral social reach. Won 'Best Personalised Video' at the Marketers Excellence Awards.",
    youtubeId: "MEohgRcmIFM",
    posterUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?auto=format&fit=crop&w=1800&q=80",
    stats: {
      award: "MEA Excellence Award",
      reach: "85M+ Video Views",
      virality: "#BadManKaGoodPhone Trending #1"
    },
    credits: [
      { role: "Director", name: "Farhan P. Zamma" },
      { role: "Starring", name: "Gulshan Grover" },
      { role: "Brand", name: "TECNO Mobile India" },
      { role: "Production", name: "Salt Media" }
    ],
    behindTheScenes: [
      "Custom retro film grade mimicking classic 80s Bollywood villain dens with saturated reds and noir shadows.",
      "Delivered over 12 customized localized digital variations for pan-India regional targeting."
    ]
  },
  {
    id: "tecno-festive",
    title: "Tyohar Mein Milenge Dher Saare Uphaar",
    year: "2024",
    category: "ADS",
    role: "Director",
    client: "TECNO Mobile",
    format: "Festive Television & Digital Commercial",
    aspectRatio: "16:9 Broadcast Master",
    logline: "A heartwarming celebration of family reunion, joy, and festive gifts across India's vibrant heartland.",
    synopsis: "Directed by Farhan P. Zamma, this nationwide festive campaign for TECNO captured the emotional resonance of Indian festivals. Balancing high-energy dance sequences, warm cinematic lighting, and intimate family moments, the commercial aired across prime-time networks and digital video hubs.",
    youtubeId: "qC8uF9Y552o",
    posterUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1800&q=80",
    stats: {
      airing: "All Major Hindi & Regional Channels",
      reach: "110M+ TV & Digital Impressions"
    },
    credits: [
      { role: "Director", name: "Farhan P. Zamma" },
      { role: "Brand", name: "TECNO Mobile" },
      { role: "Production", name: "Salt Media" }
    ],
    behindTheScenes: [
      "Shot with high frame rate cinema cameras capturing celebratory micro-expressions and festive fireworks."
    ]
  },
  {
    id: "sebi-nsdl-qawwali",
    title: "SEBI × NSDL Qawwali",
    year: "2023",
    category: "MUSIC VIDEO",
    role: "Director & Producer",
    client: "SEBI & NSDL",
    format: "Sufi-Qawwali Musical Drama",
    aspectRatio: "2.39:1 Anamorphic",
    logline: "Transforming dry investor awareness into a soul-stirring, rhythm-charged cinematic Qawwali mehfil.",
    synopsis: "How do you explain demat securities and financial safety to 1.4 billion citizens without sounding like a disclaimer? Farhan P. Zamma directed and produced this vibrant musical spectacle, choreographing a traditional Sufi Qawwali mehfil with live harmoniums, tabla crescendos, and poetic lyricism that transformed complex financial compliance into an earworm melody.",
    youtubeId: "MEohgRcmIFM",
    posterUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1800&q=80",
    stats: {
      views: "25M+ Cross-Platform",
      impact: "National Financial Literacy Benchmark"
    },
    credits: [
      { role: "Director & Producer", name: "Farhan P. Zamma" },
      { role: "Clients", name: "SEBI (Securities & Exchange Board of India) & NSDL" },
      { role: "Music Production", name: "Live Orchestral Qawwali Ensemble" }
    ],
    behindTheScenes: [
      "Live audio recorded on set with vintage ribbon microphones to preserve traditional Sufi warmth."
    ]
  },
  {
    id: "notice-period",
    title: "Notice Period",
    year: "2024",
    category: "MICRODRAMA",
    role: "Director & Showrunner",
    client: "Salt Media Originals",
    format: "Bite-Sized Vertical / Mobile Drama",
    aspectRatio: "9:16 Mobile Native / 16:9 Widescreen",
    logline: "30 days left in corporate paradise. What happens when an employee has nothing left to lose?",
    synopsis: "Pioneering the explosive microdrama format in India, Farhan Zamma directed 'Notice Period', a razor-sharp corporate thriller designed for mobile screens. Packed with psychological cat-and-mouse tension, corporate sabotage, and high-frequency cliffhangers, each 90-second episode delivers cinematic stakes in rapid-fire succession.",
    youtubeId: "qC8uF9Y552o",
    posterUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80",
    stats: {
      episodes: "24 Micro-Episodes",
      completionRate: "78% Binge Rate",
      views: "35M+ Mobile Views"
    },
    credits: [
      { role: "Director", name: "Farhan P. Zamma" },
      { role: "Production", name: "Salt Media" },
      { role: "Format", name: "Microdrama Fiction" }
    ],
    behindTheScenes: [
      "Pioneered a specialized vertical-framing storyboard system to maintain cinematic depth in 9:16."
    ]
  },
  {
    id: "ceo-vs-ceo",
    title: "CEO vs CEO",
    year: "2024",
    category: "MICRODRAMA",
    role: "Director & Producer",
    client: "Salt Media Originals",
    format: "High-Stakes Microdrama Series",
    aspectRatio: "9:16 Mobile Native",
    logline: "Two boardroom titans, one bankrupt empire, and zero ethical boundaries.",
    synopsis: "Directed by Farhan P. Zamma, 'CEO vs CEO' captured the ruthless adrenaline of modern venture capital and corporate boardroom takeovers. Every episode was calibrated with razor-sharp dialogue, cinematic low-angle framing, and gripping power-play reversals.",
    youtubeId: "MEohgRcmIFM",
    posterUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1800&q=80",
    stats: {
      views: "42M+ Views",
      shares: "600K+ Social Shares"
    },
    credits: [
      { role: "Director", name: "Farhan P. Zamma" },
      { role: "Production", name: "Salt Media" }
    ],
    behindTheScenes: [
      "Shot in glass skyscraper penthouses using high-contrast anamorphic lighting."
    ]
  },
  {
    id: "angadia",
    title: "Angadia",
    year: "2023",
    category: "WEB SERIES",
    role: "Director & Producer",
    client: "Salt Media Long-Format",
    format: "Noir Crime Thriller",
    aspectRatio: "2.39:1 Anamorphic",
    logline: "Inside the centuries-old clandestine informal courier system carrying billions in diamonds and cash across Gujarat and Mumbai.",
    synopsis: "A gritty, atmospheric web series tracing the shadowy, trust-bound network of the Angadias. Directed with moody chiaroscuro lighting and breathless pacing, the series explores loyalty, betrayal, and high-stakes criminal syndicates.",
    youtubeId: "qC8uF9Y552o",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1800&q=80",
    stats: {
      status: "Festival Selection",
      genre: "Underworld Investigation"
    },
    credits: [
      { role: "Director & Producer", name: "Farhan P. Zamma" },
      { role: "Production", name: "Salt Media" }
    ],
    behindTheScenes: [
      "Extensive location filming in the congested diamond alleys of Zaveri Bazaar and Surat."
    ]
  },
  {
    id: "omg-yeh-mera-india",
    title: "OMG! Yeh Mera India",
    year: "2018",
    category: "TELEVISION",
    role: "Producer & Showrunner",
    client: "History TV18",
    format: "Factual Entertainment / Non-Fiction TV",
    aspectRatio: "16:9 Broadcast Master",
    logline: "Unearthing the most extraordinary, unbelievable, and inspiring human stories across the length and breadth of India.",
    synopsis: "One of Indian television's most celebrated non-fiction franchises, hosted by Krushna Abhishek on History TV18. Farhan P. Zamma's team spearheaded production across multiple seasons, coordinating field units from remote Himalayan valleys to coastal fishing communities to document extraordinary innovators, daredevils, and record-breakers.",
    youtubeId: "MEohgRcmIFM",
    posterUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1800&q=80",
    stats: {
      seasons: "Multiple Successful Seasons",
      reach: "100M+ Viewers",
      accolade: "Limca Book of Records Entry"
    },
    credits: [
      { role: "Producer", name: "Farhan P. Zamma" },
      { role: "Network", name: "History TV18" },
      { role: "Host", name: "Krushna Abhishek" }
    ],
    behindTheScenes: [
      "Dispatched concurrent filming crews to 22 Indian states within a single 90-day production window."
    ]
  },
  {
    id: "viacom18-4k-pipeline",
    title: "Viacom18 4K Pipeline",
    year: "2017",
    category: "TELEVISION",
    role: "Production Pioneer & Technical Director",
    client: "Viacom18 Media Networks",
    format: "Ultra High Definition 4K Broadcast Pipeline",
    aspectRatio: "4K DCI / HDR10",
    logline: "Pioneering India's first end-to-end 4K HDR production and post-production broadcast workflow.",
    synopsis: "At a time when the Indian television industry operated almost entirely on standard 1080i HD infrastructure, Farhan P. Zamma played a seminal role in architecting and testing the 4K production pipeline for Viacom18. From camera sensor selection and raw color management to real-time SAN storage and high-bandwidth delivery, Farhan set the technical benchmark that the industry eventually adopted.",
    youtubeId: "qC8uF9Y552o",
    posterUrl: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=1600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=80",
    stats: {
      resolution: "4096 × 2160 Native",
      impact: "Industry-Wide Paradigm Shift"
    },
    credits: [
      { role: "Technical Producer", name: "Farhan P. Zamma" },
      { role: "Network", name: "Viacom18" },
      { role: "Innovation", name: "End-to-End 4K HDR Workflow" }
    ],
    behindTheScenes: [
      "Collaborated with colorists in Mumbai and London to formulate custom broadcast-safe ACES color transforms."
    ]
  }
];

export const SHOWREEL_METADATA: ShowreelMetadata = {
  title: "FARHAN P. ZAMMA — DIRECTOR'S CUT SHOWREEL",
  duration: "03:42",
  aspectRatio: "2.39:1 Anamorphic",
  year: "2025",
  youtubeId: "MEohgRcmIFM",
  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  subtitle: "13+ YEARS OF DIRECTING IDEAS INTO IMAGES",
  chapters: [
    { time: "00:00", title: "Prologue — The Lens & The Light" },
    { time: "00:45", title: "First Copy — 1990s Underworld" },
    { time: "01:20", title: "Amma — The Grand Underworld Epic" },
    { time: "01:58", title: "Inside The Burning — Ground Zero Blaze" },
    { time: "02:35", title: "Commercials & Microdramas" },
    { time: "03:15", title: "Coda — Directing Tomorrow" }
  ]
};
