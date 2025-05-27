import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import CommunityHeader from "../components/community/CommunityHeader";
import CommunityControls from "../components/community/CommunityControls";
import FilterPanel from "../components/filterPanel/FilterPanel";
import RecipeList from "../components/global/RecipeList";
import CreateRecipeModal from "../components/community/CreateRecipeModal";
import "../styles/global/global.css";

function CommunityPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  function handleRecipeCreated() {
    setShowCreateModal(false);
    setRefreshTrigger(prev => prev + 1);
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
          onCreateRecipe={() => setShowCreateModal(true)}
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

      <CreateRecipeModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onSuccess={handleRecipeCreated}
      />
    </>
  );
}

export default CommunityPage;