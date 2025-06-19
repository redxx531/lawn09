import Layout from '@/components/layout/Layout';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [pageContent, setPageContent] = useState({
    title: 'About Us',
    content: '<p>Loading content...</p>',
    meta_description: 'About Launch Tribe',
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  });

  useEffect(() => {
    // Fetch page content
    const fetchPageContent = async () => {
      try {
        const response = await fetch('/api/pages/about');
        if (response.ok) {
          const data = await response.json();
          setPageContent(data);
        }
      } catch (error) {
        console.error('Failed to fetch page content', error);
      }
    };

    fetchPageContent();
  }, []);

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      position: 'CEO & Co-Founder',
      bio: 'Former venture capitalist with over 10 years of experience in startup funding.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      name: 'David Chen',
      position: 'CTO & Co-Founder',
      bio: 'Tech entrepreneur with multiple successful exits in the fintech space.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      name: 'Maya Patel',
      position: 'Head of Operations',
      bio: 'Operational leader with experience scaling startups from seed to Series C.',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      name: 'James Wilson',
      position: 'Head of Investment Relations',
      bio: 'Former investment banker with deep connections in angel and VC networks.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    }
  ];

  return (
    <Layout title={`${pageContent.title} - Launch Tribe`} description={pageContent.meta_description}>
      <div className="bg-light" style={{ paddingTop: '100px' }}>
        <div className="container py-5">
          <div className="row">
            <div className="col-md-6 mb-4 mb-md-0">
              <h1 className="display-5 fw-bold mb-4">{pageContent.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: pageContent.content }}></div>
            </div>
            <div className="col-md-6">
              <img 
                src={pageContent.image_url} 
                alt="About Launch Tribe" 
                className="img-fluid rounded-3 shadow"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Our Mission</h2>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <p className="lead">We're on a mission to democratize access to funding and help innovative ideas come to life, regardless of who you are or where you're from.</p>
            </div>
          </div>
        </div>
        
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-flex mb-3">
                  <i className="bi bi-lightbulb fs-3 text-primary"></i>
                </div>
                <h3>Innovation</h3>
                <p className="text-muted">We believe in the power of innovative ideas to change the world and solve pressing problems.</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-flex mb-3">
                  <i className="bi bi-people fs-3 text-primary"></i>
                </div>
                <h3>Community</h3>
                <p className="text-muted">We're building a supportive community where entrepreneurs and investors can connect and grow together.</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-flex mb-3">
                  <i className="bi bi-shield-check fs-3 text-primary"></i>
                </div>
                <h3>Integrity</h3>
                <p className="text-muted">We operate with transparency and integrity in all our dealings, building trust among our users.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-light py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Meet Our Team</h2>
            <p className="lead">The passionate individuals behind Launch Tribe</p>
          </div>
          
          <div className="row g-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm h-100">
                  <img 
                    src={member.image} 
                    className="card-img-top" 
                    alt={member.name}
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                  <div className="card-body p-4">
                    <h5 className="card-title mb-1">{member.name}</h5>
                    <p className="text-primary small mb-2">{member.position}</p>
                    <p className="card-text text-muted">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="fw-bold mb-4">Join Our Community</h2>
              <p className="lead mb-4">
                Whether you're an entrepreneur with a groundbreaking idea or an investor looking for the next big opportunity, Launch Tribe is the place for you.
              </p>
              <Link href="/signup" className="btn btn-primary btn-lg">
                Join Launch Tribe Today
              </Link>
            </div>
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm p-4">
                <div className="card-body">
                  <h4 className="mb-4">Our Impact So Far</h4>
                  <div className="row g-4 text-center">
                    <div className="col-6">
                      <div className="display-5 fw-bold text-primary mb-2">500+</div>
                      <p className="text-muted mb-0">Projects Funded</p>
                    </div>
                    <div className="col-6">
                      <div className="display-5 fw-bold text-primary mb-2">$15M+</div>
                      <p className="text-muted mb-0">Total Investments</p>
                    </div>
                    <div className="col-6">
                      <div className="display-5 fw-bold text-primary mb-2">10k+</div>
                      <p className="text-muted mb-0">Community Members</p>
                    </div>
                    <div className="col-6">
                      <div className="display-5 fw-bold text-primary mb-2">30+</div>
                      <p className="text-muted mb-0">Countries Reached</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}