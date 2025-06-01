import React, { useState } from "react";
import { Card, Button, Alert, Modal } from "react-bootstrap";
import { FiCheck, FiX, FiAlertTriangle } from "react-icons/fi";
import { communityAPI } from "../../services/api";
import "../../styles/admin/admin-approval-controls.css";

function AdminApprovalControls({ recipe, onApprovalChange }) {
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [error, setError] = useState("");

  const handleApprovalAction = (action) => {
    setActionType(action);
    setShowConfirmModal(true);
    setError("");
  };

  
  const confirmAction = async () => {
    if (!actionType || !recipe?.id) return;
    
    setLoading(true);
    setError("");
    
    try {
      if (actionType === 'approve') {
        await communityAPI.updateRecipeApproval(recipe.id, true);
      } else if (actionType === 'reject') {
        await communityAPI.deleteRecipe(recipe.id);
      }
      
      setShowConfirmModal(false);
      
      if (onApprovalChange) {
        const approved = actionType === 'approve';
        onApprovalChange(recipe.id, approved);
      }
      
    } catch (error) {
      console.error(`Error ${actionType}ing recipe:`, error);
      setError(error.response?.data?.error || `Failed to ${actionType} recipe`);
    } finally {
      setLoading(false);
    }
  };
  
  const cancelAction = () => {
    setShowConfirmModal(false);
    setActionType(null);
    setError("");
  };
  
  if (!recipe) return null;

  return (
    <>
      <Card className="admin-approval-controls mt-4">
        <Card.Header className="admin-controls-header">
          <div className="d-flex align-items-center">
            <span className="me-2">🛡️</span>
            <h6 className="mb-0">Administrator Actions</h6>
          </div>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <div className="approval-info mb-3">
            <div className="row">
              <div className="col-md-6">
                <small className="text-muted">
                  <strong>Recipe ID:</strong> {recipe.id}
                </small>
              </div>
              <div className="col-md-6">
                <small className="text-muted">
                  <strong>Submitted:</strong> {new Date(recipe.created_at).toLocaleDateString()}
                </small>
              </div>
            </div>
          </div>

          <div className="approval-actions">
            <div className="d-flex gap-3 justify-content-center">
              <Button
                variant="success"
                size="lg"
                onClick={() => handleApprovalAction('approve')}
                disabled={loading}
                className="approval-btn approve-btn"
              >
                <FiCheck className="me-2" />
                Approve Recipe
              </Button>

              <Button
                variant="danger"
                size="lg"
                onClick={() => handleApprovalAction('reject')}
                disabled={loading}
                className="approval-btn reject-btn"
              >
                <FiX className="me-2" />
                Reject Recipe
              </Button>
            </div>
          </div>

          <div className="admin-note mt-3">
            <Alert variant="info" className="mb-0">
              <small>
                <FiAlertTriangle className="me-1" />
                <strong>Review Guidelines:</strong> Ensure the recipe has clear instructions,
                appropriate ingredients, and follows community standards before approval.
              </small>
            </Alert>
          </div>
        </Card.Body>
      </Card>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={cancelAction} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === 'approve' ? 'Approve Recipe' : 'Reject Recipe'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="confirmation-icon mb-3">
              {actionType === 'approve' ? (
                <FiCheck size={48} className="text-success" />
              ) : (
                <FiX size={48} className="text-danger" />
              )}
            </div>
            <h6>Are you sure you want to {actionType} this recipe?</h6>
            <p className="text-muted">
              <strong>"{recipe.title}"</strong>
            </p>
            {actionType === 'approve' && (
              <p className="text-success">
                <small>
                  This recipe will be made public and visible to all users.
                </small>
              </p>
            )}
            {actionType === 'reject' && (
              <p className="text-danger">
                <small>
                  This recipe will be permanently deleted and cannot be recovered.
                </small>
              </p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelAction} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={actionType === 'approve' ? 'success' : 'danger'}
            onClick={confirmAction}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                {actionType === 'approve' ? 'Approving...' : 'Rejecting...'}
              </>
            ) : (
              <>
                {actionType === 'approve' ? 'Approve Recipe' : 'Reject Recipe'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AdminApprovalControls;