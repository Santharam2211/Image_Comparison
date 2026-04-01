import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoUrl from '../assets/DigiFlash_Logo.png';

const Home = () => {
  const [teamName, setTeamName] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (!teamName) {
      alert("Please enter Team Name");
      return;
    }
    navigate('/cards', { state: { teamName } });
  };

  return (
    <div className="home-container">
      {/* Top Left Logo and Headers */}
      <div className="global-header">
        {/* Top Left Logo */}
        <img src={logoUrl} alt="Logo" className="global-logo" />

        <div className="header-text-center">
          <h1>Welcome to DigiFest 2K26</h1>
          <h2>WebNova</h2>
        </div>

        {/* Timer button right top corner */}
        <div style={{ position: 'absolute', right: '2rem', top: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/timer')}>
            Timer Setup
          </button>
        </div>
      </div>

      <div className="glass-card main-content" style={{ marginTop: '2rem' }}>
        <h3 className="title">Registration</h3>

        <div className="input-group">
          <label>Team Name</label>
          <input
            type="text"
            placeholder="Enter your team name..."
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)} required
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button className="btn btn-primary" onClick={handleNext} style={{ flex: 1 }}>
            Go To Round 1
          </button>
          <button className="btn btn-success" onClick={() => navigate('/round2')} style={{ flex: 1 }}>
            Go to Round 2
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
