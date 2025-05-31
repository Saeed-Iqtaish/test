import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { FiFilter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "../components/auth/AuthModal";
import FavoritesHeader from "../components/favorites/FavoritesHeader";
import SearchBar from "../components/global/SearchBar";
import FilterModal from "../components/filterPanel/FilterModal"; // Changed import
import RecipeList from "../components/global/RecipeList";
import RecipeDetails from "../components/global/RecipeDetails";
import "../styles/global/global.css";

function FavoritesPage() {
  const { user, isAuthenticated, isLoading } = useAuth(); // Added user here
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showRecipeDetails, setShowRecipeDetails] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    diet: [],
    allergy: [],
    mood: [],
  });
  const [appliedFilters, setAppliedFilters] = useState({ ...filters });

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
  }

  function handleClearFilters() {
    const cleared = { search: "", diet: [], allergy: [], mood: [] };
    setFilters(cleared);
    setAppliedFilters(cleared);
  }

  function handleRecipeClick(recipe) {
    // Show modal first for all recipes
    setSelectedRecipe(recipe);
    setShowRecipeDetails(true);
  }

  function handleRecipeDetailsClose() {
    setShowRecipeDetails(false);
    setSelectedRecipe(null);
  }

  function handleViewFullRecipe(recipe) {
    // Navigate to full recipe page from modal
    if (recipe.isCommunityRecipe) {
      navigate(`/community/${recipe.id}`);
    } else {
      // For API recipes, could navigate to a recipe detail page or just close modal
      console.log('API recipe - could implement full recipe page');
    }
    setShowRecipeDetails(false);
  }

  function handleFavoriteChange(recipeId, isFavorited) {
    console.log(`Recipe ${recipeId} favorite status changed: ${isFavorited}`);
    // Recipe will be automatically removed from favorites list if unfavorited
  }

  if (isLoading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Container className="text-center py-5">
          <div className="alert alert-info">
            <h4 className="alert-heading">Login Required</h4>
            <p className="mb-4">You need to be logged in to view your favorite recipes.</p>
            <Button
              variant="primary"
              onClick={() => setShowAuthModal(true)}
            >
              Log In
            </Button>
          </div>
        </Container>

        <AuthModal
          show={showAuthModal}
          onHide={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  return (
    <>
      <Container fluid className="px-3 px-md-5">
        <FavoritesHeader />

        {/* Search and Filter Controls - Moved to right */}
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-end gap-3 mb-4">
          <div className="d-flex flex-column flex-md-row align-items-center gap-3">
            <SearchBar
              searchTerm={filters.search}
              setSearchTerm={(val) => setFilters((prev) => ({ ...prev, search: val }))}
            />
            <button
              className={`filter-button ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <FiFilter className="filter-icon" />
              Filter
            </button>
          </div>
        </div>

        <div className="mt-4">
          <RecipeList
            search={appliedFilters.search}
            diet={appliedFilters.diet}
            allergy={appliedFilters.allergy}
            mood={appliedFilters.mood}
            isFavoritesPage={true}
            onRecipeClick={handleRecipeClick}
            onFavoriteChange={handleFavoriteChange}
          />
        </div>
      </Container>

      {/* Recipe Details Modal for Favorites */}
      <RecipeDetails
        show={showRecipeDetails}
        onHide={handleRecipeDetailsClose}
        recipe={selectedRecipe}
        isCommunityRecipe={selectedRecipe?.isCommunityRecipe || false}
        onFavoriteChange={handleFavoriteChange}
        onViewFullRecipe={handleViewFullRecipe}
      />

      {/* Filter Modal */}
      <FilterModal
        show={showFilters}
        onHide={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        userAllergies={user?.allergies || []}
      />
    </>
  );
}

export default FavoritesPage;