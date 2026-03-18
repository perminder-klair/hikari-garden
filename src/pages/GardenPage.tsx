import SeedsTimeline from '../components/sections/SeedsTimeline';
import GardenLog from '../components/sections/GardenLog';
import GratitudeGarden from '../components/sections/GratitudeGarden';
import MoodBoard from '../components/sections/MoodBoard';
import CalendarGarden from '../components/sections/CalendarGarden';
import GoalGarden from '../components/sections/GoalGarden';
import IntentionsGarden from '../components/sections/IntentionsGarden';
import PlantTracker from '../components/sections/PlantTracker';
import WaterGarden from '../components/sections/WaterGarden';
import PomodoroGarden from '../components/sections/PomodoroGarden';
import FocusForest from '../components/sections/FocusForest';
import FocusSessions from '../components/sections/FocusSessions';
import FocusTimer from '../components/sections/FocusTimer';
import HabitCalendar from '../components/sections/HabitCalendar';
import HabitStack from '../components/sections/HabitStack';
import HabitTracker from '../components/sections/HabitTracker';
import ReflectionPool from '../components/sections/ReflectionPool';
import GoalQuest from '../components/sections/GoalQuest';
import ChallengeTracker from '../components/sections/ChallengeTracker';
import DailyChallenge from '../components/sections/DailyChallenge';
import DailyCheckIn from '../components/sections/DailyCheckIn';
import YearInPixels from '../components/sections/YearInPixels';
import CrystalGrid from '../components/sections/CrystalGrid';
import ForestBath from '../components/sections/ForestBath';
import CloudGazer from '../components/sections/CloudGazer';
import SeedLibrary from '../components/sections/SeedLibrary';

export default function GardenPage() {
  return (
    <>
      <SeedsTimeline />
      <GardenLog />
      <GratitudeGarden />
      <CalendarGarden />
      <GoalGarden />
      <IntentionsGarden />
      <CrystalGrid />
      <ForestBath />
      <CloudGazer />
      <SeedLibrary />
      <PlantTracker />
      <WaterGarden />
      <FocusTimer />
      <FocusForest />
      <FocusSessions />
      <PomodoroGarden />
      <HabitTracker />
      <HabitCalendar />
      <HabitStack />
      <GoalQuest />
      <ChallengeTracker />
      <DailyChallenge />
      <DailyCheckIn />
      <ReflectionPool />
      <MoodBoard />
      <YearInPixels />
    </>
  );
}
