import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageContent, setPageContent] = useState({
    title: 'Contact Us',
    content: '<p>We\'d love to hear from you! Whether you have a question about our platform, need help with your account, or want to suggest a feature, our team is here to help.</p>',
    meta_description: 'Contact the Launch Tribe team for support, feedback, or partnership inquiries.',
    image_url: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  });

  useEffect(() => {
    // Fetch page content
    const fetchPageContent = async () => {
      try {
        const response = await fetch('/api/pages/contact');
        if (response.ok) {
          const data = await response.json();
          if (data && data.content) {
            setPageContent(data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch page content', error);
      }
    };

    fetchPageContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit contact form');
      }
      
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setError('An error occurred while submitting your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Contact Us - Launch Tribe" description={pageContent.meta_description}>
      <div className="bg-light py-5" style={{ paddingTop: '120px' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <h1 className="display-5 fw-bold mb-4">{pageContent.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: pageContent.content }}></div>
            </div>
            <div className="col-lg-6">
              <img 
                src={pageContent.image_url} 
                alt="Contact Launch Tribe" 
                className="img-fluid rounded-3 shadow"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <h3 className="card-title mb-4">Get in Touch</h3>
                
                <div className="d-flex mb-4">
                  <div className="flex-shrink-0">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                      <i className="bi bi-envelope text-primary"></i>
                    </div>
                  </div>
                  <div className="ms-3">
                    <h5>Email Us</h5>
                    <p className="mb-0">
                      <a href="mailto:support@launchtribe.com" className="text-decoration-none">support@launchtribe.com</a>
                    </p>
                    <p className="text-muted small mb-0">We'll respond within 24-48 hours</p>
                  </div>
                </div>
                
                <div className="d-flex mb-4">
                  <div className="flex-shrink-0">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                      <i className="bi bi-chat-dots text-primary"></i>
                    </div>
                  </div>
                  <div className="ms-3">
                    <h5>Live Chat</h5>
                    <p className="mb-0">Available Monday-Friday</p>
                    <p className="text-muted small mb-0">9am-5pm ET</p>
                  </div>
                </div>
                
                <div className="d-flex">
                  <div className="flex-shrink-0">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                      <i className="bi bi-building text-primary"></i>
                    </div>
                  </div>
                  <div className="ms-3">
                    <h5>Headquarters</h5>
                    <p className="mb-0">123 Innovation Street</p>
                    <p className="mb-0">Suite 200</p>
                    <p className="mb-0">San Francisco, CA 94103</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h3 className="card-title mb-4">Send Us a Message</h3>
                
                {success ? (
                  <div className="alert alert-success">
                    <h5 className="alert-heading"><i className="bi bi-check-circle me-2"></i> Message Sent!</h5>
                    <p className="mb-0">Thank you for contacting us. We'll get back to you as soon as possible.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {error && (
                      <div className="alert alert-danger">{error}</div>
                    )}
                    
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="name" className="form-label">Your Name *</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="name" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Email Address *</label>
                        <input 
                          type="email" 
                          className="form-control" 
                          id="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="col-12">
                        <label htmlFor="subject" className="form-label">Subject</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="subject" 
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                        />
                      </div>
                      
                      <div className="col-12">
                        <label htmlFor="message" className="form-label">Message *</label>
                        <textarea 
                          className="form-control" 
                          id="message" 
                          rows={5}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      
                      <div className="col-12">
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Sending...
                            </>
                          ) : (
                            'Send Message'
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Follow Us</h2>
            <p>Stay connected with us on social media for the latest updates and news.</p>
          </div>
          
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="d-flex justify-content-center gap-4">
                <a href="#" className="btn btn-floating btn-light" aria-label="Twitter">
                  <i className="bi bi-twitter fs-4"></i>
                </a>
                <a href="#" className="btn btn-floating btn-light" aria-label="Facebook">
                  <i className="bi bi-facebook fs-4"></i>
                </a>
                <a href="#" className="btn btn-floating btn-light" aria-label="Instagram">
                  <i className="bi bi-instagram fs-4"></i>
                </a>
                <a href="#" className="btn btn-floating btn-light" aria-label="LinkedIn">
                  <i className="bi bi-linkedin fs-4"></i>
                </a>
                <a href="#" className="btn btn-floating btn-light" aria-label="YouTube">
                  <i className="bi bi-youtube fs-4"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}