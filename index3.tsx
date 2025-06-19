import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { UserType } from '@/types';
import ProjectsList from '@/components/entrepreneur/ProjectsList';
import InvestmentsList from '@/components/entrepreneur/InvestmentsList';
import Link from 'next/link';

export default function EntrepreneurDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/entrepreneur');
    } else if (status === 'authenticated' && session.user.userType !== UserType.ENTREPRENEUR) {
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
  
  if (!session || session.user.userType !== UserType.ENTREPRENEUR) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <Layout title="Entrepreneur Dashboard - Launch Tribe">
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0">Entrepreneur Dashboard</h1>
          <Link href="/dashboard/entrepreneur/new-project" className="btn btn-primary">
            <i className="bi bi-plus-lg me-2"></i>
            Submit New Project
          </Link>
        </div>
        
        <div className="row g-4">
          <div className="col-12">
            <h3 className="mb-3">Your Projects</h3>
            <ProjectsList />
          </div>
          
          <div className="col-12 mt-5">
            <h3 className="mb-3">Investment Activity</h3>
            <InvestmentsList />
          </div>
        </div>
      </div>
    </Layout>
  );
}