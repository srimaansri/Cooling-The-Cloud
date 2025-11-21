import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LandingPage from './pages/LandingPage';
import DemoLayout from './layouts/DemoLayout';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import RealTime from './pages/RealTime';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Demo Dashboard Routes */}
        <Route path="/demo" element={<DemoLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="history" element={<History />} />
          <Route path="real-time" element={<RealTime />} />
        </Route>

        {/* Redirect any unknown routes to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;