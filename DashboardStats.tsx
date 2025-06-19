import { useState, useEffect } from 'react';
import { AdminDashboardStats } from '@/types';
import CountUp from 'react-countup';

export default function DashboardStats() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/stats');
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  if (loading) {
    return (
      <div className="row g-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="col-md-6 col-lg">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="placeholder-glow">
                  <span className="placeholder col-6 mb-2"></span>
                  <span className="placeholder col-4 d-block" style={{ height: '2rem' }}></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error || !stats) {
    return (
      <div className="alert alert-danger" role="alert">
        {error || 'Failed to load dashboard data'}
      </div>
    );
  }
  
  return (
    <div className="row g-4">
      <div className="col-md-6 col-lg">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body p-4 text-center">
            <div className="d-flex justify-content-center align-items-center mb-3">
              <div className="bg-light rounded-circle p-3">
                <i className="bi bi-people fs-4 text-dark"></i>
              </div>
            </div>
            <h6 className="text-muted mb-1">Total Users</h6>
            <h3 className="mb-0">
              <CountUp end={stats.totalUsers} duration={1.5} separator="," />
            </h3>
          </div>
        </div>
      </div>
      
      <div className="col-md-6 col-lg">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body p-4 text-center">
            <div className="d-flex justify-content-center align-items-center mb-3">
              <div className="bg-light rounded-circle p-3">
                <i className="bi bi-briefcase fs-4 text-dark"></i>
              </div>
            </div>
            <h6 className="text-muted mb-1">Total Projects</h6>
            <h3 className="mb-0">
              <CountUp end={stats.totalProjects} duration={1.5} separator="," />
            </h3>
          </div>
        </div>
      </div>
      
      <div className="col-md-6 col-lg">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body p-4 text-center">
            <div className="d-flex justify-content-center align-items-center mb-3">
              <div className="bg-light rounded-circle p-3">
                <i className="bi bi-cash-stack fs-4 text-dark"></i>
              </div>
            </div>
            <h6 className="text-muted mb-1">Total Investments</h6>
            <h3 className="mb-0">
              <CountUp end={stats.totalInvestments} duration={1.5} separator="," />
            </h3>
          </div>
        </div>
      </div>
      
      <div className="col-md-6 col-lg">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body p-4 text-center">
            <div className="d-flex justify-content-center align-items-center mb-3">
              <div className="bg-light rounded-circle p-3">
                <i className="bi bi-currency-dollar fs-4 text-dark"></i>
              </div>
            </div>
            <h6 className="text-muted mb-1">Amount Invested</h6>
            <h3 className="mb-0">$
              <CountUp end={stats.totalAmountInvested} duration={1.5} separator="," />
            </h3>
          </div>
        </div>
      </div>
      
      <div className="col-md-6 col-lg">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body p-4 text-center">
            <div className="d-flex justify-content-center align-items-center mb-3">
              <div className="bg-light rounded-circle p-3">
                <i className="bi bi-hourglass-split fs-4 text-dark"></i>
              </div>
            </div>
            <h6 className="text-muted mb-1">Pending Approval</h6>
            <h3 className="mb-0">
              <CountUp end={stats.pendingProjects} duration={1.5} separator="," />
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}