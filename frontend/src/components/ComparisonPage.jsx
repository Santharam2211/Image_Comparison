import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoUrl from '../assets/DigiFlash_Logo.png';
import ClothShopImg from '../assets/ClothShop.png';
import FoodieImg from '../assets/Foodie.png';
import MusicifyImg from '../assets/Musicify.png';

const API_BASE_URL = 'http://localhost:8000/api';

const imageMap = {
  ClothShop: ClothShopImg,
  Foodie: FoodieImg,
  Musicify: MusicifyImg
};

const ComparisonCard = ({ category, teamName }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const predefinedImage = imageMap[category];

  const handleUpload = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null);
    }
  };

  const handleCompare = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('team_name', teamName);
    formData.append('event_name', 'WebNova'); // Hardcoded as per prompt
    formData.append('category', category);
    formData.append('file', file);

    try {
      const resp = await axios.post(`${API_BASE_URL}/compare`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (resp.data.error) {
        alert(resp.data.error);
      } else {
        setResult(resp.data);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to compare images. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="compare-card glass-card">
      <h3 className="card-title">{category}</h3>
      <div className="image-comparison-area">
        <div className="image-box">
          <h4>Reference Image</h4>
          <img src={predefinedImage} alt={`${category} Reference`} />
        </div>
        <div className="image-box">
          <h4>Uploaded Image</h4>
          {preview ? (
            <img src={preview} alt="Uploaded" />
          ) : (
            <div className="placeholder-box">No Image</div>
          )}
        </div>
      </div>

      <div className="card-actions">
        <label className="btn btn-secondary">
          Upload
          <input type="file" hidden onChange={handleUpload} accept="image/*" />
        </label>
        <button
          className="btn btn-primary"
          onClick={handleCompare}
          disabled={!file || loading}
        >
          {loading ? 'Comparing...' : 'Compare'}
        </button>
      </div>

      {result && (
        <div className={`result-box ${result.similarity >= 80 ? 'high-score' : 'low-score'}`}>
          <p>Similarity: <strong>{result.similarity}%</strong></p>
          {/* <p>Submission Time: <strong>{result.system_time}</strong></p> */}
        </div>
      )}
    </div>
  );
};

const ComparisonPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const teamName = state.teamName || 'Guest Team';

  const categories = ['ClothShop', 'Foodie', 'Musicify'];

  const handleDownloadExcel = () => {
    window.location.href = `${API_BASE_URL}/download-excel`;
  };

  return (
    <div className="comparison-container">
      {/* Top Left Logo and Headers */}
      <div className="global-header">
        <img src={logoUrl} alt="Logo" className="global-logo" />
        <div className="header-text-center">
          <h1>Welcome to DigiFest 2K26</h1>
          <h2>WebNova</h2>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
          <button className="btn btn-success" onClick={handleDownloadExcel}>Download Excel</button>
        </div>
      </div>

      <div className="team-banner">
        <h2>Team: {teamName}</h2>
      </div>

      <div className="cards-grid">
        {categories.map((cat) => (
          <ComparisonCard
            key={cat}
            category={cat}
            teamName={teamName}
          />
        ))}
      </div>
    </div>
  );
};

export default ComparisonPage;
