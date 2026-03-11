import type { GardenEvent } from '../types';

export const gardenEvents: GardenEvent[] = [
  { message: 'A new seed sprouts in the Greenhouse', type: 'growth' },
  { message: 'A thought crystallizes in the Observatory', type: 'thought' },
  { message: 'The Agent Network pulses with activity', type: 'system' },
  { message: 'A book whispers from the Library', type: 'knowledge' },
  { message: 'The garden breathes in the quiet', type: 'ambient' },
];

export const seedTemplates = [
  { title: 'Midnight Reflection', desc: 'A thought captured in the quiet hours', tag: 'thought' },
  { title: 'New Connection', desc: 'Linked to something worth remembering', tag: 'link' },
  { title: 'Idea Sprouted', desc: 'Fresh concept taking its first breath', tag: 'idea' },
  { title: 'Memory Planted', desc: 'A moment preserved in digital soil', tag: 'memory' },
  { title: 'Dream Logged', desc: 'Fragments from the subconscious', tag: 'dream' },
];
