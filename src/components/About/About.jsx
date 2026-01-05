import { useEffect } from "react";
import FallingCircles from "../FallingCircles/FallingCircles.jsx";
import styles from "./About.module.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE || "https://harmoniq.disainnova.com"
).replace(/\/api\/?$/, "");
const BG_URL = `${API_BASE_URL}/uploads/ai-generated-8888074_1920.webp`;

export default function About() {
  useEffect(() => {
    const items = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-show");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="wrapper">
      <div
        className={`section section-hero starfield ${styles.aboutBg}`}
        id="about"
        style={{ backgroundImage: `url(${BG_URL})` }}
      >
        {/* BACKGROUND STARS */}
        <div className={styles.backgroundStars}>
          {Array.from({ length: 60 }).map((_, i) => {
            const delay = (Math.random() * 5).toFixed(2);
            const size = Math.random() * 5 + 5;
            const style = {
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${delay}s`,
              width: `${size}px`,
              height: `${size}px`,
            };
            return <span key={i} className={styles.bgStar} style={style} />;
          })}
        </div>

        <div className="container shape-container">
          {/* TITLE */}
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className={`${styles.titleCustom} mb-4`}>
                Welcome to Oracle
              </h1>
            </div>
          </div>

          {/* ONLY 4 CLEAR POINTS */}
          <div className="row">
            <div className="col-lg-6">
              <div className="magic-paragraph">
                <img src="/images/star.svg" alt="star" className="star" />
                <p className={`lead ${styles.textCustom}`}>
                  <strong>Pythagorean Square.</strong> Understand your character,
                  strengths, inner balance, and personal challenges through a
                  clear numerological matrix.
                </p>
              </div>

              <div className="magic-paragraph">
                <img src="/images/star.svg" alt="star" className="star" />
                <p className={`lead ${styles.textCustom}`}>
                  <strong>Compatibility.</strong> See how two people interact on
                  emotional and practical levels — for love, partnership, or
                  long-term connection.
                </p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="magic-paragraph">
                <img src="/images/star.svg" alt="star" className="star" />
                <p className={`lead ${styles.textCustom}`}>
                  <strong>Blog.</strong> Simple explanations, insights, and real
                  examples that help you understand numerology and apply it in
                  everyday life.
                </p>
              </div>

              <div className="magic-paragraph">
                <img src="/images/star.svg" alt="star" className="star" />
                <p className={`lead ${styles.textCustom}`}>
                  <strong>Personal Consultations.</strong> One-on-one guidance
                  where numerology is applied directly to your real questions
                  and situations.
                </p>
              </div>
            </div>
          </div>
        </div>

        <FallingCircles />
      </div>
    </div>
  );
}
