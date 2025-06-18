import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/home/home-header.css";

function HomeHeader() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="page-header">
      <div className="text-center">
        <h1 className="page-title">
          {isAuthenticated ? `Welcome back, ${user?.username}!` : "Discover Your Perfect Recipe"}
        </h1>
        <p className="page-subtitle">
          {isAuthenticated 
            ? "Find recipes that match your mood and dietary preferences"
            : "Search thousands of recipes tailored to your mood and dietary needs"
          }
        </p>
      </div>

      {isAuthenticated && user?.allergies && user.allergies.length > 0 && (
        <div className="mt-3 text-center">
          <div className="d-inline-flex align-items-center bg-white bg-opacity-25 rounded-pill px-3 py-2">
            <span className="me-2">🛡️</span>
            <small className="text-white">
              <strong>Auto-filtering:</strong> {user.allergies.join(', ')}
            </small>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeHeader;