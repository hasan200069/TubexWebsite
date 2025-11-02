import React from 'react'
import { FaSearch, FaLightbulb, FaCode, FaRocket, FaCheckCircle } from 'react-icons/fa'
import './Process.css'

const Process = () => {
  const steps = [
    {
      icon: FaSearch,
      number: '01',
      title: 'Discovery & Analysis',
      description: 'We thoroughly analyze your business requirements, current systems, and objectives to create a comprehensive solution strategy.'
    },
    {
      icon: FaLightbulb,
      number: '02',
      title: 'Planning & Design',
      description: 'Our expert team designs a tailored solution architecture that aligns with your business goals and budget constraints.'
    },
    {
      icon: FaCode,
      number: '03',
      title: 'Development & Implementation',
      description: 'We execute the plan with precision, using cutting-edge technologies and best practices to ensure seamless implementation.'
    },
    {
      icon: FaRocket,
      number: '04',
      title: 'Testing & Launch',
      description: 'Rigorous testing and quality assurance ensure everything works perfectly before launching your solution to market.'
    },
    {
      icon: FaCheckCircle,
      number: '05',
      title: 'Support & Optimization',
      description: 'Ongoing support, monitoring, and optimization to ensure your IT systems continue to perform at peak efficiency.'
    }
  ]

  return (
    <section className="process" aria-labelledby="process-heading">
      <div className="container">
        <header className="process-header">
          <h2 id="process-heading" className="process-title">How We Work</h2>
          <p className="process-subtitle">A proven methodology that delivers exceptional results</p>
        </header>

        <div className="process-steps">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div key={index} className="process-step">
                <div className="step-connector"></div>
                <div className="step-content">
                  <div className="step-number">{step.number}</div>
                  <div className="step-icon-wrapper">
                    <IconComponent className="step-icon" aria-hidden="true" />
                    <div className="step-icon-glow"></div>
                  </div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Process
