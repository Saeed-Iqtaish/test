import React from "react";
import "../../styles/home/home-header.css";

function HomeHeader() {
  return (
    <div className="page-header mb-4">
      <div className="text-center">
        <h1 className="page-title">Discover Recipes</h1>
        <p className="page-subtitle">
          Find the perfect recipe to match your mood and dietary preferences
        </p>
      </div>
    </div>
  );
}

export default HomeHeader;