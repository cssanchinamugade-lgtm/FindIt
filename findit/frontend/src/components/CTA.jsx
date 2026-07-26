import { Link } from "react-router-dom";
import "./CTA.css";

function CTA() {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-box">
          <h2>Lost Something Important?</h2>

          <p>
            Don't worry. FindIt helps you reconnect with your belongings
            quickly and safely.
          </p>

          <div className="cta-buttons">
            <Link to="/report-lost" className="cta-primary">
              Report Lost Item
            </Link>

            <Link to="/search" className="cta-secondary">
              Search Items
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;