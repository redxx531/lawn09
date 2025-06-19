import { useState, useEffect } from 'react';
import { Investment } from '@/types';

export default function InvestmentsList() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/entrepreneur/investments');
        
        if (!response.ok) {
          throw new Error('Failed to fetch investments');
        }
        
        const data = await response.json();
        setInvestments(data);
      } catch (error) {
        console.error('Error fetching investments:', error);
        setError('Failed to load investment data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvestments();
  }, []);
  
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading investment data...</p>
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
  
  if (investments.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        You haven't received any investments yet.
      </div>
    );
  }
  
  // Calculate total investments
  const totalAmount = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalFees = investments.reduce((sum, inv) => sum + inv.platformFee, 0);
  
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card bg-light border-0">
              <div className="card-body text-center">
                <h6 className="text-muted mb-2">Total Investments</h6>
                <h3 className="mb-0">${totalAmount.toLocaleString()}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-light border-0">
              <div className="card-body text-center">
                <h6 className="text-muted mb-2">Platform Fees</h6>
                <h3 className="mb-0">${totalFees.toLocaleString()}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-light border-0">
              <div className="card-body text-center">
                <h6 className="text-muted mb-2">Total Investors</h6>
                <h3 className="mb-0">{investments.length}</h3>
              </div>
            </div>
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Investor</th>
                <th>Project</th>
                <th>Amount</th>
                <th>Platform Fee</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {investments.map(investment => (
                <tr key={investment.id}>
                  <td>{investment.investorName}</td>
                  <td>{investment.projectTitle}</td>
                  <td>${investment.amount.toLocaleString()}</td>
                  <td>${investment.platformFee.toLocaleString()}</td>
                  <td>{new Date(investment.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge bg-${investment.status === 'completed' ? 'success' : 'warning'}`}>
                      {investment.status}
                    </span>
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