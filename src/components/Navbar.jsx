import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../assets/css/custom.css";

import {
  selectIsLoggedIn,
  selectUser,
  selectIsRefreshing,
} from "../redux/auth/selectors";
import { logoutThunk } from "../redux/auth/operations";

import logo from "../assets/oracle_logo_purple_text.svg";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);
  const user = useSelector(selectUser);

  // ================= SCROLL TO HASH =================
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location]);

  if (isRefreshing) return null;

  // ================= CLOSE MOBILE MENU =================
  const closeMobileMenu = () => {
    const navbar = document.getElementById("navbar_global");
    const toggler = document.querySelector(".navbar-toggler");

    if (navbar?.classList.contains("show") && toggler) {
      toggler.click();
    }
  };

  // ================= NAV CLICK =================
  const handleNavClick = (e, hash) => {
    e.preventDefault();

    if (location.pathname !== "/") {
      navigate("/" + hash);
    } else {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    closeMobileMenu();
  };

  // ================= LOGOUT =================
  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
      closeMobileMenu();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm py-2 custom-navbar">
      <div className="container">
        {/* LOGO */}
        <Link className="navbar-brand me-lg-5" to="/" onClick={closeMobileMenu}>
          <img src={logo} alt="ASTRONUMEROLOGY" style={{ height: 40 }} />
        </Link>

        {/* TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar_global"
          aria-controls="navbar_global"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbar_global">
          {/* LEFT MENU */}
          <ul className="navbar-nav align-items-lg-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={closeMobileMenu}>
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <a
                href="#about"
                className="nav-link"
                onClick={(e) => handleNavClick(e, "#about")}
              >
                About
              </a>
            </li>

            <li className="nav-item">
              <a
                href="#consultations"
                className="nav-link"
                onClick={(e) => handleNavClick(e, "#consultations")}
              >
                Consultations
              </a>
            </li>

            <li className="nav-item">
              <a
                href="#reviews"
                className="nav-link"
                onClick={(e) => handleNavClick(e, "#reviews")}
              >
                Reviews
              </a>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/blog" onClick={closeMobileMenu}>
                Blog
              </NavLink>
            </li>

            {/* DROPDOWN */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
              >
                Numerological calculations
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link
                    className="dropdown-item"
                    to="/numerology/pifagor"
                    onClick={closeMobileMenu}
                  >
                    Pythagoras square
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/numerology/compatibility"
                    onClick={closeMobileMenu}
                  >
                    Compatibility
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          {/* RIGHT MENU */}
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {!isLoggedIn && (
              <>
                <li className="nav-item me-2">
                  <Link
                    className="btn-login"
                    to="/login"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="btn-register"
                    to="/register"
                    onClick={closeMobileMenu}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}

            {isLoggedIn && (
              <>
                <li className="nav-item me-3">
                  <Link
                    to="/profile"
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    {user?.name ? `Hello, ${user.name}` : "Hello"}
                  </Link>
                </li>

                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn p-0 border-0 bg-transparent logout-icon"
                    title="Logout"
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polyline
                        points="16 17 21 12 16 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <line
                        x1="21"
                        y1="12"
                        x2="9"
                        y2="12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}





