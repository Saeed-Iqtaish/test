import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { FiFilter } from "react-icons/fi";
import SearchBar from "./components/global/SearchBar";
import FilterPanel from "./components/filterPanel/FilterPanel";
import RecipeList from "./components/global/RecipeList";
import RecipeDetails from "./components/global/RecipeDetails";
import { AuthModal } from "./components/auth/AuthModal";
import "./styles/global/global.css"

function Home() {
  const [showFilters, setShowFilters] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    diet: [],
    allergy: [],
    mood: [],
  });
  const [appliedFilters, setAppliedFilters] = useState({ ...filters });
  const [showRecipeDetails, setShowRecipeDetails] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Debounce for live search
  useEffect(() => {
    const delay = setTimeout(() => {
      setAppliedFilters((prev) => ({
        ...prev,
        search: filters.search,
      }));
    }, 300);
    return () => clearTimeout(delay);
  }, [filters.search]);

  function handleApplyFilters() {
    setAppliedFilters({ ...filters });
    setShowFilters(false);
  }

  function handleClearFilters() {
    const cleared = { search: "", diet: [], allergy: [], mood: [] };
    setFilters(cleared);
    setAppliedFilters(cleared);
  }

  function handleRecipeClick(recipe) {
    setSelectedRecipe(recipe);
    setShowRecipeDetails(true);
  }

  function handleRecipeDetailsClose() {
    setShowRecipeDetails(false);
    setSelectedRecipe(null);
  }

  function handleFavoriteChange(recipeId, isFavorited) {
    console.log(`Recipe ${recipeId} favorite status changed: ${isFavorited}`);
  }

  function handleLoginRequired() {
    setShowAuthModal(true);
  }

  function handleAuthSuccess() {
    setShowAuthModal(false);
  }

  return (
    <>
      <Container fluid className="px-3 px-md-5">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 mb-4">
          <div className="flex-grow-1 w-100">
            <SearchBar
              searchTerm={filters.search}
              setSearchTerm={(val) =>
                setFilters((prev) => ({ ...prev, search: val }))
              }
            />
          </div>
          <div className="text-end">
            <button
              className={`filter-button ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <FiFilter className="filter-icon" />
              Filter
            </button>
          </div>
        </div>

        <FilterPanel
          show={showFilters}
          filters={filters}
          setFilters={setFilters}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />

        <div className="mt-4">
          <RecipeList
            search={appliedFilters.search}
            diet={appliedFilters.diet}
            allergy={appliedFilters.allergy}
            mood={appliedFilters.mood}
            onRecipeClick={handleRecipeClick}
            onFavoriteChange={handleFavoriteChange}
            onLoginRequired={handleLoginRequired}
          />
        </div>

        <RecipeDetails
          show={showRecipeDetails}
          onHide={handleRecipeDetailsClose}
          recipe={selectedRecipe}
          isCommunityRecipe={false}
          onFavoriteChange={handleFavoriteChange}
        />
      </Container>

      {/* Auth Modal for login prompts */}
      <AuthModal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default Home;