import NavigationBar from "../components/NavigationBar";
import "../styles/dashboard.css";

function Profile() {
  return (
    <div className="app-shell">
      <NavigationBar />
      <main className="dashboard-content">
        <section className="page-header">
          <div>
            <p className="eyebrow">Profile</p>
            <h1>Hello, Alex Morgan</h1>
            <p className="page-copy">
              Review your account details and keep your profile up to date.
            </p>
          </div>

          <div className="profile-summary-card">
            <div>
              <span className="profile-label">Role</span>
              <strong>Product Owner</strong>
            </div>
            <div>
              <span className="profile-label">Team</span>
              <strong>Core QA</strong>
            </div>
            <div>
              <span className="profile-label">Location</span>
              <strong>Remote</strong>
            </div>
          </div>
        </section>

        <section className="detail-panel-grid">
          <article className="detail-panel">
            <h2>Contact</h2>
            <p>Email</p>
            <strong>alex.morgan@bugtrack.app</strong>
            <p>Phone</p>
            <strong>+1 555 012 9834</strong>
          </article>

          <article className="detail-panel">
            <h2>About</h2>
            <p>
              Passionate about building delightful, high-quality products by keeping every bug visible, prioritized,
              and resolved.
            </p>
          </article>

          <article className="detail-panel">
            <h2>Stats</h2>
            <div className="profile-stat-row">
              <span>Projects owned</span>
              <strong>8</strong>
            </div>
            <div className="profile-stat-row">
              <span>Open issues</span>
              <strong>14</strong>
            </div>
            <div className="profile-stat-row">
              <span>Resolution rate</span>
              <strong>92%</strong>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default Profile;
