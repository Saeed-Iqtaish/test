import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoginButton from "../auth/LoginButton";
import LogoutButton from "../auth/LogoutButton";
import Profile from "../auth/Profile";
import "../../styles/global/navbar.css";

function AppNavbar() {
  const { isAuthenticated, isLoading } = useAuth();

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

  return (
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
        </nav>

        <div className="auth-section d-flex align-items-center gap-3">
          {isAuthenticated ? (
            <>
              <Profile />
              <LogoutButton />
            </>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  );
}

export default AppNavbar;