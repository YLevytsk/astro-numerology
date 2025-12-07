import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link"; // ✅ для плавного скролу
import css from "./FooterNavigation.module.css";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/auth/selectors.js";
import { useToggle } from "../../hooks/useToggle.js";
import AuthModal from "../ModalErrorSave/ModalErrorSave.jsx";

function FooterNavigation() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { isOpen, open, close } = useToggle();

  const handleAccountClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      open();
    }
  };

  return (
    <>
      <ul className={css.footerNav}>
<HashLink className={css.footerNavLink} smooth to="/#top">
  Home
</HashLink>



        {/* About → плавний скрол */}
        <li className={css.footerNavItem}>
          <HashLink className={css.footerNavLink} smooth to="/#about">
            About
          </HashLink>
        </li>

        {/* Reviews → плавний скрол */}
        <li className={css.footerNavItem}>
          <HashLink className={css.footerNavLink} smooth to="/#reviews">
            Reviews
          </HashLink>
        </li>

        <li className={css.footerNavItem}>
          <Link className={css.footerNavLink} to="/blog">Blog</Link>
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
          <Link
            className={css.footerNavLink}
            to="/profile"
            onClick={handleAccountClick}
          >
            Account
          </Link>
        </li>
      </ul>
      {isOpen && <AuthModal onClose={close} />}
    </>
  );
}

export default FooterNavigation;


