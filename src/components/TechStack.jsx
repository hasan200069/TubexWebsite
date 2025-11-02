import React from 'react'
import { 
  FaCloud, FaShieldAlt, FaDatabase, FaServer, 
  FaCode, FaNetworkWired, FaMobile, FaLock 
} from 'react-icons/fa'
import './TechStack.css'

const TechStack = () => {
  const technologies = [
    { icon: FaCloud, name: 'Cloud Platforms', category: 'Infrastructure' },
    { icon: FaCode, name: 'Custom Development', category: 'Software' },
    { icon: FaShieldAlt, name: 'Cybersecurity', category: 'Security' },
    { icon: FaDatabase, name: 'Database Management', category: 'Data' },
    { icon: FaServer, name: 'Server Solutions', category: 'Infrastructure' },
    { icon: FaNetworkWired, name: 'Networking', category: 'Infrastructure' },
    { icon: FaMobile, name: 'Mobile Solutions', category: 'Software' },
    { icon: FaLock, name: 'Data Encryption', category: 'Security' }
  ]

  return (
    <section className="tech-stack" aria-labelledby="tech-stack-heading">
      <div className="container">
        <header className="tech-stack-header">
          <h2 id="tech-stack-heading" className="tech-stack-title">Our Technology Expertise</h2>
          <p className="tech-stack-subtitle">Cutting-edge technologies powering innovative solutions</p>
        </header>

        <div className="tech-grid">
          {technologies.map((tech, index) => {
            const IconComponent = tech.icon
            return (
              <div key={index} className="tech-card">
                <div className="tech-card-background"></div>
                <div className="tech-icon-wrapper">
                  <IconComponent className="tech-icon" aria-hidden="true" />
                  <div className="tech-icon-ring"></div>
                </div>
                <h3 className="tech-name">{tech.name}</h3>
                <span className="tech-category">{tech.category}</span>
                <div className="tech-shine"></div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TechStack
