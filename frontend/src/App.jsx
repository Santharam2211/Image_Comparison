import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ComparisonPage from './components/ComparisonPage';
import TimerPage from './components/TimerPage';
import Round2Page from './components/Round2Page';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cards" element={<ComparisonPage />} />
          <Route path="/timer" element={<TimerPage />} />
          <Route path="/round2" element={<Round2Page />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
