import React from "react";
import { Container } from "react-bootstrap";
import HomeHeader from "./components/home/HomeHeader";
import SearchFilterControls from "./components/global/SearchFilterControls";
import RecipeList from "./components/global/RecipeList";
import RecipeDetails from "./components/global/RecipeDetails";
import FilterModal from "./components/filterPanel/FilterModal";
import { AuthModal } from "./components/auth/AuthModal";
import useRecipeFilters from "./hooks/useRecipeFilters .js";
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

  const handleApplyFilters = () => {
    applyFilters();
    closeFilterModal();
  };

  return (
    <>
      <Container fluid className="px-3 px-md-5">
        <HomeHeader />
        
        <SearchFilterControls
          searchTerm={filters.search}
          setSearchTerm={(val) => updateFilter("search", val)}
          onFilterClick={openFilterModal}
          showFilters={showFilterModal}
          activeFilterCount={getActiveFilterCount()}
          alignment="right"
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
            enableInfiniteScroll={true}
          />
        </div>
      </Container>

      <RecipeDetails
        show={showRecipeDetails}
        onHide={closeRecipeDetails}
        recipe={selectedRecipe}
        isCommunityRecipe={false}
        onFavoriteChange={handleFavoriteChange}
      />

      <FilterModal
        show={showFilterModal}
        onHide={closeFilterModal}
        filters={filters}
        setFilters={(newFilters) => {
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

      <AuthModal
        show={showAuthModal}
        onHide={closeAuthModal}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default Home;