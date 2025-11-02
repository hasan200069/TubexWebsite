import React, { useState } from 'react'
import './Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    files: []
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setFormData(prev => ({
      ...prev,
      files: files
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Create email subject and body
    const subject = encodeURIComponent(`Contact Form Submission from ${formData.name}`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n\n` +
      `Message:\n${formData.message}`
    )
    
    // Create mailto link
    const mailtoLink = `mailto:info@tubexdubai.com?subject=${subject}&body=${body}`
    
    // Open email client
    window.location.href = mailtoLink
    
    // Show success message
    alert('Thank you for your message! Your email client will open to send the message to info@tubexdubai.com')
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      message: '',
      files: []
    })
  }

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-subtitle">Drop us a line!</p>
        </div>

        <div className="contact-content">
          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="files">Attach Files</label>
                <input
                  type="file"
                  id="files"
                  name="files"
                  onChange={handleFileChange}
                  multiple
                  className="file-input"
                />
                <div className="file-count">
                  Attachments ({formData.files.length})
                </div>
              </div>

              <button type="submit" className="submit-btn">Send</button>
              
              <p className="recaptcha-notice">
                This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
              </p>
            </form>
          </div>

          <div className="contact-info">
            <h3>Better yet, see us in person!</h3>
            <p>We love our customers, so feel free to visit during normal business hours.</p>
            
            <div className="info-item">
              <div className="info-label">Address</div>
              <div className="info-value">
                Office No 15-17-19, M floor<br />
                Al Manazel Building - Al Garhoud<br />
                Dubai UAE
              </div>
            </div>

            <div className="info-item">
              <div className="info-label">Email</div>
              <div className="info-value">
                <a href="mailto:info@tubexdubai.com">info@tubexdubai.com</a>
              </div>
            </div>

            <div className="info-item">
              <div className="info-label">Phone</div>
              <div className="info-value">
                <a href="tel:+97143976100">+971 4 397 6100</a>
              </div>
            </div>

            <div className="info-item">
              <div className="info-label">Hours</div>
              <div className="info-value hours">
                <div className="hours-row">
                  <span>Mon</span>
                  <span>09:00 am – 05:00 pm</span>
                </div>
                <div className="hours-row">
                  <span>Tue</span>
                  <span>09:00 am – 05:00 pm</span>
                </div>
                <div className="hours-row">
                  <span>Wed</span>
                  <span>09:00 am – 05:00 pm</span>
                </div>
                <div className="hours-row">
                  <span>Thu</span>
                  <span>09:00 am – 05:00 pm</span>
                </div>
                <div className="hours-row">
                  <span>Fri</span>
                  <span>09:00 am – 05:00 pm</span>
                </div>
                <div className="hours-row">
                  <span>Sat</span>
                  <span>Closed</span>
                </div>
                <div className="hours-row">
                  <span>Sun</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
