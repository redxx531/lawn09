import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { UserType } from '@/types';
import { useState, useEffect } from 'react';

export default function Hero() {
  const { data: session } = useSession();
  const [siteSettings, setSiteSettings] = useState({
    homepage_hero_title: 'Turn Ideas Into Reality',
    homepage_hero_subtitle: 'Launch Tribe connects entrepreneurs with investors of all levels. Whether you\'re looking to fund your next big idea or discover promising ventures, you\'re in the right place.'
  });

  useEffect(() => {
    // Fetch site settings
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSiteSettings(data);
        }
      } catch (error) {
        console.error('Failed to fetch site settings', error);
      }
    };

    fetchSettings();
  }, []);
  
  const getStartedLink = () => {
    if (!session) return '/signup';
    
    switch (session.user.userType) {
      case UserType.ENTREPRENEUR:
        return '/dashboard/entrepreneur/new-project';
      case UserType.INVESTOR:
        return '/projects';
      case UserType.ADMIN:
        return '/dashboard/admin';
      default:
        return '/signup';
    }
  };
  
  const getStartedText = () => {
    if (!session) return 'Get Started';
    
    switch (session.user.userType) {
      case UserType.ENTREPRENEUR:
        return 'Submit Your Project';
      case UserType.INVESTOR:
        return 'Discover Projects';
      case UserType.ADMIN:
        return 'Go to Dashboard';
      default:
        return 'Get Started';
    }
  };

  return (
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
  );
}