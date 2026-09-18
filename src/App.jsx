import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import { GuestOnly, RequireAuth } from './components/AuthGuard';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Landing from './pages/Landing';
import ActiveChat from './pages/ActiveChat';
import Explore from './pages/Explore';
import Files from './pages/Files';
import Projects from './pages/Projects';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';

function applyTheme(theme) {
  const selected = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = selected;
  document.documentElement.style.colorScheme = selected;
  localStorage.setItem('sekale-theme', selected);
}

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('sekale-theme') || 'dark';
    applyTheme(savedTheme);
  }, []);

  return (
    <Routes>
      {/* Public auth routes — the root page is the login screen */}
      <Route path="/" element={<GuestOnly><SignIn /></GuestOnly>} />
      <Route path="/signin" element={<GuestOnly><SignIn /></GuestOnly>} />
      <Route path="/signup" element={<GuestOnly><SignUp /></GuestOnly>} />

      {/* Protected app */}
      <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
        <Route path="/home" element={<Landing />} />
        <Route path="/chat" element={<ActiveChat />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/files" element={<Files />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/pricing" element={<Pricing />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App
