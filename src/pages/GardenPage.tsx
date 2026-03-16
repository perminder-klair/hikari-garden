import SeedsTimeline from '../components/sections/SeedsTimeline';
import GardenLog from '../components/sections/GardenLog';
import FocusTimer from '../components/sections/FocusTimer';
import HabitTracker from '../components/sections/HabitTracker';
import GratitudeGarden from '../components/sections/GratitudeGarden';
import MoodBoard from '../components/sections/MoodBoard';

export default function GardenPage() {
  return (
    <>
      <SeedsTimeline />
      <GardenLog />
      <FocusTimer />
      <HabitTracker />
      <GratitudeGarden />
      <MoodBoard />
    </>
  );
}
