import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Validate phone number in real-time
    if (e.target.name === 'phone') {
      const phoneValidation = validatePhoneNumber(e.target.value);
      if (e.target.value && !phoneValidation.valid) {
        setPhoneError(phoneValidation.message);
      } else {
        setPhoneError('');
      }
    }
  };

  const validatePhoneNumber = (phone) => {
    // Remove all spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, '');
    
    // Check if it contains only digits (and optionally + at start)
    if (!/^[\+]?\d+$/.test(cleaned)) {
      return { 
        valid: false, 
        message: 'Phone number should only contain digits' 
      };
    }
    
    // Check length
    const digitsOnly = cleaned.replace(/\+/g, '');
    
    if (digitsOnly.length < 10) {
      return { 
        valid: false, 
        message: 'Phone number must be at least 10 digits' 
      };
    }
    
    if (digitsOnly.length > 10) {
      return { 
        valid: false, 
        message: 'Phone number cannot exceed 10 digits' 
      };
    }
    
    return { valid: true, message: '' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Validate phone number
    const phoneValidation = validatePhoneNumber(formData.phone);
    if (!phoneValidation.valid) {
      setPhoneError(phoneValidation.message);
      toast.error(phoneValidation.message);
      return;
    }

    setLoading(true);

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);

    if (result.success) {
      toast.success('Registration successful!');
      navigate('/');
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="py-5" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #000000 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 70% 50%, rgba(0, 0, 0, 0.3) 0%, transparent 70%)',
        animation: 'pulseGlow 4s ease-in-out infinite'
      }}></div>
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="text-center mb-4 animate-fade-in">
              <div className="icon-box mx-auto mb-3" style={{ 
                width: '80px', 
                height: '80px',
                background: '#000000',
                border: '4px solid #fbbf24'
              }}>
                <i className="bi bi-person-plus-fill" style={{ fontSize: '2.5rem', color: '#fbbf24' }}></i>
              </div>
              <h1 className="fw-bold" style={{
                color: '#000000',
                textShadow: '0 0 20px rgba(251, 191, 36, 0.8), 2px 2px 4px rgba(255,255,255,0.3)'
              }}>Join Ayora Food</h1>
              <p style={{ color: '#1f2937', fontWeight: '600' }}>Create your account today</p>
            </div>
            <Card className="modern-card shadow-lg animate-fade-in" style={{ 
              animationDelay: '0.2s',
              border: '3px solid #000000'
            }}>
              <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number (e.g., 0771234567)"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    isInvalid={!!phoneError}
                    style={phoneError ? { borderColor: '#dc3545' } : {}}
                  />
                  {phoneError && (
                    <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {phoneError}
                    </Form.Control.Feedback>
                  )}
                  <Form.Text className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Enter a valid phone number (10 digits starting with 0)
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    placeholder="Enter your location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <div style={{ position: 'relative' }}>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter password (min 6 characters)"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      style={{ paddingRight: '40px' }}
                    />
                    <i
                      className={`bi bi-eye${showPassword ? '-slash' : ''}-fill`}
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: '#6c757d',
                        fontSize: '1.1rem'
                      }}
                    ></i>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <div style={{ position: 'relative' }}>
                    <Form.Control
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      style={{ paddingRight: '40px' }}
                    />
                    <i
                      className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}-fill`}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: '#6c757d',
                        fontSize: '1.1rem'
                      }}
                    ></i>
                  </div>
                </Form.Group>

                <Button
                  type="submit"
                  className="btn-modern w-100 mb-3"
                  disabled={loading}
                  style={{ 
                    fontSize: '1.1rem', 
                    padding: '0.75rem',
                    background: '#000000',
                    color: '#fbbf24',
                    border: '3px solid #fbbf24',
                    fontWeight: '700',
                    boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)'
                  }}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <div className="text-center">
                  <p className="mb-0 text-muted">
                    Already have an account?{' '}
                    <Link to="/login" style={{ 
                      color: '#1f2937', 
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}>
                      Login here
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default Register;
