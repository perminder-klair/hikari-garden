import ThoughtStream from '../components/sections/ThoughtStream';
import WisdomWell from '../components/sections/WisdomWell';
import DreamJournal from '../components/sections/DreamJournal';
import DailyWord from '../components/sections/DailyWord';
import CodeSnippets from '../components/sections/CodeSnippets';

export default function ThoughtsPage() {
  return (
    <>
      <ThoughtStream />
      <WisdomWell />
      <DreamJournal />
      <DailyWord />
      <CodeSnippets />
    </>
  );
}
