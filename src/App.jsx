import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth0ProviderWithHistory from "./auth/Auth0Provider";
import Home from "./Home";
import CommunityPage from "./pages/CommunityPage";
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
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/admin" />
              <Route path="/favorites"  />
              <Route path="/account"  />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Auth0ProviderWithHistory>
  );
}

export default App;