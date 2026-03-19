import ProjectsShowcase from '../components/sections/ProjectsShowcase';
import NowPlaying from '../components/sections/NowPlaying';
import ReadingList from '../components/sections/ReadingList';
import RecipeCollection from '../components/sections/RecipeCollection';
import TravelLog from '../components/sections/TravelLog';
import PhotoGallery from '../components/sections/PhotoGallery';
import GamingShelf from '../components/sections/GamingShelf';
import MusicGarden from '../components/sections/MusicGarden';
import PodcastGarden from '../components/sections/PodcastGarden';
import WatchList from '../components/sections/WatchList';
import BookmarkForest from '../components/sections/BookmarkForest';
import ArchiveVault from '../components/sections/ArchiveVault';
import LinkLibrary from '../components/sections/LinkLibrary';
import LinkRotator from '../components/sections/LinkRotator';
import ResourceLibrary from '../components/sections/ResourceLibrary';
import HobbyTracker from '../components/sections/HobbyTracker';
import AstroGarden from '../components/sections/AstroGarden';
import BirdWatcher from '../components/sections/BirdWatcher';
import { Stargazer } from '../components/sections/Stargazer';

export default function CollectionPage() {
  return (
    <>
      <ProjectsShowcase />
      <NowPlaying />
      <MusicGarden />
      <PodcastGarden />
      <ReadingList />
      <WatchList />
      <GamingShelf />
      <PhotoGallery />
      <RecipeCollection />
      <TravelLog />
      <BookmarkForest />
      <LinkLibrary />
      <LinkRotator />
      <ResourceLibrary />
      <ArchiveVault />
      <HobbyTracker />
      <AstroGarden />
      <BirdWatcher />
      <Stargazer />
    </>
  );
}
