import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import USFlag from '../../assets/svg/us.svg';
import EGFlag from "../../assets/svg/sa.svg";
import "../Navbar/Navbar.css"; // Ensure you have the CSS file for styling
import logo from '../../assets/images/logo.png';
import {Link} from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const { t, i18n } = useTranslation();
    const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);

  };

  // Detect screen size change for mobile/desktop behavior
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleDropdownClick = () => {
    if (isMobile) {
      setDropdownOpen(!dropdownOpen); // Only toggle on mobile
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <img className="navbar-logo" src={logo} alt="MyBrand" />
      <div className="navbar-container">
      {/* Links */}
      <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
        <li><Link to="/" onClick={() => setIsOpen(false)}>{t("nav-home")}</Link></li>
        <li><a href="#services" onClick={() => setIsOpen(false)}>{t("nav-services")}</a></li>
        <li><a href="#portfolio" onClick={() => setIsOpen(false)}>{t("nav-portfolio")}</a></li>

        {/* Dropdown */}
        <li
          className={`dropdown ${dropdownOpen ? "open" : ""}`}
          onMouseEnter={() => !isMobile && setDropdownOpen(true)}
          onMouseLeave={() => !isMobile && setDropdownOpen(false)}
        >
          <button
            className="dropdown-toggle"
            onClick={handleDropdownClick}
          >
            {t("nav-more")}
          </button>
          {dropdownOpen && (
            <ul className="dropdown-menu">
              <li><a href="#team" onClick={() => setIsOpen(false)}>Our Team</a></li>
              <li><a href="#blog" onClick={() => setIsOpen(false)}>Blog</a></li>
              <li><a href="#contact" onClick={() => setIsOpen(false)}>Contact</a></li>
            </ul>
          )}
        </li>
      </ul>
             <img className="us-flag"
          src={USFlag}
          alt="English"
          onClick={() => changeLanguage("en")}
          
        />

          <img className="ar-flag"
          src={EGFlag}
          alt="العربية"
          onClick={() => changeLanguage("ar")}
          
        />

      {/* Mobile Menu Toggle */}
      <div className="navbar-toggle" onClick={toggleMenu}>
        {isOpen ? "✖" : "☰"}
      </div>
      </div>
    </nav>
  );
}
