import { PipelineStep, SaltMetric, SaltService } from "../types";

export const SALT_MEDIA_METRICS: SaltMetric[] = [
  {
    number: "62M+",
    label: "Followers",
    subtext: "Across proprietary brand & creator channels"
  },
  {
    number: "800M+",
    label: "Interactions",
    subtext: "In the last 90 days across digital ecosystem"
  },
  {
    number: "12B+",
    label: "Views",
    subtext: "Total video impressions generated in 90 days"
  }
];

export const PRODUCTION_PIPELINE_STEPS: PipelineStep[] = [
  {
    step: "01",
    phase: "IDEA",
    tagline: "The Spark on the Napkin",
    description: "Every blockbuster or viral campaign starts with an unrefined truth. We interrogate the audience, uncover the core conflict, and crystallize the central hook before writing a single line.",
    deliverable: "Creative Thesis, Pitch Deck & Narrative Hook"
  },
  {
    step: "02",
    phase: "CONCEPT",
    tagline: "Scripting & Visual Architecture",
    description: "Translating impulses into scene-by-scene screenplays, director's treatment, tone boards, and frame-accurate storyboards that establish the visual rhythm.",
    deliverable: "Locked Screenplay, Director's Treatment & 2.39:1 Storyboards"
  },
  {
    step: "03",
    phase: "CASTING",
    tagline: "Finding the Soul of the Screen",
    description: "Pairing Bollywood icons (Shabana Azmi, Gulshan Grover, Raza Murad) with breakout digital talent (Munawar Faruqui) to create chemistry that ignites pop culture.",
    deliverable: "Talent Locking, Chemistry Tests & Wardrobe Styling"
  },
  {
    step: "04",
    phase: "PRODUCTION",
    tagline: "Camera, Crew & Command",
    description: "Executing complex multi-camera shoots across India—from 5-acre period backlots and high-speed highway chases to hazard-zone documentary ground zeros.",
    deliverable: "4K/8K Cinema Capture, Sound Recording, Extreme Field Units"
  },
  {
    step: "05",
    phase: "POST",
    tagline: "Where the Film is Born Again",
    description: "In our editing suites: rhythmic assembly cuts, Hollywood-grade ACES color grading, custom Dolby Atmos audio mastering, and seamless VFX integration.",
    deliverable: "ACES Color Grade, Atmos Sound Mix & VFX Finishing"
  },
  {
    step: "06",
    phase: "DISTRIBUTION",
    tagline: "Igniting Global Screens",
    description: "Orchestrating simultaneous premieres across broadcast networks (Zee TV, History TV18, Discovery) and streaming powerhouses (Amazon miniTV, MX Player, YouTube).",
    deliverable: "Omnichannel Rollout, Virality Cutdowns & Real-time Analytics"
  }
];

export const SALT_SERVICES: SaltService[] = [
  {
    title: "Video Production",
    desc: "Feature films, streaming series, prime-time television, and high-gloss television commercials shot on ARRI & RED cinema packages.",
    tag: "Flagship"
  },
  {
    title: "Social Campaigns",
    desc: "Creator-led viral IP, multi-episode road trips, and cultural conversations that capture youth zeitgeist.",
    tag: "High Virality"
  },
  {
    title: "Sponsored Stories",
    desc: "Unscripted brand integrations that feel organic, emotional, and worthy of prime-time viewer loyalty.",
    tag: "Brand Impact"
  },
  {
    title: "CSR Initiatives",
    desc: "Impactful, high-stakes human documentaries and investor awareness anthems (SEBI, NSDL) that create measurable social good.",
    tag: "Nation Building"
  },
  {
    title: "Editorial Content",
    desc: "Long-form journalism, investigative specials (Discovery Channel), and high-retention entertainment serials.",
    tag: "Journalism & Doc"
  },
  {
    title: "AI-Powered Videos",
    desc: "Next-generation generative pre-visualization, hyper-personalized video variations at scale, and hybrid VFX pipelines.",
    tag: "Cutting Edge"
  }
];
