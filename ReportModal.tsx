import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface ReportModalProps {
  projectId: number;
  onClose: () => void;
}

export default function ReportModal({ projectId, onClose }: ReportModalProps) {
  const { data: session } = useSession();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('Please provide a reason for reporting');
      return;
    }
    
    if (!session) {
      setError('You must be logged in to report a project');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/projects/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          reason,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit report');
      }
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err) {
      console.error('Report submission error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while submitting the report');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Report Project</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              disabled={isSubmitting}
            ></button>
          </div>
          
          {success ? (
            <div className="modal-body text-center py-4">
              <div className="mb-3">
                <i className="bi bi-check-circle text-success" style={{ fontSize: '3rem' }}></i>
              </div>
              <h5>Report Submitted</h5>
              <p>Thank you for helping us maintain a trustworthy platform. Our team will review this project.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger">{error}</div>
                )}
                
                {!session && (
                  <div className="alert alert-warning">
                    You must be logged in to report a project
                  </div>
                )}
                
                <div className="mb-3">
                  <label htmlFor="report-reason" className="form-label">Reason for Reporting</label>
                  <textarea 
                    className="form-control"
                    id="report-reason"
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please explain why you are reporting this project..."
                    disabled={isSubmitting || !session}
                    required
                  ></textarea>
                </div>
                
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  Reports are anonymous and help us ensure all projects on Launch Tribe meet our community standards.
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
                  className="btn btn-danger"
                  disabled={isSubmitting || !session}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}