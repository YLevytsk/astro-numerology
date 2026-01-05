import Container from "../../components/Container/Container";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import styles from "./CookiesPage.module.css";

const CookiesPage = () => {
  return (
    <section className={styles.page}>
      <Container>
        <SectionTitle title="Cookies & Privacy" />
        <div className={styles.card}>
          <p>
            We use essential cookies to keep the site running (security,
            authentication, preferences). With your consent we may use additional
            cookies to improve performance and analyze usage.
          </p>
          <h3>What we store</h3>
          <ul>
            <li>Session/auth tokens to keep you signed in.</li>
            <li>Preferences such as language or cookie consent state.</li>
            <li>Optional analytics (only if you accept).</li>
          </ul>
          <h3>Managing cookies</h3>
          <ul>
            <li>
              You can accept or decline non-essential cookies in the banner at
              the bottom of the page.
            </li>
            <li>
              You can clear cookies any time in your browser settings to revoke
              consent.
            </li>
          </ul>
          <h3>Contact</h3>
          <p>
            If you have questions about our cookie or privacy practices, please
            contact us via the support channel listed in the footer.
          </p>
        </div>
      </Container>
    </section>
  );
};

export default CookiesPage;
