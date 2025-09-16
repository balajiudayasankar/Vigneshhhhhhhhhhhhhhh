import React from 'react';
import { formatters } from '../../utils/formatters';

const RecentActivity = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    const icons = {
      'article_created': 'fas fa-plus-circle text-success',
      'article_published': 'fas fa-check-circle text-primary',
      'article_updated': 'fas fa-edit text-warning',
      'feedback_received': 'fas fa-comment text-info',
      'user_login': 'fas fa-sign-in-alt text-muted'
    };
    return icons[type] || 'fas fa-circle text-muted';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h6 className="card-title mb-0">
          <i className="fas fa-clock me-2"></i>
          Recent Activity
        </h6>
      </div>
      <div className="card-body">
        {activities.length === 0 ? (
          <div className="text-center py-4">
            <i className="fas fa-history fa-2x text-muted mb-2"></i>
            <p className="text-muted mb-0">No recent activity</p>
          </div>
        ) : (
          <div className="timeline">
            {activities.map((activity, index) => (
              <div key={index} className="d-flex align-items-start mb-3">
                <i className={`${getActivityIcon(activity.type)} me-3 mt-1`}></i>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between">
                    <strong className="small">{activity.title}</strong>
                    <small className="text-muted">
                      {formatters.relativeTime(activity.timestamp)}
                    </small>
                  </div>
                  <p className="small text-muted mb-0">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
