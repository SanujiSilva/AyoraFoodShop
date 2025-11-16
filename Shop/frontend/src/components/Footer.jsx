import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-modern" style={{
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      color: '#fff',
      paddingTop: '3rem',
      paddingBottom: '1.5rem',
      marginTop: 'auto',
      borderTop: '4px solid #fbbf24',
      boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.3)'
    }}>
      <Container>
        <Row className="g-4 mb-4">
          <Col lg={4} md={6}>
            <div className="mb-3">
              <h4 className="fw-bold mb-3" style={{ 
                background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}>
                <i className="bi bi-shop me-2"></i>
                Ayora Foods
              </h4>
            </div>
            <p className="text-light mb-3" style={{ lineHeight: '1.8' }}>
              Your trusted partner for delicious, fresh meals delivered daily. 
              Quality ingredients, authentic flavors, exceptional service.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="social-link" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(251, 191, 36, 0.1)',
                border: '2px solid #fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fbbf24',
                transition: 'all 0.3s ease'
              }}>
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="social-link" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(251, 191, 36, 0.1)',
                border: '2px solid #fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fbbf24',
                transition: 'all 0.3s ease'
              }}>
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="social-link" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(251, 191, 36, 0.1)',
                border: '2px solid #fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fbbf24',
                transition: 'all 0.3s ease'
              }}>
                <i className="bi bi-twitter"></i>
              </a>
            </div>
          </Col>

          <Col lg={2} md={6}>
            <h5 className="fw-bold mb-3 text-warning">Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none d-flex align-items-center">
                  <i className="bi bi-chevron-right me-2 text-warning"></i>
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/daily-foods" className="text-light text-decoration-none d-flex align-items-center">
                  <i className="bi bi-chevron-right me-2 text-warning"></i>
                  Daily Menu
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/login" className="text-light text-decoration-none d-flex align-items-center">
                  <i className="bi bi-chevron-right me-2 text-warning"></i>
                  Login
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/register" className="text-light text-decoration-none d-flex align-items-center">
                  <i className="bi bi-chevron-right me-2 text-warning"></i>
                  Register
                </Link>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h5 className="fw-bold mb-3 text-warning">Contact Info</h5>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex align-items-start">
                <i className="bi bi-geo-alt-fill text-warning me-3 mt-1"></i>
                <div className="text-light">
                  <strong>Address:</strong><br/>
                  123 Main Street, Colombo, Sri Lanka
                </div>
              </li>
              <li className="mb-3 d-flex align-items-start">
                <i className="bi bi-telephone-fill text-warning me-3 mt-1"></i>
                <div className="text-light">
                  <strong>Phone:</strong><br/>
                  +94 123 456 789
                </div>
              </li>
              <li className="mb-3 d-flex align-items-start">
                <i className="bi bi-envelope-fill text-warning me-3 mt-1"></i>
                <div className="text-light">
                  <strong>Email:</strong><br/>
                  info@ayorafoods.com
                </div>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h5 className="fw-bold mb-3 text-warning">Opening Hours</h5>
            <ul className="list-unstyled text-light">
              <li className="mb-2 d-flex justify-content-between">
                <span>Monday - Friday:</span>
                <strong className="text-warning">8AM - 10PM</strong>
              </li>
              <li className="mb-2 d-flex justify-content-between">
                <span>Saturday:</span>
                <strong className="text-warning">9AM - 11PM</strong>
              </li>
              <li className="mb-2 d-flex justify-content-between">
                <span>Sunday:</span>
                <strong className="text-warning">10AM - 9PM</strong>
              </li>
            </ul>
          </Col>
        </Row>

        <hr style={{ borderColor: 'rgba(251, 191, 36, 0.2)', margin: '2rem 0 1.5rem' }} />

        <Row>
          <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
            <p className="mb-0 text-light">
              © {new Date().getFullYear()} <strong className="text-warning">Ayora Foods</strong>. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="mb-0">
              <a href="#" className="text-light text-decoration-none me-3 hover-link">Privacy Policy</a>
              <span className="text-warning">•</span>
              <a href="#" className="text-light text-decoration-none ms-3 hover-link">Terms of Service</a>
            </p>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .footer-links li a:hover {
          color: #fbbf24 !important;
          transform: translateX(5px);
          transition: all 0.3s ease;
        }
        .social-link:hover {
          background: #fbbf24 !important;
          color: #000 !important;
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(251, 191, 36, 0.4);
        }
        .hover-link:hover {
          color: #fbbf24 !important;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
