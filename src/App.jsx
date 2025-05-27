import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth0ProviderWithHistory from "./auth/Auth0Provider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./Home";
import Community from "./pages/Community";
import Favorites from "./pages/Favorites";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AppNavbar from "./components/global/Navbar";
import Footer from "./components/global/Footer";

function App() {
  return (
    <Auth0ProviderWithHistory>
      <Router>
        <div id="app-wrapper">
          <AppNavbar />
          <main className="container py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/community" 
                element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/favorites" 
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Auth0ProviderWithHistory>
  );
}

export default App;