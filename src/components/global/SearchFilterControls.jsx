import React from "react";
import { FiFilter } from "react-icons/fi";
import SearchBar from "./SearchBar";
import "../../styles/global/search-filter-controls.css";

function SearchFilterControls({ 
  searchTerm, 
  setSearchTerm, 
  onFilterClick,
  showFilters = false,
  activeFilterCount = 0,
  className = "",
  alignment = "right"
}) {
  const getContainerClass = () => {
    const baseClass = "search-filter-controls";
    const alignmentClass = `align-${alignment}`;
    return `${baseClass} ${alignmentClass} ${className}`.trim();
  };

  return (
    <div className={getContainerClass()}>
      <div className="search-filter-group">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <button
          className={`filter-button ${showFilters ? "active" : ""}`}
          onClick={onFilterClick}
          aria-label="Open filters"
        >
          <FiFilter className="filter-icon" />
          Filter
          {activeFilterCount > 0 && (
            <span className="badge bg-primary ms-2" aria-label={`${activeFilterCount} active filters`}>
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default SearchFilterControls;