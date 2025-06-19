import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  featured_image_url: string;
  created_at: string;
  updated_at: string;
  author_id: number;
  author_name: string;
}

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  featured_image_url: string;
}

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blog/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Blog post not found');
          }
          throw new Error('Failed to fetch blog post');
        }
        
        const data = await response.json();
        setPost(data.post);
        setRelatedPosts(data.relatedPosts || []);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError('An error occurred while loading the blog post.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <Layout title="Loading... - Launch Tribe Blog">
        <div className="container py-5" style={{ paddingTop: '120px' }}>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading blog post...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout title="Error - Launch Tribe Blog">
        <div className="container py-5" style={{ paddingTop: '120px' }}>
          <div className="alert alert-danger">
            <h4 className="alert-heading">Error!</h4>
            <p>{error || 'Blog post not found'}</p>
            <hr />
            <Link href="/blog" className="btn btn-outline-danger">
              Back to Blog
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title={`${post.title} - Launch Tribe Blog`}
      description={post.content.substring(0, 160).replace(/<[^>]*>/g, '')}
    >
      <div className="position-relative" style={{ paddingTop: '76px' }}>
        <div 
          className="w-100 position-relative bg-dark"
          style={{ 
            height: '400px', 
            backgroundImage: `url(${post.featured_image_url || 'https://via.placeholder.com/1200x400?text=Launch+Tribe'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div 
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div className="container text-center text-white">
              <h1 className="display-4 fw-bold mb-3">{post.title}</h1>
              <div className="d-flex align-items-center justify-content-center">
                <div className="me-3 d-flex align-items-center">
                  <i className="bi bi-person-circle me-2"></i>
                  <span>{post.author_name}</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="bi bi-calendar me-2"></i>
                  <span>
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8">
            <article className="blog-post card border-0 shadow-sm p-4 mb-4">
              <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
            </article>
            
            <div className="d-flex justify-content-between align-items-center mt-4 mb-5">
              <Link href="/blog" className="btn btn-outline-primary">
                <i className="bi bi-arrow-left me-2"></i> Back to Blog
              </Link>
              
              <div className="d-flex gap-2">
                <a href="#" className="btn btn-floating btn-light">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="btn btn-floating btn-light">
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" className="btn btn-floating btn-light">
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 mb-4">
              <h4 className="mb-3">About the Author</h4>
              <div className="d-flex">
                <div className="flex-shrink-0">
                  <div className="bg-light rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                    <i className="bi bi-person-circle fs-3"></i>
                  </div>
                </div>
                <div className="ms-3">
                  <h5 className="mb-1">{post.author_name}</h5>
                  <p className="text-muted mb-0">Content Team @ Launch Tribe</p>
                </div>
              </div>
            </div>
            
            {relatedPosts.length > 0 && (
              <div className="card border-0 shadow-sm p-4">
                <h4 className="mb-3">Related Posts</h4>
                <div className="d-flex flex-column gap-3">
                  {relatedPosts.map(relatedPost => (
                    <div key={relatedPost.id} className="d-flex">
                      <div className="flex-shrink-0">
                        <img 
                          src={relatedPost.featured_image_url || 'https://via.placeholder.com/80x80?text=LT'} 
                          alt={relatedPost.title} 
                          className="rounded"
                          width="80"
                          height="80"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="ms-3">
                        <h6 className="mb-1">
                          <Link href={`/blog/${relatedPost.slug}`} className="text-decoration-none">
                            {relatedPost.title}
                          </Link>
                        </h6>
                        <Link href={`/blog/${relatedPost.slug}`} className="text-primary small text-decoration-none">
                          Read More <i className="bi bi-arrow-right ms-1"></i>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}