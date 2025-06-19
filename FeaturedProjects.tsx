import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Project } from '@/types';
import ProjectCard from '../projects/ProjectCard';

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects/featured');
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured projects');
        }
        
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching featured projects:', error);
        setError('Failed to load featured projects');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedProjects();
  }, []);
  
  if (loading) {
    return (
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Featured Projects</h2>
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Featured Projects</h2>
          <div className="alert alert-danger text-center">{error}</div>
        </div>
      </section>
    );
  }
  
  if (projects.length === 0) {
    return (
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Featured Projects</h2>
          <p className="text-center">No featured projects at the moment. Check back soon!</p>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h2>Featured Projects</h2>
          <Link href="/projects" className="btn btn-outline-primary">
            View All Projects
          </Link>
        </div>
        
        <div className="row g-4">
          {projects.map(project => (
            <div key={project.id} className="col-md-6 col-lg-4">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}