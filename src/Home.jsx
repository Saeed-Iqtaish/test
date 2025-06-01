import React from "react";
import { Container } from "react-bootstrap";
import EnhancedHomeHeader from "./components/home/EnhancedHomeHeader";
import SearchFilterControls from "./components/global/SearchFilterControls";
import RecipeList from "./components/global/RecipeList";
import RecipeDetails from "./components/global/RecipeDetails";
import FilterModal from "./components/filterPanel/FilterModal";
import { AuthModal } from "./components/auth/AuthModal";
import useRecipeFilters from "./hooks/useRecipeFilters";
import useHomeModals from "./hooks/useHomeModals";
import useRecipeInteractions from "./hooks/useRecipeInteractions";
import "./styles/global/global.css";

function Home() {
  const {
    filters,
    appliedFilters,
    updateFilter,
    applyFilters,
    clearFilters,
    getActiveFilterCount,
    userAllergies
  } = useRecipeFilters();

  const {
    showFilterModal,
    showAuthModal,
    showRecipeDetails,
    selectedRecipe,
    openFilterModal,
    closeFilterModal,
    openAuthModal,
    closeAuthModal,
    openRecipeDetails,
    closeRecipeDetails,
    handleAuthSuccess
  } = useHomeModals();

  const {
    handleRecipeClick,
    handleFavoriteChange,
    handleLoginRequired
  } = useRecipeInteractions({
    openRecipeDetails,
    openAuthModal
  });

  // Filter handlers
  const handleApplyFilters = () => {
    applyFilters();
    closeFilterModal();
  };

  return (
    <>
      <Container fluid className="px-3 px-md-5">
        {/* Enhanced Page Header */}
        <EnhancedHomeHeader />
        
        {/* Search and Filter Controls */}
        <SearchFilterControls
          searchTerm={filters.search}
          setSearchTerm={(val) => updateFilter("search", val)}
          onFilterClick={openFilterModal}
          showFilters={showFilterModal}
          activeFilterCount={getActiveFilterCount()}
          alignment="right"
        />

        {/* Recipe List */}
        <div className="mt-4">
          <RecipeList
            search={appliedFilters.search}
            diet={appliedFilters.diet}
            allergy={appliedFilters.allergy}
            mood={appliedFilters.mood}
            onRecipeClick={handleRecipeClick}
            onFavoriteChange={handleFavoriteChange}
            onLoginRequired={handleLoginRequired}
            enableInfiniteScroll={true}
          />
        </div>
      </Container>

      {/* Recipe Details Modal */}
      <RecipeDetails
        show={showRecipeDetails}
        onHide={closeRecipeDetails}
        recipe={selectedRecipe}
        isCommunityRecipe={false}
        onFavoriteChange={handleFavoriteChange}
      />

      {/* Filter Modal */}
      <FilterModal
        show={showFilterModal}
        onHide={closeFilterModal}
        filters={filters}
        setFilters={(newFilters) => {
          // Update multiple filters at once
          Object.keys(newFilters).forEach(key => {
            if (filters[key] !== newFilters[key]) {
              updateFilter(key, newFilters[key]);
            }
          });
        }}
        onApply={handleApplyFilters}
        onClear={clearFilters}
        userAllergies={userAllergies}
      />

      {/* Auth Modal for login prompts */}
      <AuthModal
        show={showAuthModal}
        onHide={closeAuthModal}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default Home;