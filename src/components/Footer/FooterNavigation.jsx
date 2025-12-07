import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import css from "./FooterNavigation.module.css";
import { useSelector } from "react-redux";
import { selectIsLoggedIn, selectUserId } from "../../redux/auth/selectors.js";

function FooterNavigation() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userId = useSelector(selectUserId);

  // если залогинен → профиль, иначе → логин
  const accountPath = isLoggedIn && userId ? `/profile/${userId}` : "/login";

  return (
    <>
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
          <Link className={css.footerNavLink} to="/consultations">
            Consultations
          </Link>
        </li>

        <li className={css.footerNavItem}>
          <Link className={css.footerNavLink} to={accountPath}>
            Account
          </Link>
        </li>

        <li className={css.footerNavItem}>
          <Link className={css.footerNavLink} to="/cookies">
            Cookies Policy
          </Link>
        </li>

        <li className={css.footerNavItem}>
          <Link className={css.footerNavLink} to="/security">
            Privacy & Security
          </Link>
        </li>

      </ul>
    </>
  );
}

export default FooterNavigation;





