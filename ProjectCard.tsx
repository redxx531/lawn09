import { Project } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  // Find the first image, or use a default
  const firstImage = project.media?.find(m => m.mediaType === 'image')?.mediaUrl || 
    'https://via.placeholder.com/300x200?text=No+Image';
    
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="card h-100 shadow-sm border-0 overflow-hidden">
      {project.isFeatured && (
        <div className="position-absolute badge bg-dark px-3 py-2 top-0 end-0 m-2 z-index-1">
          Featured
        </div>
      )}
      
      <div className="position-relative" style={{ height: '200px' }}>
        <img 
          src={firstImage}
          alt={project.title}
          className="card-img-top"
          style={{ height: '200px', objectFit: 'cover' }}
        />
      </div>
      
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="badge bg-secondary">{project.category}</span>
          <span className="text-muted small">Min: {formatCurrency(project.minimumInvestment)}</span>
        </div>
        
        <h5 className="card-title">{project.title}</h5>
        <p className="card-text text-muted mb-1">By {project.entrepreneurName}</p>
        
        <p className="card-text mb-3" style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          minHeight: '4.5rem'
        }}>
          {project.description}
        </p>
        
        {project.totalInvestment !== undefined && (
          <div className="mb-3">
            <div className="d-flex justify-content-between small mb-1">
              <span>Progress</span>
              <span className="fw-bold">
                {formatCurrency(project.totalInvestment)}
              </span>
            </div>
            <div className="progress" style={{ height: '6px' }}>
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ width: `${Math.min((project.totalInvestment / (project.minimumInvestment * 2)) * 100, 100)}%` }}
                aria-valuenow={project.totalInvestment}
                aria-valuemin={0} 
                aria-valuemax={project.minimumInvestment * 2}
              />
            </div>
          </div>
        )}
        
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <div className="small text-muted">
            <i className="bi bi-people me-1"></i>
            {project.investorCount || 0} investors
          </div>
          <Link 
            href={`/projects/${project.id}`} 
            className="btn btn-outline-dark"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}