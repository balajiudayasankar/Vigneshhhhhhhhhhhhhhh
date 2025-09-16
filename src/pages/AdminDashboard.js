import React, { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';
import { contributorApi } from '../api/contributorApi';
import { categoryApi } from '../api/categoryApi';
import { articleApi } from '../api/articleApi';
import { toastrService } from '../services/toastrService';
import { helpers } from '../utils/helpers';
import { formatters } from '../utils/formatters';

// Import components
import StatsCard from '../components/Dashboard/StatsCard';
import ContributorList from '../components/Contributors/ContributorList';
import CategoryList from '../components/Categories/CategoryList';
import ArticleList from '../components/Articles/ArticleList';
import Modal from '../components/Common/Modal';
import Button from '../components/Common/Button';
import InputField from '../components/Common/InputField';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ConfirmDialog from '../components/Common/ConfirmDialog';

const AdminDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Data states
  const [dashboardStats, setDashboardStats] = useState({});
  const [users, setUsers] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [pendingContributors, setPendingContributors] = useState([]);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);

  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Form states
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userFormData, setUserFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    roleId: 2,
    isActive: true
  });

  // Bulk operations
  const [selectedItems, setSelectedItems] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [
        usersResult, 
        contributorsResult, 
        pendingResult, 
        articlesResult, 
        categoriesResult
      ] = await Promise.all([
        userApi.getAllUsers(),
        contributorApi.getApprovedContributors(),
        contributorApi.getPendingApprovals(),
        articleApi.getPublishedArticles(),
        categoryApi.getAllCategories()
      ]);

      const usersData = usersResult.data || [];
      const contributorsData = contributorsResult.data || [];
      const pendingData = pendingResult.data || [];
      const articlesData = articlesResult.data || [];
      const categoriesData = categoriesResult.data || [];

      setUsers(usersData);
      setContributors(contributorsData);
      setPendingContributors(pendingData);
      setArticles(articlesData);
      setCategories(categoriesData);

      // Calculate dashboard statistics
      setDashboardStats({
        totalUsers: usersData.length,
        activeUsers: usersData.filter(u => u.isActive).length,
        totalContributors: contributorsData.length,
        pendingApprovals: pendingData.length,
        totalArticles: articlesData.length,
        publishedArticles: articlesData.filter(a => a.status === 'Published').length,
        totalCategories: categoriesData.length,
        activeCategories: categoriesData.filter(c => c.isActive !== false).length,
        totalViews: articlesData.reduce((sum, a) => sum + (a.viewCount || 0), 0),
        averageRating: articlesData.length > 0 ? 
          (articlesData.reduce((sum, a) => sum + (a.averageRating || 0), 0) / articlesData.length).toFixed(1) : 0
      });

    } catch (error) {
      toastrService.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // User Management Functions
  const handleCreateUser = () => {
    setSelectedUser(null);
    setUserFormData({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      roleId: 2,
      isActive: true
    });
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      department: user.department || '',
      roleId: user.roleId || 2,
      isActive: user.isActive
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
    try {
      setActionLoading(true);
      
      if (selectedUser) {
        await userApi.updateUser(selectedUser.id, userFormData);
        toastrService.success('User updated successfully');
      } else {
        await userApi.createUser(userFormData);
        toastrService.success('User created successfully');
      }
      
      setShowUserModal(false);
      loadDashboardData();
    } catch (error) {
      toastrService.error('Failed to save user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = (user) => {
    setConfirmAction(() => async () => {
      try {
        await userApi.deleteUser(user.id);
        toastrService.success('User deleted successfully');
        loadDashboardData();
      } catch (error) {
        toastrService.error('Failed to delete user');
      }
    });
    setShowConfirmDialog(true);
  };

  // Contributor Management
  const handleApproveContributor = async (contributor, approved) => {
    try {
      setActionLoading(true);
      const approvalData = {
        isApproved: approved,
        approvalNotes: approved ? 'Approved by admin' : 'Rejected by admin'
      };
      
      await contributorApi.approveContributor(contributor.id, approvalData);
      toastrService.success(`Contributor ${approved ? 'approved' : 'rejected'} successfully`);
      loadDashboardData();
    } catch (error) {
      toastrService.error('Failed to process contributor approval');
    } finally {
      setActionLoading(false);
    }
  };

  // Bulk Operations
  const handleBulkAction = async () => {
    if (!bulkAction || selectedItems.length === 0) return;

    try {
      setActionLoading(true);
      
      switch (bulkAction) {
        case 'activate-users':
          for (const userId of selectedItems) {
            await userApi.updateUser(userId, { isActive: true });
          }
          toastrService.success(`${selectedItems.length} users activated`);
          break;
          
        case 'deactivate-users':
          for (const userId of selectedItems) {
            await userApi.updateUser(userId, { isActive: false });
          }
          toastrService.success(`${selectedItems.length} users deactivated`);
          break;
          
        default:
          toastrService.warning('Please select a valid action');
      }
      
      setSelectedItems([]);
      setBulkAction('');
      loadDashboardData();
    } catch (error) {
      toastrService.error('Bulk operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Export Functions
  const handleExportData = (type) => {
    let data = [];
    let filename = '';
    
    switch (type) {
      case 'users':
        data = users.map(u => ({
          Name: `${u.firstName} ${u.lastName}`,
          Email: u.email,
          Department: u.department,
          Role: u.roleName,
          Status: u.isActive ? 'Active' : 'Inactive',
          'Join Date': formatters.date(u.createdDate)
        }));
        filename = 'users-export.csv';
        break;
        
      case 'contributors':
        data = contributors.map(c => ({
          Name: c.userName,
          Email: c.userEmail,
          'Article Count': c.articleCount || 0,
          'Approved Date': formatters.date(c.approvedDate),
          Status: c.isApproved ? 'Approved' : 'Pending'
        }));
        filename = 'contributors-export.csv';
        break;
        
      case 'articles':
        data = articles.map(a => ({
          Title: a.title,
          Author: a.contributorName,
          Category: a.categoryName,
          Status: a.status,
          Views: a.viewCount || 0,
          'Created Date': formatters.date(a.createdDate),
          'Published Date': a.publishedDate ? formatters.date(a.publishedDate) : 'N/A'
        }));
        filename = 'articles-export.csv';
        break;
    }
    
    if (data.length > 0) {
      helpers.exportToCsv(data, filename);
      toastrService.success('Data exported successfully');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading admin dashboard..." />;
  }

  return (
    <div className="container-fluid mt-4">
      {/* Dashboard Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2>
              <i className="fas fa-tachometer-alt me-2 text-primary"></i>
              Admin Dashboard
            </h2>
            
            <div className="btn-group">
              <button 
                className="btn btn-success"
                onClick={handleCreateUser}
              >
                <i className="fas fa-user-plus me-1"></i>
                Add User
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setActiveTab('system-settings')}
              >
                <i className="fas fa-cog me-1"></i>
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-pills">
            {[
              { id: 'overview', label: 'Overview', icon: 'fas fa-chart-pie' },
              { id: 'users', label: 'Users', icon: 'fas fa-users' },
              { id: 'contributors', label: 'Contributors', icon: 'fas fa-user-edit' },
              { id: 'articles', label: 'Articles', icon: 'fas fa-file-alt' },
              { id: 'categories', label: 'Categories', icon: 'fas fa-tags' },
              { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-line' },
              { id: 'system-settings', label: 'Settings', icon: 'fas fa-cog' }
            ].map(tab => (
              <li key={tab.id} className="nav-item">
                <button 
                  className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <i className={`${tab.icon} me-1`}></i>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-lg-3 col-md-6 mb-3">
              <StatsCard
                title="Total Users"
                value={dashboardStats.totalUsers}
                icon="fas fa-users"
                color="primary"
                onClick={() => setActiveTab('users')}
              />
            </div>
            <div className="col-lg-3 col-md-6 mb-3">
              <StatsCard
                title="Contributors"
                value={dashboardStats.totalContributors}
                icon="fas fa-user-edit"
                color="success"
                onClick={() => setActiveTab('contributors')}
              />
            </div>
            <div className="col-lg-3 col-md-6 mb-3">
              <StatsCard
                title="Pending Approvals"
                value={dashboardStats.pendingApprovals}
                icon="fas fa-clock"
                color="warning"
                onClick={() => setActiveTab('contributors')}
              />
            </div>
            <div className="col-lg-3 col-md-6 mb-3">
              <StatsCard
                title="Total Articles"
                value={dashboardStats.totalArticles}
                icon="fas fa-file-alt"
                color="info"
                onClick={() => setActiveTab('articles')}
              />
            </div>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="row">
            <div className="col-md-8">
              {/* Recent Users */}
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Recent Users</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Department</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.slice(0, 5).map(user => (
                          <tr key={user.id}>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.department}</td>
                            <td>
                              <span className={`badge ${user.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>
                              <button 
                                className="btn btn-sm btn-outline-primary me-1"
                                onClick={() => handleEditUser(user)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              {/* Quick Stats */}
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">System Health</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Database Status</span>
                      <span className="badge bg-success">Healthy</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Active Sessions</span>
                      <span className="badge bg-info">{dashboardStats.activeUsers}</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Storage Used</span>
                      <span className="badge bg-warning">2.3 GB</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Last Backup</span>
                      <span className="badge bg-secondary">2 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Options */}
              <div className="card mt-3">
                <div className="card-header">
                  <h6 className="card-title mb-0">Export Data</h6>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleExportData('users')}
                    >
                      <i className="fas fa-download me-1"></i>
                      Export Users
                    </button>
                    <button 
                      className="btn btn-outline-success btn-sm"
                      onClick={() => handleExportData('contributors')}
                    >
                      <i className="fas fa-download me-1"></i>
                      Export Contributors
                    </button>
                    <button 
                      className="btn btn-outline-info btn-sm"
                      onClick={() => handleExportData('articles')}
                    >
                      <i className="fas fa-download me-1"></i>
                      Export Articles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          {/* User Management Header */}
          <div className="row mb-4">
            <div className="col-md-6">
              <h4>User Management</h4>
              <p className="text-muted">Manage all system users and their permissions</p>
            </div>
            <div className="col-md-6 text-md-end">
              {selectedItems.length > 0 && (
                <div className="d-flex align-items-center justify-content-end gap-2">
                  <select 
                    className="form-select form-select-sm"
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    style={{ width: 'auto' }}
                  >
                    <option value="">Bulk Actions</option>
                    <option value="activate-users">Activate Users</option>
                    <option value="deactivate-users">Deactivate Users</option>
                  </select>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleBulkAction}
                    loading={actionLoading}
                  >
                    Apply ({selectedItems.length})
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Users Table */}
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>
                        <input 
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems(users.map(u => u.id));
                            } else {
                              setSelectedItems([]);
                            }
                          }}
                        />
                      </th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Join Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>
                          <input 
                            type="checkbox"
                            checked={selectedItems.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems([...selectedItems, user.id]);
                              } else {
                                setSelectedItems(selectedItems.filter(id => id !== user.id));
                              }
                            }}
                          />
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div 
                              className="rounded-circle d-flex align-items-center justify-content-center me-2"
                              style={{
                                width: '32px',
                                height: '32px',
                                backgroundColor: helpers.getAvatarColor(`${user.firstName} ${user.lastName}`),
                                color: 'white',
                                fontSize: '12px'
                              }}
                            >
                              {helpers.getInitials(`${user.firstName} ${user.lastName}`)}
                            </div>
                            {user.firstName} {user.lastName}
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.department}</td>
                        <td>
                          <span className={`badge ${user.roleName === 'Admin' ? 'bg-danger' : 'bg-primary'}`}>
                            {user.roleName}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${user.isActive ? 'bg-success' : 'bg-secondary'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{formatters.date(user.createdDate)}</td>
                        <td>
                          <div className="btn-group">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditUser(user)}
                              title="Edit User"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteUser(user)}
                              title="Delete User"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'contributors' && (
        <div>
          <div className="row mb-4">
            <div className="col-md-6">
              <h4>Contributor Management</h4>
              <p className="text-muted">Manage contributor approvals and permissions</p>
            </div>
          </div>

          {/* Pending Approvals */}
          {pendingContributors.length > 0 && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-clock me-2 text-warning"></i>
                  Pending Approvals ({pendingContributors.length})
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {pendingContributors.map(contributor => (
                    <div key={contributor.id} className="col-md-4 mb-3">
                      <div className="card border-warning">
                        <div className="card-body">
                          <h6>{contributor.userName}</h6>
                          <p className="text-muted mb-2">{contributor.userEmail}</p>
                          <p className="mb-2">
                            <strong>Department:</strong> {contributor.department || 'N/A'}
                          </p>
                          {contributor.proofDocument && (
                            <p className="mb-3">
                              <a 
                                href={contributor.proofDocument} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-outline-secondary btn-sm"
                              >
                                <i className="fas fa-file-alt me-1"></i>
                                View Proof
                              </a>
                            </p>
                          )}
                          <div className="d-flex gap-2">
                            <Button
                              size="sm"
                              variant="success"
                              icon="fas fa-check"
                              onClick={() => handleApproveContributor(contributor, true)}
                              loading={actionLoading}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              icon="fas fa-times"
                              onClick={() => handleApproveContributor(contributor, false)}
                              loading={actionLoading}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Approved Contributors */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-user-check me-2 text-success"></i>
                Approved Contributors ({contributors.length})
              </h5>
            </div>
            <div className="card-body">
              <ContributorList
                contributors={contributors}
                showActions={true}
                onEdit={(contributor) => console.log('Edit contributor:', contributor)}
                onDelete={(contributor) => console.log('Delete contributor:', contributor)}
                onViewProfile={(contributor) => console.log('View profile:', contributor)}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'articles' && (
        <div>
          <div className="row mb-4">
            <div className="col-md-6">
              <h4>Article Management</h4>
              <p className="text-muted">Review, approve, and manage all articles</p>
            </div>
          </div>

          <ArticleList
            articles={articles}
            showActions={true}
            onEdit={(article) => console.log('Edit article:', article)}
            onDelete={(article) => console.log('Delete article:', article)}
          />
        </div>
      )}

      {activeTab === 'categories' && (
        <div>
          <div className="row mb-4">
            <div className="col-md-6">
              <h4>Category Management</h4>
              <p className="text-muted">Organize content with categories</p>
            </div>
            <div className="col-md-6 text-md-end">
              <Button
                variant="primary"
                icon="fas fa-plus"
                onClick={() => {
                  setSelectedCategory(null);
                  setShowCategoryModal(true);
                }}
              >
                Add Category
              </Button>
            </div>
          </div>

          <CategoryList
            categories={categories}
            showActions={true}
            onEdit={(category) => {
              setSelectedCategory(category);
              setShowCategoryModal(true);
            }}
            onDelete={(category) => console.log('Delete category:', category)}
          />
        </div>
      )}

      {/* Modals */}
      
      {/* User Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title={selectedUser ? 'Edit User' : 'Add New User'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowUserModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSaveUser}
              loading={actionLoading}
            >
              {selectedUser ? 'Update User' : 'Create User'}
            </Button>
          </>
        }
      >
        <form>
          <div className="row">
            <div className="col-md-6">
              <InputField
                name="firstName"
                label="First Name"
                value={userFormData.firstName}
                onChange={(e) => setUserFormData({...userFormData, firstName: e.target.value})}
                required
              />
            </div>
            <div className="col-md-6">
              <InputField
                name="lastName"
                label="Last Name"
                value={userFormData.lastName}
                onChange={(e) => setUserFormData({...userFormData, lastName: e.target.value})}
                required
              />
            </div>
          </div>
          
          <InputField
            type="email"
            name="email"
            label="Email Address"
            value={userFormData.email}
            onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
            required
          />
          
          <InputField
            name="department"
            label="Department"
            value={userFormData.department}
            onChange={(e) => setUserFormData({...userFormData, department: e.target.value})}
          />
          
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={userFormData.roleId}
                  onChange={(e) => setUserFormData({...userFormData, roleId: parseInt(e.target.value)})}
                >
                  <option value={1}>Admin</option>
                  <option value={2}>User</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <div className="form-check mt-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={userFormData.isActive}
                    onChange={(e) => setUserFormData({...userFormData, isActive: e.target.checked})}
                  />
                  <label className="form-check-label">Active User</label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onConfirm={() => {
          confirmAction();
          setShowConfirmDialog(false);
        }}
        onCancel={() => setShowConfirmDialog(false)}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action?"
      />
    </div>
  );
};

export default AdminDashboard;
