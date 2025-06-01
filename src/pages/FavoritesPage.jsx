import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "../components/auth/AuthModal";
import FavoritesHeader from "../components/favorites/FavoritesHeader";
import SearchFilterControls from "../components/global/SearchFilterControls";
import FilterModal from "../components/filterPanel/FilterModal";
import RecipeList from "../components/global/RecipeList";
import RecipeDetails from "../components/global/RecipeDetails";
import "../styles/global/global.css";

function FavoritesPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
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

  useEffect(() => {
    const delay = setTimeout(() => {
      setAppliedFilters((prev) => ({
        ...prev,
        search: filters.search,
      }));
    }, 300);
    return () => clearTimeout(delay);
  }, [filters.search]);

  const updateFilter = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const cleared = { search: "", diet: [], allergy: [], mood: [] };
    setFilters(cleared);
    setAppliedFilters(cleared);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.mood.length > 0) count += filters.mood.length;
    if (filters.diet.length > 0) count += filters.diet.length;
    if (filters.allergy.length > 0) count += filters.allergy.length;
    return count;
  };

  function handleRecipeClick(recipe) {
    setSelectedRecipe(recipe);
    setShowRecipeDetails(true);
  }

  function handleRecipeDetailsClose() {
    setShowRecipeDetails(false);
    setSelectedRecipe(null);
  }

  function handleViewFullRecipe(recipe) {
    if (recipe.isCommunityRecipe) {
      navigate(`/community/${recipe.id}`);
    }
    setShowRecipeDetails(false);
  }

  function handleFavoriteChange(recipeId, isFavorited) {
    console.log(`Recipe ${recipeId} favorite status changed: ${isFavorited}`);
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

        <SearchFilterControls
          searchTerm={filters.search}
          setSearchTerm={(val) => updateFilter("search", val)}
          onFilterClick={() => setShowFilters(true)}
          showFilters={showFilters}
          activeFilterCount={getActiveFilterCount()}
          alignment="right"
        />

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

      <RecipeDetails
        show={showRecipeDetails}
        onHide={handleRecipeDetailsClose}
        recipe={selectedRecipe}
        isCommunityRecipe={selectedRecipe?.isCommunityRecipe || false}
        onFavoriteChange={handleFavoriteChange}
        onViewFullRecipe={handleViewFullRecipe}
      />

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