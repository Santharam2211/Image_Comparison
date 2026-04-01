import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoUrl from '../assets/DigiFlash_Logo.png';

const API_BASE_URL = 'http://localhost:8000/api';

const Round2Page = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRound2 = async () => {
      try {
        const resp = await axios.get(`${API_BASE_URL}/round2`);
        setAssignments(resp.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRound2();
  }, []);

  return (
    <div className="home-container">
      <div className="global-header">
        <img src={logoUrl} alt="Logo" className="global-logo" />
        <div className="header-text-center">
          <h1>Welcome to DigiFest 2K26</h1>
          <h2>WebNova - Round 2 Assignments</h2>
        </div>
        <div style={{ position: 'absolute', right: '2rem', top: '1rem', display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>Home</button>
        </div>
      </div>

      <div className="glass-card main-content" style={{ marginTop: '2rem', maxWidth: '800px' }}>
        <h3 className="title" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Top Teams Selected</h3>

        {loading ? (
          <p>Loading assignments...</p>
        ) : assignments.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ minWidth: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'white' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.2)' }}>
                  <th style={{ padding: '1rem' }}>Team Name</th>
                  <th style={{ padding: '1rem' }}>Assigned Topic</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{item["Team Name"]}</td>
                    <td style={{ padding: '1rem', color: '#60a5fa' }}>{item["Topic"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: '#ef4444' }}>Not enough comparison data available yet to generate Round 2 assignments.</p>
        )}
      </div>
    </div>
  );
};

export default Round2Page;
