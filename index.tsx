import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { Project } from '@/types';

export default function Home() {
  const { data: session } = useSession();
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({
    projectCount: 0,
    entrepreneurCount: 0,
    investorCount: 0,
    totalInvestment: 0
  });
  const [siteSettings, setSiteSettings] = useState({
    homepage_hero_title: 'Turn Ideas Into Reality',
    homepage_hero_subtitle: 'Launch Tribe connects entrepreneurs with investors of all levels. Whether you\'re looking to fund your next big idea or discover promising ventures, you\'re in the right place.'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured projects
        const projectsResponse = await fetch('/api/projects/featured');
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setFeaturedProjects(projectsData);
        }

        // Fetch stats
        const statsResponse = await fetch('/api/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        // Fetch site settings
        const settingsResponse = await fetch('/api/settings');
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          if (settingsData.homepage_hero_title) {
            setSiteSettings(settingsData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getStartedLink = () => {
    if (!session) return '/signup';
    
    switch (session.user.userType) {
      case 'entrepreneur':
        return '/dashboard/entrepreneur/new-project';
      case 'investor':
        return '/projects';
      case 'admin':
        return '/dashboard/admin';
      default:
        return '/signup';
    }
  };
  
  const getStartedText = () => {
    if (!session) return 'Get Started';
    
    switch (session.user.userType) {
      case 'entrepreneur':
        return 'Submit Your Project';
      case 'investor':
        return 'Discover Projects';
      case 'admin':
        return 'Go to Dashboard';
      default:
        return 'Get Started';
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <Layout title="Launch Tribe - Connect Entrepreneurs with Investors">
      {/* Hero Section */}
      <section className="hero-section position-relative d-flex align-items-center" style={{ minHeight: '100vh', paddingTop: '80px' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="fade-in" style={{ animationDelay: '0.1s' }}>
                <h1 className="display-4 fw-bold mb-4 text-white" style={{ letterSpacing: '-0.03em' }}>{siteSettings.homepage_hero_title}</h1>
                <p className="lead mb-5 text-white opacity-90">
                  {siteSettings.homepage_hero_subtitle}
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link href={getStartedLink()} className="btn btn-light btn-lg px-4 py-3">
                    {getStartedText()} <i className="bi bi-arrow-right ms-2"></i>
                  </Link>
                  <Link href="/projects" className="btn btn-outline-light btn-lg px-4 py-3">
                    Explore Projects
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div className="fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="position-relative">
                  <img 
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                    alt="Team collaboration" 
                    className="img-fluid rounded-3 shadow-lg"
                    style={{ filter: 'brightness(0.95)' }}
                  />
                  <div className="position-absolute start-0 bottom-0 w-100 p-4 text-white" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)' }}>
                    <div className="d-flex align-items-center">
                      <div className="fs-5 me-2">
                        <i className="bi bi-stars"></i>
                      </div>
                      <div>
                        <p className="mb-0 fw-medium">Join our community of entrepreneurs and investors</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="position-absolute bottom-0 start-0 w-100 text-center pb-4 text-white">
          <a href="#featured-projects" className="text-white text-decoration-none">
            <div className="d-flex flex-column align-items-center">
              <span className="small mb-2">Scroll to discover</span>
              <i className="bi bi-chevron-down"></i>
            </div>
          </a>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-5" id="featured-projects">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h2>Featured Projects</h2>
            <Link href="/projects" className="btn btn-outline-primary">
              View All Projects
            </Link>
          </div>
          
          <div className="row g-4">
            {featuredProjects.length === 0 ? (
              <div className="col-12">
                <p className="text-center">No featured projects at the moment. Check back soon!</p>
              </div>
            ) : (
              featuredProjects.map(project => (
                <div key={project.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm border-0 overflow-hidden">
                    {project.isFeatured && (
                      <div className="position-absolute badge bg-dark px-3 py-2 top-0 end-0 m-2 z-index-1">
                        Featured
                      </div>
                    )}
                    
                    <div className="position-relative" style={{ height: '200px' }}>
                      <img 
                        src={project.media?.find(m => m.mediaType === 'image')?.mediaUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={project.title}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    </div>
                    
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="badge bg-secondary">{project.category}</span>
                        <span className="text-muted small">Min: {formatCurrency(project.minimumInvestment)}</span>
                      </div>
                      
                      <h5 className="card-title">{project.title}</h5>
                      <p className="card-text text-muted mb-1">By {project.entrepreneurName}</p>
                      
                      <p className="card-text mb-3" style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '4.5rem'
                      }}>
                        {project.description}
                      </p>
                      
                      {project.totalInvestment !== undefined && (
                        <div className="mb-3">
                          <div className="d-flex justify-content-between small mb-1">
                            <span>Progress</span>
                            <span className="fw-bold">
                              {formatCurrency(project.totalInvestment)}
                            </span>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div 
                              className="progress-bar" 
                              role="progressbar" 
                              style={{ width: `${Math.min((project.totalInvestment / (project.minimumInvestment * 2)) * 100, 100)}%` }}
                              aria-valuenow={project.totalInvestment}
                              aria-valuemin={0} 
                              aria-valuemax={project.minimumInvestment * 2}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-auto d-flex justify-content-between align-items-center">
                        <div className="small text-muted">
                          <i className="bi bi-people me-1"></i>
                          {project.investorCount || 0} investors
                        </div>
                        <Link 
                          href={`/projects/${project.id}`} 
                          className="btn btn-outline-dark"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-black text-white">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 mb-4 mb-md-0">
              <div className="d-flex flex-column align-items-center">
                <i className="bi bi-briefcase fs-1 mb-2"></i>
                <h3 className="mb-0">{stats.projectCount.toLocaleString()}</h3>
                <p className="mb-0 text-white-50">Active Projects</p>
              </div>
            </div>
            
            <div className="col-md-3 mb-4 mb-md-0">
              <div className="d-flex flex-column align-items-center">
                <i className="bi bi-people fs-1 mb-2"></i>
                <h3 className="mb-0">{stats.entrepreneurCount.toLocaleString()}</h3>
                <p className="mb-0 text-white-50">Entrepreneurs</p>
              </div>
            </div>
            
            <div className="col-md-3 mb-4 mb-md-0">
              <div className="d-flex flex-column align-items-center">
                <i className="bi bi-person-check fs-1 mb-2"></i>
                <h3 className="mb-0">{stats.investorCount.toLocaleString()}</h3>
                <p className="mb-0 text-white-50">Investors</p>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="d-flex flex-column align-items-center">
                <i className="bi bi-cash-coin fs-1 mb-2"></i>
                <h3 className="mb-0">${stats.totalInvestment.toLocaleString()}</h3>
                <p className="mb-0 text-white-50">Total Invested</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="text-center mb-5">How It Works</h2>
          
          <ul className="nav nav-pills mb-5 justify-content-center" id="howItWorksTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button 
                className="nav-link active"
                id="entrepreneurs-tab"
                data-bs-toggle="pill"
                data-bs-target="#entrepreneurs"
                type="button"
                role="tab"
                aria-controls="entrepreneurs"
                aria-selected="true"
              >
                For Entrepreneurs
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className="nav-link"
                id="investors-tab"
                data-bs-toggle="pill"
                data-bs-target="#investors"
                type="button"
                role="tab"
                aria-controls="investors"
                aria-selected="false"
              >
                For Investors
              </button>
            </li>
          </ul>
          
          <div className="tab-content" id="howItWorksTabContent">
            <div 
              className="tab-pane fade show active"
              id="entrepreneurs"
              role="tabpanel"
              aria-labelledby="entrepreneurs-tab"
            >
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center p-4">
                      <div className="rounded-circle bg-light p-3 d-inline-flex mb-3">
                        <i className="bi bi-pencil-square fs-4 text-dark"></i>
                      </div>
                      <h4>1. Submit Your Project</h4>
                      <p className="text-muted">
                        Create an account and submit your project with details, media, and investment requirements.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center p-4">
                      <div className="rounded-circle bg-light p-3 d-inline-flex mb-3">
                        <i className="bi bi-check2-circle fs-4 text-dark"></i>
                      </div>
                      <h4>2. Get Approved</h4>
                      <p className="text-muted">
                        Our team reviews your project to ensure quality and legitimacy before listing it publicly.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center p-4">
                      <div className="rounded-circle bg-light p-3 d-inline-flex mb-3">
                        <i className="bi bi-graph-up-arrow fs-4 text-dark"></i>
                      </div>
                      <h4>3. Receive Investments</h4>
                      <p className="text-muted">
                        Connect with investors, track your progress, and receive funds to bring your idea to life.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              className="tab-pane fade"
              id="investors"
              role="tabpanel"
              aria-labelledby="investors-tab"
            >
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center p-4">
                      <div className="rounded-circle bg-light p-3 d-inline-flex mb-3">
                        <i className="bi bi-search fs-4 text-dark"></i>
                      </div>
                      <h4>1. Discover Projects</h4>
                      <p className="text-muted">
                        Browse through verified projects from innovative entrepreneurs across various categories.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center p-4">
                      <div className="rounded-circle bg-light p-3 d-inline-flex mb-3">
                        <i className="bi bi-cash-stack fs-4 text-dark"></i>
                      </div>
                      <h4>2. Choose Investment</h4>
                      <p className="text-muted">
                        Select the amount you wish to invest based on your budget and project potential.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center p-4">
                      <div className="rounded-circle bg-light p-3 d-inline-flex mb-3">
                        <i className="bi bi-trophy fs-4 text-dark"></i>
                      </div>
                      <h4>3. Reap Rewards</h4>
                      <p className="text-muted">
                        Track your investments and receive the promised returns, whether equity, products, or early access.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="text-center mb-5">What Our Community Says</h2>
          
          <div className="row g-4">
            {[
              {
                id: 1,
                name: 'Jessica Chen',
                role: 'Entrepreneur',
                company: 'EcoTech Solutions',
                quote: 'Launch Tribe helped me raise funds for my sustainable packaging startup within just 3 weeks. The platform is intuitive and the investor community is highly engaged.',
                image: 'https://randomuser.me/api/portraits/women/32.jpg'
              },
              {
                id: 2,
                name: 'Michael Rodriguez',
                role: 'Angel Investor',
                company: '',
                quote: 'As someone who enjoys investing in early-stage startups, Launch Tribe gives me access to quality projects that have been pre-vetted. The investment process is seamless.',
                image: 'https://randomuser.me/api/portraits/men/46.jpg'
              },
              {
                id: 3,
                name: 'Sarah Washington',
                role: 'Student Investor',
                company: 'NYU',
                quote: 'I started investing small amounts while in college. Launch Tribe makes it easy to find projects that accept micro-investments, allowing me to build a diverse portfolio.',
                image: 'https://randomuser.me/api/portraits/women/65.jpg'
              }
            ].map(testimonial => (
              <div key={testimonial.id} className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <p className="card-text mb-4">"{testimonial.quote}"</p>
                    
                    <div className="d-flex align-items-center">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="rounded-circle me-3"
                        width="50"
                        height="50"
                      />
                      <div>
                        <h6 className="mb-0">{testimonial.name}</h6>
                        <p className="text-muted small mb-0">
                          {testimonial.role}
                          {testimonial.company && `, ${testimonial.company}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-black text-white text-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="mb-4">Ready to Get Started?</h2>
              <p className="lead mb-4">
                Whether you're an entrepreneur with a great idea or an investor looking for opportunities,
                Launch Tribe is the platform for you.
              </p>
              <Link href="/signup" className="btn btn-light btn-lg px-4">
                Join Launch Tribe Today
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}