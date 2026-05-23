import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import Login from './pages/Login';
import Registration from './pages/Registration';
import Dashboard from './pages/dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Projects from './pages/Projects.jsx';
import ProjectDetails from "./pages/ProjectDetails";
import BugAnalysis from "./pages/BugAnalysis";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/registration" element={<Registration />} />


        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }/>
        <Route path="/projects" element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        } />
        <Route path="/projects/:id" element={<ProjectDetails />} />

        <Route path="/bug/:bugId/analysis" element={<BugAnalysis/>} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
