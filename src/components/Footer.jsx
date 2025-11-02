import React, { useState } from 'react'
import { FaFacebook, FaLinkedin, FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa'
import './Footer.css'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [showCookieBanner, setShowCookieBanner] = useState(() => {
    // Check localStorage on initial render
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cookiesAccepted') !== 'true'
    }
    return true
  })

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      alert('Thank you for subscribing!')
      setEmail('')
    }
  }

  const handleAcceptCookies = () => {
    setShowCookieBanner(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookiesAccepted', 'true')
    }
  }

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>tubexdubai</h3>
            </div>

            <div className="footer-section">
              <h4>Connect With Us</h4>
              <div className="social-links">
                <a 
                  href="https://www.facebook.com/share/19gpDB1bvn/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <FaFacebook />
                </a>
                <a 
                  href="https://www.linkedin.com/company/tubex-dubai/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin />
                </a>
                <a 
                  href="https://x.com/dubaitubex?s=11" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <FaTwitter />
                </a>
                <a 
                  href="https://www.instagram.com/tubex_dubai?igsh=MXE4aG55M2t6a29l&utm_source=qr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a 
                  href="https://www.tiktok.com/@tubexdubai?_t=ZS-90ZdkGBIbcP&_r=1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                >
                  <FaTiktok />
                </a>
              </div>
            </div>

            <div className="footer-section">
              <h4>Subscribe</h4>
              <p>Sign up to hear from us about specials, sales, and events.</p>
              <form className="subscribe-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">Sign up</button>
              </form>
            </div>
          </div>

          <div className="footer-bottom">
            <p>Copyright © 2025 tubexdubai - All Rights Reserved.</p>
            <p className="powered-by">Powered by <span>tubexdubai</span></p>
          </div>
        </div>
      </footer>

      {showCookieBanner && (
        <div className="cookie-banner">
          <div className="cookie-content">
            <h4>This website uses cookies.</h4>
            <p>
              We use cookies to analyze website traffic and optimize your website experience. 
              By accepting our use of cookies, your data will be aggregated with all other user data.
            </p>
            <button onClick={handleAcceptCookies} className="cookie-accept-btn">
              Accept
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Footer