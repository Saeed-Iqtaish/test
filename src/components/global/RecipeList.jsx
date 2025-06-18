import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Row, Col, Spinner, Alert, Button } from "react-bootstrap";
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
  onFavoriteChange,
  enableInfiniteScroll = false
}) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const RECIPES_PER_PAGE = 12;

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

  const fetchSpoonacularRecipes = useCallback(async (controller, offset = 0, limit = RECIPES_PER_PAGE) => {
    const response = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {
      signal: controller.signal,
      params: {
        apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
        number: limit,
        offset: offset,
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

    const filteredRecipes = mood.length > 0
      ? recipesWithMood.filter((r) => mood.includes(r.mood))
      : recipesWithMood;

    return {
      recipes: filteredRecipes,
      totalResults: response.data.totalResults
    };
  }, [search, diet, allergy, mood, assignMood]);

const fetchCommunityRecipes = useCallback(async (controller) => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/community`, {
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
    mood: r.mood || assignMood(r),
  }));

  if (mood.length > 0) {
    filteredRecipes = filteredRecipes.filter(r => mood.includes(r.mood));
  }

  return { recipes: filteredRecipes, totalResults: filteredRecipes.length };
}, [search, mood, assignMood]);

  const fetchFavoriteRecipes = useCallback(async (controller) => {
    try {
      const favoritesResponse = await favoritesAPI.getFavorites();
      const favorites = favoritesResponse.data;

      if (favorites.length === 0) {
        return { recipes: [], totalResults: 0 };
      }

      const spoonacularFavorites = favorites.filter(fav => fav.is_community === false);
      const communityFavorites = favorites.filter(fav => fav.is_community === true);

      const allRecipes = [];

      if (spoonacularFavorites.length > 0) {
        const spoonacularPromises = spoonacularFavorites.map(async (fav) => {
          try {
            const response = await axios.get(`https://api.spoonacular.com/recipes/${fav.recipe_id}/information`, {
              signal: controller.signal,
              params: {
                apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY
              }
            });

            return {
              ...response.data,
              mood: assignMood(response.data),
              isFavorited: true,
              isCommunityRecipe: false
            };
          } catch (error) {
            console.error(`Error fetching Spoonacular recipe ${fav.recipe_id}:`, error);
            return null;
          }
        });

        const spoonacularRecipes = await Promise.all(spoonacularPromises);
        allRecipes.push(...spoonacularRecipes.filter(recipe => recipe !== null));
      }

      if (communityFavorites.length > 0) {
        const communityPromises = communityFavorites.map(async (fav) => {
          try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/community/${fav.recipe_id}`);

            return {
              ...response.data,
              mood: assignMood(response.data),
              isFavorited: true,
              isCommunityRecipe: true
            };
          } catch (error) {
            console.error(`Error fetching community recipe ${fav.recipe_id}:`, error);
            return null;
          }
        });

        const communityRecipes = await Promise.all(communityPromises);
        allRecipes.push(...communityRecipes.filter(recipe => recipe !== null));
      }

      // Apply filters
      let filteredRecipes = allRecipes;

      if (search) {
        filteredRecipes = filteredRecipes.filter(recipe =>
          recipe.title.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (diet.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe => {
          if (recipe.isCommunityRecipe) return true;
          const recipeDiets = recipe.diets || [];
          return diet.some(d => recipeDiets.includes(d));
        });
      }

      if (mood.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe => mood.includes(recipe.mood));
      }

      if (allergy.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe => {
          const recipeText = `${recipe.title} ${recipe.summary || ""}`.toLowerCase();
          const hasAllergen = allergy.some(allergen =>
            recipeText.includes(allergen.toLowerCase())
          );
          return !hasAllergen;
        });
      }

      return { recipes: filteredRecipes, totalResults: filteredRecipes.length };
    } catch (error) {
      console.error("Error fetching favorite recipes:", error);
      throw error;
    }
  }, [search, diet, allergy, mood, assignMood]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setCurrentPage(1);
    setHasMore(true);

    let fetchFunction;
    if (isFavoritesPage) {
      fetchFunction = fetchFavoriteRecipes;
    } else if (isCommunityList) {
      fetchFunction = fetchCommunityRecipes;
    } else {
      fetchFunction = (controller) => fetchSpoonacularRecipes(controller, 0, RECIPES_PER_PAGE);
    }

    fetchFunction(controller)
      .then((result) => {
        setRecipes(result.recipes);
        if (enableInfiniteScroll && !isFavoritesPage && !isCommunityList) {
          setHasMore(result.recipes.length === RECIPES_PER_PAGE && result.totalResults > RECIPES_PER_PAGE);
        } else {
          setHasMore(false);
        }
      })
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
  }, [isFavoritesPage, isCommunityList, fetchSpoonacularRecipes, fetchCommunityRecipes, fetchFavoriteRecipes, refreshTrigger, enableInfiniteScroll]);

  const handleLoadMore = async () => {
    if (!enableInfiniteScroll || isFavoritesPage || isCommunityList || loadingMore || !hasMore) {
      return;
    }

    setLoadingMore(true);
    setError("");

    try {
      const controller = new AbortController();
      const offset = currentPage * RECIPES_PER_PAGE;
      const result = await fetchSpoonacularRecipes(controller, offset, RECIPES_PER_PAGE);
      
      setRecipes(prev => [...prev, ...result.recipes]);
      setCurrentPage(prev => prev + 1);
      
      const totalLoaded = recipes.length + result.recipes.length;
      setHasMore(result.recipes.length === RECIPES_PER_PAGE && totalLoaded < result.totalResults);
      
    } catch (error) {
      console.error("Error loading more recipes:", error);
      setError("Failed to load more recipes");
    } finally {
      setLoadingMore(false);
    }
  };

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
    <>
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

      {enableInfiniteScroll && !isFavoritesPage && !isCommunityList && (
        <div className="text-center mt-4">
          {hasMore ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="load-more-btn"
            >
              {loadingMore ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Loading More...
                </>
              ) : (
                `Load More Recipes`
              )}
            </Button>
          ) : (
            <div className="text-muted py-3">
              <p>You've reached the end! {recipes.length} recipes loaded.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default RecipeList;