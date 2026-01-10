import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LessonPage from './pages/LessonPage';
import GamesPage from './pages/GamesPage';
import GameBubbles from './components/games/GameBubbles';
import TypingTestPage from './pages/TypingTestPage';
import StatisticsPage from './pages/StatisticsPage';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useUser();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Modal Wrapper for Games
const GameModal = ({ children }) => {
  const [redirect, setRedirect] = useState(false);
  if (redirect) return <Navigate to="/games" />;

  // Clone child to pass onClose
  return React.cloneElement(children, { onClose: () => setRedirect(true) });
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/study" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/lesson/:lessonId" element={
        <ProtectedRoute>
          <LessonPage />
        </ProtectedRoute>
      } />

      {/* Games */}
      <Route path="/games" element={
        <ProtectedRoute>
          <GamesPage />
        </ProtectedRoute>
      } />
      <Route path="/games/bubbles" element={
        <ProtectedRoute>
          <GameModal><GameBubbles /></GameModal>
        </ProtectedRoute>
      } />

      {/* Test */}
      <Route path="/test" element={
        <ProtectedRoute>
          <TypingTestPage />
        </ProtectedRoute>
      } />

      <Route path="/stats" element={
        <ProtectedRoute>
          <StatisticsPage />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/study" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

export default App;
