import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert, Button } from 'react-bootstrap';
import axios from 'axios';
import RecipeHeader from '../components/recipeDetails/RecipeHeader';
import { FiArrowLeft } from 'react-icons/fi';

function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
        params: {
          apiKey: "68f91166a81747958d41b82fa5f038c9"
        }
      });
      
      const recipeWithMood = {
        ...response.data,
        mood: assignMood(response.data)
      };
      
      setRecipe(recipeWithMood);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      setError('Failed to load recipe details');
    } finally {
      setLoading(false);
    }
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
          <Button variant="outline-danger" onClick={() => navigate('/')}>
            Back to Home
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
          <p>The recipe you're looking for doesn't exist.</p>
          <Button variant="outline-warning" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button 
        variant="outline-primary" 
        onClick={() => navigate('/')}
        className="mb-4 d-flex align-items-center gap-2"
      >
        <FiArrowLeft /> Back to Recipes
      </Button>

      <RecipeHeader
        title={recipe.title}
        image={recipe.image}
        mood={recipe.mood}
      />

      <div className="mt-4">
        <p className="text-muted">Recipe details will be displayed here...</p>
        <small>Ready in: {recipe.readyInMinutes} minutes | Servings: {recipe.servings}</small>
      </div>
    </Container>
  );
}

export default RecipePage;