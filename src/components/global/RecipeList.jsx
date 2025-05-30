import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import RecipeCard from "./RecipeCard";

function RecipeList({
  search,
  diet,
  allergy,
  mood,
  isCommunityList = false,
  refreshTrigger = 0,
  onRecipeClick
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

    // Apply client-side filtering
    if (search) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Add mood assignment for community recipes
    filteredRecipes = filteredRecipes.map(r => ({
      ...r,
      mood: assignMood(r),
    }));

    // Apply mood filter
    if (mood.length > 0) {
      filteredRecipes = filteredRecipes.filter(r => mood.includes(r.mood));
    }

    return filteredRecipes;
  }, [search, mood, assignMood]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    const fetchFunction = isCommunityList ? fetchCommunityRecipes : fetchSpoonacularRecipes;

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
  }, [isCommunityList, fetchSpoonacularRecipes, fetchCommunityRecipes, refreshTrigger]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!recipes.length) return <p>No recipes found.</p>;

  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {recipes.map((recipe) => (
        <Col key={recipe.id} className="d-flex">
          <RecipeCard 
            recipe={recipe} 
            isCommunityRecipe={isCommunityList}
            onClick={isCommunityList ? onRecipeClick : undefined}
          />
        </Col>
      ))}
    </Row>
  );
}

export default RecipeList;