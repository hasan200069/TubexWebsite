import React, { useState, useEffect } from 'react'
import logo from '../../Logo (1) (1).png'
import './Header.css'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`} role="banner">
      <div className="container">
        <div className="header-content">
          <div className="logo-container">
            <img 
              src={logo} 
              alt="tubexdubai - Leading IT Solutions Provider in Dubai" 
              className="logo"
              width="50"
              height="50"
              loading="eager"
            />
            <span className="logo-text" aria-label="tubexdubai">tubexdubai</span>
          </div>
          <nav className={`nav ${isMobileMenuOpen ? 'open' : ''}`} role="navigation" aria-label="Main navigation">
            <a 
              href="#about" 
              onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
              aria-label="About tubexdubai"
            >
              About
            </a>
            <a 
              href="#services" 
              onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
              aria-label="Our IT Services"
            >
              Services
            </a>
            <a 
              href="#contact" 
              onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
              aria-label="Contact Us"
            >
              Contact
            </a>
          </nav>
          <button 
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      <div className="header-glow"></div>
    </header>
  )
}

export default Header