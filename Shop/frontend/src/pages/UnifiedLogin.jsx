import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const UnifiedLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      const userRole = result.data.role;
      
      toast.success(`Welcome back!`);
      
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div
      className="py-5"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #1f2937 50%, #fbbf24 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(251, 191, 36, 0.2) 0%, transparent 70%)',
          animation: 'pulseGlow 4s ease-in-out infinite',
        }}
      ></div>
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div className="text-center mb-4 animate-fade-in">
              <div
                className="icon-box mx-auto mb-3"
                style={{
                  width: '90px',
                  height: '90px',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  border: '4px solid #000000',
                }}
              >
                <i
                  className="bi bi-box-arrow-in-right"
                  style={{ fontSize: '3rem', color: '#000000' }}
                ></i>
              </div>
              <h1
                className="fw-bold text-white"
                style={{
                  textShadow: '0 0 30px rgba(251, 191, 36, 0.8), 2px 2px 4px rgba(0,0,0,0.8)',
                }}
              >
                Login
              </h1>
              <p className="text-white-50">Welcome to Ayora Food</p>
            </div>

            <Card
              className="modern-card shadow-lg animate-fade-in"
              style={{
                animationDelay: '0.2s',
                border: '3px solid #fbbf24',
                overflow: 'visible',
              }}
            >
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: 'bold' }}>
                      <i className="bi bi-envelope-fill me-2" style={{ color: '#fbbf24' }}></i>
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        border: '2px solid #fbbf24',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: 'bold' }}>
                      <i className="bi bi-key-fill me-2" style={{ color: '#fbbf24' }}></i>
                      Password
                    </Form.Label>
                    <div style={{ position: 'relative' }}>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                          border: '2px solid #fbbf24',
                          borderRadius: '8px',
                          padding: '12px',
                          paddingRight: '45px',
                        }}
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
                          color: '#6b7280',
                          fontSize: '1.1rem',
                          zIndex: 10,
                        }}
                      ></i>
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="btn-modern btn-gradient-primary w-100 mb-3"
                    disabled={loading}
                    style={{
                      fontSize: '1.1rem',
                      padding: '0.75rem',
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      color: '#000',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(251, 191, 36, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>

                  <div className="text-center">
                    <p className="mb-0 text-muted">
                      Don't have an account?{' '}
                      <Link
                        to="/register"
                        style={{
                          color: '#fbbf24',
                          fontWeight: '700',
                          textDecoration: 'none',
                        }}
                      >
                        Register here
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Animations */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes animate-fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: animate-fade-in 0.5s ease-out forwards;
        }

        .icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .icon-box:hover {
          transform: rotate(360deg) scale(1.1);
        }

        .modern-card {
          border-radius: 12px;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.98);
        }
      `}</style>
    </div>
  );
};

export default UnifiedLogin;
