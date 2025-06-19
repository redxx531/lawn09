import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ActivityItem {
  id: number;
  type: 'project_submission' | 'investment' | 'user_registration' | 'project_approval';
  title: string;
  description: string;
  timestamp: string;
  metadata: {
    userId?: number;
    userName?: string;
    projectId?: number;
    projectTitle?: string;
    amount?: number;
  };
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/activity');
        
        if (!response.ok) {
          throw new Error('Failed to fetch recent activities');
        }
        
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError('Failed to load recent activities');
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, []);
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project_submission':
        return <i className="bi bi-file-earmark-plus text-primary"></i>;
      case 'investment':
        return <i className="bi bi-cash text-success"></i>;
      case 'user_registration':
        return <i className="bi bi-person-plus text-info"></i>;
      case 'project_approval':
        return <i className="bi bi-check-circle text-warning"></i>;
      default:
        return <i className="bi bi-activity text-secondary"></i>;
    }
  };
  
  if (loading) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="card-title mb-4">Recent Activity</h5>
          <div className="d-flex justify-content-center py-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="card-title mb-4">Recent Activity</h5>
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }
  
  if (activities.length === 0) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="card-title mb-4">Recent Activity</h5>
          <p className="text-muted text-center">No recent activities to display.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h5 className="card-title mb-4">Recent Activity</h5>
        
        <div className="position-relative">
          <div className="timeline-line"></div>
          
          {activities.map((activity, index) => (
            <div key={activity.id} className="timeline-item">
              <div className="timeline-icon">
                {getActivityIcon(activity.type)}
              </div>
              <div className="timeline-content">
                <div className="d-flex justify-content-between mb-1">
                  <h6 className="mb-0">{activity.title}</h6>
                  <small className="text-muted">
                    {new Date(activity.timestamp).toLocaleString()}
                  </small>
                </div>
                <p className="mb-1">{activity.description}</p>
                
                {activity.metadata.projectId && (
                  <Link 
                    href={`/projects/${activity.metadata.projectId}`}
                    className="small text-decoration-none"
                  >
                    View Project →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .timeline-line {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 18px;
          width: 2px;
          background-color: #e9ecef;
          z-index: 1;
        }
        
        .timeline-item {
          position: relative;
          padding-left: 40px;
          margin-bottom: 20px;
        }
        
        .timeline-item:last-child {
          margin-bottom: 0;
        }
        
        .timeline-icon {
          position: absolute;
          left: 10px;
          top: 0;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          box-shadow: 0 0 0 3px #f8f9fa;
        }
        
        .timeline-content {
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
}