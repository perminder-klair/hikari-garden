import type { GardenEvent } from '../types';

export const gardenEvents: GardenEvent[] = [
  { message: 'A new seed sprouts in the Greenhouse', type: 'growth' },
  { message: 'A thought crystallizes in the Observatory', type: 'thought' },
  { message: 'The Agent Network pulses with activity', type: 'system' },
  { message: 'A book whispers from the Library', type: 'knowledge' },
  { message: 'The garden breathes in the quiet', type: 'ambient' },
  { message: 'Rain falls gently on the garden paths', type: 'ambient' },
  { message: 'The sun dial casts a new shadow', type: 'system' },
  { message: 'Mushrooms emerge from the forest floor', type: 'growth' },
  { message: 'Clouds drift across the digital sky', type: 'ambient' },
  { message: 'Crystals hum with stored energy', type: 'system' },
  { message: 'A bonsai branch reaches toward the light', type: 'growth' },
  { message: 'Fireflies dance in their glass sanctuary', type: 'ambient' },
  { message: 'Koi glide through the digital pond', type: 'ambient' },
  { message: 'The bonsai whispers ancient wisdom', type: 'thought' },
  { message: 'A firefly glows with captured starlight', type: 'ambient' },
  { message: 'Paper folds into delicate art in the studio', type: 'creative' },
  { message: 'A telescope captures distant starlight', type: 'discovery' },
  { message: 'Wind chimes sing their gentle melody', type: 'ambient' },
  { message: 'Origami cranes take flight in imagination', type: 'creative' },
  { message: 'Constellations map across the night canvas', type: 'discovery' },
];

export const seedTemplates = [
  { title: 'Midnight Reflection', desc: 'A thought captured in the quiet hours', tag: 'thought' },
  { title: 'New Connection', desc: 'Linked to something worth remembering', tag: 'link' },
  { title: 'Idea Sprouted', desc: 'Fresh concept taking its first breath', tag: 'idea' },
  { title: 'Memory Planted', desc: 'A moment preserved in digital soil', tag: 'memory' },
  { title: 'Dream Logged', desc: 'Fragments from the subconscious', tag: 'dream' },
];
