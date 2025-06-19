import { useState, useEffect } from 'react';
import { Investment, Project } from '@/types';
import Link from 'next/link';

export default function InvestmentsDashboard() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [investmentsResponse, projectsResponse] = await Promise.all([
          fetch('/api/investor/investments'),
          fetch('/api/projects/featured?limit=3')
        ]);
        
        if (!investmentsResponse.ok) {
          throw new Error('Failed to fetch investments');
        }
        
        const investmentsData = await investmentsResponse.json();
        setInvestments(investmentsData);
        
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load your investment data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your investments...</p>
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
  
  // Calculate total investments
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const projectCount = new Set(investments.map(inv => inv.projectId)).size;
  
  return (
    <div className="row g-4">
      <div className="col-md-12">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="display-4 text-primary mb-2">${totalInvested.toLocaleString()}</div>
                <p className="text-muted mb-0">Total Invested</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="display-4 text-primary mb-2">{projectCount}</div>
                <p className="text-muted mb-0">Projects Backed</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="display-4 text-primary mb-2">{investments.length}</div>
                <p className="text-muted mb-0">Total Investments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-md-8">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
            <h5 className="mb-0">Your Investments</h5>
          </div>
          <div className="card-body p-0">
            {investments.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="bi bi-piggy-bank fs-1 text-muted"></i>
                </div>
                <h5>You haven't made any investments yet</h5>
                <p className="text-muted mb-4">Explore projects and start building your investment portfolio.</p>
                <Link href="/projects" className="btn btn-primary">
                  Explore Projects
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Project</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments.slice(0, 5).map(investment => (
                      <tr key={investment.id}>
                        <td>{investment.projectTitle}</td>
                        <td>${investment.amount.toLocaleString()}</td>
                        <td>{new Date(investment.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge bg-${investment.status === 'completed' ? 'success' : 'warning'}`}>
                            {investment.status}
                          </span>
                        </td>
                        <td>
                          <Link
                            href={`/projects/${investment.projectId}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            View Project
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="col-md-4">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
            <h5 className="mb-0">Featured Projects</h5>
            <Link href="/projects" className="btn btn-sm btn-outline-primary">
              View All
            </Link>
          </div>
          <div className="card-body">
            {projects.length === 0 ? (
              <p className="text-muted text-center">No featured projects at the moment.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {projects.map(project => (
                  <div key={project.id} className="d-flex">
                    <div className="flex-shrink-0">
                      <img
                        src={project.media?.[0]?.mediaUrl || 'https://via.placeholder.com/60x60'}
                        alt={project.title}
                        className="rounded"
                        width="60"
                        height="60"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="ms-3">
                      <h6 className="mb-0">{project.title}</h6>
                      <p className="text-muted small mb-1">{project.category}</p>
                      <Link
                        href={`/projects/${project.id}`}
                        className="btn btn-sm btn-link p-0"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}