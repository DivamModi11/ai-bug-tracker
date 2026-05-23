import React, { useState } from "react";
import "../styles/login.css";
import { registerUser } from "../api/authApi";
import { Link, useNavigate } from "react-router-dom";

function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await registerUser({ name, email, password });
      console.log(response.data);
      navigate("/");
      setIsSubmitting(false);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setIsSubmitting(false);
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-page">
      <aside className="auth-hero">
        <div className="auth-hero-content">
          <span className="auth-hero-badge">Get started</span>
          <h1>Join your team on BugTrack</h1>
          <p>
            Create an account to manage projects, report bugs, and unlock
            AI-assisted debugging for your entire workflow.
          </p>
          <ul className="auth-features">
            <li>Free to set up in seconds</li>
            <li>Secure authentication</li>
            <li>Works on any device</li>
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
              <h2>Create account</h2>
              <p>Start tracking bugs today</p>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="input-group">
              <span>Name</span>
              <input
                type="text"
                value={name}
                placeholder="Your full name"
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </label>

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
                autoComplete="new-password"
              />
            </label>

            <label className="input-group">
              <span>Confirm password</span>
              <input
                type="password"
                value={confirmPassword}
                placeholder="••••••••"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </label>

            {error && <div className="form-error">{error}</div>}

            <button className="submit-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already registered? <Link to="/">Sign in</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Registration;
