import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string;
  created_at: string;
  author_name: string;
}

export default function BlogIndex() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/blog');
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setError('An error occurred while loading blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  return (
    <Layout 
      title="Blog - Launch Tribe" 
      description="Insights, tips, and news from the Launch Tribe team on crowdfunding, entrepreneurship, and investment strategies."
    >
      <div className="bg-light py-5" style={{ paddingTop: '120px' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold">Blog</h1>
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <p className="lead">Insights, tips, and news from the Launch Tribe team</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading blog posts...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-5">
            <p className="mb-0">No blog posts available at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="row g-4">
            {posts.map((post, index) => (
              <div key={post.id} className={index === 0 ? "col-12" : "col-md-6 col-lg-4"}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="position-relative">
                    <img 
                      src={post.featured_image_url || 'https://via.placeholder.com/800x400?text=Launch+Tribe'} 
                      alt={post.title} 
                      className="card-img-top"
                      style={{ height: index === 0 ? '400px' : '200px', objectFit: 'cover' }}
                    />
                    <div className="card-img-overlay d-flex align-items-end">
                      <div>
                        <span className="badge bg-primary mb-2">Blog</span>
                        {index === 0 && (
                          <h2 className="card-title text-white fw-bold">{post.title}</h2>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-4">
                    {index !== 0 && (
                      <h5 className="card-title mb-2">{post.title}</h5>
                    )}
                    <p className="card-text text-muted mb-3">
                      {post.excerpt || post.title}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </small>
                      <Link href={`/blog/${post.slug}`} className="btn btn-outline-primary btn-sm">
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-primary bg-gradient text-white py-5">
        <div className="container text-center py-3">
          <h2 className="fw-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="lead mb-4">Stay up to date with the latest insights and news from Launch Tribe.</p>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <form className="d-flex">
                <input type="email" className="form-control me-2" placeholder="Your email address" required />
                <button type="submit" className="btn btn-light">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}