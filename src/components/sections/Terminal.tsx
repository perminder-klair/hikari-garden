import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Send, Trash2, Copy, Download } from 'lucide-react';
import styles from './Terminal.module.css';

interface Command {
  id: string;
  input: string;
  output: string;
  timestamp: Date;
  type: 'input' | 'output' | 'error';
}

const welcomeMessage = `Welcome to Hikari Terminal v2.5.0
Type 'help' for available commands

`;

const commands: Record<string, string> = {
  help: `Available commands:
  help         Show this help message
  clear        Clear the terminal
  date         Show current date and time
  whoami       Display user info
  projects     List active projects
  status       Show system status
  garden       Show garden statistics
  echo [text]  Print text to terminal
  weather      Show current weather (simulated)
  fortune      Get a random quote`,
  whoami: `User: Parm (parminderklair)
Role: Lead Developer
Location: Birmingham, UK
Status: Online`,
  projects: `Active Projects:
  • Fizzy - Next.js SaaS platform
  • Thoth - AI content creation
  • Hikari Garden - Personal digital space
  • Mignomic - AI immigration platform`,
  status: `System Status:
  OS: Linux x86_64
  Node: v20.11.0
  Docker: Running
  Uptime: 15 days, 4 hours
  Load: 0.45, 0.38, 0.42`,
  garden: `Garden Statistics:
  Sections: 65+
  Components: 120+
  Lines of Code: ~25,000
  Last Deploy: 2026-03-14
  Status: Growing 🌱`,
};

export default function Terminal() {
  const [history, setHistory] = useState<Command[]>([
    { id: '0', input: '', output: welcomeMessage, timestamp: new Date(), type: 'output' },
  ]);
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const args = trimmed.split(' ');
    const command = args[0];

    let output = '';
    let type: 'output' | 'error' = 'output';

    switch (command) {
      case '':
        output = '';
        break;
      case 'clear':
        setHistory([{ id: Date.now().toString(), input: '', output: '', timestamp: new Date(), type: 'output' }]);
        return;
      case 'date':
        output = new Date().toString();
        break;
      case 'echo':
        output = args.slice(1).join(' ') || '';
        break;
      case 'weather':
        output = `Current Weather (Birmingham):
  Temperature: 12°C
  Condition: Partly Cloudy
  Humidity: 78%
  Wind: 8 km/h SW`;
        break;
      case 'fortune':
        const fortunes = [
          "The best time to plant a tree was 20 years ago. The second best time is now.",
          "Code is like humor. When you have to explain it, it's bad.",
          "First, solve the problem. Then, write the code.",
          "Simplicity is the soul of efficiency.",
          "Make it work, make it right, make it fast.",
        ];
        output = fortunes[Math.floor(Math.random() * fortunes.length)];
        break;
      default:
        if (commands[command]) {
          output = commands[command];
        } else {
          output = `Command not found: ${command}\nType 'help' for available commands`;
          type = 'error';
        }
    }

    const newCommand: Command = {
      id: Date.now().toString(),
      input: cmd,
      output,
      timestamp: new Date(),
      type,
    };

    setHistory(prev => [...prev, newCommand]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    executeCommand(input);
    setInput('');
    setHistoryIndex(-1);
  };

  const clearTerminal = () => {
    setHistory([{ id: Date.now().toString(), input: '', output: welcomeMessage, timestamp: new Date(), type: 'output' }]);
  };

  const copyOutput = () => {
    const text = history.map(h => h.output).join('\n');
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className={styles.terminal} id="terminal">
      <div className={styles.header}>
        <div className={styles.icon}>
          <TerminalIcon size={28} />
        </div>
        <h2 className={styles.title}>Terminal</h2>
        <p className={styles.subtitle}>Interactive command interface</p>
      </div>

      <div className={styles.terminalWindow}>
        <div className={styles.terminalHeader}>
          <div className={styles.windowControls}>
            <span className={styles.dot} style={{ background: '#ff5f56' }} />
            <span className={styles.dot} style={{ background: '#ffbd2e' }} />
            <span className={styles.dot} style={{ background: '#27c93f' }} />
          </div>
          <span className={styles.terminalTitle}>hikari@ronin:~</span>
          <div className={styles.terminalActions}>
            <button onClick={copyOutput} title="Copy output">
              <Copy size={14} />
            </button>
            <button onClick={clearTerminal} title="Clear">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className={styles.terminalBody} ref={terminalRef}>
          {history.map((cmd) => (
            <div key={cmd.id} className={styles.commandBlock}>
              {cmd.input && (
                <div className={styles.inputLine}>
                  <span className={styles.prompt}>➜</span>
                  <span className={styles.command}>{cmd.input}</span>
                </div>
              )}
              {cmd.output && (
                <pre className={`${styles.output} ${styles[cmd.type]}`}>
                  {cmd.output}
                </pre>
              )}
            </div>
          ))}
        </div>

        <form className={styles.inputArea} onSubmit={handleSubmit}>
          <span className={styles.prompt}>➜</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command..."
            className={styles.input}
            autoFocus
          />
          <button type="submit" className={styles.sendBtn}>
            <Send size={14} />
          </button>
        </form>
      </div>

      <div className={styles.shortcuts}>
        <span>Shortcuts:</span>
        <kbd>Enter</kbd> Execute
        <kbd>Esc</kbd> Focus
        <kbd>clear</kbd> Clear screen
      </div>
    </section>
  );
}
