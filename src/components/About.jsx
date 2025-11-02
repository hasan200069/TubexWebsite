import React from 'react'
import { FaBook, FaTools, FaUsers } from 'react-icons/fa'
import './About.css'

const About = () => {
  return (
    <section id="about" className="about" aria-labelledby="about-heading">
      <div className="container">
        <header className="section-header">
          <h1 id="about-heading" className="main-title">About tubexdubai</h1>
        </header>
        
        <div className="about-content">
          <article className="about-card">
            <div className="card-icon-wrapper" aria-hidden="true">
              <FaBook className="card-icon" />
            </div>
            <h2>Our Story</h2>
            <p>
              At tubexdubai, we started as a small team of IT enthusiasts who wanted to help 
              small businesses overcome their technology challenges. Today, we have grown into 
              a leading provider of IT services in Dubai.
            </p>
          </article>

          <article className="about-card">
            <div className="card-icon-wrapper" aria-hidden="true">
              <FaTools className="card-icon" />
            </div>
            <h2>Our Services</h2>
            <p>
              We offer a comprehensive range of IT services, including network management, 
              cloud computing, cybersecurity, and more. Our services are designed to help 
              small businesses thrive in today's digital world.
            </p>
          </article>

          <article className="about-card">
            <div className="card-icon-wrapper" aria-hidden="true">
              <FaUsers className="card-icon" />
            </div>
            <h2>Our Team</h2>
            <p>
              Our team of IT professionals is dedicated to providing exceptional service and 
              support to our clients. We have the expertise and experience to solve even the 
              most complex technology challenges.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}

export default About