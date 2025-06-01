// src/components/home/EnhancedHomeHeader.jsx
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/home/home-header.css";

function HomeHeader() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="enhanced-home-header">
      <div className="header-content">
        <div className="header-main">
          <h1 className="header-title">
            {isAuthenticated ? `Welcome back, ${user?.username}!` : "Discover Recipes"}
          </h1>
          <p className="header-subtitle">
            {isAuthenticated 
              ? "Find the perfect recipe to match your mood and dietary preferences"
              : "Find the perfect recipe to match your mood and dietary preferences"
            }
          </p>
        </div>
        
        {isAuthenticated && user?.allergies && user.allergies.length > 0 && (
          <div className="user-allergies-info">
            <div className="allergies-indicator">
              <span className="allergies-icon">🛡️</span>
              <div className="allergies-text">
                <small className="allergies-label">Auto-filtering:</small>
                <div className="allergies-list">
                  {user.allergies.map((allergy, index) => (
                    <span key={allergy} className="allergy-badge">
                      {allergy}
                      {index < user.allergies.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeHeader;