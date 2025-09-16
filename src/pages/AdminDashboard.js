import React, { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';
import { contributorApi } from '../api/contributorApi';
import { categoryApi } from '../api/categoryApi';
import { toastrService } from '../services/toastrService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalContributors: 0,
    pendingApprovals: 0,
    totalCategories: 0
  });
  const [pendingContributors, setPendingContributors] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#6B46C1'
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [usersResult, contributorsResult, pendingResult, categoriesResult] = await Promise.all([
        userApi.getAllUsers(),
        contributorApi.getApprovedContributors(),
        contributorApi.getPendingApprovals(),
        categoryApi.getAllCategories()
      ]);

      setUsers(usersResult.data || []);
      setPendingContributors(pendingResult.data || []);
      setCategories(categoriesResult.data || []);
      
      setStats({
        totalUsers: usersResult.data?.length || 0,
        totalContributors: contributorsResult.data?.length || 0,
        pendingApprovals: pendingResult.data?.length || 0,
        totalCategories: categoriesResult.data?.length || 0
      });
    } catch (error) {
      toastrService.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveContributor = async (contributorId, isApproved) => {
    try {
      const approvalData = {
        isApproved,
        approvalNotes: isApproved ? 'Approved by admin' : 'Rejected by admin'
      };
      
      await contributorApi.approveContributor(contributorId, approvalData);
      toastrService.success(`Contributor ${isApproved ? 'approved' : 'rejected'} successfully`);
      loadDashboardData();
    } catch (error) {
      toastrService.error('Failed to process contributor approval');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await categoryApi.createCategory(newCategory);
      toastrService.success('Category created successfully');
      setNewCategory({ name: '', description: '', color: '#6B46C1' });
      loadDashboardData();
    } catch (error) {
      toastrService.error('Failed to create category');
    }
  };

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">
            <i className="fas fa-tachometer-alt me-2 text-primary"></i>
            Admin Dashboard
          </h2>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="card-title">{stats.totalUsers}</h4>
                  <p className="card-text">Total Users</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-users fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="card-title">{stats.totalContributors}</h4>
                  <p className="card-text">Contributors</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-user-edit fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="card-title">{stats.pendingApprovals}</h4>
                  <p className="card-text">Pending Approvals</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-clock fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="card-title">{stats.totalCategories}</h4>
                  <p className="card-text">Categories</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-tags fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Pending Contributor Approvals */}
        <div className="col-md-8 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-user-check me-2"></i>
                Pending Contributor Approvals
              </h5>
            </div>
            <div className="card-body">
              {pendingContributors.length === 0 ? (
                <p className="text-muted">No pending approvals</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Request Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingContributors.map((contributor) => (
                        <tr key={contributor.id}>
                          <td>{contributor.userName}</td>
                          <td>{contributor.userEmail}</td>
                          <td>{new Date(contributor.createdDate).toLocaleDateString()}</td>
                          <td>
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => handleApproveContributor(contributor.id, true)}
                            >
                              <i className="fas fa-check"></i> Approve
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleApproveContributor(contributor.id, false)}
                            >
                              <i className="fas fa-times"></i> Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Category */}
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-plus me-2"></i>
                Create Category
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleCreateCategory}>
                <div className="mb-3">
                  <label htmlFor="categoryName" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="categoryName"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="categoryDescription" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="categoryDescription"
                    rows="3"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  ></textarea>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="categoryColor" className="form-label">Color</label>
                  <input
                    type="color"
                    className="form-control form-control-color"
                    id="categoryColor"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                  />
                </div>
                
                <button type="submit" className="btn btn-primary w-100">
                  <i className="fas fa-plus me-1"></i>
                  Create Category
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-users me-2"></i>
                Recent Users
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Join Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 10).map((user) => (
                      <tr key={user.id}>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.department}</td>
                        <td>
                          <span className={`badge ${user.roleName === 'Admin' ? 'bg-danger' : 'bg-primary'}`}>
                            {user.roleName}
                          </span>
                        </td>
                        <td>{new Date(user.createdDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${user.isActive ? 'bg-success' : 'bg-secondary'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;