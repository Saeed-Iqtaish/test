import React from "react";
import { FiFilter } from "react-icons/fi";
import SearchBar from "../global/SearchBar";

function FavoritesControls({ 
  searchTerm, 
  setSearchTerm, 
  showFilters, 
  onToggleFilters
}) {
  return (
    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 mb-4">
      <div className="flex-grow-1 w-100">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      <div className="text-end">
        <button
          className={`filter-button ${showFilters ? "active" : ""}`}
          onClick={onToggleFilters}
        >
          <FiFilter className="filter-icon" />
          Filter
        </button>
      </div>
    </div>
  );
}

export default FavoritesControls;