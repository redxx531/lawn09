import { useSession } from 'next-auth/react';
import { UserType } from '@/types';

export default function HowItWorks() {
  const { data: session } = useSession();
  
  const isEntrepreneur = !session || session.user.userType === UserType.ENTREPRENEUR;
  
  return (
    <section className="py-5 bg-white">
      <div className="container">
        <h2 className="text-center mb-5">How It Works</h2>
        
        <ul className="nav nav-pills mb-5 justify-content-center" id="howItWorksTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button 
              className={`nav-link ${isEntrepreneur ? 'active' : ''}`}
              id="entrepreneurs-tab"
              data-bs-toggle="pill"
              data-bs-target="#entrepreneurs"
              type="button"
              role="tab"
              aria-controls="entrepreneurs"
              aria-selected={isEntrepreneur}
            >
              For Entrepreneurs
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button 
              className={`nav-link ${!isEntrepreneur ? 'active' : ''}`}
              id="investors-tab"
              data-bs-toggle="pill"
              data-bs-target="#investors"
              type="button"
              role="tab"
              aria-controls="investors"
              aria-selected={!isEntrepreneur}
            >
              For Investors
            </button>
          </li>
        </ul>
        
        <div className="tab-content" id="howItWorksTabContent">
          <div 
            className={`tab-pane fade ${isEntrepreneur ? 'show active' : ''}`}
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
            className={`tab-pane fade ${!isEntrepreneur ? 'show active' : ''}`}
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
  );
}