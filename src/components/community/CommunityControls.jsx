import React from "react";
import { Button } from "react-bootstrap";
import { FiPlus, FiFilter } from "react-icons/fi";
import SearchBar from "../global/SearchBar";
import "../../styles/community/community-controls.css";

function CommunityControls({ 
  searchTerm, 
  setSearchTerm, 
  showFilters, 
  onToggleFilters, 
  onCreateRecipe 
}) {
  return (
    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 mb-4">
      <div className="flex-grow-1 w-100">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      <div className="d-flex gap-2">
        <Button
          variant="success"
          className="d-flex align-items-center gap-2"
          onClick={onCreateRecipe}
        >
          <FiPlus />
          Create
        </Button>
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