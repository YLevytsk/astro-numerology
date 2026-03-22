import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useSelector } from "react-redux";
import css from "./FooterNavigation.module.css";
import logo from "../../assets/oracle_logo.svg";
import { selectIsLoggedIn, selectUserId } from "../../redux/auth/selectors.js";

function FooterNavigation() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userId = useSelector(selectUserId);
  const accountPath = isLoggedIn && userId ? "/profile" : "/login";

  return (
    <div className={css.footerNavWrap}>
      <Link className={css.logoNavLink} to="/">
        <img src={logo} alt="Astronumerology" className={css.logoImg} />
      </Link>

      <ul className={css.footerNav}>
        <li className={css.footerNavItem}>
          <HashLink className={css.footerNavLink} smooth to="/#top">
            Home
          </HashLink>
        </li>
        <li className={css.footerNavItem}>
          <HashLink className={css.footerNavLink} smooth to="/#about">
            About
          </HashLink>
        </li>
        <li className={css.footerNavItem}>
          <HashLink className={css.footerNavLink} smooth to="/#reviews">
            Reviews
          </HashLink>
        </li>
        <li className={css.footerNavItem}>
          <Link className={css.footerNavLink} to="/blog">
            Blog
          </Link>
        </li>
        <li className={css.footerNavItem}>
          <Link className={css.footerNavLink} to="/numerology/pifagor">
            Numerology
          </Link>
        </li>
        <li className={css.footerNavItem}>
          <HashLink className={css.footerNavLink} smooth to="/#consultations">
            Consultations
          </HashLink>
        </li>
        <li className={css.footerNavItem}>
          <Link className={css.footerNavLink} to={accountPath}>
            Account
          </Link>
        </li>
        <li className={css.footerNavItem}>
          <Link className={css.footerNavLink} to="/cookies">
            Cookies
          </Link>
        </li>
      </ul>

      <div className={css.privacyItem}>
        <Link className={css.footerNavLink} to="/security">
          Privacy &amp; Security
        </Link>
      </div>
    </div>
  );
}

export default FooterNavigation;
