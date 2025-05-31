import React, { useState, useEffect, useCallback } from "react";
import { Container } from "react-bootstrap";
import { FiFilter } from "react-icons/fi";
import SearchBar from "./components/global/SearchBar";
import FilterModal from "./components/filterPanel/FilterModal";
import RecipeList from "./components/global/RecipeList";
import RecipeDetails from "./components/global/RecipeDetails";
import HomeHeader from "./components/home/HomeHeader";
import { AuthModal } from "./components/auth/AuthModal";
import { useAuth } from "./contexts/AuthContext";
import "./styles/global/global.css"

function Home() {
  const { user, isAuthenticated } = useAuth();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Initialize filters with user allergies if logged in - use useCallback to memoize
  const getInitialFilters = useCallback(() => ({
    search: "",
    diet: [],
    allergy: isAuthenticated && user?.allergies ? [...user.allergies] : [],
    mood: [],
  }), [isAuthenticated, user?.allergies]);

  const [filters, setFilters] = useState(getInitialFilters());
  const [appliedFilters, setAppliedFilters] = useState(getInitialFilters());
  const [showRecipeDetails, setShowRecipeDetails] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Update filters when user auth state changes
  useEffect(() => {
    const newFilters = getInitialFilters();
    setFilters(newFilters);
    setAppliedFilters(newFilters);
  }, [getInitialFilters]);

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
    // When clearing, keep user allergies but clear everything else
    const clearedFilters = {
      search: "",
      diet: [],
      allergy: isAuthenticated && user?.allergies ? [...user.allergies] : [],
      mood: []
    };
    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
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

  // Calculate active filter count for display
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.mood.length > 0) count += filters.mood.length;
    if (filters.diet.length > 0) count += filters.diet.length;
    if (filters.allergy.length > 0) count += filters.allergy.length;
    return count;
  };

  return (
    <>
      <Container fluid className="px-3 px-md-5">
        <HomeHeader />
        
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-end gap-3 mb-4">
          <div className="d-flex flex-column flex-md-row align-items-center gap-3">
            <SearchBar
              searchTerm={filters.search}
              setSearchTerm={(val) =>
                setFilters((prev) => ({ ...prev, search: val }))
              }
            />
            <button
              className={`filter-button ${showFilterModal ? "active" : ""}`}
              onClick={() => setShowFilterModal(true)}
            >
              <FiFilter className="filter-icon" />
              Filter
              {/* Show count of active filters */}
              {getActiveFilterCount() > 0 && (
                <span className="badge bg-primary ms-2">{getActiveFilterCount()}</span>
              )}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <RecipeList
            search={appliedFilters.search}
            diet={appliedFilters.diet}
            allergy={appliedFilters.allergy}
            mood={appliedFilters.mood}
            onRecipeClick={handleRecipeClick}
            onFavoriteChange={handleFavoriteChange}
            onLoginRequired={handleLoginRequired}
            enableInfiniteScroll={true} // Enable infinite scrolling for home page
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

      {/* Filter Modal */}
      <FilterModal
        show={showFilterModal}
        onHide={() => setShowFilterModal(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        userAllergies={user?.allergies || []}
      />

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