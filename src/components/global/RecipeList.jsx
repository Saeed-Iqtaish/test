import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import RecipeCard from "./RecipeCard";
import { favoritesAPI } from "../../services/api";

function RecipeList({
  search,
  diet,
  allergy,
  mood,
  isCommunityList = false,
  isFavoritesPage = false,
  refreshTrigger = 0,
  onRecipeClick,
  onFavoriteChange
}) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const fetchSpoonacularRecipes = useCallback(async (controller) => {
    const response = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {
      signal: controller.signal,
      params: {
        apiKey: "68f91166a81747958d41b82fa5f038c9",
        number: 12,
        addRecipeInformation: true,
        query: search || "",
        diet: diet.length > 0 ? diet[0].toLowerCase() : undefined,
        intolerances: allergy.length > 0 ? allergy.join(",").toLowerCase() : undefined,
      },
    });

    const recipesWithMood = response.data.results.map((r) => ({
      ...r,
      mood: assignMood(r),
    }));

    return mood.length > 0
      ? recipesWithMood.filter((r) => mood.includes(r.mood))
      : recipesWithMood;
  }, [search, diet, allergy, mood, assignMood]);

  const fetchCommunityRecipes = useCallback(async (controller) => {
    const response = await axios.get("http://localhost:5000/api/community", {
      signal: controller.signal
    });
    let filteredRecipes = response.data;

    if (search) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    filteredRecipes = filteredRecipes.map(r => ({
      ...r,
      mood: assignMood(r),
    }));

    if (mood.length > 0) {
      filteredRecipes = filteredRecipes.filter(r => mood.includes(r.mood));
    }

    return filteredRecipes;
  }, [search, mood, assignMood]);

  const fetchFavoriteRecipes = useCallback(async (controller) => {
    try {
      const favoritesResponse = await favoritesAPI.getFavorites();
      const favoriteIds = favoritesResponse.data.map(fav => fav.recipe_id);

      if (favoriteIds.length === 0) {
        return [];
      }

      const recipePromises = favoriteIds.map(async (id) => {
        try {
          const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
            signal: controller.signal,
            params: {
              apiKey: "68f91166a81747958d41b82fa5f038c9"
            }
          });

          return {
            ...response.data,
            mood: assignMood(response.data),
            isFavorited: true
          };
        } catch (error) {
          console.error(`Error fetching recipe ${id}:`, error);
          return null;
        }
      });

      const recipes = await Promise.all(recipePromises);
      let validRecipes = recipes.filter(recipe => recipe !== null);

      if (search) {
        validRecipes = validRecipes.filter(recipe =>
          recipe.title.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (diet.length > 0) {
        validRecipes = validRecipes.filter(recipe => {
          const recipeDiets = recipe.diets || [];
          return diet.some(d => recipeDiets.includes(d));
        });
      }

      if (mood.length > 0) {
        validRecipes = validRecipes.filter(recipe => mood.includes(recipe.mood));
      }

      if (allergy.length > 0) {
        validRecipes = validRecipes.filter(recipe => {
          const recipeText = `${recipe.title} ${recipe.summary || ""}`.toLowerCase();
          const hasAllergen = allergy.some(allergen =>
            recipeText.includes(allergen.toLowerCase())
          );
          return !hasAllergen;
        });
      }

      return validRecipes;
    } catch (error) {
      console.error("Error fetching favorite recipes:", error);
      throw error;
    }
  }, [search, diet, allergy, mood, assignMood]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    let fetchFunction;
    if (isFavoritesPage) {
      fetchFunction = fetchFavoriteRecipes;
    } else if (isCommunityList) {
      fetchFunction = fetchCommunityRecipes;
    } else {
      fetchFunction = fetchSpoonacularRecipes;
    }

    fetchFunction(controller)
      .then(setRecipes)
      .catch((err) => {
        if (!axios.isCancel(err)) {
          console.error("API Error:", err);
          if (err.response) {
            setError(`API Error: ${err.response.status} - ${err.response.data.message}`);
          } else if (err.request) {
            setError("Network error - please check your connection");
          } else {
            setError("Request setup error");
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, [isFavoritesPage, isCommunityList, fetchSpoonacularRecipes, fetchCommunityRecipes, fetchFavoriteRecipes, refreshTrigger]);

  const handleFavoriteChange = (recipeId, isFavorited) => {
    if (isFavoritesPage && !isFavorited) {
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  if (!recipes.length) {
    if (isFavoritesPage) {
      return (
        <div className="text-center py-5">
          <h4>No favorites yet!</h4>
          <p className="text-muted">Start adding recipes to your favorites to see them here.</p>
        </div>
      );
    }
    return <p>No recipes found.</p>;
  }

  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {recipes.map((recipe) => (
        <Col key={recipe.id} className="d-flex">
          <RecipeCard
            recipe={recipe}
            isCommunityRecipe={isCommunityList}
            isFavoritesPage={isFavoritesPage}
            onClick={!isCommunityList && !isFavoritesPage ? onRecipeClick : isCommunityList ? onRecipeClick : undefined}
            onFavoriteChange={onFavoriteChange || handleFavoriteChange}
          />
        </Col>
      ))}
    </Row>
  );
}

export default RecipeList;