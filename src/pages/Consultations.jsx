// src/pages/Consultations.jsx
import { Link } from "react-router-dom";
import "../assets/css/argon-design-system.css";
import "../assets/css/custom.css";

export default function Consultations() {
  return (
    <section className="consultations-section py-5 text-center">
      <div className="container">
        <h2 className="mb-4">Personal Consultations</h2>
        <p className="lead mb-5">
          Unlock the secrets of the stars and numbers. Choose the consultation
          that resonates with your journey.
        </p>

        <div className="row justify-content-center">
          <div className="col-md-5 mb-4">
            <div className="card shadow border-0 h-100">
              <div className="card-body">
                <h4 className="card-title">Natal Chart Reading</h4>
                <p className="card-text text-muted">
                  A deep dive into your astrological blueprint to understand your
                  strengths, challenges, and life lessons.
                </p>
                <Link
                  to="/consultations/natal-chart"
                  className="btn btn-primary"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-5 mb-4">
            <div className="card shadow border-0 h-100">
              <div className="card-body">
                <h4 className="card-title">Love Forecast</h4>
                <p className="card-text text-muted">
                  Discover future influences in love and relationships, guided by
                  planetary and numerological cycles.
                </p>
                <Link
                  to="/consultations/love-forecast"
                  className="btn btn-primary"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-5 mb-4">
            <div className="card shadow border-0 h-100">
              <div className="card-body">
                <h4 className="card-title">Relocation Forecast</h4>
                <p className="card-text text-muted">
                  See how moving to a new place may influence your destiny and
                  opportunities.
                </p>
                <Link to="/consultations/relocation" className="btn btn-primary">
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-5 mb-4">
            <div className="card shadow border-0 h-100">
              <div className="card-body">
                <h4 className="card-title">Life Purpose by Stars</h4>
                <p className="card-text text-muted">
                  Gain clarity about your mission and true calling through the
                  wisdom of astrology.
                </p>
                <Link to="/consultations/life-purpose" className="btn btn-primary">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

