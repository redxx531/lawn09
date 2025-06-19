import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { UserType } from '@/types';
import InvestmentsDashboard from '@/components/investor/InvestmentsDashboard';

export default function InvestorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/investor');
    } else if (status === 'authenticated' && session.user.userType !== UserType.INVESTOR) {
      router.push('/');
    }
  }, [status, session, router]);
  
  if (status === 'loading') {
    return (
      <Layout title="Loading...">
        <div className="container py-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!session || session.user.userType !== UserType.INVESTOR) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <Layout title="Investor Dashboard - Launch Tribe">
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0">Investor Dashboard</h1>
          <a href="/projects" className="btn btn-primary">
            <i className="bi bi-search me-2"></i>
            Discover Projects
          </a>
        </div>
        
        <InvestmentsDashboard />
      </div>
    </Layout>
  );
}