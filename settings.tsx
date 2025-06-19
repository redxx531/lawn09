import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Layout from '@/components/layout/Layout';
import { UserType } from '@/types';
import Link from 'next/link';

interface SiteSetting {
  setting_key: string;
  setting_value: string;
  setting_type: 'text' | 'number' | 'boolean';
}

export default function AdminSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/admin/settings');
    } else if (status === 'authenticated' && session.user.userType !== UserType.ADMIN) {
      router.push('/');
    } else if (status === 'authenticated' && session.user.userType === UserType.ADMIN) {
      fetchSettings();
    }
  }, [status, session, router]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('Failed to load settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update settings');
      }
      
      setSuccess('Settings updated successfully');
      
      // Scroll to top to show success message
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error updating settings:', error);
      setError('An error occurred while saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') {
    return (
      <Layout title="Loading...">
        <div className="container py-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!session || session.user.userType !== UserType.ADMIN) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout title="Site Settings - Admin Dashboard">
      <div className="container-fluid py-5" style={{ paddingTop: '100px' }}>
        <div className="row">
          <div className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <div className="position-sticky pt-3">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link href="/dashboard/admin" className="nav-link">
                    <i className="bi bi-speedometer2 me-2"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/dashboard/admin/projects" className="nav-link">
                    <i className="bi bi-briefcase me-2"></i>
                    Projects
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/dashboard/admin/users" className="nav-link">
                    <i className="bi bi-people me-2"></i>
                    Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/dashboard/admin/pages" className="nav-link">
                    <i className="bi bi-file-earmark-text me-2"></i>
                    Pages
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/dashboard/admin/blog" className="nav-link">
                    <i className="bi bi-newspaper me-2"></i>
                    Blog
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/dashboard/admin/faqs" className="nav-link">
                    <i className="bi bi-question-circle me-2"></i>
                    FAQs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/dashboard/admin/settings" className="nav-link active">
                    <i className="bi bi-gear me-2"></i>
                    Settings
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-4 border-bottom">
              <h1 className="h2">Site Settings</h1>
            </div>
            
            {success && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                {success}
                <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
              </div>
            )}
            
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {error}
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}
            
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading settings...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="card border-0 shadow-sm mb-4">
                      <div className="card-header bg-white py-3">
                        <h5 className="card-title mb-0">General Settings</h5>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label htmlFor="site_name" className="form-label">Site Name</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            id="site_name" 
                            value={settings.site_name || ''} 
                            onChange={(e) => handleChange('site_name', e.target.value)} 
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="site_description" className="form-label">Site Description</label>
                          <textarea 
                            className="form-control" 
                            id="site_description" 
                            rows={2}
                            value={settings.site_description || ''} 
                            onChange={(e) => handleChange('site_description', e.target.value)} 
                          ></textarea>
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="platform_fee_percentage" className="form-label">Platform Fee Percentage</label>
                          <input 
                            type="number" 
                            className="form-control" 
                            id="platform_fee_percentage" 
                            value={settings.platform_fee_percentage || ''} 
                            onChange={(e) => handleChange('platform_fee_percentage', e.target.value)} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-6">
                    <div className="card border-0 shadow-sm mb-4">
                      <div className="card-header bg-white py-3">
                        <h5 className="card-title mb-0">Contact Information</h5>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label htmlFor="contact_email" className="form-label">Contact Email</label>
                          <input 
                            type="email" 
                            className="form-control" 
                            id="contact_email" 
                            value={settings.contact_email || ''} 
                            onChange={(e) => handleChange('contact_email', e.target.value)} 
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="support_email" className="form-label">Support Email</label>
                          <input 
                            type="email" 
                            className="form-control" 
                            id="support_email" 
                            value={settings.support_email || ''} 
                            onChange={(e) => handleChange('support_email', e.target.value)} 
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="footer_copyright" className="form-label">Footer Copyright Text</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            id="footer_copyright" 
                            value={settings.footer_copyright || ''} 
                            onChange={(e) => handleChange('footer_copyright', e.target.value)} 
                          />
                          <div className="form-text">Use {{YEAR}} to insert the current year.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-6">
                    <div className="card border-0 shadow-sm mb-4">
                      <div className="card-header bg-white py-3">
                        <h5 className="card-title mb-0">Social Media</h5>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label htmlFor="social_twitter" className="form-label">Twitter URL</label>
                          <input 
                            type="url" 
                            className="form-control" 
                            id="social_twitter" 
                            value={settings.social_twitter || ''} 
                            onChange={(e) => handleChange('social_twitter', e.target.value)} 
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="social_facebook" className="form-label">Facebook URL</label>
                          <input 
                            type="url" 
                            className="form-control" 
                            id="social_facebook" 
                            value={settings.social_facebook || ''} 
                            onChange={(e) => handleChange('social_facebook', e.target.value)} 
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="social_instagram" className="form-label">Instagram URL</label>
                          <input 
                            type="url" 
                            className="form-control" 
                            id="social_instagram" 
                            value={settings.social_instagram || ''} 
                            onChange={(e) => handleChange('social_instagram', e.target.value)} 
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="social_linkedin" className="form-label">LinkedIn URL</label>
                          <input 
                            type="url" 
                            className="form-control" 
                            id="social_linkedin" 
                            value={settings.social_linkedin || ''} 
                            onChange={(e) => handleChange('social_linkedin', e.target.value)} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-6">
                    <div className="card border-0 shadow-sm mb-4">
                      <div className="card-header bg-white py-3">
                        <h5 className="card-title mb-0">Homepage Settings</h5>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label htmlFor="homepage_hero_title" className="form-label">Hero Title</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            id="homepage_hero_title" 
                            value={settings.homepage_hero_title || ''} 
                            onChange={(e) => handleChange('homepage_hero_title', e.target.value)} 
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="homepage_hero_subtitle" className="form-label">Hero Subtitle</label>
                          <textarea 
                            className="form-control" 
                            id="homepage_hero_subtitle" 
                            rows={3}
                            value={settings.homepage_hero_subtitle || ''} 
                            onChange={(e) => handleChange('homepage_hero_subtitle', e.target.value)} 
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <div className="d-flex justify-content-end mb-4">
                      <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={saving}
                      >
                        {saving ? 'Saving Changes...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}