import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert, Button, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { FiArrowLeft, FiEdit3, FiHome } from 'react-icons/fi';
import RecipeHeader from '../components/recipeDetails/RecipeHeader';
import RecipeMeta from '../components/recipeDetails/RecipeMeta';
import RecipeDescription from '../components/recipeDetails/RecipeDescription';
import RecipeIngredients from '../components/recipeDetails/RecipeIngredients';
import RecipeInstructions from '../components/recipeDetails/RecipeInstructions';
import RecipeNotes from '../components/recipeDetails/RecipeNotes';
import EditRecipeModal from '../components/community/EditRecipeModal';

import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/community-recipe-page.css';

function CommunityRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false); // Add this state

  const fetchCommunityRecipe = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching community recipe for ID:', id);
      
      // Fetch from backend API only (community recipes)
      const response = await fetch(`${process.env.REACT_APP_API_URL}/community/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Recipe not found');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return;
      }
      
      const data = await response.json();
      console.log('Community recipe data:', data);
      
      // Add mood assignment for consistency
      const recipeWithMood = {
        ...data,
        mood: assignMood(data)
      };
      
      setRecipe(recipeWithMood);
    } catch (err) {
      console.error('Error fetching community recipe:', err);
      setError('Failed to load recipe details');
    } finally {
      setLoading(false);
    }
  }, [id]);

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

  useEffect(() => {
    fetchCommunityRecipe();
  }, [fetchCommunityRecipe]);

  const handleBackClick = () => {
    navigate('/community');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleEditClick = () => {
    setShowEditModal(true); // Show edit modal instead of console.log
  };

  const handleRecipeUpdated = () => {
    setShowEditModal(false);
    fetchCommunityRecipe(); // Refresh recipe data
  };

  const canEditRecipe = () => {
    // User can edit if they created the recipe or are admin
    return isAuthenticated && 
           (user?.is_admin || user?.id === recipe?.created_by);
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
          <div className="d-flex gap-2">
            <Button variant="outline-danger" onClick={handleBackClick}>
              Back to Community
            </Button>
            <Button variant="outline-primary" onClick={handleHomeClick}>
              <FiHome className="me-2" />
              Home
            </Button>
          </div>
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
          <div className="d-flex gap-2">
            <Button variant="outline-warning" onClick={handleBackClick}>
              Back to Community
            </Button>
            <Button variant="outline-primary" onClick={handleHomeClick}>
              <FiHome className="me-2" />
              Home
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <div className="community-recipe-page">
        {/* Top Navigation Bar */}
        <div className="recipe-nav-bar">
          <Container>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-primary" 
                  onClick={handleBackClick}
                  className="d-flex align-items-center gap-2"
                  size="sm"
                >
                  <FiArrowLeft /> Community
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={handleHomeClick}
                  className="d-flex align-items-center gap-2"
                  size="sm"
                >
                  <FiHome /> Home
                </Button>
              </div>
              
              {canEditRecipe() && (
                <Button
                  variant="outline-secondary"
                  onClick={handleEditClick}
                  className="d-flex align-items-center gap-2"
                  size="sm"
                >
                  <FiEdit3 /> Edit Recipe
                </Button>
              )}
            </div>
          </Container>
        </div>

        <Container className="py-4">
          {/* Recipe Header */}
          <RecipeHeader
            title={recipe.title}
            image={recipe.image_data ? `${process.env.REACT_APP_API_URL}/community/${recipe.id}/image` : null}
            mood={recipe.mood}
            isCommunityRecipe={true}
            approved={recipe.approved}
            recipe={recipe}
          />

          <Row className="mt-4">
            <Col lg={8}>
              {/* Recipe Content Tabs */}
              <Tabs defaultActiveKey="overview" className="mb-4">
                <Tab eventKey="overview" title="Overview">
                  <RecipeDescription 
                    recipe={recipe}
                    recipeDetails={recipe}
                    isCommunityRecipe={true}
                  />
                </Tab>

                <Tab eventKey="ingredients" title="Ingredients">
                  <RecipeIngredients 
                    recipeDetails={recipe}
                    isCommunityRecipe={true}
                  />
                </Tab>

                <Tab eventKey="instructions" title="Instructions">
                  <RecipeInstructions 
                    recipeDetails={recipe}
                    isCommunityRecipe={true}
                  />
                </Tab>

                {/* Personal Notes tab for authenticated users */}
                {isAuthenticated && (
                  <Tab eventKey="notes" title="My Notes">
                    <RecipeNotes recipe={recipe} />
                  </Tab>
                )}
              </Tabs>
            </Col>

            <Col lg={4}>
              {/* Recipe Meta Information Sidebar */}
              <div className="recipe-sidebar">
                <RecipeMeta 
                  recipe={recipe}
                  recipeDetails={recipe}
                  isCommunityRecipe={true}
                  isAuthenticated={isAuthenticated}
                  onFavoriteChange={() => {}} // Community recipes can't be favorited
                />
                
                {/* Additional Community Info */}
                <div className="community-info mt-4 p-3 bg-light rounded">
                  <h6>Community Recipe Info</h6>
                  <div className="info-item mb-2">
                    <strong>Status:</strong>{" "}
                    {recipe.approved ? (
                      <span className="text-success">✓ Approved</span>
                    ) : (
                      <span className="text-warning">⏳ Pending Approval</span>
                    )}
                  </div>
                  <div className="info-item mb-2">
                    <strong>Created:</strong>{" "}
                    {new Date(recipe.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  {recipe.updated_at !== recipe.created_at && (
                    <div className="info-item mb-2">
                      <strong>Last Updated:</strong>{" "}
                      {new Date(recipe.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                  <div className="info-item">
                    <strong>Recipe ID:</strong> #{recipe.id}
                  </div>
                </div>

                {/* Recipe Stats */}
                <div className="recipe-stats mt-4 p-3 bg-light rounded">
                  <h6>Recipe Details</h6>
                  <div className="stats-grid">
                    <div className="stat-item mb-2">
                      <strong>Ingredients:</strong> {recipe.ingredients?.length || 0}
                    </div>
                    <div className="stat-item mb-2">
                      <strong>Instructions:</strong> {recipe.instructions?.length || 0} steps
                    </div>
                    <div className="stat-item">
                      <strong>Mood:</strong> {recipe.mood}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Edit Recipe Modal */}
      <EditRecipeModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        recipe={recipe}
        onRecipeUpdated={handleRecipeUpdated}
      />
    </>
  );
}

export default CommunityRecipePage;