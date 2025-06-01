import React from "react";
import "../../../styles/community/recipe-header.css";

function CommunityHeader() {
  return (
    <div className="community-header mb-4">
      <div className="text-center">
        <h1 className="community-title">Community Recipes</h1>
        <p className="community-subtitle">
          Share your favorite recipes with the Mood Meals community
        </p>
      </div>
    </div>
  );
}

export default CommunityHeader;