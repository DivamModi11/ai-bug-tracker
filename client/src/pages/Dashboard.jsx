import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import "../styles/dashboard.css";
import axios from "axios";
import { useEffect, useState } from "react";

function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalBugs: 0,
    openBugs: 0,
  });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <NavigationBar />
      <main className="dashboard-content">
        <section className="page-header">
          <div>
            <p className="eyebrow">Overview</p>
            <h1>Bug tracker dashboard</h1>
            <p className="page-copy">
              Monitor your project health, track open issues, and move work
              forward with a clear overview of your team&apos;s progress.
            </p>
          </div>
        </section>

        <section className="stats-grid" aria-label="Dashboard statistics">
          <article className="stat-card">
            <span>Total projects</span>
            <strong>{stats.totalProjects}</strong>
            <p>Active initiatives across your workspace.</p>
          </article>
          <article className="stat-card">
            <span>Total bugs</span>
            <strong>{stats.totalBugs}</strong>
            <p>All reported issues in the system.</p>
          </article>
          <article className="stat-card">
            <span>Open bugs</span>
            <strong>{stats.openBugs}</strong>
            <p>Issues still open or in progress.</p>
          </article>
        </section>

        <section className="hero-card">
          <div className="hero-copy">
            <h2>Fast, clear insights for every release cycle</h2>
            <p>
              Keep the most important metrics in view and stay ahead of issues
              before they impact your next sprint.
            </p>
            <div className="hero-actions">
              <button
                className="hero-button"
                type="button"
                onClick={() => navigate("/projects")}
              >
                View Projects
              </button>
              
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
