import React, { useState, useEffect } from "react";
import { Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AdminRecipeList from "./AdminRecipeList";
import { communityAPI } from "../../services/api";

function AdminPendingRecipes({ refreshTrigger, onRecipeStatusChange }) {
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingRecipes();
  }, [refreshTrigger]);

  const fetchPendingRecipes = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await communityAPI.getPendingRecipes();
      
      // Add mood assignment to recipes (reusing existing logic)
      const recipesWithMood = response.data.map(recipe => ({
        ...recipe,
        mood: assignMood(recipe)
      }));
      
      setPendingRecipes(recipesWithMood);
    } catch (error) {
      console.error("Error fetching pending recipes:", error);
      setError("Failed to load pending recipes");
    } finally {
      setLoading(false);
    }
  };

  // Reuse the mood assignment logic from existing components
  const assignMood = (recipe) => {
    const text = `${recipe.title} ${recipe.summary || ""}`.toLowerCase();

    if (text.includes("soup") || text.includes("creamy") || text.includes("bake")) {
      return "Cozy";
    }
    if (text.includes("avocado") || text.includes("smooth")) {
      return "Relaxed";
    }
    if (text.includes("spicy") || text.includes("noodle") || text.includes("chili")) {
      return "Energetic";
    }

    return "Happy";
  };

  const handleRecipeClick = (recipe) => {
    // Navigate to the community recipe page with admin context
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
            <div className="mb-3">
              <Alert variant="info" className="admin-info-alert">
                <small>
                  <strong>Review Instructions:</strong> Click on any recipe below to view its full details. 
                  You can approve or reject recipes from the recipe detail page.
                </small>
              </Alert>
            </div>
            
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