import Container from "../../components/Container/Container";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import styles from "./PrivacySecurityPage.module.css";

const PrivacySecurityPage = () => {
  return (
    <section className={styles.page}>
      <Container>
        <SectionTitle title="Privacy & Security" />
        <div className={styles.card}>
          <p>
            We respect your privacy and protect your data. Below is a quick overview
            of what we store, why we need it, and how you stay in control.
          </p>

          <h3>What we collect</h3>
          <ul>
            <li>Account data: name, email, avatar, bio.</li>
            <li>Content data: articles you create, bookmarks, profile settings.</li>
            <li>Technical logs to keep the service secure and stable.</li>
          </ul>

          <h3>How we use data</h3>
          <ul>
            <li>Authentication and maintaining your session.</li>
            <li>Displaying content and personalization (e.g., bookmarks).</li>
            <li>Security: preventing abuse and protecting your account.</li>
          </ul>

          <h3>Your control and choices</h3>
          <ul>
            <li>You can sign out to remove active session tokens.</li>
            <li>You can edit or remove profile data (bio, avatar).</li>
            <li>Clearing cookies in your browser revokes stored sessions/consent.</li>
          </ul>

          <h3>Security practices</h3>
          <ul>
            <li>Tokens are sent over HTTPS and scoped with SameSite restrictions.</li>
            <li>API access is protected by token-based authorization.</li>
            <li>We don’t share your data with third parties without a legal basis.</li>
          </ul>

          <h3>Contact</h3>
          <p>
            Questions about privacy or security? Reach out via the support channel
            listed in the footer.
          </p>
        </div>
      </Container>
    </section>
  );
};

export default PrivacySecurityPage;
