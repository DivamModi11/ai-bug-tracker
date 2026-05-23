import React, { useEffect, useState } from "react";
import axios from "axios";
import NavigationBar from "../components/NavigationBar";
import "../styles/dashboard.css";
import { Link } from "react-router-dom";

function Projects() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("list");

  const token = localStorage.getItem("token");

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/projects`,
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      setDescription("");
      fetchProjects();
      setActiveTab("list");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (e, projectId) => {
    e.preventDefault();
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="app-shell">
      <NavigationBar />
      <main className="dashboard-content tabs-page">
        <section className="page-header">
          <div>
            <p className="eyebrow">Projects</p>
            <h1>Projects workspace</h1>
            <p className="page-copy">
              Manage your active initiatives and keep every project aligned with
              the bug tracker workflow.
            </p>
          </div>
        </section>

        <div className="tabs-shell">
          <div className="tabs-header" role="tablist" aria-label="Projects sections">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "list"}
              className={`tab-btn ${activeTab === "list" ? "active" : ""}`}
              onClick={() => setActiveTab("list")}
            >
              My projects
              <span className="tab-count">{projects.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "create"}
              className={`tab-btn ${activeTab === "create" ? "active" : ""}`}
              onClick={() => setActiveTab("create")}
            >
              Create project
            </button>
          </div>

          {activeTab === "list" && (
            <div className="tab-panel" role="tabpanel">
              {projects.length ? (
                <section className="project-grid">
                  {projects.map((project) => (
                    <article key={project._id} className="project-card">
                      <div className="project-card-inner">
                        <div className="badge badge-active">Active</div>
                        <h3>{project.name}</h3>
                        <p>{project.description}</p>
                        <div className="project-card-footer">
                          <Link
                            to={`/projects/${project._id}`}
                            className="card-link-btn"
                          >
                            Open project →
                          </Link>
                          <button
                            className="hero-button btn-danger"
                            type="button"
                            onClick={(e) => handleDelete(e, project._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </section>
              ) : (
                <div className="empty-state-wrap">
                  <p className="empty-state" style={{ marginBottom: "16px" }}>
                    No projects yet. Create your first project to get started.
                  </p>
                  <button
                    className="hero-button"
                    type="button"
                    onClick={() => setActiveTab("create")}
                  >
                    Create project
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "create" && (
            <div className="tab-panel" role="tabpanel">
              <h2 style={{ marginTop: 0 }}>Create a new project</h2>
              <p className="page-copy" style={{ marginBottom: "24px" }}>
                Set up a workspace for your team to track bugs and collaborate.
              </p>
              <form onSubmit={handleSubmit} className="project-form">
                <label className="field-group">
                  <span>Name</span>
                  <input
                    type="text"
                    placeholder="Project name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </label>
                <label className="field-group">
                  <span>Description</span>
                  <textarea
                    placeholder="Describe the project"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </label>
                <button className="hero-button" type="submit">
                  Create project
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Projects;
