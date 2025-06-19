import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [siteSettings, setSiteSettings] = useState({
    site_name: 'Launch Tribe',
    footer_copyright: `Copyright © ${currentYear} Launch Tribe. All rights reserved.`,
    social_twitter: '#',
    social_facebook: '#',
    social_instagram: '#',
    social_linkedin: '#',
    contact_email: 'contact@launchtribe.com',
    support_email: 'support@launchtribe.com'
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
  
  // Replace {{YEAR}} in copyright text with current year
  const copyrightText = siteSettings.footer_copyright.replace('{{YEAR}}', currentYear.toString());
  
  return (
    <footer className="pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4 mb-lg-0">
            <Link href="/" className="text-decoration-none">
              <h5 className="fw-bold fs-4 mb-3" style={{ letterSpacing: '-0.02em', color: "#0d6efd" }}>Launch<span className="text-dark">Tribe</span></h5>
            </Link>
            <p className="text-muted mb-4">Connecting entrepreneurs with investors of all levels to bring innovative ideas to life.</p>
            <div className="d-flex gap-3 fs-5 mb-4">
              <a href={siteSettings.social_twitter} className="text-secondary text-decoration-none" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-twitter"></i>
              </a>
              <a href={siteSettings.social_facebook} className="text-secondary text-decoration-none" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-facebook"></i>
              </a>
              <a href={siteSettings.social_instagram} className="text-secondary text-decoration-none" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-instagram"></i>
              </a>
              <a href={siteSettings.social_linkedin} className="text-secondary text-decoration-none" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
          
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-semibold mb-3">Explore</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/projects" className="text-decoration-none text-secondary">Browse Projects</Link></li>
              <li className="mb-2"><Link href="/blog" className="text-decoration-none text-secondary">Blog</Link></li>
              <li className="mb-2"><Link href="/about" className="text-decoration-none text-secondary">About Us</Link></li>
              <li className="mb-2"><Link href="/faq" className="text-decoration-none text-secondary">FAQs</Link></li>
            </ul>
          </div>
          
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-semibold mb-3">Join Us</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/signup" className="text-decoration-none text-secondary">Sign Up</Link></li>
              <li className="mb-2"><Link href="/login" className="text-decoration-none text-secondary">Login</Link></li>
              <li className="mb-2"><Link href="/dashboard/entrepreneur/new-project" className="text-decoration-none text-secondary">Submit Project</Link></li>
              <li className="mb-2"><Link href="/contact" className="text-decoration-none text-secondary">Contact Us</Link></li>
            </ul>
          </div>
          
          <div className="col-md-6 col-lg-4">
            <h6 className="fw-semibold mb-3">Newsletter</h6>
            <p className="text-secondary mb-3">Subscribe to get the latest updates on new projects and features.</p>
            <form className="mb-3">
              <div className="input-group">
                <input type="email" className="form-control" placeholder="Your email address" aria-label="Email" required />
                <button className="btn btn-primary" type="submit">Subscribe</button>
              </div>
            </form>
            <div className="text-secondary">
              <div className="mb-1"><i className="bi bi-envelope me-2"></i> {siteSettings.contact_email}</div>
              <div><i className="bi bi-headset me-2"></i> {siteSettings.support_email}</div>
            </div>
          </div>
        </div>
        
        <hr className="my-4" style={{ opacity: 0.1 }} />
        
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-md-0 text-secondary small">{copyrightText}</p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <Link href="/privacy" className="text-decoration-none small text-secondary">Privacy Policy</Link>
              </li>
              <li className="list-inline-item ms-3">
                <Link href="/terms" className="text-decoration-none small text-secondary">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}