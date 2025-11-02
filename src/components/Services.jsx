import React from 'react'
import { 
  FaCode, 
  FaProjectDiagram, 
  FaCloud, 
  FaServer, 
  FaShieldAlt, 
  FaGraduationCap 
} from 'react-icons/fa'
import './Services.css'

const Services = () => {
  const services = [
    {
      icon: FaCode,
      title: 'Custom Software Development',
      description: 'Our Custom Software Development services provide tailored solutions for your business needs. We will work with you to identify your requirements and design and develop software that meets your specific needs.'
    },
    {
      icon: FaProjectDiagram,
      title: 'IT Project Management',
      description: 'Our IT Project Management services ensure the successful delivery of your technology projects. We will manage the project from start to finish, ensuring timelines and budgets are met while keeping you updated throughout the process.'
    },
    {
      icon: FaCloud,
      title: 'Cloud Migration',
      description: 'Our Cloud Migration services help your business transition to the cloud smoothly and efficiently. We will assess your current systems, design a migration plan, and implement the solution to ensure a seamless transition.'
    },
    {
      icon: FaServer,
      title: 'Virtualization Services',
      description: 'Our Virtualization Services provide a scalable and efficient solution for your business needs. We offer virtual infrastructure design, implementation, and management to help you maximize your IT investment.'
    },
    {
      icon: FaShieldAlt,
      title: 'Network Security',
      description: 'Our Network Security services provide comprehensive protection for your business against cyber threats. We offer firewall management, intrusion detection, and vulnerability testing to ensure your network is secure.'
    },
    {
      icon: FaGraduationCap,
      title: 'IT Training and Support',
      description: 'Our IT Training and Support services ensure your employees are trained and supported in the use of your technology. We offer group training sessions, one-on-one coaching, and ongoing support to help your business succeed.'
    }
  ]

  return (
    <section id="services" className="services" aria-labelledby="services-heading">
      <div className="container">
        <header className="section-header">
          <h2 id="services-heading" className="section-title">Innovative IT Solutions for Your Business</h2>
        </header>
        
        <div className="services-grid" role="list">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <article key={index} className="service-card" role="listitem">
                <div className="service-icon-wrapper" aria-hidden="true">
                  <IconComponent className="service-icon" />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Services