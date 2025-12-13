import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import logo from "../assets/oracle_logo_purple_text.svg";
import { selectIsLoggedIn, selectUser } from "../redux/auth/selectors";
import { logoutThunk } from "../redux/auth/operations";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);

  // Scroll to anchor after route change
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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

  const handleLogout = () => {
    dispatch(logoutThunk());
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-2"
      style={{ zIndex: 1030 }}
    >
      <div className="container">

        {/* LOGO */}
        <Link className="navbar-brand me-lg-5" to="/">
          <img src={logo} alt="ASTRONUMEROLOGY" style={{ height: 40 }} />
        </Link>

        {/* MOBILE MENU TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar_global"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* MENU */}
        <div className="collapse navbar-collapse" id="navbar_global">
          <ul className="navbar-nav align-items-lg-center">

            {/* Home */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
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
              <NavLink className="nav-link" to="/blog">Blog</NavLink>
            </li>
          </ul>

          {/* RIGHT MENU */}
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

            {/* ========== AUTH BLOCK ========== */}

            {/* If NOT logged in → show Login + Register */}
            {!isLoggedIn && (
              <>
                <li className="nav-item me-2">
                  <Link className="btn-login" to="/login">
                    Login
                  </Link>
                </li>

                <li className="nav-item d-none d-lg-block">
                  <Link className="btn-register" to="/register">
                    <span>Register</span>
                  </Link>
                </li>
              </>
            )}

            {/* If logged in → show My Cabinet + Logout */}
            {isLoggedIn && (
              <>
                <li className="nav-item me-2">
                  <Link className="btn btn-primary" to="/cabinet">
                    {user?.name ? `My Cabinet (${user.name})` : "My Cabinet"}
                  </Link>
                </li>

                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger"
                  >
                    Logout
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






