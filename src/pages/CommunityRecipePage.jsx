import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert, Button, Row, Col, Tabs, Tab, Form, Card, Badge } from 'react-bootstrap';
import { FiArrowLeft, FiHome, FiEdit3 } from 'react-icons/fi';

// Import existing components
import MoodBadge from '../components/global/MoodBadge';
import FavoriteButton from '../components/global/FavoriteButton';
import RecipeIngredients from '../components/recipeDetails/RecipeIngredients';
import RecipeInstructions from '../components/recipeDetails/RecipeInstructions';
import EditRecipeModal from '../components/community/EditRecipeModal';
import { AuthModal } from '../components/auth/AuthModal';

import { useAuth } from '../contexts/AuthContext';
import { notesAPI } from '../services/api';
import '../styles/pages/community-recipe-page.css';

function CommunityRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userNote, setUserNote] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [tempNote, setTempNote] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchCommunityRecipe = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching community recipe for ID:', id);
      
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

  const fetchUserNote = useCallback(async () => {
    if (!isAuthenticated || !recipe?.id) return;
    
    try {
      const response = await notesAPI.getNotes(recipe.id);
      if (response.data.length > 0) {
        setUserNote(response.data[0].note);
      }
    } catch (error) {
      console.error("Error fetching note:", error);
    }
  }, [recipe?.id, isAuthenticated]);

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

  useEffect(() => {
    fetchUserNote();
  }, [fetchUserNote]);

  const handleBackClick = () => {
    navigate('/community');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleEditClick = () => {
    setShowEditModal(true);
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

  const handleSaveNote = async () => {
    setNoteLoading(true);
    try {
      await notesAPI.saveNote(recipe.id, tempNote);
      setUserNote(tempNote);
      setIsEditingNote(false);
      setTempNote('');
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setNoteLoading(false);
    }
  };

  const handleEditNote = () => {
    setTempNote(userNote);
    setIsEditingNote(true);
  };

  const handleCancelNote = () => {
    setTempNote('');
    setIsEditingNote(false);
  };

  const handleDeleteNote = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    setNoteLoading(true);
    try {
      await notesAPI.deleteNote(recipe.id);
      setUserNote('');
      setIsEditingNote(false);
      setTempNote('');
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setNoteLoading(false);
    }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
              <FiArrowLeft className="me-1" />
              Back to Community
            </Button>
            <Button variant="outline-primary" onClick={handleHomeClick}>
              <FiHome className="me-1" />
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
              <FiArrowLeft className="me-1" />
              Back to Community
            </Button>
            <Button variant="outline-primary" onClick={handleHomeClick}>
              <FiHome className="me-1" />
              Home
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  const recipeImageUrl = recipe.image_data ? 
    `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/community/${recipe.id}/image` : 
    null;

  return (
    <Container className="py-4 recipe-details-page">
      {/* Enhanced Navigation Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
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
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(255, 107, 107, 0.3)';
            }}
          >
            <FiArrowLeft /> Back to Community
          </Button>
          <Button 
            variant="outline-secondary" 
            onClick={handleHomeClick}
            className="d-flex align-items-center gap-2"
          >
            <FiHome /> Home
          </Button>
        </div>
        
        {canEditRecipe() && (
          <Button
            variant="outline-secondary"
            onClick={handleEditClick}
            className="d-flex align-items-center gap-2"
          >
            <FiEdit3 /> Edit Recipe
          </Button>
        )}
      </div>

      {/* Recipe Header */}
      <div className="recipe-header-section mb-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <h1 className="recipe-title mb-0">{recipe.title}</h1>
            <MoodBadge mood={recipe.mood} />
            {/* Only show status to recipe creator */}
            {isAuthenticated && user?.id === recipe?.created_by && (
              recipe.approved ? (
                <Badge bg="success">✓ Approved</Badge>
              ) : (
                <Badge bg="warning">⏳ Pending</Badge>
              )
            )}
          </div>
          <FavoriteButton 
            recipeId={recipe.id}
            isCommunityRecipe={true}
            onFavoriteChange={handleFavoriteChange}
            onLoginRequired={handleLoginRequired}
          />
        </div>
        
        {/* Recipe Meta */}
        <div className="recipe-meta mb-4">
          <div className="meta-item mb-2">
            <strong>Prep Time:</strong> {recipe.prep_time ? `${recipe.prep_time} mins` : 'Not specified'} • 
            <strong> Servings:</strong> {recipe.servings ? `${recipe.servings}` : 'Not specified'} • 
            <strong> Created by:</strong> {recipe.created_by_username || 'Anonymous'}
          </div>
          <div className="meta-item">
            <strong>Created:</strong> {formatDate(recipe.created_at)}
            {recipe.updated_at !== recipe.created_at && (
              <span> • <strong>Updated:</strong> {formatDate(recipe.updated_at)}</span>
            )}
          </div>
        </div>
      </div>

      <Row>
        {/* Left Column - Image and Notes */}
        <Col lg={5} className="recipe-left-column">
          {/* Recipe Image */}
          {recipeImageUrl && (
            <div className="recipe-image-container mb-4">
              <img
                src={recipeImageUrl}
                alt={recipe.title}
                className="recipe-image"
                onError={(e) => {
                  console.error('Error loading recipe image:', e.target.src);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Personal Notes */}
          {isAuthenticated && (
            <Card className="mb-4">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Personal Notes</h6>
                  {userNote && !isEditingNote && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={handleDeleteNote}
                      disabled={noteLoading}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </Card.Header>
              <Card.Body>
                {isEditingNote ? (
                  <div className="notes-edit-form">
                    <Form.Control
                      as="textarea"
                      rows={6}
                      value={tempNote}
                      onChange={(e) => setTempNote(e.target.value)}
                      placeholder="Add your cooking notes, tips, or modifications here..."
                      className="notes-textarea mb-3"
                    />
                    <div className="d-flex gap-2">
                      <Button
                        variant="primary"
                        onClick={handleSaveNote}
                        disabled={noteLoading}
                        className="flex-fill"
                      >
                        {noteLoading ? 'Saving...' : 'Save Notes'}
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={handleCancelNote}
                        disabled={noteLoading}
                        className="flex-fill"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="notes-display" onClick={handleEditNote} style={{ cursor: 'pointer', minHeight: '60px' }}>
                    {userNote ? (
                      <div className="user-note" style={{ whiteSpace: 'pre-wrap' }}>
                        {userNote}
                      </div>
                    ) : (
                      <div className="add-notes-placeholder text-muted text-center py-3">
                        <small>Click to add your personal notes and cooking tips</small>
                      </div>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Right Column - Ingredients and Instructions */}
        <Col lg={7} className="recipe-content-column">
          <Tabs defaultActiveKey="ingredients" className="recipe-tabs">
            <Tab eventKey="ingredients" title={`Ingredients (${recipe.ingredients?.length || 0})`}>
              <div className="tab-content-area">
                <RecipeIngredients 
                  recipeDetails={recipe}
                  isCommunityRecipe={true}
                />
              </div>
            </Tab>

            <Tab eventKey="instructions" title={`Instructions (${recipe.instructions?.length || 0})`}>
              <div className="tab-content-area">
                <RecipeInstructions 
                  recipeDetails={recipe}
                  isCommunityRecipe={true}
                />
              </div>
            </Tab>
          </Tabs>
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