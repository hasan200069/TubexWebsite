import React, { useState } from 'react'
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa'
import './FAQ.css'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'What IT services does tubexdubai offer?',
      answer: 'We offer comprehensive IT services including custom software development, cloud migration, network security, IT infrastructure management, virtualization services, IT project management, and training & support. Our services are tailored to meet the unique needs of businesses in Dubai and across the UAE.'
    },
    {
      question: 'How long does a typical IT project take?',
      answer: 'Project timelines vary based on complexity and scope. A simple software implementation might take 2-4 weeks, while comprehensive infrastructure overhauls could take 3-6 months. We provide detailed timelines during the planning phase and keep you updated throughout the project.'
    },
    {
      question: 'Do you provide 24/7 support?',
      answer: 'Yes! We offer 24/7 IT support to ensure your systems are always running smoothly. Our dedicated support team is available around the clock to handle any issues, perform maintenance, and provide assistance whenever you need it.'
    },
    {
      question: 'Can you help with cloud migration?',
      answer: 'Absolutely! Cloud migration is one of our core specialties. We help businesses transition to the cloud seamlessly, whether you\'re moving to AWS, Azure, Google Cloud, or a hybrid solution. We handle everything from assessment and planning to implementation and optimization.'
    },
    {
      question: 'What makes tubexdubai different from other IT companies?',
      answer: 'We combine deep technical expertise with exceptional customer service. With 500+ completed projects, 98% client satisfaction rate, and a team of certified professionals, we deliver innovative solutions that drive real business value. Our local presence in Dubai means we understand the regional market needs.'
    },
    {
      question: 'Do you work with small businesses?',
      answer: 'Yes! We work with businesses of all sizes, from startups to large enterprises. Our solutions are scalable and designed to fit your budget and requirements. We believe every business, regardless of size, deserves access to world-class IT solutions.'
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="faq" aria-labelledby="faq-heading">
      <div className="container">
        <header className="faq-header">
          <div className="faq-icon-wrapper">
            <FaQuestionCircle className="faq-icon" aria-hidden="true" />
          </div>
          <h2 id="faq-heading" className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">Get answers to common questions about our IT services</p>
        </header>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="question-text">{faq.question}</span>
                <FaChevronDown className="chevron-icon" aria-hidden="true" />
              </button>
              <div
                id={`faq-answer-${index}`}
                className="faq-answer"
                aria-hidden={openIndex !== index}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
