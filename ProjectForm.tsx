import { useState } from 'react';
import { useRouter } from 'next/router';

const CATEGORIES = [
  'Technology', 
  'Food & Beverage', 
  'Health & Wellness', 
  'Education', 
  'Environment', 
  'Arts & Entertainment',
  'Fashion',
  'Social Impact',
  'Sports & Fitness',
  'Travel & Hospitality',
  'Real Estate',
  'Other'
];

const REWARD_TYPES = [
  'Equity',
  'Product',
  'Early Access',
  'Membership',
  'Revenue Sharing',
  'Discount',
  'Other'
];

export default function ProjectForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    minimumInvestment: 1000,
    rewardType: '',
    rewardDescription: '',
  });
  
  const [mediaItems, setMediaItems] = useState<{ type: 'image' | 'video', url: string }[]>([]);
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'minimumInvestment' ? Number(value) : value
    }));
  };
  
  const handleAddMedia = () => {
    if (!newMediaUrl.trim()) return;
    
    setMediaItems([...mediaItems, { type: newMediaType, url: newMediaUrl }]);
    setNewMediaUrl('');
    setNewMediaType('image');
  };
  
  const handleRemoveMedia = (index: number) => {
    setMediaItems(mediaItems.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.category || 
        !formData.rewardType || !formData.rewardDescription.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.minimumInvestment <= 0) {
      setError('Minimum investment must be greater than 0');
      return;
    }
    
    if (mediaItems.length === 0) {
      setError('Please add at least one image or video');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          media: mediaItems,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create project');
      }
      
      setSuccess(true);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/entrepreneur');
      }, 2000);
      
    } catch (err) {
      console.error('Project submission error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while submitting the project');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (success) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <div className="mb-4">
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
          </div>
          <h2>Project Submitted Successfully!</h2>
          <p className="mb-4">Your project has been submitted and is pending review by our team.</p>
          <p className="text-muted">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="card-title mb-4">Submit New Project</h2>
        
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h5>Basic Information</h5>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Project Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              ></textarea>
              <div className="form-text">
                Explain what your project is about, its goals, and why investors should be interested.
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                className="form-select"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <h5>Investment Details</h5>
            <div className="mb-3">
              <label htmlFor="minimumInvestment" className="form-label">Minimum Investment Amount ($)</label>
              <input
                type="number"
                className="form-control"
                id="minimumInvestment"
                name="minimumInvestment"
                value={formData.minimumInvestment}
                onChange={handleInputChange}
                min="1"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="rewardType" className="form-label">Reward Type</label>
              <select
                className="form-select"
                id="rewardType"
                name="rewardType"
                value={formData.rewardType}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              >
                <option value="">Select a reward type</option>
                {REWARD_TYPES.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-3">
              <label htmlFor="rewardDescription" className="form-label">Reward Description</label>
              <textarea
                className="form-control"
                id="rewardDescription"
                name="rewardDescription"
                rows={3}
                value={formData.rewardDescription}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              ></textarea>
              <div className="form-text">
                Describe in detail what investors will receive in return for their investment.
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h5>Media</h5>
            
            <div className="mb-3">
              <div className="input-group">
                <select
                  className="form-select flex-grow-0 w-auto"
                  value={newMediaType}
                  onChange={(e) => setNewMediaType(e.target.value as 'image' | 'video')}
                  disabled={isSubmitting}
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
                <input
                  type="url"
                  className="form-control"
                  placeholder={`Enter ${newMediaType} URL`}
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleAddMedia}
                  disabled={!newMediaUrl.trim() || isSubmitting}
                >
                  Add
                </button>
              </div>
              <div className="form-text">
                {newMediaType === 'image' ? 
                  'Add images of your project, product, or team. At least one image is required.' :
                  'Add links to videos (YouTube or Vimeo) that showcase your project.'}
              </div>
            </div>
            
            {mediaItems.length > 0 && (
              <div className="mb-3">
                <label className="form-label">Added Media</label>
                <div className="row g-2">
                  {mediaItems.map((item, index) => (
                    <div key={index} className="col-md-4">
                      <div className="card">
                        {item.type === 'image' ? (
                          <img 
                            src={item.url} 
                            alt={`Media ${index}`}
                            className="card-img-top"
                            style={{ height: '120px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{ height: '120px' }}>
                            <i className="bi bi-play-circle fs-1"></i>
                          </div>
                        )}
                        <div className="card-body p-2 d-flex justify-content-between align-items-center">
                          <span className="badge bg-secondary">{item.type}</span>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveMedia(index)}
                            disabled={isSubmitting}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="alert alert-info mb-4">
            <i className="bi bi-info-circle me-2"></i>
            Your project will be reviewed by our team before being published. This process typically takes 1-2 business days.
          </div>
          
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-outline-secondary me-2"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}