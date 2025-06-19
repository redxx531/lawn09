import { useState, useEffect } from 'react';
import { Project } from '@/types';
import ProjectCard from './ProjectCard';
import ProjectFilters, { FilterValues } from './ProjectFilters';

export default function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterValues>({
    category: '',
    minInvestment: '',
    maxInvestment: '',
    rewardType: '',
    searchTerm: '',
  });
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        setProjects(data);
        setFilteredProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  useEffect(() => {
    // Apply filters
    let results = [...projects];
    
    // Search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(project => 
        project.title.toLowerCase().includes(term) || 
        project.description.toLowerCase().includes(term)
      );
    }
    
    // Category
    if (filters.category) {
      results = results.filter(project => project.category === filters.category);
    }
    
    // Reward type
    if (filters.rewardType) {
      results = results.filter(project => project.rewardType === filters.rewardType);
    }
    
    // Min investment
    if (filters.minInvestment !== '') {
      results = results.filter(project => project.minimumInvestment >= filters.minInvestment);
    }
    
    // Max investment
    if (filters.maxInvestment !== '') {
      results = results.filter(project => project.minimumInvestment <= filters.maxInvestment);
    }
    
    setFilteredProjects(results);
  }, [filters, projects]);
  
  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };
  
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading projects...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }
  
  return (
    <div>
      <ProjectFilters onFilterChange={handleFilterChange} />
      
      {filteredProjects.length === 0 ? (
        <div className="alert alert-info text-center">
          No projects found matching your criteria.
        </div>
      ) : (
        <div className="row g-4">
          {filteredProjects.map(project => (
            <div key={project.id} className="col-md-6 col-lg-4">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}