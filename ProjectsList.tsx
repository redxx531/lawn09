import { useState, useEffect } from 'react';
import { Project, ProjectStatus } from '@/types';
import Link from 'next/link';

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/entrepreneur/projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load your projects. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.APPROVED:
        return <span className="badge bg-success">Approved</span>;
      case ProjectStatus.PENDING:
        return <span className="badge bg-warning text-dark">Pending Review</span>;
      case ProjectStatus.REJECTED:
        return <span className="badge bg-danger">Rejected</span>;
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your projects...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }
  
  if (projects.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-3">
          <i className="bi bi-lightbulb fs-1 text-warning"></i>
        </div>
        <h4>You haven't submitted any projects yet</h4>
        <p className="text-muted mb-4">Create your first project to start receiving investments.</p>
        <Link href="/dashboard/entrepreneur/new-project" className="btn btn-primary">
          Submit a Project
        </Link>
      </div>
    );
  }
  
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Created</th>
                <th>Min. Investment</th>
                <th>Total Invested</th>
                <th>Investors</th>
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
                        <div className="small text-muted">{project.category}</div>
                      </div>
                    </div>
                  </td>
                  <td>{getStatusBadge(project.status)}</td>
                  <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                  <td>${project.minimumInvestment.toLocaleString()}</td>
                  <td>${(project.totalInvestment || 0).toLocaleString()}</td>
                  <td>{project.investorCount || 0}</td>
                  <td>
                    <Link 
                      href={`/projects/${project.id}`} 
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}