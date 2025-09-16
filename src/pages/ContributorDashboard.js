import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { contributorApi } from '../api/contributorApi';
import { articleApi } from '../api/articleApi';
import { categoryApi } from '../api/categoryApi';
import { feedbackApi } from '../api/feedbackApi';
import { uploadApi } from '../api/uploadApi';
import { toastrService } from '../services/toastrService';
import { formatters } from '../utils/formatters';
import { helpers } from '../utils/helpers';

// Components
import StatsCard from '../components/Dashboard/StatsCard';
import ArticleForm from '../components/Articles/ArticleForm';
import ArticleList from '../components/Articles/ArticleList';
import FeedbackList from '../components/Feedback/FeedbackList';
import Modal from '../components/Common/Modal';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ConfirmDialog from '../components/Common/ConfirmDialog';
import RatingComponent from '../components/Feedback/RatingComponent';

const ContributorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Data states
  const [myProfile, setMyProfile] = useState(null);
  const [myArticles, setMyArticles] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [myFeedback, setMyFeedback] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [notifications, setNotifications] = useState([]);

  // Modal states
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Form states
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [profileData, setProfileData] = useState({
    bio: '',
    specialties: [],
    socialLinks: {},
    preferences: {}
  });

  // Filter states
  const [articleFilter, setArticleFilter] = useState('all');
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const promises = [
        loadMyProfile(),
        loadMyArticles(),
        loadRecentArticles(),
        loadCategories(),
        loadMyFeedback(),
        loadAnalytics(),
        loadNotifications()
      ];

      await Promise.all(promises);
    } catch (error) {
      toastrService.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadMyProfile = async () => {
    try {
      if (user?.isContributor) {
        const response = await contributorApi.getMyContributorProfile();
        if (response.success) {
          setMyProfile(response.data);
          setProfileData({
            bio: response.data.bio || '',
            specialties: response.data.specialties || [],
            socialLinks: response.data.socialLinks || {},
            preferences: response.data.preferences || {}
          });
        }
      }
    } catch (error) {
      console.error('Failed to load profile');
    }
  };

  const loadMyArticles = async () => {
    try {
      if (user?.isContributor) {
        const response = await contributorApi.getMyArticles();
        if (response.success) {
          setMyArticles(response.data || []);
        }
      }
    } catch (error) {
      console.error('Failed to load articles');
    }
  };

  const loadRecentArticles = async () => {
    try {
      const response = await articleApi.getRecentArticles(10);
      if (response.success) {
        setRecentArticles(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load recent articles');
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryApi.getAllCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const loadMyFeedback = async () => {
    try {
      const response = await feedbackApi.getFeedbackByUser(user.id);
      if (response.success) {
        setMyFeedback(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load feedback');
    }
  };

  const loadAnalytics = async () => {
    try {
      // Calculate analytics from articles
      const totalViews = myArticles.reduce((sum, article) => sum + (article.viewCount || 0), 0);
      const averageRating = myArticles.length > 0 ? 
        myArticles.reduce((sum, article) => sum + (article.averageRating || 0), 0) / myArticles.length : 0;
      
      const statusCounts = myArticles.reduce((acc, article) => {
        acc[article.status] = (acc[article.status] || 0) + 1;
        return acc;
      }, {});

      setAnalytics({
        totalArticles: myArticles.length,
        totalViews,
        averageRating: Math.round(averageRating * 10) / 10,
        publishedArticles: statusCounts.Published || 0,
        draftArticles: statusCounts.Draft || 0,
        pendingArticles: statusCounts.Submitted || 0,
        totalFeedback: myFeedback.length,
        helpfulFeedback: myFeedback.filter(f => f.isHelpful).length
      });
    } catch (error) {
      console.error('Failed to calculate analytics');
    }
  };

  const loadNotifications = async () => {
    // Mock notifications - in real app, this would come from backend
    setNotifications([
      {
        id: 1,
        type: 'article_approved',
        title: 'Article Approved',
        message: 'Your article "React Best Practices" has been approved and published.',
        date: new Date(),
        read: false
      },
      {
        id: 2,
        type: 'feedback_received',
        title: 'New Feedback',
        message: 'You received new feedback on your article "JavaScript Tips".',
        date: new Date(Date.now() - 86400000),
        read: false
      }
    ]);
  };

  // Article Management
  const handleCreateArticle = () => {
    setSelectedArticle(null);
    setShowArticleModal(true);
  };

  const handleEditArticle = (article) => {
    setSelectedArticle(article);
    setShowArticleModal(true);
  };

  const handleSubmitArticle = async (articleData) => {
    try {
      setActionLoading(true);
      
      if (selectedArticle) {
        await contributorApi.updateArticle(selectedArticle.id, articleData);
        toastrService.success('Article updated successfully');
      } else {
        await contributorApi.createArticle(articleData);
        toastrService.success('Article created successfully');
      }
      
      setShowArticleModal(false);
      loadMyArticles();
      loadAnalytics();
    } catch (error) {
      toastrService.error('Failed to save article');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteArticle = (article) => {
    setConfirmAction(() => async () => {
      try {
        await contributorApi.deleteArticle(article.id);
        toastrService.success('Article deleted successfully');
        loadMyArticles();
        loadAnalytics();
      } catch (error) {
        toastrService.error('Failed to delete article');
      }
    });
    setShowConfirmDialog(true);
  };

  const handlePublishArticle = async (article) => {
    try {
      setActionLoading(true);
      await contributorApi.updateArticle(article.id, { status: 'Submitted' });
      toastrService.success('Article submitted for review');
      loadMyArticles();
    } catch (error) {
      toastrService.error('Failed to submit article');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter functions
  const getFilteredArticles = () => {
    let filtered = [...myArticles];
    
    if (articleFilter !== 'all') {
      filtered = filtered.filter(article => article.status === articleFilter);
    }
    
    return filtered;
  };

  const getNotificationIcon = (type) => {
    const icons = {
      article_approved: 'fas fa-check-circle text-success',
      article_rejected: 'fas fa-times-circle text-danger',
      feedback_received: 'fas fa-comment text-info',
      system: 'fas fa-bell text-warning'
    };
    return icons[type] || 'fas fa-info-circle text-muted';
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div className="container-fluid mt-4">
      {/* Dashboard Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>
                <i className="fas fa-home me-2 text-primary"></i>
                Welcome back, {user?.name}!
              </h2>
              <p className="text-muted mb-0">
                {user?.isContributor ? 
                  `You're a contributor with ${analytics.totalArticles} articles` : 
                  'Request contributor access to start writing articles'
                }
              </p>
            </div>
            
            {user?.isContributor && (
              <div className="btn-group">
                <Button
                  variant="success"
                  icon="fas fa-plus"
                  onClick={handleCreateArticle}
                >
                  New Article
                </Button>
                <Button
                  variant="outline-primary"
                  icon="fas fa-user"
                  onClick={() => setShowProfileModal(true)}
                >
                  Profile
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-pills">
            {[
              { id: 'overview', label: 'Overview', icon: 'fas fa-chart-pie' },
              { id: 'my-articles', label: 'My Articles', icon: 'fas fa-file-alt', show: user?.isContributor },
              { id: 'drafts', label: 'Drafts', icon: 'fas fa-edit', show: user?.isContributor },
              { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-line', show: user?.isContributor },
              { id: 'feedback', label: 'Feedback', icon: 'fas fa-comments', show: user?.isContributor },
              { id: 'browse', label: 'Browse Articles', icon: 'fas fa-book-open' },
              { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' }
            ].filter(tab => tab.show !== false).map(tab => (
              <li key={tab.id} className="nav-item">
                <button 
                  className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <i className={`${tab.icon} me-1`}></i>
                  {tab.label}
                  {tab.id === 'notifications' && notifications.filter(n => !n.read).length > 0 && (
                    <span className="badge bg-danger ms-1">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
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
          {user?.isContributor && (
            <div className="row mb-4">
              <div className="col-lg-3 col-md-6 mb-3">
                <StatsCard
                  title="Total Articles"
                  value={analytics.totalArticles}
                  icon="fas fa-file-alt"
                  color="primary"
                  onClick={() => setActiveTab('my-articles')}
                />
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <StatsCard
                  title="Total Views"
                  value={analytics.totalViews}
                  icon="fas fa-eye"
                  color="success"
                />
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <StatsCard
                  title="Average Rating"
                  value={analytics.averageRating}
                  icon="fas fa-star"
                  color="warning"
                />
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <StatsCard
                  title="Feedback Received"
                  value={analytics.totalFeedback}
                  icon="fas fa-comments"
                  color="info"
                  onClick={() => setActiveTab('feedback')}
                />
              </div>
            </div>
          )}

          <div className="row">
            {/* Quick Actions */}
            <div className="col-md-8">
              {user?.isContributor ? (
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Quick Actions</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <div className="card bg-light">
                          <div className="card-body text-center">
                            <i className="fas fa-plus fa-2x text-primary mb-2"></i>
                            <h6>Create Article</h6>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={handleCreateArticle}
                            >
                              Start Writing
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="card bg-light">
                          <div className="card-body text-center">
                            <i className="fas fa-edit fa-2x text-success mb-2"></i>
                            <h6>Continue Draft</h6>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => setActiveTab('drafts')}
                            >
                              View Drafts
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="card bg-light">
                          <div className="card-body text-center">
                            <i className="fas fa-chart-line fa-2x text-info mb-2"></i>
                            <h6>View Analytics</h6>
                            <Button
                              size="sm"
                              variant="info"
                              onClick={() => setActiveTab('analytics')}
                            >
                              See Stats
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card border-warning">
                  <div className="card-body">
                    <h5 className="card-title text-warning">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Become a Contributor
                    </h5>
                    <p className="card-text">
                      Want to share your knowledge? Request contributor access to start creating and sharing articles with the community.
                    </p>
                    <a href="/contributor-request" className="btn btn-warning">
                      <i className="fas fa-user-plus me-1"></i>
                      Request Contributor Access
                    </a>
                  </div>
                </div>
              )}

              {/* Recent Community Articles */}
              <div className="card mt-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">Recent Community Articles</h5>
                </div>
                <div className="card-body">
                  {recentArticles.slice(0, 5).map(article => (
                    <div key={article.id} className="d-flex align-items-start mb-3 pb-3 border-bottom">
                      <div className="flex-grow-1">
                        <h6 className="mb-1">
                          <a href={`/articles/${article.id}`} className="text-decoration-none">
                            {article.title}
                          </a>
                        </h6>
                        <p className="text-muted small mb-1">{formatters.truncate(article.summary, 100)}</p>
                        <small className="text-muted">
                          By {article.contributorName} • {formatters.relativeTime(article.createdDate)}
                        </small>
                      </div>
                      <div className="ms-3">
                        <span className="badge bg-primary">{article.categoryName}</span>
                        <div className="mt-1">
                          <small className="text-muted">
                            <i className="fas fa-eye me-1"></i>
                            {article.viewCount}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-md-4">
              {/* Profile Summary */}
              {user?.isContributor && myProfile && (
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="card-title mb-0">My Profile</h6>
                  </div>
                  <div className="card-body text-center">
                    <div 
                      className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: helpers.getAvatarColor(user.name),
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold'
                      }}
                    >
                      {helpers.getInitials(user.name)}
                    </div>
                    <h6>{user.name}</h6>
                    <p className="text-muted mb-2">{user.email}</p>
                    {myProfile.specialties && myProfile.specialties.length > 0 && (
                      <div className="mb-3">
                        {myProfile.specialties.slice(0, 3).map((specialty, index) => (
                          <span key={index} className="badge bg-light text-dark me-1">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => setShowProfileModal(true)}
                    >
                      Edit Profile
                    </Button>
                  </div>
                </div>
              )}

              {/* Recent Notifications */}
              <div className="card mb-3">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="card-title mb-0">Notifications</h6>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => setActiveTab('notifications')}
                    >
                      View All
                    </Button>
                  </div>
                </div>
                <div className="card-body">
                  {notifications.slice(0, 3).map(notification => (
                    <div key={notification.id} className="d-flex align-items-start mb-3">
                      <i className={`${getNotificationIcon(notification.type)} me-2 mt-1`}></i>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <strong className="small">{notification.title}</strong>
                          {!notification.read && (
                            <span className="badge bg-primary badge-sm">New</span>
                          )}
                        </div>
                        <p className="small text-muted mb-1">{notification.message}</p>
                        <small className="text-muted">{formatters.relativeTime(notification.date)}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories Quick Access */}
              <div className="card">
                <div className="card-header">
                  <h6 className="card-title mb-0">Browse Categories</h6>
                </div>
                <div className="card-body">
                  {categories.slice(0, 5).map(category => (
                    <div key={category.id} className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center">
                        <div 
                          className="rounded me-2"
                          style={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: category.color
                          }}
                        ></div>
                        <span className="small">{category.name}</span>
                      </div>
                      <span className="badge bg-light text-dark small">
                        {category.articleCount || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'my-articles' && user?.isContributor && (
        <div>
          <div className="row mb-4">
            <div className="col-md-6">
              <h4>My Articles</h4>
              <p className="text-muted">Manage your published articles and drafts</p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex align-items-center justify-content-md-end gap-2">
                <select 
                  className="form-select form-select-sm"
                  value={articleFilter}
                  onChange={(e) => setArticleFilter(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  <option value="all">All Articles</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Drafts</option>
                  <option value="Submitted">Under Review</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <Button
                  variant="primary"
                  icon="fas fa-plus"
                  onClick={handleCreateArticle}
                >
                  New Article
                </Button>
              </div>
            </div>
          </div>

          <ArticleList
            articles={getFilteredArticles()}
            showActions={true}
            onEdit={handleEditArticle}
            onDelete={handleDeleteArticle}
          />
        </div>
      )}

      {activeTab === 'analytics' && user?.isContributor && (
        <div>
          <div className="row mb-4">
            <div className="col-md-6">
              <h4>Analytics & Performance</h4>
              <p className="text-muted">Track your content performance and engagement</p>
            </div>
            <div className="col-md-6 text-md-end">
              <select 
                className="form-select form-select-sm"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="row mb-4">
            <div className="col-lg-3 col-md-6 mb-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h3>{analytics.totalViews}</h3>
                      <p className="mb-0">Total Views</p>
                    </div>
                    <i className="fas fa-eye fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h3>{analytics.averageRating}</h3>
                      <p className="mb-0">Avg. Rating</p>
                    </div>
                    <i className="fas fa-star fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-3">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h3>{analytics.totalFeedback}</h3>
                      <p className="mb-0">Feedback</p>
                    </div>
                    <i className="fas fa-comments fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-3">
              <div className="card bg-warning text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h3>{Math.round((analytics.helpfulFeedback / Math.max(analytics.totalFeedback, 1)) * 100)}%</h3>
                      <p className="mb-0">Helpful Rate</p>
                    </div>
                    <i className="fas fa-thumbs-up fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Articles */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Top Performing Articles</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Article</th>
                      <th>Views</th>
                      <th>Rating</th>
                      <th>Feedback</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myArticles
                      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
                      .slice(0, 10)
                      .map(article => (
                        <tr key={article.id}>
                          <td>
                            <a href={`/articles/${article.id}`} className="text-decoration-none">
                              {article.title}
                            </a>
                            <br />
                            <small className="text-muted">{article.categoryName}</small>
                          </td>
                          <td>
                            <strong>{article.viewCount || 0}</strong>
                          </td>
                          <td>
                            <RatingComponent 
                              rating={article.averageRating || 0} 
                              interactive={false}
                              size="sm"
                            />
                          </td>
                          <td>{article.feedbackCount || 0}</td>
                          <td>
                            <span className={`badge bg-${article.status === 'Published' ? 'success' : 'secondary'}`}>
                              {article.status}
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
      )}

      {activeTab === 'feedback' && user?.isContributor && (
        <div>
          <div className="row mb-4">
            <div className="col-md-6">
              <h4>Feedback & Reviews</h4>
              <p className="text-muted">See what readers think about your articles</p>
            </div>
          </div>

          <FeedbackList
            feedback={myFeedback}
            showArticleInfo={true}
          />
        </div>
      )}

      {activeTab === 'notifications' && (
        <div>
          <div className="row mb-4">
            <div className="col-md-6">
              <h4>Notifications</h4>
              <p className="text-muted">Stay updated with your activity</p>
            </div>
            <div className="col-md-6 text-md-end">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  setNotifications(notifications.map(n => ({ ...n, read: true })));
                  toastrService.success('All notifications marked as read');
                }}
              >
                Mark All Read
              </Button>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              {notifications.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-bell-slash fa-3x text-muted mb-3"></i>
                  <h5>No Notifications</h5>
                  <p className="text-muted">You're all caught up!</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div key={notification.id} className={`notification-item p-3 border-bottom ${!notification.read ? 'bg-light' : ''}`}>
                    <div className="d-flex align-items-start">
                      <i className={`${getNotificationIcon(notification.type)} me-3 mt-1`}></i>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{notification.title}</h6>
                            <p className="text-muted mb-2">{notification.message}</p>
                            <small className="text-muted">
                              {formatters.dateTime(notification.date)}
                            </small>
                          </div>
                          {!notification.read && (
                            <span className="badge bg-primary">New</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      
      {/* Article Modal */}
      <Modal
        isOpen={showArticleModal}
        onClose={() => setShowArticleModal(false)}
        title={selectedArticle ? 'Edit Article' : 'Create New Article'}
        size="xl"
      >
        <ArticleForm
          article={selectedArticle}
          onSubmit={handleSubmitArticle}
          onCancel={() => setShowArticleModal(false)}
          loading={actionLoading}
        />
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

export default ContributorDashboard;
