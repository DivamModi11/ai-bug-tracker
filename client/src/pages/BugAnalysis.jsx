import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import "../styles/dashboard.css";
import "../styles/bug-analysis.css";

function BugAnalysis() {
  const { bugId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/bugs/${bugId}/analyze`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app-shell">
        <NavigationBar />
        <div className="analysis-page">
          <p className="analysis-loading">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-shell">
        <NavigationBar />
        <div className="analysis-page">
          <p className="analysis-error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <NavigationBar />
      <div className="analysis-page">
        <div className="analysis-wrapper">
          <button
            type="button"
            className="hero-button btn-secondary analysis-back"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <header className="analysis-header">
            <p className="eyebrow">AI insights</p>
            <h1>AI Bug Analysis</h1>
          </header>

          <article className="analysis-container">
            <div className="analysis-bug-meta">
              <h2>{data.title}</h2>
              <p>{data.description}</p>
            </div>

            <section className="analysis-section">
              <h3>Root cause</h3>
              <p>{data.analysis.rootCause}</p>
            </section>

            <section className="analysis-section">
              <h3>Suggested fix</h3>
              <p>{data.analysis.suggestedFix}</p>
            </section>

            <div className="analysis-meta-grid">
              <div className="analysis-meta-item">
                <h3>Priority</h3>
                <p>{data.analysis.priority}</p>
              </div>
              <div className="analysis-meta-item">
                <h3>Complexity</h3>
                <p>{data.analysis.complexity}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

export default BugAnalysis;
