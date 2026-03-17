import { History, GitCommit, Bug, Sparkles, Rocket } from 'lucide-react';
import styles from './Changelog.module.css';

interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    type: 'feature' | 'fix' | 'improvement';
    description: string;
  }[];
}

const changelog: ChangelogEntry[] = [
  {
    version: '28.0.0',
    date: '2026-03-17',
    changes: [
      { type: 'feature', description: 'Added ZenGarden - Interactive breathing exercises with guided patterns and visual animations' },
      { type: 'feature', description: 'Added CrystalGrid - Intention manifestation tracker with crystal energy grid and goal setting' },
      { type: 'feature', description: 'Added PoetryCorner - Curated poetry collection with reading mode and favorites' },
    ],
  },
  {
    version: '27.0.0',
    date: '2026-03-16',
    changes: [
      { type: 'feature', description: 'Added MemoryVault - Personal memory storage with categories and tags' },
      { type: 'feature', description: 'Added GoalGarden - Goal tracking with milestones and progress visualization' },
      { type: 'feature', description: 'Added MoodBoard - Visual mood tracking with color-coded entries' },
    ],
  },
  {
    version: '26.0.0',
    date: '2026-03-16',
    changes: [
      { type: 'feature', description: 'Added QuoteGarden - Curated quote collection with favorites and categories' },
      { type: 'feature', description: 'Added LinkLibrary - Bookmark manager with categories and tags' },
      { type: 'feature', description: 'Added DailyChallenge - Daily coding/learning challenges with streak tracking' },
    ],
  },
  {
    version: '25.0.0',
    date: '2026-03-16',
    changes: [
      { type: 'feature', description: 'Added SketchPad - Interactive drawing canvas for quick sketches and visual notes' },
      { type: 'feature', description: 'Added VoiceNotes - Audio recording and transcription system' },
      { type: 'feature', description: 'Added PomodoroGarden - Focus timer with tree growth visualization' },
    ],
  },
  {
    version: '24.0.0',
    date: '2026-03-16',
    changes: [
      { type: 'feature', description: 'Added SleepTracker - Sleep quality and duration tracking with insights' },
      { type: 'feature', description: 'Added WaterGarden - Hydration tracking with visual water level indicator' },
      { type: 'feature', description: 'Added ScreenTime - Digital wellness dashboard with app usage analytics' },
    ],
  },
  {
    version: '23.0.0',
    date: '2026-03-16',
    changes: [
      { type: 'feature', description: 'Added MoodTimeline - Visual mood tracking with energy levels and trends' },
      { type: 'feature', description: 'Added FocusForest - Grow trees by completing focus sessions' },
      { type: 'feature', description: 'Added HabitCalendar - GitHub-style heatmap for habit consistency' },
    ],
  },
  {
    version: '22.0.0',
    date: '2026-03-15',
    changes: [
      { type: 'feature', description: 'Added HabitStack - Chain habits together for momentum and streak tracking' },
      { type: 'feature', description: 'Added ReflectionPool - Daily, weekly, and monthly reflection system' },
      { type: 'feature', description: 'Added IntentionsGarden - Time-based intention setting (morning/day/evening)' },
    ],
  },
  {
    version: '21.0.0',
    date: '2026-03-15',
    changes: [
      { type: 'feature', description: 'Added CalendarGarden - Interactive monthly calendar with event tracking' },
      { type: 'feature', description: 'Added CommandPalette - Quick access to all garden commands and actions' },
      { type: 'feature', description: 'Added TimeTracker - Session-based time tracking with statistics' },
    ],
  },
  {
    version: '20.0.0',
    date: '2026-03-15',
    changes: [
      { type: 'feature', description: 'Added TaskBoard - Kanban-style task management with drag-and-drop columns' },
      { type: 'feature', description: 'Added AnalyticsDashboard - Traffic analytics with bar charts and donut visualizations' },
      { type: 'feature', description: 'Added NotificationCenter - Real-time notification system with filtering' },
    ],
  },
  {
    version: '19.0.0',
    date: '2026-03-15',
    changes: [
      { type: 'feature', description: 'Added CollaborationSpace - Project collaboration and team activity tracking' },
      { type: 'feature', description: 'Added VersionControl - Git branch management and commit statistics' },
      { type: 'feature', description: 'Added DocumentationHub - Centralized documentation search and management' },
    ],
  },
  {
    version: '18.0.0',
    date: '2026-03-15',
    changes: [
      { type: 'feature', description: 'Added OnboardingGuide - Interactive getting started tutorial' },
      { type: 'feature', description: 'Added DataVisualizer - Analytics dashboard with charts' },
      { type: 'feature', description: 'Added KeyboardShortcuts - Reference guide for all shortcuts' },
    ],
  },
  {
    version: '17.0.0',
    date: '2026-03-15',
    changes: [
      { type: 'feature', description: 'Added ThemeCustomizer - Personalize accent colors, fonts, and spacing' },
      { type: 'feature', description: 'Added ActivityFeed - Real-time activity tracking across all sections' },
      { type: 'feature', description: 'Added ExportManager - Export garden data in multiple formats' },
      { type: 'feature', description: 'Added WidgetManager - Toggle and manage dashboard widgets' },
    ],
  },
  {
    version: '16.0.0',
    date: '2026-03-14',
    changes: [
      { type: 'feature', description: 'Added PomodoroGarden - Focus timer with session tracking' },
      { type: 'feature', description: 'Added NotificationCenter - Centralized notification management' },
      { type: 'feature', description: 'Added SearchGarden - Universal search across all garden content' },
      { type: 'feature', description: 'Added BackupManager - Automated backup and restore system' },
    ],
  },
  {
    version: '15.0.0',
    date: '2026-03-14',
    changes: [
      { type: 'feature', description: 'Added ErrorBoundary - Error tracking and crash monitoring' },
      { type: 'feature', description: 'Added FeatureFlags - Feature toggle management system' },
      { type: 'feature', description: 'Added HealthCheck - System health status dashboard' },
      { type: 'feature', description: 'Added MetricsDashboard - Performance metrics visualization' },
    ],
  },
  {
    version: '14.0.0',
    date: '2026-03-14',
    changes: [
      { type: 'feature', description: 'Added EnvironmentVars - Environment configuration manager' },
      { type: 'feature', description: 'Added DatabaseSchema - Visual database schema designer' },
      { type: 'feature', description: 'Added CronManager - Cron job scheduler and tracker' },
      { type: 'feature', description: 'Added LogViewer - Application log viewer with filtering' },
    ],
  },
  {
    version: '13.0.0',
    date: '2026-03-14',
    changes: [
      { type: 'feature', description: 'Added Terminal - Interactive command-line interface' },
      { type: 'feature', description: 'Added GitLog - Visual git commit history' },
      { type: 'feature', description: 'Added PackageManager - Dependency tracking and updates' },
    ],
  },
  {
    version: '12.0.0',
    date: '2026-03-14',
    changes: [
      { type: 'feature', description: 'Added SnippetVault - Code snippet collection' },
      { type: 'feature', description: 'Added APIPlayground - API testing and documentation' },
      { type: 'feature', description: 'Added DesignTokens - Design system tokens management' },
      { type: 'feature', description: 'Added ReleaseNotes - Personal release notes' },
    ],
  },
  {
    version: '11.0.0',
    date: '2026-03-13',
    changes: [
      { type: 'feature', description: 'Added ArchiveVault - Personal archive for old projects and memories' },
      { type: 'feature', description: 'Added LinkRotator - Curated link rotation for saved discoveries' },
      { type: 'feature', description: 'Added ColorPalette - Personal color palette collection' },
      { type: 'feature', description: 'Added KeyboardShortcuts - Reference guide for all garden shortcuts' },
    ],
  },
  {
    version: '10.0.0',
    date: '2026-03-13',
    changes: [
      { type: 'feature', description: 'Added VisionBoard - Long-term goals visualization' },
      { type: 'feature', description: 'Added ChallengeTracker - Monthly/weekly challenges' },
      { type: 'feature', description: 'Added HobbyTracker - Track hobbies and time spent' },
      { type: 'feature', description: 'Added SocialGarden - Social media/content planning' },
    ],
  },
  {
    version: '9.0.0',
    date: '2026-03-13',
    changes: [
      { type: 'feature', description: 'Added Changelog - Version history tracking' },
      { type: 'feature', description: 'Added AffirmationWall - Daily positive affirmations' },
      { type: 'feature', description: 'Added InspirationBoard - Visual mood board' },
      { type: 'feature', description: 'Added QuickNotes - Rapid capture system' },
    ],
  },
  {
    version: '8.0.0',
    date: '2026-03-13',
    changes: [
      { type: 'feature', description: 'Added ExpenseTracker - Personal expense tracking' },
      { type: 'feature', description: 'Added DailyCheckIn - Daily wellness tracker' },
      { type: 'feature', description: 'Added DevTracker - Development project management' },
      { type: 'feature', description: 'Added KnowledgeBase - Wiki-style knowledge management' },
      { type: 'feature', description: 'Added FocusSessions - Advanced pomodoro timer' },
    ],
  },
  {
    version: '7.0.0',
    date: '2026-03-12',
    changes: [
      { type: 'feature', description: 'Added PlantTracker - Houseplant care management' },
      { type: 'feature', description: 'Added ToolShed - Digital tool collection' },
      { type: 'feature', description: 'Added BookmarkForest - Curated bookmarks' },
      { type: 'feature', description: 'Added WeatherStation - Local weather display' },
    ],
  },
  {
    version: '6.0.0',
    date: '2026-03-12',
    changes: [
      { type: 'feature', description: 'Added SubscriptionTracker - Recurring subscriptions' },
      { type: 'feature', description: 'Added LanguageGarden - Vocabulary learning' },
      { type: 'feature', description: 'Added WatchList - Movies and shows tracking' },
      { type: 'feature', description: 'Added MusicGarden - Album and artist discovery' },
    ],
  },
  {
    version: '5.0.0',
    date: '2026-03-12',
    changes: [
      { type: 'feature', description: 'Added FinanceGarden - Personal finance tracking' },
      { type: 'feature', description: 'Added TravelLog - Journey documentation' },
      { type: 'feature', description: 'Added HealthVault - Wellness data tracking' },
      { type: 'feature', description: 'Added IdeaGarden - Creative ideation space' },
    ],
  },
  {
    version: '4.0.0',
    date: '2026-03-12',
    changes: [
      { type: 'feature', description: 'Added EnergyTracker - Daily energy level tracking' },
      { type: 'feature', description: 'Added BookNook - Reading tracker' },
      { type: 'feature', description: 'Added SkillTree - Visual skill progression' },
      { type: 'feature', description: 'Added GoalQuest - Goal setting system' },
    ],
  },
  {
    version: '3.0.0',
    date: '2026-03-11',
    changes: [
      { type: 'feature', description: 'Added SoundScape - Ambient audio mixer' },
      { type: 'feature', description: 'Added ConnectionWeb - Relationship mapping' },
      { type: 'feature', description: 'Added ProjectLab - Project management' },
      { type: 'feature', description: 'Added TimeCapsule - Future message system' },
    ],
  },
  {
    version: '2.0.0',
    date: '2026-03-11',
    changes: [
      { type: 'feature', description: 'Added LearningTracker - Course progress' },
      { type: 'feature', description: 'Added WritingDesk - Creative writing space' },
      { type: 'feature', description: 'Added MemoryPalace - Mental architecture' },
      { type: 'feature', description: 'Added DecisionLog - Important decisions tracking' },
    ],
  },
  {
    version: '1.0.0',
    date: '2026-03-11',
    changes: [
      { type: 'feature', description: 'Added MeditationSpace - Breathing exercises' },
      { type: 'feature', description: 'Added TypingGarden - Speed typing practice' },
      { type: 'feature', description: 'Added YearInPixels - Visual mood tracker' },
      { type: 'feature', description: 'Added QuoteCollection - Curated quotes' },
      { type: 'feature', description: 'Initial Digital Garden launch' },
    ],
  },
];

const typeIcons = {
  feature: Sparkles,
  fix: Bug,
  improvement: Rocket,
};

const typeColors = {
  feature: '#34d399',
  fix: '#ef4444',
  improvement: '#60a5fa',
};

export default function Changelog() {
  return (
    <section className={styles.changelog} id="changelog">
      <div className={styles.header}>
        <div className={styles.icon}>
          <History size={28} />
        </div>
        <h2 className={styles.title}>Changelog</h2>
        <p className={styles.subtitle}>Version history and system evolution</p>
      </div>

      <div className={styles.timeline}>
        {changelog.map((entry, index) => (
          <div key={entry.version} className={styles.entry}>
            <div className={styles.marker}>
              <GitCommit size={16} />
            </div>
            
            <div className={styles.content}>
              <div className={styles.versionHeader}>
                <span className={styles.version}>v{entry.version}</span>
                <span className={styles.date}>{entry.date}</span>
              </div>
              
              <ul className={styles.changes}>
                {entry.changes.map((change, changeIndex) => {
                  const Icon = typeIcons[change.type];
                  return (
                    <li key={changeIndex} className={styles.change}>
                      <span 
                        className={styles.typeBadge}
                        style={{ color: typeColors[change.type] }}
                      >
                        <Icon size={12} />
                        {change.type}
                      </span>
                      <span className={styles.description}>{change.description}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>114</span>
          <span className={styles.statLabel}>Total Sections</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>28</span>
          <span className={styles.statLabel}>Major Releases</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>3</span>
          <span className={styles.statLabel}>Days Active</span>
        </div>
      </div>
    </section>
  );
}
