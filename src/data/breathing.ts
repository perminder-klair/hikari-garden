import type { BreathingPattern } from '../types';

export const breathingPatterns: BreathingPattern[] = [
  {
    name: 'Box Breathing',
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdEmpty: 4,
    description: 'Equal duration for all phases. Used by Navy SEALs for calm focus.',
  },
  {
    name: '4-7-8 Breathing',
    inhale: 4,
    hold: 7,
    exhale: 8,
    holdEmpty: 0,
    description: 'Promotes relaxation and helps with sleep. Exhale is twice as long as inhale.',
  },
  {
    name: 'Coherent Breathing',
    inhale: 5,
    hold: 0,
    exhale: 5,
    holdEmpty: 0,
    description: 'Five breaths per minute. Balances the nervous system.',
  },
  {
    name: 'Energizing Breath',
    inhale: 2,
    hold: 0,
    exhale: 1,
    holdEmpty: 0,
    description: 'Quick, energizing breaths. Inhale twice as long as exhale.',
  },
  {
    name: 'Relaxing Breath',
    inhale: 4,
    hold: 2,
    exhale: 6,
    holdEmpty: 0,
    description: 'Longer exhale activates the parasympathetic nervous system.',
  },
];
