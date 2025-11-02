import React, { useEffect, useRef } from 'react'
import { FaUsers, FaProjectDiagram, FaAward, FaHandshake } from 'react-icons/fa'
import './Stats.css'

const Stats = () => {
  const statsRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate')
          }
        })
      },
      { threshold: 0.2 }
    )

    if (statsRef.current) {
      const statCards = statsRef.current.querySelectorAll('.stat-card')
      statCards.forEach((card) => observer.observe(card))
    }

    return () => observer.disconnect()
  }, [])

  const stats = [
    {
      icon: FaUsers,
      number: '500+',
      label: 'Projects Completed',
      suffix: '',
      description: 'Successful IT implementations'
    },
    {
      icon: FaProjectDiagram,
      number: '150+',
      label: 'Happy Clients',
      suffix: '',
      description: 'Trusted by businesses'
    },
    {
      icon: FaAward,
      number: '98%',
      label: 'Client Satisfaction',
      suffix: '',
      description: 'Outstanding service quality'
    },
    {
      icon: FaHandshake,
      number: '24/7',
      label: 'Support Available',
      suffix: '',
      description: 'Round the clock assistance'
    }
  ]

  return (
    <section className="stats" ref={statsRef} aria-label="Company statistics">
      <div className="stats-background">
        <div className="stats-gradient"></div>
        <div className="stats-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{ 
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}></div>
          ))}
        </div>
      </div>
      <div className="container">
        <div className="stats-header">
          <h2 className="stats-title">Numbers That Speak</h2>
          <p className="stats-subtitle">Our track record of excellence in IT solutions</p>
        </div>
        <div className="stats-grid">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="stat-card">
                <div className="stat-icon-wrapper">
                  <IconComponent className="stat-icon" aria-hidden="true" />
                  <div className="stat-icon-glow"></div>
                </div>
                <div className="stat-number-wrapper">
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-suffix">{stat.suffix}</span>
                </div>
                <h3 className="stat-label">{stat.label}</h3>
                <p className="stat-description">{stat.description}</p>
                <div className="stat-bar">
                  <div className="stat-bar-fill"></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Stats
