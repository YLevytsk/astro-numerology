import FooterNavigation from "./FooterNavigation.jsx";
import css from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={css.footerSection}>
      <div className={css.footerContainer}>
        <FooterNavigation />

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

        <div className={css.copy}>
          © {new Date().getFullYear()} Astronumerology. Designed &amp; developed by{" "}
          <span className={css.author}>YLevytska</span>.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
