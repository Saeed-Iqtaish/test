import React, { useEffect } from "react";
import { Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AdminRecipeList from "./AdminRecipeList";
import { useAdminRecipes } from "../../hooks/useAdminRecipes";

function AdminPendingRecipes({ refreshTrigger, onRecipeStatusChange }) {
  const navigate = useNavigate();
  const { pendingRecipes, loading, error, fetchPendingRecipes } = useAdminRecipes();

  useEffect(() => {
    fetchPendingRecipes();
  }, [refreshTrigger, fetchPendingRecipes]);

  const handleRecipeClick = (recipe) => {
    navigate(`/admin/community/${recipe.id}`);
  };

  if (loading) {
    return (
      <Card className="admin-pending-section">
        <Card.Header>
          <h5 className="mb-0">
            <span className="me-2">⏳</span>
            Pending Recipe Approvals
          </h5>
        </Card.Header>
        <Card.Body className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading pending recipes...</span>
          </div>
          <p className="mt-2">Loading pending submissions...</p>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="admin-pending-section">
        <Card.Header>
          <h5 className="mb-0">
            <span className="me-2">⏳</span>
            Pending Recipe Approvals
          </h5>
        </Card.Header>
        <Card.Body>
          <Alert variant="danger">
            <Alert.Heading>Error</Alert.Heading>
            <p>{error}</p>
            <button
              className="btn btn-outline-danger"
              onClick={fetchPendingRecipes}
            >
              Try Again
            </button>
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="admin-pending-section">
      <Card.Header>
        <h5 className="mb-0">
          <span className="me-2">⏳</span>
          Pending Recipe Approvals ({pendingRecipes.length})
        </h5>
      </Card.Header>
      <Card.Body>
        {pendingRecipes.length === 0 ? (
          <div className="text-center py-5">
            <div className="empty-state">
              <span className="empty-icon">🎉</span>
              <h6 className="mt-3">All caught up!</h6>
              <p className="text-muted">
                There are no pending recipe submissions at the moment.
              </p>
            </div>
          </div>
        ) : (
          <>
            <AdminRecipeList
              recipes={pendingRecipes}
              onRecipeClick={handleRecipeClick}
              onRecipeStatusChange={onRecipeStatusChange}
            />
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default AdminPendingRecipes;