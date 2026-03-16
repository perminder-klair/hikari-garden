import { useState } from 'react';
import { Compass, ChevronRight, Check, Sparkles, Keyboard, Zap, Heart } from 'lucide-react';
import styles from './OnboardingGuide.module.css';

const steps = [
  {
    id: 1,
    title: 'Welcome to Your Garden',
    description: 'This is your personal digital space. Plant seeds of ideas, track your habits, and watch your garden grow over time.',
  },
  {
    id: 2,
    title: 'Plant Your First Seed',
    description: 'Press Spacebar anywhere to plant a seed. These represent your thoughts, ideas, and moments captured throughout the day.',
  },
  {
    id: 3,
    title: 'Explore the Sections',
    description: 'Your garden has many areas: habit tracking, focus sessions, bookmarks, and more. Take a scroll to discover them all.',
  },
  {
    id: 4,
    title: 'Customize Your Experience',
    description: 'Press T to toggle between light and dark modes. Use the Theme Customizer to personalize colors and fonts.',
  },
];

const tips = [
  { icon: <Keyboard size={18} />, text: 'Press ? for keyboard shortcuts' },
  { icon: <Zap size={18} />, text: 'Use Quick Notes for fast capture' },
  { icon: <Heart size={18} />, text: 'Track habits daily to build streaks' },
  { icon: <Sparkles size={18} />, text: 'Check your Growth Rings monthly' },
];

export default function OnboardingGuide() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState<number[]>([]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCompleted([...completed, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    setCompleted([...completed, currentStep]);
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const currentStepData = steps.find(s => s.id === currentStep);

  return (
    <section className={styles.onboardingGuide}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Compass className={styles.icon} size={20} />
          Getting Started
        </h2>
      </div>

      <div className={styles.progressBar}>
        {steps.map((step) => (
          <div
            key={step.id}
            className={`${styles.progressStep} ${step.id <= currentStep ? styles.progressStepActive : ''}`}
          />
        ))}
      </div>

      {currentStepData && (
        <div className={styles.stepContent}>
          <div className={styles.stepNumber}>Step {currentStepData.id} of {steps.length}</div>
          <h3 className={styles.stepTitle}>{currentStepData.title}</h3>
          <p className={styles.stepDescription}>{currentStepData.description}</p>
          <div className={styles.stepActions}>
            <button className={styles.actionBtn} onClick={handleNext}>
              {currentStep === steps.length ? (
                <><Check size={14} style={{ marginRight: '0.5rem' }} /> Complete</>
              ) : (
                <>Next <ChevronRight size={14} style={{ marginLeft: '0.25rem' }} /></>
              )}
            </button>
            {currentStep < steps.length && (
              <button className={`${styles.actionBtn} ${styles.secondaryBtn}`} onClick={handleSkip}>
                Skip
              </button>
            )}
          </div>
        </div>
      )}

      <div className={styles.tipsList}>
        {tips.map((tip, index) => (
          <div key={index} className={styles.tipCard}>
            <span className={styles.tipIcon}>{tip.icon}</span>
            <span className={styles.tipText}>{tip.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
