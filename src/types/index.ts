export interface Seed {
  id: string;
  title: string;
  desc: string;
  tag: string;
  time: string;
}

export interface Track {
  title: string;
  artist: string;
  album: string;
  emoji: string;
}

export interface Book {
  title: string;
  author: string;
  status: 'reading' | 'completed' | 'queued';
  progress: number;
}

export interface Word {
  japanese: string;
  romaji: string;
  english: string;
  meaning: string;
  example: string;
}

export interface Agent {
  id: string;
  kanji: string;
  name: string;
  role: string;
  message: string;
}

export interface Snippet {
  lang: string;
  code: string;
}

export interface Thought {
  content: string;
  date: string;
  tags: string[];
}

export interface Project {
  icon: string;
  title: string;
  tagline: string;
  desc: string;
  stats: { value: string; label: string }[];
  linkText: string;
  status: string;
  isBeta?: boolean;
}

export interface Feature {
  icon: string;
  title: string;
  desc: string;
}

export interface Mood {
  gradient: string;
  emoji: string;
  label: string;
  color: string;
}

export interface Season {
  num: string;
  label: string;
}

export interface GardenEvent {
  message: string;
  type: string;
}

export interface WisdomQuote {
  quote: string;
  author: string;
}

export interface DashboardCard {
  statusText: string;
  name: string;
  info: string;
  metric: string;
}

export interface Crystal {
  id: string;
  name: string;
  color: string;
  intention: string;
  activated: boolean;
}

export interface Poem {
  id: string;
  title: string;
  author: string;
  lines: string[];
  favorite?: boolean;
}

export interface BreathingPattern {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdEmpty: number;
  description: string;
}
