import SystemDashboard from '../components/sections/SystemDashboard';
import AgentNetwork from '../components/sections/AgentNetwork';
import AnalyticsDashboard from '../components/sections/AnalyticsDashboard';
import APIDashboard from '../components/sections/APIDashboard';
import APIPlayground from '../components/sections/APIPlayground';
import DatabaseSchema from '../components/sections/DatabaseSchema';
import HealthCheck from '../components/sections/HealthCheck';
import CacheMonitor from '../components/sections/CacheMonitor';
import LogViewer from '../components/sections/LogViewer';
import FeatureFlags from '../components/sections/FeatureFlags';
import CronManager from '../components/sections/CronManager';
import MetricsDashboard from '../components/sections/MetricsDashboard';
import Terminal from '../components/sections/Terminal';
import GitLog from '../components/sections/GitLog';
import Changelog from '../components/sections/Changelog';
import PackageManager from '../components/sections/PackageManager';
import EnvironmentVars from '../components/sections/EnvironmentVars';
import WebhookManager from '../components/sections/WebhookManager';
import QueueManager from '../components/sections/QueueManager';
import VersionControl from '../components/sections/VersionControl';
import ErrorBoundary from '../components/sections/ErrorBoundary';
import NotificationCenter from '../components/sections/NotificationCenter';
import ExportManager from '../components/sections/ExportManager';
import BackupManager from '../components/sections/BackupManager';
import ReleaseNotes from '../components/sections/ReleaseNotes';
import DevTracker from '../components/sections/DevTracker';
import DataVisualizer from '../components/sections/DataVisualizer';
import CommandPalette from '../components/sections/CommandPalette';

export default function SystemPage() {
  return (
    <>
      <SystemDashboard />
      <AgentNetwork />
      <HealthCheck />
      <MetricsDashboard />
      <AnalyticsDashboard />
      <DataVisualizer />
      <Terminal />
      <CommandPalette />
      <APIDashboard />
      <APIPlayground />
      <DatabaseSchema />
      <CacheMonitor />
      <LogViewer />
      <FeatureFlags />
      <CronManager />
      <QueueManager />
      <WebhookManager />
      <PackageManager />
      <EnvironmentVars />
      <GitLog />
      <VersionControl />
      <Changelog />
      <ReleaseNotes />
      <ErrorBoundary />
      <NotificationCenter />
      <ExportManager />
      <BackupManager />
      <DevTracker />
    </>
  );
}
