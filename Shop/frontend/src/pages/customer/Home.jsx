import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axios';

const Home = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data } = await axios.get('/notices/active');
      setNotices(data);
    } catch (error) {
      console.error('Failed to load notices:', error);
    }
  };

  return (
    <div className="home-page">
      {/* Notices Section */}
      {notices.length > 0 && (
        <Container className="pt-4">
          {notices.map((notice, index) => (
            <Alert 
              key={notice._id} 
              variant={notice.type} 
              className="modern-card animate-fade-in mb-3"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Alert.Heading className="h5 fw-bold">
                <i className="bi bi-megaphone me-2"></i>
                {notice.title}
              </Alert.Heading>
              <p className="mb-0">{notice.message}</p>
            </Alert>
          ))}
        </Container>
      )}

      {/* Hero Section */}
      <div className="hero-gradient py-5">
        <Container className="py-5">
          <Row className="align-items-center">
            <Col lg={6} className="text-center text-lg-start animate-fade-in">
              <div className="mb-2">
                <span className="badge" style={{ 
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#000000',
                  fontSize: '0.9rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '50px',
                  fontWeight: '700',
                  boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)',
                  animation: 'badgePulse 2s ease-in-out infinite'
                }}>
                  🔥 Hot Deals Today
                </span>
              </div>
              <h1 className="display-3 fw-bold mb-3 text-white" style={{ 
                textShadow: '0 0 30px rgba(251, 191, 36, 0.5), 2px 2px 4px rgba(0,0,0,0.5)',
                letterSpacing: '-1px'
              }}>
                Welcome to <span style={{ 
                  background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'textShine 3s linear infinite'
                }}>Ayora Foods</span>
              </h1>
              <p className="lead mb-4 text-white fs-4" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                ✨ Delicious daily meals delivered fresh to your doorstep. Order now and enjoy authentic flavors!
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start flex-wrap">
                <Link to="/daily-foods">
                  <Button className="btn-modern btn-gradient-primary" size="lg" style={{ fontSize: '1.1rem' }}>
                    <i className="bi bi-calendar-event me-2"></i>
                    View Today's Menu
                  </Button>
                </Link>
                {!user && (
                  <Link to="/register">
                    <Button className="btn-modern" size="lg" style={{ 
                      background: '#000000', 
                      color: '#fbbf24', 
                      border: '3px solid #fbbf24', 
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)'
                    }}>
                      <i className="bi bi-person-plus me-2"></i>
                      Sign Up Free
                    </Button>
                  </Link>
                )}
              </div>
            </Col>
            <Col lg={6} className="mt-4 mt-lg-0 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="hero-image-wrapper" style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  borderRadius: '24px',
                  filter: 'blur(20px)',
                  opacity: '0.6',
                  animation: 'float 3s ease-in-out infinite'
                }}></div>
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop"
                  alt="Delicious food"
                  className="img-fluid rounded-2xl shadow-lg"
                  style={{ 
                    maxHeight: '400px', 
                    objectFit: 'cover', 
                    border: '5px solid #fbbf24',
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: '0 0 40px rgba(251, 191, 36, 0.6), 0 20px 40px rgba(0,0,0,0.4)'
                  }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5 my-5">
        <h2 className="text-center mb-2 fw-bold display-5">Why Choose Ayora Foods?</h2>
        <p className="text-center text-muted mb-5 lead">Experience the best in daily meal delivery</p>
        <Row className="g-4">
          <Col md={4}>
            <div className="modern-card h-100 text-center p-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="icon-box mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', border: '3px solid #000000' }}>
                <i className="bi bi-clock-history" style={{ fontSize: '2.5rem', color: '#000000' }}></i>
              </div>
              <h4 className="fw-bold mb-3">Fresh Daily</h4>
              <p className="text-muted">
                New menu every day with fresh ingredients and authentic recipes
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="modern-card h-100 text-center p-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="icon-box mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', border: '3px solid #fbbf24' }}>
                <i className="bi bi-cart-check" style={{ fontSize: '2.5rem', color: '#fbbf24' }}></i>
              </div>
              <h4 className="fw-bold mb-3">Easy Ordering</h4>
              <p className="text-muted">
                Simple and quick ordering process with instant order confirmation
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="modern-card h-100 text-center p-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="icon-box mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', border: '3px solid #000000' }}>
                <i className="bi bi-truck" style={{ fontSize: '2.5rem', color: '#000000' }}></i>
              </div>
              <h4 className="fw-bold mb-3">Fast Delivery</h4>
              <p className="text-muted">
                Quick delivery to multiple locations across the city
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* CTA Section */}
      <div className="cta-gradient py-5">
        <Container className="py-4">
          <Row className="justify-content-center text-center">
            <Col lg={8} className="animate-fade-in">
              <div className="icon-box mx-auto mb-4" style={{ width: '80px', height: '80px', background: '#000000', border: '3px solid #fbbf24', backdropFilter: 'blur(10px)' }}>
                <i className="bi bi-bag-check" style={{ fontSize: '2.5rem', color: '#fbbf24' }}></i>
              </div>
              <h2 className="mb-3 fw-bold text-white display-5">Ready to Order?</h2>
              <p className="lead mb-4 text-white-50">
                Browse our daily menu and place your order in just a few clicks
              </p>
              <Link to="/daily-foods">
                <Button className="btn-modern btn-lg px-5 py-3 shadow-lg" style={{ background: '#000000', color: '#fbbf24', border: '3px solid #fbbf24', fontWeight: '700' }}>
                  <i className="bi bi-cart-plus me-2"></i>
                  Order Now
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;
