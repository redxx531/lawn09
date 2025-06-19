import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { UserType } from '@/types';

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  
  const getDashboardLink = () => {
    if (!session) return '/login';
    
    switch (session.user.userType) {
      case UserType.ENTREPRENEUR:
        return '/dashboard/entrepreneur';
      case UserType.INVESTOR:
        return '/dashboard/investor';
      case UserType.ADMIN:
        return '/dashboard/admin';
      default:
        return '/';
    }
  };

  // If not mounted yet, return placeholder to prevent hydration mismatch
  if (!isMounted) {
    return <header className="navbar navbar-expand-lg navbar-light fixed-top bg-white shadow-sm"></header>;
  }

  return (
    <header className={`navbar navbar-expand-lg navbar-light fixed-top transition-all ${scrolled ? 'shadow-sm py-2' : 'py-3'}`} style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)' }}>
      <div className="container">
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <span className="fw-bold fs-4" style={{ letterSpacing: '-0.02em', color: "#0d6efd" }}>Launch<span className="text-dark">Tribe</span></span>
        </Link>
        
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={toggleNav}
          aria-controls="navbarNav"
          aria-expanded={isNavOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                href="/projects" 
                className={`nav-link ${router.pathname === '/projects' ? 'active fw-medium' : ''}`}
              >
                Explore Projects
              </Link>
            </li>
            
            <li className="nav-item">
              <Link 
                href="/blog" 
                className={`nav-link ${router.pathname.startsWith('/blog') ? 'active fw-medium' : ''}`}
              >
                Blog
              </Link>
            </li>
            
            <li className="nav-item dropdown">
              <a 
                className={`nav-link dropdown-toggle ${router.pathname === '/about' || router.pathname === '/faq' || router.pathname === '/contact' ? 'active fw-medium' : ''}`}
                href="#" 
                id="navbarDropdown" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                About
              </a>
              <ul className="dropdown-menu border-0 shadow-sm" aria-labelledby="navbarDropdown">
                <li>
                  <Link href="/about" className="dropdown-item">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="dropdown-item">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="dropdown-item">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </li>
            
            {session?.user.userType === UserType.ENTREPRENEUR && (
              <li className="nav-item">
                <Link 
                  href="/dashboard/entrepreneur/new-project" 
                  className={`nav-link ${router.pathname === '/dashboard/entrepreneur/new-project' ? 'active fw-medium' : ''}`}
                >
                  Submit Project
                </Link>
              </li>
            )}
          </ul>
          
          <ul className="navbar-nav">
            {session ? (
              <>
                <li className="nav-item">
                  <Link 
                    href={getDashboardLink()} 
                    className={`nav-link ${router.pathname.startsWith('/dashboard') ? 'active fw-medium' : ''}`}
                  >
                    <i className="bi bi-speedometer2 me-1"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle d-flex align-items-center" 
                    href="#" 
                    id="userDropdown" 
                    role="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    <div className="me-2 bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                      <i className="bi bi-person"></i>
                    </div>
                    <span>{session.user.name || session.user.email}</span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm" aria-labelledby="userDropdown">
                    <li>
                      <span className="dropdown-item-text text-muted small">
                        <i className="bi bi-person-badge me-2"></i>
                        {session.user.userType.charAt(0).toUpperCase() + session.user.userType.slice(1)}
                      </span>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <Link href="/profile" className="dropdown-item">
                        <i className="bi bi-gear me-2"></i> Profile Settings
                      </Link>
                    </li>
                    <li>
                      <button 
                        className="dropdown-item" 
                        onClick={() => signOut({ callbackUrl: '/' })}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link 
                    href="/login" 
                    className={`nav-link ${router.pathname === '/login' ? 'active fw-medium' : ''}`}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    href="/signup" 
                    className="btn btn-primary ms-2"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}