import React from 'react'
import { FaBolt, FaShieldAlt, FaUsers, FaCode, FaCloud, FaLock, FaChartLine, FaRocket, FaServer, FaNetworkWired } from 'react-icons/fa'
import './Hero.css'

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="hero" aria-label="Hero section">
      <div className="hero-background" aria-hidden="true">
        <div className="hero-gradient"></div>
        <div className="hero-grid-pattern"></div>
        <div className="hero-tech-pattern"></div>
      </div>
      
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge" aria-label="Company badge">
              <span>Leading IT Solutions Provider</span>
            </div>
            <h1 className="hero-title">
              <span className="hero-title-main">Innovative IT Solutions</span>
              <span className="hero-title-sub">for Your Business</span>
            </h1>
            <p className="hero-description">
              Transform your business with cutting-edge technology solutions. 
              We provide comprehensive IT services including custom software development, 
              cloud migration, network security, and enterprise infrastructure management 
              that drive growth and operational excellence.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => scrollToSection('services')}
                aria-label="Explore our IT services"
              >
                <span>Explore Services</span>
                <FaRocket aria-hidden="true" />
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => scrollToSection('contact')}
                aria-label="Get in touch with tubexdubai"
              >
                <span>Get Started</span>
                <FaChartLine aria-hidden="true" />
              </button>
            </div>
            <div className="hero-stats" aria-label="Company statistics">
              <div className="hero-stat">
                <div className="stat-number" aria-label="500 plus projects completed">500+</div>
                <div className="stat-label">Projects Completed</div>
              </div>
              <div className="hero-stat">
                <div className="stat-number" aria-label="98 percent client satisfaction">98%</div>
                <div className="stat-label">Client Satisfaction</div>
              </div>
              <div className="hero-stat">
                <div className="stat-number" aria-label="24/7 support">24/7</div>
                <div className="stat-label">Support</div>
              </div>
            </div>
            <div className="hero-features" aria-label="Key features">
              <div className="hero-feature">
                <div className="feature-icon-wrapper" aria-hidden="true">
                  <FaBolt />
                </div>
                <span>Fast Implementation</span>
              </div>
              <div className="hero-feature">
                <div className="feature-icon-wrapper" aria-hidden="true">
                  <FaShieldAlt />
                </div>
                <span>Enterprise Security</span>
              </div>
              <div className="hero-feature">
                <div className="feature-icon-wrapper" aria-hidden="true">
                  <FaUsers />
                </div>
                <span>Expert Team</span>
              </div>
            </div>
          </div>
          
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-main-card">
              <div className="card-inner-glow"></div>
              <div className="card-content">
                <div className="tech-icon-large">
                  <FaServer />
                </div>
                <div className="data-particles">
                  <div className="particle particle-1"></div>
                  <div className="particle particle-2"></div>
                  <div className="particle particle-3"></div>
                  <div className="particle particle-4"></div>
                </div>
              </div>
            </div>
            
            <div className="floating-tech-elements">
              <div className="tech-element tech-1">
                <FaCloud />
                <span>Cloud</span>
              </div>
              <div className="tech-element tech-2">
                <FaLock />
                <span>Security</span>
              </div>
              <div className="tech-element tech-3">
                <FaNetworkWired />
                <span>Network</span>
              </div>
              <div className="tech-element tech-4">
                <FaCode />
                <span>Development</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hero-scroll-indicator" aria-hidden="true">
        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>
        <span>Scroll to explore</span>
      </div>
    </section>
  )
}

export default Hero