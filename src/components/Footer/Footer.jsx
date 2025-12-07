import { NavLink } from "react-router-dom";
import FooterNavigation from "./FooterNavigation.jsx";
import logo from "../../assets/Legacies.png";
import css from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={css.footerSection}>
      <div className={css.footerContainer}>
        
        {/* Лого */}
        <NavLink to="/" className={css.logoLink}>
          <img
            src={logo}
            alt="ASTRONUMEROLOGY"
            className={css.logo}
          />
        </NavLink>

        {/* Навигация */}
        <FooterNavigation />

        {/* Соцсети */}
        <div className={css.socials}>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <i className="fa fa-instagram"></i>
          </a>

          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <i className="fa fa-facebook-square"></i>
          </a>

          <a
            href="https://t.me/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
          >
            <i className="fa fa-telegram"></i>
          </a>

          <a
            href="mailto:example@mail.com"
            aria-label="Email"
          >
            <i className="fa fa-envelope"></i>
          </a>
        </div>

        {/* Копирайт — ВАРИАНТ 3 */}
        <div className={css.copy}>
          © {new Date().getFullYear()} Astronumerology. Designed &amp; developed by <span className={css.author}>YourName</span>.
        </div>

      </div>
    </footer>
  );
};

export default Footer;



