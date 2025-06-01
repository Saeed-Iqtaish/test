import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert, Button } from 'react-bootstrap';
import { FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import CommunityRecipeHeader from '../components/community/list/CommunityRecipeHeader';
import CommunityRecipeMeta from '../components/community/list/CommunityRecipeMeta';
import CommunityRecipeImage from '../components/community/list/CommunityRecipeImage';
import CommunityRecipeContent from '../components/community/list/CommunityRecipeContent';
import AdminApprovalControls from '../components/admin/AdminApprovalControls';
import { AuthModal } from '../components/auth/AuthModal';
import { communityAPI } from '../services/api';
import '../styles/pages/admin-community-recipe-page.css';

function AdminCommunityRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { recipe, loading, error } = useAdminCommunityRecipe(id);

  const handleBackToAdmin = () => {
    navigate('/admin');
  };

  const handleApprovalChange = useCallback((recipeId, approved) => {
    const action = approved ? 'approved' : 'rejected';
    alert(`Recipe ${action} successfully!`);
    handleBackToAdmin();
  }, []);

  const handleFavoriteChange = (recipeId, isFavorited) => {
    console.log(`Recipe ${recipeId} favorite status changed: ${isFavorited}`);
  };

  const handleLoginRequired = () => {
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Access Denied</Alert.Heading>
          <p>You need administrator privileges to access this page.</p>
          <Button variant="outline-danger" onClick={() => navigate('/admin')}>
            Back to Admin
          </Button>
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading recipe for review...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={handleBackToAdmin}>
            Back to Admin Dashboard
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!recipe) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Recipe Not Found</Alert.Heading>
          <p>The recipe you're trying to review doesn't exist or has already been processed.</p>
          <Button variant="outline-warning" onClick={handleBackToAdmin}>
            Back to Admin Dashboard
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4 admin-recipe-review-page">
      <div className="admin-nav mb-4">
        <Button 
          variant="outline-primary"
          onClick={handleBackToAdmin}
          className="d-flex align-items-center gap-2"
        >
          <FiArrowLeft /> Back to Admin Dashboard
        </Button>
      </div>

      <div className="admin-review-header mb-4">
        <Alert variant="warning">
          <div className="d-flex align-items-center">
            <span className="me-2">👀</span>
            <div>
              <strong>Admin Review Mode</strong>
              <div className="small">
                You are reviewing a pending recipe submission. 
                Use the approval controls at the bottom to approve or reject this recipe.
              </div>
            </div>
          </div>
        </Alert>
      </div>

      <CommunityRecipeHeader
        recipe={recipe}
        onFavoriteChange={handleFavoriteChange}
        onLoginRequired={handleLoginRequired}
      />

      <CommunityRecipeMeta recipe={recipe} />

      <div className="row">
        <div className="col-lg-5 recipe-left-column">
          <CommunityRecipeImage 
            recipe={recipe} 
            className="mb-4" 
          />
        </div>

        <div className="col-lg-7 recipe-content-column">
          <CommunityRecipeContent recipe={recipe} />
        </div>
      </div>

      <AdminApprovalControls
        recipe={recipe}
        onApprovalChange={handleApprovalChange}
      />

      <AuthModal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </Container>
  );
}

function useAdminCommunityRecipe(id) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const assignMood = useCallback((recipe) => {
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
  }, []);

  const fetchAdminRecipe = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching admin recipe details for ID:', id);

      const response = await communityAPI.getAdminRecipe(id);
      const recipeData = response.data;
      
      const recipeWithMood = {
        ...recipeData,
        mood: assignMood(recipeData)
      };
      
      console.log('Admin recipe data loaded:', recipeWithMood);
      setRecipe(recipeWithMood);
      
    } catch (err) {
      console.error('Error fetching admin recipe:', err);
      
      if (err.response?.status === 404) {
        setError('Recipe not found or may have already been processed');
      } else if (err.response?.status === 403) {
        setError('Access denied - admin privileges required');
      } else {
        setError('Failed to load recipe details');
      }
    } finally {
      setLoading(false);
    }
  }, [id, assignMood]);

  React.useEffect(() => {
    fetchAdminRecipe();
  }, [fetchAdminRecipe]);

  return {
    recipe,
    loading,
    error
  };
}

export default AdminCommunityRecipePage;