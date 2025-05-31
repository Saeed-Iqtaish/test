import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { AuthModal } from "../auth/AuthModal";
import Profile from "../auth/Profile";
import "../../styles/global/navbar.css";

function AppNavbar() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (isLoading) {
    return (
      <header className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-title">Mood Meals</h1>
          <div>Loading...</div>
        </div>
      </header>
    );
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-title">Mood Meals</h1>
          
          <nav className="nav-pills">
            <NavLink to="/" end className="nav-pill">
              Home
            </NavLink>
            <NavLink to="/favorites" className="nav-pill">
              Favorites
            </NavLink>
            <NavLink to="/community" className="nav-pill">
              Community
            </NavLink>
            <NavLink to="/account" className="nav-pill">
              Account
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className="nav-pill admin-link">
                Admin
              </NavLink>
            )}
          </nav>

          <div className="auth-section d-flex align-items-center gap-3">
            {isAuthenticated ? (
              <Profile />
            ) : (
              <Button 
                variant="primary" 
                onClick={() => setShowAuthModal(true)}
              >
                Log In
              </Button>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default AppNavbar;