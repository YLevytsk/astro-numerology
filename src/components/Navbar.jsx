import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import logo from "../assets/oracle_logo_purple_text.svg";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location]);

  const handleNavClick = (e, hash) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/" + hash);
    } else {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-2 position-relative"
      style={{ zIndex: 1030 }}
    >
      <div className="container">
        <Link className="navbar-brand me-lg-5" to="/">
          <img src={logo} alt="ASTRONUMEROLOGY" style={{ height: 40 }} />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar_global"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbar_global">
          <ul className="navbar-nav align-items-lg-center">

            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>

            <li className="nav-item">
              <a href="#about" className="nav-link" onClick={(e) => handleNavClick(e, "#about")}>
                About
              </a>
            </li>

            <li className="nav-item">
              <a href="#reviews" className="nav-link" onClick={(e) => handleNavClick(e, "#reviews")}>
                Reviews
              </a>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/blog">Blog</NavLink>
            </li>

            <li className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                id="navNumerology"
                role="button"
                data-bs-toggle="dropdown"
              >
                Numerology
              </a>
              <ul className="dropdown-menu dropdown-menu-arrow">
                <li>
                  <Link className="dropdown-item" to="/numerology/pifagor">
                    Pythagoras Square
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/numerology/compatibility">
                    Compatibility by Date of Birth
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                id="navConsultations"
                role="button"
                data-bs-toggle="dropdown"
              >
                Personal Consultations
              </a>
              <ul className="dropdown-menu dropdown-menu-arrow">
                <li>
                  <Link className="dropdown-item" to="/consultations/natal-chart">
                    Natal Chart Reading
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/consultations/love-forecast">
                    Love Forecast
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/consultations/relocation">
                    Relocation Forecast
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/consultations/life-purpose">
                    Life Purpose by Stars
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto align-items-lg-center">

            <li className="nav-item">
              <a
                className="nav-link nav-link-icon"
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa fa-facebook-square"></i>
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link nav-link-icon"
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa fa-instagram"></i>
              </a>
            </li>

            {/* 🔥 ПОКА оставляем Login/Register — позже заменим условиями авторизации */}
            <li className="nav-item me-2">
              <Link className="btn-login" to="/login">Login</Link>
            </li>
            <li className="nav-item d-none d-lg-block">
              <Link className="btn-register" to="/register">
                <span>Register</span>
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}





