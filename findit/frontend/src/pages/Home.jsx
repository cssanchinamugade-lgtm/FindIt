import CTA from "../components/CTA";
import FAQ from "../components/FAQ";
import Testimonials from "../components/Testimonials";
import FoundPreview from "../components/FoundPreview";
import LostPreview from "../components/LostPreview";
import Statistics from "../components/Statistics";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div>

      {/* Hero Section */}
      <section className="hero-section">

        <div className="hero-container">

          <div className="hero-content">

            <span className="hero-badge">
              🔍 Lost & Found Community
            </span>

            <h1>
              Lost Something?
              <br />
              <span>
                Find It Faster
              </span>
            </h1>

            <p>
              FindIt helps people report lost items, discover found
              belongings, and reconnect with their valuable things
              quickly and safely.
            </p>

            <div className="hero-buttons">

              <Link 
                to="/report-lost"
                className="primary-btn"
              >
                Report Lost Item
              </Link>

              <Link 
                to="/search"
                className="secondary-btn"
              >
                Search Items
              </Link>

            </div>

            {/* Search Box */}

            <div className="search-box">

              <i className="bi bi-search"></i>

              <input
                type="text"
                placeholder="Search lost items..."
              />

              <button>
                Search
              </button>

            </div>

          </div>

          <div className="hero-image">

            <div className="image-card">

              <i className="bi bi-box-seam"></i>

              <h3>
                Lost & Found
              </h3>

              <p>
                Connecting people with their belongings.
              </p>

            </div>

          </div>

        </div>

      </section>
     
      <Features />
      <HowItWorks />
      <Statistics />
        <LostPreview />
        <FoundPreview />
        <Testimonials />
        <FAQ />
        <CTA />

    </div>
  );
}

export default Home;
