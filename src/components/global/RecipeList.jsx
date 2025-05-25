import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import RecipeCard from "./RecipeCard";

function RecipeList({ search, diet, allergy, mood }) {
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

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    console.log("Fetching with:", { search, diet, allergy, mood });

    axios
      .get("https://api.spoonacular.com/recipes/complexSearch", {
        signal: controller.signal,
        params: {
          apiKey: "68f91166a81747958d41b82fa5f038c9",
          number: 12,
          addRecipeInformation: true,
          query: search || "",
          diet: diet.length > 0 ? diet[0].toLowerCase() : undefined,
          intolerances: allergy.length > 0 ? allergy.join(",").toLowerCase() : undefined,
        },
      })
      .then((res) => {
        const recipesWithMood = res.data.results.map((r) => ({
          ...r,
          mood: assignMood(r),
        }));

        const finalList =
          mood.length > 0
            ? recipesWithMood.filter((r) => mood.includes(r.mood))
            : recipesWithMood;

        setRecipes(finalList);
      })
      .catch((err) => {
        console.error("API Error:", err);
        if (err.response) {
          // The request was made and the server responded with a status code
          setError(`API Error: ${err.response.status} - ${err.response.data.message}`);
        } else if (err.request) {
          // The request was made but no response was received
          setError("Network error - please check your connection");
        } else {
          // Something happened in setting up the request
          setError("Request setup error");
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, [search, diet, allergy, mood, assignMood]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!recipes.length) return <p>No recipes found.</p>;

  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {recipes.map((recipe) => (
        <Col key={recipe.id} className="d-flex">
          <RecipeCard recipe={recipe} />
        </Col>
      ))}
    </Row>
  );
}

export default RecipeList;