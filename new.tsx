import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Layout from '@/components/layout/Layout';
import { UserType } from '@/types';
import Link from 'next/link';

export default function NewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !slug || !content) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          slug,
          content,
          meta_description: metaDescription,
          is_published: isPublished,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create page');
      }
      
      router.push('/dashboard/admin/pages');
    } catch (err) {
      console.error('Error creating page:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while creating the page');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = () => {
    const slugified = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setSlug(slugified);
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

  if (status === 'unauthenticated') {
    router.push('/login?callbackUrl=/dashboard/admin/pages/new');
    return null;
  }

  if (!session || session.user.userType !== UserType.ADMIN) {
    router.push('/');
    return null;
  }

  return (
    <Layout title="Create New Page - Admin Dashboard">
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
                  <Link href="/dashboard/admin/pages" className="nav-link active">
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
                  <Link href="/dashboard/admin/settings" className="nav-link">
                    <i className="bi bi-gear me-2"></i>
                    Settings
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-4 border-bottom">
              <h1 className="h2">Create New Page</h1>
              <Link href="/dashboard/admin/pages" className="btn btn-outline-secondary">
                <i className="bi bi-arrow-left me-2"></i>
                Back to Pages
              </Link>
            </div>
            
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {error}
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}
            
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-lg-8">
                      <label htmlFor="title" className="form-label">Page Title *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="col-lg-4">
                      <label htmlFor="slug" className="form-label">Slug *</label>
                      <div className="input-group">
                        <input 
                          type="text" 
                          className="form-control" 
                          id="slug" 
                          value={slug} 
                          onChange={(e) => setSlug(e.target.value)} 
                          required 
                        />
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary" 
                          onClick={generateSlug}
                        >
                          Generate
                        </button>
                      </div>
                      <div className="form-text">The URL path: example.com/<strong>{slug}</strong></div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">Page Content *</label>
                    <div className="editor-container">
                      <div className="editor-toolbar bg-light p-2 border-bottom">
                        <div className="btn-group me-2">
                          <button type="button" className="btn btn-sm btn-outline-secondary">
                            <i className="bi bi-type-bold"></i>
                          </button>
                          <button type="button" className="btn btn-sm btn-outline-secondary">
                            <i className="bi bi-type-italic"></i>
                          </button>
                          <button type="button" className="btn btn-sm btn-outline-secondary">
                            <i className="bi bi-type-underline"></i>
                          </button>
                        </div>
                        <div className="btn-group me-2">
                          <button type="button" className="btn btn-sm btn-outline-secondary">
                            <i className="bi bi-list-ul"></i>
                          </button>
                          <button type="button" className="btn btn-sm btn-outline-secondary">
                            <i className="bi bi-list-ol"></i>
                          </button>
                        </div>
                        <div className="btn-group">
                          <button type="button" className="btn btn-sm btn-outline-secondary">
                            <i className="bi bi-link"></i>
                          </button>
                          <button type="button" className="btn btn-sm btn-outline-secondary">
                            <i className="bi bi-image"></i>
                          </button>
                        </div>
                      </div>
                      <textarea 
                        className="form-control border-top-0 rounded-top-0" 
                        id="content" 
                        rows={12}
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        required 
                      ></textarea>
                    </div>
                    <div className="form-text">HTML is supported.</div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="metaDescription" className="form-label">Meta Description</label>
                    <textarea 
                      className="form-control" 
                      id="metaDescription" 
                      rows={2}
                      value={metaDescription} 
                      onChange={(e) => setMetaDescription(e.target.value)} 
                    ></textarea>
                    <div className="form-text">A brief description of the page for search engines.</div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="isPublished" 
                        checked={isPublished} 
                        onChange={(e) => setIsPublished(e.target.checked)} 
                      />
                      <label className="form-check-label" htmlFor="isPublished">Publish page</label>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-end">
                    <Link href="/dashboard/admin/pages" className="btn btn-outline-secondary me-2">
                      Cancel
                    </Link>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={loading}
                    >
                      {loading ? 'Creating Page...' : 'Create Page'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}