import MoodAnalytics from '../components/sections/MoodAnalytics';
import MoodCanvas from '../components/sections/MoodCanvas';
import MoodTimeline from '../components/sections/MoodTimeline';
import MeditationSpace from '../components/sections/MeditationSpace';
import SleepTracker from '../components/sections/SleepTracker';
import WorkoutLog from '../components/sections/WorkoutLog';
import HealthVault from '../components/sections/HealthVault';
import SoundScape from '../components/sections/SoundScape';
import MealPlanner from '../components/sections/MealPlanner';
import EnergyTracker from '../components/sections/EnergyTracker';
import WeatherStation from '../components/sections/WeatherStation';
import ExpenseTracker from '../components/sections/ExpenseTracker';
import FinanceGarden from '../components/sections/FinanceGarden';
import SubscriptionTracker from '../components/sections/SubscriptionTracker';
import LanguageGarden from '../components/sections/LanguageGarden';
import LearningTracker from '../components/sections/LearningTracker';
import ScreenTime from '../components/sections/ScreenTime';
import ZenGarden from '../components/sections/ZenGarden';

export default function WellnessPage() {
  return (
    <>
      <MoodAnalytics />
      <MoodCanvas />
      <MoodTimeline />
      <MeditationSpace />
      <ZenGarden />
      <SoundScape />
      <SleepTracker />
      <EnergyTracker />
      <WorkoutLog />
      <HealthVault />
      <MealPlanner />
      <ScreenTime />
      <FinanceGarden />
      <ExpenseTracker />
      <SubscriptionTracker />
      <LanguageGarden />
      <LearningTracker />
      <WeatherStation />
    </>
  );
}
