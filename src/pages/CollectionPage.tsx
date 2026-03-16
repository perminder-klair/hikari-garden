import ProjectsShowcase from '../components/sections/ProjectsShowcase';
import SystemDashboard from '../components/sections/SystemDashboard';
import AgentNetwork from '../components/sections/AgentNetwork';
import NowPlaying from '../components/sections/NowPlaying';
import ReadingList from '../components/sections/ReadingList';
import RecipeCollection from '../components/sections/RecipeCollection';
import TravelLog from '../components/sections/TravelLog';

export default function CollectionPage() {
  return (
    <>
      <ProjectsShowcase />
      <SystemDashboard />
      <AgentNetwork />
      <NowPlaying />
      <ReadingList />
      <RecipeCollection />
      <TravelLog />
    </>
  );
}
