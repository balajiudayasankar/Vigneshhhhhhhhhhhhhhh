import React, { useState } from 'react';
import ContributorCard from './ContributorCard';
import LoadingSpinner from '../Common/LoadingSpinner';
import Pagination from '../Common/Pagination';

const ContributorList = ({ 
  contributors = [], 
  loading = false,
  showActions = false,
  onEdit = null,
  onDelete = null,
  onViewProfile = null,
  itemsPerPage = 12 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredContributors = contributors
    .filter(contributor => {
      if (filterStatus === 'approved') return contributor.isApproved;
      if (filterStatus === 'pending') return !contributor.isApproved;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.userName.localeCompare(b.userName);
        case 'articles':
          return (b.articleCount || 0) - (a.articleCount || 0);
        case 'views':
          return (b.totalViews || 0) - (a.totalViews || 0);
        case 'joined':
          return new Date(b.createdDate) - new Date(a.createdDate);
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(filteredContributors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentContributors = filteredContributors.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return <LoadingSpinner text="Loading contributors..." />;
  }

  if (contributors.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-users fa-3x text-muted mb-3"></i>
        <h4>No Contributors Found</h4>
        <p className="text-muted">No contributors have been registered yet.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Controls */}
      <div className="row mb-4">
        <div className="col-md-4">
          <select 
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="articles">Sort by Articles</option>
            <option value="views">Sort by Views</option>
            <option value="joined">Sort by Join Date</option>
          </select>
        </div>
        
        <div className="col-md-4">
          <select 
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Contributors</option>
            <option value="approved">Approved Only</option>
            <option value="pending">Pending Only</option>
          </select>
        </div>
        
        <div className="col-md-4">
          <div className="text-md-end">
            <span className="text-muted">
              Showing {currentContributors.length} of {filteredContributors.length} contributors
            </span>
          </div>
        </div>
      </div>

      {/* Contributors Grid */}
      {currentContributors.length === 0 ? (
        <div className="text-center py-4">
          <i className="fas fa-filter fa-2x text-muted mb-3"></i>
          <h5>No contributors match your filters</h5>
          <p className="text-muted">Try adjusting your filter options.</p>
        </div>
      ) : (
        <div className="row">
          {currentContributors.map((contributor) => (
            <div key={contributor.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <ContributorCard
                contributor={contributor}
                showActions={showActions}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewProfile={onViewProfile}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredContributors.length}
            pageSize={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
};

export default ContributorList;
