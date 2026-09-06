export type WorkCategory =
  | "ALL"
  | "TELEVISION"
  | "DOCUMENTARY"
  | "WEB SERIES"
  | "BRANDED CONTENT"
  | "ADS"
  | "MUSIC VIDEO"
  | "MICRODRAMA";

export interface ProjectCredit {
  role: string;
  name: string;
}

export interface ProjectStats {
  episodes?: string;
  views?: string;
  rating?: string;
  reach?: string;
  milestone?: string;
  parts?: string;
  network?: string;
  nomination?: string;
  engagement?: string;
  award?: string;
  virality?: string;
  airing?: string;
  impact?: string;
  completionRate?: string;
  shares?: string;
  status?: string;
  genre?: string;
  seasons?: string;
  accolade?: string;
  resolution?: string;
}

export interface Project {
  id: string;
  title: string;
  year: string;
  category: WorkCategory;
  role: string;
  client: string;
  format: string;
  aspectRatio: string;
  logline: string;
  synopsis: string;
  youtubeId: string;
  teaserYoutubeId?: string;
  externalUrl?: string;
  posterUrl: string;
  bannerUrl: string;
  stats: ProjectStats;
  credits: ProjectCredit[];
  behindTheScenes: string[];
}

export interface ShowreelChapter {
  time: string;
  title: string;
}

export interface ShowreelMetadata {
  title: string;
  duration: string;
  aspectRatio: string;
  year: string;
  youtubeId: string;
  videoUrl: string;
  subtitle: string;
  chapters: ShowreelChapter[];
}

export interface TimelineStat {
  label: string;
  value: string;
}

export interface CareerTimelineStage {
  id: string;
  category: string;
  era: string;
  headline: string;
  subhead: string;
  description: string;
  keyWork: string;
  lightingColor: string;
  accentColor: string;
  atmosphere: string;
  stats: TimelineStat[];
  directorNote: string;
}

export interface SaltMetric {
  number: string;
  label: string;
  subtext: string;
}

export interface PipelineStep {
  step: string;
  phase: string;
  tagline: string;
  description: string;
  deliverable: string;
}

export interface SaltService {
  title: string;
  desc: string;
  tag: string;
}

export interface Testimonial {
  id: string;
  speaker: string;
  role: string;
  organization: string;
  quote: string;
  context: string;
}

export interface ClientCredit {
  name: string;
  category: string;
  note: string;
}
