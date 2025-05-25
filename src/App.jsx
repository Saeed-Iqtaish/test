import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AppNavbar from "./components/global/Navbar";
import Footer from "./components/global/Footer";
// import Favorites from "./pages/Favorites";
// import Account from "./pages/Account";
// import Community from "./pages/Community";

function App() {
  return (
    <Router>
      <div id="app-wrapper">
        <AppNavbar />
        <main className="container py-4">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;