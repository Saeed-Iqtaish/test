import React, { useState, useEffect } from "react";
import { Container, Alert } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
import CommunityHeader from "../components/community/CommunityHeader";
import CommunityControls from "../components/community/CommunityControls";
import FilterPanel from "../components/filterPanel/FilterPanel";
import RecipeList from "../components/global/RecipeList";
import CreateRecipeModal from "../components/community/CreateRecipeModal";
import LoginButton from "../components/auth/LoginButton";
import "../styles/global/global.css";

function CommunityPage() {
  const { isAuthenticated } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
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
    setShowFilters(false);
  }

  function handleClearFilters() {
    const cleared = { search: "", diet: [], allergy: [], mood: [] };
    setFilters(cleared);
    setAppliedFilters(cleared);
  }

  function handleCreateRecipe() {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setShowCreateModal(true);
  }

  function handleRecipeCreated() {
    setShowCreateModal(false);
    setRefreshTrigger(prev => prev + 1);
  }

  function handleLoginPromptClose() {
    setShowLoginPrompt(false);
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
            isCommunityList={true}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </Container>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login Required</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleLoginPromptClose}
                ></button>
              </div>
              <div className="modal-body text-center">
                <h4 className="mb-3">Share Your Recipes!</h4>
                <p className="mb-4">
                  You need to be logged in to share your delicious recipes with the Mood Meals community.
                </p>
                <LoginButton />
              </div>
              <div className="modal-footer">
                <button
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleLoginPromptClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Recipe Modal - Only show if authenticated */}
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