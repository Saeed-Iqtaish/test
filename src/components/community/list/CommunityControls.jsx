import React from "react";
import { Button } from "react-bootstrap";
import { FiPlus, FiFilter } from "react-icons/fi";
import SearchBar from "../../global/SearchBar";
import "../../../styles/community/community-controls.css";

function CommunityControls({ 
  searchTerm, 
  setSearchTerm, 
  showFilters, 
  onToggleFilters, 
  onCreateRecipe 
}) {
  return (
    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 mb-4">
      <div className="d-flex align-items-center">
        <Button
          variant="success"
          className="create-recipe-btn d-flex align-items-center gap-2"
          onClick={onCreateRecipe}
        >
          <FiPlus />
          Create
        </Button>
      </div>
      <div className="d-flex flex-column flex-md-row align-items-center gap-3">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
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

export default CommunityControls;