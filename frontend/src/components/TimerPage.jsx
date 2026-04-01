import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoUrl from '../assets/DigiFlash_Logo.png';

const TimerPage = () => {
  const navigate = useNavigate();
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null); // in seconds
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    if (timeLeft === null || (!isRunning && timeLeft <= 0)) {
      const totalSeconds = parseInt(minutes || 0) * 60 + parseInt(seconds || 0);
      if (totalSeconds > 0) {
        setTimeLeft(totalSeconds);
        setIsRunning(true);
      }
    } else if (timeLeft > 0) {
      setIsRunning(true);
    }
  };

  const formatTime = (time) => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="home-container">
      <div className="global-header">
        <img src={logoUrl} alt="Logo" className="global-logo" />
        <div className="header-text-center">
          <h1>Welcome to DigiFest 2K26</h1>
          <h2>WebNova</h2>
        </div>
      </div>

      <div className="glass-card main-content" style={{ textAlign: "center" }}>
        <h3 className="title">Timer Control</h3>

        {timeLeft === null || (!isRunning && timeLeft <= 0) ? (
          <div className="timer-setup">
            <div className="input-row" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <div className="input-group">
                <label>Minutes</label>
                <input
                  type="number"
                  min="0"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  style={{ width: '100px', textAlign: 'center' }}
                />
              </div>
              <div className="input-group">
                <label>Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  style={{ width: '100px', textAlign: 'center' }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="timer-display">
            <h1 style={{ fontSize: '5rem', fontFamily: 'monospace', color: timeLeft <= 10 ? '#ef4444' : '#10b981' }}>
              {formatTime(timeLeft)}
            </h1>
          </div>
        )}

        <div className="timer-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <button className="btn btn-primary" onClick={handleStart} disabled={isRunning && timeLeft > 0}>
            Start
          </button>
          <button className="btn btn-secondary" onClick={() => setIsRunning(false)} disabled={!isRunning}>
            Pause
          </button>
          <button className="btn btn-danger" onClick={() => { setIsRunning(false); setTimeLeft(null); setMinutes(0); setSeconds(0); }}>
            Reset
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerPage;
