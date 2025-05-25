import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/navbar.css";

function AppNavbar({ searchTerm, setSearchTerm, toggleFilters }) {
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
      </div>
    </header>
  );
}

export default AppNavbar;