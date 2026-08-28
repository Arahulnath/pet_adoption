import React from "react";
import { Link } from "react-router-dom";
import { PawPrint, Search, HeartHandshake, ShieldCheck, Heart, Sparkles, CheckCircle2 } from "lucide-react";
import Button from "../../components/common/Button";
import heroDogImg from "../../assets/dog.jpg";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <section className="home__hero">
        <div className="container home__hero-container">
          <div className="home__hero-content">
            <span className="page-header__eyebrow">
              <Sparkles size={14} className="home__eyebrow-icon" /> Pawfinder · Pet Adoption System
            </span>
            <h1 className="home__hero-title">
              Every pet deserves a <span className="home__hero-title-highlight">second chance</span> at home.
            </h1>
            <p className="home__hero-desc">
              Browse pets available for adoption at our shelter, learn about their unique personalities, and
              submit an adoption request in minutes — no account required.
            </p>

            <div className="home__hero-badges">
              <span className="home__hero-badge">
                <CheckCircle2 size={15} /> 100% Rescue Care
              </span>
              <span className="home__hero-badge">
                <CheckCircle2 size={15} /> Vet-Checked &amp; Vaccinated
              </span>
              <span className="home__hero-badge">
                <CheckCircle2 size={15} /> Loving Forever Homes
              </span>
            </div>

            <div className="home__hero-actions">
              <Link to="/pets">
                <Button variant="accent" size="lg" icon={Search}>
                  Find a pet
                </Button>
              </Link>
              <Link to="/donate">
                <Button variant="secondary" size="lg" icon={HeartHandshake}>
                  Support the shelter
                </Button>
              </Link>
            </div>
          </div>

          <div className="home__hero-visual">
            <div className="home__hero-card">
              <img
                src={heroDogImg}
                alt="Happy golden puppies waiting for loving adoption"
                className="home__hero-img"
              />
              <div className="home__hero-floating-badge home__hero-floating-badge--top">
                <div className="home__floating-icon home__floating-icon--heart">
                  <Heart size={16} />
                </div>
                <div>
                  <strong>Ready for Adoption</strong>
                  <small>Meet Daisy &amp; Friends</small>
                </div>
              </div>
              <div className="home__hero-floating-badge home__hero-floating-badge--bottom">
                <div className="home__floating-icon home__floating-icon--paw">
                  <PawPrint size={16} />
                </div>
                <div>
                  <strong>250+ Happy Adoptions</strong>
                  <small>Find your faithful companion</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="home__section-header">
          <span className="page-header__eyebrow">Why Choose Pawfinder</span>
          <h2>A compassionate, simple adoption journey</h2>
          <p>We make it easy, transparent, and joyful to find, meet, and adopt your new best friend.</p>
        </div>

        <div className="home__features">
          <div className="home__feature">
            <div className="home__feature-icon">
              <PawPrint size={22} />
            </div>
            <h3>Browse &amp; filter</h3>
            <p>Search by name, breed, species, or age to find the right match for your home and lifestyle.</p>
          </div>
          <div className="home__feature">
            <div className="home__feature-icon">
              <HeartHandshake size={22} />
            </div>
            <h3>Simple requests</h3>
            <p>Submit an adoption request directly from a pet's profile — our team will follow up promptly.</p>
          </div>
          <div className="home__feature">
            <div className="home__feature-icon">
              <ShieldCheck size={22} />
            </div>
            <h3>Trusted process</h3>
            <p>Our shelter staff reviews every request carefully to ensure safety and the best match for all.</p>
          </div>
        </div>
      </section>

      {/* Adoption Call to Action Banner with background image */}
      <section className="home__cta-section">
        <div className="container">
          <div className="home__cta-banner">
            <div className="home__cta-content">
              <span className="home__cta-eyebrow">Make a Lifelong Friend</span>
              <h2>Ready to bring unconditional love home?</h2>
              <p>
                Our shelter is home to wonderful dogs, cats, and companions eager to meet you.
                Start browsing our currently available pets today!
              </p>
              <div className="home__cta-actions">
                <Link to="/pets">
                  <Button variant="accent" size="lg" icon={Search}>
                    Browse Available Pets
                  </Button>
                </Link>
                <Link to="/shelter">
                  <Button variant="secondary" size="lg">
                    Visit Our Shelter
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
