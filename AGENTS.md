# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev` (Vite)
- **Build:** `npm run build` (runs `tsc -b && vite build`, output in `dist/`)
- **Lint:** `npm run lint` (ESLint with TypeScript + React hooks/refresh plugins)
- **Preview production build:** `npm run preview`
- **Docker:** `docker compose up --build` (serves on port 8080 via nginx)

## Architecture

React 19 + TypeScript SPA using Vite, styled with CSS Modules. No test framework is configured.

**Routing:** react-router-dom with a shared `Layout` wrapper. Routes defined in `App.tsx`:
- `/` (HomePage), `/garden`, `/thoughts`, `/collection`, `/wellness`, `/system`, `/workshop`, `/connect`

**Global state:** Two React context providers wrap the app in `App.tsx`:
- `ThemeProvider` — dark/light theme, zen mode, background override
- `GardenProvider` — garden-specific state

**Component organization:**
- `components/layout/` — Layout shell (Header, Footer, Background, ScrollToTop)
- `components/sections/` — Page content sections (each typically has a `.tsx` + `.module.css` pair)
- `components/widgets/` — Small interactive widgets (clock, weather, mood toggle, etc.)
- `pages/` — Route pages that compose sections together

**Data layer:** Static data arrays in `src/data/` (tracks, books, quotes, etc.). Types defined in `src/types/index.ts`.

**Custom hooks:** `src/hooks/` — UI utilities (intersection observer, parallax, mouse trail, keyboard shortcuts, weather, intervals).

**Deployment:** Multi-stage Docker build (node:20-alpine -> nginx:alpine). Nginx config handles SPA fallback (`try_files $uri /index.html`).
