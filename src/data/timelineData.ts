import { CareerTimelineStage } from "../types";

export const CAREER_TIMELINE_STAGES: CareerTimelineStage[] = [
  {
    id: "stage-tv",
    category: "TELEVISION",
    era: "2013 — 2019",
    headline: "THE GRAND CANVASES",
    subhead: "Pioneering finite serials, prime-time sagas, and 4K broadcast pipelines",
    description: "Beginning with cult horror writing for Fear Files to spearheading 80+ television shows including OMG! Yeh Mera India and the watershed Zee TV period drama 'Amma' starring Shabana Azmi. At just 24, Farhan proved that large-scale period cinema could thrive on Indian prime-time television.",
    keyWork: "Amma (Zee TV), OMG! Yeh Mera India, Fear Files",
    lightingColor: "#ff9944",
    accentColor: "#f39c12",
    atmosphere: "Warm tungsten, haze, 35mm film grain, 80+ broadcast masters",
    stats: [
      { label: "Shows Produced/Directed", value: "80+" },
      { label: "Broadcast Viewers", value: "120M+" },
      { label: "Landmark Debut", value: "Shabana Azmi" }
    ],
    directorNote: "\"We built a 5-acre 1960s Mumbai set from scratch because real emotion requires real texture.\" — Farhan P. Zamma"
  },
  {
    id: "stage-doc",
    category: "DOCUMENTARY",
    era: "2020 — 2021",
    headline: "GROUND ZERO REALITY",
    subhead: "Investigative documentary filmmaking at 1,000°C",
    description: "Farhan led an elite documentary crew straight into the inferno of the Baghjan oil blowout in Assam for Discovery Channel's 2-part special 'Inside the Burning'. Balancing environmental catastrophe, foreign blowout specialists, and displaced indigenous communities, Farhan demonstrated fearless non-fiction storytelling under life-threatening conditions.",
    keyWork: "Inside the Burning (Assam Gas Blowout) — Discovery Channel",
    lightingColor: "#ff4411",
    accentColor: "#e74c3c",
    atmosphere: "Chiaroscuro, intense embers, heavy documentary realism",
    stats: [
      { label: "Format", value: "2-Part Special" },
      { label: "Global Platform", value: "Discovery Channel / Discovery+" },
      { label: "Proximity to Core", value: "150 Meters" }
    ],
    directorNote: "\"When the ground beneath your tripod is shaking from the roar of burning gas, you stop directing shots and start documenting truth.\""
  },
  {
    id: "stage-web",
    category: "WEB SERIES",
    era: "2022 — 2025",
    headline: "STREAMING CINEMA",
    subhead: "Binge-worthy narrative edge with high-octane crime realism",
    description: "Writing, directing, and producing 'First Copy' for Amazon MX Player starring Munawar Faruqui, Gulshan Grover, and Raza Murad. Taking viewers into the 1990s Mumbai film piracy underworld with blistering pace, sharp street dialogue, and cinematic widescreen composition.",
    keyWork: "First Copy (Amazon MX Player), Angadia",
    lightingColor: "#00d2ff",
    accentColor: "#00a8ff",
    atmosphere: "1990s noir, anamorphic lens flares, rain-slicked asphalt",
    stats: [
      { label: "Top Streaming Rank", value: "#1 Amazon miniTV" },
      { label: "Minutes Streamed", value: "150M+" },
      { label: "Cast Icons", value: "Munawar Faruqui & Gulshan Grover" }
    ],
    directorNote: "\"Streaming demands you hold a viewer by the collar every single second. The cut has to be ruthless.\""
  },
  {
    id: "stage-branded",
    category: "BRANDED CONTENT",
    era: "2023 — 2024",
    headline: "STORIES THAT MOVE PRODUCTS",
    subhead: "Creator-led travel odysseys and authentic brand integration",
    description: "Directing 'Maruti — Flip The Journey' for NEXA and Maruti Suzuki e-VITARA alongside RVCJ. Merging spontaneous road-trip reality with high-end commercial cinematography across 4 Indian states, turning electric vehicle capability into an unscripted adventure.",
    keyWork: "Maruti — Flip The Journey (5 Episodes + Final Promo)",
    lightingColor: "#00ffaa",
    accentColor: "#2ecc71",
    atmosphere: "Open highway, mountain passes, high-speed car gimbals",
    stats: [
      { label: "Episodes Directed", value: "5 + Promo" },
      { label: "Organic Impressions", value: "45M+" },
      { label: "Brand", value: "Maruti Suzuki / NEXA" }
    ],
    directorNote: "\"The best branded content never feels like an ad. It feels like a journey you wish you were on.\""
  },
  {
    id: "stage-ads",
    category: "ADS & COMMERCIALS",
    era: "2023 — 2025",
    headline: "30 SECONDS OF IMPACT",
    subhead: "High-concept commercials with pop culture icons",
    description: "Directing the award-winning 'Bad Man Ka Good Phone' campaign for TECNO Spark Go 5G starring Bollywood legend Gulshan Grover, alongside emotive festive campaigns reaching hundreds of millions across broadcast television and social platforms.",
    keyWork: "TECNO Spark Go 5G × Gulshan Grover, TECNO Festive",
    lightingColor: "#f1c40f",
    accentColor: "#f39c12",
    atmosphere: "High-contrast commercial lighting, stylized sets, razor-sharp punchlines",
    stats: [
      { label: "Accolade", value: "MEA Excellence Award" },
      { label: "Digital Reach", value: "195M+ Combined" },
      { label: "Viral Trend", value: "Top 1 National" }
    ],
    directorNote: "\"In a 30-second commercial, you don't just sell a feature—you imprint a character into public memory.\""
  },
  {
    id: "stage-music",
    category: "MUSIC VIDEO",
    era: "2023",
    headline: "POETRY IN MOTION",
    subhead: "Sufi rhythms meets national financial awareness",
    description: "Creating the SEBI × NSDL musical Qawwali—a masterclass in transmuting dry regulatory compliance into a foot-tapping, soul-stirring cultural anthem that resonated across demographics and age groups.",
    keyWork: "SEBI × NSDL Qawwali Anthem",
    lightingColor: "#9b59b6",
    accentColor: "#8e44ad",
    atmosphere: "Live harmoniums, warm candlelight, Sufi spiritual staging",
    stats: [
      { label: "Genre", value: "Cinematic Qawwali" },
      { label: "Public Reach", value: "25M+ Citizens" },
      { label: "Client", value: "SEBI & NSDL" }
    ],
    directorNote: "\"Rhythm connects before logic does. When the tabla drops, people listen with their hearts.\""
  },
  {
    id: "stage-microdrama",
    category: "MICRODRAMA",
    era: "2024 — PRESENT",
    headline: "THE FUTURE OF ATTENTION",
    subhead: "Pioneering premium vertical cinema for the mobile-first generation",
    description: "Recognizing early that micro-narratives are reshaping global entertainment, Farhan directed 'Notice Period' and 'CEO vs CEO' for Salt Media. Vertical framing with anamorphic depth, 90-second tension arcs, and hyper-addictive pacing.",
    keyWork: "Notice Period, CEO vs CEO",
    lightingColor: "#e056fd",
    accentColor: "#be2edd",
    atmosphere: "Corporate glass towers, 9:16 vertical geometry, rapid cliffhangers",
    stats: [
      { label: "Binge Rate", value: "78% Completion" },
      { label: "Views", value: "77M+ Mobile Views" },
      { label: "Episodes Produced", value: "40+ Short-Form" }
    ],
    directorNote: "\"Vertical video isn't smaller cinema—it's closer cinema. The actor is six inches from the viewer's eyes.\""
  }
];
