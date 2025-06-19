import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { UserType } from '@/types';
import DashboardStats from '@/components/admin/DashboardStats';
import ProjectApprovalList from '@/components/admin/ProjectApprovalList';
import RecentActivity from '@/components/admin/RecentActivity';
import UserManagement from '@/components/admin/UserManagement';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/admin');
    } else if (status === 'authenticated' && session.user.userType !== UserType.ADMIN) {
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
  
  if (!session || session.user.userType !== UserType.ADMIN) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <Layout title="Admin Dashboard - Launch Tribe">
      <div className="container-fluid py-5">
        <div className="row">
          <div className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <div className="position-sticky pt-3">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <button 
                    className={`nav-link btn btn-link text-start ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    <i className="bi bi-speedometer2 me-2"></i>
                    Overview
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link btn btn-link text-start ${activeTab === 'approvals' ? 'active' : ''}`}
                    onClick={() => setActiveTab('approvals')}
                  >
                    <i className="bi bi-check-square me-2"></i>
                    Project Approvals
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link btn btn-link text-start ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                  >
                    <i className="bi bi-people me-2"></i>
                    User Management
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link btn btn-link text-start ${activeTab === 'activity' ? 'active' : ''}`}
                    onClick={() => setActiveTab('activity')}
                  >
                    <i className="bi bi-activity me-2"></i>
                    Recent Activity
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-4 border-bottom">
              <h1 className="h2">Admin Dashboard</h1>
            </div>
            
            {activeTab === 'overview' && (
              <div>
                <DashboardStats />
                
                <div className="row mt-4">
                  <div className="col-md-6 mb-4">
                    <h4 className="mb-3">Pending Approvals</h4>
                    <ProjectApprovalList />
                  </div>
                  <div className="col-md-6 mb-4">
                    <h4 className="mb-3">Recent Activity</h4>
                    <RecentActivity />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'approvals' && (
              <div>
                <h2 className="mb-4">Project Approvals</h2>
                <ProjectApprovalList />
              </div>
            )}
            
            {activeTab === 'users' && (
              <div>
                <h2 className="mb-4">User Management</h2>
                <UserManagement />
              </div>
            )}
            
            {activeTab === 'activity' && (
              <div>
                <h2 className="mb-4">Recent Activity</h2>
                <RecentActivity />
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}