import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { FiFilter } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "../components/auth/AuthModal";
import FavoritesHeader from "../components/favorites/FavoritesHeader";
import SearchBar from "../components/global/SearchBar";
import FilterPanel from "../components/filterPanel/FilterPanel";
import RecipeList from "../components/global/RecipeList";
import "../styles/global/global.css";

function FavoritesPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
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
    setShowFilters(false);
  }

  function handleClearFilters() {
    const cleared = { search: "", diet: [], allergy: [], mood: [] };
    setFilters(cleared);
    setAppliedFilters(cleared);
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
    <Container fluid className="px-3 px-md-5">
      <FavoritesHeader />
      
      {/* Search and Filter Controls - Same pattern as Home */}
      <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 mb-4">
        <div className="flex-grow-1 w-100">
          <SearchBar
            searchTerm={filters.search}
            setSearchTerm={(val) => setFilters((prev) => ({ ...prev, search: val }))}
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
          isFavoritesPage={true}
        />
      </div>
    </Container>
  );
}

export default FavoritesPage;