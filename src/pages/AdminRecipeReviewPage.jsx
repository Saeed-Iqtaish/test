import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert, Button } from 'react-bootstrap';
import { FiArrowLeft, FiHome } from 'react-icons/fi';

// Custom hooks
import useCommunityRecipe from '../hooks/useCommunityRecipe';

// Components
import RecipeDetails from '../components/global/RecipeDetails';
import { AuthModal } from '../components/auth/AuthModal';

import { useAuth } from '../contexts/AuthContext';

function AdminRecipeReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  
  // Custom hooks
  const { recipe, loading, error } = useCommunityRecipe(id);
  
  // Local state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRecipeDetails, setShowRecipeDetails] = useState(false);

  // Show recipe details modal when recipe is loaded
  useEffect(() => {
    if (recipe && isAdmin && isAuthenticated) {
      setShowRecipeDetails(true);
    }
  }, [recipe, isAdmin, isAuthenticated]);

  // Navigation handlers
  const handleBackClick = () => {
    navigate('/admin');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleRecipeDetailsClose = () => {
    setShowRecipeDetails(false);
    navigate('/admin'); // Go back to admin panel when modal closes
  };

  const handleRecipeStatusUpdate = async () => {
    // Small delay for UX, then navigate back
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/admin');
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  // Loading state
  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading recipe for review...</p>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex gap-2">
            <Button 
              className="btn-main"
              onClick={handleBackClick}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                border: 'none',
                color: 'white',
                fontWeight: '600',
                borderRadius: '25px',
                padding: '0.6rem 1.5rem',
                fontSize: '0.95rem'
              }}
            >
              <FiArrowLeft /> Back to Admin Panel
            </Button>
            <Button
              variant="outline-secondary"
              onClick={handleHomeClick}
              className="d-flex align-items-center gap-2"
            >
              <FiHome /> Home
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  // Recipe not found
  if (!recipe) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Recipe Not Found</Alert.Heading>
          <p>The recipe you're trying to review doesn't exist or has been removed.</p>
          <div className="d-flex gap-2">
            <Button 
              className="btn-main"
              onClick={handleBackClick}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                border: 'none',
                color: 'white',
                fontWeight: '600',
                borderRadius: '25px',
                padding: '0.6rem 1.5rem',
                fontSize: '0.95rem'
              }}
            >
              <FiArrowLeft /> Back to Admin Panel
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  // Check if user is admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <>
        <Container className="text-center py-5">
          <Alert variant="danger">
            <Alert.Heading>Access Denied</Alert.Heading>
            <p>You don't have permission to review recipes.</p>
            <Button 
              className="btn-main"
              onClick={handleBackClick}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                border: 'none',
                color: 'white',
                fontWeight: '600',
                borderRadius: '25px',
                padding: '0.6rem 1.5rem',
                fontSize: '0.95rem'
              }}
            >
              <FiArrowLeft /> Back to Admin Panel
            </Button>
          </Alert>
        </Container>

        <AuthModal
          show={showAuthModal}
          onHide={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  // Check if recipe is still pending (might have been processed by another admin)
  if (recipe.approved !== undefined && recipe.approved !== null) {
    return (
      <Container className="py-5">
        <Alert variant="info">
          <Alert.Heading>Recipe Already Processed</Alert.Heading>
          <p>
            This recipe has already been {recipe.approved ? 'approved' : 'rejected'} 
            and is no longer pending review.
          </p>
          <Button 
            className="btn-main"
            onClick={handleBackClick}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
              border: 'none',
              color: 'white',
              fontWeight: '600',
              borderRadius: '25px',
              padding: '0.6rem 1.5rem',
              fontSize: '0.95rem'
            }}
          >
            <FiArrowLeft /> Back to Admin Panel
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Container className="py-4">
        {/* Navigation */}
        <div className="d-flex gap-2 mb-4">
          <Button 
            className="btn-main"
            onClick={handleBackClick}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
              border: 'none',
              color: 'white',
              fontWeight: '600',
              borderRadius: '25px',
              padding: '0.6rem 1.5rem',
              fontSize: '0.95rem'
            }}
          >
            <FiArrowLeft /> Back to Admin Panel
          </Button>
          
          <Button
            variant="outline-secondary"
            onClick={handleHomeClick}
            className="d-flex align-items-center gap-2"
          >
            <FiHome /> Home
          </Button>
        </div>

        <div className="text-center">
          <h2>Recipe Review</h2>
          <p className="text-muted">Review the recipe details in the modal below</p>
        </div>
      </Container>

      {/* Recipe Details Modal in Admin Review Mode */}
      <RecipeDetails
        show={showRecipeDetails}
        onHide={handleRecipeDetailsClose}
        recipe={recipe}
        isCommunityRecipe={true}
        isAdminReview={true}
        onStatusUpdate={handleRecipeStatusUpdate}
      />

      {/* Auth Modal for login prompt */}
      <AuthModal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default AdminRecipeReviewPage;