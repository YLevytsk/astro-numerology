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

        <FooterNavigation />
      </div>
    </footer>
  );
};

export default Footer;


