import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { UserType } from '@/types';
import ProjectForm from '@/components/entrepreneur/ProjectForm';

export default function NewProject() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/entrepreneur/new-project');
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
    <Layout title="Submit New Project - Launch Tribe">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <nav aria-label="breadcrumb" className="mb-4">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/dashboard/entrepreneur">Dashboard</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Submit New Project
                </li>
              </ol>
            </nav>
            
            <ProjectForm />
          </div>
        </div>
      </div>
    </Layout>
  );
}