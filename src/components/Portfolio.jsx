import React, { useState } from 'react'
import { FaCloud, FaShieldAlt, FaMobile, FaDatabase, FaCode, FaRocket, FaCheckCircle, FaArrowRight, FaUsers, FaChartLine } from 'react-icons/fa'
import './Portfolio.css'

const Portfolio = () => {
  const [hoveredCard, setHoveredCard] = useState(null)

  const projects = [
    {
      id: 1,
      title: 'Enterprise Cloud Migration Platform',
      client: 'Dubai Financial Corporation',
      category: 'Cloud & Infrastructure',
      description: 'Migrated entire enterprise infrastructure to AWS cloud, achieving 45% cost reduction while improving performance by 300%. Zero-downtime migration with multi-region deployment serving millions of users.',
      image: '/1.png',
      tech: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CloudFormation'],
      results: [
        { metric: '45%', label: 'Cost Reduction' },
        { metric: '99.9%', label: 'Uptime' },
        { metric: '3x', label: 'Performance' }
      ],
      icon: FaCloud,
      color: 'primary',
      stat: 'Enterprise Scale'
    },
    {
      id: 2,
      title: 'Banking Security System',
      client: 'First Gulf Bank',
      category: 'Cybersecurity & Compliance',
      description: 'Developed comprehensive security infrastructure with advanced threat detection, encryption, and compliance monitoring. Protected over 2 million customer transactions daily with zero security breaches.',
      image: 'security-project',
      tech: ['Firewall', 'SIEM', 'Encryption', 'Penetration Testing', 'Compliance'],
      results: [
        { metric: 'Zero', label: 'Breaches' },
        { metric: '100%', label: 'Compliance' },
        { metric: '2M+', label: 'Transactions' }
      ],
      icon: FaShieldAlt,
      color: 'dark',
      stat: 'Banking Grade'
    },
    {
      id: 3,
      title: 'E-Commerce Mobile Platform',
      client: 'Dubai Retail Group',
      category: 'Mobile & Web Development',
      description: 'Built cutting-edge mobile and web platform handling 50,000+ daily active users. Features AI-powered recommendations, real-time inventory, and seamless payment integration driving 300% sales increase.',
      image: 'mobile-project',
      tech: ['React Native', 'Node.js', 'MongoDB', 'AI/ML', 'Stripe API'],
      results: [
        { metric: '50K+', label: 'Daily Users' },
        { metric: '4.8', label: 'App Rating' },
        { metric: '300%', label: 'Sales Growth' }
      ],
      icon: FaMobile,
      color: 'secondary',
      stat: 'Market Leader'
    },
    {
      id: 4,
      title: 'Big Data Analytics Platform',
      client: 'UAE Healthcare Authority',
      category: 'Data & Analytics',
      description: 'Created massive data analytics platform processing 10TB+ daily to provide real-time insights for healthcare decision-making. Enabled predictive analytics improving patient outcomes by 30%.',
      image: 'data-project',
      tech: ['Hadoop', 'Spark', 'Python', 'Tableau', 'Machine Learning'],
      results: [
        { metric: '10TB+', label: 'Daily Data' },
        { metric: 'Real-time', label: 'Insights' },
        { metric: '30%', label: 'Better Outcomes' }
      ],
      icon: FaDatabase,
      color: 'light',
      stat: 'Data Driven'
    },
    {
      id: 5,
      title: 'Custom ERP System',
      client: 'Al Maktoum Enterprises',
      category: 'Enterprise Software',
      description: 'Developed fully customized ERP system integrating all business operations from inventory to HR, finance, and customer relations. Streamlined operations across 15+ departments with 60% efficiency gain.',
      image: 'erp-project',
      tech: ['.NET', 'SQL Server', 'React', 'Microservices', 'API Gateway'],
      results: [
        { metric: '15+', label: 'Departments' },
        { metric: '60%', label: 'Efficiency' },
        { metric: 'Unified', label: 'Operations' }
      ],
      icon: FaCode,
      color: 'primary-alt',
      stat: 'Enterprise Wide'
    },
    {
      id: 6,
      title: 'IoT Smart City Solution',
      client: 'Dubai Smart City Initiative',
      category: 'IoT & Innovation',
      description: 'Implemented city-wide IoT network connecting 50,000+ sensors for traffic management, energy optimization, and environmental monitoring. Reduced energy consumption by 35% and improved traffic flow by 25%.',
      image: 'iot-project',
      tech: ['IoT Sensors', 'Edge Computing', '5G Network', 'Real-time Analytics', 'Cloud Platform'],
      results: [
        { metric: '50K+', label: 'Sensors' },
        { metric: '35%', label: 'Energy Saved' },
        { metric: '25%', label: 'Traffic Improved' }
      ],
      icon: FaRocket,
      color: 'darker',
      stat: 'Smart City'
    }
  ]

  return (
    <section id="portfolio" className="portfolio" aria-labelledby="portfolio-heading">
      <div className="portfolio-background">
        <div className="portfolio-pattern"></div>
      </div>
      
      <div className="container">
        <header className="portfolio-header">
          <div className="header-badge">
            <FaChartLine className="badge-icon" aria-hidden="true" />
            <span>Our Success Stories</span>
          </div>
          <h2 id="portfolio-heading" className="portfolio-title">
            <span className="title-line-1">Featured</span>
            <span className="title-line-2">Portfolio</span>
          </h2>
          <p className="portfolio-subtitle">
            Transforming businesses through innovative IT solutions and cutting-edge technology
          </p>
        </header>

        <div className="portfolio-grid">
          {projects.map((project, index) => {
            const IconComponent = project.icon
            const isHovered = hoveredCard === project.id
            
            return (
              <article 
                key={project.id} 
                className={`portfolio-card portfolio-card-${project.color}`}
                onMouseEnter={() => setHoveredCard(project.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="card-glow"></div>
                
                <div className="card-header">
                  {project.image && project.image.endsWith('.png') ? (
                    <>
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="card-header-image"
                      />
                      <div className="card-image-overlay"></div>
                    </>
                  ) : (
                    <>
                      <div className="header-background"></div>
                      <div className="header-pattern"></div>
                      <div className="card-icon-container">
                        <div className="icon-orb">
                          <IconComponent className="card-icon" aria-hidden="true" />
                          <div className="icon-pulse"></div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="card-category">
                    <span>{project.category}</span>
                  </div>
                  <div className="card-stat-badge">
                    <FaUsers className="stat-icon" aria-hidden="true" />
                    <span>{project.stat}</span>
                  </div>
                </div>
                
                <div className="card-content">
                  <h3 className="card-title">{project.title}</h3>
                  <div className="card-client-info">
                    <span className="client-label">Client</span>
                    <span className="client-name">{project.client}</span>
                  </div>
                  
                  <p className="card-description">{project.description}</p>
                  
                  <div className="card-metrics">
                    {project.results.map((result, resultIndex) => (
                      <div key={resultIndex} className="metric-box">
                        <div className="metric-value">{result.metric}</div>
                        <div className="metric-label">{result.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="card-tech-section">
                    <div className="tech-header">
                      <span className="tech-label">Technologies Used</span>
                    </div>
                    <div className="tech-tags">
                      {project.tech.map((tech, techIndex) => (
                        <span key={techIndex} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <button className="view-project-btn">
                    <span>View Full Case Study</span>
                    <FaArrowRight className="btn-icon" aria-hidden="true" />
                    <div className="btn-shine"></div>
                  </button>
                </div>

                {isHovered && (
                  <div className="card-overlay">
                    <div className="overlay-glow"></div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Portfolio