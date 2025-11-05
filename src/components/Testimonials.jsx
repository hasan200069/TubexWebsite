import React, { useState } from 'react'
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import './Testimonials.css'

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: 'Michael Thompson',
      role: 'CEO, Tech Innovations Inc',
      content: 'tubexdubai transformed our IT infrastructure completely. Their cloud migration services were seamless, and the team was professional throughout. Highly recommended!',
      rating: 5,
      image: '👨‍💼'
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO, Digital Solutions Group',
      content: 'Outstanding custom software development services. They understood our requirements perfectly and delivered a solution that exceeded our expectations. Great team!',
      rating: 5,
      image: '👩‍💼'
    },
    {
      name: 'David Martinez',
      role: 'IT Director, Enterprise Systems',
      content: 'The network security implementation by tubexdubai has significantly improved our cybersecurity posture. Professional, timely, and cost-effective services.',
      rating: 5,
      image: '👨‍💻'
    },
    {
      name: 'Emily Davis',
      role: 'Operations Manager, Business Pro',
      content: 'Excellent IT support and training services. Our team quickly adapted to the new systems thanks to their comprehensive training programs. 24/7 support is a game-changer.',
      rating: 5,
      image: '👩‍💻'
    }
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const current = testimonials[currentIndex]

  return (
    <section className="testimonials" aria-label="Client testimonials">
      <div className="container">
        <div className="testimonials-header">
          <h2 className="testimonials-title">What Our Clients Say</h2>
          <p className="testimonials-subtitle">Trusted by leading businesses nationwide</p>
        </div>

        <div className="testimonials-carousel">
          <button 
            className="carousel-btn carousel-btn-prev"
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
          >
            <FaChevronLeft />
          </button>

          <div className="testimonial-card">
            <div className="testimonial-quote-icon">
              <FaQuoteLeft aria-hidden="true" />
            </div>
            <div className="testimonial-content">
              <p className="testimonial-text">"{current.content}"</p>
              <div className="testimonial-rating">
                {[...Array(current.rating)].map((_, i) => (
                  <FaStar key={i} className="star-icon" aria-hidden="true" />
                ))}
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">{current.image}</div>
                <div className="author-info">
                  <h3 className="author-name">{current.name}</h3>
                  <p className="author-role">{current.role}</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            className="carousel-btn carousel-btn-next"
            onClick={nextTestimonial}
            aria-label="Next testimonial"
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="testimonials-indicators">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
