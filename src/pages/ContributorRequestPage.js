import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { contributorApi } from '../api/contributorApi';
import { toastrService } from '../services/toastrService';

const ContributorRequestPage = () => {
  const [proofDocument, setProofDocument] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestData = { proofDocument };
      await contributorApi.requestContributorAccess(requestData);
      
      toastrService.success('Contributor request submitted successfully! Please wait for admin approval.');
      navigate('/dashboard');
    } catch (error) {
      toastrService.error('Failed to submit contributor request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">
                <i className="fas fa-user-plus me-2 text-primary"></i>
                Request Contributor Access
              </h4>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Contributor Benefits:</strong>
                <ul className="mb-0 mt-2">
                  <li>Create and publish articles</li>
                  <li>Share knowledge with the community</li>
                  <li>Help build the organizational knowledge base</li>
                  <li>Receive feedback on your contributions</li>
                </ul>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="proofDocument" className="form-label">
                    Proof Document URL/Link <span className="text-danger">*</span>
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    id="proofDocument"
                    value={proofDocument}
                    onChange={(e) => setProofDocument(e.target.value)}
                    placeholder="https://drive.google.com/... or https://onedrive.live.com/..."
                    required
                  />
                  <div className="form-text">
                    Please provide a link to a document that demonstrates your expertise or qualification 
                    to contribute to the knowledge base (e.g., resume, certificate, work samples, etc.)
                  </div>
                </div>

                <div className="alert alert-warning">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <strong>Note:</strong> Your request will be reviewed by an administrator. 
                  You will be notified via email once your request is approved or rejected.
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button 
                    type="button" 
                    className="btn btn-secondary me-md-2"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-1"></i>
                        Submit Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-question-circle me-2"></i>
                Frequently Asked Questions
              </h5>
            </div>
            <div className="card-body">
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button 
                      className="accordion-button collapsed" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#faq1"
                    >
                      What documents can I use as proof?
                    </button>
                  </h2>
                  <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      You can provide links to your resume, professional certificates, work samples, 
                      LinkedIn profile, or any document that demonstrates your expertise in your field.
                    </div>
                  </div>
                </div>
                
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button 
                      className="accordion-button collapsed" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#faq2"
                    >
                      How long does the approval process take?
                    </button>
                  </h2>
                  <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      The approval process typically takes 1-3 business days. You will receive an email 
                      notification once your request has been reviewed.
                    </div>
                  </div>
                </div>
                
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button 
                      className="accordion-button collapsed" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#faq3"
                    >
                      What happens after approval?
                    </button>
                  </h2>
                  <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Once approved, you'll gain access to article creation tools and can start 
                      contributing to the knowledge base. Your articles will go through a review 
                      process before being published.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributorRequestPage;