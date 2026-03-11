export const terminalLines = [
  {
    type: 'command' as const,
    prompt: '$',
    text: 'garden --status',
  },
  {
    type: 'output' as const,
    text: 'Digital Garden v2.4.1 | Status: THRIVING\nLast commit: 15 minutes ago | Seeds planted: 47',
  },
  {
    type: 'command' as const,
    prompt: '$',
    text: 'ls -la thoughts/',
  },
  {
    type: 'output' as const,
    text: 'drwxr-xr-x  4 hikari hikari  4096 Mar 11 15:41 .\ndrwxr-xr-x 12 hikari hikari  4096 Mar 11 12:00 ..\n-rw-r--r--  1 hikari hikari   284 Mar 11 14:32 code-as-poetry.md\n-rw-r--r--  1 hikari hikari   156 Mar 11 13:15 self-hosting.txt\n-rw-r--r--  1 hikari hikari   412 Mar 11 11:20 ai-agents-future.md',
  },
  {
    type: 'command' as const,
    prompt: '$',
    text: 'cat current_mood.txt',
  },
  {
    type: 'output' as const,
    text: '"Late afternoon light. Coffee cooling. Code compiling.\nThe garden grows in silence."',
  },
];

export const typingCommands = [
  'garden --water',
  'thoughts --new',
  'agents --status',
  'mood --update',
  'seeds --list',
];
