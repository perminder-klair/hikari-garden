import { useState } from 'react';
import { Command, Search, FileText, Settings, User, Moon, Sun, Plus, Edit3, Trash2, Share2, Download, RefreshCw } from 'lucide-react';
import styles from './CommandPalette.module.css';

interface CommandItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  shortcut?: string;
  category: string;
}

const commands: CommandItem[] = [
  // Navigation
  { id: 'nav-home', name: 'Go to Home', description: 'Navigate to the home section', icon: <FileText size={16} />, shortcut: '⌘H', category: 'Navigation' },
  { id: 'nav-projects', name: 'Go to Projects', description: 'View all projects', icon: <FileText size={16} />, shortcut: '⌘P', category: 'Navigation' },
  { id: 'nav-tasks', name: 'Go to Tasks', description: 'Open task board', icon: <FileText size={16} />, shortcut: '⌘T', category: 'Navigation' },
  
  // Actions
  { id: 'action-new', name: 'New Note', description: 'Create a new note', icon: <Plus size={16} />, shortcut: '⌘N', category: 'Actions' },
  { id: 'action-edit', name: 'Edit Current', description: 'Edit current item', icon: <Edit3 size={16} />, shortcut: '⌘E', category: 'Actions' },
  { id: 'action-delete', name: 'Delete', description: 'Delete selected item', icon: <Trash2 size={16} />, shortcut: '⌘⌫', category: 'Actions' },
  { id: 'action-share', name: 'Share', description: 'Share current item', icon: <Share2 size={16} />, shortcut: '⌘S', category: 'Actions' },
  { id: 'action-export', name: 'Export', description: 'Export data', icon: <Download size={16} />, shortcut: '⌘⇧E', category: 'Actions' },
  
  // Settings
  { id: 'settings-theme', name: 'Toggle Theme', description: 'Switch between light and dark mode', icon: <Moon size={16} />, shortcut: '⌘⇧T', category: 'Settings' },
  { id: 'settings-refresh', name: 'Refresh Data', description: 'Reload all data', icon: <RefreshCw size={16} />, shortcut: '⌘R', category: 'Settings' },
  { id: 'settings-profile', name: 'Open Profile', description: 'View and edit profile', icon: <User size={16} />, shortcut: '⌘⇧P', category: 'Settings' },
  { id: 'settings-preferences', name: 'Preferences', description: 'Open settings panel', icon: <Settings size={16} />, shortcut: '⌘,', category: 'Settings' },
];

const categories = ['Navigation', 'Actions', 'Settings'];

export default function CommandPalette() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCommands = searchQuery
    ? commands.filter(cmd =>
        cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : commands;

  const groupedCommands = categories.reduce((acc, category) => {
    const categoryCommands = filteredCommands.filter(cmd => cmd.category === category);
    if (categoryCommands.length > 0) {
      acc[category] = categoryCommands;
    }
    return acc;
  }, {} as Record<string, CommandItem[]>);

  return (
    <section className={styles.commandPalette}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Command className={styles.icon} size={20} />
          Command Palette
        </h2>
        <p className={styles.subtitle}>
          Quick access to all garden commands and actions
        </p>
      </div>

      <div className={styles.searchBox}>
        <Search className={styles.searchIcon} size={18} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Type a command or search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className={styles.shortcutHint}>⌘K</span>
      </div>

      <div className={styles.categories}>
        {Object.entries(groupedCommands).map(([category, cmds]) => (
          <div key={category} className={styles.category}>
            <div className={styles.categoryHeader}>{category}</div>
            <div className={styles.commands}>
              {cmds.map((cmd) => (
                <div key={cmd.id} className={styles.command}>
                  <div className={styles.commandIcon}>{cmd.icon}</div>
                  <div className={styles.commandInfo}>
                    <div className={styles.commandName}>{cmd.name}</div>
                    <div className={styles.commandDesc}>{cmd.description}</div>
                  </div>
                  {cmd.shortcut && (
                    <span className={styles.commandShortcut}>{cmd.shortcut}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
