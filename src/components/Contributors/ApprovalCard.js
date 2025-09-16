import React from 'react';
import { formatters } from '../../utils/formatters';
import Button from '../Common/Button';

const ApprovalCard = ({ 
  contributor, 
  onApprove, 
  onReject, 
  loading = false 
}) => {
  const handleApprove = () => {
    onApprove(contributor);
  };

  const handleReject = () => {
    onReject(contributor);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h6 className="card-title mb-1">{contributor.userName}</h6>
            <p className="text-muted mb-0">{contributor.userEmail}</p>
          </div>
          <span className="badge bg-warning">Pending</span>
        </div>

        <div className="mb-3">
          <p className="card-text">
            <strong>Department:</strong> {contributor.department || 'Not specified'}
          </p>
          <p className="card-text">
            <strong>Request Date:</strong> {formatters.date(contributor.createdDate)}
          </p>
        </div>

        {contributor.proofDocument && (
          <div className="mb-3">
            <p className="card-text">
              <strong>Proof Document:</strong>
            </p>
            <a 
              href={contributor.proofDocument} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline-secondary btn-sm"
            >
              <i className="fas fa-file-alt me-1"></i>
              View Document
            </a>
          </div>
        )}

        <div className="d-flex gap-2">
          <Button
            variant="success"
            size="sm"
            icon="fas fa-check"
            onClick={handleApprove}
            loading={loading}
          >
            Approve
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon="fas fa-times"
            onClick={handleReject}
            loading={loading}
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalCard;
