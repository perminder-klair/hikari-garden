import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { GardenProvider } from './contexts/GardenContext';

import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import GardenPage from './pages/GardenPage';
import ThoughtsPage from './pages/ThoughtsPage';
import CollectionPage from './pages/CollectionPage';
import WellnessPage from './pages/WellnessPage';
import SystemPage from './pages/SystemPage';
import WorkshopPage from './pages/WorkshopPage';
import ConnectPage from './pages/ConnectPage';

export default function App() {
  return (
    <ThemeProvider>
      <GardenProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="garden" element={<GardenPage />} />
              <Route path="thoughts" element={<ThoughtsPage />} />
              <Route path="collection" element={<CollectionPage />} />
              <Route path="wellness" element={<WellnessPage />} />
              <Route path="system" element={<SystemPage />} />
              <Route path="workshop" element={<WorkshopPage />} />
              <Route path="connect" element={<ConnectPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </GardenProvider>
    </ThemeProvider>
  );
}
