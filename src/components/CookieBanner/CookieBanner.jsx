import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./CookieBanner.module.css";
import { getCookie, setCookie } from "../../utils/cookies.js";

const CONSENT_COOKIE = "cookieConsent";
const CONSENT_DAYS = 180;

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent =
      getCookie(CONSENT_COOKIE) ||
      localStorage.getItem(CONSENT_COOKIE) ||
      "";

    const hasDecision = consent === "accepted" || consent === "declined";
    setVisible(!hasDecision);
  }, []);

  if (!visible) return null;

  const handleChoice = (value) => {
    setCookie(CONSENT_COOKIE, value, CONSENT_DAYS);
    localStorage.setItem(CONSENT_COOKIE, value);
    setVisible(false);
  };

  return (
    <div className={styles.banner}>
      <div className={styles.textBlock}>
        <h4 className={styles.title}>Cookies</h4>
        <p className={styles.text}>
          We use cookies to improve your experience. You can accept or decline
          non-essential cookies. Essential cookies are always used.
        </p>
        <Link to="/cookies" className={styles.link}>
          Learn more
        </Link>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.button} ${styles.secondary}`}
          onClick={() => handleChoice("declined")}
        >
          Decline
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.primary}`}
          onClick={() => handleChoice("accepted")}
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
