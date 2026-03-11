import type { Project } from '../types';

export const projects: Project[] = [
  {
    icon: '⚡',
    title: 'Thoth',
    tagline: 'AI Social Media Platform',
    desc: 'Content creation powered by intelligence. Generate posts, images, and strategies for modern creators.',
    stats: [
      { value: '150+', label: 'Posts/Month' },
      { value: '6', label: 'Platforms' },
    ],
    linkText: 'Visit',
    status: 'Live',
  },
  {
    icon: '🌐',
    title: 'Mignomic',
    tagline: 'AI Immigration Platform',
    desc: 'Navigating borders with intelligence. Making immigration processes transparent and accessible.',
    stats: [
      { value: 'Beta', label: 'Status' },
      { value: 'UK', label: 'Focus' },
    ],
    linkText: 'Explore',
    status: 'Beta',
    isBeta: true,
  },
];
