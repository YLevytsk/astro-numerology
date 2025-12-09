import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { selectIsLoggedIn } from "../redux/auth/selectors";
import { logoutThunk } from "../redux/auth/operations";

import logo from "../assets/oracle_logo_purple_text.svg";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);

  // Scroll to hash
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
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-2" style={{ zIndex: 1030 }}>
      <div className="container">

        {/* LOGO */}
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
              <a href="#about" className="nav-link" onClick={(e) => handleNavClick(e, "#about")}>About</a>
            </li>

            <li className="nav-item">
              <a href="#reviews" className="nav-link" onClick={(e) => handleNavClick(e, "#reviews")}>Reviews</a>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/blog">Blog</NavLink>
            </li>

            {/* NUMEROLOGY */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                Numerology
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item text-gray" to="/numerology/pifagor">
                    Pythagoras Square
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item text-gray" to="/numerology/compatibility">
                    Compatibility
                  </Link>
                </li>
              </ul>
            </li>

            {/* CONSULTATIONS */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                Personal Consultations
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/consultations/natal-chart">Natal Chart</Link></li>
                <li><Link className="dropdown-item" to="/consultations/love-forecast">Love Forecast</Link></li>
                <li><Link className="dropdown-item" to="/consultations/relocation">Relocation</Link></li>
                <li><Link className="dropdown-item" to="/consultations/life-purpose">Life Purpose</Link></li>
              </ul>
            </li>
          </ul>

          {/* RIGHT BLOCK */}
          <ul className="navbar-nav ms-auto align-items-lg-center">

            {/* Social Icons */}
            <li className="nav-item">
              <a className="nav-link nav-link-icon" href="https://www.facebook.com/" target="_blank">
                <i className="fa fa-facebook-square"></i>
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link nav-link-icon" href="https://www.instagram.com/" target="_blank">
                <i className="fa fa-instagram"></i>
              </a>
            </li>

            {/* AUTH BUTTONS */}
            {!isLoggedIn ? (
              <>
                <li className="nav-item me-2">
                  <Link className="btn-login" to="/login">Login</Link>
                </li>
                <li className="nav-item d-none d-lg-block">
                  <Link className="btn-register" to="/register"><span>Register</span></Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-2">
                  <Link className="btn-login" to="/account">My Account</Link>
                </li>
                <li className="nav-item">
                  <button className="btn-register" onClick={handleLogout}>
                    <span>Logout</span>
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





