import React, { useState } from "react";
import "../styles/login.css";
import { loginUser } from "../api/authApi";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await loginUser({ email, password });
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-page">
      <aside className="auth-hero" aria-hidden="false">
        <div className="auth-hero-content">
          <span className="auth-hero-badge">AI Bug Tracker</span>
          <h1>Track bugs. Ship with confidence.</h1>
          <p>
            A modern workspace for teams to report, prioritize, and resolve
            issues—with AI-powered analysis built in.
          </p>
          <ul className="auth-features">
            <li>Real-time project dashboards</li>
            <li>Team collaboration & assignments</li>
            <li>AI root-cause analysis</li>
          </ul>
        </div>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="auth-logo" aria-hidden="true">
              🐞
            </div>
            <div className="auth-brand-text">
              <h2>Welcome back</h2>
              <p>Sign in to your BugTrack account</p>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="input-group">
              <span>Email</span>
              <input
                type="email"
                value={email}
                placeholder="you@company.com"
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </label>

            <label className="input-group">
              <span>Password</span>
              <input
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </label>

            {error && <div className="form-error">{error}</div>}

            <button className="submit-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              New here? <Link to="/registration">Create an account</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
