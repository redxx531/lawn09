import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ProjectDetail from '@/components/projects/ProjectDetail';
import { Project } from '@/types';

export default function ProjectPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!id) return;
    
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Project not found');
          }
          throw new Error('Failed to fetch project details');
        }
        
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError(error instanceof Error ? error.message : 'An error occurred while loading the project');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [id]);
  
  if (loading) {
    return (
      <Layout title="Loading Project - Launch Tribe">
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading project details...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout title="Error - Launch Tribe">
        <div className="container py-5">
          <div className="alert alert-danger">
            <h4 className="alert-heading">Error!</h4>
            <p>{error}</p>
            <hr />
            <div className="d-flex justify-content-between">
              <button 
                className="btn btn-outline-danger" 
                onClick={() => router.back()}
              >
                Go Back
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => router.push('/projects')}
              >
                Browse All Projects
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!project) {
    return null;
  }
  
  return (
    <Layout 
      title={`${project.title} - Launch Tribe`}
      description={project.description.substring(0, 160)}
    >
      <div className="container py-5">
        <ProjectDetail project={project} />
      </div>
    </Layout>
  );
}