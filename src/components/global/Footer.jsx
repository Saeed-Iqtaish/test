import React from "react";
import "../../styles/global/footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <p className="footer-copyright">© 2025 Mood Meals</p>
        <div className="footer-links">
          <a href="/terms">Terms & Conditions</a>
          <a href="/privacy">Cookie Policy</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;