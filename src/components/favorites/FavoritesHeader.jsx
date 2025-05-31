import React from "react";
//import "../../styles/favorites/favorites-header.css";

function FavoritesHeader() {
  return (
    <div className="favorites-header mb-4">
      <div className="text-center">
        <h1 className="favorites-title">My Favorites</h1>
        <p className="favorites-subtitle">
          Your collection of saved recipes with personal notes
        </p>
      </div>
    </div>
  );
}

export default FavoritesHeader;