import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Layout from '@/components/layout/Layout';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/profile');
    } else if (status === 'authenticated' && session.user) {
      setName(session.user.name || '');
      setEmail(session.user.email);
    }
  }, [status, session, router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('An error occurred while updating your profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to change password');
      }
      
      setSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <Layout title="Loading...">
        <div className="container py-5 text-center" style={{ paddingTop: '120px' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout title="Profile Settings - Launch Tribe">
      <div className="bg-light py-5" style={{ paddingTop: '120px' }}>
        <div className="container">
          <h1 className="display-5 fw-bold mb-4">Profile Settings</h1>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          <div className="col-lg-3 mb-4 mb-lg-0">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <div className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3" style={{ width: '100px', height: '100px' }}>
                    <i className="bi bi-person fs-1"></i>
                  </div>
                  <h5 className="card-title mb-1">{session.user.name || session.user.email}</h5>
                  <p className="text-muted small mb-0">{session.user.userType}</p>
                </div>
                
                <div className="list-group list-group-flush">
                  <button 
                    className={`list-group-item list-group-item-action ${activeTab === 'profile' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('profile')}
                  >
                    <i className="bi bi-person-circle me-2"></i> Profile Information
                  </button>
                  <button 
                    className={`list-group-item list-group-item-action ${activeTab === 'security' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('security')}
                  >
                    <i className="bi bi-shield-lock me-2"></i> Security
                  </button>
                  <button 
                    className={`list-group-item list-group-item-action ${activeTab === 'notifications' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('notifications')}
                  >
                    <i className="bi bi-bell me-2"></i> Notifications
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-9">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
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
                
                {activeTab === 'profile' && (
                  <div>
                    <h4 className="card-title mb-4">Profile Information</h4>
                    
                    <form onSubmit={handleProfileUpdate}>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input 
                          type="email" 
                          className="form-control" 
                          id="email" 
                          value={email} 
                          disabled 
                        />
                        <div className="form-text">Email address cannot be changed.</div>
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="userType" className="form-label">Account Type</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="userType" 
                          value={session.user.userType.charAt(0).toUpperCase() + session.user.userType.slice(1)} 
                          disabled 
                        />
                      </div>
                      
                      <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </form>
                  </div>
                )}
                
                {activeTab === 'security' && (
                  <div>
                    <h4 className="card-title mb-4">Security Settings</h4>
                    
                    <form onSubmit={handlePasswordChange}>
                      <div className="mb-3">
                        <label htmlFor="currentPassword" className="form-label">Current Password</label>
                        <input 
                          type="password" 
                          className="form-control" 
                          id="currentPassword" 
                          value={currentPassword} 
                          onChange={(e) => setCurrentPassword(e.target.value)} 
                          required 
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input 
                          type="password" 
                          className="form-control" 
                          id="newPassword" 
                          value={newPassword} 
                          onChange={(e) => setNewPassword(e.target.value)} 
                          required 
                        />
                        <div className="form-text">Password must be at least 8 characters long.</div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                        <input 
                          type="password" 
                          className="form-control" 
                          id="confirmPassword" 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)} 
                          required 
                        />
                      </div>
                      
                      <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={loading}
                      >
                        {loading ? 'Changing Password...' : 'Change Password'}
                      </button>
                    </form>
                  </div>
                )}
                
                {activeTab === 'notifications' && (
                  <div>
                    <h4 className="card-title mb-4">Notification Preferences</h4>
                    
                    <div className="mb-3">
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="emailNotifications" defaultChecked />
                        <label className="form-check-label" htmlFor="emailNotifications">Email Notifications</label>
                      </div>
                      <div className="form-text">Receive updates about your account and projects via email.</div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="marketingEmails" defaultChecked />
                        <label className="form-check-label" htmlFor="marketingEmails">Marketing Emails</label>
                      </div>
                      <div className="form-text">Receive promotional content and offers from Launch Tribe.</div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="projectUpdates" defaultChecked />
                        <label className="form-check-label" htmlFor="projectUpdates">Project Updates</label>
                      </div>
                      <div className="form-text">Receive updates about projects you've invested in or created.</div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="newsletterSubscription" defaultChecked />
                        <label className="form-check-label" htmlFor="newsletterSubscription">Newsletter Subscription</label>
                      </div>
                      <div className="form-text">Receive our weekly newsletter with industry insights and featured projects.</div>
                    </div>
                    
                    <button className="btn btn-primary">Save Preferences</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}