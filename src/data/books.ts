import type { Book } from '../types';

export const books: Book[] = [
  { title: 'The Almanack of Naval Ravikant', author: 'Eric Jorgenson', status: 'reading', progress: 65 },
  { title: 'Atomic Habits', author: 'James Clear', status: 'completed', progress: 100 },
  { title: 'The Creative Act', author: 'Rick Rubin', status: 'queued', progress: 0 },
  { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', status: 'reading', progress: 30 },
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', status: 'queued', progress: 0 },
  { title: 'Deep Work', author: 'Cal Newport', status: 'reading', progress: 85 },
];
