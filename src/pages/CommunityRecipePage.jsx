import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert, Row, Col } from 'react-bootstrap';
import useCommunityRecipe from '../hooks/useCommunityRecipe';
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
import RecipeRating from '../components/ratings/RecipeRating';

function CommunityRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { recipe, loading, error, refreshRecipe } = useCommunityRecipe(id);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleBackClick = () => {
    navigate('/community');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

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

  const handleFavoriteChange = (recipeId, isFavorited) => {
    console.log(`Recipe ${recipeId} favorite status changed: ${isFavorited}`);
  };

  const handleLoginRequired = () => {
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading recipe...</p>
      </Container>
    );
  }

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
      <CommunityRecipeNavigation
        onBackClick={handleBackClick}
        onHomeClick={handleHomeClick}
        onEditClick={handleEditClick}
        canEdit={canEditRecipe()}
      />

      <CommunityRecipeHeader
        recipe={recipe}
        onFavoriteChange={handleFavoriteChange}
        onLoginRequired={handleLoginRequired}
      />

      <CommunityRecipeMeta recipe={recipe} />

      <Row>
        <Col lg={5} className="recipe-left-column">
          <CommunityRecipeImage 
            recipe={recipe} 
            className="mb-4" 
          />

          <div className="rating-section mb-4">
            <RecipeRating
              recipeId={recipe.id}
              isCommunityRecipe={true}
              size="md"
              showUserRating={true}
              className="border rounded p-3 bg-light"
            />
          </div>

          <RecipeNotes recipeId={recipe.id} />
        </Col>

        <Col lg={7} className="recipe-content-column">
          <CommunityRecipeContent recipe={recipe} />
        </Col>
      </Row>

      <AuthModal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

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