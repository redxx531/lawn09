import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Head from 'next/head';
import { Project, ProjectStatus } from '@/types';

export default function AdminDashboards() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Hardcoded credentials
  const ADMIN_EMAIL = 'redxxx531@gmail.com';
  const ADMIN_PASSWORD = 'Mohamedpro0@#';

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminDashboardAuth', 'true');
      fetchPendingProjects();
    } else {
      setError('Invalid email or password');
    }
  };

  // Check if user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminDashboardAuth') === 'true';
    if (isLoggedIn) {
      setIsAuthenticated(true);
      fetchPendingProjects();
    }
  }, []);

  // Fetch pending projects
  const fetchPendingProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/projects?status=pending');
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle project action (approve/reject)
  const handleAction = async (projectId: number, action: 'approve' | 'reject' | 'feature') => {
    try {
      setActionLoading(true);
      
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${action} project`);
      }
      
      // Update local state based on action
      if (action === 'approve' || action === 'reject') {
        setProjects(projects.filter(p => p.id !== projectId));
      } else if (action === 'feature') {
        setProjects(
          projects.map(p => 
            p.id === projectId ? { ...p, isFeatured: !p.isFeatured } : p
          )
        );
      }
      
      // Close modal if open
      setCurrentProject(null);
      
    } catch (error) {
      console.error(`Error ${action}ing project:`, error);
      alert(`Failed to ${action} project. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminDashboardAuth');
  };

  return (
    <Layout title="Admin Project Approval Dashboard">
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="container py-5">
        {!isAuthenticated ? (
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-md-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold">Admin Dashboard</h2>
                    <p className="text-muted">Login to review and approve projects</p>
                  </div>
                  
                  {error && (
                    <div className="alert alert-danger">{error}</div>
                  )}
                  
                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2"
                    >
                      Login
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Project Approvals Dashboard</h1>
              <button 
                className="btn btn-outline-secondary"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="alert alert-info" role="alert">
                No pending projects to review at this time.
              </div>
            ) : (
              <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Project</th>
                          <th>Entrepreneur</th>
                          <th>Category</th>
                          <th>Submitted</th>
                          <th>Min. Investment</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map(project => (
                          <tr key={project.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                {project.media && project.media[0] ? (
                                  <img
                                    src={project.media[0].mediaUrl}
                                    alt={project.title}
                                    className="me-2 rounded"
                                    width="40"
                                    height="40"
                                    style={{ objectFit: 'cover' }}
                                  />
                                ) : (
                                  <div className="bg-light rounded me-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                    <i className="bi bi-image text-muted"></i>
                                  </div>
                                )}
                                <div>
                                  <div className="fw-semibold">{project.title}</div>
                                  <div className="small text-muted">ID: {project.id}</div>
                                </div>
                              </div>
                            </td>
                            <td>{project.entrepreneurName}</td>
                            <td>{project.category}</td>
                            <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                            <td>${project.minimumInvestment.toLocaleString()}</td>
                            <td>
                              <div className="d-flex">
                                <button 
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => setCurrentProject(project)}
                                >
                                  Review
                                </button>
                                <button 
                                  className="btn btn-sm btn-success me-2"
                                  onClick={() => handleAction(project.id, 'approve')}
                                  disabled={actionLoading}
                                >
                                  Approve
                                </button>
                                <button 
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleAction(project.id, 'reject')}
                                  disabled={actionLoading}
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {/* Project Details Modal */}
            {currentProject && (
              <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-scrollable modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Review Project: {currentProject.title}</h5>
                      <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setCurrentProject(null)}
                        disabled={actionLoading}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="row mb-4">
                        <div className="col-md-8">
                          {currentProject.media?.find(m => m.mediaType === 'image') && (
                            <img 
                              src={currentProject.media.find(m => m.mediaType === 'image')?.mediaUrl}
                              alt={currentProject.title}
                              className="img-fluid rounded mb-3"
                            />
                          )}
                          <h4 className="mb-2">{currentProject.title}</h4>
                          <div className="d-flex mb-3">
                            <span className="badge bg-secondary me-2">{currentProject.category}</span>
                            <span className="text-muted small">
                              Submitted on {new Date(currentProject.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p>{currentProject.description}</p>
                        </div>
                        <div className="col-md-4">
                          <div className="card bg-light">
                            <div className="card-body">
                              <h6>Project Details</h6>
                              <ul className="list-unstyled">
                                <li className="mb-2">
                                  <strong>Entrepreneur:</strong> {currentProject.entrepreneurName}
                                </li>
                                <li className="mb-2">
                                  <strong>Min. Investment:</strong> ${currentProject.minimumInvestment.toLocaleString()}
                                </li>
                                <li className="mb-2">
                                  <strong>Reward Type:</strong> {currentProject.rewardType}
                                </li>
                                <li>
                                  <strong>Reward Description:</strong> <br />
                                  {currentProject.rewardDescription}
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Media Gallery */}
                      {currentProject.media && currentProject.media.length > 0 && (
                        <div className="mb-4">
                          <h5>Project Media</h5>
                          <div className="row g-3">
                            {currentProject.media.map((media, index) => (
                              <div key={index} className="col-md-3">
                                {media.mediaType === 'image' ? (
                                  <img 
                                    src={media.mediaUrl}
                                    alt={`Project media ${index + 1}`}
                                    className="img-fluid rounded"
                                    style={{ height: '120px', width: '100%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <div className="ratio ratio-16x9">
                                    <iframe 
                                      src={media.mediaUrl} 
                                      title={`Project video ${index + 1}`}
                                      allowFullScreen
                                    ></iframe>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="modal-footer">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary" 
                        onClick={() => setCurrentProject(null)}
                        disabled={actionLoading}
                      >
                        Close
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-danger"
                        onClick={() => handleAction(currentProject.id, 'reject')}
                        disabled={actionLoading}
                      >
                        {actionLoading ? 'Processing...' : 'Reject'}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-success"
                        onClick={() => handleAction(currentProject.id, 'approve')}
                        disabled={actionLoading}
                      >
                        {actionLoading ? 'Processing...' : 'Approve'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}