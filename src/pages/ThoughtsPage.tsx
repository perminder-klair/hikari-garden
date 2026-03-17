import ThoughtStream from '../components/sections/ThoughtStream';
import WisdomWell from '../components/sections/WisdomWell';
import DreamJournal from '../components/sections/DreamJournal';
import DailyWord from '../components/sections/DailyWord';
import CodeSnippets from '../components/sections/CodeSnippets';
import IdeaGarden from '../components/sections/IdeaGarden';
import QuickNotes from '../components/sections/QuickNotes';
import WritingDesk from '../components/sections/WritingDesk';
import MemoryPalace from '../components/sections/MemoryPalace';
import MemoryVault from '../components/sections/MemoryVault';
import InspirationBoard from '../components/sections/InspirationBoard';
import DecisionLog from '../components/sections/DecisionLog';
import VisionBoard from '../components/sections/VisionBoard';
import TimeCapsule from '../components/sections/TimeCapsule';
import KnowledgeBase from '../components/sections/KnowledgeBase';
import BookNook from '../components/sections/BookNook';
import QuoteCollection from '../components/sections/QuoteCollection';
import QuoteGarden from '../components/sections/QuoteGarden';
import AffirmationWall from '../components/sections/AffirmationWall';
import SnippetVault from '../components/sections/SnippetVault';
import SketchPad from '../components/sections/SketchPad';
import PoetryCorner from '../components/sections/PoetryCorner';

export default function ThoughtsPage() {
  return (
    <>
      <ThoughtStream />
      <IdeaGarden />
      <QuickNotes />
      <WritingDesk />
      <DailyWord />
      <CodeSnippets />
      <SnippetVault />
      <SketchPad />
      <WisdomWell />
      <InspirationBoard />
      <AffirmationWall />
      <QuoteCollection />
      <QuoteGarden />
      <PoetryCorner />
      <MemoryPalace />
      <MemoryVault />
      <KnowledgeBase />
      <BookNook />
      <DecisionLog />
      <VisionBoard />
      <DreamJournal />
      <TimeCapsule />
    </>
  );
}
