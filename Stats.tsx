import { useEffect, useState } from 'react';
import CountUp from 'react-countup';

interface StatsData {
  projectCount: number;
  entrepreneurCount: number;
  investorCount: number;
  totalInvestment: number;
}

export default function Stats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    
    fetchStats();
  }, []);
  
  if (!stats) {
    return null;
  }
  
  return (
    <section className="py-5 bg-black text-white">
      <div className="container">
        <div className="row text-center">
          <div className="col-md-3 mb-4 mb-md-0">
            <div className="d-flex flex-column align-items-center">
              <i className="bi bi-briefcase fs-1 mb-2"></i>
              <h3 className="mb-0">
                <CountUp end={stats.projectCount} duration={2.5} separator="," />
              </h3>
              <p className="mb-0 text-white-50">Active Projects</p>
            </div>
          </div>
          
          <div className="col-md-3 mb-4 mb-md-0">
            <div className="d-flex flex-column align-items-center">
              <i className="bi bi-people fs-1 mb-2"></i>
              <h3 className="mb-0">
                <CountUp end={stats.entrepreneurCount} duration={2.5} separator="," />
              </h3>
              <p className="mb-0 text-white-50">Entrepreneurs</p>
            </div>
          </div>
          
          <div className="col-md-3 mb-4 mb-md-0">
            <div className="d-flex flex-column align-items-center">
              <i className="bi bi-person-check fs-1 mb-2"></i>
              <h3 className="mb-0">
                <CountUp end={stats.investorCount} duration={2.5} separator="," />
              </h3>
              <p className="mb-0 text-white-50">Investors</p>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="d-flex flex-column align-items-center">
              <i className="bi bi-cash-coin fs-1 mb-2"></i>
              <h3 className="mb-0">$
                <CountUp end={stats.totalInvestment} duration={2.5} separator="," />
              </h3>
              <p className="mb-0 text-white-50">Total Invested</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}