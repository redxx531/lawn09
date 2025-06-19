import { useState, useEffect } from 'react';

interface FiltersProps {
  onFilterChange: (filters: FilterValues) => void;
}

export interface FilterValues {
  category: string;
  minInvestment: number | '';
  maxInvestment: number | '';
  rewardType: string;
  searchTerm: string;
}

export default function ProjectFilters({ onFilterChange }: FiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    category: '',
    minInvestment: '',
    maxInvestment: '',
    rewardType: '',
    searchTerm: '',
  });
  
  const [categories, setCategories] = useState<string[]>([]);
  const [rewardTypes, setRewardTypes] = useState<string[]>([]);
  
  useEffect(() => {
    // Fetch categories and reward types
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('/api/projects/filter-options');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories);
          setRewardTypes(data.rewardTypes);
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };
    
    fetchFilterOptions();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let parsedValue: string | number = value;
    
    // Parse numeric values
    if ((name === 'minInvestment' || name === 'maxInvestment') && value !== '') {
      parsedValue = parseInt(value, 10);
    }
    
    setFilters(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };
  
  const handleReset = () => {
    const resetFilters = {
      category: '',
      minInvestment: '',
      maxInvestment: '',
      rewardType: '',
      searchTerm: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };
  
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Filter Projects</h5>
        
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-12">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search projects..."
                  name="searchTerm"
                  value={filters.searchTerm}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="col-md-6">
              <select
                className="form-select"
                name="category"
                value={filters.category}
                onChange={handleInputChange}
                aria-label="Category"
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="col-md-6">
              <select
                className="form-select"
                name="rewardType"
                value={filters.rewardType}
                onChange={handleInputChange}
                aria-label="Reward Type"
              >
                <option value="">All Reward Types</option>
                {rewardTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min Investment"
                  name="minInvestment"
                  value={filters.minInvestment}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max Investment"
                  name="maxInvestment"
                  value={filters.maxInvestment}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>
            
            <div className="col-12 d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleReset}
              >
                Reset
              </button>
              <button type="submit" className="btn btn-primary">
                Apply Filters
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}