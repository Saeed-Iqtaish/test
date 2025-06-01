import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert, Row, Col } from 'react-bootstrap';

// Custom hooks
import useCommunityRecipe from '../hooks/useCommunityRecipe';

// Components
import CommunityRecipeNavigation from '../components/community/list/CommunityRecipeNavigation';
import CommunityRecipeHeader from '../components/community/list/CommunityRecipeHeader';
import CommunityRecipeMeta from '../components/community/list/CommunityRecipeMeta';
import CommunityRecipeImage from '../components/community/list/CommunityRecipeImage';
import RecipeNotes from '../components/community/list/RecipeNotes';
import CommunityRecipeContent from '../components/community/list/CommunityRecipeContent';
import EditRecipeModal from '../components/community/shared/EditRecipeModal';
import { AuthModal } from '../components/auth/AuthModal';

import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/community-recipe-page.css';

function CommunityRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // Custom hooks
  const { recipe, loading, error, refreshRecipe } = useCommunityRecipe(id);
  
  // Local state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Navigation handlers
  const handleBackClick = () => {
    navigate('/community');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  // Edit functionality
  const canEditRecipe = () => {
    return isAuthenticated && 
           (user?.is_admin || user?.id === recipe?.created_by);
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleRecipeUpdated = () => {
    setShowEditModal(false);
    refreshRecipe();
  };

  // Favorite functionality
  const handleFavoriteChange = (recipeId, isFavorited) => {
    console.log(`Recipe ${recipeId} favorite status changed: ${isFavorited}`);
  };

  const handleLoginRequired = () => {
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  // Loading state
  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading recipe...</p>
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
          <CommunityRecipeNavigation
            onBackClick={handleBackClick}
            onHomeClick={handleHomeClick}
          />
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
          <p>The recipe you're looking for doesn't exist or has been removed.</p>
          <CommunityRecipeNavigation
            onBackClick={handleBackClick}
            onHomeClick={handleHomeClick}
          />
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4 recipe-details-page">
      {/* Navigation */}
      <CommunityRecipeNavigation
        onBackClick={handleBackClick}
        onHomeClick={handleHomeClick}
        onEditClick={handleEditClick}
        canEdit={canEditRecipe()}
      />

      {/* Recipe Header */}
      <CommunityRecipeHeader
        recipe={recipe}
        onFavoriteChange={handleFavoriteChange}
        onLoginRequired={handleLoginRequired}
      />

      {/* Recipe Meta Information */}
      <CommunityRecipeMeta recipe={recipe} />

      <Row>
        {/* Left Column - Image and Notes */}
        <Col lg={5} className="recipe-left-column">
          {/* Recipe Image */}
          <CommunityRecipeImage 
            recipe={recipe} 
            className="mb-4" 
          />

          {/* Personal Notes */}
          <RecipeNotes recipeId={recipe.id} />
        </Col>

        {/* Right Column - Ingredients and Instructions */}
        <Col lg={7} className="recipe-content-column">
          <CommunityRecipeContent recipe={recipe} />
        </Col>
      </Row>

      {/* Auth Modal for login prompt */}
      <AuthModal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Edit Recipe Modal */}
      <EditRecipeModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        recipe={recipe}
        onRecipeUpdated={handleRecipeUpdated}
      />
    </Container>
  );
}

export default CommunityRecipePage;