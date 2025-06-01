import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./Home";
import CommunityPage from "./pages/CommunityPage";
import CommunityRecipePage from "./pages/CommunityRecipePage";
import FavoritesPage from "./pages/FavoritesPage";
import AccountPage from "./pages/AccountPage";
import AdminPage from "./pages/AdminPage";
import AdminCommunityRecipePage from "./pages/AdminCommunityRecipePage";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AppNavbar from "./components/global/Navbar";
import Footer from "./components/global/Footer";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div id="app-wrapper">
          <AppNavbar />
          <main className="container py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/community/:id" element={<CommunityRecipePage />} />
              <Route path="/account" element={<AccountPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/community/:id" element={<AdminCommunityRecipePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;