import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import "../styles/dashboard.css";
import "../styles/project-details.css";

function priorityClass(priority) {
  const key = (priority || "").toLowerCase();
  if (key === "high") return "priority-high";
  if (key === "low") return "priority-low";
  return "priority-medium";
}

function statusClass(status) {
  if (status === "In Progress") return "status-in-progress";
  if (status === "Resolved") return "status-resolved";
  return "status-open";
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "team", label: "Team" },
  { id: "add-bug", label: "Report bug" },
  { id: "bugs", label: "Bugs" },
];

function ProjectDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("overview");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [bugs, setBugs] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [members, setMembers] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [commentText, setCommentText] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState("");

  const fetchBugs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bugs/project/${id}`,
        {
          params: { search, status },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBugs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/bugs`,
        {
          title,
          description,
          priority,
          projectId: id,
          assignedTo,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setDescription("");
      fetchBugs();
      setActiveTab("bugs");
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (bugId, newStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/bugs/${bugId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBugs();
    } catch (err) {
      console.log(err);
    }
  };

  const addMember = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/projects/${id}/add-member`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Member added");
      fetchMembers();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/projects/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMembers(res.data.members || []);
      if (res.data.name) setProjectName(res.data.name);
      if (res.data.description) setProjectDescription(res.data.description);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchMembers();
  }, []);

  const handleAddComment = async (bugId) => {
    try {
      setLoading((prev) => ({ ...prev, [bugId]: true }));
      setError("");
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bugs/${bugId}/comment`,
        { text: commentText[bugId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBugs(bugs.map((bug) => (bug._id === bugId ? res.data : bug)));
      setCommentText((prev) => ({ ...prev, [bugId]: "" }));
    } catch (err) {
      console.log(err.response?.data);
      console.log(err);
    } finally {
      setLoading((prev) => ({ ...prev, [bugId]: false }));
    }
  };

  const navigate = useNavigate();

  const openBugCount = bugs.filter(
    (b) => b.status === "Open" || b.status === "In Progress"
  ).length;

  return (
    <div className="app-shell">
      <NavigationBar />
      <main className="project-page tabs-page">
        <header className="project-page-header">
          <p className="eyebrow">Project</p>
          <h1>{projectName || "Project details"}</h1>
        </header>

        <div className="tabs-shell">
          <div className="tabs-header" role="tablist" aria-label="Project sections">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {tab.id === "bugs" && (
                  <span className="tab-count">{bugs.length}</span>
                )}
                {tab.id === "team" && (
                  <span className="tab-count">{members.length}</span>
                )}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="tab-panel" role="tabpanel">
              <h2 style={{ marginTop: 0 }}>Project info</h2>
              <p className="section-desc">
                {projectDescription ||
                  "Overview of this project. Description loads from your project record."}
              </p>
              <div className="overview-stats">
                <div className="overview-stat">
                  <span>Total bugs</span>
                  <strong>{bugs.length}</strong>
                </div>
                <div className="overview-stat">
                  <span>Open / in progress</span>
                  <strong>{openBugCount}</strong>
                </div>
                <div className="overview-stat">
                  <span>Team members</span>
                  <strong>{members.length}</strong>
                </div>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="tab-panel" role="tabpanel">
              <h2 style={{ marginTop: 0 }}>Team members</h2>
              <p className="section-desc">Add collaborators to assign bugs.</p>
              <div className="add-member-row">
                <label className="field-group">
                  <span>Add member</span>
                  <select
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  >
                    <option value="">Select user</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="hero-button" type="button" onClick={addMember}>
                  Add member
                </button>
              </div>
              <div className="member-grid" style={{ marginTop: "20px" }}>
                {members.length > 0 ? (
                  members.map((member) => (
                    <div key={member._id} className="member-card">
                      <strong>{member.name}</strong>
                      <span>{member.email}</span>
                    </div>
                  ))
                ) : (
                  <p className="empty-state">No members added</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "add-bug" && (
            <div className="tab-panel" role="tabpanel">
              <h2 style={{ marginTop: 0 }}>Report a bug</h2>
              <p className="section-desc">
                Log a new issue for this project and assign it to a team member.
              </p>
              <form className="bug-form" onSubmit={handleSubmit}>
                <label className="field-group">
                  <span>Title</span>
                  <input
                    placeholder="Bug title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </label>
                <label className="field-group">
                  <span>Description</span>
                  <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </label>
                <div className="form-row-2">
                  <label className="field-group">
                    <span>Priority</span>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </label>
                  <label className="field-group">
                    <span>Assign to</span>
                    <select
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                    >
                      <option value="">Select member</option>
                      {members.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <button className="hero-button" type="submit">
                  Add bug
                </button>
              </form>
            </div>
          )}

          {activeTab === "bugs" && (
            <div className="tab-panel" role="tabpanel">
              <h2 style={{ marginTop: 0 }}>Existing bugs</h2>
              <div className="filter-bar">
                <label className="field-group">
                  <span>Search</span>
                  <input
                    placeholder="Search bugs"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
                <label className="field-group">
                  <span>Status</span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="">All</option>
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </label>
                <div className="filter-actions">
                  <button
                    className="hero-button"
                    type="button"
                    onClick={fetchBugs}
                  >
                    Apply
                  </button>
                </div>
              </div>

              {error && <p className="error-banner">{error}</p>}

              <div className="bug-list" style={{ marginTop: "24px" }}>
                {bugs.length === 0 ? (
                  <p className="empty-state">No bugs match your filters.</p>
                ) : (
                  bugs.map((bug) => (
                    <article key={bug._id} className="bug-card">
                      <div className="bug-card-header">
                        <h3>{bug.title}</h3>
                        <div className="bug-card-badges">
                          <span
                            className={`badge ${priorityClass(bug.priority)}`}
                          >
                            {bug.priority}
                          </span>
                          <span className={`badge ${statusClass(bug.status)}`}>
                            {bug.status}
                          </span>
                        </div>
                      </div>

                      <div className="bug-card-body">
                        <p>{bug.description}</p>
                      </div>

                      <div className="bug-assigned">
                        <span className="bug-assigned-label">Assigned to</span>
                        <span className="bug-assigned-name">
                          {bug.assignedTo?.name || "Unassigned"}
                        </span>
                      </div>

                      <div className="bug-card-actions">
                        <select
                          className="status-select"
                          value={bug.status}
                          onChange={(e) =>
                            updateStatus(bug._id, e.target.value)
                          }
                          aria-label={`Update status for ${bug.title}`}
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                        <button
                          className="hero-button btn-analyze"
                          type="button"
                          onClick={() =>
                            navigate(`/bug/${bug._id}/analysis`)
                          }
                        >
                          Analyze
                        </button>
                        <button
                          className="hero-button btn-danger"
                          type="button"
                          onClick={async () => {
                            await axios.delete(
                              `${import.meta.env.VITE_API_URL}/api/bugs/${bug._id}`,
                              {
                                headers: { Authorization: `Bearer ${token}` },
                              }
                            );
                            fetchBugs();
                          }}
                        >
                          Delete
                        </button>
                      </div>

                      <div className="comments-section">
                        <h4>Comments</h4>
                        <div className="comment-list">
                          {bug.comments?.length ? (
                            bug.comments.map((comment) => (
                              <div key={comment._id} className="comment-item">
                                <b>{comment.user?.name}</b>
                                <p>{comment.text}</p>
                              </div>
                            ))
                          ) : (
                            <p className="empty-state">No comments yet.</p>
                          )}
                        </div>
                        <div className="comment-form">
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            value={commentText[bug._id] || ""}
                            onChange={(e) =>
                              setCommentText({
                                ...commentText,
                                [bug._id]: e.target.value,
                              })
                            }
                          />
                          <button
                            className="hero-button"
                            type="button"
                            disabled={loading[bug._id]}
                            onClick={() => handleAddComment(bug._id)}
                          >
                            {loading[bug._id] ? "Sending..." : "Send"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ProjectDetails;
