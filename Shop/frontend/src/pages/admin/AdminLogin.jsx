import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const AdminLogin = () => {
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
      if (result.data.role === 'admin') {
        toast.success('Admin login successful!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Access denied. Admin credentials required.');
      }
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="py-5" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1f2937 0%, #000000 50%, #fbbf24 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 30%, rgba(251, 191, 36, 0.15) 0%, transparent 70%)',
        animation: 'pulseGlow 4s ease-in-out infinite'
      }}></div>
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div className="text-center mb-4 animate-fade-in">
              <div className="icon-box mx-auto mb-3" style={{ 
                width: '90px', 
                height: '90px',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                border: '4px solid #000000'
              }}>
                <i className="bi bi-shield-lock-fill" style={{ fontSize: '3rem', color: '#000000' }}></i>
              </div>
              <h1 className="fw-bold text-white" style={{
                textShadow: '0 0 30px rgba(251, 191, 36, 0.8), 2px 2px 4px rgba(0,0,0,0.8)'
              }}>Admin Portal</h1>
              <p className="text-warning" style={{ fontWeight: '600' }}>
                <i className="bi bi-lock-fill me-1"></i>
                Authorized Access Only
              </p>
            </div>
            <Card className="modern-card shadow-lg animate-fade-in" style={{ 
              animationDelay: '0.2s',
              border: '3px solid #fbbf24'
            }}>
              <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Admin Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <div style={{ position: 'relative' }}>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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

                <Button
                  type="submit"
                  className="btn-modern btn-gradient-primary w-100 mb-3"
                  disabled={loading}
                  style={{ fontSize: '1.1rem', padding: '0.75rem' }}
                >
                  <i className="bi bi-shield-check me-2"></i>
                  {loading ? 'Authenticating...' : 'Access Admin Panel'}
                </Button>

                <div className="text-center">
                  <Link to="/login" style={{ 
                    color: '#fbbf24', 
                    fontWeight: '700',
                    textDecoration: 'none'
                  }}>
                    <i className="bi bi-arrow-left me-1"></i>
                    Customer Login
                  </Link>
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

export default AdminLogin;
