import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import axios from '../../utils/axios';
import FoodCard from '../../components/FoodCard';

const DailyFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const { data } = await axios.get('/foods/daily');
      setFoods(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load foods');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3 text-muted fw-medium">Loading today's menu...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="modern-card">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-header text-center py-5 mb-4" style={{
        background: 'linear-gradient(135deg, #fefce8 0%, #ffffff 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 70%)',
          animation: 'pulseGlow 4s ease-in-out infinite'
        }}></div>
        <Container style={{ position: 'relative', zIndex: 1 }}>
          <div className="icon-box mx-auto mb-3" style={{ 
            width: '90px', 
            height: '90px', 
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', 
            border: '4px solid #000000',
            boxShadow: '0 0 40px rgba(251, 191, 36, 0.8), 0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <i className="bi bi-calendar-event" style={{ fontSize: '3rem', color: '#000000' }}></i>
          </div>
          <h1 className="display-4 fw-bold mb-3" style={{
            background: 'linear-gradient(90deg, #000000, #1f2937, #fbbf24, #1f2937, #000000)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'textShine 5s linear infinite'
          }}>
            Today's Special Menu
          </h1>
          <p className="lead text-muted mb-0">
            <i className="bi bi-star-fill text-warning me-2"></i>
            Fresh, delicious meals prepared daily just for you
            <i className="bi bi-star-fill text-warning ms-2"></i>
          </p>
        </Container>
      </div>

      <Container className="pb-5">
        {foods.length === 0 ? (
          <div className="empty-state text-center py-5">
            <div className="icon-box mx-auto mb-4" style={{ width: '100px', height: '100px', background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', border: '3px solid #fbbf24' }}>
              <i className="bi bi-emoji-frown" style={{ fontSize: '3rem', color: '#fbbf24' }}></i>
            </div>
            <h3 className="empty-state-title">No Food Items Available</h3>
            <p className="empty-state-text">Check back later for today's delicious offerings!</p>
          </div>
        ) : (
          <Row className="g-4">
            {foods.map((food, index) => (
              <Col key={food._id} xs={12} sm={6} md={4} lg={3}>
                <div className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <FoodCard food={food} />
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default DailyFoods;
