import React, { useContext, useEffect } from "react"; // Add useEffect import
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../navbar.css"; // Assuming your friend's CSS is saved as style.css
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faFolder, faBriefcase, faUser, faSearch, faSignOutAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
//import { Home, Search, User } from 'react-feather';


const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Initialize Feather Icons
  
  

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="header">
      {/* Logo Section */}
      
      <div className="header__logo">
      <Link className="text-light text-decoration-none" to="/">
        <strong>Freelance.tn</strong>
        </Link>
      </div>
      
      {/* Navbar Section */}
      <nav className="navbar ">
        <ul className="navbar__menu">
          {isAuthenticated && user?.role === "freelancer" && (
            <>
              <li className="navbar__item">
              
                <Link className="navbar__link" to="/freelancer/portfolio">
                <i data-feather="folder"></i>
                  <span>Portfolio</span>
                </Link>
              </li>
              <li className="navbar__item">
                <Link className="navbar__link" to="/freelancer/home">
                  <i data-feather="home"></i>
                  <span>Projects</span>
                </Link>
              </li>
              <li className="navbar__item">
                <Link className="navbar__link" to="/freelancer/offers">
                  <i data-feather="briefcase"></i>
                  <span>Offers</span>
                </Link>
              </li>
              <li className="navbar__item">
                <Link className="navbar__link" to="/freelancer/profile">
                  <i data-feather="user"></i>
                  <span>Profile</span>
                </Link>
              </li>
            </>
          )}
          {isAuthenticated && user?.role === "client" && (
            <>
              <li className="navbar__item">
                <Link className="navbar__link" to="/client/search">
                  <i data-feather="search"></i>
                  <span>Search</span>
                </Link>
              </li>
              <li className="navbar__item">
                <Link className="navbar__link" to="/client/projects">
                  <i data-feather="folder"></i>
                  <span>My Projects</span>
                </Link>
              </li>
              <li className="navbar__item">
                <Link className="navbar__link" to="/client/profile">
                  <i data-feather="user"></i>
                  <span>Profile</span>
                </Link>
              </li>
            </>
          )}
          {isAuthenticated && (
            <li className="navbar__item">
              <a href="#" className="navbar__link" onClick={handleLogout}>
                <i data-feather="log-out"></i>
                <span>Logout</span>
              </a>
            </li>
          )}
          {!isAuthenticated && (
            <>
              <li className="navbar__item">
                <Link className="navbar__link" to="/login">
               
                  <span>Login</span>
                </Link>
              </li>
              <li className="navbar__item">
                <Link className="navbar__link" to="/register">
               
                  <span>Register</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
