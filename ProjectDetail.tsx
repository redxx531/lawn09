import { useState } from 'react';
import { Project, UserType } from '@/types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import InvestmentForm from './InvestmentForm';
import ReportModal from './ReportModal';

interface ProjectDetailProps {
  project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  
  const isInvestor = session?.user.userType === UserType.INVESTOR;
  const isOwnProject = session?.user.id === project.entrepreneurId.toString();
  
  const handleInvestClick = () => {
    if (!session) {
      router.push(`/login?callbackUrl=/projects/${project.id}`);
      return;
    }
    
    if (!isInvestor) {
      alert('Only investors can invest in projects. Please switch to an investor account.');
      return;
    }
    
    setShowInvestModal(true);
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Find the first image and other images
  const firstImage = project.media?.find(m => m.mediaType === 'image')?.mediaUrl || 
    'https://via.placeholder.com/800x400?text=No+Image';
  
  const otherImages = project.media?.filter(m => m.mediaType === 'image' && m.mediaUrl !== firstImage) || [];
  
  const video = project.media?.find(m => m.mediaType === 'video');
  
  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-0">
            <img 
              src={firstImage}
              alt={project.title}
              className="img-fluid w-100"
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
            
            <div className="p-4">
              {project.isFeatured && (
                <div className="badge bg-primary mb-2">Featured</div>
              )}
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="mb-0">{project.title}</h1>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => setShowReportModal(true)}
                >
                  <i className="bi bi-flag me-1"></i> Report
                </button>
              </div>
              
              <div className="d-flex align-items-center mb-4">
                <div className="badge bg-secondary me-2">{project.category}</div>
                <div className="text-muted small">
                  <i className="bi bi-calendar me-1"></i>
                  {formatDate(project.createdAt)}
                </div>
              </div>
              
              <h5>Project Description</h5>
              <p className="mb-4">{project.description}</p>
              
              {/* Video if available */}
              {video && (
                <div className="mb-4">
                  <h5>Project Video</h5>
                  <div className="ratio ratio-16x9">
                    <iframe 
                      src={video.mediaUrl} 
                      title="Project video" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
              
              {/* Other images gallery */}
              {otherImages.length > 0 && (
                <div className="mb-4">
                  <h5>Gallery</h5>
                  <div className="row g-2">
                    {otherImages.map((image, index) => (
                      <div key={index} className="col-4">
                        <img 
                          src={image.mediaUrl}
                          alt={`Project image ${index + 1}`}
                          className="img-fluid rounded"
                          style={{ height: '120px', width: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-lg-4">
        <div className="card border-0 shadow-sm mb-4 sticky-top" style={{ top: '20px' }}>
          <div className="card-body">
            <h5 className="card-title">Investment Details</h5>
            
            <div className="mb-3">
              <p className="text-muted mb-1">Minimum Investment</p>
              <h4 className="mb-0">{formatCurrency(project.minimumInvestment)}</h4>
            </div>
            
            <div className="mb-3">
              <p className="text-muted mb-1">Reward Type</p>
              <h6>{project.rewardType}</h6>
              <p className="small">{project.rewardDescription}</p>
            </div>
            
            {project.totalInvestment !== undefined && (
              <div className="mb-4">
                <p className="text-muted mb-1">Progress</p>
                <h4 className="mb-1">{formatCurrency(project.totalInvestment)}</h4>
                <div className="progress mb-2" style={{ height: '10px' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    role="progressbar" 
                    style={{ width: `${Math.min((project.totalInvestment / (project.minimumInvestment * 2)) * 100, 100)}%` }}
                    aria-valuenow={project.totalInvestment}
                    aria-valuemin={0} 
                    aria-valuemax={project.minimumInvestment * 2}
                  />
                </div>
                <div className="d-flex justify-content-between small">
                  <span>{project.investorCount || 0} investors</span>
                  <span>{Math.round((project.totalInvestment / (project.minimumInvestment * 2)) * 100)}% funded</span>
                </div>
              </div>
            )}
            
            <div className="mb-3">
              <p className="text-muted mb-1">Created By</p>
              <h6>{project.entrepreneurName}</h6>
            </div>
            
            {!isOwnProject && (
              <button 
                className="btn btn-primary w-100"
                onClick={handleInvestClick}
                disabled={project.status !== 'approved'}
              >
                {project.status !== 'approved' ? 'Project Not Available' : 'Invest Now'}
              </button>
            )}
            
            {isOwnProject && (
              <div className="alert alert-info mb-0">
                <i className="bi bi-info-circle me-2"></i>
                This is your project
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Investment Modal */}
      {showInvestModal && (
        <InvestmentForm 
          project={project}
          onClose={() => setShowInvestModal(false)}
        />
      )}
      
      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          projectId={project.id}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}