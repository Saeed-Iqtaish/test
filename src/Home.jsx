import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { FiFilter } from "react-icons/fi";
import SearchBar from "./components/global/SearchBar";
import FilterPanel from "./components/filterPanel/FilterPanel";
import RecipeList from "./components/global/RecipeList";
import "./styles/global.css"

function Home() {
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
          />
        </div>
      </Container>
    </>
  );
}

export default Home;