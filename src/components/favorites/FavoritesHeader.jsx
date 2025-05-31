import React from "react";
import "../../styles/favorites/favorites-header.css";

function FavoritesHeader() {
  return (
    <div className="page-header mb-4">
      <div className="text-center">
        <h1 className="page-title">My Favorites</h1>
        <p className="page-subtitle">
          Your collection of saved recipes with personal notes and cooking tips
        </p>
      </div>
    </div>
  );
}

export default FavoritesHeader;