import { useEffect } from "react";
import FallingCircles from "../FallingCircles/FallingCircles.jsx";
import "./About.module.css";

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
      <div className="section section-hero about-bg starfield" id="about">
        <div className="background-stars">
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
            return <span key={i} className="bg-star" style={style} />;
          })}
        </div>

        <div className="container shape-container">
          <div
            className="row align-items-center justify-content-center"
            style={{ minHeight: "100px" }}
          >
            <div className="col-lg-8 text-center">
              <div className="title-wrapper">
                <h1 className="title-custom mb-0">Welcome to Oracle</h1>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6">
              <div className="magic-paragraph">
                <img src="/images/star.svg" alt="star" className="star" />
                <p className="lead text-custom">
                  The world of astrology is deep, mysterious, and gloriously
                  inexhaustible. Here at <strong>Oracle</strong>, we don’t claim
                  omniscience—we simply listen when the stars whisper and
                  translate when numbers start joking.
                </p>
              </div>

              <div className="magic-paragraph">
                <img src="/images/star.svg" alt="star" className="star" />
                <p className="lead text-custom">
                  Expect insights that feel oddly personal, forecasts that flirt
                  with destiny, and readings that treat fate with a pinch of
                  cosmic irony. If the universe has a sense of humor, we’re on
                  speaking terms.
                </p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="magic-paragraph">
                <img src="/images/star.svg" alt="star" className="star" />
                <p className="lead text-custom">
                  Explore Pythagorean patterns, discover compatibility by birth
                  date, and tap into consultations crafted to illuminate love,
                  relocation, and your life’s purpose among the constellations.
                </p>
              </div>

              <div className="magic-paragraph">
                <img src="/images/star.svg" alt="star" className="star" />
                <p className="lead text-custom">
                  Step in. Take what resonates. Leave what doesn’t. And if the
                  cosmos winks at you—wink back. It’s polite.
                </p>
              </div>
            </div>
          </div>

          <div className="row justify-content-center mt-0">
            <div className="col-lg-6 text-center">
              <a
                href="/consultations"
                className="btn btn-lg btn-oracle btn-round"
              >
                Ask the Oracle
              </a>
            </div>
          </div>
        </div>

        <FallingCircles />
      </div>
    </div>
  );
}

