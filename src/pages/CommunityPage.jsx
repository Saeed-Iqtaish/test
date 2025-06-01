import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "../components/auth/AuthModal";
import CommunityHeader from "../components/community/list/CommunityHeader";
import CommunityControls from "../components/community/list/CommunityControls";
import FilterModal from "../components/filterPanel/FilterModal";
import RecipeList from "../components/global/RecipeList";
import RecipeDetails from "../components/global/RecipeDetails";
import CreateRecipeModal from "../components/community/list/CreateRecipeModal";
import "../styles/global/global.css";

function CommunityPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRecipeDetails, setShowRecipeDetails] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  const [filters, setFilters] = useState({
    search: "",
    diet: [],
    allergy: [],
    mood: [],
  });
  const [appliedFilters, setAppliedFilters] = useState({ ...filters });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

  function handleCreateRecipe() {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setShowCreateModal(true);
  }

  function handleRecipeCreated() {
    setShowCreateModal(false);
    setRefreshTrigger(prev => prev + 1);
  }

  function handleAuthSuccess() {
    setShowAuthModal(false);
    setShowCreateModal(true);
  }

  function handleRecipeClick(recipe) {
    setSelectedRecipe(recipe);
    setShowRecipeDetails(true);
  }

  function handleRecipeDetailsClose() {
    setShowRecipeDetails(false);
    setSelectedRecipe(null);
  }

  function handleViewFullRecipe(recipe) {
    navigate(`/community/${recipe.id}`);
    setShowRecipeDetails(false);
  }

  function handleFavoriteChange(recipeId, isFavorited) {
    console.log(`Recipe ${recipeId} favorite status changed: ${isFavorited}`);
  }

  return (
    <>
      <Container fluid className="px-3 px-md-5">
        <CommunityHeader />
        
        <CommunityControls
          searchTerm={filters.search}
          setSearchTerm={(val) => setFilters((prev) => ({ ...prev, search: val }))}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters((prev) => !prev)}
          onCreateRecipe={handleCreateRecipe}
        />

        <div className="mt-4">
          <RecipeList
            search={appliedFilters.search}
            diet={appliedFilters.diet}
            allergy={appliedFilters.allergy}
            mood={appliedFilters.mood}
            isCommunityList={true}
            refreshTrigger={refreshTrigger}
            onRecipeClick={handleRecipeClick}
            onFavoriteChange={handleFavoriteChange}
          />
        </div>
      </Container>

      <RecipeDetails
        show={showRecipeDetails}
        onHide={handleRecipeDetailsClose}
        recipe={selectedRecipe}
        isCommunityRecipe={true}
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

      <AuthModal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {isAuthenticated && (
        <CreateRecipeModal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onSuccess={handleRecipeCreated}
        />
      )}
    </>
  );
}

export default CommunityPage;