import { useState, useEffect } from 'react';
import { User, UserType } from '@/types';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<string>('all');
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/users${selectedUserType !== 'all' ? `?type=${selectedUserType}` : ''}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [selectedUserType]);
  
  const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserType(e.target.value);
  };
  
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading users...</p>
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
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="card-title mb-0">User Management</h5>
          
          <div className="d-flex align-items-center">
            <label className="me-2">Filter by:</label>
            <select 
              className="form-select form-select-sm"
              value={selectedUserType}
              onChange={handleUserTypeChange}
            >
              <option value="all">All Users</option>
              <option value="entrepreneur">Entrepreneurs</option>
              <option value="investor">Investors</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
        
        {users.length === 0 ? (
          <div className="alert alert-info">
            No users found matching the selected filter.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>User Type</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name || '—'}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge bg-${
                        user.userType === UserType.ADMIN 
                          ? 'danger' 
                          : user.userType === UserType.ENTREPRENEUR 
                            ? 'primary' 
                            : 'success'
                      }`}>
                        {user.userType}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}