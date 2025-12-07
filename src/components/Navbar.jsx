import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import logo from "../assets/Legacies.png";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 При переходе с hash после смены маршрута
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        // используем нативный smooth scroll без ручной анимации
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location]);

  // 🔹 Обработка кликов по якорям
  const handleNavClick = (e, hash) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      // если мы не на главной — переходим на неё с hash
      navigate("/" + hash);
    } else {
      // если уже на главной — просто плавно скроллим
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-2 position-relative"
      style={{ zIndex: 1030 }}
    >
      <div className="container">
        {/* Лого */}
        <Link className="navbar-brand me-lg-5" to="/">
          <img src={logo} alt="ASTRONUMEROLOGY" style={{ height: 80 }} />
        </Link>

        {/* Кнопка мобильного меню */}
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
            {/* Home */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>

            {/* About */}
            <li className="nav-item">
              <a
                href="#about"
                className="nav-link"
                onClick={(e) => handleNavClick(e, "#about")}
              >
                About
              </a>
            </li>

            {/* Reviews */}
            <li className="nav-item">
              <a
                href="#reviews"
                className="nav-link"
                onClick={(e) => handleNavClick(e, "#reviews")}
              >
                Reviews
              </a>
            </li>

            {/* Blog */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/blog">
                Blog
              </NavLink>
            </li>

            {/* Dropdown: Numerology */}
            <li className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                id="navNumerology"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Numerology
              </a>
              <ul
                className="dropdown-menu dropdown-menu-arrow"
                aria-labelledby="navNumerology"
              >
                <li>
                  <Link
                    className="dropdown-item text-gray"
                    to="/numerology/pifagor"
                  >
                    Pythagoras Square
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item text-gray"
                    to="/numerology/compatibility"
                  >
                    Compatibility by Date of Birth
                  </Link>
                </li>
              </ul>
            </li>

            {/* Dropdown: Personal Consultations */}
            <li className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                id="navConsultations"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Personal Consultations
              </a>
              <ul
                className="dropdown-menu dropdown-menu-arrow"
                aria-labelledby="navConsultations"
              >
                <li>
                  <Link
                    className="dropdown-item text-gray"
                    to="/consultations/natal-chart"
                  >
                    Natal Chart Reading
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item text-gray"
                    to="/consultations/love-forecast"
                  >
                    Love Forecast
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item text-gray"
                    to="/consultations/relocation"
                  >
                    Relocation Forecast
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item text-gray"
                    to="/consultations/life-purpose"
                  >
                    Life Purpose by Stars
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          {/* Правая часть меню */}
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {/* Соцсети */}
            <li className="nav-item">
              <a
                className="nav-link nav-link-icon"
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
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
                title="Instagram"
              >
                <i className="fa fa-instagram"></i>
              </a>
            </li>

            {/* Login / Register */}
            <li className="nav-item me-2">
              <Link className="btn-login" to="/login">
                Login
              </Link>
            </li>
            <li className="nav-item d-none d-lg-block">
              <Link className="btn-register" to="/register">
                <i className="fa fa-user-plus" /> <span>Register</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}






