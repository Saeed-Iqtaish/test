import React from "react";
import { FiSearch } from "react-icons/fi";
import "../../styles/global/searchbar.css";

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="search-container">
      <FiSearch className="search-icon" />
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
    </div>
  );
}

export default SearchBar;