import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Home.scss';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <header className="home-nav">
        <Link to="/" className="home-logo">
          <span className="logo-icon"><i className="fas fa-chart-pie"></i></span>
          <span>DataFlow</span>
        </Link>
        <nav className="home-nav-links">
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="home-auth-btns">
          <button className="btn-outline" onClick={() => navigate('/login')}>Login</button>
          <button className="btn-primary" onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-bg">
          <div className="hero-glow"></div>
          <div className="hero-grid"></div>
        </div>
        <div className="hero-content">
          <span className="hero-badge">Real-Time Analytics Platform</span>
          <h1>Transform Your Data Into Actionable Insights</h1>
          <p>
            Monitor, analyze, and visualize your distributed systems with unprecedented clarity.
            Built for speed, scale, and real-time decision making.
          </p>
          <div className="hero-actions">
            <button className="btn-primary btn-lg" onClick={() => navigate('/register')}>
              Start Free Trial <i className="fas fa-arrow-right"></i>
            </button>
            <button className="btn-ghost btn-lg" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              <i className="fas fa-play"></i> Watch Demo
            </button>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="section-header">
          <h2>Why Choose DataFlow?</h2>
          <p>A platform built for speed, scale, and clarity in distributed environments</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-bolt"></i></div>
            <h3>Real-Time Monitoring</h3>
            <p>View data updates and system status instantly without latency</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-expand-arrows-alt"></i></div>
            <h3>Distributed Scale</h3>
            <p>Handle massive event streams and scale effortlessly across services</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-code"></i></div>
            <h3>Custom Events</h3>
            <p>Track page views, clicks, and define custom events for your app</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-database"></i></div>
            <h3>Historical Analysis</h3>
            <p>Access and analyze previous data for trends and long-term planning</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-plug"></i></div>
            <h3>Simple Integration</h3>
            <p>Get started quickly with easy-to-use snippets and testing tools</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-lightbulb"></i></div>
            <h3>Actionable Insights</h3>
            <p>Translate complex data into clear visualizations that drive decisions</p>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>Ready to revolutionize your data analytics? Our team is here to help.</p>
            <div className="contact-details">
              <p><i className="fas fa-envelope"></i> contact@dataflow-analytics.com</p>
              <p><i className="fas fa-phone-alt"></i> +1 (555) 123-4567</p>
            </div>
          </div>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email Address" required />
            <textarea placeholder="Your message..." rows={4} required></textarea>
            <button type="submit" className="btn-primary">Send Message</button>
          </form>
        </div>
      </section>

      <footer className="home-footer">
        <p>© 2025 DataFlow Analytics. All rights reserved.</p>
        <div>
          <Link to="/privacy">Privacy</Link>
          <span> · </span>
          <Link to="/terms">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
