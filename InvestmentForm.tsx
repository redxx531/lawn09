import { useState } from 'react';
import { Project } from '@/types';
import { useSession } from 'next-auth/react';

interface InvestmentFormProps {
  project: Project;
  onClose: () => void;
}

export default function InvestmentForm({ project, onClose }: InvestmentFormProps) {
  const { data: session } = useSession();
  const [amount, setAmount] = useState<number>(project.minimumInvestment);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const platformFeePercentage = Number(process.env.PLATFORM_FEE_PERCENTAGE || 5);
  const platformFee = (amount * platformFeePercentage) / 100;
  const totalAmount = amount + platformFee;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount < project.minimumInvestment) {
      setError(`Minimum investment amount is $${project.minimumInvestment}`);
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project.id,
          amount,
          platformFee,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to process investment');
      }
      
      setSuccess(true);
      
      // In a real app, this would redirect to a payment processor
      // For now, we just simulate a successful investment
      setTimeout(() => {
        onClose();
        window.location.reload(); // Refresh to see updated investment
      }, 3000);
      
    } catch (err) {
      console.error('Investment error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during investment');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Invest in {project.title}</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              disabled={isSubmitting}
            ></button>
          </div>
          
          {success ? (
            <div className="modal-body text-center py-5">
              <div className="mb-3">
                <i className="bi bi-check-circle text-success" style={{ fontSize: '3rem' }}></i>
              </div>
              <h4>Investment Successful!</h4>
              <p className="mb-0">Thank you for investing in this project.</p>
              <p>You will receive confirmation details by email.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger">{error}</div>
                )}
                
                <div className="mb-3">
                  <label htmlFor="investment-amount" className="form-label">Investment Amount</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input 
                      type="number" 
                      className="form-control"
                      id="investment-amount"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      min={project.minimumInvestment}
                      step="100"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  <div className="form-text">
                    Minimum investment: ${project.minimumInvestment}
                  </div>
                </div>
                
                <div className="card bg-light mb-3">
                  <div className="card-body">
                    <h6 className="card-title">Investment Summary</h6>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Investment Amount:</span>
                      <span>${amount.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Platform Fee ({platformFeePercentage}%):</span>
                      <span>${platformFee.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total:</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <h6>You will receive:</h6>
                  <p className="mb-0">{project.rewardDescription}</p>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Investment'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}