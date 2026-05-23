import { NavLink, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function NavigationBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="topnav">
      <div className="topnav-brand">
        <div className="brand-icon" aria-hidden="true">
          🐞
        </div>
        <div>
          <p className="brand-title">BugTrack</p>
          <p className="brand-subtitle">AI Bug Tracker</p>
        </div>
      </div>

      <nav className="topnav-links" aria-label="Main navigation">
        <NavLink
          className={({ isActive }) =>
            isActive ? "topnav-link active" : "topnav-link"
          }
          to="/dashboard"
        >
          Dashboard
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "topnav-link active" : "topnav-link"
          }
          to="/projects"
        >
          Projects
        </NavLink>
        
      </nav>

      <div className="topnav-actions">
        <button className="topnav-logout" onClick={handleLogout} type="button">
          Log out
        </button>
      </div>
    </header>
  );
}

export default NavigationBar;
