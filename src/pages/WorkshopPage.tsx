import CollaborationSpace from '../components/sections/CollaborationSpace';
import ConnectionWeb from '../components/sections/ConnectionWeb';
import ActivityFeed from '../components/sections/ActivityFeed';
import TaskBoard from '../components/sections/TaskBoard';
import TimeTracker from '../components/sections/TimeTracker';
import TypingGarden from '../components/sections/TypingGarden';
import ProjectLab from '../components/sections/ProjectLab';
import ToolShed from '../components/sections/ToolShed';
import SkillTree from '../components/sections/SkillTree';
import ColorPalette from '../components/sections/ColorPalette';
import DesignTokens from '../components/sections/DesignTokens';
import ThemeCustomizer from '../components/sections/ThemeCustomizer';
import KeyboardShortcuts from '../components/sections/KeyboardShortcuts';
import SearchGarden from '../components/sections/SearchGarden';
import OnboardingGuide from '../components/sections/OnboardingGuide';
import WidgetManager from '../components/sections/WidgetManager';
import DocumentationHub from '../components/sections/DocumentationHub';
import SocialGarden from '../components/sections/SocialGarden';
import VoiceMemos from '../components/sections/VoiceMemos';
import VoiceNotes from '../components/sections/VoiceNotes';

export default function WorkshopPage() {
  return (
    <>
      <TaskBoard />
      <ProjectLab />
      <CollaborationSpace />
      <ActivityFeed />
      <TimeTracker />
      <SkillTree />
      <ToolShed />
      <ConnectionWeb />
      <SocialGarden />
      <DocumentationHub />
      <SearchGarden />
      <ColorPalette />
      <DesignTokens />
      <ThemeCustomizer />
      <KeyboardShortcuts />
      <TypingGarden />
      <OnboardingGuide />
      <WidgetManager />
      <VoiceMemos />
      <VoiceNotes />
    </>
  );
}
