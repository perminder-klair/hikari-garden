# Hikari Garden

A digital garden — a quiet corner of the internet where ideas grow slowly, thoughts settle like dust in sunlight, and presence matters more than performance.

Built with React 19, TypeScript, and Vite.

## Pages

- **Home** — Hero section, stats, features overview, quotes, and growth rings
- **Garden** — Seeds timeline, garden log, plant tracker, focus forest, and more
- **Thoughts** — Thought stream, daily word, writing desk, dream journal, memory palace
- **Collection** — Reading list, book nook, music garden, watch list, podcast garden, gaming shelf
- **Wellness** — Habit tracker, focus timer, meditation space, sleep tracker, workout log, health vault
- **System** — System dashboard, terminal, code snippets, API playground, dev tracker
- **Workshop** — Project showcase, skill tree, idea garden, tool shed, project lab
- **Connect** — Agent network, social garden, collaboration space, connection web

## Features

- Dark/light theme toggle
- Zen mode for distraction-free browsing
- Mood-based background gradients
- Mouse trail and click burst effects
- Ambient audio visualizer
- Keyboard shortcuts (including Konami code easter egg)
- Random garden event notifications
- Seasonal cycling on the hero card

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build locally |

## Docker

```bash
docker compose up --build
```

Serves the production build on `http://localhost:8080` via nginx.

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Bundler:** Vite 7
- **Routing:** react-router-dom
- **Icons:** lucide-react
- **Styling:** CSS Modules
- **Deployment:** Docker (nginx)
