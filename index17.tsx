import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Layout from '@/components/layout/Layout';
import { UserType } from '@/types';
import Link from 'next/link';

interface Page {
  id: number;
  slug: string;
  title: string;
  meta_description: string;
  is_published: boolean;
  updated_at: string;
}

export default function AdminPages() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/admin/pages');
    } else if (status === 'authenticated' && session.user.userType !== UserType.ADMIN) {
      router.push('/');
    } else if (status === 'authenticated' && session.user.userType === UserType.ADMIN) {
      fetchPages();
    }
  }, [status, session, router]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/pages');
      
      if (!response.ok) {
        throw new Error('Failed to fetch pages');
      }
      
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
      setError('Failed to load pages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      setDeleteLoading(true);
      const response = await fetch(`/api/admin/pages/${deleteId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete page');
      }
      
      setPages(pages.filter(page => page.id !== deleteId));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting page:', error);
      setError('Failed to delete page. Please try again.');
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  const togglePublishStatus = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/pages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_published: !currentStatus,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update page status');
      }
      
      setPages(pages.map(page => 
        page.id === id ? { ...page, is_published: !currentStatus } : page
      ));
    } catch (error) {
      console.error('Error updating page status:', error);
      setError('Failed to update page status. Please try again.');
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
    <Layout title="Manage Pages - Admin Dashboard">
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
              <h1 className="h2">Manage Pages</h1>
              <Link href="/dashboard/admin/pages/new" className="btn btn-primary">
                <i className="bi bi-plus-lg me-2"></i>
                Add New Page
              </Link>
            </div>
            
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
                <p className="mt-3">Loading pages...</p>
              </div>
            ) : pages.length === 0 ? (
              <div className="alert alert-info">
                No pages found. Click "Add New Page" to create your first page.
              </div>
            ) : (
              <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Title</th>
                          <th>Slug</th>
                          <th>Status</th>
                          <th>Last Updated</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pages.map(page => (
                          <tr key={page.id}>
                            <td>{page.title}</td>
                            <td>
                              <code>{page.slug}</code>
                              <a 
                                href={`/${page.slug}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="ms-2 text-decoration-none"
                              >
                                <i className="bi bi-box-arrow-up-right"></i>
                              </a>
                            </td>
                            <td>
                              <span 
                                className={`badge ${page.is_published ? 'bg-success' : 'bg-secondary'}`}
                              >
                                {page.is_published ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td>
                              {new Date(page.updated_at).toLocaleDateString()}
                            </td>
                            <td>
                              <div className="btn-group">
                                <Link 
                                  href={`/dashboard/admin/pages/edit/${page.id}`} 
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  Edit
                                </Link>
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => togglePublishStatus(page.id, page.is_published)}
                                >
                                  {page.is_published ? 'Unpublish' : 'Publish'}
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => confirmDelete(page.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this page? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}